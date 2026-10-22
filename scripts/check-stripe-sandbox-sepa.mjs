import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertSmokeConfig, SMOKE_ORIGIN } from "./smoke-stripe-sandbox.mjs";
import { assertDatabaseTarget, parseStagingConnection } from "./migrate-donations-staging.mjs";

let stage = "startup";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function main() {
  assert.ok(
    process.argv.length === 2 ||
      (process.argv.length === 3 && process.argv[2] === "--expect-failure"),
  );
  const expectFailure = process.argv[2] === "--expect-failure";
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  const cloudflare = parseStagingConnection(process.env.CLOUDFLARE_D1_STAGING);
  console.log(`::add-mask::${cloudflare.apiToken}`);
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
  const { chromium } = await import(
    pathToFileURL(resolve(process.env.STRIPE_BROWSER_MODULE_DIR, "index.mjs")).href
  );
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([name]) => !/^(CLOUDFLARE_|STRIPE_SANDBOX_)/.test(name)),
  );
  const browser = await chromium.launch({ headless: true, env });
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
  function stripeFrame(frame) {
    try {
      const u = new URL(frame.url());
      return u.protocol === "https:" && u.hostname.endsWith(".stripe.com");
    } catch {
      return false;
    }
  }
  try {
    assertSmokeConfig(await api("config"));
    await page.goto(SMOKE_ORIGIN + "/donate", { waitUntil: "domcontentloaded" });
    try {
      await page
        .getByRole("button", { name: "Reject non-essential", exact: true })
        .click({ timeout: 5000 });
    } catch {
      /* Consent may already be saved. */
    }
    stage = "create_one_time_test_checkout";
    const form = page.locator("#donate-form form");
    await form.locator("#d-name").fill("TEST - iThemba sandbox SEPA");
    await form.locator("#d-email").fill("info@ithembakuluntu.org");
    await form.locator("#d-country").fill("DE");
    await form.getByRole("button", { name: "€10", exact: true }).click();
    await form.getByRole("button", { name: "One-time", exact: true }).click();
    const creation = page.waitForResponse(
      (r) => r.url() === SMOKE_ORIGIN + "/api/donations/create" && r.request().method() === "POST",
      { timeout: 30000 },
    );
    await form.locator("button[type=submit]").click();
    const response = await creation;
    assert.equal(response.status(), 200);
    reference = (await response.json()).id;
    assert.ok(/^[a-f0-9-]{36}$/i.test(reference));
    stage = "select_stripe_sepa_method";
    let iban;
    for (let attempt = 0; attempt < 40 && !iban; attempt++) {
      const labels = [];
      for (const frame of page.frames()) {
        if (!stripeFrame(frame)) continue;
        if (attempt === 5) {
          const lines = (
            await frame
              .locator("body")
              .innerText()
              .catch(() => "")
          )
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length <= 70 && /^[A-Za-zÀ-ž €$'’—–().,\-:!?]+$/.test(line));
          const fields = [];
          for (const input of await frame.locator("input,select").all())
            if (await input.isVisible()) {
              const name = await input.getAttribute("name");
              fields.push({
                name: /^[A-Za-z_.\[\]-]{0,60}$/.test(name ?? "") ? name : "omitted",
                type: await input.getAttribute("type"),
              });
            }
          console.log(
            `SANDBOX_SEPA_VISIBLE_FORM: ${JSON.stringify({ lines: lines.slice(0, 25), fields })}`,
          );
        }
        const field = frame.locator('input[name*="iban" i], input[autocomplete="iban"]').first();
        if (await field.isVisible()) {
          iban = field;
          break;
        }
        if (attempt === 5)
          for (const role of ["button", "tab", "radio"])
            for (const control of await frame.getByRole(role).all()) {
              if (!(await control.isVisible())) continue;
              const label = (
                (await control.innerText()) ||
                (await control.getAttribute("aria-label")) ||
                ""
              )
                .trim()
                .replace(/\s+/g, " ");
              if (label.length <= 80 && /^[A-Za-zÀ-ž €$'’—–().,\-:!?]+$/.test(label))
                labels.push({ role, label });
            }
        // Match a method control itself; a broad text regex also matches Stripe's
        // surrounding mandate copy and can block before the form diagnostic.
        const sepaControls = [
          frame.getByRole("button", { name: /^(SEPA Direct Debit|SEPA|Bank account)$/i }),
          frame.getByRole("radio", { name: /SEPA|Direct Debit/i }),
          frame.getByRole("tab", { name: /SEPA|Direct Debit/i }),
          frame.getByText(/^(SEPA Direct Debit|SEPA|Bank account)$/i),
          frame.getByRole("button", { name: /^(Other|More) payment methods$/i }),
        ];
        if (attempt === 5) {
          for (const element of await frame.getByText(/^SEPA Direct Debit$/i).all()) {
            const shape = await element.evaluate((el) => {
              const safe = (n) => ({
                tag: n.tagName,
                role: n.getAttribute("role"),
                type: n.getAttribute("type"),
                hidden: n.getAttribute("aria-hidden"),
                disabled: n.getAttribute("aria-disabled"),
                children: Array.from(n.children)
                  .slice(0, 8)
                  .map((c) => ({
                    tag: c.tagName,
                    role: c.getAttribute("role"),
                    type: c.getAttribute("type"),
                  })),
              });
              return [el, el.parentElement, el.parentElement?.parentElement]
                .filter(Boolean)
                .map(safe);
            });
            console.log(`SANDBOX_SEPA_CONTROL_SHAPE: ${JSON.stringify(shape)}`);
          }
        }
        for (const matches of sepaControls) {
          const sepa = matches.first();
          if (await sepa.isVisible()) {
            await sepa.click({ timeout: 1000 }).catch(async (error) => {
              if (attempt === 5) {
                const reasons = [
                  "intercepts pointer events",
                  "outside of the viewport",
                  "not stable",
                  "not enabled",
                  "not visible",
                  "detached",
                ].filter((reason) => error.message?.includes(reason));
                console.log(`SANDBOX_SEPA_CONTROL_BLOCKED: ${JSON.stringify(reasons)}`);
              }
              // Stripe places a transparent method input above the visible label.
              // A pointer at the label's coordinates selects that hosted control.
              if (error.message?.includes("intercepts pointer events"))
                await sepa.click({ force: true, timeout: 1000 });
            });
            break;
          }
        }
      }
      if (attempt === 5)
        console.log(`SANDBOX_SEPA_METHOD_CONTROLS: ${JSON.stringify(labels.slice(0, 25))}`);
      if (!iban) await delay(500);
    }
    assert.ok(iban);
    // Published Stripe test IBANs: https://docs.stripe.com/testing#sepa-direct-debit-payments
    await iban.fill(expectFailure ? "DE78370400440532013004" : "DE89370400440532013000");
    for (const frame of page.frames()) {
      if (!stripeFrame(frame)) continue;
      const country = frame
        .locator('select[name="billingCountry"], select[name="country"]')
        .first();
      if (await country.isVisible()) await country.selectOption("DE");
      for (const [selector, value] of [
        ['input[name="billingName"], input[autocomplete="name"]', "iThemba Sandbox Test"],
        ['input[type="email"]', "info@ithembakuluntu.org"],
        ['input[name="billingAddressLine1"], input[autocomplete="address-line1"]', "Teststrasse 1"],
        ['input[name="billingLocality"], input[autocomplete="address-level2"]', "Berlin"],
        [
          'input[name="billingPostalCode"], input[name="postalCode"], input[autocomplete="postal-code"]',
          "10115",
        ],
      ]) {
        const input = frame.locator(selector).first();
        if ((await input.isVisible()) && (await input.inputValue()) === "") await input.fill(value);
      }
      const mandate = frame.getByRole("checkbox", { name: /mandate|authori[sz]/i }).first();
      if (await mandate.isVisible()) await mandate.check();
    }
    stage = "submit_published_test_iban";
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
    stage = "verify_pending_before_settlement";
    let pending = false;
    let settled = false;
    let previous;
    for (let attempt = 0; attempt < 180; attempt++) {
      const state = await api(`status?id=${reference}`);
      if (previous !== state.status) {
        previous = state.status;
        console.log(
          `SANDBOX_SEPA_STATUS: ${["open", "pending", "failed", "succeeded", "cancelled"].includes(previous) ? previous : "unknown"}`,
        );
      }
      assert.ok(["open", "pending", expectFailure ? "failed" : "succeeded"].includes(state.status));
      if (state.status === "pending") {
        pending = true;
        stage = "await_actual_test_settlement";
      }
      if (state.status === (expectFailure ? "failed" : "succeeded")) {
        assert.ok(pending, "SEPA must be observed pending before its final outcome");
        settled = true;
        break;
      }
      await delay(2000);
    }
    assert.ok(pending, "No submitted pending SEPA payment observed");
    if (!settled) {
      assert.equal(expectFailure, false, "Delayed test failure not yet observed");
      console.log(
        "SANDBOX_SEPA_PENDING_VERIFIED: real test debit submitted and remains pending without premature success. Settlement not yet verified; inspect Stripe later. No real bank account used.",
      );
      return;
    }
    stage = "verify_registered_async_result_webhook";
    const eventType = expectFailure
      ? "checkout.session.async_payment_failed"
      : "checkout.session.async_payment_succeeded";
    let delivered = false;
    for (let attempt = 0; attempt < 15; attempt++) {
      const rows = await database({
        sql: "SELECT id FROM donation_events WHERE donation_id = ? AND type = ? LIMIT 1",
        params: [reference, eventType],
      });
      delivered = rows?.[0]?.results?.length === 1;
      if (delivered) break;
      await delay(2000);
    }
    assert.ok(delivered);
    console.log(
      expectFailure
        ? "SANDBOX_SEPA_FAILURE_VERIFIED: pending became failed without success, and registered Stripe-signed async failure event was recorded in staging. Published delayed-failure test IBAN; no real bank account or monthly subscription."
        : "SANDBOX_SEPA_SETTLEMENT_VERIFIED: pending became genuinely succeeded and registered Stripe-signed async completion event was recorded in staging. Published test IBAN and existing association inbox only; no monthly subscription created.",
    );
  } finally {
    if (reference && !submitted) await api("cancel", { id: reference }).catch(() => {});
    await browser.close();
  }
}
main().catch((error) => {
  const kind = ["AssertionError", "TimeoutError", "Error"].includes(error?.name)
    ? error.name
    : "omitted";
  console.error(`SANDBOX_SEPA_ERROR_KIND: ${kind}`);
  console.error(
    `Sandbox SEPA check stopped at ${stage}. Raw errors, client secrets and donor records omitted.`,
  );
  process.exitCode = 1;
});
