import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";
import { APPROVED_LIVE_LOGIN_SHA256 } from "./check-stripe-live-portal.mjs";
import { LIVE_DATABASE_ID, LIVE_DATABASE_NAME } from "./check-donations-live-database.mjs";

export const LIVE_ORIGIN = "https://ithembakuluntu.org";
export const VERIFICATION_MARKER =
  "Verify approved live unfunded Checkouts after webhook enablement";
let stage = "authorization";
export function assertLivePublicConfig(config) {
  assert.equal(config?.mode, "live");
  assert.match(config?.publishableKey ?? "", /^pk_live_[A-Za-z0-9]+$/);
  assert.equal(
    createHash("sha256")
      .update(config?.portalLoginUrl ?? "")
      .digest("hex"),
    APPROVED_LIVE_LOGIN_SHA256,
  );
}
export async function verifyLive() {
  assert.equal(process.argv.length, 2);
  assert.equal(process.env.GITHUB_ACTIONS, "true");
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  assert.equal(process.env.GITHUB_EVENT_NAME, "push");
  const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
  assert.equal(event.head_commit?.message, VERIFICATION_MARKER);
  assert.equal(process.env.LIVE_WEBHOOK_ENABLE_CONFIRMED, "true");
  const cloudflare = JSON.parse(process.env.CLOUDFLARE_D1_STAGING ?? "null");
  assert.ok(
    cloudflare &&
      /^[a-f0-9]{32}$/i.test(cloudflare.accountId ?? "") &&
      /^[A-Za-z0-9_.-]{20,}$/.test(cloudflare.apiToken ?? ""),
  );
  console.log(`::add-mask::${cloudflare.apiToken}`);
  const dbEndpoint = `https://api.cloudflare.com/client/v4/accounts/${cloudflare.accountId}/d1/database/${LIVE_DATABASE_ID}`;
  async function database(sql, params) {
    const response = await fetch(dbEndpoint + (sql ? "/query" : ""), {
      method: sql ? "POST" : "GET",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${cloudflare.apiToken}`,
        "Content-Type": "application/json",
      },
      ...(sql ? { body: JSON.stringify({ sql, params }) } : {}),
    });
    assert.ok(response.ok);
    const body = await response.json();
    assert.equal(body.success, true);
    return body.result;
  }
  const metadata = await database();
  assert.equal(metadata.uuid, LIVE_DATABASE_ID);
  assert.equal(metadata.name, LIVE_DATABASE_NAME);
  const { chromium } = await import(
    pathToFileURL(resolve(process.env.STRIPE_BROWSER_MODULE_DIR, "index.mjs")).href
  );
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => !/^(CLOUDFLARE_|STRIPE_|DONATION_)/.test(key)),
  );
  const browser = await chromium.launch({ headless: true, env });
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  try {
    for (const frequency of ["once", "monthly"]) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 1100 },
        locale: "en-US",
      });
      const page = await context.newPage();
      const browserDiagnostics = { errors: [], failedStripeRequests: [] };
      const classifyError = (message) =>
        [
          "publishable",
          "secret",
          "key",
          "mismatch",
          "account",
          "permission",
          "invalid",
          "expired",
          "domain",
          "blocked",
          "network",
          "integration",
          "disabled",
          "not enabled",
          "content security",
          "unsupported",
          "initializ",
          "failed",
          "load",
          "api",
          "400",
          "401",
          "403",
          "429",
        ].filter((term) => message.toLowerCase().includes(term));
      page.on("pageerror", (error) => browserDiagnostics.errors.push(classifyError(error.message)));
      page.on("console", (entry) => {
        if (entry.type() === "error") browserDiagnostics.errors.push(classifyError(entry.text()));
      });
      page.on("response", (response) => {
        try {
          const url = new URL(response.url());
          if (url.hostname.endsWith(".stripe.com") && response.status() >= 400)
            browserDiagnostics.failedStripeRequests.push({
              host: url.hostname,
              status: response.status(),
            });
        } catch {
          /* Only fixed diagnostic categories and hostnames are retained. */
        }
      });
      let reference;
      let expired = false;
      async function api(path, payload) {
        const response = payload
          ? await context.request.post(LIVE_ORIGIN + "/api/donations/" + path, {
              headers: { Origin: LIVE_ORIGIN },
              data: payload,
            })
          : await context.request.get(LIVE_ORIGIN + "/api/donations/" + path);
        assert.ok(response.ok(), "Live donation API did not pass verification");
        return response.json();
      }
      try {
        stage = `${frequency}:public_config`;
        assertLivePublicConfig(await api("config"));
        stage = `${frequency}:donation_form`;
        const response = await page.goto(LIVE_ORIGIN + "/donate", {
          waitUntil: "domcontentloaded",
        });
        assert.equal(response.status(), 200);
        try {
          await page
            .getByRole("button", { name: "Reject non-essential", exact: true })
            .click({ timeout: 5000 });
        } catch {
          /* Existing consent can hide this control. */
        }
        const form = page.locator("#donate-form form");
        await form.locator("#d-name").fill("Integration verification - no payment submitted");
        await form.locator("#d-email").fill("info@ithembakuluntu.org");
        await form.locator("#d-country").fill("DE");
        await form.getByRole("button", { name: "€10", exact: true }).click();
        await form
          .getByRole("button", { name: frequency === "once" ? "One-time" : "Monthly", exact: true })
          .click();
        stage = `${frequency}:unfunded_checkout_creation`;
        const creation = page.waitForResponse(
          (r) =>
            r.url() === LIVE_ORIGIN + "/api/donations/create" && r.request().method() === "POST",
        );
        await form.locator("button[type=submit]").click();
        const created = await creation;
        assert.equal(created.status(), 200);
        const payload = created.request().postDataJSON();
        const data = await created.json();
        reference = data.id;
        assert.match(reference ?? "", /^[a-f0-9-]{36}$/i);
        assert.ok(
          data.clientSecret?.startsWith("cs_live_") && data.clientSecret.includes("_secret_"),
        );
        stage = `${frequency}:live_embedded_key_pairing`;
        let secureCardField = false;
        for (let attempt = 0; attempt < 60 && !secureCardField; attempt++) {
          for (const frame of page.frames()) {
            let url;
            try {
              url = new URL(frame.url());
            } catch {
              continue;
            }
            // Read-only inspection also covers Stripe's official Checkout CDN renderer.
            if (url.protocol !== "https:" || !(url.hostname.endsWith(".stripe.com") || url.hostname === "b.stripecdn.com")) continue;
            try {
              if (
                await frame
                  .locator(
                    'input[name="cardNumber"],input[name="cardnumber"],input[autocomplete="cc-number"],input[name="number"]',
                  )
                  .first()
                  .isVisible()
              ) {
                secureCardField = true;
                break;
              }
              if (attempt === 5 || attempt === 20) {
                const card = frame.getByText(/^(Card|Cards|Credit card|Debit or credit card|Karte|Kartenzahlung|Kaart)$/i).first();
                if (await card.isVisible()) await card.click({ force: true, timeout: 3000 });
              }
            } catch {
              /* Stripe frames can detach during initialization. */
            }
          }
          if (!secureCardField) await pause(1000);
        }
        if (!secureCardField) {
          const frames = [];
          for (const frame of page.frames()) {
            try {
              const url = new URL(frame.url());
              if (!(url.hostname.endsWith(".stripe.com") || url.hostname === "b.stripecdn.com")) {
                frames.push({ host: url.hostname, stripeHosted: false });
                continue;
              }
              const body = await frame
                .locator("body")
                .innerText({ timeout: 1000 })
                .catch(() => "");
              frames.push({
                host: url.hostname,
                inputs: await frame.locator("input").count(),
                inputSchema: await frame.locator("input").evaluateAll((inputs) =>
                  inputs.map((input) => ({
                    type: input.type,
                    name: /^[a-zA-Z_-]{1,50}$/.test(input.name) ? input.name : "omitted",
                    autocomplete: /^[a-zA-Z_-]{1,50}$/.test(input.autocomplete) ? input.autocomplete : "omitted",
                    visible: Boolean(input.getClientRects().length),
                  })),
                ),
                cardInputs: await frame
                  .locator('input[autocomplete="cc-number"],input[name*="card" i]')
                  .count(),
                labels: [
                  "Card",
                  "Pay with card",
                  "Add a payment method",
                  "SEPA",
                  "Something went wrong",
                  "Unable",
                  "Error",
                  "Loading",
                ].filter((label) => body.includes(label)),
                errors: classifyError(body),
              });
            } catch {
              /* A detached frame contains no diagnostic evidence. */
            }
          }
          console.log(
            JSON.stringify({
              state: "live_checkout_render_diagnostics",
              frequency,
              frames,
              ...browserDiagnostics,
              siteAlertVisible: await page
                .getByRole("alert")
                .first()
                .isVisible()
                .catch(() => false),
            }),
          );
        }
        // Never fill a payment field, accept a mandate, or submit Stripe's payment form.
        stage = `${frequency}:idempotency_and_ownership`;
        const retry = await api("create", payload);
        assert.equal(retry.id, reference);
        assert.equal(retry.clientSecret, data.clientSecret);
        const state = await api(`status?id=${reference}`);
        assert.equal(state.status, "open");
        assert.equal(state.canManage, false);
        const other = await browser.newContext();
        const denied = await other.request.get(
          LIVE_ORIGIN + `/api/donations/status?id=${reference}`,
        );
        assert.ok([403, 404].includes(denied.status()));
        await other.close();
        stage = `${frequency}:expiration_and_genuine_webhook`;
        assert.equal((await api("cancel", { id: reference })).status, "cancelled");
        expired = true;
        assert.equal((await api(`status?id=${reference}`)).status, "cancelled");
        let delivered = false;
        for (let attempt = 0; attempt < 30; attempt++) {
          const rows = await database(
            "SELECT id FROM donation_events WHERE donation_id = ? AND type = 'checkout.session.expired' LIMIT 1;",
            [reference],
          );
          delivered =
            rows[0]?.success === true && /^evt_[A-Za-z0-9]+$/.test(rows[0]?.results?.[0]?.id ?? "");
          if (delivered) break;
          await pause(2000);
        }
        assert.ok(delivered, "Genuine signed live expiration event not recorded");
        console.log(
          JSON.stringify({
            state: secureCardField ? "live_unfunded_checkout_verified" : "live_signed_expiration_verified_render_incomplete",
            frequency,
            embeddedKeyPairingVerified: secureCardField,
            idempotencyVerified: true,
            ownershipVerified: true,
            expired: true,
            genuineSignedWebhookRecorded: true,
            fundedPaymentSubmitted: false,
            subscriptionConfirmed: false,
          }),
        );
        assert.ok(secureCardField, "Live Embedded Checkout did not initialize");
      } finally {
        if (reference && !expired) await api("cancel", { id: reference }).catch(() => {});
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  console.log(
    JSON.stringify({
      state: "live_donation_launch_checks_passed",
      readyForOwnerSmallCardTest: true,
      fundedPaymentSubmitted: false,
      merged: false,
    }),
  );
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  verifyLive().catch(() => {
    console.error(
      JSON.stringify({
        state: "live_verification_incomplete",
        stage,
        secretOrDonorValuesPrinted: false,
        fundedPaymentSubmitted: false,
      }),
    );
    process.exitCode = 1;
  });
}
