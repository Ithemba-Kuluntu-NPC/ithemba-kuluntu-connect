import { donationSchema } from "./donations.ts";
import type { DonationDatabase } from "./donations.server.ts";

interface PayPalEnv {
  DONATIONS_DB: DonationDatabase;
  DONATION_SITE_ORIGIN: string;
  PAYPAL_DONATIONS_ENABLED?: string;
  PAYPAL_MODE?: "sandbox" | "production";
  PAYPAL_HOSTED_BUTTON_ID?: string;
  PAYPAL_MERCHANT_ID?: string;
  PAYPAL_LIVE_APPROVED?: string;
}
interface Attempt {
  id: string;
  owner: string;
  cause: string;
  mode: string;
}
const COOKIE = "ik_paypal_owner";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const reply = (data: unknown, status = 200, headers = {}) =>
  Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers },
  });
class Failure extends Error {
  status: number;
  constructor(status: number) {
    super("PayPal request unavailable");
    this.status = status;
  }
}
function config(raw: unknown, reconciliation = false): PayPalEnv {
  const e = raw as PayPalEnv;
  if (
    !e ||
    (!reconciliation && e.PAYPAL_DONATIONS_ENABLED !== "true") ||
    !e.DONATIONS_DB ||
    !/^[A-Z0-9]{8,32}$/.test(e.PAYPAL_HOSTED_BUTTON_ID ?? "") ||
    !/^[A-Z0-9]{8,32}$/.test(e.PAYPAL_MERCHANT_ID ?? "") ||
    !["sandbox", "production"].includes(e.PAYPAL_MODE ?? "") ||
    (e.PAYPAL_MODE === "production" && e.PAYPAL_LIVE_APPROVED !== "true")
  )
    throw new Failure(503);
  const origin = new URL(e.DONATION_SITE_ORIGIN);
  if (
    origin.origin !== e.DONATION_SITE_ORIGIN ||
    (origin.protocol !== "https:" &&
      !(e.PAYPAL_MODE === "sandbox" && ["localhost", "127.0.0.1"].includes(origin.hostname)))
  )
    throw new Failure(503);
  return e;
}
function owner(request: Request): string | null {
  const value = request.headers
    .get("cookie")
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  return value && /^[0-9a-f-]{72}$/i.test(value) ? value : null;
}
async function limitedBody(request: Request, max: number): Promise<string> {
  if (!request.body) throw new Failure(400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const result = await reader.read();
    if (result.done) break;
    length += result.value.length;
    if (length > max) {
      await reader.cancel();
      throw new Failure(413);
    }
    chunks.push(result.value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.length;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
async function limit(env: PayPalEnv, key: string, max: number, seconds: number) {
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DONATIONS_DB.prepare(
    "INSERT INTO donation_rate_limits (id,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET attempts=attempts+1 RETURNING attempts",
  )
    .bind(`paypal:${key}:${Math.floor(now / seconds)}`, now + seconds)
    .first<{ attempts: number }>();
  if (!row || row.attempts > max) throw new Failure(429);
  await env.DONATIONS_DB.prepare("DELETE FROM donation_rate_limits WHERE expires_at < ?")
    .bind(now - seconds)
    .run();
}
export async function verifyPayPalIPN(
  raw: string,
  mode: string,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const result = await fetcher(
    `https://ipnpb.${mode === "sandbox" ? "sandbox." : ""}paypal.com/cgi-bin/webscr`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `cmd=_notify-validate&${raw}`,
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!result.ok) throw new Failure(503); // Retry transient verification failures.
  return (await result.text()).trim() === "VERIFIED";
}
export function ipnPayment(p: URLSearchParams, mode: string, merchant: string) {
  if (p.get("receiver_id") !== merchant || (p.get("test_ipn") === "1") !== (mode === "sandbox"))
    throw new Failure(400);
  const status = p.get("payment_status") ?? "";
  // Signup/cancellation notices are never proof that money was received.
  if (!status) return null;
  if (p.get("mc_currency") !== "EUR" || !/^-?\d{1,8}(\.\d{1,2})?$/.test(p.get("mc_gross") ?? ""))
    throw new Failure(400);
  const amount = Math.round(Number(p.get("mc_gross")) * 100);
  if (!Number.isSafeInteger(amount) || amount === 0) throw new Failure(400);
  const txn = p.get("txn_id") ?? "";
  if (!/^[A-Za-z0-9-]{1,64}$/.test(txn)) throw new Failure(400);
  const rank = ["Refunded", "Reversed", "Canceled_Reversal", "Partially_Refunded"].includes(status)
    ? 4
    : status === "Completed"
      ? 3
      : status === "Pending"
        ? 1
        : 2;
  if (status === "Completed" && amount < 0) throw new Failure(400);
  return {
    txn,
    status,
    amount,
    rank,
    parent: p.get("parent_txn_id"),
    subscription: p.get("subscr_id") ?? p.get("recurring_payment_id"),
  };
}
async function ipn(request: Request, env: PayPalEnv) {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/x-www-form-urlencoded")
  )
    throw new Failure(415);
  const raw = await limitedBody(request, 65536);
  const p = new URLSearchParams(raw);
  // Ambiguous duplicate fields are refused before validation or persistence.
  if (new Set(p.keys()).size !== [...p.keys()].length) throw new Failure(400);
  if (!(await verifyPayPalIPN(raw, env.PAYPAL_MODE!))) throw new Failure(400);
  const payment = ipnPayment(p, env.PAYPAL_MODE!, env.PAYPAL_MERCHANT_ID!);
  if (!payment) return reply({ received: true });
  const id = p.get("custom") ?? "";
  let attempt = UUID.test(id)
    ? await env.DONATIONS_DB.prepare("SELECT * FROM paypal_attempts WHERE id=? AND mode=?")
        .bind(id, env.PAYPAL_MODE)
        .first<Attempt>()
    : null;
  if (!attempt && payment.subscription)
    attempt = await env.DONATIONS_DB.prepare(
      "SELECT a.* FROM paypal_attempts a JOIN paypal_payments p ON p.attempt_id=a.id WHERE p.subscription_id=? AND a.mode=? LIMIT 1",
    )
      .bind(payment.subscription, env.PAYPAL_MODE)
      .first<Attempt>();
  if (!attempt && payment.parent)
    attempt = await env.DONATIONS_DB.prepare(
      "SELECT a.* FROM paypal_attempts a JOIN paypal_payments p ON p.attempt_id=a.id WHERE p.txn_id=? AND a.mode=?",
    )
      .bind(payment.parent, env.PAYPAL_MODE)
      .first<Attempt>();
  if (!attempt) return reply({ received: true }); // Other activity in the association account.
  if (p.get("item_number") && p.get("item_number") !== attempt.cause) throw new Failure(400);
  const existing = await env.DONATIONS_DB.prepare(
    "SELECT attempt_id FROM paypal_payments WHERE txn_id=?",
  )
    .bind(payment.txn)
    .first<{ attempt_id: string }>();
  if (existing && existing.attempt_id !== attempt.id) throw new Failure(400);
  // Monotonic rank: delayed Pending cannot overwrite Completed; reversals require reconciliation.
  // PayPal's actual amount is authoritative: hosted Donate lets the donor change it.
  await env.DONATIONS_DB.prepare(
    `INSERT INTO paypal_payments (txn_id,attempt_id,status,amount,rank,parent_txn_id,subscription_id,received_at)
    VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(txn_id) DO UPDATE SET status=excluded.status,amount=excluded.amount,rank=excluded.rank,
    subscription_id=COALESCE(excluded.subscription_id,paypal_payments.subscription_id),received_at=excluded.received_at
    WHERE excluded.rank > paypal_payments.rank`,
  )
    .bind(
      payment.txn,
      attempt.id,
      payment.status,
      payment.amount,
      payment.rank,
      payment.parent,
      payment.subscription,
      Math.floor(Date.now() / 1000),
    )
    .run();
  return reply({ received: true });
}
export async function handlePayPalRequest(request: Request, rawEnv: unknown): Promise<Response> {
  try {
    const url = new URL(request.url);
    const route = url.pathname.slice("/api/paypal".length);
    // Hiding checkout must not interrupt already-authorized monthly payment notifications.
    const env = config(rawEnv, route === "/ipn" && request.method === "POST");
    if (route === "/ipn" && request.method === "POST") return await ipn(request, env);
    if (
      url.origin !== env.DONATION_SITE_ORIGIN ||
      request.headers.get("sec-fetch-site") === "cross-site" ||
      (request.method === "POST" && request.headers.get("origin") !== env.DONATION_SITE_ORIGIN)
    )
      throw new Failure(403);
    if (route === "/config" && request.method === "GET") {
      const value = owner(request) ?? `${crypto.randomUUID()}${crypto.randomUUID()}`;
      return reply({ enabled: true, mode: env.PAYPAL_MODE }, 200, {
        "Set-Cookie": `${COOKIE}=${value}; HttpOnly; SameSite=Lax; Path=/api/paypal; Max-Age=2592000${url.protocol === "https:" ? "; Secure" : ""}`,
      });
    }
    const browserOwner = owner(request);
    if (!browserOwner) throw new Failure(403);
    if (route === "/create" && request.method === "POST") {
      await limit(env, `create:${browserOwner}`, 20, 3600);
      const ipHash = Array.from(
        new Uint8Array(
          await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(request.headers.get("CF-Connecting-IP") ?? "local"),
          ),
        ),
        (b) => b.toString(16).padStart(2, "0"),
      ).join("");
      await limit(env, `ip:${ipHash}`, 60, 3600);
      const parsed = donationSchema.safeParse(JSON.parse(await limitedBody(request, 8192)));
      if (!parsed.success) throw new Failure(400);
      const input = parsed.data;
      const id = crypto.randomUUID(); // Fresh unguessable correlation reference; never donor PII.
      await env.DONATIONS_DB.prepare(
        "INSERT INTO paypal_attempts (id,owner,cause,requested_amount,requested_frequency,receipt_requested,mode,created_at) VALUES (?,?,?,?,?,?,?,?)",
      )
        .bind(
          id,
          browserOwner,
          input.cause,
          input.amount,
          input.frequency,
          input.receiptRequested ? 1 : 0,
          env.PAYPAL_MODE,
          Math.floor(Date.now() / 1000),
        )
        .run();
      return reply({
        id,
        options: {
          env: env.PAYPAL_MODE,
          hosted_button_id: env.PAYPAL_HOSTED_BUTTON_ID,
          currency_code: "EUR",
          item_name: `iThemba Kuluntu e.V. — ${input.cause}`,
          item_number: input.cause,
          custom: id,
          charset: "UTF-8",
          lc: { en: "GB", de: "DE", nl: "NL" }[input.lang],
          notify_url: `${env.DONATION_SITE_ORIGIN}/api/paypal/ipn`,
          // Do not force amount: that can remove the hosted monthly option.
        },
      });
    }
    if (route === "/status" && request.method === "GET") {
      await limit(env, `status:${browserOwner}`, 30, 60);
      const id = url.searchParams.get("id") ?? "";
      if (!UUID.test(id)) throw new Failure(400);
      const attempt = await env.DONATIONS_DB.prepare(
        "SELECT * FROM paypal_attempts WHERE id=? AND owner=? AND mode=?",
      )
        .bind(id, browserOwner, env.PAYPAL_MODE)
        .first<Attempt>();
      if (!attempt) throw new Failure(404);
      const payment = await env.DONATIONS_DB.prepare(
        "SELECT status,amount,rank FROM paypal_payments WHERE attempt_id=? ORDER BY rank DESC,received_at DESC LIMIT 1",
      )
        .bind(id)
        .first<{ status: string; amount: number; rank: number }>();
      return reply({
        status: payment?.rank === 3 ? "succeeded" : payment?.rank === 4 ? "review" : "pending",
        amount: payment?.rank === 3 ? payment.amount : undefined,
      });
    }
    return reply({ error: "not_found" }, 404);
  } catch (e) {
    // No provider payloads, donor information or credentials in logs/responses.
    return reply({ error: "paypal_unavailable" }, e instanceof Failure ? e.status : 503);
  }
}
