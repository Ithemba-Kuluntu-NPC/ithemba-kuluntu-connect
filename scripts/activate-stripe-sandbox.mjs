import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { appendFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { checkStaging, STAGING_DATABASE_ID, STAGING_WORKER } from "./check-donations-staging.mjs";
import { assertDatabaseTarget, parseStagingConnection } from "./migrate-donations-staging.mjs";
import { parseSandboxConnection } from "./check-stripe-sandbox.mjs";
import { checkReadiness, validateWebhookSecret } from "./check-stripe-sandbox-readiness.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const STAGING_ORIGIN = "https://ithemba-donations-staging.super-tooth-55f1.workers.dev";
// Reviewed EUR-only Checkout fix, validated locally and against Stripe's pinned API.
// Keep the existing repository/branch/approval marker and exact staging target gates.
export const APPLICATION_REF = "b1d372bdeff42e085052ef2e8b14f370c3735261";
export const ACTIVATION_MARKER = "Activate approved Stripe sandbox on isolated staging Worker";
const excluded = [
  "docs",
  ".github/workflows/stripe-sandbox-activate.yml",
  "scripts/activate-stripe-sandbox.mjs",
  "tests/stripe-sandbox-activation.test.mjs",
  ".github/workflows/donations-staging-verify.yml",
];
const publicVars = [
  "STRIPE_DONATIONS_MODE",
  "STRIPE_PAYPAL_ENABLED",
  "STRIPE_PAYPAL_RECURRING_ENABLED",
  "STRIPE_BANK_TRANSFER_ENABLED",
];
export const SECRET_NAMES = [
  "STRIPE_SECRET_KEY",
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_ACCOUNT_ID",
  "DONATION_COOKIE_SECRET",
  "DONATION_SITE_ORIGIN",
  "STRIPE_PORTAL_CONFIGURATION_ID",
  "STRIPE_PORTAL_LOGIN_URL",
];

export function assertActivationApproval(approval, context) {
  assert.equal(approval, "true", "Explicit staging activation approval is required");
  if (!context) return;
  assert.equal(context.repository, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(context.ref, "refs/heads/codex/stripe-donations-integration");
  assert.equal(context.eventName, "push");
  assert.equal(context.commitMessage, ACTIVATION_MARKER, "No approved sandbox activation marker");
}

export function assertSandboxWorker(settings, { activated = false } = {}) {
  const bindings = settings?.bindings;
  assert.ok(Array.isArray(bindings), "Staging Worker settings unavailable");
  assert.equal(
    new Set(bindings.map((binding) => binding.name)).size,
    bindings.length,
    "Duplicate binding names refused",
  );
  for (const binding of bindings) {
    if (binding.name === "DONATIONS_DB")
      assert.ok(
        binding.type === "d1" && binding.id === STAGING_DATABASE_ID,
        "Wrong staging D1 binding",
      );
    else if (binding.name === "ASSETS")
      assert.equal(binding.type, "assets", "Unexpected assets binding");
    else if (publicVars.includes(binding.name))
      assert.ok(
        binding.type === "plain_text" &&
          binding.text === (binding.name === "STRIPE_DONATIONS_MODE" ? "test" : "false"),
        "Staging must use test mode and optional methods off",
      );
    else
      assert.ok(
        SECRET_NAMES.includes(binding.name) && binding.type === "secret_text",
        "Unexpected staging binding or plaintext credential",
      );
  }
  for (const name of ["DONATIONS_DB", ...publicVars])
    assert.ok(
      bindings.some((binding) => binding.name === name),
      "Required staging binding missing",
    );
  if (activated)
    for (const name of SECRET_NAMES)
      assert.ok(
        bindings.some((binding) => binding.name === name && binding.type === "secret_text"),
        "Required sandbox credential binding missing",
      );
}

export function sandboxSecretValues(connection, webhookSecret, portal, cookieSecret) {
  parseSandboxConnection(JSON.stringify(connection));
  assert.equal(portal.state, "ready_for_deployment_preparation", "Sandbox Portal must be ready");
  const values = {
    STRIPE_SECRET_KEY: connection.restrictedKey,
    STRIPE_PUBLISHABLE_KEY: connection.publishableKey,
    STRIPE_WEBHOOK_SECRET: validateWebhookSecret(webhookSecret),
    STRIPE_ACCOUNT_ID: connection.accountId,
    DONATION_SITE_ORIGIN: STAGING_ORIGIN,
    STRIPE_PORTAL_CONFIGURATION_ID: portal.portalConfigurationId,
    STRIPE_PORTAL_LOGIN_URL: portal.portalLoginUrl,
  };
  // Existing cookie secrets are inherited by Wrangler, keeping donor ownership on a retry.
  if (cookieSecret) {
    assert.match(
      cookieSecret,
      /^[a-f0-9]{64}$/,
      "Cookie signing secret must have 256 bits of entropy",
    );
    values.DONATION_COOKIE_SECRET = cookieSecret;
  }
  return values;
}

export async function activateSandbox({
  phase = "preflight",
  approval = process.env.STRIPE_SANDBOX_ACTIVATION_APPROVED,
  cloudflareValue = process.env.CLOUDFLARE_D1_STAGING,
  workerToken = process.env.CLOUDFLARE_WORKER_STAGING_TOKEN,
  stripeValue = process.env.STRIPE_SANDBOX_CONNECTION,
  webhookSecret = process.env.STRIPE_SANDBOX_WEBHOOK_SECRET,
  fetchImpl = fetch,
  run = execFileSync,
  check = checkStaging,
  readiness = checkReadiness,
  pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
} = {}) {
  assert.ok(["preflight", "activate"].includes(phase));
  // Refuse activation before reading credentials, executing commands or calling any API.
  if (phase === "activate") assertActivationApproval(approval);
  if (process.env.GITHUB_ACTIONS === "true") {
    assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
    assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
    assert.equal(process.env.GITHUB_EVENT_NAME, "push");
    if (phase === "activate") {
      const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
      assertActivationApproval(approval, {
        repository: process.env.GITHUB_REPOSITORY,
        ref: process.env.GITHUB_REF,
        eventName: process.env.GITHUB_EVENT_NAME,
        commitMessage: event.head_commit?.message,
      });
    }
  }
  const connection = parseSandboxConnection(stripeValue);
  validateWebhookSecret(webhookSecret);
  let cloudflare;
  try {
    cloudflare = parseStagingConnection(cloudflareValue);
  } catch {
    throw new Error("Invalid saved Cloudflare staging connection; no credential values are shown.");
  }
  assert.ok(
    typeof workerToken === "string" && /^[A-Za-z0-9_.-]{20,}$/.test(workerToken),
    "Worker deployment token missing or invalid",
  );
  if (process.env.GITHUB_ACTIONS === "true")
    for (const secret of [
      connection.restrictedKey,
      connection.publishableKey,
      webhookSecret,
      cloudflare.apiToken,
      workerToken,
    ])
      console.log(`::add-mask::${secret}`);
  run(
    "git",
    [
      "diff",
      "--exit-code",
      APPLICATION_REF,
      "HEAD",
      "--",
      ".",
      ...excluded.map((path) => `:(exclude)${path}`),
    ],
    { cwd: root, stdio: "pipe" },
  );
  await check({ built: phase === "activate" });
  const portal = await readiness({ connectionValue: stripeValue, webhookSecret, fetchImpl });
  assert.equal(
    portal.state,
    "ready_for_deployment_preparation",
    "Sandbox Portal setup is not ready; no activation attempted",
  );
  const accountPath = `https://api.cloudflare.com/client/v4/accounts/${cloudflare.accountId}`;
  async function cf(path, token = workerToken) {
    let response;
    try {
      response = await fetchImpl(accountPath + path, {
        method: "GET",
        redirect: "error",
        signal: AbortSignal.timeout(30000),
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      throw new Error("Cloudflare staging verification could not be reached.");
    }
    if (!response.ok)
      throw new Error(
        `Cloudflare staging verification failed (HTTP ${response.status}); inspect job before retrying.`,
      );
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid Cloudflare staging response.");
    }
    if (data.success !== true) throw new Error("Cloudflare staging verification rejected.");
    return data.result;
  }
  assertDatabaseTarget(await cf(`/d1/database/${STAGING_DATABASE_ID}`, cloudflare.apiToken));
  const subdomain = await cf("/workers/subdomain");
  assert.equal(
    `https://${STAGING_WORKER}.${subdomain?.subdomain}.workers.dev`,
    STAGING_ORIGIN,
    "Unexpected staging account/domain",
  );
  const existing = await cf(`/workers/scripts/${STAGING_WORKER}/settings`);
  assertSandboxWorker(existing);
  console.log(
    "Sandbox activation preflight passed: expected Stripe account/Portal, isolated Worker, exact staging D1, test mode and optional methods off. No settings changed.",
  );
  if (phase === "preflight") return;
  const hasCookie = existing.bindings.some((binding) => binding.name === "DONATION_COOKIE_SECRET");
  const cookie = hasCookie ? undefined : randomBytes(32).toString("hex");
  if (cookie && process.env.GITHUB_ACTIONS === "true") console.log(`::add-mask::${cookie}`);
  const secrets = sandboxSecretValues(connection, webhookSecret, portal, cookie);
  const env = { ...process.env };
  for (const key of Object.keys(env))
    if (
      /^(STRIPE_|DONATION_)/.test(key) ||
      [
        "CLOUDFLARE_D1_STAGING",
        "CLOUDFLARE_WORKER_STAGING_TOKEN",
        "CLOUDFLARE_ENV",
        "CLOUDFLARE_API_KEY",
        "CLOUDFLARE_EMAIL",
        "CLOUDFLARE_API_BASE_URL",
        "WRANGLER_API_BASE_URL",
      ].includes(key)
    )
      delete env[key];
  Object.assign(env, {
    CLOUDFLARE_API_TOKEN: workerToken,
    CLOUDFLARE_ACCOUNT_ID: cloudflare.accountId,
    WRANGLER_SEND_METRICS: "false",
    WRANGLER_LOG: "info",
    CI: "true",
  });
  const directory = await mkdtemp(resolve(tmpdir(), "ithemba-sandbox-"));
  try {
    const secretsFile = resolve(directory, "bindings.json");
    await writeFile(secretsFile, JSON.stringify(secrets), { mode: 0o600 });
    try {
      run(
        process.execPath,
        [
          resolve(root, "node_modules/wrangler/bin/wrangler.js"),
          "deploy",
          "--config",
          resolve(root, "wrangler.donations-staging.jsonc"),
          "--secrets-file",
          secretsFile,
        ],
        { cwd: root, env, stdio: "inherit" },
      );
    } catch {
      throw new Error(
        "Wrangler sandbox activation did not complete successfully. Inspect deployment status before retrying; temporary credentials were removed.",
      );
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
  console.log(
    "Sandbox staging upload completed; verifying bindings and endpoints. A verification failure does not mean upload was rolled back.",
  );
  assertSandboxWorker(await cf(`/workers/scripts/${STAGING_WORKER}/settings`), { activated: true });
  let config;
  for (let attempt = 0; attempt < 5; attempt++) {
    const page = await fetchImpl(`${STAGING_ORIGIN}/donate`, {
      redirect: "error",
      signal: AbortSignal.timeout(30000),
    });
    const response = await fetchImpl(`${STAGING_ORIGIN}/api/donations/config`, {
      redirect: "error",
      signal: AbortSignal.timeout(30000),
    });
    if (page.status === 200 && response.status === 200) {
      config = await response.json();
      assert.ok(
        /HttpOnly/i.test(response.headers.get("set-cookie") ?? "") &&
          /Secure/i.test(response.headers.get("set-cookie") ?? "") &&
          /SameSite=Lax/i.test(response.headers.get("set-cookie") ?? "") &&
          /Path=\/api\/donations(?:;|$)/i.test(response.headers.get("set-cookie") ?? "") &&
          response.headers.get("cache-control") === "no-store",
        "Secure donor cookie not issued",
      );
      break;
    }
    if (attempt < 4) await pause(3000);
  }
  assert.ok(
    config &&
      Object.keys(config).sort().join(",") === "mode,portalLoginUrl,publishableKey" &&
      config.publishableKey === connection.publishableKey &&
      config.portalLoginUrl === portal.portalLoginUrl &&
      config.mode === "test",
    "Expected only the public test configuration; inspect staging deployment. No response values are logged.",
  );
  const body = JSON.stringify({
    id: `evt_staging_probe_${randomUUID()}`,
    api_version: "2026-08-26.dahlia",
    livemode: false,
    type: "donation.integration_probe",
    data: { object: {} },
  });
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  for (const [value, status] of [
    [signature, 200],
    ["0".repeat(64), 400],
  ]) {
    const probe = await fetchImpl(`${STAGING_ORIGIN}/api/donations/webhook`, {
      method: "POST",
      body,
      redirect: "error",
      signal: AbortSignal.timeout(30000),
      headers: { "Stripe-Signature": `t=${timestamp},v1=${value}` },
    });
    assert.equal(probe.status, status, "Sandbox webhook signature probe failed");
  }
  console.log(
    `Sandbox staging activated: ${STAGING_ORIGIN}/donate. Test configuration and signature probes passed. No Stripe payment, Customer or Subscription created. Real Stripe-signed delivery and Checkout tests still required.`,
  );
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `\nSandbox activated and checked: ${STAGING_ORIGIN}/donate\n\nTest mode only. Synthetic signature probes passed; real sandbox Checkout/webhook/Portal acceptance remains. No production/DNS/merge operations.\n`,
    );
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    assert.ok(
      args.length === 1 && ["preflight", "activate"].includes(args[0]),
      "Only preflight or explicitly approved activate phases are accepted",
    );
    await activateSandbox({ phase: args[0] });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
