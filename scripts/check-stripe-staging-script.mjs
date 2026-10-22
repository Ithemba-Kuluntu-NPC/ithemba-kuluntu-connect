import assert from "node:assert/strict";
import { assertDatabaseTarget, parseStagingConnection } from "./migrate-donations-staging.mjs";

async function main() {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  const connection = parseStagingConnection(process.env.CLOUDFLARE_D1_STAGING);
  const token = process.env.CLOUDFLARE_WORKER_STAGING_TOKEN;
  assert.ok(typeof token === "string" && token.trim() === token && token.length > 20);
  console.log(`::add-mask::${token}`);
  console.log(`::add-mask::${connection.apiToken}`);
  const root = `https://api.cloudflare.com/client/v4/accounts/${connection.accountId}`;
  const db = await fetch(root + "/d1/database/990e1489-72e6-4a2b-b2f6-dbb4863e4971", {
    method: "GET",
    redirect: "error",
    headers: { Authorization: `Bearer ${connection.apiToken}` },
    signal: AbortSignal.timeout(15000),
  });
  assert.ok(db.ok);
  const database = await db.json();
  assert.equal(database.success, true);
  assertDatabaseTarget(database.result);
  const target = root + "/workers/scripts/ithemba-donations-staging";
  const options = {
    method: "GET",
    redirect: "error",
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(30000),
  };
  const settingsResponse = await fetch(target + "/settings", options);
  assert.ok(settingsResponse.ok);
  const settings = await settingsResponse.json();
  assert.equal(settings.success, true);
  const bindings = settings.result.bindings;
  const bindingsDb = bindings.filter((b) => b.type === "d1");
  assert.equal(bindingsDb.length, 1);
  assert.equal(bindingsDb[0].name, "DONATIONS_DB");
  assert.equal(bindingsDb[0].id, "990e1489-72e6-4a2b-b2f6-dbb4863e4971");
  assert.ok(
    bindings.some(
      (b) => b.name === "STRIPE_DONATIONS_MODE" && b.type === "plain_text" && b.text === "test",
    ),
  );
  const response = await fetch(target, { ...options, signal: AbortSignal.timeout(30000) });
  assert.ok(response.ok);
  const code = await response.text();
  // Never print or store downloaded code/settings. Only fixed source fingerprints.
  console.log(
    `STAGING_STRIPE_SCRIPT_FINGERPRINT: ${JSON.stringify({ bytes: Buffer.byteLength(code), multipart: response.headers.get("content-type")?.includes("multipart") === true, hasDonationHandler: code.includes("STRIPE_ACCOUNT_ID") && code.includes("portal_unavailable"), hasSepaLiteral: code.includes("sepa_debit"), hasSepaParameter: /["']payment_method_types\[1\]["']\s*:\s*["']sepa_debit["']/.test(code), hasCardParameter: code.includes("payment_method_types[0]") && code.includes('"card"') })}`,
  );
  console.log(
    "STAGING_STRIPE_SCRIPT_AUDIT_READ_ONLY: exact staging Worker/database and test mode verified. No deploy, configuration, routes, secrets or production Worker accessed or changed.",
  );
}
main().catch(() => {
  console.error(
    "Read-only staging script audit incomplete. Raw settings, downloaded code and credentials omitted.",
  );
  process.exitCode = 1;
});
