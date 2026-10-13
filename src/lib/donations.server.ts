import { checkoutParameters, donationSchema, paymentStatus } from "./donations.ts";
import { equalSignature, hmac, verifyStripeSignature } from "./stripe-security.server.ts";

// Minimal binding types keep this module usable in both the Worker and local tests.
export interface DonationDatabase {
  prepare(sql: string): {
    bind(...values: unknown[]): ReturnType<DonationDatabase["prepare"]>;
    first<T>(): Promise<T | null>;
    run(): Promise<unknown>;
  };
  batch(statements: ReturnType<DonationDatabase["prepare"]>[]): Promise<unknown>;
}
export interface DonationEnv {
  DONATIONS_DB: DonationDatabase;
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  DONATION_COOKIE_SECRET: string;
  DONATION_SITE_ORIGIN: string;
  STRIPE_ACCOUNT_ID: string;
  STRIPE_DONATIONS_MODE?: "test" | "live";
  STRIPE_PAYPAL_ENABLED?: string;
  STRIPE_PAYPAL_RECURRING_ENABLED?: string;
  STRIPE_BANK_TRANSFER_ENABLED?: string;
  STRIPE_PORTAL_CONFIGURATION_ID?: string;
  STRIPE_PORTAL_LOGIN_URL?: string;
}
interface DonationRow {
  id: string;
  owner: string;
  fingerprint: string;
  created_at: number;
  session_id: string | null;
  customer_id: string | null;
  frequency: string;
  status: string;
}
type StripeObject = Record<string, unknown>;
const API_VERSION = "2024-06-20";
const COOKIE = "ik_donation_owner";
class DonationError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}
const response = (value: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers },
  });
function configuration(raw: unknown): DonationEnv {
  const env = raw as DonationEnv;
  if (
    !env?.DONATIONS_DB ||
    !env.STRIPE_SECRET_KEY ||
    !env.STRIPE_PUBLISHABLE_KEY ||
    !env.STRIPE_WEBHOOK_SECRET ||
    !env.DONATION_COOKIE_SECRET ||
    env.DONATION_COOKIE_SECRET.length < 32 ||
    !env.DONATION_SITE_ORIGIN ||
    !env.STRIPE_ACCOUNT_ID
  ) {
    throw new DonationError(503, "unavailable");
  }
  const live = env.STRIPE_DONATIONS_MODE === "live";
  if (
    ![live ? "sk_live_" : "sk_test_", live ? "rk_live_" : "rk_test_"].some((prefix) =>
      env.STRIPE_SECRET_KEY.startsWith(prefix),
    ) ||
    !env.STRIPE_PUBLISHABLE_KEY.startsWith(live ? "pk_live_" : "pk_test_")
  )
    throw new DonationError(503, "unavailable");
  const origin = new URL(env.DONATION_SITE_ORIGIN);
  if (
    origin.origin !== env.DONATION_SITE_ORIGIN ||
    (origin.protocol !== "https:" &&
      (live || !["localhost", "127.0.0.1"].includes(origin.hostname)))
  )
    throw new DonationError(503, "unavailable");
  return env;
}
async function stripe(
  env: DonationEnv,
  path: string,
  data?: URLSearchParams,
  key?: string,
): Promise<StripeObject> {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: data ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Stripe-Version": API_VERSION,
      ...(data ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: data,
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new DonationError(res.status === 429 ? 429 : 502, "payment_service");
  return (await res.json()) as StripeObject;
}
async function readBody(request: Request, max: number): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) throw new DonationError(400, "validation");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      throw new DonationError(413, "validation");
    }
    chunks.push(value);
  }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(result);
}
async function jsonBody(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new DonationError(400, "validation");
  try {
    return JSON.parse(await readBody(request, 8192));
  } catch (error) {
    if (error instanceof DonationError) throw error;
    throw new DonationError(400, "validation");
  }
}
async function identity(request: Request, env: DonationEnv): Promise<string | null> {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!cookie) return null;
  const [id, expiry, signature] = cookie.split(".");
  if (
    !id ||
    !expiry ||
    !signature ||
    !/^[0-9a-f-]{36}$/.test(id) ||
    !/^\d+$/.test(expiry) ||
    Number(expiry) < Date.now() / 1000
  )
    return null;
  if (!equalSignature(await hmac(env.DONATION_COOKIE_SECRET, `${id}.${expiry}`), signature))
    return null;
  return hmac(env.DONATION_COOKIE_SECRET, `owner:${id}`);
}
async function owner(request: Request, env: DonationEnv): Promise<string> {
  const id = await identity(request, env);
  if (!id) throw new DonationError(403, "security");
  return id;
}
async function rateLimit(
  env: DonationEnv,
  id: string,
  max: number,
  seconds: number,
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const bucket = `${id}:${Math.floor(now / seconds)}`;
  const row = await env.DONATIONS_DB.prepare(
    "INSERT INTO donation_rate_limits (id,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET attempts=attempts+1 RETURNING attempts",
  )
    .bind(bucket, now + seconds)
    .first<{ attempts: number }>();
  if (!row || row.attempts > max) throw new DonationError(429, "rate_limit");
  await env.DONATIONS_DB.prepare("DELETE FROM donation_rate_limits WHERE expires_at < ?")
    .bind(now - seconds)
    .run();
}
async function findDonation(
  env: DonationEnv,
  id: string,
  browserOwner: string,
): Promise<DonationRow> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new DonationError(400, "validation");
  const row = await env.DONATIONS_DB.prepare("SELECT * FROM donations WHERE id=? AND owner=?")
    .bind(id, browserOwner)
    .first<DonationRow>();
  if (!row?.session_id) throw new DonationError(404, "not_found");
  return row;
}
async function currentSession(env: DonationEnv, row: DonationRow): Promise<StripeObject> {
  const query = new URLSearchParams();
  query.append("expand[]", "payment_intent");
  query.append("expand[]", "subscription.latest_invoice.payment_intent");
  return stripe(env, `checkout/sessions/${row.session_id}?${query}`);
}
async function saveStatus(
  env: DonationEnv,
  row: DonationRow,
  session: StripeObject,
): Promise<void> {
  await env.DONATIONS_DB.prepare("UPDATE donations SET status=?,updated_at=? WHERE id=?")
    .bind(paymentStatus(session), Math.floor(Date.now() / 1000), row.id)
    .run();
}
async function webhook(request: Request, env: DonationEnv): Promise<Response> {
  const body = await readBody(request, 1048576);
  if (
    !(await verifyStripeSignature(
      body,
      request.headers.get("stripe-signature"),
      env.STRIPE_WEBHOOK_SECRET,
    ))
  )
    throw new DonationError(400, "signature");
  let event: { id: string; type: string; livemode: boolean; data: { object: StripeObject } };
  try {
    event = JSON.parse(body);
  } catch {
    throw new DonationError(400, "validation");
  }
  if (
    !event.id?.startsWith("evt_") ||
    !event.data?.object ||
    event.livemode !== (env.STRIPE_DONATIONS_MODE === "live")
  )
    throw new DonationError(400, "validation");
  const supported = new Set([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
    "checkout.session.expired",
    "payment_intent.processing",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled",
    "invoice.paid",
    "invoice.payment_failed",
    "invoice.payment_action_required",
    "invoice.voided",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ]);
  if (!supported.has(event.type)) return response({ received: true });
  if (
    await env.DONATIONS_DB.prepare("SELECT id FROM donation_events WHERE id=?")
      .bind(event.id)
      .first()
  )
    return response({ received: true });
  const object = event.data.object;
  const customer = typeof object.customer === "string" ? object.customer : null;
  const row = await env.DONATIONS_DB.prepare("SELECT * FROM donations WHERE customer_id=?")
    .bind(customer)
    .first<DonationRow>();
  // A Customer webhook can arrive before the session is saved. Return a retryable response, never discard it.
  if (!row?.session_id) {
    if (row || (object.metadata as StripeObject | undefined)?.donation_id)
      throw new DonationError(503, "retry");
    return response({ received: true }); // unrelated account activity
  }
  // Retrieve current Stripe state instead of applying stale/out-of-order event payloads.
  const session = await currentSession(env, row);
  const now = Math.floor(Date.now() / 1000);
  await env.DONATIONS_DB.batch([
    env.DONATIONS_DB.prepare(
      "UPDATE donations SET status=?,updated_at=?,webhook_at=? WHERE id=?",
    ).bind(paymentStatus(session), now, now, row.id),
    env.DONATIONS_DB.prepare(
      "INSERT OR IGNORE INTO donation_events (id,type,donation_id,received_at) VALUES (?,?,?,?)",
    ).bind(event.id, event.type, row.id, now),
  ]);
  return response({ received: true });
}

export async function handleDonationRequest(request: Request, rawEnv: unknown): Promise<Response> {
  try {
    const env = configuration(rawEnv);
    const url = new URL(request.url);
    const route = url.pathname.slice("/api/donations".length);
    if (route === "/webhook" && request.method === "POST") return await webhook(request, env);
    if (url.origin !== env.DONATION_SITE_ORIGIN) throw new DonationError(403, "security");
    if (request.method === "POST" && request.headers.get("origin") !== env.DONATION_SITE_ORIGIN)
      throw new DonationError(403, "security");
    if (request.headers.get("sec-fetch-site") === "cross-site")
      throw new DonationError(403, "security");
    if (route === "/config" && request.method === "GET") {
      const headers: Record<string, string> = {};
      if (!(await identity(request, env))) {
        const value = `${crypto.randomUUID()}.${Math.floor(Date.now() / 1000) + 2592000}`;
        const signature = await hmac(env.DONATION_COOKIE_SECRET, value);
        headers["Set-Cookie"] =
          `${COOKIE}=${value}.${signature}; HttpOnly; SameSite=Lax; Path=/api/donations; Max-Age=2592000${url.protocol === "https:" ? "; Secure" : ""}`;
      }
      let portalLoginUrl: string | undefined;
      if (env.STRIPE_PORTAL_LOGIN_URL) {
        const link = new URL(env.STRIPE_PORTAL_LOGIN_URL);
        if (link.origin === "https://billing.stripe.com" && link.pathname.startsWith("/p/login/"))
          portalLoginUrl = link.href;
      }
      return response(
        {
          publishableKey: env.STRIPE_PUBLISHABLE_KEY,
          portalLoginUrl,
          mode: env.STRIPE_DONATIONS_MODE ?? "test",
        },
        200,
        headers,
      );
    }
    const browserOwner = await owner(request, env);
    if (route === "/create" && request.method === "POST") {
      await rateLimit(env, `attempt:${browserOwner}`, 30, 600);
      const parsed = donationSchema.safeParse(await jsonBody(request));
      if (!parsed.success) throw new DonationError(400, "validation");
      const input = parsed.data;
      if (input.frequency === "monthly") {
        if (!env.STRIPE_PORTAL_CONFIGURATION_ID || !env.STRIPE_PORTAL_LOGIN_URL)
          throw new DonationError(503, "portal_unavailable");
        const login = new URL(env.STRIPE_PORTAL_LOGIN_URL);
        if (
          login.origin !== "https://billing.stripe.com" ||
          !login.pathname.startsWith("/p/login/")
        )
          throw new DonationError(503, "portal_unavailable");
      }
      const fingerprint = await hmac(env.DONATION_COOKIE_SECRET, JSON.stringify(input));
      let row = await env.DONATIONS_DB.prepare("SELECT * FROM donations WHERE id=?")
        .bind(input.requestId)
        .first<DonationRow>();
      if (row && (row.owner !== browserOwner || row.fingerprint !== fingerprint))
        throw new DonationError(409, "conflict");
      if (row?.session_id) {
        const session = await currentSession(env, row);
        return response({
          id: row.id,
          clientSecret: session.status === "open" ? session.client_secret : null,
          status: paymentStatus(session),
        });
      }
      const now = Math.floor(Date.now() / 1000);
      if (row && now - row.created_at > 82800) throw new DonationError(409, "expired_attempt");
      if (!row) {
        const ip = request.headers.get("CF-Connecting-IP") ?? "local";
        await rateLimit(env, `create:${await hmac(env.DONATION_COOKIE_SECRET, ip)}`, 10, 3600);
        await env.DONATIONS_DB.prepare(
          "INSERT OR IGNORE INTO donations (id,owner,fingerprint,created_at,frequency,updated_at) VALUES (?,?,?,?,?,?)",
        )
          .bind(input.requestId, browserOwner, fingerprint, now, input.frequency, now)
          .run();
        row = await env.DONATIONS_DB.prepare("SELECT * FROM donations WHERE id=?")
          .bind(input.requestId)
          .first<DonationRow>();
        if (!row || row.owner !== browserOwner || row.fingerprint !== fingerprint)
          throw new DonationError(409, "conflict");
      }
      if (now >= row.created_at + 1800) throw new DonationError(409, "expired_attempt");
      // Credentials must belong to the association's verified account; no Connect/platform transfers.
      const account = await stripe(env, "account");
      if (account.id !== env.STRIPE_ACCOUNT_ID) throw new DonationError(503, "unavailable");
      const customerParams = new URLSearchParams({
        name: input.name,
        email: input.email,
        "address[country]": input.country,
        "preferred_locales[0]": input.lang,
        "metadata[donation_id]": input.requestId,
      });
      const customer = await stripe(
        env,
        "customers",
        customerParams,
        `donation:${input.requestId}:customer`,
      );
      await env.DONATIONS_DB.prepare("UPDATE donations SET customer_id=? WHERE id=?")
        .bind(customer.id, input.requestId)
        .run();
      const params = checkoutParameters(input, String(customer.id), env.DONATION_SITE_ORIGIN, {
        paypal: env.STRIPE_PAYPAL_ENABLED === "true",
        paypalRecurring: env.STRIPE_PAYPAL_RECURRING_ENABLED === "true",
        bankTransfer: env.STRIPE_BANK_TRANSFER_ENABLED === "true",
      });
      // Absolute expiry anchors retries, and keeps abandoned checkout sessions short-lived.
      params.set("expires_at", String(row.created_at + 3600));
      const session = await stripe(
        env,
        "checkout/sessions",
        params,
        `donation:${input.requestId}:checkout`,
      );
      await env.DONATIONS_DB.prepare("UPDATE donations SET session_id=?,updated_at=? WHERE id=?")
        .bind(session.id, now, input.requestId)
        .run();
      return response({ id: input.requestId, clientSecret: session.client_secret, status: "open" });
    }
    if (route === "/status" && request.method === "GET") {
      await rateLimit(env, `status:${browserOwner}`, 60, 60);
      const row = await findDonation(env, url.searchParams.get("id") ?? "", browserOwner);
      const session = await currentSession(env, row);
      await saveStatus(env, row, session);
      const subscription = session.subscription as StripeObject | null;
      const intent = session.payment_intent as StripeObject | null;
      const action = intent?.next_action as StripeObject | undefined;
      const instructions = action?.display_bank_transfer_instructions as StripeObject | undefined;
      let bankInstructionsUrl: string | undefined;
      if (typeof instructions?.hosted_instructions_url === "string") {
        const link = new URL(instructions.hosted_instructions_url);
        if (
          link.protocol === "https:" &&
          ["payments.stripe.com", "checkout.stripe.com"].includes(link.hostname)
        )
          bankInstructionsUrl = link.href;
      }
      return response({
        id: row.id,
        status: paymentStatus(session),
        frequency: row.frequency,
        bankInstructionsUrl,
        clientSecret: session.status === "open" ? session.client_secret : undefined,
        canManage: row.frequency === "monthly" && session.status === "complete" && !!subscription,
        cancelAtPeriodEnd: subscription?.cancel_at_period_end === true,
        nextBillingAt: subscription?.current_period_end ?? null,
      });
    }
    if ((route === "/cancel" || route === "/portal") && request.method === "POST") {
      const body = (await jsonBody(request)) as { id?: unknown };
      if (!body || typeof body.id !== "string") throw new DonationError(400, "validation");
      await rateLimit(env, `manage:${browserOwner}`, 20, 3600);
      const row = await findDonation(env, body.id, browserOwner);
      const session = await currentSession(env, row);
      if (route === "/cancel") {
        // Expiration cancels an unfinished Checkout, never a payment already submitted to a bank.
        if (session.status !== "open") throw new DonationError(409, "already_submitted");
        await stripe(
          env,
          `checkout/sessions/${row.session_id}/expire`,
          new URLSearchParams(),
          `donation:${row.id}:expire`,
        );
        await env.DONATIONS_DB.prepare(
          "UPDATE donations SET status='cancelled',updated_at=? WHERE id=?",
        )
          .bind(Math.floor(Date.now() / 1000), row.id)
          .run();
        return response({ status: "cancelled" });
      }
      if (
        row.frequency !== "monthly" ||
        session.status !== "complete" ||
        !session.subscription ||
        !row.customer_id ||
        !env.STRIPE_PORTAL_CONFIGURATION_ID
      )
        throw new DonationError(409, "portal_unavailable");
      const portal = await stripe(
        env,
        "billing_portal/sessions",
        new URLSearchParams({
          customer: row.customer_id,
          configuration: env.STRIPE_PORTAL_CONFIGURATION_ID,
          return_url: `${env.DONATION_SITE_ORIGIN}/donate?donation=${row.id}`,
        }),
      );
      const portalUrl = new URL(String(portal.url));
      if (portalUrl.origin !== "https://billing.stripe.com")
        throw new DonationError(502, "payment_service");
      return response({ url: portalUrl.href });
    }
    return response({ error: "not_found" }, 404);
  } catch (error) {
    if (error instanceof DonationError) return response({ error: error.code }, error.status);
    // Never log Stripe payloads, donor details, tokens or credentials.
    console.error("Donation service request failed");
    return response({ error: "unavailable" }, 503);
  }
}
