import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

// Only the additive, reviewed PayPal migration is permitted. No Worker deployment here.
const database = "67acffe7-2412-44ce-817d-1d7f316d9392";
const account = "794969a4f7a2e41ac24852f2c006a8ef";
const marker = "Prepare owner-authorized direct PayPal live database";
const expected = {
  paypal_attempts: [
    "id",
    "owner",
    "cause",
    "requested_amount",
    "requested_frequency",
    "receipt_requested",
    "mode",
    "created_at",
  ],
  paypal_payments: [
    "txn_id",
    "attempt_id",
    "status",
    "amount",
    "rank",
    "purpose",
    "parent_txn_id",
    "subscription_id",
    "received_at",
  ],
};
let stage = "authorization";
try {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/direct-paypal-donations");
  assert.equal(process.env.GITHUB_EVENT_NAME, "push");
  const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
  assert.equal(event.head_commit?.message, marker);
  const sql = await readFile(new URL("../migrations/0002_paypal.sql", import.meta.url), "utf8");
  assert.equal(
    createHash("sha256").update(sql).digest("hex"),
    "26a7cf08692322e71ae2f2168f787a229e3ea40594641dda34f218386737f3bd",
  );
  const connection = JSON.parse(process.env.CLOUDFLARE_D1_STAGING ?? "null");
  assert.equal(connection?.accountId, account);
  assert.ok(typeof connection.apiToken === "string" && connection.apiToken.length > 20);
  console.log(`::add-mask::${connection.apiToken}`);
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${database}`;
  async function request(query) {
    const res = await fetch(endpoint + (query ? "/query" : ""), {
      method: query ? "POST" : "GET",
      redirect: "error",
      signal: AbortSignal.timeout(30000),
      headers: {
        Authorization: `Bearer ${connection.apiToken}`,
        "Content-Type": "application/json",
      },
      ...(query ? { body: JSON.stringify({ sql: query }) } : {}),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    if (query) assert.ok(Array.isArray(data.result) && data.result.every((r) => r.success));
    return data.result;
  }
  stage = "target";
  const target = await request();
  assert.equal(target.uuid, database);
  assert.equal(target.name, "ithemba-donations-live");
  async function stripeSchema() {
    const rows = await request(
      "SELECT name,sql FROM sqlite_master WHERE name IN ('donations','donation_events','donation_rate_limits','donations_customer') ORDER BY name",
    );
    assert.equal(rows[0].results.length, 4);
    return rows[0].results;
  }
  stage = "schema_baseline";
  const before = await stripeSchema();
  const tables = (
    await request("SELECT name FROM sqlite_master WHERE type='table'")
  )[0].results.map((r) => r.name);
  assert.ok(tables.includes("d1_migrations"));
  for (const [table, cols] of Object.entries(expected)) {
    if (tables.includes(table))
      assert.deepEqual(
        (await request(`PRAGMA table_info('${table}')`))[0].results.map((c) => c.name),
        cols,
      );
  }
  stage = "additive_migration";
  await request(`${sql}\nINSERT OR IGNORE INTO d1_migrations(name) VALUES ('0002_paypal.sql');`);
  stage = "verification";
  for (const [table, cols] of Object.entries(expected))
    assert.deepEqual(
      (await request(`PRAGMA table_info('${table}')`))[0].results.map((c) => c.name),
      cols,
    );
  assert.deepEqual(await stripeSchema(), before);
  const tracked = await request("SELECT name FROM d1_migrations WHERE name='0002_paypal.sql'");
  assert.equal(tracked[0].results.length, 1);
  console.log(
    JSON.stringify({
      state: "paypal_live_database_prepared",
      databaseId: database,
      additiveMigration: "0002_paypal.sql",
      stripeSchemaPreserved: true,
      workerChanged: false,
      paymentCreated: false,
    }),
  );
} catch {
  console.error(
    JSON.stringify({
      state: "paypal_live_database_preparation_incomplete",
      stage,
      secretOrDonorValuesPrinted: false,
    }),
  );
  process.exitCode = 1;
}
