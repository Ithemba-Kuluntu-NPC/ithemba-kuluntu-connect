import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  checkLiveDatabase,
  LIVE_DATABASE_ID,
  LIVE_DATABASE_NAME,
} from "./check-donations-live-database.mjs";

export const LIVE_MIGRATION_APPROVAL = "Apply approved live donations database migration only";
const filename = "0001_donations.sql";
const expectedObjects = [
  "d1_migrations:table",
  "donation_events:table",
  "donation_rate_limits:table",
  "donations:table",
  "donations_customer:index",
];
const expectedColumns = {
  donations: [
    "id:TEXT",
    "owner:TEXT",
    "fingerprint:TEXT",
    "created_at:INTEGER",
    "session_id:TEXT",
    "customer_id:TEXT",
    "frequency:TEXT",
    "status:TEXT",
    "updated_at:INTEGER",
    "webhook_at:INTEGER",
  ],
  donation_events: ["id:TEXT", "type:TEXT", "donation_id:TEXT", "received_at:INTEGER"],
  donation_rate_limits: ["id:TEXT", "attempts:INTEGER", "expires_at:INTEGER"],
};

export async function migrateLiveDatabase({
  connectionValue = process.env.CLOUDFLARE_D1_STAGING,
  approval = process.env.DONATIONS_LIVE_MIGRATION_APPROVED,
  approvalMessage,
  context = process.env,
  fetchImpl = fetch,
  report = () => {},
} = {}) {
  assert.equal(approval, LIVE_DATABASE_ID, "Exact live database migration approval is required");
  assert.equal(approvalMessage, LIVE_MIGRATION_APPROVAL, "Approved migration marker is required");
  // Validates credentials, context, immutable migration hash and authenticated name/ID.
  const inspection = await checkLiveDatabase({ connectionValue, context, fetchImpl });
  assert.equal(inspection.targetVerified, true, "Live database authorization is unavailable");
  const connection = JSON.parse(connectionValue);
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${connection.accountId}/d1/database/${LIVE_DATABASE_ID}/query`;
  async function query(sql) {
    let response;
    try {
      response = await fetchImpl(endpoint, {
        method: "POST",
        redirect: "error",
        signal: AbortSignal.timeout(30000),
        headers: {
          Authorization: `Bearer ${connection.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      });
    } catch {
      throw new Error("Live migration request failed; inspect state before retrying");
    }
    if (!response.ok) throw new Error(`Live migration access failed (HTTP ${response.status})`);
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid live migration response");
    }
    if (
      data.success !== true ||
      !Array.isArray(data.result) ||
      data.result.length === 0 ||
      !data.result.every((item) => item.success === true && Array.isArray(item.results))
    ) {
      throw new Error("Live migration query failed; inspect state before retrying");
    }
    return data.result;
  }
  async function verify() {
    const objects = await query(
      "SELECT name, type FROM sqlite_master WHERE type IN ('table','index') AND name NOT GLOB 'sqlite_*' AND name NOT GLOB '_cf_*' ORDER BY name;",
    );
    assert.deepEqual(
      objects[0].results.map((r) => `${r.name}:${r.type}`).sort(),
      expectedObjects,
      "Unexpected live schema objects",
    );
    for (const [table, columns] of Object.entries(expectedColumns)) {
      const result = await query(`PRAGMA table_info('${table}');`);
      assert.deepEqual(
        result[0].results.map((r) => `${r.name}:${r.type}`),
        columns,
        "Live table columns mismatch",
      );
    }
    const index = await query("PRAGMA index_info('donations_customer');");
    assert.deepEqual(
      index[0].results.map((r) => r.name),
      ["customer_id"],
      "Live customer index mismatch",
    );
    const record = await query("SELECT name FROM d1_migrations ORDER BY id;");
    assert.deepEqual(
      record[0].results.map((r) => r.name),
      [filename],
      "Unexpected migration history",
    );
  }
  if (!inspection.empty) {
    // Reruns can verify a completed migration, but never modify a nonempty database.
    await verify();
    return {
      state: "live_migration_already_applied_verified",
      databaseName: LIVE_DATABASE_NAME,
      databaseId: LIVE_DATABASE_ID,
      pendingMigrations: [],
      migrationApplied: false,
      schemaVerified: true,
      workerBindingChanged: false,
      readyForLaunch: false,
    };
  }
  report({
    state: "verified_empty_live_database",
    databaseName: LIVE_DATABASE_NAME,
    databaseId: LIVE_DATABASE_ID,
    pendingMigrations: [filename],
  });
  const sql = await readFile(new URL("../migrations/0001_donations.sql", import.meta.url), "utf8");
  // D1 REST supports semicolon-separated statements as a batch. The tracker schema
  // matches Wrangler's standard migration table. No Worker/config/secret API exists here.
  await query(
    `CREATE TABLE IF NOT EXISTS d1_migrations(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);\n${sql}\nINSERT INTO d1_migrations(name) VALUES ('0001_donations.sql');`,
  );
  await verify();
  const counts = await query(
    "SELECT (SELECT COUNT(*) FROM donations) + (SELECT COUNT(*) FROM donation_events) + (SELECT COUNT(*) FROM donation_rate_limits) AS total;",
  );
  assert.equal(counts[0].results[0]?.total, 0, "Initialized live ledger must be empty");
  return {
    state: "live_migration_applied_verified",
    databaseName: LIVE_DATABASE_NAME,
    databaseId: LIVE_DATABASE_ID,
    pendingMigrations: [],
    migrationApplied: true,
    schemaVerified: true,
    ledgerEmpty: true,
    workerBindingChanged: false,
    readyForLaunch: false,
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    assert.equal(process.argv.length, 2, "Live migration accepts no target overrides");
    assert.equal(process.env.GITHUB_ACTIONS, "true", "Run only in the approved GitHub workflow");
    const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
    console.log(
      JSON.stringify(
        await migrateLiveDatabase({
          approvalMessage: event.head_commit?.message,
          report: (result) => console.log(JSON.stringify(result)),
        }),
      ),
    );
  } catch {
    console.error(
      "Live migration did not pass all safeguards. No deployment was performed; inspect the fixed target before retrying.",
    );
    process.exitCode = 1;
  }
}
