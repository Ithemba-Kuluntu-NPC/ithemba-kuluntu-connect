import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { checkStaging, STAGING_DATABASE_ID } from "./check-donations-staging.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const approvedHash = "e16b5ceebd1ee192b8df3a28f38babc80d8f8de343d3a68cf0d274e21f0e69e8";
const configPath = resolve(root, "wrangler.donations-staging.jsonc");
export function parseStagingConnection(value) {
  if (!value)
    throw new Error(
      "Cloudflare authorization is missing. Add the CLOUDFLARE_D1_STAGING GitHub Actions secret using the browser-only setup guide.",
    );
  let connection;
  try {
    connection = JSON.parse(value);
  } catch {
    throw new Error(
      "The Cloudflare staging connection must contain accountId and apiToken as JSON.",
    );
  }
  assert.ok(
    connection && typeof connection === "object" && !Array.isArray(connection),
    "Invalid staging connection",
  );
  assert.deepEqual(Object.keys(connection).sort(), ["accountId", "apiToken"]);
  assert.match(connection.accountId, /^[a-f0-9]{32}$/i, "Invalid Cloudflare account ID");
  assert.ok(
    typeof connection.apiToken === "string" && /^[A-Za-z0-9_.-]{20,}$/.test(connection.apiToken),
    "Invalid Cloudflare API token",
  );
  return connection;
}
export function assertApprovedMigration(names, sql) {
  assert.deepEqual(
    names.filter((name) => name.endsWith(".sql")).sort(),
    ["0001_donations.sql"],
    "Only the already-approved first migration may run",
  );
  assert.equal(
    createHash("sha256").update(sql).digest("hex"),
    approvedHash,
    "The approved migration changed; remote execution refused",
  );
}
export function assertDatabaseTarget(database) {
  assert.equal(database?.uuid, STAGING_DATABASE_ID, "Cloudflare returned a different database ID");
  assert.equal(
    database?.name,
    "ithemba-donations-staging",
    "Cloudflare returned a different database name",
  );
}
export async function migrateStaging({
  connectionValue = process.env.CLOUDFLARE_D1_STAGING,
  fetchImpl = fetch,
  run = execFileSync,
} = {}) {
  const connection = parseStagingConnection(connectionValue);
  await checkStaging();
  assertApprovedMigration(
    await readdir(resolve(root, "migrations")),
    await readFile(resolve(root, "migrations/0001_donations.sql")),
  );
  if (process.env.GITHUB_ACTIONS === "true") {
    console.log(`::add-mask::${connection.apiToken}`);
    assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
    assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
    assert.equal(process.env.GITHUB_EVENT_NAME, "push");
  }
  const databasePath = `https://api.cloudflare.com/client/v4/accounts/${connection.accountId}/d1/database/${STAGING_DATABASE_ID}`;
  async function api(path, payload) {
    const res = await fetchImpl(`${databasePath}${path}`, {
      method: payload ? "POST" : "GET",
      redirect: "error",
      signal: AbortSignal.timeout(30000),
      headers: {
        Authorization: `Bearer ${connection.apiToken}`,
        "Content-Type": "application/json",
      },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });
    // Never print credentials, connection JSON, or raw Cloudflare error responses.
    if (!res.ok)
      throw new Error(
        `Cloudflare staging access failed (HTTP ${res.status}); check account, token and D1 permissions.`,
      );
    const data = await res.json();
    if (data.success !== true) throw new Error("Cloudflare rejected the staging database request.");
    return data.result;
  }
  // Authenticate against this exact account/database before any schema write.
  assertDatabaseTarget(await api(""));
  console.log(`Verified staging database: ithemba-donations-staging (${STAGING_DATABASE_ID}).`);
  const args = ["d1", "migrations"];
  const target = ["ithemba-donations-staging", "--remote", "--config", configPath];
  const options = {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      CLOUDFLARE_D1_STAGING: "",
      CLOUDFLARE_API_TOKEN: connection.apiToken,
      CLOUDFLARE_ACCOUNT_ID: connection.accountId,
      CI: "true",
      WRANGLER_SEND_METRICS: "false",
    },
  };
  // These are the only allowed CLI commands: there is no build/deploy/secret/DNS operation.
  run(
    process.execPath,
    [resolve(root, "node_modules/wrangler/bin/wrangler.js"), ...args, "list", ...target],
    options,
  );
  run(
    process.execPath,
    [resolve(root, "node_modules/wrangler/bin/wrangler.js"), ...args, "apply", ...target],
    options,
  );
  const result = await api("/query", {
    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('donations','donation_events','donation_rate_limits','d1_migrations') ORDER BY name;",
  });
  assert.deepEqual(
    result
      .flatMap((item) => item.results ?? [])
      .map((row) => row.name)
      .sort(),
    ["d1_migrations", "donation_events", "donation_rate_limits", "donations"],
  );
  const applied = await api("/query", {
    sql: "SELECT name FROM d1_migrations WHERE name = ?;",
    params: ["0001_donations.sql"],
  });
  assert.equal(applied[0]?.results?.[0]?.name, "0001_donations.sql");
  console.log(
    "Verified all four staging tables and the 0001_donations.sql migration record. No Worker deployed.",
  );
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  assert.equal(process.argv.length, 2, "This staging-only helper accepts no target overrides");
  try {
    await migrateStaging();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
