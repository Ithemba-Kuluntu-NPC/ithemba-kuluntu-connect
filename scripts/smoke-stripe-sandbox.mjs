import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertDatabaseTarget, parseStagingConnection } from "./migrate-donations-staging.mjs";

export const SMOKE_ORIGIN = "https://ithemba-donations-staging.super-tooth-55f1.workers.dev";
const databaseId = "990e1489-72e6-4a2b-b2f6-dbb4863e4971";
const publicPortal = "https://billing.stripe.com/p/login/test_28EcN70MMeBD64G5MMfUQ00";

export function assertSmokeConfig(config) {
  assert.ok(
    config?.mode === "test" &&
      typeof config.publishableKey === "string" &&
      /^pk_test_[A-Za-z0-9]+$/.test(config.publishableKey) &&
      config.portalLoginUrl === publicPortal,
    "Expected the approved public sandbox configuration; no Checkout will be created",
  );
}

export async function smokeSandbox({
  connectionValue = process.env.CLOUDFLARE_D1_STAGING,
  fetchImpl = fetch,
  pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
} = {}) {
  if (process.env.GITHUB_ACTIONS === "true") {
    assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
    assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  }
  let connection;
  try {
    connection = parseStagingConnection(connectionValue);
  } catch {
    throw new Error("Saved staging D1 connection is invalid; no values are shown.");
  }
  if (process.env.GITHUB_ACTIONS === "true") console.log(`::add-mask::${connection.apiToken}`);
  const dbUrl = `https://api.cloudflare.com/client/v4/accounts/${connection.accountId}/d1/database/${databaseId}`;
  async function database(query) {
    let response;
    try {
      response = await fetchImpl(dbUrl + (query ? "/query" : ""), {
        method: query ? "POST" : "GET",
        redirect: "error",
        signal: AbortSignal.timeout(30000),
        headers: {
          Authorization: `Bearer ${connection.apiToken}`,
          ...(query ? { "Content-Type": "application/json" } : {}),
        },
        ...(query ? { body: JSON.stringify(query) } : {}),
      });
    } catch {
      throw new Error("Staging D1 read failed; no credentials are logged.");
    }
    if (!response.ok) throw new Error(`Staging D1 read failed (HTTP ${response.status}).`);
    const result = await response.json();
    assert.ok(result.success === true, "Staging D1 query failed");
    return result.result;
  }
  assertDatabaseTarget(await database());
  async function request(path, { cookie, payload } = {}) {
    let response;
    try {
      response = await fetchImpl(SMOKE_ORIGIN + "/api/donations/" + path, {
        method: payload ? "POST" : "GET",
        redirect: "error",
        signal: AbortSignal.timeout(30000),
        headers: {
          ...(cookie ? { Cookie: cookie } : {}),
          ...(payload ? { Origin: SMOKE_ORIGIN, "Content-Type": "application/json" } : {}),
        },
        ...(payload ? { body: JSON.stringify(payload) } : {}),
      });
    } catch {
      throw new Error(
        "Sandbox donation API could not be reached. No response or cookie values are logged.",
      );
    }
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Sandbox donation API did not return JSON.");
    }
    if (!response.ok) {
      const code = [
        "unavailable",
        "payment_service",
        "portal_unavailable",
        "security",
        "validation",
        "conflict",
        "rate_limit",
        "expired_attempt",
      ].includes(data?.error)
        ? data.error
        : "unknown";
      throw new Error(
        `Sandbox ${path.split("?")[0]} failed (HTTP ${response.status}, ${code}). No client secret or donor data is logged.`,
      );
    }
    return { data, response };
  }
  const initial = await request("config");
  assertSmokeConfig(initial.data);
  const cookie = initial.response.headers.get("set-cookie")?.split(";")[0];
  assert.ok(cookie, "Sandbox owner cookie not available");
  for (const frequency of ["once", "monthly"]) {
    const payload = {
      requestId: randomUUID(),
      amount: 1000,
      frequency,
      cause: "Where needed most",
      lang: "en",
      name: "TEST - automated sandbox Checkout check",
      email: "stripe-sandbox-check@example.org",
      country: "DE",
      receiptRequested: false,
    };
    const created = await request("create", { cookie, payload });
    let expired = false;
    try {
      assert.ok(
        created.data.id === payload.requestId &&
          created.data.status === "open" &&
          typeof created.data.clientSecret === "string" &&
          created.data.clientSecret.startsWith("cs_test_") &&
          created.data.clientSecret.includes("_secret_"),
        "Expected an open Stripe test Checkout; response values omitted",
      );
      const retry = await request("create", { cookie, payload });
      assert.ok(
        retry.data.id === created.data.id && retry.data.clientSecret === created.data.clientSecret,
        "Repeated creation must reuse the same test Checkout",
      );
      const status = await request(`status?id=${payload.requestId}`, { cookie });
      assert.ok(
        status.data.status === "open" &&
          status.data.frequency === frequency &&
          status.data.canManage === false,
        "Unsubmitted Checkout must remain open and cannot manage a subscription",
      );
    } finally {
      // Expire any created Checkout even if a later assertion fails; no card/confirmation API is used.
      const cancelled = await request("cancel", { cookie, payload: { id: payload.requestId } });
      expired = cancelled.data.status === "cancelled";
      assert.ok(expired, "Test Checkout expiration failed; inspect sandbox before retrying");
    }
    const status = await request(`status?id=${payload.requestId}`, { cookie });
    assert.equal(status.data.status, "cancelled", "Expired test Checkout must be cancelled");
    let received = false;
    for (let attempt = 0; attempt < 15; attempt++) {
      const results = await database({
        sql: "SELECT id FROM donation_events WHERE donation_id = ? AND type = 'checkout.session.expired' LIMIT 1",
        params: [payload.requestId],
      });
      assert.ok(
        Array.isArray(results) && results[0]?.success !== false,
        "Invalid staging D1 query result",
      );
      received = Array.isArray(results[0]?.results) && results[0].results.length === 1;
      if (received) break;
      if (attempt < 14) await pause(2000);
    }
    assert.ok(
      received,
      "Real Stripe-signed expiration webhook not observed in the staging ledger; payment acceptance remains unverified",
    );
    console.log(
      `SANDBOX_CHECKOUT_VERIFIED: ${frequency}; creation, idempotent retry, status, expiration and real Stripe-signed expiration webhook passed. No payment details submitted and no charge/subscription confirmed.`,
    );
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    await smokeSandbox();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
