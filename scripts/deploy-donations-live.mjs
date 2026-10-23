import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  checkLiveAccount,
  parseLiveConnection,
  LIVE_PREPARATION_API_VERSION,
} from "./check-stripe-live-account.mjs";
import { livePortalFlags } from "./check-stripe-live-portal.mjs";
import { checkLiveSigningSecret } from "./check-stripe-live-signing-secret.mjs";
import { checkLiveDatabase, LIVE_DATABASE_ID } from "./check-donations-live-database.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const APPROVAL_MESSAGE = "Deploy owner-approved live Stripe donations without merging";
export const APPROVED_SOURCE = "74b7a8eb8caf3fe5366d2b0cfbdc4764b4deae53";
export const WORKER = "tanstack-start-app";
export const ORIGIN = "https://ithembakuluntu.org";
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const stable = (value) =>
  Array.isArray(value)
    ? value.map(stable)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, stable(value[key])]),
        )
      : value;
const fingerprint = (value) =>
  createHash("sha256")
    .update(JSON.stringify(stable(value)))
    .digest("hex");
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
const vars = {
  STRIPE_DONATIONS_MODE: "live",
  STRIPE_PAYPAL_ENABLED: "false",
  STRIPE_PAYPAL_RECURRING_ENABLED: "false",
  STRIPE_BANK_TRANSFER_ENABLED: "false",
};
let phase = "authorization";

export function assertLaunchAuthorization(context, message) {
  assert.equal(context.GITHUB_ACTIONS, "true");
  assert.equal(context.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(context.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  assert.equal(context.GITHUB_EVENT_NAME, "push");
  assert.equal(message, APPROVAL_MESSAGE, "The approved live launch marker is required");
}
export function liveConfig(settings, directory = root) {
  assert.equal(settings.compatibility_date, "2025-09-24");
  assert.deepEqual(settings.compatibility_flags, ["nodejs_compat"]);
  const config = {
    name: WORKER,
    main: resolve(directory, ".output/server/index.mjs"),
    compatibility_date: settings.compatibility_date,
    compatibility_flags: settings.compatibility_flags,
    assets: {
      binding: "ASSETS",
      directory: resolve(directory, ".output/public"),
      ...(settings.assets?.config ?? {}),
    },
    no_bundle: true,
    rules: [{ type: "ESModule", globs: ["**/*.mjs", "**/*.js"] }],
    keep_vars: true,
    d1_databases: [
      {
        binding: "DONATIONS_DB",
        database_name: "ithemba-donations-live",
        database_id: LIVE_DATABASE_ID,
        migrations_dir: resolve(directory, "migrations"),
      },
    ],
    vars,
  };
  if (settings.limits) config.limits = settings.limits;
  if (settings.placement?.mode === "smart") config.placement = settings.placement;
  if (settings.cache) config.cache = settings.cache;
  // Versions upload does not deploy triggers or change non-versioned settings.
  // No route, DNS, workers.dev, logpush or observability operation is permitted.
  return config;
}
export function assertLiveBindings(bindings) {
  assert.ok(Array.isArray(bindings));
  const expected = [
    "ASSETS",
    "BREVO_API_KEY",
    "TURNSTILE_SECRET_KEY",
    "DONATIONS_DB",
    ...secretNames,
    ...Object.keys(vars),
  ].sort();
  assert.deepEqual(
    bindings.map((b) => b.name).sort(),
    expected,
    "Unexpected/missing production bindings",
  );
  for (const name of ["BREVO_API_KEY", "TURNSTILE_SECRET_KEY", ...secretNames])
    assert.equal(
      bindings.find((b) => b.name === name)?.type,
      "secret_text",
      "A preserved/donation secret is missing",
    );
  assert.equal(bindings.find((b) => b.name === "ASSETS")?.type, "assets");
  const db = bindings.find((b) => b.name === "DONATIONS_DB");
  assert.equal(db?.type, "d1");
  assert.equal(db?.id, LIVE_DATABASE_ID);
  for (const [name, text] of Object.entries(vars)) {
    const binding = bindings.find((b) => b.name === name);
    assert.equal(binding?.type, "plain_text");
    assert.equal(binding?.text, text);
  }
}
export async function deployLive({
  context = process.env,
  approvalMessage,
  fetchImpl = fetch,
  run = execFileSync,
  plan,
} = {}) {
  assertLaunchAuthorization(context, approvalMessage);
  plan ??= JSON.parse(
    await readFile(resolve(root, "config/stripe-donations-launch-plan.json"), "utf8"),
  );
  assert.equal(plan.target.worker, WORKER);
  assert.equal(plan.target.origin, ORIGIN);
  assert.equal(plan.target.database.id, LIVE_DATABASE_ID);
  // Future operational helper edits cannot quietly change approved application/site code.
  run(
    "git",
    [
      "diff",
      "--exit-code",
      APPROVED_SOURCE,
      "HEAD",
      "--",
      ".",
      ":(exclude)scripts",
      ":(exclude)tests",
      ":(exclude)docs",
      ":(exclude)config",
      ":(exclude).github",
    ],
    { cwd: root, stdio: "pipe" },
  );
  const cloudflare = JSON.parse(context.CLOUDFLARE_D1_STAGING ?? "null");
  assert.ok(cloudflare && /^[a-f0-9]{32}$/i.test(cloudflare.accountId ?? ""));
  const token = context.CLOUDFLARE_WORKER_STAGING_TOKEN;
  assert.ok(typeof token === "string" && /^[A-Za-z0-9_.-]{20,}$/.test(token));
  const connection = parseLiveConnection(context.STRIPE_LIVE_CONNECTION);
  assert.equal(
    checkLiveSigningSecret({
      live: context.STRIPE_LIVE_WEBHOOK_SECRET,
      sandbox: context.STRIPE_SANDBOX_WEBHOOK_SECRET,
    }).preparedForApproval,
    true,
  );
  for (const value of [
    token,
    cloudflare.apiToken,
    connection.restrictedKey,
    connection.publishableKey,
    context.STRIPE_LIVE_WEBHOOK_SECRET,
  ])
    console.log(`::add-mask::${value}`);
  const account = await checkLiveAccount({
    connectionValue: context.STRIPE_LIVE_CONNECTION,
    context,
    fetchImpl,
  });
  assert.ok(
    account.accountMatches &&
      account.germanAccount &&
      account.detailsSubmitted &&
      account.chargesEnabled &&
      account.payoutsEnabled,
  );
  assert.notEqual(account.requirementsStatus, "action_required");
  const database = await checkLiveDatabase({
    connectionValue: context.CLOUDFLARE_D1_STAGING,
    context,
    fetchImpl,
  });
  assert.equal(database.migrationRecorded, true);
  assert.deepEqual(database.pendingMigrations, []);
  async function cf(path, payload) {
    let res;
    try {
      res = await fetchImpl(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflare.accountId}${path}`,
        {
          method: payload ? "POST" : "GET",
          redirect: "error",
          signal: AbortSignal.timeout(30000),
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          ...(payload ? { body: JSON.stringify(payload) } : {}),
        },
      );
    } catch {
      throw new Error("Cloudflare launch request could not be reached");
    }
    if (!res.ok) throw new Error(`Cloudflare launch request failed (HTTP ${res.status})`);
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid Cloudflare launch response");
    }
    if (data.success !== true) throw new Error("Cloudflare launch request rejected");
    return data.result;
  }
  const prefix = `/workers/scripts/${WORKER}`;
  phase = "production_baseline";
  const before = await cf(prefix + "/settings");
  assert.equal(
    fingerprint(before),
    plan.productionBaseline.settingsFingerprint,
    "Production settings drifted; no upload allowed",
  );
  const nonVersioned = await cf(prefix + "/script-settings");
  const domains = await cf("/workers/domains");
  const ourDomains = (all) =>
    all.filter((d) => d.service === WORKER && d.environment === "production");
  assert.ok(ourDomains(domains).some((d) => d.hostname === "ithembakuluntu.org"));
  async function deployedVersions() {
    const result = await cf(prefix + "/deployments");
    const entries = Array.isArray(result) ? result : result.deployments;
    assert.ok(entries?.length);
    return [...entries].sort((a, b) => Date.parse(b.created_on) - Date.parse(a.created_on))[0]
      .versions;
  }
  const originalVersions = plan.productionBaseline.rollback.versions;
  assert.deepEqual(
    await deployedVersions(),
    originalVersions,
    "Production traffic changed since approval review",
  );
  let portalResponse;
  try {
    portalResponse = await fetchImpl(
      "https://api.stripe.com/v1/billing_portal/configurations?active=true&limit=100",
      {
        method: "GET",
        redirect: "error",
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${connection.restrictedKey}`,
          "Stripe-Version": LIVE_PREPARATION_API_VERSION,
        },
      },
    );
  } catch {
    throw new Error("Live Portal could not be read");
  }
  assert.ok(portalResponse.ok);
  const portals = await portalResponse.json();
  assert.equal(portals.has_more, false);
  const eligible = portals.data.filter((c) => Object.values(livePortalFlags(c)).every(Boolean));
  const defaults = eligible.filter((c) => c.is_default);
  const portal = defaults.length === 1 ? defaults[0] : eligible.length === 1 ? eligible[0] : null;
  assert.ok(portal, "Expected exact approved live Portal");
  const cookie = randomBytes(32).toString("hex");
  for (const value of [cookie, portal.id, portal.login_page.url])
    console.log(`::add-mask::${value}`);
  const secrets = {
    STRIPE_SECRET_KEY: connection.restrictedKey,
    STRIPE_PUBLISHABLE_KEY: connection.publishableKey,
    STRIPE_ACCOUNT_ID: connection.accountId,
    STRIPE_WEBHOOK_SECRET: context.STRIPE_LIVE_WEBHOOK_SECRET,
    DONATION_COOKIE_SECRET: cookie,
    DONATION_SITE_ORIGIN: ORIGIN,
    STRIPE_PORTAL_CONFIGURATION_ID: portal.id,
    STRIPE_PORTAL_LOGIN_URL: portal.login_page.url,
  };
  const directory = await mkdtemp(resolve(tmpdir(), "ithemba-live-launch-"));
  let trafficChanged = false;
  try {
    const configPath = resolve(directory, "worker.json");
    const secretsPath = resolve(directory, "secrets.json");
    await writeFile(configPath, JSON.stringify(liveConfig(before)), { mode: 0o600 });
    await writeFile(secretsPath, JSON.stringify(secrets), { mode: 0o600 });
    const env = Object.fromEntries(
      Object.entries(context).filter(
        ([key]) => !/^(STRIPE_|DONATION_|CLOUDFLARE_|WRANGLER_)/.test(key),
      ),
    );
    Object.assign(env, {
      CLOUDFLARE_API_TOKEN: token,
      CLOUDFLARE_ACCOUNT_ID: cloudflare.accountId,
      WRANGLER_SEND_METRICS: "false",
      WRANGLER_LOG_PATH: resolve(directory, "wrangler.log"),
      CI: "true",
    });
    phase = "inactive_version_upload";
    let output;
    try {
      output = run(
        process.execPath,
        [
          resolve(root, "node_modules/wrangler/bin/wrangler.js"),
          "versions",
          "upload",
          "--config",
          configPath,
          "--secrets-file",
          secretsPath,
          "--message",
          "Owner-approved Stripe donation launch",
        ],
        { cwd: root, env, encoding: "utf8", stdio: "pipe", maxBuffer: 20 * 1024 * 1024 },
      );
    } catch {
      throw new Error(
        "Inactive Worker version upload failed; traffic was not switched. Provider output withheld to protect secrets.",
      );
    }
    const id = output.match(/Worker Version ID:\s*([a-f0-9-]{36})/i)?.[1];
    assert.ok(uuid.test(id ?? ""), "Uploaded version ID unavailable; traffic remains unchanged");
    phase = "inactive_version_verification";
    const version = await cf(prefix + `/versions/${id}`);
    assertLiveBindings(version.resources?.bindings);
    assert.equal(version.resources.script_runtime.compatibility_date, before.compatibility_date);
    assert.deepEqual(
      version.resources.script_runtime.compatibility_flags,
      before.compatibility_flags,
    );
    assert.deepEqual(
      await cf(prefix + "/script-settings"),
      nonVersioned,
      "Non-versioned settings changed during upload",
    );
    assert.deepEqual(ourDomains(await cf("/workers/domains")), ourDomains(domains));
    assert.deepEqual(
      await deployedVersions(),
      originalVersions,
      "Traffic changed during inactive upload",
    );
    console.log(
      JSON.stringify({
        state: "inactive_live_version_verified",
        versionId: id,
        existingSecretsPreserved: true,
        liveDatabaseVerified: true,
        routesUnchanged: true,
        trafficChanged: false,
      }),
    );
    phase = "production_traffic_switch";
    trafficChanged = true;
    await cf(prefix + "/deployments", {
      strategy: "percentage",
      versions: [{ version_id: id, percentage: 100 }],
    });
    assert.deepEqual(await deployedVersions(), [{ version_id: id, percentage: 100 }]);
    assertLiveBindings((await cf(prefix + "/settings")).bindings);
    assert.deepEqual(await cf(prefix + "/script-settings"), nonVersioned);
    assert.deepEqual(ourDomains(await cf("/workers/domains")), ourDomains(domains));
    phase = "public_verification";
    for (const path of ["/", "/donate", "/contact"]) {
      const res = await fetchImpl(ORIGIN + path, {
        method: "GET",
        redirect: "error",
        signal: AbortSignal.timeout(30000),
      });
      assert.equal(res.status, 200, "Public page did not pass deployment verification");
      await res.body?.cancel();
    }
    const response = await fetchImpl(ORIGIN + "/api/donations/config", {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(30000),
    });
    assert.equal(response.status, 200);
    const config = await response.json();
    assert.equal(config.mode, "live");
    assert.equal(config.publishableKey, connection.publishableKey);
    assert.equal(config.portalLoginUrl, portal.login_page.url);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const probe = await fetchImpl(ORIGIN + "/api/donations/webhook", {
      method: "POST",
      redirect: "error",
      headers: { "Content-Type": "application/json", "Stripe-Signature": "t=1,v1=invalid" },
      body: "{}",
      signal: AbortSignal.timeout(15000),
    });
    assert.equal(probe.status, 400, "Webhook must reject invalid signatures");
    await probe.body?.cancel();
    console.log(
      JSON.stringify({
        state: "live_worker_deployed_verified_awaiting_webhook_enable",
        worker: WORKER,
        origin: ORIGIN,
        versionId: id,
        databaseId: LIVE_DATABASE_ID,
        preservedIntegrations: ["BREVO_API_KEY", "TURNSTILE_SECRET_KEY", "ASSETS"],
        publicPagesHealthy: true,
        invalidWebhookRejected: true,
        webhookEnableRequired: true,
        fundedTestPerformed: false,
        merged: false,
      }),
    );
    return { versionId: id };
  } catch (error) {
    if (trafficChanged) {
      await cf(prefix + "/deployments", { strategy: "percentage", versions: originalVersions });
      console.log(
        JSON.stringify({
          state: "launch_verification_failed_prior_traffic_restored",
          databaseRetained: true,
          noFundedTest: true,
        }),
      );
    }
    throw error;
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    assert.equal(process.argv.length, 2, "Live launch accepts no target overrides");
    const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
    await deployLive({ approvalMessage: event.head_commit?.message });
  } catch (error) {
    const diagnostic = /^Cloudflare launch request failed \(HTTP \d+\)$/.test(error?.message ?? "")
      ? error.message
      : error?.code === "ERR_ASSERTION"
        ? "A launch invariant failed"
        : "Launch operation failed";
    console.error(
      JSON.stringify({
        state: "approved_launch_incomplete",
        phase,
        diagnostic,
        secretsPrinted: false,
      }),
    );
    process.exitCode = 1;
  }
}
