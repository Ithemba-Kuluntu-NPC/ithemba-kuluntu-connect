import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertDatabaseTarget, parseStagingConnection } from "./migrate-donations-staging.mjs";
import { assertSmokeConfig, SMOKE_ORIGIN } from "./smoke-stripe-sandbox.mjs";

let stage = "startup";
let currentReference;
const testEmail = "stripe-browser-check@example.org";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function main() {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  const connection = parseStagingConnection(process.env.CLOUDFLARE_D1_STAGING);
  console.log(`::add-mask::${connection.apiToken}`);
  const databaseUrl = `https://api.cloudflare.com/client/v4/accounts/${connection.accountId}/d1/database/990e1489-72e6-4a2b-b2f6-dbb4863e4971`;
  async function database(query) {
    const response = await fetch(databaseUrl + (query ? "/query" : ""), {
      method: query ? "POST" : "GET",
      redirect: "error",
      headers: {
        Authorization: `Bearer ${connection.apiToken}`,
        ...(query ? { "Content-Type": "application/json" } : {}),
      },
      ...(query ? { body: JSON.stringify(query) } : {}),
      signal: AbortSignal.timeout(30000),
    });
    assert.ok(response.ok, "Staging D1 read failed");
    const data = await response.json();
    assert.ok(data.success === true, "Staging D1 read failed");
    return data.result;
  }
  assertDatabaseTarget(await database());
  const { chromium } = await import(
    pathToFileURL(resolve(process.env.STRIPE_BROWSER_MODULE_DIR, "index.mjs")).href
  );
  const browserEnv = Object.fromEntries(
    Object.entries(process.env).filter(([name]) => !/^(CLOUDFLARE_|STRIPE_SANDBOX_)/.test(name)),
  );
  const browser = await chromium.launch({ headless: true, env: browserEnv });
  try {
    for (const frequency of ["once", "monthly"]) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 1100 },
        locale: "en-US",
      });
      const page = await context.newPage();
      let paid = false;
      let cancellationScheduled = false;
      currentReference = undefined;
      async function api(path, payload) {
        const response = payload
          ? await context.request.post(SMOKE_ORIGIN + "/api/donations/" + path, {
              headers: { Origin: SMOKE_ORIGIN },
              data: payload,
            })
          : await context.request.get(SMOKE_ORIGIN + "/api/donations/" + path);
        assert.ok(response.ok(), "Sandbox API request failed");
        return response.json();
      }
      async function status() {
        return api(`status?id=${currentReference}`);
      }
      function stripeHosted(frame) {
        try {
          const url = new URL(frame.url());
          return url.protocol === "https:" && url.hostname.endsWith(".stripe.com");
        } catch {
          return false;
        }
      }
      async function visible(selector, timeout = 30000) {
        const until = Date.now() + timeout;
        while (Date.now() < until) {
          for (const frame of page.frames()) {
            if (!stripeHosted(frame)) continue;
            try {
              const locator = frame.locator(selector).first();
              if (await locator.isVisible()) return locator;
            } catch {
              /* Detached Stripe frames are expected during initialization. */
            }
          }
          await delay(300);
        }
        throw new Error("Expected secure Stripe field/control not visible");
      }
      async function maybeFill(selector, value) {
        for (const frame of page.frames()) {
          if (!stripeHosted(frame)) continue;
          try {
            const input = frame.locator(selector).first();
            if ((await input.isVisible()) && (await input.inputValue()) === "")
              await input.fill(value);
          } catch {
            /* Optional fields can disappear when Stripe updates its layout. */
          }
        }
      }
      try {
        stage = `${frequency}:verify_test_config`;
        assertSmokeConfig(await api("config"));
        stage = `${frequency}:load_donation_page`;
        const loaded = await page.goto(SMOKE_ORIGIN + "/donate", { waitUntil: "domcontentloaded" });
        console.log(`SANDBOX_PAGE_HTTP: ${loaded?.status() ?? 0}`);
        stage = `${frequency}:site_consent`;
        const rejectCookies = page.getByRole("button", {
          name: "Reject non-essential",
          exact: true,
        });
        try {
          await rejectCookies.waitFor({ state: "visible", timeout: 5000 });
          await rejectCookies.click();
        } catch {
          /* Consent may already have been saved in this isolated test context. */
        }
        stage = `${frequency}:donor_form`;
        const form = page.locator("#donate-form form");
        await form.locator("#d-name").fill("TEST - automated Stripe sandbox browser check");
        await form.locator("#d-email").fill(testEmail);
        await form.locator("#d-country").fill("DE");
        stage = `${frequency}:select_amount_frequency`;
        await form.getByRole("button", { name: "€10", exact: true }).click();
        await form
          .getByRole("button", { name: frequency === "once" ? "One-time" : "Monthly", exact: true })
          .click();
        stage = `${frequency}:create_checkout`;
        const creation = page.waitForResponse(
          (response) => response.url() === SMOKE_ORIGIN + "/api/donations/create",
          { timeout: 30000 },
        );
        await form.locator("button[type=submit]").click();
        const created = await creation;
        assert.equal(created.status(), 200, "Sandbox form could not create Checkout");
        const data = await created.json();
        assert.ok(
          typeof data.id === "string" && /^[a-f0-9-]{36}$/i.test(data.id),
          "Invalid test donation reference",
        );
        currentReference = data.id;
        stage = `${frequency}:secure_payment_form`;
        const number = await visible(
          'input[name="cardNumber"], input[name="cardnumber"], input[autocomplete="cc-number"], input[name="number"]',
        );
        await number.fill("4242424242424242"); // Published Stripe test card; never use a real card.
        await (
          await visible(
            'input[name="cardExpiry"], input[name="exp-date"], input[autocomplete="cc-exp"], input[name="expiry"]',
          )
        ).fill("1234");
        await (
          await visible('input[name="cardCvc"], input[name="cvc"], input[autocomplete="cc-csc"]')
        ).fill("123");
        await maybeFill(
          'input[name="billingName"], input[autocomplete="cc-name"]',
          "TEST Sandbox Donor",
        );
        await maybeFill(
          'input[name="billingPostalCode"], input[name="postalCode"], input[autocomplete="postal-code"]',
          "10115",
        );
        stage = `${frequency}:submit_published_test_card`;
        let submitted = false;
        for (const frame of page.frames()) {
          if (!stripeHosted(frame)) continue;
          const button = frame
            .getByRole("button", { name: /^(Donate|Subscribe|Start subscription|Pay(?:$| [€$]))/i })
            .last();
          if (await button.isVisible()) {
            await button.click();
            submitted = true;
            break;
          }
        }
        assert.ok(submitted, "Stripe payment submit button not found");
        stage = `${frequency}:verify_payment_status`;
        let previousStatus;
        for (let attempt = 0; attempt < 25; attempt++) {
          const value = await status();
          if (value.status !== previousStatus) {
            console.log(
              `SANDBOX_OBSERVED_STATUS: ${frequency}; ${["open", "pending", "failed", "succeeded", "cancelled"].includes(value.status) ? value.status : "unknown"}`,
            );
            previousStatus = value.status;
          }
          if (value.status === "succeeded") {
            paid = true;
            break;
          }
          assert.ok(["open", "pending"].includes(value.status), "Test payment did not succeed");
          await delay(2000);
        }
        assert.ok(paid, "Test payment not confirmed; never infer success from form completion");
        stage = `${frequency}:verify_real_webhook`;
        let delivered = false;
        for (let attempt = 0; attempt < 15; attempt++) {
          const rows = await database({
            sql: "SELECT id FROM donation_events WHERE donation_id = ? AND type = 'checkout.session.completed' LIMIT 1",
            params: [currentReference],
          });
          delivered = Array.isArray(rows?.[0]?.results) && rows[0].results.length === 1;
          if (delivered) break;
          await delay(2000);
        }
        assert.ok(delivered, "Registered Stripe payment-completion webhook not observed");
        console.log(
          `SANDBOX_PAYMENT_CONFIRMED: ${frequency}; published test card, genuine succeeded status and Stripe-signed completion event verified. No real money.`,
        );
        if (frequency === "monthly") {
          stage = "monthly:secure_customer_portal";
          const state = await status();
          assert.equal(state.canManage, true, "Monthly donor management unavailable");
          const portal = await api("portal", { id: currentReference });
          const url = new URL(portal.url);
          assert.equal(url.origin, "https://billing.stripe.com");
          assert.ok(url.pathname.startsWith("/p/session/"));
          await page.goto(portal.url, { waitUntil: "domcontentloaded" });
          stage = "monthly:schedule_cancellation";
          for (let attempt = 0; attempt < 6; attempt++) {
            const value = await status();
            if (value.cancelAtPeriodEnd === true) {
              cancellationScheduled = true;
              break;
            }
            const other = page.getByRole("radio", { name: /Other/i }).first();
            if (await other.isVisible()) await other.check();
            const buttons = page.getByRole("button", {
              name: /^(Cancel subscription|Cancel plan|Confirm cancellation|Continue)$/i,
            });
            const links = page.getByRole("link", { name: /^(Cancel subscription|Cancel plan)$/i });
            const button = buttons.last();
            const link = links.first();
            if (await button.isVisible()) await button.click();
            else if (await link.isVisible()) await link.click();
            else {
              const subscription = page
                .getByText("iThemba Kuluntu e.V. — Where needed most", { exact: false })
                .first();
              if (await subscription.isVisible()) await subscription.click();
            }
            await delay(2000);
          }
          assert.ok(
            cancellationScheduled,
            "Test subscription cancellation not confirmed; review sandbox fixture",
          );
          console.log(
            "SANDBOX_PORTAL_VERIFIED: owned recurring customer can manage the donation and schedule cancellation at period end. Test subscription will not renew after that period.",
          );
        }
      } catch (error) {
        const text = await page
          .locator("body")
          .innerText()
          .catch(() => "");
        console.log(
          `SANDBOX_BROWSER_FLAGS: ${JSON.stringify({
            donorFormPresent: await page.locator("#donate-form form").count(),
            nameFieldPresent: await page.locator("#d-name").count(),
            consentDialogVisible: await page
              .getByRole("button", { name: "Reject non-essential", exact: true })
              .isVisible()
              .catch(() => false),
            humanVerificationVisible: /verify you are human|just a moment|captcha/i.test(text),
            timeout: error?.name === "TimeoutError",
          })}`,
        );
        throw new Error("Controlled browser check failed");
      } finally {
        if (currentReference && !paid) {
          // Expire an unsubmitted Checkout; this cannot cancel/refund a completed bank/card payment.
          try {
            await api("cancel", { id: currentReference });
          } catch {
            /* Inspect fixture if already submitted. */
          }
        }
        if (frequency === "monthly" && paid && !cancellationScheduled)
          console.log(
            `SANDBOX_CLEANUP_REQUIRED: test donation reference ${currentReference}; inspect sandbox subscription cancellation.`,
          );
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
main().catch(() => {
  // Browser exceptions can contain bearer Portal URLs or client secrets. Never log them.
  console.error(
    `Sandbox browser test stopped at ${stage}. Browser/response values omitted. No live payments were attempted.`,
  );
  if (currentReference) console.log(`TEST_DONATION_REFERENCE: ${currentReference}`);
  process.exitCode = 1;
});
