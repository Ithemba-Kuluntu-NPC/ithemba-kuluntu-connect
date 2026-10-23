import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const LIVE_DATABASE_ID = "67acffe7-2412-44ce-817d-1d7f316d9392";
export const LIVE_DATABASE_NAME = "ithemba-donations-live";
const migrationHash = "e16b5ceebd1ee192b8df3a28f38babc80d8f8de343d3a68cf0d274e21f0e69e8";

export async function checkLiveDatabase({
  connectionValue = process.env.CLOUDFLARE_D1_STAGING,
  context = process.env,
  fetchImpl = fetch,
} = {}) {
  if (
    context.GITHUB_ACTIONS === "true" &&
    (context.GITHUB_REPOSITORY !== "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect" ||
      context.GITHUB_REF !== "refs/heads/codex/stripe-donations-integration" ||
      context.GITHUB_EVENT_NAME !== "push")
  ) {
    throw new Error("Untrusted live database preparation context");
  }
  if (!connectionValue)
    return { state: "cloudflare_connection_unavailable", migrationApplied: false };
  let connection;
  try {
    connection = JSON.parse(connectionValue);
  } catch {
    throw new Error("Invalid Cloudflare connection JSON");
  }
  if (
    !connection ||
    typeof connection !== "object" ||
    Array.isArray(connection) ||
    Object.keys(connection).sort().join(",") !== "accountId,apiToken" ||
    !/^[a-f0-9]{32}$/i.test(connection.accountId ?? "") ||
    typeof connection.apiToken !== "string" ||
    !/^[A-Za-z0-9_.-]{20,}$/.test(connection.apiToken)
  ) {
    throw new Error("Invalid Cloudflare connection fields");
  }
  const sql = await readFile(new URL("../migrations/0001_donations.sql", import.meta.url));
  if (createHash("sha256").update(sql).digest("hex") !== migrationHash) {
    throw new Error("Reviewed migration changed");
  }
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${connection.accountId}/d1/database/${LIVE_DATABASE_ID}`;
  async function request(query) {
    let response;
    try {
      response = await fetchImpl(endpoint + (query ? "/query" : ""), {
        method: query ? "POST" : "GET",
        redirect: "error",
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${connection.apiToken}`,
          "Content-Type": "application/json",
        },
        ...(query ? { body: JSON.stringify({ sql: query }) } : {}),
      });
    } catch {
      throw new Error("Cloudflare database check failed");
    }
    if (!response.ok)
      throw new Error(`Cloudflare database access failed (HTTP ${response.status})`);
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid Cloudflare response");
    }
    if (data.success !== true) throw new Error("Cloudflare rejected database check");
    return data.result;
  }
  const database = await request();
  if (database?.uuid !== LIVE_DATABASE_ID || database?.name !== LIVE_DATABASE_NAME) {
    throw new Error("Live database name/ID mismatch; no query performed");
  }
  // Inspection never creates or updates a migration tracker.
  const result = await request(
    "SELECT name, type FROM sqlite_master WHERE type IN ('table','index') AND name NOT GLOB 'sqlite_*' AND name NOT GLOB '_cf_*' ORDER BY name;",
  );
  if (
    !Array.isArray(result) ||
    result.length !== 1 ||
    result[0]?.success !== true ||
    !Array.isArray(result[0].results)
  )
    throw new Error("Incomplete database inspection");
  const empty = result[0].results.length === 0;
  const expected = [
    "d1_migrations:table",
    "donation_events:table",
    "donation_rate_limits:table",
    "donations:table",
    "donations_customer:index",
  ];
  let migrationRecorded = false;
  if (
    JSON.stringify(result[0].results.map((row) => `${row.name}:${row.type}`).sort()) ===
    JSON.stringify(expected)
  ) {
    const history = await request("SELECT name FROM d1_migrations ORDER BY id;");
    if (
      !Array.isArray(history) ||
      history.length !== 1 ||
      history[0]?.success !== true ||
      !Array.isArray(history[0].results)
    )
      throw new Error("Incomplete migration history inspection");
    migrationRecorded =
      history[0].results.length === 1 && history[0].results[0].name === "0001_donations.sql";
  }
  return {
    state: empty
      ? "live_database_empty_migration_pending"
      : migrationRecorded
        ? "live_database_initialized_migration_recorded"
        : "live_database_nonempty_review_required",
    databaseName: LIVE_DATABASE_NAME,
    databaseId: LIVE_DATABASE_ID,
    targetVerified: true,
    empty,
    pendingMigrations: empty ? ["0001_donations.sql"] : migrationRecorded ? [] : null,
    migrationRecorded,
    migrationHashVerified: true,
    migrationApplied: false,
    workerBindingChanged: false,
    readyForLaunch: false,
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.length !== 2)
      throw new Error("Read-only database checker accepts no arguments");
    console.log(JSON.stringify(await checkLiveDatabase()));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
