import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  assertLaunchAuthorization,
  assertLiveBindings,
  liveConfig,
  deployLive,
  APPROVAL_MESSAGE,
  WORKER,
  ORIGIN,
} from "../scripts/deploy-donations-live.mjs";
import { LIVE_DATABASE_ID } from "../scripts/check-donations-live-database.mjs";

const context = {
  GITHUB_ACTIONS: "true",
  GITHUB_REPOSITORY: "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect",
  GITHUB_REF: "refs/heads/codex/stripe-donations-integration",
  GITHUB_EVENT_NAME: "push",
};
const baselineBindings = [
  { name: "ASSETS", type: "assets" },
  { name: "BREVO_API_KEY", type: "secret_text" },
  { name: "TURNSTILE_SECRET_KEY", type: "secret_text" },
];
const secretNames = [
  "STRIPE_SECRET_KEY",
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_ACCOUNT_ID",
  "STRIPE_WEBHOOK_SECRET",
  "DONATION_COOKIE_SECRET",
  "DONATION_SITE_ORIGIN",
  "STRIPE_PORTAL_CONFIGURATION_ID",
  "STRIPE_PORTAL_LOGIN_URL",
];
const settings = {
  bindings: baselineBindings,
  compatibility_date: "2025-09-24",
  compatibility_flags: ["nodejs_compat"],
};
function bindings() {
  return [
    ...baselineBindings,
    ...secretNames.map((name) => ({ name, type: "secret_text" })),
    { name: "DONATIONS_DB", type: "d1", id: LIVE_DATABASE_ID },
    ...[
      "STRIPE_DONATIONS_MODE",
      "STRIPE_PAYPAL_ENABLED",
      "STRIPE_PAYPAL_RECURRING_ENABLED",
      "STRIPE_BANK_TRANSFER_ENABLED",
    ].map((name) => ({
      name,
      type: "plain_text",
      text: name === "STRIPE_DONATIONS_MODE" ? "live" : "false",
    })),
  ];
}

test("live launch rejects wrong approval, branch and event before requests or uploads", async () => {
  assertLaunchAuthorization(context, APPROVAL_MESSAGE);
  for (const change of [
    { message: "unapproved" },
    { context: { ...context, GITHUB_REF: "refs/heads/main" } },
    { context: { ...context, GITHUB_EVENT_NAME: "pull_request" } },
  ]) {
    let called = false;
    await assert.rejects(
      deployLive({
        context: change.context ?? context,
        approvalMessage: change.message ?? APPROVAL_MESSAGE,
        plan: {},
        fetchImpl: () => {
          called = true;
        },
        run: () => {
          called = true;
        },
      }),
    );
    assert.equal(called, false);
  }
});
test("temporary config uses exact live database and preserves asset/runtime settings without triggers", () => {
  const config = liveConfig(
    { ...settings, assets: { config: { html_handling: "none" } }, limits: { cpu_ms: 30 } },
    "/tmp/build",
  );
  assert.equal(config.name, WORKER);
  assert.equal(config.d1_databases[0].database_id, LIVE_DATABASE_ID);
  assert.equal(config.assets.html_handling, "none");
  assert.equal(config.limits.cpu_ms, 30);
  assert.equal(config.keep_vars, true);
  for (const key of ["routes", "workers_dev", "preview_urls", "logpush", "observability"])
    assert.equal(Object.hasOwn(config, key), false);
});
test("inactive version must retain both integration secrets and exact safe live bindings", () => {
  assertLiveBindings(bindings());
  for (const changed of [
    bindings().filter((b) => b.name !== "BREVO_API_KEY"),
    bindings().map((b) => (b.name === "DONATIONS_DB" ? { ...b, id: "staging" } : b)),
    bindings().map((b) => (b.name === "STRIPE_DONATIONS_MODE" ? { ...b, text: "test" } : b)),
    [...bindings(), { name: "UNAPPROVED", type: "plain_text", text: "x" }],
  ])
    assert.throws(() => assertLiveBindings(changed));
});
test("all required version binding names are unique", () => {
  const names = bindings().map((b) => b.name);
  assert.equal(new Set(names).size, names.length);
});
test("deployment primitive uploads inactive versions and never changes routes or DNS", () => {
  const source = readFileSync(
    new URL("../scripts/deploy-donations-live.mjs", import.meta.url),
    "utf8",
  );
  assert.match(source, /"versions",\s*"upload"/);
  assert.doesNotMatch(source, /"triggers"|\/dns_records|"secret",\s*"put"|git.*merge/);
  assert.match(source, /assertLiveBindings\(version\.resources\?\.bindings\)/);
});

test("default production builds retain the exact live D1 binding and existing dashboard variables", () => {
  const config = JSON.parse(readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
  assert.equal(config.name, WORKER);
  assert.equal(config.main, "src/server.ts");
  assert.equal(config.keep_vars, true);
  assert.equal(config.compatibility_date, "2025-09-24");
  assert.deepEqual(config.compatibility_flags, ["nodejs_compat"]);
  assert.deepEqual(config.d1_databases, [{
    binding: "DONATIONS_DB",
    database_name: "ithemba-donations-live",
    database_id: LIVE_DATABASE_ID,
    migrations_dir: "migrations",
  }]);
  assert.deepEqual(config.vars, {
    STRIPE_DONATIONS_MODE: "live",
    STRIPE_PAYPAL_ENABLED: "false",
    STRIPE_PAYPAL_RECURRING_ENABLED: "false",
    STRIPE_BANK_TRANSFER_ENABLED: "false",
  });
  for (const name of secretNames) assert.equal(Object.hasOwn(config.vars, name), false);
  assert.equal(Object.hasOwn(config, "routes"), false);
});
