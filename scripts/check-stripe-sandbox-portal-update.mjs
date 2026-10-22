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

const email = "info@ithembakuluntu.org";
const origin = "https://ithemba-donations-staging.super-tooth-55f1.workers.dev";
const login = "https://billing.stripe.com/p/login/test_28EcN70MMeBD64G5MMfUQ00";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let stage = "startup";
async function main() {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  const connection = parseSandboxConnection(process.env.STRIPE_SANDBOX_CONNECTION);
  const cloudflare = parseStagingConnection(process.env.CLOUDFLARE_D1_STAGING);
  for (const key of [connection.restrictedKey, connection.publishableKey, cloudflare.apiToken])
    console.log(`::add-mask::${key}`);
  await checkSandbox();
  async function stripe(path, params) {
    // The only direct write permitted is short-lived Portal session creation.
    if (params) assert.equal(path, "billing_portal/sessions");
    const response = await fetch(`https://api.stripe.com/v1/${path}`, {
      method: params ? "POST" : "GET",
      redirect: "error",
      headers: {
        Authorization: `Bearer ${connection.restrictedKey}`,
        "Stripe-Version": SANDBOX_API_VERSION,
        ...(params ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      },
      ...(params ? { body: params } : {}),
      signal: AbortSignal.timeout(15000),
    });
    console.log(
      `SANDBOX_PORTAL_UPDATE_HTTP: ${path.split("/")[0].split("?")[0]}; ${response.status}`,
    );
    assert.ok(response.ok);
    return response.json();
  }
  async function list(path) {
    const data = [];
    let cursor;
    for (let attempt = 0; attempt < 100; attempt++) {
      const value = await stripe(
        path +
          (path.includes("?") ? "&" : "?") +
          "limit=100" +
          (cursor ? `&starting_after=${encodeURIComponent(cursor)}` : ""),
      );
      assert.ok(Array.isArray(value.data) && typeof value.has_more === "boolean");
      for (const item of value.data) {
        assert.equal(item.livemode, false);
        data.push(item);
      }
      if (!value.has_more) return data;
      const next = value.data.at(-1)?.id;
      assert.ok(typeof next === "string" && next !== cursor);
      cursor = next;
    }
    throw new Error("Incomplete list");
  }
  stage = "verify_paid_info_subscription";
  const customers = await list(`customers?email=${encodeURIComponent(email)}`);
  const candidates = [];
  for (const customer of customers) {
    assert.equal(customer.email?.toLowerCase(), email);
    for (const session of await list(`checkout/sessions?customer=${customer.id}`)) {
      if (
        session.mode !== "subscription" ||
        session.status !== "complete" ||
        session.payment_status !== "paid"
      )
        continue;
      assert.equal(session.customer, customer.id);
      const subId =
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      assert.ok(/^sub_[A-Za-z0-9]+$/.test(subId));
      const subscription = await stripe(`subscriptions/${subId}`);
      assert.equal(subscription.livemode, false);
      assert.equal(subscription.customer, customer.id);
      if (subscription.status === "active" && subscription.cancel_at_period_end === false)
        candidates.push({ customer, session, subscription });
    }
  }
  assert.equal(
    candidates.length,
    1,
    "Expected one unambiguous active paid monthly donation for the requested inbox",
  );
  const { customer, session, subscription } = candidates[0];
  assert.equal(session.currency, "eur");
  assert.ok(subscription.items?.data?.length > 0);
  for (const item of subscription.items.data) {
    assert.equal(item.price?.currency, "eur");
    assert.equal(item.price?.recurring?.interval, "month");
    assert.equal(item.price?.recurring?.interval_count, 1);
  }
  const reference = session.metadata?.donation_id;
  assert.ok(/^[a-f0-9-]{36}$/i.test(reference));
  assert.equal(subscription.metadata?.donation_id, reference);
  const db = `https://api.cloudflare.com/client/v4/accounts/${cloudflare.accountId}/d1/database/990e1489-72e6-4a2b-b2f6-dbb4863e4971`;
  async function database(query) {
    const r = await fetch(db + (query ? "/query" : ""), {
      method: query ? "POST" : "GET",
      redirect: "error",
      headers: {
        Authorization: `Bearer ${cloudflare.apiToken}`,
        ...(query ? { "Content-Type": "application/json" } : {}),
      },
      ...(query ? { body: JSON.stringify(query) } : {}),
      signal: AbortSignal.timeout(30000),
    });
    assert.ok(r.ok);
    const body = await r.json();
    assert.equal(body.success, true);
    return body.result;
  }
  assertDatabaseTarget(await database());
  const row = (
    await database({
      sql: "SELECT session_id, customer_id, frequency, status FROM donations WHERE id = ?",
      params: [reference],
    })
  )?.[0]?.results?.[0];
  assert.equal(row?.session_id, session.id);
  assert.equal(row?.customer_id, customer.id);
  assert.equal(row?.frequency, "monthly");
  assert.equal(row?.status, "succeeded");
  const events = await database({
    sql: "SELECT COUNT(*) AS count FROM donation_events WHERE donation_id = ? AND type = 'checkout.session.completed'",
    params: [reference],
  });
  assert.ok(events?.[0]?.results?.[0]?.count >= 1);
  console.log(
    "SANDBOX_INFO_SUBSCRIPTION_VERIFIED: active, paid, EUR monthly donation for requested inbox matches staging ledger and registered signed completion event.",
  );
  const configs = (await list("billing_portal/configurations?active=true")).filter(usablePortal);
  const config =
    configs.find((value) => value.is_default) ?? (configs.length === 1 ? configs[0] : null);
  assert.ok(config);
  assert.equal(config.login_page.url, login);
  stage = "create_owned_test_portal_session";
  const portal = await stripe(
    "billing_portal/sessions",
    new URLSearchParams({
      customer: customer.id,
      configuration: config.id,
      return_url: origin + "/donate",
    }),
  );
  assert.equal(new URL(portal.url).origin, "https://billing.stripe.com");
  const before = {
    customer: customer.invoice_settings?.default_payment_method ?? null,
    subscription: subscription.default_payment_method ?? null,
  };
  const { chromium } = await import(
    pathToFileURL(resolve(process.env.STRIPE_BROWSER_MODULE_DIR, "index.mjs")).href
  );
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([name]) => !/^(CLOUDFLARE_|STRIPE_SANDBOX_)/.test(name)),
  );
  const browser = await chromium.launch({ headless: true, env });
  try {
    const page = await browser.newPage({ locale: "en-US" });
    page.setDefaultTimeout(8000);
    await page.goto(portal.url, { waitUntil: "domcontentloaded" });
    await delay(3000);
    async function controls() {
      const result = [];
      for (const role of ["button", "link"])
        for (const control of await page.getByRole(role).all()) {
          if (!(await control.isVisible())) continue;
          const label = (await control.innerText()).trim().replace(/\s+/g, " ");
          if (label.length <= 70 && /^[A-Za-zÀ-ž €$'’—–().,\-:!?]+$/.test(label))
            result.push({ role, label, enabled: await control.isEnabled() });
        }
      console.log(`SANDBOX_PORTAL_UPDATE_CONTROLS: ${JSON.stringify(result.slice(0, 25))}`);
    }
    stage = "open_payment_method_editor";
    await controls();
    let opened = false;
    for (const role of ["link", "button"]) {
      const control = page
        .getByRole(role, {
          name: /^(Update payment method|Add payment method|Change payment method|Update)$/i,
        })
        .first();
      if (await control.isVisible()) {
        await control.click();
        opened = true;
        break;
      }
    }
    assert.ok(opened);
    async function secureField(selector) {
      for (let attempt = 0; attempt < 60; attempt++) {
        for (const frame of page.frames()) {
          try {
            const u = new URL(frame.url());
            if (u.protocol !== "https:" || !u.hostname.endsWith(".stripe.com")) continue;
            const input = frame.locator(selector).first();
            if (await input.isVisible()) return input;
          } catch {
            /* Stripe frames may detach while loading. */
          }
        }
        await delay(500);
      }
      throw new Error("Secure Stripe field unavailable");
    }
    stage = "fill_published_test_card_in_stripe_fields";
    await (
      await secureField(
        'input[name="cardNumber"], input[name="cardnumber"], input[autocomplete="cc-number"], input[name="number"]',
      )
    ).fill("5555555555554444");
    await (
      await secureField(
        'input[name="cardExpiry"], input[name="exp-date"], input[autocomplete="cc-exp"], input[name="expiry"]',
      )
    ).fill("1234");
    await (
      await secureField('input[name="cardCvc"], input[name="cvc"], input[autocomplete="cc-csc"]')
    ).fill("123");
    for (const frame of page.frames()) {
      try {
        const u = new URL(frame.url());
        if (u.protocol !== "https:" || !u.hostname.endsWith(".stripe.com")) continue;
        for (const [selector, value] of [
          [
            'input[autocomplete="cc-name"], input[autocomplete="name"], input[name="billingName"], input[name="name"], input[name="fullName"], input[name="billingDetails.name"]',
            "iThemba Sandbox Test",
          ],
          ['input[autocomplete="postal-code"], input[name="postalCode"]', "10115"],
        ]) {
          const input = frame.locator(selector).first();
          if ((await input.isVisible()) && (await input.inputValue()) === "")
            await input.fill(value);
        }
        // Link enrollment is optional and can require a phone number. This test
        // exercises an ordinary card replacement, without enrolling the donor.
        const linkOptIn = frame.locator('input[name="linkOptIn"]').first();
        if ((await linkOptIn.isVisible()) && (await linkOptIn.isChecked()))
          await linkOptIn.uncheck();
        const country = frame.locator('select[name="country"]').first();
        if (await country.isVisible()) await country.selectOption("DE");
        const postal = frame.locator('input[name="postalCode"]').first();
        if (await postal.isVisible()) await postal.fill("10115");
      } catch {
        /* Optional Stripe inputs may disappear. */
      }
    }
    stage = "save_test_payment_method";
    await controls();
    const fields = [];
    for (const frame of page.frames()) {
      try {
        const u = new URL(frame.url());
        if (u.protocol !== "https:" || !u.hostname.endsWith(".stripe.com")) continue;
        for (const input of await frame.locator("input,select").all()) {
          if (!(await input.isVisible())) continue;
          const name = await input.getAttribute("name");
          const autocomplete = await input.getAttribute("autocomplete");
          fields.push({
            name: /^[A-Za-z_.\[\]-]{0,60}$/.test(name ?? "") ? name : "omitted",
            autocomplete: /^[A-Za-z -]{0,60}$/.test(autocomplete ?? "") ? autocomplete : "omitted",
            type: await input.getAttribute("type"),
            empty: (await input.inputValue()) === "",
            required: (await input.getAttribute("required")) !== null,
            checked:
              (await input.getAttribute("type")) === "checkbox"
                ? await input.isChecked()
                : undefined,
            invalid: await input.getAttribute("aria-invalid"),
          });
        }
      } catch {
        /* Detached frame. */
      }
    }
    console.log(`SANDBOX_PORTAL_UPDATE_FIELDS: ${JSON.stringify(fields)}`);
    const checkbox = page.getByRole("checkbox", { name: /default/i }).first();
    if (await checkbox.isVisible()) await checkbox.check();
    const save = page
      .getByRole("button", { name: /^(Add|Update|Save)( payment method| card)?$/i })
      .last();
    assert.ok(await save.isVisible());
    for (let attempt = 0; attempt < 20 && !(await save.isEnabled()); attempt++) await delay(500);
    assert.ok(await save.isEnabled(), "Stripe form not complete");
    await save.click();
    stage = "verify_persisted_default_payment_method";
    let changed = false;
    for (let attempt = 0; attempt < 20; attempt++) {
      const c = await stripe(`customers/${customer.id}`);
      const sub = await stripe(`subscriptions/${subscription.id}`);
      assert.equal(c.livemode, false);
      assert.equal(c.email?.toLowerCase(), email);
      assert.equal(sub.livemode, false);
      assert.equal(sub.customer, c.id);
      assert.equal(sub.status, "active");
      assert.equal(sub.cancel_at_period_end, false);
      assert.equal(sub.metadata?.donation_id, reference);
      assert.deepEqual(sub.items, subscription.items);
      changed =
        (typeof c.invoice_settings?.default_payment_method === "string" &&
          c.invoice_settings.default_payment_method !== before.customer) ||
        (typeof sub.default_payment_method === "string" &&
          sub.default_payment_method !== before.subscription);
      if (changed) break;
      await delay(2000);
    }
    assert.ok(changed);
    console.log(
      "SANDBOX_PORTAL_PAYMENT_UPDATE_VERIFIED: Stripe-hosted published test-card replacement persisted as a default; monthly subscription remains active with unchanged donation, price and schedule. No real card or live configuration used.",
    );
    stage = "request_public_test_login_email";
    const loginContext = await browser.newContext({ locale: "en-US" });
    const loginPage = await loginContext.newPage();
    await loginPage.goto(login, { waitUntil: "domcontentloaded" });
    await loginPage.locator('input[type="email"]').fill(email);
    await loginPage.locator('button[type="submit"]').click();
    await delay(2000);
    assert.equal(new URL(loginPage.url()).origin, "https://billing.stripe.com");
    const body = await loginPage.locator("body").innerText();
    assert.ok(/check your email|sent.*email|email.*sent|check your inbox/i.test(body));
    console.log(
      "SANDBOX_PORTAL_LOGIN_EMAIL_REQUESTED: public test Portal accepted a login request for the existing association inbox. Delivery and authenticated email-link use require separate confirmation.",
    );
  } finally {
    await browser.close();
  }
}
main().catch(() => {
  console.error(
    `Sandbox Portal payment-update check stopped at ${stage}. Raw errors, donor records, credentials and bearer URLs omitted. Never infer success from a click.`,
  );
  process.exitCode = 1;
});
