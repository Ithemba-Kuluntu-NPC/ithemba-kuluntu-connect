import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const PRODUCTION_WORKER = "tanstack-start-app";
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

export async function checkProductionPreparation({
  connectionValue = process.env.CLOUDFLARE_D1_STAGING,
  workerToken = process.env.CLOUDFLARE_WORKER_STAGING_TOKEN,
  context = process.env,
  fetchImpl = fetch,
} = {}) {
  if (
    context.GITHUB_ACTIONS === "true" &&
    (context.GITHUB_REPOSITORY !== "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect" ||
      context.GITHUB_REF !== "refs/heads/codex/stripe-donations-integration" ||
      context.GITHUB_EVENT_NAME !== "push")
  )
    throw new Error("Untrusted production review context");
  if (!connectionValue || !workerToken)
    return { state: "production_review_connection_unavailable", readyForLaunch: false };
  let connection;
  try {
    connection = JSON.parse(connectionValue);
  } catch {
    throw new Error("Invalid saved Cloudflare connection");
  }
  if (
    !connection ||
    typeof connection !== "object" ||
    Array.isArray(connection) ||
    !/^[a-f0-9]{32}$/i.test(connection.accountId ?? "") ||
    typeof workerToken !== "string" ||
    !/^[A-Za-z0-9_.-]{20,}$/.test(workerToken)
  )
    throw new Error("Invalid production review credentials");
  const base = `https://api.cloudflare.com/client/v4/accounts/${connection.accountId}/workers`;
  async function get(path) {
    let response;
    try {
      response = await fetchImpl(base + path, {
        method: "GET",
        redirect: "error",
        signal: AbortSignal.timeout(15000),
        headers: { Authorization: `Bearer ${workerToken}` },
      });
    } catch {
      throw new Error("Production configuration read failed");
    }
    if (response.status === 403) return null;
    if (!response.ok)
      throw new Error(`Production configuration read failed (HTTP ${response.status})`);
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid production configuration response");
    }
    if (data.success !== true) throw new Error("Production configuration read rejected");
    return data.result;
  }
  const settings = await get(`/scripts/${PRODUCTION_WORKER}/settings`);
  if (!settings)
    return {
      state: "production_settings_dashboard_review_required",
      worker: PRODUCTION_WORKER,
      readyForLaunch: false,
    };
  if (
    !Array.isArray(settings.bindings) ||
    !settings.bindings.every(
      (b) =>
        /^[A-Za-z_][A-Za-z0-9_]{0,127}$/.test(b.name ?? "") &&
        typeof b.type === "string" &&
        /^[a-z_]+$/.test(b.type),
    )
  )
    throw new Error("Incomplete production bindings response");
  const deployments = await get(`/scripts/${PRODUCTION_WORKER}/deployments`);
  const list = Array.isArray(deployments) ? deployments : deployments?.deployments;
  const latest = Array.isArray(list)
    ? [...list].sort((a, b) => Date.parse(b.created_on) - Date.parse(a.created_on))[0]
    : null;
  const versions = latest?.versions;
  const rollbackVerified = Boolean(
    uuid.test(latest?.id ?? "") &&
    Array.isArray(versions) &&
    versions.length > 0 &&
    versions.every(
      (v) => uuid.test(v.version_id ?? "") && Number.isFinite(v.percentage) && v.percentage > 0,
    ) &&
    Math.abs(versions.reduce((n, v) => n + v.percentage, 0) - 100) < 0.001,
  );
  const domains = await get("/domains");
  const canonical = Array.isArray(domains)
    ? domains.filter((d) => d.hostname === "ithembakuluntu.org")
    : null;
  const donationNames = [
    "DONATIONS_DB",
    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_ACCOUNT_ID",
    "DONATION_COOKIE_SECRET",
    "DONATION_SITE_ORIGIN",
    "STRIPE_PORTAL_CONFIGURATION_ID",
    "STRIPE_PORTAL_LOGIN_URL",
    "STRIPE_DONATIONS_MODE",
  ];
  return {
    state: rollbackVerified
      ? "production_snapshot_reviewed_no_changes"
      : "production_rollback_review_required",
    worker: PRODUCTION_WORKER,
    settingsFingerprint: createHash("sha256")
      .update(JSON.stringify(stable(settings)))
      .digest("hex"),
    existingBindings: settings.bindings
      .map((b) => ({ name: b.name, type: b.type }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    donationBindingPresence: Object.fromEntries(
      donationNames.map((name) => [name, settings.bindings.some((b) => b.name === name)]),
    ),
    compatibilityDate: settings.compatibility_date ?? null,
    compatibilityFlags: settings.compatibility_flags ?? [],
    rollbackVerified,
    rollbackDeployment: rollbackVerified
      ? {
          id: latest.id,
          versions: versions.map((v) => ({ version_id: v.version_id, percentage: v.percentage })),
        }
      : null,
    canonicalCustomDomainMatches: canonical
      ? canonical.length === 1 &&
        canonical[0].service === PRODUCTION_WORKER &&
        canonical[0].environment === "production"
      : null,
    workerChanged: false,
    readyForLaunch: false,
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.length !== 2) throw new Error("Production review accepts no target overrides");
    console.log(JSON.stringify(await checkProductionPreparation()));
  } catch {
    console.error(
      "Read-only production review failed; no Worker or account settings were changed.",
    );
    process.exitCode = 1;
  }
}
