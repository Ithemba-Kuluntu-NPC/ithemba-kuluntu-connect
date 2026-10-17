import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { experimental_readRawConfig, unstable_readConfig } from "wrangler";

export const STAGING_WORKER = "ithemba-donations-staging";
export const STAGING_DATABASE_ID = "990e1489-72e6-4a2b-b2f6-dbb4863e4971";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "wrangler.donations-staging.jsonc");

// Deliberately strict: new bindings, routes, environments or variables require review.
export function assertStagingIsolation(config) {
  const allowed = new Set([
    "$schema",
    "name",
    "main",
    "compatibility_date",
    "compatibility_flags",
    "workers_dev",
    "preview_urls",
    "routes",
    "assets",
    "no_bundle",
    "rules",
    "d1_databases",
    "vars",
  ]);
  assert.ok(
    Object.keys(config).every((key) => allowed.has(key)),
    "Unexpected staging configuration field",
  );
  assert.equal(
    config.name,
    STAGING_WORKER,
    "Staging must never target tanstack-start-app or another Worker",
  );
  assert.equal(config.main, ".output/server/index.mjs");
  assert.equal(config.compatibility_date, "2025-09-24");
  assert.deepEqual(config.compatibility_flags, ["nodejs_compat"]);
  assert.equal(config.workers_dev, true);
  assert.equal(config.preview_urls, false);
  assert.deepEqual(config.routes, [], "Staging must have no custom domains or production routes");
  assert.deepEqual(config.assets, { binding: "ASSETS", directory: ".output/public" });
  assert.equal(config.no_bundle, true);
  assert.deepEqual(config.rules, [{ type: "ESModule", globs: ["**/*.mjs", "**/*.js"] }]);
  assert.deepEqual(
    config.d1_databases,
    [
      {
        binding: "DONATIONS_DB",
        database_name: STAGING_WORKER,
        database_id: STAGING_DATABASE_ID,
        migrations_dir: "migrations",
      },
    ],
    "Only the dedicated staging D1 database may be bound",
  );
  assert.deepEqual(
    config.vars,
    {
      STRIPE_DONATIONS_MODE: "test",
      STRIPE_PAYPAL_ENABLED: "false",
      STRIPE_PAYPAL_RECURRING_ENABLED: "false",
      STRIPE_BANK_TRANSFER_ENABLED: "false",
    },
    "Staging must use test mode without secrets or unreviewed variables",
  );
}

export async function checkStaging({ built = false } = {}) {
  // These are local config parsers: no CLI login, API calls, secrets, migration or deployment.
  // An explicit config must beat even a production .wrangler/deploy/config.json redirect.
  const selected = experimental_readRawConfig(
    { config: configPath },
    { useRedirectIfAvailable: true },
  );
  assert.equal(resolve(selected.configPath), configPath);
  assert.equal(selected.redirected, false, "Do not follow a generated deployment configuration");
  assertStagingIsolation(selected.rawConfig);
  const normalized = unstable_readConfig({ config: configPath }, { hideWarnings: true });
  assert.equal(normalized.name, STAGING_WORKER);
  assert.equal(normalized.d1_databases[0].database_id, STAGING_DATABASE_ID);
  assert.deepEqual(normalized.routes, []);
  assert.equal(normalized.workers_dev, true);
  assert.equal(normalized.vars.STRIPE_DONATIONS_MODE, "test");
  const migration = resolve(root, "migrations/0001_donations.sql");
  await access(migration);
  assert.ok((await readFile(migration, "utf8")).includes("CREATE TABLE IF NOT EXISTS donations"));
  if (built) {
    assert.ok(
      (await stat(resolve(root, ".output/server/index.mjs"))).isFile(),
      "Build the Worker first",
    );
    assert.ok((await stat(resolve(root, ".output/public"))).isDirectory(), "Build assets first");
  }
  return { worker: normalized.name, database: STAGING_DATABASE_ID, configPath };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const args = process.argv.slice(2);
  assert.ok(
    args.length === 0 || (args.length === 1 && args[0] === "--built"),
    "Only --built is accepted; Worker/config/environment overrides are forbidden",
  );
  const result = await checkStaging({ built: args.includes("--built") });
  console.log(
    `Staging isolation verified: Worker ${result.worker}; DONATIONS_DB ${result.database}.`,
  );
  console.log(
    "Explicit --config wrangler.donations-staging.jsonc required. No remote action performed.",
  );
}
