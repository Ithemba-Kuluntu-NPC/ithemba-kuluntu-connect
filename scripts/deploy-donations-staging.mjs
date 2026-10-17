import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { appendFile, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { checkStaging, STAGING_DATABASE_ID, STAGING_WORKER } from "./check-donations-staging.mjs";
import { assertDatabaseTarget, parseStagingConnection } from "./migrate-donations-staging.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "wrangler.donations-staging.jsonc");
export const APPROVED_SOURCE_REF = "4fe7af0236dc23cd2d0786e6263525f1fd448360";
export const APPROVAL_COMMIT_MESSAGE = "Deploy approved isolated donations staging Worker";
const excluded = [
  "docs",
  ".github/workflows/donations-staging-deploy.yml",
  "scripts/deploy-donations-staging.mjs",
  "tests/donations-staging-deploy.test.mjs",
];
const allowedBindings = new Set([
  "ASSETS",
  "DONATIONS_DB",
  "STRIPE_DONATIONS_MODE",
  "STRIPE_PAYPAL_ENABLED",
  "STRIPE_PAYPAL_RECURRING_ENABLED",
  "STRIPE_BANK_TRANSFER_ENABLED",
]);

export function assertTestOnlySettings(settings, { deployed = false } = {}) {
  const bindings = settings?.bindings ?? [];
  assert.ok(
    bindings.every(
      (binding) => allowedBindings.has(binding.name) && binding.type !== "secret_text",
    ),
    "Unexpected staging binding or secret; deployment refused",
  );
  const db = bindings.find((binding) => binding.name === "DONATIONS_DB");
  const mode = bindings.find((binding) => binding.name === "STRIPE_DONATIONS_MODE");
  if (db)
    assert.ok(
      db.type === "d1" && db.id === STAGING_DATABASE_ID,
      "Existing Worker uses a different database",
    );
  if (mode)
    assert.ok(
      mode.type === "plain_text" && mode.text === "test",
      "Existing Worker is not in test mode",
    );
  if (!deployed) return;
  assert.ok(
    bindings.some(
      (binding) =>
        binding.name === "DONATIONS_DB" &&
        binding.type === "d1" &&
        binding.id === STAGING_DATABASE_ID,
    ),
    "Deployed D1 binding does not match staging",
  );
  assert.ok(
    bindings.some(
      (binding) =>
        binding.name === "STRIPE_DONATIONS_MODE" &&
        binding.type === "plain_text" &&
        binding.text === "test",
    ),
    "Deployed donation mode must be test",
  );
}

export async function deployStaging({
  phase = "deploy",
  connectionValue = process.env.CLOUDFLARE_D1_STAGING,
  deploymentToken = process.env.CLOUDFLARE_WORKER_STAGING_TOKEN,
  fetchImpl = fetch,
  run = execFileSync,
  check = checkStaging,
} = {}) {
  assert.ok(["preflight", "deploy"].includes(phase));
  let connection;
  try {
    connection = parseStagingConnection(connectionValue);
  } catch {
    throw new Error(
      "The saved GitHub staging connection is missing or invalid; do not paste credentials into chat.",
    );
  }
  const token = deploymentToken || connection.apiToken;
  assert.ok(
    typeof token === "string" && /^[A-Za-z0-9_.-]{20,}$/.test(token),
    "Invalid Worker deployment token",
  );
  if (process.env.GITHUB_ACTIONS === "true") {
    console.log(`::add-mask::${connection.apiToken}`);
    console.log(`::add-mask::${token}`);
    assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
    assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
    assert.equal(process.env.GITHUB_EVENT_NAME, "push");
    const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
    assert.equal(
      event.head_commit?.message,
      APPROVAL_COMMIT_MESSAGE,
      "This run does not carry the approved staging deployment marker",
    );
  }
  // Only deployment helpers/docs may differ from the site/config already reviewed by the user.
  run(
    "git",
    [
      "diff",
      "--exit-code",
      APPROVED_SOURCE_REF,
      "HEAD",
      "--",
      ".",
      ...excluded.map((path) => `:(exclude)${path}`),
    ],
    { cwd: root, stdio: "pipe" },
  );
  await check({ built: phase === "deploy" });
  const accountPath = `https://api.cloudflare.com/client/v4/accounts/${connection.accountId}`;
  let uploaded = false;
  async function api(path, apiToken = token, { allowMissing = false } = {}) {
    const res = await fetchImpl(`${accountPath}${path}`, {
      method: "GET",
      redirect: "error",
      headers: { Authorization: `Bearer ${apiToken}` },
      signal: AbortSignal.timeout(30000),
    });
    if (res.status === 404 && allowMissing) return null;
    if (res.status === 401 || res.status === 403) {
      if (uploaded)
        throw new Error(
          "The staging Worker upload completed, but Cloudflare verification was denied. Inspect the job before retrying.",
        );
      throw new Error(
        "Cloudflare Worker deployment permission is missing. Save a deployment-capable token as the CLOUDFLARE_WORKER_STAGING_TOKEN GitHub secret. No Worker deployment was attempted.",
      );
    }
    if (!res.ok) throw new Error(`Cloudflare staging verification failed (HTTP ${res.status}).`);
    const data = await res.json();
    if (data.success !== true) throw new Error("Cloudflare staging verification was rejected.");
    return data.result;
  }
  assertDatabaseTarget(await api(`/d1/database/${STAGING_DATABASE_ID}`, connection.apiToken));
  // Read-only permission probe: no account settings or subdomain registration is changed.
  const subdomain = await api("/workers/subdomain");
  assert.match(
    subdomain?.subdomain ?? "",
    /^[a-z0-9-]+$/i,
    "An existing workers.dev subdomain is required; no account subdomain will be created",
  );
  const existing = await api(`/workers/scripts/${STAGING_WORKER}/settings`, token, {
    allowMissing: true,
  });
  if (existing) assertTestOnlySettings(existing);
  console.log(
    `Staging target verified: ${STAGING_WORKER}; database ${STAGING_DATABASE_ID}; test mode only.`,
  );
  if (phase === "preflight") return;
  const env = {
    ...process.env,
    CLOUDFLARE_D1_STAGING: "",
    CLOUDFLARE_WORKER_STAGING_TOKEN: "",
    CLOUDFLARE_API_TOKEN: token,
    CLOUDFLARE_ACCOUNT_ID: connection.accountId,
    CI: "true",
    WRANGLER_SEND_METRICS: "false",
  };
  // Prevent inherited target or credential overrides; preserve proxy and CA configuration.
  for (const key of [
    "CLOUDFLARE_ENV",
    "CLOUDFLARE_API_KEY",
    "CLOUDFLARE_EMAIL",
    "CLOUDFLARE_API_BASE_URL",
    "WRANGLER_API_BASE_URL",
  ])
    delete env[key];
  run(
    process.execPath,
    [resolve(root, "node_modules/wrangler/bin/wrangler.js"), "deploy", "--config", configPath],
    { cwd: root, env, stdio: "inherit" },
  );
  uploaded = true;
  console.log("Staging Worker upload completed; verifying its bindings and URL.");
  assertTestOnlySettings(await api(`/workers/scripts/${STAGING_WORKER}/settings`), {
    deployed: true,
  });
  const url = `https://${STAGING_WORKER}.${subdomain.subdomain}.workers.dev`;
  const page = await fetchImpl(`${url}/donate`, {
    redirect: "error",
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(page.status, 200, "Staging donation page failed its HTTP check");
  const config = await fetchImpl(`${url}/api/donations/config`, {
    redirect: "error",
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(config.status, 503, "Payments should remain unavailable before Stripe test setup");
  console.log(
    `Staging deployment verified: ${url}/donate. Payments remain unavailable; no production or DNS changes requested.`,
  );
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `\nStaging deployed and checked: ${url}/donate\n\nTest mode only; payments unavailable pending separate Stripe test setup.\n`,
    );
  return url;
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const args = process.argv.slice(2);
  assert.ok(
    args.length === 0 || (args.length === 1 && args[0] === "preflight"),
    "No Worker/config/environment overrides accepted",
  );
  try {
    await deployStaging({ phase: args[0] ?? "deploy" });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
