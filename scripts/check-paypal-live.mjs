import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Read-only preflight using the existing GitHub Cloudflare connections.
const marker = "Inspect direct PayPal live readiness without changing production";
const worker = "tanstack-start-app";
const database = "67acffe7-2412-44ce-817d-1d7f316d9392";
let stage = "authorization";
try {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/direct-paypal-donations");
  assert.equal(process.env.GITHUB_EVENT_NAME, "push");
  const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
  assert.equal(event.head_commit?.message, marker);
  const connection = JSON.parse(process.env.CLOUDFLARE_D1_STAGING ?? "null");
  assert.equal(connection?.accountId, "794969a4f7a2e41ac24852f2c006a8ef");
  const token = process.env.CLOUDFLARE_WORKER_STAGING_TOKEN;
  assert.ok(typeof token === "string" && token.length > 20);
  assert.ok(typeof connection.apiToken === "string" && connection.apiToken.length > 20);
  for (const value of [token, connection.apiToken]) console.log(`::add-mask::${value}`);
  const base = `https://api.cloudflare.com/client/v4/accounts/${connection.accountId}`;
  async function cf(path, { db = false, sql } = {}) {
    const response = await fetch(base + path, {
      method: sql ? "POST" : "GET",
      redirect: "error",
      signal: AbortSignal.timeout(30000),
      headers: {
        Authorization: `Bearer ${db ? connection.apiToken : token}`,
        "Content-Type": "application/json",
      },
      ...(sql ? { body: JSON.stringify({ sql }) } : {}),
    });
    assert.equal(response.status, 200, `Cloudflare inspection failed at ${stage}`);
    const data = await response.json();
    assert.equal(data.success, true);
    return data.result;
  }
  stage = "active_versions";
  const deploymentResult = await cf(`/workers/scripts/${worker}/deployments`);
  const deployments = Array.isArray(deploymentResult)
    ? deploymentResult
    : deploymentResult.deployments;
  const active = [...deployments].sort(
    (a, b) => Date.parse(b.created_on) - Date.parse(a.created_on),
  )[0];
  assert.equal(
    active.versions.reduce((sum, v) => sum + v.percentage, 0),
    100,
  );
  stage = "bindings";
  const settings = await cf(`/workers/scripts/${worker}/settings`);
  assert.equal(settings.compatibility_date, "2025-09-24");
  assert.deepEqual(settings.compatibility_flags, ["nodejs_compat"]);
  const requiredSecrets = [
    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
    "STRIPE_ACCOUNT_ID",
    "STRIPE_WEBHOOK_SECRET",
    "DONATION_COOKIE_SECRET",
    "DONATION_SITE_ORIGIN",
    "STRIPE_PORTAL_CONFIGURATION_ID",
    "STRIPE_PORTAL_LOGIN_URL",
    "BREVO_API_KEY",
    "TURNSTILE_SECRET_KEY",
  ];
  for (const traffic of active.versions.filter((v) => v.percentage > 0)) {
    const version = await cf(`/workers/scripts/${worker}/versions/${traffic.version_id}`);
    const bindings = version.resources.bindings;
    for (const name of requiredSecrets)
      assert.ok(
        bindings.some((b) => b.name === name && b.type === "secret_text"),
        `Required binding missing: ${name}`,
      );
    for (const [name, text] of Object.entries({
      STRIPE_DONATIONS_MODE: "live",
      STRIPE_PAYPAL_ENABLED: "false",
      STRIPE_PAYPAL_RECURRING_ENABLED: "false",
      STRIPE_BANK_TRANSFER_ENABLED: "false",
    }))
      assert.ok(
        bindings.some((b) => b.name === name && b.type === "plain_text" && b.text === text),
        `Required setting differs: ${name}`,
      );
    assert.ok(
      bindings.some((b) => b.name === "DONATIONS_DB" && b.type === "d1" && b.id === database),
    );
    assert.ok(bindings.some((b) => b.name === "ASSETS" && b.type === "assets"));
  }
  stage = "domain";
  const domains = await cf("/workers/domains");
  assert.ok(
    domains.some(
      (d) =>
        d.hostname === "ithembakuluntu.org" &&
        d.service === worker &&
        d.environment === "production",
    ),
  );
  stage = "database";
  const target = await cf(`/d1/database/${database}`, { db: true });
  assert.equal(target.uuid, database);
  assert.equal(target.name, "ithemba-donations-live");
  const result = await cf(`/d1/database/${database}/query`, {
    db: true,
    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('donations','donation_events','donation_rate_limits','paypal_attempts','paypal_payments') ORDER BY name",
  });
  assert.equal(result[0].success, true);
  const tables = result[0].results.map((r) => r.name);
  assert.ok(
    ["donations", "donation_events", "donation_rate_limits"].every((t) => tables.includes(t)),
  );
  const migrationNeeded =
    !tables.includes("paypal_attempts") || !tables.includes("paypal_payments");
  stage = "public_health";
  for (const path of ["/", "/donate", "/contact", "/projects/greenhouse"]) {
    const response = await fetch(`https://ithembakuluntu.org${path}`, {
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
    assert.equal(response.status, 200);
    await response.body?.cancel();
  }
  const response = await fetch("https://ithembakuluntu.org/api/donations/config", {
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, 200);
  const stripe = await response.json();
  assert.equal(stripe.mode, "live");
  assert.match(stripe.publishableKey ?? "", /^pk_live_/);
  const report = {
    state: "paypal_live_preflight_passed",
    activeVersions: active.versions,
    stripeBindingsPreserved: true,
    stripePayPalDisabled: true,
    liveDatabaseVerified: true,
    paypalMigrationNeeded: migrationNeeded,
    paypalBindingNames: (settings.bindings ?? [])
      .filter((b) => b.name.startsWith("PAYPAL_"))
      .map((b) => b.name),
    publicPagesHealthy: true,
    canonicalDomainVerified: true,
    paymentCreated: false,
    workerChanged: false,
    databaseChanged: false,
  };
  console.log(JSON.stringify(report));
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFile } = await import("node:fs/promises");
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `Read-only live PayPal preflight passed. Stripe, domain and live database verified. PayPal migration needed: ${migrationNeeded}. No payments, deployment or database changes.\n`,
    );
  }
} catch {
  console.error(
    JSON.stringify({
      state: "paypal_live_preflight_incomplete",
      stage,
      secretOrDonorValuesPrinted: false,
    }),
  );
  process.exitCode = 1;
}
