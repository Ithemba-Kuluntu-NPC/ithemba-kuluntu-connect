import assert from "node:assert/strict";
import {
  checkSandbox,
  parseSandboxConnection,
  SANDBOX_API_VERSION,
} from "./check-stripe-sandbox.mjs";

import { assertDatabaseTarget, parseStagingConnection } from "./migrate-donations-staging.mjs";

// Read-only diagnostic for the operator's requested address and our known fixture.
// Optional exact-staging D1 SELECTs only; no Portal sessions/emails or Stripe writes.
async function main() {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  const connection = parseSandboxConnection(process.env.STRIPE_SANDBOX_CONNECTION);
  console.log(`::add-mask::${connection.restrictedKey}`);
  console.log(`::add-mask::${connection.publishableKey}`);
  await checkSandbox();
  let readFixtureLedger;
  if (process.env.CLOUDFLARE_D1_STAGING) {
    const cf = parseStagingConnection(process.env.CLOUDFLARE_D1_STAGING);
    console.log(`::add-mask::${cf.apiToken}`);
    const db = `https://api.cloudflare.com/client/v4/accounts/${cf.accountId}/d1/database/990e1489-72e6-4a2b-b2f6-dbb4863e4971`;
    async function d1(query) {
      const r = await fetch(db + (query ? "/query" : ""), {
        method: query ? "POST" : "GET",
        redirect: "error",
        signal: AbortSignal.timeout(30000),
        headers: {
          Authorization: `Bearer ${cf.apiToken}`,
          ...(query ? { "Content-Type": "application/json" } : {}),
        },
        ...(query ? { body: JSON.stringify(query) } : {}),
      });
      assert.ok(r.ok);
      const data = await r.json();
      assert.equal(data.success, true);
      return data.result;
    }
    assertDatabaseTarget(await d1());
    readFixtureLedger = async (id) => {
      assert.match(id, /^[a-f0-9-]{36}$/i);
      const ledger = await d1({ sql: "SELECT status FROM donations WHERE id = ?", params: [id] });
      const events = await d1({
        sql: "SELECT type FROM donation_events WHERE donation_id = ? AND type IN ('checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed')",
        params: [id],
      });
      const status = ledger[0]?.results?.[0]?.status;
      return {
        ledgerStatus: ["open", "pending", "succeeded", "failed", "cancelled"].includes(status)
          ? status
          : "missing",
        signedAsyncSuccess:
          events[0]?.results?.some((r) => r.type === "checkout.session.async_payment_succeeded") ===
          true,
        signedAsyncFailure:
          events[0]?.results?.some((r) => r.type === "checkout.session.async_payment_failed") ===
          true,
      };
    };
  }
  const accountResponse = await fetch("https://api.stripe.com/v1/account", {
    method: "GET",
    redirect: "error",
    signal: AbortSignal.timeout(15000),
    headers: {
      Authorization: `Bearer ${connection.restrictedKey}`,
      "Stripe-Version": SANDBOX_API_VERSION,
    },
  });
  assert.ok(accountResponse.ok);
  const account = await accountResponse.json();
  assert.equal(account.id, connection.accountId);
  const capability = account.capabilities?.sepa_debit_payments;
  console.log(
    `SANDBOX_SEPA_ACCOUNT_CAPABILITY: ${JSON.stringify({ germanAccount: account.country === "DE", capability: ["active", "inactive", "pending"].includes(capability) ? capability : "not_reported" })}`,
  );
  const configurationResponse = await fetch(
    "https://api.stripe.com/v1/payment_method_configurations?limit=100",
    {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${connection.restrictedKey}`,
        "Stripe-Version": SANDBOX_API_VERSION,
      },
    },
  );
  console.log(`SANDBOX_SEPA_CONFIGURATION_READ_HTTP: ${configurationResponse.status}`);
  if (configurationResponse.ok) {
    const configurations = await configurationResponse.json();
    assert.ok(Array.isArray(configurations.data));
    assert.equal(configurations.has_more, false);
    console.log(
      `SANDBOX_SEPA_CONFIGURATION_COUNTS: ${JSON.stringify({ active: configurations.data.filter((c) => c.active).length, defaults: configurations.data.filter((c) => c.active && c.is_default).length })}`,
    );
    for (const configuration of configurations.data.filter((c) => c.active)) {
      assert.equal(configuration.livemode, false);
      const sepa = configuration.sepa_debit;
      console.log(
        `SANDBOX_SEPA_CONFIGURATION: ${JSON.stringify({ default: configuration.is_default === true, available: sepa?.available === true, preference: ["on", "off", "none"].includes(sepa?.display_preference?.preference) ? sepa.display_preference.preference : "not_reported", value: ["on", "off"].includes(sepa?.display_preference?.value) ? sepa.display_preference.value : "not_reported" })}`,
      );
    }
  }
  async function list(resource, filters) {
    const records = [];
    let cursor;
    for (let page = 0; page < 100; page++) {
      const params = new URLSearchParams({ ...filters, limit: "100" });
      if (cursor) params.set("starting_after", cursor);
      const response = await fetch(`https://api.stripe.com/v1/${resource}?${params}`, {
        method: "GET",
        redirect: "error",
        headers: {
          Authorization: `Bearer ${connection.restrictedKey}`,
          "Stripe-Version": SANDBOX_API_VERSION,
        },
        signal: AbortSignal.timeout(15000),
      });
      console.log(`SANDBOX_DONOR_LOOKUP_HTTP: ${resource}; ${response.status}`);
      assert.ok(response.ok);
      const body = await response.json();
      assert.ok(Array.isArray(body.data) && typeof body.has_more === "boolean");
      for (const item of body.data) {
        assert.equal(item.livemode, false);
        records.push(item);
      }
      if (!body.has_more) return records;
      const next = body.data.at(-1)?.id;
      assert.ok(typeof next === "string" && next !== cursor);
      cursor = next;
    }
    throw new Error("Pagination incomplete; no negative finding may be inferred");
  }
  for (const [target, email] of [
    ["association_info", "info@ithembakuluntu.org"],
    ["automated_browser_fixture", "stripe-browser-check@example.org"],
  ]) {
    const customers = await list("customers", { email });
    const statuses = Object.fromEntries(
      [
        "active",
        "trialing",
        "past_due",
        "unpaid",
        "incomplete",
        "incomplete_expired",
        "canceled",
        "paused",
      ].map((status) => [status, 0]),
    );
    let scheduledCancellation = 0;
    let paidMonthlyCheckouts = 0;
    for (const customer of customers) {
      assert.equal(customer.email?.toLowerCase(), email);
      for (const sub of await list("subscriptions", { customer: customer.id, status: "all" })) {
        assert.equal(sub.customer, customer.id);
        assert.ok(Object.hasOwn(statuses, sub.status));
        statuses[sub.status]++;
        if (sub.cancel_at_period_end === true) scheduledCancellation++;
      }
      for (const session of await list("checkout/sessions", { customer: customer.id })) {
        assert.equal(session.customer, customer.id);
        if (session.metadata?.donor_name === "TEST - iThemba sandbox SEPA") {
          if (session.status === "complete") {
            const detailResponse = await fetch(
              `https://api.stripe.com/v1/checkout/sessions/${session.id}?expand[]=payment_intent`,
              {
                redirect: "error",
                signal: AbortSignal.timeout(15000),
                headers: {
                  Authorization: `Bearer ${connection.restrictedKey}`,
                  "Stripe-Version": SANDBOX_API_VERSION,
                },
              },
            );
            assert.ok(detailResponse.ok);
            const detail = await detailResponse.json();
            assert.equal(detail.livemode, false);
            assert.equal(detail.customer, customer.id);
            assert.equal(detail.metadata?.donor_name, "TEST - iThemba sandbox SEPA");
            const ledger = readFixtureLedger
              ? await readFixtureLedger(detail.metadata.donation_id)
              : {};
            const intent = detail.payment_intent;
            assert.ok(intent && typeof intent === "object" && intent.livemode === false);
            const status = [
              "processing",
              "succeeded",
              "requires_payment_method",
              "canceled",
            ].includes(intent.status)
              ? intent.status
              : "other";
            console.log(
              `SANDBOX_SEPA_AUTHORITATIVE_STATUS: ${JSON.stringify({ checkoutComplete: detail.status === "complete", paymentPaid: detail.payment_status === "paid", intentStatus: status, paymentErrorPresent: Boolean(intent.last_payment_error), ...ledger })}`,
            );
          }
          const methods = session.payment_method_types ?? [];
          console.log(
            `SANDBOX_SEPA_SESSION_CONFIGURATION: ${JSON.stringify({ includesSepa: methods.includes("sepa_debit"), includesCard: methods.includes("card"), methodCount: methods.length, eur: session.currency === "eur", english: session.locale === "en", billingCountryDE: customer.address?.country === "DE", adaptivePricingEnabled: session.adaptive_pricing?.enabled === true, presentmentCurrency: ["eur", "usd", "zar", "gbp"].includes(session.presentment_details?.presentment_currency) ? session.presentment_details.presentment_currency : "not_reported" })}`,
          );
        }
        if (
          session.mode === "subscription" &&
          session.status === "complete" &&
          session.payment_status === "paid"
        )
          paidMonthlyCheckouts++;
      }
    }
    // Fixed target labels and aggregate counts only; no donor records or bearer URLs.
    console.log(
      `SANDBOX_DONOR_RESULT: ${JSON.stringify({ target, customers: customers.length, statuses, scheduledCancellation, paidMonthlyCheckouts })}`,
    );
  }
}

main().catch(() => {
  console.error(
    "Sandbox donor lookup incomplete. Raw Stripe errors and donor records omitted; no settings, emails or subscriptions changed.",
  );
  process.exitCode = 1;
});
