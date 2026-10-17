import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { afterEach, test } from "node:test";
import {
  checkoutParameters,
  donationSchema,
  paymentStatus,
  type DonationInput,
} from "../src/lib/donations.ts";
import {
  handleDonationRequest,
  type DonationDatabase,
  type DonationEnv,
} from "../src/lib/donations.server.ts";
import { hmac, verifyStripeSignature } from "../src/lib/stripe-security.server.ts";

const input: DonationInput = {
  requestId: "51b96b58-a914-49d7-a263-88a241d98629",
  amount: 2500,
  frequency: "once",
  cause: "Safe Water",
  lang: "nl",
  name: "Test Donor",
  email: "donor@example.org",
  country: "DE",
  receiptRequested: true,
};
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
function fixture() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(readFileSync(new URL("../migrations/0001_donations.sql", import.meta.url), "utf8"));
  const db: DonationDatabase = {
    prepare(sql: string) {
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
      sqlite.exec("BEGIN");
      try {
        const values = [];
        for (const s of statements) values.push(await s.run());
        sqlite.exec("COMMIT");
        return values;
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
      }
    },
  };
  const env: DonationEnv = {
    DONATIONS_DB: db,
    STRIPE_SECRET_KEY: "rk_test_fixture",
    STRIPE_PUBLISHABLE_KEY: "pk_test_fixture",
    STRIPE_WEBHOOK_SECRET: "whsec_fixture",
    DONATION_COOKIE_SECRET: "test-cookie-signing-secret-at-least-32-characters",
    DONATION_SITE_ORIGIN: "https://donate.example.org",
    STRIPE_ACCOUNT_ID: "acct_association",
    STRIPE_PORTAL_CONFIGURATION_ID: "bpc_fixture",
    STRIPE_PORTAL_LOGIN_URL: "https://billing.stripe.com/p/login/test_fixture",
  };
  let session: Record<string, unknown> = {
    id: "cs_test_fixture",
    client_secret: "cs_test_fixture_secret",
    status: "open",
    payment_status: "unpaid",
    customer: "cus_fixture",
    subscription: null,
    payment_intent: null,
  };
  const calls: { path: string; params: URLSearchParams; key: string | null }[] = [];
  globalThis.fetch = async (url, options) => {
    const path = new URL(String(url)).pathname;
    calls.push({
      path,
      params: new URLSearchParams(options?.body as string),
      key: new Headers(options?.headers).get("Idempotency-Key"),
    });
    if (path.endsWith("/account")) return Response.json({ id: "acct_association" });
    if (path === "/v1/checkout/sessions" && options?.method === "POST") {
      const params = new URLSearchParams(options.body as string);
      return Response.json({ ...session, id: `cs_test_${params.get("metadata[donation_id]")}` });
    }
    if (path.endsWith("/customers")) return Response.json({ id: "cus_fixture" });
    if (path.endsWith("/expire")) {
      session = { ...session, status: "expired" };
      return Response.json(session);
    }
    if (path.endsWith("/billing_portal/sessions"))
      return Response.json({ url: "https://billing.stripe.com/p/session/fixture" });
    return Response.json(session);
  };
  async function bootstrap() {
    const res = await handleDonationRequest(
      new Request(`${env.DONATION_SITE_ORIGIN}/api/donations/config`),
      env,
    );
    assert.equal(res.status, 200);
    const cookie = res.headers.get("set-cookie")!.split(";")[0];
    assert.match(res.headers.get("set-cookie")!, /HttpOnly; SameSite=Lax/);
    return cookie;
  }
  function request(
    path: string,
    cookie?: string,
    payload?: unknown,
    origin = env.DONATION_SITE_ORIGIN,
  ) {
    return new Request(`${env.DONATION_SITE_ORIGIN}/api/donations/${path}`, {
      method: payload === undefined ? "GET" : "POST",
      headers: { ...(cookie ? { cookie } : {}), origin, "Content-Type": "application/json" },
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });
  }
  return {
    env,
    db,
    sqlite,
    calls,
    bootstrap,
    request,
    setSession(value: Record<string, unknown>) {
      session = { ...session, ...value };
    },
  };
}

test("validation rejects unsupported causes/currencies, fractional cents and unsafe amounts", () => {
  for (const invalid of [
    { amount: 99 },
    { amount: 1000001 },
    { amount: 2500.1 },
    { currency: "usd" },
    { cause: "unknown" },
    { frequency: "annual" },
    { email: "bad" },
    { name: " " },
    { country: "Germany" },
    { country: "EU" },
    { country: "ZZ" },
  ]) {
    assert.equal(donationSchema.safeParse({ ...input, ...invalid }).success, false);
  }
  assert.equal(donationSchema.safeParse(input).success, true);
});
test("method matrix excludes disabled methods and automatic monthly bank transfers", () => {
  const options = { paypal: true, paypalRecurring: false, bankTransfer: true };
  const once = checkoutParameters(input, "cus_test", "https://donate.example.org", options);
  assert.equal(once.get("payment_method_types[2]"), "paypal");
  assert.equal(once.get("payment_method_types[3]"), "customer_balance");
  assert.equal(once.get("payment_intent_data[metadata][cause]"), "Safe Water");
  assert.equal(once.get("billing_address_collection"), "required");
  const monthly = checkoutParameters(
    { ...input, frequency: "monthly" },
    "cus_test",
    "https://donate.example.org",
    options,
  );
  assert.equal(monthly.get("mode"), "subscription");
  assert.equal(monthly.get("line_items[0][price_data][recurring][interval]"), "month");
  assert.equal(monthly.get("payment_method_types[2]"), null);
  assert.equal(monthly.get("subscription_data[metadata][donation_id]"), input.requestId);
  assert.equal(monthly.get("payment_intent_data[receipt_email]"), null);
  const approved = checkoutParameters(
    { ...input, frequency: "monthly" },
    "cus_test",
    "https://donate.example.org",
    { ...options, paypalRecurring: true },
  );
  assert.equal(approved.get("payment_method_types[2]"), "paypal");
  for (const params of [once, monthly, approved])
    assert.doesNotMatch(params.toString(), /ideal|wero|twint/);
});
test("completion never reports pending bank/SEPA payments as succeeded", () => {
  assert.equal(
    paymentStatus({
      status: "complete",
      payment_status: "unpaid",
      payment_intent: { status: "processing" },
    }),
    "pending",
  );
  assert.equal(
    paymentStatus({
      status: "complete",
      payment_status: "unpaid",
      payment_intent: { status: "requires_action" },
    }),
    "pending",
  );
  assert.equal(paymentStatus({ status: "complete", payment_status: "paid" }), "succeeded");
  assert.equal(paymentStatus({ status: "expired", payment_status: "unpaid" }), "cancelled");
  assert.equal(
    paymentStatus({
      status: "open",
      payment_intent: { status: "requires_payment_method", last_payment_error: {} },
    }),
    "failed",
  );
  assert.equal(
    paymentStatus({
      status: "complete",
      payment_status: "paid",
      subscription: { status: "past_due", latest_invoice: { status: "open" } },
    }),
    "failed",
  );
  assert.equal(
    paymentStatus({
      status: "complete",
      payment_status: "paid",
      subscription: { status: "canceled" },
    }),
    "cancelled",
  );
  assert.equal(
    paymentStatus({
      status: "complete",
      subscription: {
        status: "active",
        latest_invoice: { status: "open", payment_intent: { status: "processing" } },
      },
    }),
    "pending",
  );
});
test("renewal authentication and settlement are determined by the current invoice", () => {
  assert.equal(
    paymentStatus({
      status: "complete",
      payment_status: "paid",
      subscription: {
        status: "active",
        latest_invoice: { status: "open", payment_intent: { status: "requires_action" } },
      },
    }),
    "failed",
  );
  assert.equal(
    paymentStatus({
      status: "complete",
      payment_status: "paid",
      subscription: {
        status: "active",
        cancel_at_period_end: true,
        latest_invoice: { status: "paid" },
      },
    }),
    "succeeded",
  );
});

test("raw webhook signatures require untampered body, current timestamp and a valid rotation signature", async () => {
  const body = '{"id":"evt_fixture"}';
  const time = Math.floor(Date.now() / 1000);
  const signature = await hmac("whsec_test", `${time}.${body}`);
  assert.equal(
    await verifyStripeSignature(body, `t=${time},v1=old,v1=${signature}`, "whsec_test"),
    true,
  );
  assert.equal(
    await verifyStripeSignature(`${body} `, `t=${time},v1=${signature}`, "whsec_test"),
    false,
  );
  assert.equal(
    await verifyStripeSignature(
      body,
      `t=${time},v1=${signature}`,
      "whsec_test",
      (time + 301) * 1000,
    ),
    false,
  );
  assert.equal(await verifyStripeSignature(body, null, "whsec_test"), false);
});
test("creation is idempotent and rejects changed payloads, other owners and cross-origin writes", async () => {
  const f = fixture();
  const cookie = await f.bootstrap();
  const first = await handleDonationRequest(f.request("create", cookie, input), f.env);
  assert.equal(first.status, 200);
  const again = await handleDonationRequest(f.request("create", cookie, input), f.env);
  assert.equal(again.status, 200);
  assert.equal(f.calls.filter((call) => call.path === "/v1/checkout/sessions").length, 1);
  assert.equal(
    f.calls.find((call) => call.path === "/v1/checkout/sessions")?.key,
    `donation:${input.requestId}:checkout`,
  );
  assert.equal(
    (await handleDonationRequest(f.request("create", cookie, { ...input, amount: 5000 }), f.env))
      .status,
    409,
  );
  assert.equal(
    (await handleDonationRequest(f.request("create", await f.bootstrap(), input), f.env)).status,
    409,
  );
  assert.equal(
    (await handleDonationRequest(f.request("create", cookie, input, "https://evil.example"), f.env))
      .status,
    403,
  );
  assert.equal(
    (
      await handleDonationRequest(
        f.request(`status?id=${input.requestId}`, await f.bootstrap()),
        f.env,
      )
    ).status,
    404,
  );
  assert.equal(
    (await handleDonationRequest(f.request("create", undefined, input), f.env)).status,
    403,
  );
});
test("live keys and a wrong beneficiary account fail closed before checkout", async () => {
  const f = fixture();
  const cookie = await f.bootstrap();
  assert.equal(
    (
      await handleDonationRequest(f.request("create", cookie, input), {
        ...f.env,
        STRIPE_ACCOUNT_ID: "acct_wrong",
      })
    ).status,
    503,
  );
  assert.equal(
    f.calls.some((call) => call.path === "/v1/checkout/sessions"),
    false,
  );
  assert.equal(
    (
      await handleDonationRequest(f.request("config"), {
        ...f.env,
        STRIPE_SECRET_KEY: "sk_live_fixture",
      })
    ).status,
    503,
  );
});
test("open checkouts can expire; submitted bank payments cannot be cancelled as if unpaid", async () => {
  const f = fixture();
  const cookie = await f.bootstrap();
  await handleDonationRequest(f.request("create", cookie, input), f.env);
  f.setSession({ status: "complete", payment_intent: { status: "processing" } });
  const pending = await handleDonationRequest(
    f.request(`status?id=${input.requestId}`, cookie),
    f.env,
  );
  assert.equal((await pending.json()).status, "pending");
  assert.equal(
    (await handleDonationRequest(f.request("cancel", cookie, { id: input.requestId }), f.env))
      .status,
    409,
  );
  f.setSession({ status: "open", payment_intent: null });
  assert.equal(
    (await handleDonationRequest(f.request("cancel", cookie, { id: input.requestId }), f.env))
      .status,
    200,
  );
  assert.equal(
    (
      await (
        await handleDonationRequest(f.request(`status?id=${input.requestId}`, cookie), f.env)
      ).json()
    ).status,
    "cancelled",
  );
});
test("monthly management creates a portal session for the owned Stripe customer only", async () => {
  const f = fixture();
  const cookie = await f.bootstrap();
  await handleDonationRequest(
    f.request("create", cookie, { ...input, frequency: "monthly" }),
    f.env,
  );
  assert.equal(
    (await handleDonationRequest(f.request("portal", cookie, { id: input.requestId }), f.env))
      .status,
    409,
  );
  f.setSession({
    status: "complete",
    subscription: { id: "sub_fixture", status: "active", latest_invoice: { status: "paid" } },
  });
  const result = await handleDonationRequest(
    f.request("portal", cookie, { id: input.requestId }),
    f.env,
  );
  assert.equal(result.status, 200);
  assert.equal(f.calls.at(-1)?.params.get("customer"), "cus_fixture");
  assert.equal(
    (
      await handleDonationRequest(
        f.request("portal", await f.bootstrap(), { id: input.requestId }),
        f.env,
      )
    ).status,
    404,
  );
});
test("webhooks deduplicate durably, re-read current state and reject tampering/live events", async () => {
  const f = fixture();
  const cookie = await f.bootstrap();
  await handleDonationRequest(f.request("create", cookie, input), f.env);
  f.setSession({ status: "complete", payment_status: "paid" });
  async function deliver(eventId: string, live = false, tamper = false) {
    const body = JSON.stringify({
      id: eventId,
      type: "checkout.session.async_payment_failed",
      livemode: live,
      data: { object: { customer: "cus_fixture", metadata: { donation_id: input.requestId } } },
    });
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await hmac(f.env.STRIPE_WEBHOOK_SECRET, `${timestamp}.${body}`);
    return handleDonationRequest(
      new Request(`${f.env.DONATION_SITE_ORIGIN}/api/donations/webhook`, {
        method: "POST",
        body: tamper ? `${body} ` : body,
        headers: { "stripe-signature": `t=${timestamp},v1=${signature}` },
      }),
      f.env,
    );
  }
  assert.equal((await deliver("evt_fixture")).status, 200);
  assert.equal(
    (
      await f.db
        .prepare("SELECT status FROM donations WHERE id=?")
        .bind(input.requestId)
        .first<{ status: string }>()
    )?.status,
    "succeeded",
  );
  const before = f.calls.length;
  assert.equal((await deliver("evt_fixture")).status, 200);
  assert.equal(f.calls.length, before);
  assert.equal((await deliver("evt_live", true)).status, 400);
  assert.equal((await deliver("evt_tampered", false, true)).status, 400);
  f.sqlite.prepare("UPDATE donations SET session_id=NULL WHERE id=?").run(input.requestId);
  assert.equal((await deliver("evt_early")).status, 503);
  assert.equal(
    await f.db.prepare("SELECT id FROM donation_events WHERE id='evt_early'").first(),
    null,
  );
});
test("rate limit applies to distinct attempts and input is bounded", async () => {
  const f = fixture();
  const cookie = await f.bootstrap();
  for (let i = 0; i < 10; i++)
    assert.equal(
      (
        await handleDonationRequest(
          f.request("create", cookie, { ...input, requestId: crypto.randomUUID() }),
          f.env,
        )
      ).status,
      200,
    );
  assert.equal(
    (
      await handleDonationRequest(
        f.request("create", cookie, { ...input, requestId: crypto.randomUUID() }),
        f.env,
      )
    ).status,
    429,
  );
  assert.equal(
    (
      await handleDonationRequest(
        f.request("create", cookie, { ...input, name: "x".repeat(9000) }),
        f.env,
      )
    ).status,
    413,
  );
});

test("monthly creation requires a secure management path", async () => {
  const f = fixture();
  const cookie = await f.bootstrap();
  for (const settings of [
    { STRIPE_PORTAL_CONFIGURATION_ID: undefined },
    { STRIPE_PORTAL_LOGIN_URL: undefined },
    { STRIPE_PORTAL_LOGIN_URL: "https://evil.example/p/login/fake" },
  ])
    assert.equal(
      (
        await handleDonationRequest(
          f.request("create", cookie, { ...input, frequency: "monthly" }),
          { ...f.env, ...settings },
        )
      ).status,
      503,
    );
  assert.equal(f.calls.length, 0);
});
test("pending bank instructions are returned only from verified Stripe hosts", async () => {
  const f = fixture();
  const cookie = await f.bootstrap();
  await handleDonationRequest(f.request("create", cookie, input), f.env);
  for (const [url, allowed] of [
    ["https://payments.stripe.com/bank_transfers/fixture", true],
    ["https://evil.example/steal", false],
  ] as const) {
    f.setSession({
      status: "complete",
      payment_intent: {
        status: "requires_action",
        next_action: { display_bank_transfer_instructions: { hosted_instructions_url: url } },
      },
    });
    const result = await (
      await handleDonationRequest(f.request(`status?id=${input.requestId}`, cookie), f.env)
    ).json();
    assert.equal(result.status, "pending");
    assert.equal(result.bankInstructionsUrl, allowed ? url : undefined);
  }
});
test("failed reconciliation is retryable and does not mark the webhook as handled", async () => {
  const f = fixture();
  const cookie = await f.bootstrap();
  await handleDonationRequest(f.request("create", cookie, input), f.env);
  const body = JSON.stringify({
    id: "evt_outage",
    type: "payment_intent.succeeded",
    livemode: false,
    data: { object: { customer: "cus_fixture" } },
  });
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await hmac(f.env.STRIPE_WEBHOOK_SECRET, `${timestamp}.${body}`);
  globalThis.fetch = async () => new Response("Unavailable", { status: 503 });
  const res = await handleDonationRequest(
    new Request(`${f.env.DONATION_SITE_ORIGIN}/api/donations/webhook`, {
      method: "POST",
      body,
      headers: { "stripe-signature": `t=${timestamp},v1=${signature}` },
    }),
    f.env,
  );
  assert.equal(res.status, 502);
  assert.equal(
    await f.db.prepare("SELECT id FROM donation_events WHERE id='evt_outage'").first(),
    null,
  );
});

test("standard and restricted keys preserve mode separation and the API version on every call", async () => {
  for (const mode of ["test", "live"] as const) {
    for (const kind of ["sk", "rk"]) {
      const f = fixture();
      f.env.STRIPE_DONATIONS_MODE = mode;
      f.env.STRIPE_SECRET_KEY = `${kind}_${mode}_fixture`;
      f.env.STRIPE_PUBLISHABLE_KEY = `pk_${mode}_fixture`;
      const transport = globalThis.fetch;
      const headers: Headers[] = [];
      const queries: URLSearchParams[] = [];
      globalThis.fetch = async (url, options) => {
        headers.push(new Headers(options?.headers));
        queries.push(new URL(String(url)).searchParams);
        return transport(url, options);
      };
      const cookie = await f.bootstrap();
      const config = await handleDonationRequest(f.request("config", cookie), f.env);
      const publicConfig = await config.json();
      assert.equal(publicConfig.publishableKey, `pk_${mode}_fixture`);
      assert.equal(JSON.stringify(publicConfig).includes(f.env.STRIPE_SECRET_KEY), false);
      assert.equal(
        (
          await handleDonationRequest(
            f.request("create", cookie, { ...input, frequency: "monthly" }),
            f.env,
          )
        ).status,
        200,
      );
      f.setSession({
        status: "complete",
        subscription: {
          status: "active",
          current_period_end: 1800000000,
          latest_invoice: { status: "paid", payment_intent: { status: "succeeded" } },
        },
      });
      const status = await handleDonationRequest(
        f.request(`status?id=${input.requestId}`, cookie),
        f.env,
      );
      const value = await status.json();
      assert.equal(value.status, "succeeded");
      assert.equal(value.nextBillingAt, 1800000000);
      assert.equal(
        (await handleDonationRequest(f.request("portal", cookie, { id: input.requestId }), f.env))
          .status,
        200,
      );
      f.setSession({ status: "open", subscription: null });
      assert.equal(
        (await handleDonationRequest(f.request("cancel", cookie, { id: input.requestId }), f.env))
          .status,
        200,
      );
      assert.ok(headers.length >= 6);
      for (const header of headers) {
        assert.equal(header.get("Authorization"), `Bearer ${kind}_${mode}_fixture`);
        assert.equal(header.get("Stripe-Version"), "2024-06-20");
      }
      assert.ok(
        queries.some((query) => {
          const expands = query.getAll("expand[]");
          return (
            expands.includes("payment_intent") &&
            expands.includes("subscription.latest_invoice.payment_intent")
          );
        }),
      );
    }
  }
});

test("mixed-mode, client, organization and unrecognized server keys are rejected before API calls", async () => {
  const cases = [
    { STRIPE_SECRET_KEY: "rk_live_fixture" },
    { STRIPE_SECRET_KEY: "sk_live_fixture" },
    { STRIPE_SECRET_KEY: "rk_test_fixture", STRIPE_PUBLISHABLE_KEY: "pk_live_fixture" },
    {
      STRIPE_DONATIONS_MODE: "live",
      STRIPE_SECRET_KEY: "rk_test_fixture",
      STRIPE_PUBLISHABLE_KEY: "pk_live_fixture",
    },
    {
      STRIPE_DONATIONS_MODE: "live",
      STRIPE_SECRET_KEY: "sk_test_fixture",
      STRIPE_PUBLISHABLE_KEY: "pk_live_fixture",
    },
    {
      STRIPE_DONATIONS_MODE: "live",
      STRIPE_SECRET_KEY: "rk_live_fixture",
      STRIPE_PUBLISHABLE_KEY: "pk_test_fixture",
    },
    { STRIPE_SECRET_KEY: "pk_test_fixture" },
    { STRIPE_SECRET_KEY: "whsec_fixture" },
    { STRIPE_SECRET_KEY: "sk_org_fixture" },
    { STRIPE_SECRET_KEY: "rk_fixture" },
    { STRIPE_SECRET_KEY: "prefix_rk_test_fixture" },
  ];
  for (const settings of cases) {
    const f = fixture();
    assert.equal(
      (await handleDonationRequest(f.request("config"), { ...f.env, ...settings })).status,
      503,
    );
    assert.equal(f.calls.length, 0);
  }
});

test("missing donation configuration blocks configuration and creation without contacting Stripe or writing donations", async () => {
  const required = [
    "DONATIONS_DB",
    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "DONATION_COOKIE_SECRET",
    "DONATION_SITE_ORIGIN",
    "STRIPE_ACCOUNT_ID",
  ] as const;
  for (const key of required) {
    const f = fixture();
    const env = { ...f.env, [key]: undefined };
    for (const request of [f.request("config"), f.request("create", "", input)]) {
      const result = await handleDonationRequest(request, env);
      assert.equal(result.status, 503, key);
      assert.equal(result.headers.get("Cache-Control"), "no-store");
      assert.equal(result.headers.get("Set-Cookie"), null);
      assert.deepEqual(await result.json(), { error: "unavailable" });
    }
    assert.equal(f.calls.length, 0, key);
    assert.equal(
      (await f.db.prepare("SELECT count(*) AS count FROM donations").first<{ count: number }>())
        ?.count,
      0,
      key,
    );
  }
});

test("insufficient restricted-key permissions fail closed without exposing Stripe errors or creating checkout", async () => {
  const f = fixture();
  const cookie = await f.bootstrap();
  globalThis.fetch = async () =>
    Response.json(
      { error: { message: "Missing account read permission", type: "invalid_request_error" } },
      { status: 403 },
    );
  const result = await handleDonationRequest(f.request("create", cookie, input), f.env);
  assert.equal(result.status, 502);
  assert.deepEqual(await result.json(), { error: "payment_service" });
  assert.equal(
    (
      await f.db
        .prepare("SELECT session_id FROM donations WHERE id=?")
        .bind(input.requestId)
        .first<{ session_id: string | null }>()
    )?.session_id,
    null,
  );
});
