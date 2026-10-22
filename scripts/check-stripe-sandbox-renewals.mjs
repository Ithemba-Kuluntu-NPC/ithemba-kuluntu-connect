import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  checkSandbox,
  parseSandboxConnection,
  SANDBOX_API_VERSION,
} from "./check-stripe-sandbox.mjs";
import { usablePortal } from "./check-stripe-sandbox-readiness.mjs";
import { checkoutParameters, paymentStatus } from "../src/lib/donations.ts";

const origin = "https://ithemba-donations-staging.super-tooth-55f1.workers.dev";
const fixture = randomUUID();
let stage = "startup";
let clockId;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function main() {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  const connection = parseSandboxConnection(process.env.STRIPE_SANDBOX_CONNECTION);
  console.log(`::add-mask::${connection.restrictedKey}`);
  console.log(`::add-mask::${connection.publishableKey}`);
  await checkSandbox();
  async function stripe(path, params, method = params ? "POST" : "GET") {
    if (method === "POST")
      assert.ok(
        [
          "test_helpers/test_clocks",
          "customers",
          "checkout/sessions",
          "billing_portal/sessions",
        ].includes(path) ||
          (clockId && path === `test_helpers/test_clocks/${clockId}/advance`),
      );
    if (method === "DELETE") assert.equal(path, `test_helpers/test_clocks/${clockId}`);
    const response = await fetch(`https://api.stripe.com/v1/${path}`, {
      method,
      redirect: "error",
      signal: AbortSignal.timeout(30000),
      headers: {
        Authorization: `Bearer ${connection.restrictedKey}`,
        "Stripe-Version": SANDBOX_API_VERSION,
        ...(params
          ? {
              "Content-Type": "application/x-www-form-urlencoded",
              "Idempotency-Key": `sandbox-renewal-${fixture}-${randomUUID()}`,
            }
          : {}),
      },
      ...(params ? { body: params } : {}),
    });
    console.log(`SANDBOX_RENEWAL_HTTP: ${path.split("/")[0]}; ${method}; ${response.status}`);
    if (response.status === 403 && path === "test_helpers/test_clocks" && method === "POST")
      return null;
    assert.ok(response.ok());
    return response.json();
  }
  let browser;
  try {
    stage = "create_disposable_test_clock";
    const clock = await stripe(
      "test_helpers/test_clocks",
      new URLSearchParams({
        frozen_time: String(Math.floor(Date.now() / 1000)),
        name: `iThemba disposable renewal ${fixture}`,
      }),
    );
    if (!clock) {
      console.log(
        "SANDBOX_RENEWAL_BLOCKED: restricted test key cannot create Test Clocks. No customer or subscription created; no permission expanded. Accelerated renewal remains unverified.",
      );
      return;
    }
    assert.equal(clock.livemode, false);
    assert.ok(/^clock_[A-Za-z0-9]+$/.test(clock.id));
    clockId = clock.id;
    const customer = await stripe(
      "customers",
      new URLSearchParams({
        email: "info@ithembakuluntu.org",
        name: "TEST - iThemba disposable renewal",
        test_clock: clockId,
        "address[country]": "DE",
        "metadata[test_fixture_id]": fixture,
      }),
    );
    assert.equal(customer.livemode, false);
    assert.equal(customer.test_clock, clockId);
    const params = checkoutParameters(
      {
        requestId: fixture,
        amount: 100,
        frequency: "monthly",
        cause: "Where needed most",
        lang: "en",
        name: "TEST - iThemba disposable renewal",
        email: "info@ithembakuluntu.org",
        country: "DE",
        receiptRequested: false,
      },
      customer.id,
      origin,
      { paypal: false, paypalRecurring: false, bankTransfer: false },
    );
    // A disposable API-contract fixture, not a staging ledger donation. Prevent its
    // unrelated events from masquerading as an app donation awaiting persistence.
    params.delete("metadata[donation_id]");
    params.delete("subscription_data[metadata][donation_id]");
    params.set("metadata[test_fixture_id]", fixture);
    params.set("subscription_data[metadata][test_fixture_id]", fixture);
    params.set("ui_mode", "hosted");
    params.delete("return_url");
    params.delete("redirect_on_completion");
    params.set("success_url", origin + "/donate");
    params.set("cancel_url", origin + "/donate");
    const session = await stripe("checkout/sessions", params);
    assert.equal(session.livemode, false);
    assert.equal(new URL(session.url).origin, "https://checkout.stripe.com");
    const { chromium } = await import(
      pathToFileURL(resolve(process.env.STRIPE_BROWSER_MODULE_DIR, "index.mjs")).href
    );
    browser = await chromium.launch({
      headless: true,
      env: Object.fromEntries(
        Object.entries(process.env).filter(
          ([name]) => !/^(CLOUDFLARE_|STRIPE_SANDBOX_)/.test(name),
        ),
      ),
    });
    const page = await browser.newPage({ locale: "en-US" });
    function secure(frame) {
      try {
        const url = new URL(frame.url());
        return url.protocol === "https:" && url.hostname.endsWith(".stripe.com");
      } catch {
        return false;
      }
    }
    async function field(selector) {
      for (let attempt = 0; attempt < 80; attempt++) {
        for (const frame of page.frames()) {
          if (!secure(frame)) continue;
          const input = frame.locator(selector).first();
          if (await input.isVisible()) return input;
        }
        await delay(500);
      }
      throw new Error("Stripe field unavailable");
    }
    async function fillCard(number) {
      await (
        await field(
          'input[name="cardNumber"], input[name="cardnumber"], input[autocomplete="cc-number"], input[name="number"]',
        )
      ).fill(number);
      await (
        await field(
          'input[name="cardExpiry"], input[name="exp-date"], input[autocomplete="cc-exp"], input[name="expiry"]',
        )
      ).fill("1234");
      await (
        await field('input[name="cardCvc"], input[name="cvc"], input[autocomplete="cc-csc"]')
      ).fill("123");
      for (const frame of page.frames()) {
        if (!secure(frame)) continue;
        const country = frame
          .locator('select[name="country"], select[name="billingCountry"]')
          .first();
        if (await country.isVisible()) await country.selectOption("DE");
        for (const [selector, value] of [
          [
            'input[name="billingName"], input[name="name"], input[autocomplete="cc-name"]',
            "iThemba Sandbox Test",
          ],
          ['input[name="postalCode"], input[name="billingPostalCode"]', "10115"],
        ]) {
          const input = frame.locator(selector).first();
          if ((await input.isVisible()) && (await input.inputValue()) === "")
            await input.fill(value);
        }
        const link = frame.locator('input[name="linkOptIn"]').first();
        if ((await link.isVisible()) && (await link.isChecked())) await link.uncheck();
      }
    }
    stage = "pay_disposable_clock_checkout_with_test_card";
    await page.goto(session.url, { waitUntil: "domcontentloaded" });
    await fillCard("4242424242424242");
    const subscribe = page
      .getByRole("button", { name: /^(Subscribe|Start subscription|Pay)/i })
      .last();
    await subscribe.click();
    let subscriptionId;
    for (let attempt = 0; attempt < 30; attempt++) {
      const current = await stripe(`checkout/sessions/${session.id}`);
      if (current.status === "complete" && current.payment_status === "paid") {
        subscriptionId = current.subscription;
        break;
      }
      await delay(2000);
    }
    assert.ok(typeof subscriptionId === "string" && /^sub_[A-Za-z0-9]+$/.test(subscriptionId));
    async function subscription() {
      const sub = await stripe(
        `subscriptions/${subscriptionId}?expand[]=latest_invoice.payment_intent`,
      );
      assert.equal(sub.livemode, false);
      assert.equal(sub.customer, customer.id);
      assert.equal(sub.test_clock, clockId);
      assert.equal(sub.metadata?.test_fixture_id, fixture);
      return sub;
    }
    async function advance(timestamp) {
      await stripe(
        `test_helpers/test_clocks/${clockId}/advance`,
        new URLSearchParams({ frozen_time: String(timestamp) }),
      );
      for (let attempt = 0; attempt < 100; attempt++) {
        const value = await stripe(`test_helpers/test_clocks/${clockId}`);
        assert.equal(value.livemode, false);
        if (value.status === "ready") return;
        assert.equal(value.status, "advancing");
        await delay(2000);
      }
      throw new Error("Clock still advancing");
    }
    const initial = await subscription();
    assert.equal(paymentStatus({ status: "complete", subscription: initial }), "succeeded");
    assert.ok(typeof initial.current_period_end === "number");
    stage = "verify_real_renewal_success";
    await advance(initial.current_period_end + 7200);
    let renewed = await subscription();
    if (renewed.latest_invoice?.status === "draft") {
      await advance(initial.current_period_end + 14400);
      renewed = await subscription();
    }
    assert.notEqual(renewed.latest_invoice?.id, initial.latest_invoice?.id);
    assert.equal(renewed.latest_invoice?.status, "paid");
    assert.ok(renewed.current_period_end > initial.current_period_end);
    assert.equal(paymentStatus({ status: "complete", subscription: renewed }), "succeeded");
    console.log(
      "SANDBOX_RENEWAL_SUCCESS_VERIFIED: real clock-driven monthly renewal created a different paid invoice, advanced the period and matched the runtime status function using API 2024-06-20. Disposable fixture only; existing donation unchanged.",
    );
    stage = "set_disposable_fixture_declining_renewal_card_in_portal";
    const configs = await stripe("billing_portal/configurations?active=true&limit=100");
    assert.equal(configs.has_more, false);
    const eligible = configs.data.filter(usablePortal);
    const config =
      eligible.find((c) => c.is_default) ?? (eligible.length === 1 ? eligible[0] : null);
    assert.ok(config);
    const portal = await stripe(
      "billing_portal/sessions",
      new URLSearchParams({
        customer: customer.id,
        configuration: config.id,
        return_url: origin + "/donate",
        "flow_data[type]": "payment_method_update",
      }),
    );
    assert.equal(new URL(portal.url).origin, "https://billing.stripe.com");
    await page.goto(portal.url, { waitUntil: "domcontentloaded" });
    await fillCard("4000000000000341");
    const save = page
      .getByRole("button", { name: /^(Add|Update|Save)( payment method| card)?$/i })
      .last();
    await save.click();
    await delay(3000);
    stage = "verify_real_renewal_failure";
    await advance(renewed.current_period_end + 7200);
    let failed = await subscription();
    if (failed.latest_invoice?.status === "draft") {
      await advance(renewed.current_period_end + 14400);
      failed = await subscription();
    }
    assert.notEqual(failed.latest_invoice?.id, renewed.latest_invoice?.id);
    assert.equal(paymentStatus({ status: "complete", subscription: failed }), "failed");
    console.log(
      "SANDBOX_RENEWAL_FAILURE_VERIFIED: a subsequent real test-clock renewal failed with the published attachable-decline test card and the runtime status function returned failed. No original donation or billing configuration changed.",
    );
  } finally {
    if (browser) await browser.close();
    if (clockId) {
      const clock = await stripe(`test_helpers/test_clocks/${clockId}`);
      assert.equal(clock.livemode, false);
      assert.equal(clock.name, `iThemba disposable renewal ${fixture}`);
      const deleted = await stripe(`test_helpers/test_clocks/${clockId}`, undefined, "DELETE");
      assert.equal(deleted.deleted, true);
      console.log(
        "SANDBOX_RENEWAL_FIXTURE_REMOVED: only this job's test clock and its disposable customer/subscription objects were deleted. No extra active association subscription remains from this fixture.",
      );
    }
  }
}
main().catch(() => {
  console.error(
    `Sandbox renewal check stopped at ${stage}. Raw errors, bearer URLs, credentials and customer records omitted. Review the explicit verified markers and cleanup result; no overall success is implied.`,
  );
  process.exitCode = 1;
});
