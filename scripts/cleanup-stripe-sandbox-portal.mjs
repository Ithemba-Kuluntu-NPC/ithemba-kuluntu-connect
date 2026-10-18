import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertDatabaseTarget, parseStagingConnection } from "./migrate-donations-staging.mjs";
import {
  checkSandbox,
  parseSandboxConnection,
  SANDBOX_API_VERSION,
} from "./check-stripe-sandbox.mjs";
import { usablePortal } from "./check-stripe-sandbox-readiness.mjs";

// Only the synthetic monthly fixture created by the preceding browser test.
const reference = "8ea4baab-6a77-4311-82b6-350a12a2db11";
let stage = "startup";
async function main() {
  assert.ok(
    process.argv.length === 2 ||
      (process.argv.length === 3 && process.argv[2] === "--check-access"),
  );
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  const connection = parseSandboxConnection(process.env.STRIPE_SANDBOX_CONNECTION);
  const cloudflare = parseStagingConnection(process.env.CLOUDFLARE_D1_STAGING);
  for (const key of [connection.restrictedKey, connection.publishableKey, cloudflare.apiToken])
    console.log(`::add-mask::${key}`);
  await checkSandbox({ connectionValue: process.env.STRIPE_SANDBOX_CONNECTION });
  const dbUrl = `https://api.cloudflare.com/client/v4/accounts/${cloudflare.accountId}/d1/database/990e1489-72e6-4a2b-b2f6-dbb4863e4971`;
  async function database(query) {
    const response = await fetch(dbUrl + (query ? "/query" : ""), {
      method: query ? "POST" : "GET",
      redirect: "error",
      headers: {
        Authorization: `Bearer ${cloudflare.apiToken}`,
        ...(query ? { "Content-Type": "application/json" } : {}),
      },
      ...(query ? { body: JSON.stringify(query) } : {}),
      signal: AbortSignal.timeout(30000),
    });
    assert.ok(response.ok);
    const body = await response.json();
    assert.ok(body.success === true);
    return body.result;
  }
  assertDatabaseTarget(await database());
  const rows = await database({
    sql: "SELECT customer_id, session_id FROM donations WHERE id = ? AND frequency = 'monthly' LIMIT 1",
    params: [reference],
  });
  const row = rows?.[0]?.results?.[0];
  assert.ok(
    typeof row?.customer_id === "string" &&
      row.customer_id.startsWith("cus_") &&
      typeof row?.session_id === "string" &&
      row.session_id.startsWith("cs_test_"),
  );
  async function stripe(path, params) {
    const response = await fetch("https://api.stripe.com/v1/" + path, {
      method: params ? "POST" : "GET",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${connection.restrictedKey}`,
        "Stripe-Version": SANDBOX_API_VERSION,
        ...(params ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      },
      ...(params ? { body: params } : {}),
    });
    const category = path.startsWith("billing_portal/sessions")
      ? "PortalSessionCreate"
      : path.startsWith("subscriptions/")
        ? "SubscriptionRead"
        : path.startsWith("checkout/sessions/")
          ? "CheckoutRead"
          : "PortalConfigurationRead";
    console.log(`SANDBOX_PORTAL_API_HTTP: ${category}; ${response.status}`);
    if (!response.ok) {
      if (response.status === 403 && category === "PortalSessionCreate")
        console.log(
          "SANDBOX_PORTAL_PERMISSION_REQUIRED: Restricted test key needs Customer Portal Sessions Write. No subscription setting was changed.",
        );
      throw new Error("Controlled Stripe sandbox lookup failed");
    }
    return response.json();
  }
  stage = "verify_synthetic_monthly_fixture";
  const session = await stripe(`checkout/sessions/${row.session_id}?expand[]=subscription`);
  assert.ok(
    session.livemode === false &&
      session.mode === "subscription" &&
      session.customer === row.customer_id &&
      session.metadata?.donation_id === reference &&
      session.metadata?.donor_name === "TEST - automated Stripe sandbox browser check",
  );
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  assert.ok(typeof subscriptionId === "string" && subscriptionId.startsWith("sub_"));
  async function subscription() {
    const value = await stripe(`subscriptions/${subscriptionId}`);
    assert.ok(
      value.livemode === false &&
        value.customer === row.customer_id &&
        value.metadata?.donation_id === reference,
    );
    return value;
  }
  if ((await subscription()).cancel_at_period_end === true) {
    console.log(
      "SANDBOX_PORTAL_CLEANUP_VERIFIED: test subscription already scheduled to stop at period end.",
    );
    return;
  }
  const configurations = await stripe("billing_portal/configurations?active=true&limit=100");
  const eligible = configurations.data.filter(usablePortal);
  const config =
    eligible.find((value) => value.is_default) ?? (eligible.length === 1 ? eligible[0] : null);
  assert.ok(config && configurations.has_more === false);
  stage = "create_test_customer_portal_session";
  const portal = await stripe(
    "billing_portal/sessions",
    new URLSearchParams({
      customer: row.customer_id,
      configuration: config.id,
      return_url: "https://ithemba-donations-staging.super-tooth-55f1.workers.dev/donate",
    }),
  );
  const url = new URL(portal.url);
  assert.equal(url.origin, "https://billing.stripe.com");
  console.log(
    `SANDBOX_PORTAL_URL_SHAPE: ${url.pathname.startsWith("/p/session/") ? "legacy_session_path" : "new_stripe_path"}. Bearer URL omitted.`,
  );
  if (process.argv[2] === "--check-access") {
    console.log(
      "SANDBOX_PORTAL_ACCESS_VERIFIED: test session creation is permitted; no subscription settings changed.",
    );
    return;
  }
  const { chromium } = await import(
    pathToFileURL(resolve(process.env.STRIPE_BROWSER_MODULE_DIR, "index.mjs")).href
  );
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([name]) => !/^(CLOUDFLARE_|STRIPE_SANDBOX_)/.test(name)),
  );
  const browser = await chromium.launch({ headless: true, env });
  try {
    const page = await browser.newPage({ locale: "en-US" });
    stage = "open_sandbox_portal";
    await page.goto(portal.url, { waitUntil: "domcontentloaded" });
    stage = "schedule_test_subscription_cancellation";
    for (let attempt = 0; attempt < 8; attempt++) {
      if ((await subscription()).cancel_at_period_end === true) {
        console.log(
          "SANDBOX_PORTAL_CLEANUP_VERIFIED: Stripe-hosted Portal session created and test subscription cancellation confirmed at period end. No new payment or subscription created.",
        );
        return;
      }
      const other = page.getByRole("radio", { name: /Other/i }).first();
      if (await other.isVisible()) await other.check();
      const details = page.locator("textarea").first();
      if ((await details.isVisible()) && (await details.inputValue()) === "")
        await details.fill("Automated sandbox test cleanup");
      const action = page
        .getByRole("button", {
          name: /^(Cancel subscription|Cancel plan|Confirm cancellation|Continue)$/i,
        })
        .last();
      const link = page.getByRole("link", { name: /^(Cancel subscription|Cancel plan)$/i }).first();
      if (await action.isVisible()) await action.click();
      else if (await link.isVisible()) await link.click();
      else {
        const product = page
          .getByText("iThemba Kuluntu e.V. — Where needed most", { exact: false })
          .first();
        if (await product.isVisible()) await product.click();
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    throw new Error("Cancellation not confirmed");
  } finally {
    await browser.close();
  }
}
main().catch(() => {
  console.error(
    `Sandbox Portal check stopped at ${stage}. Raw errors, bearer URLs and credential values omitted.`,
  );
  console.log(`SANDBOX_TEST_SUBSCRIPTION_REFERENCE: ${reference}; cleanup remains unconfirmed.`);
  process.exitCode = 1;
});
