import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertSmokeConfig, SMOKE_ORIGIN } from "./smoke-stripe-sandbox.mjs";

let stage = "startup";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function main() {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  const { chromium } = await import(
    pathToFileURL(resolve(process.env.STRIPE_BROWSER_MODULE_DIR, "index.mjs")).href
  );
  // This browser job has no Stripe API key, Cloudflare token or Worker secret.
  const browser = await chromium.launch({ headless: true });
  function stripeFrame(frame) {
    try {
      const u = new URL(frame.url());
      return u.protocol === "https:" && u.hostname.endsWith(".stripe.com");
    } catch {
      return false;
    }
  }
  try {
    for (const scenario of [
      { label: "decline", card: "4000000000000002", expected: "failed" },
      { label: "3ds", card: "4000000000003220", expected: "succeeded" },
    ]) {
      const context = await browser.newContext({ locale: "en-US" });
      const page = await context.newPage();
      let reference;
      let submitted = false;
      async function api(path, payload) {
        const r = payload
          ? await context.request.post(SMOKE_ORIGIN + "/api/donations/" + path, {
              headers: { Origin: SMOKE_ORIGIN },
              data: payload,
            })
          : await context.request.get(SMOKE_ORIGIN + "/api/donations/" + path);
        assert.ok(r.ok());
        return r.json();
      }
      async function field(selector) {
        for (let attempt = 0; attempt < 80; attempt++) {
          for (const frame of page.frames()) {
            if (!stripeFrame(frame)) continue;
            try {
              const input = frame.locator(selector).first();
              if (await input.isVisible()) return input;
            } catch {
              /* Stripe iframe may detach. */
            }
          }
          await delay(500);
        }
        throw new Error("Expected Stripe field not visible");
      }
      try {
        stage = `${scenario.label}:verify_test_config`;
        assertSmokeConfig(await api("config"));
        await page.goto(SMOKE_ORIGIN + "/donate", { waitUntil: "domcontentloaded" });
        try {
          await page
            .getByRole("button", { name: "Reject non-essential", exact: true })
            .click({ timeout: 5000 });
        } catch {
          /* Consent may already be saved. */
        }
        stage = `${scenario.label}:create_one_time_test_checkout`;
        const form = page.locator("#donate-form form");
        await form.locator("#d-name").fill(`TEST - iThemba sandbox ${scenario.label}`);
        await form.locator("#d-email").fill("info@ithembakuluntu.org");
        await form.locator("#d-country").fill("DE");
        await form.getByRole("button", { name: "€10", exact: true }).click();
        await form.getByRole("button", { name: "One-time", exact: true }).click();
        const creation = page.waitForResponse(
          (r) =>
            r.url() === SMOKE_ORIGIN + "/api/donations/create" && r.request().method() === "POST",
          { timeout: 30000 },
        );
        await form.locator("button[type=submit]").click();
        const response = await creation;
        assert.equal(response.status(), 200);
        reference = (await response.json()).id;
        assert.ok(/^[a-f0-9-]{36}$/i.test(reference));
        stage = `${scenario.label}:stripe_secure_card_fields`;
        await (
          await field(
            'input[name="cardNumber"], input[name="cardnumber"], input[autocomplete="cc-number"], input[name="number"]',
          )
        ).fill(scenario.card);
        await (
          await field(
            'input[name="cardExpiry"], input[name="exp-date"], input[autocomplete="cc-exp"], input[name="expiry"]',
          )
        ).fill("1234");
        await (
          await field('input[name="cardCvc"], input[name="cvc"], input[autocomplete="cc-csc"]')
        ).fill("123");
        for (const frame of page.frames()) {
          if (!stripeFrame(frame)) continue;
          try {
            const country = frame.locator('select[name="country"]').first();
            if (await country.isVisible()) await country.selectOption("DE");
            const postal = frame
              .locator(
                'input[name="postalCode"], input[name="billingPostalCode"], input[autocomplete="postal-code"]',
              )
              .first();
            if (await postal.isVisible()) await postal.fill("10115");
            const name = frame
              .locator('input[name="billingName"], input[autocomplete="cc-name"]')
              .first();
            if ((await name.isVisible()) && (await name.inputValue()) === "")
              await name.fill("iThemba Sandbox Test");
            const link = frame.locator('input[name="linkOptIn"]').first();
            if ((await link.isVisible()) && (await link.isChecked())) await link.uncheck();
          } catch {
            /* Optional Stripe fields may detach. */
          }
        }
        stage = `${scenario.label}:submit_test_card`;
        for (const frame of page.frames()) {
          if (!stripeFrame(frame)) continue;
          const button = frame.getByRole("button", { name: /^(Donate|Pay(?:$| [€$]))/i }).last();
          if (await button.isVisible()) {
            await button.click();
            submitted = true;
            break;
          }
        }
        assert.ok(submitted);
        if (scenario.label === "3ds") {
          stage = "3ds:complete_stripe_test_authentication";
          let authenticated = false;
          for (let attempt = 0; attempt < 60; attempt++) {
            for (const frame of page.frames()) {
              if (!stripeFrame(frame)) continue;
              const complete = frame
                .getByRole("button", { name: /^Complete( authentication)?$/i })
                .first();
              if (await complete.isVisible()) {
                await complete.click();
                authenticated = true;
                break;
              }
            }
            if (authenticated) break;
            await delay(500);
          }
          assert.ok(authenticated, "3DS test challenge not completed");
        }
        stage = `${scenario.label}:verify_actual_outcome`;
        let last;
        let declineShown = false;
        for (let attempt = 0; attempt < 25; attempt++) {
          const state = await api(`status?id=${reference}`);
          if (last !== state.status) {
            last = state.status;
            console.log(
              `SANDBOX_CARD_OBSERVED: ${scenario.label}; ${["open", "pending", "failed", "succeeded", "cancelled"].includes(last) ? last : "unknown"}`,
            );
          }
          if (scenario.label === "3ds" && state.status === "succeeded") break;
          if (scenario.label === "3ds" && attempt % 5 === 0) {
            const controls = [];
            for (const frame of page.frames()) {
              if (!stripeFrame(frame)) continue;
              for (const button of await frame.getByRole("button").all()) {
                if (!(await button.isVisible())) continue;
                const label = (await button.innerText()).trim().replace(/\s+/g, " ");
                if (label.length <= 70 && /^[A-Za-z €$'’—–().,\-:!?]+$/.test(label))
                  controls.push({ label, enabled: await button.isEnabled() });
              }
              const complete = frame
                .getByRole("button", { name: /^Complete( authentication)?$/i })
                .first();
              if (await complete.isVisible()) await complete.click();
            }
            console.log(`SANDBOX_3DS_CONTROLS: ${JSON.stringify(controls.slice(0, 20))}`);
          }
          if (scenario.label === "decline") {
            assert.notEqual(state.status, "succeeded");
            for (const frame of page.frames()) {
              if (!stripeFrame(frame)) continue;
              const text = await frame
                .locator("body")
                .innerText()
                .catch(() => "");
              if (/card (?:has been |was )?declined|card_declined/i.test(text)) declineShown = true;
            }
            if (declineShown && ["open", "failed"].includes(state.status)) break;
          }
          await delay(2000);
        }
        if (scenario.label === "3ds") assert.equal(last, "succeeded");
        else {
          assert.ok(declineShown);
          assert.ok(["open", "failed"].includes(last));
        }
        console.log(
          `SANDBOX_CARD_ACCEPTANCE_VERIFIED: ${scenario.label}; ${scenario.label === "3ds" ? "Stripe test authentication completed and actual payment succeeded" : "Stripe displayed decline; API never reported success and Checkout remains retryable"}. Existing association inbox used; no monthly subscription created.`,
        );
        if (scenario.label === "decline") {
          await api("cancel", { id: reference });
          assert.equal((await api(`status?id=${reference}`)).status, "cancelled");
          reference = undefined;
        }
        // A browser without the signed owner cookie must not learn this donation's state.
        if (reference) {
          const stranger = await browser.newContext();
          const rejected = await stranger.request.get(
            SMOKE_ORIGIN + `/api/donations/status?id=${reference}`,
          );
          assert.ok([401, 403, 404].includes(rejected.status()));
          await stranger.close();
          console.log(
            "SANDBOX_CARD_OWNER_REJECTION_VERIFIED: fresh browser denied donation status.",
          );
        }
      } finally {
        if (reference && !submitted) await api("cancel", { id: reference }).catch(() => {});
        await context.close();
      }
    }
    // Invalid input must be rejected without reaching Stripe creation.
    const check = await browser.newContext();
    assertSmokeConfig(
      await (await check.request.get(SMOKE_ORIGIN + "/api/donations/config")).json(),
    );
    for (const amount of [0, 99, 1000001, 100.5]) {
      const response = await check.request.post(SMOKE_ORIGIN + "/api/donations/create", {
        headers: { Origin: SMOKE_ORIGIN },
        data: {
          requestId: randomUUID(),
          amount,
          frequency: "once",
          cause: "Where needed most",
          lang: "en",
          name: "TEST validation only",
          email: "info@ithembakuluntu.org",
          country: "DE",
          receiptRequested: false,
        },
      });
      assert.equal(response.status(), 400);
    }
    await check.close();
    console.log(
      "SANDBOX_INVALID_AMOUNTS_VERIFIED: zero, below minimum, above maximum and fractional cents rejected.",
    );
  } finally {
    await browser.close();
  }
}
main().catch(() => {
  console.error(
    `Additional sandbox card check stopped at ${stage}. Raw errors, client secrets and donor records omitted.`,
  );
  process.exitCode = 1;
});
