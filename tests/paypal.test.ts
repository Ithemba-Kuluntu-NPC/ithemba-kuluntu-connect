import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { afterEach, test } from "node:test";
import { handlePayPalRequest, verifyPayPalIPN } from "../src/lib/paypal.server.ts";
import type { DonationDatabase } from "../src/lib/donations.server.ts";
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
const origin = "https://donate.example.org";
function fixture() {
  const sqlite = new DatabaseSync(":memory:");
  for (const migration of ["0001_donations.sql", "0002_paypal.sql"])
    sqlite.exec(readFileSync(new URL(`../migrations/${migration}`, import.meta.url), "utf8"));
  const db: DonationDatabase = {
    prepare(sql) {
      let params: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          params = values;
          return statement;
        },
        async first<T>() {
          return (sqlite.prepare(sql).get(...(params as [])) ?? null) as T | null;
        },
        async run() {
          return sqlite.prepare(sql).run(...(params as []));
        },
      };
      return statement;
    },
    async batch(statements) {
      for (const s of statements) await s.run();
    },
  };
  const env = {
    DONATIONS_DB: db,
    DONATION_SITE_ORIGIN: origin,
    PAYPAL_DONATIONS_ENABLED: "true",
    PAYPAL_MODE: "sandbox",
    PAYPAL_HOSTED_BUTTON_ID: "TESTBUTTON123",
    PAYPAL_MERCHANT_ID: "MERCHANT12345",
  };
  let cookie = "";
  async function call(path: string, body?: unknown) {
    const res = await handlePayPalRequest(
      new Request(`${origin}/api/paypal/${path}`, {
        method: body ? "POST" : "GET",
        headers: { cookie, origin, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      }),
      env,
    );
    const set = res.headers.get("set-cookie");
    if (set) cookie = set.split(";")[0];
    return res;
  }
  async function start() {
    await call("config");
    const res = await call("create", {
      requestId: crypto.randomUUID(),
      amount: 2500,
      frequency: "monthly",
      cause: "Safe Water",
      lang: "de",
      name: "Test Donor",
      email: "test@example.org",
      country: "DE",
      receiptRequested: true,
    });
    assert.equal(res.status, 200);
    return res.json();
  }
  async function notify(id: string, overrides: Record<string, string> = {}) {
    const fields = new URLSearchParams({
      receiver_id: env.PAYPAL_MERCHANT_ID,
      test_ipn: "1",
      custom: id,
      txn_id: "TXN12345",
      mc_currency: "EUR",
      mc_gross: "25.00",
      payment_status: "Completed",
      item_number: "Safe Water",
      ...overrides,
    });
    return handlePayPalRequest(
      new Request(`${origin}/api/paypal/ipn`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: fields.toString(),
      }),
      env,
    );
  }
  return { sqlite, env, call, start, notify };
}
test("disabled by default and production requires an explicit gate", async () => {
  assert.equal(
    (await handlePayPalRequest(new Request(`${origin}/api/paypal/config`), {})).status,
    503,
  );
  const f = fixture();
  f.env.PAYPAL_MODE = "production";
  assert.equal((await f.call("config")).status, 503);
});
test("verification posts the exact original body to the fixed sandbox endpoint", async () => {
  const raw = "custom=a%2Bb&item_name=Water+%26+Care";
  const verify: typeof fetch = async (url, init) => {
    assert.equal(String(url), "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr");
    assert.equal(init?.body, `cmd=_notify-validate&${raw}`);
    assert.equal(init?.redirect, "error");
    return new Response("VERIFIED");
  };
  assert.equal(await verifyPayPalIPN(raw, "sandbox", verify), true);
});
test("browser values cannot mark a donation paid; attempts are browser-owned", async () => {
  const f = fixture();
  const a = await f.start();
  assert.equal(a.options.custom, a.id);
  assert.equal(a.options.hosted_button_id, f.env.PAYPAL_HOSTED_BUTTON_ID);
  assert.equal(a.options.amount, undefined);
  assert.equal(
    (await (await f.call(`status?id=${a.id}&st=Completed&amt=25`)).json()).status,
    "pending",
  );
  const other = fixture();
  assert.equal((await other.call(`status?id=${a.id}`)).status, 403);
  const withoutCookie = await handlePayPalRequest(
    new Request(`${origin}/api/paypal/status?id=${a.id}`, {
      headers: { cookie: `ik_paypal_owner=${crypto.randomUUID()}${crypto.randomUUID()}` },
    }),
    f.env,
  );
  assert.equal(withoutCookie.status, 404);
});
test("unverified, wrong merchant and wrong mode/currency cannot credit a payment", async () => {
  const f = fixture();
  const a = await f.start();
  globalThis.fetch = async () => new Response("INVALID");
  assert.equal((await f.notify(a.id)).status, 400);
  globalThis.fetch = async () => new Response("VERIFIED");
  for (const change of [{ receiver_id: "OTHERACCOUNT" }, { test_ipn: "0" }, { mc_currency: "USD" }])
    assert.equal((await f.notify(a.id, change)).status, 400);
  assert.equal((await (await f.call(`status?id=${a.id}`)).json()).status, "pending");
});
test("verified actual amount wins; duplicates and delayed Pending cannot overwrite payment", async () => {
  const f = fixture();
  const a = await f.start();
  globalThis.fetch = async () => new Response("VERIFIED");
  assert.equal((await f.notify(a.id, { mc_gross: "12.34" })).status, 200);
  await f.notify(a.id, { mc_gross: "12.34" });
  await f.notify(a.id, { payment_status: "Pending" });
  const status = await (await f.call(`status?id=${a.id}`)).json();
  assert.deepEqual(status, { status: "succeeded", amount: 1234 });
  assert.equal(f.sqlite.prepare("SELECT COUNT(*) AS n FROM paypal_payments").get()?.n, 1);
});
test("renewals correlate by subscription; refunds require reconciliation and stay so", async () => {
  const f = fixture();
  const a = await f.start();
  globalThis.fetch = async () => new Response("VERIFIED");
  await f.notify(a.id, { subscr_id: "SUB123" });
  await f.notify("", { txn_id: "RENEW123", subscr_id: "SUB123" });
  assert.equal(f.sqlite.prepare("SELECT COUNT(*) AS n FROM paypal_payments").get()?.n, 2);
  await f.notify("", {
    txn_id: "REFUND123",
    parent_txn_id: "TXN12345",
    payment_status: "Refunded",
    mc_gross: "-10.00",
  });
  await f.notify(a.id, { txn_id: "RENEW123", subscr_id: "SUB123" });
  assert.equal((await (await f.call(`status?id=${a.id}`)).json()).status, "review");
});
test("notification verification outage is retryable; cross-site creates are refused", async () => {
  const f = fixture();
  const a = await f.start();
  globalThis.fetch = async () => new Response("error", { status: 503 });
  assert.equal((await f.notify(a.id)).status, 503);
  const res = await handlePayPalRequest(
    new Request(`${origin}/api/paypal/create`, {
      method: "POST",
      headers: { origin: "https://attacker.example" },
      body: "{}",
    }),
    f.env,
  );
  assert.equal(res.status, 403);
});

test("signup without payment is not credited and oversized/ambiguous notifications are refused", async () => {
  const f = fixture();
  const a = await f.start();
  globalThis.fetch = async () => new Response("VERIFIED");
  assert.equal(
    (await f.notify(a.id, { payment_status: "", txn_type: "subscr_signup" })).status,
    200,
  );
  assert.equal((await (await f.call(`status?id=${a.id}`)).json()).status, "pending");
  for (const [body, expected] of [
    ["x=1&x=2", 400],
    ["x=" + "a".repeat(65536), 413],
  ] as const) {
    const result = await handlePayPalRequest(
      new Request(`${origin}/api/paypal/ipn`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }),
      f.env,
    );
    assert.equal(result.status, expected);
  }
});

test("authorized live configuration needs no sandbox setup and uses only the live verification host", async () => {
  const f = fixture();
  f.env.PAYPAL_MODE = "production";
  const live = { ...f.env, PAYPAL_LIVE_APPROVED: "true" };
  const config = await handlePayPalRequest(new Request(`${origin}/api/paypal/config`), live);
  assert.equal(config.status, 200);
  assert.equal((await config.json()).mode, "production");
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), "https://ipnpb.paypal.com/cgi-bin/webscr");
    assert.equal(options?.redirect, "error");
    return new Response("VERIFIED");
  };
  const fields = new URLSearchParams({
    receiver_id: live.PAYPAL_MERCHANT_ID,
    test_ipn: "1",
    payment_status: "Completed",
    mc_currency: "EUR",
    mc_gross: "1.00",
    txn_id: "LIVEFIXTURE",
  });
  const rejected = await handlePayPalRequest(
    new Request(`${origin}/api/paypal/ipn`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: fields.toString(),
    }),
    live,
  );
  assert.equal(rejected.status, 400);
  assert.equal(await verifyPayPalIPN("txn_id=LIVEFIXTURE", "production"), true);
});

test("disabling new checkout preserves verified payment reconciliation", async () => {
  const f = fixture();
  const attempt = await f.start();
  f.env.PAYPAL_DONATIONS_ENABLED = "false";
  assert.equal((await f.call("config")).status, 503);
  globalThis.fetch = async () => new Response("VERIFIED");
  assert.equal((await f.notify(attempt.id)).status, 200);
  assert.equal(f.sqlite.prepare("SELECT status FROM paypal_payments").get()?.status, "Completed");
});

test("hosted PayPal cause changes are recorded from verified notifications", async () => {
  const f = fixture();
  const a = await f.start();
  globalThis.fetch = async () => new Response("VERIFIED");
  assert.equal(
    (await f.notify(a.id, { item_number: "Education", item_name: "Education" })).status,
    200,
  );
  assert.equal(f.sqlite.prepare("SELECT purpose FROM paypal_payments").get()?.purpose, "Education");
  assert.equal((await (await f.call(`status?id=${a.id}`)).json()).status, "succeeded");
});
