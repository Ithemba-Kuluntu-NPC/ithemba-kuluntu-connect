import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  checkSandbox,
  parseSandboxConnection,
  SANDBOX_API_VERSION,
} from "./check-stripe-sandbox.mjs";

export function validateWebhookSecret(value) {
  if (typeof value !== "string" || !/^whsec_[A-Za-z0-9]{16,}$/.test(value))
    throw new Error(
      "Save the complete sandbox destination signing secret (whsec_) as STRIPE_SANDBOX_WEBHOOK_SECRET. Its value is never shown.",
    );
  return value;
}

export function usablePortal(configuration) {
  if (
    !configuration ||
    configuration.active !== true ||
    configuration.livemode !== false ||
    typeof configuration.id !== "string" ||
    !/^bpc_[A-Za-z0-9]+$/.test(configuration.id) ||
    configuration.features?.subscription_cancel?.enabled !== true ||
    !["at_period_end", "immediately"].includes(configuration.features.subscription_cancel.mode) ||
    configuration.features?.payment_method_update?.enabled !== true ||
    configuration.login_page?.enabled !== true
  )
    return false;
  try {
    const url = new URL(configuration.login_page.url);
    return (
      url.origin === "https://billing.stripe.com" &&
      url.pathname.startsWith("/p/login/test_") &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

export async function checkReadiness({
  connectionValue = process.env.STRIPE_SANDBOX_CONNECTION,
  webhookSecret = process.env.STRIPE_SANDBOX_WEBHOOK_SECRET,
  fetchImpl = fetch,
} = {}) {
  const connection = parseSandboxConnection(connectionValue);
  validateWebhookSecret(webhookSecret);
  if (process.env.GITHUB_ACTIONS === "true") console.log(`::add-mask::${webhookSecret}`);
  await checkSandbox({ connectionValue, fetchImpl });
  console.log(
    "Sandbox webhook signing secret is present and passes format validation. Destination ownership/signature delivery is not yet verified.",
  );
  let response;
  try {
    response = await fetchImpl(
      "https://api.stripe.com/v1/billing_portal/configurations?active=true&limit=100",
      {
        method: "GET",
        redirect: "error",
        headers: {
          Authorization: `Bearer ${connection.restrictedKey}`,
          "Stripe-Version": SANDBOX_API_VERSION,
        },
        signal: AbortSignal.timeout(15000),
      },
    );
  } catch {
    throw new Error(
      "Could not read sandbox Customer Portal configuration. Retry the job; no settings changed.",
    );
  }
  if (response.status === 403) {
    console.log(
      "PORTAL_DASHBOARD_REQUIRED: The restricted key cannot read Portal configurations. Keep its permissions unchanged; provide the sandbox Portal settings through the browser.",
    );
    return { state: "portal_dashboard_required" };
  }
  if (!response.ok)
    throw new Error(`Sandbox Portal lookup failed (HTTP ${response.status}); no settings changed.`);
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid Stripe Portal response.");
  }
  if (!Array.isArray(result?.data)) throw new Error("Invalid Stripe Portal response.");
  const eligible = result.data.filter(usablePortal);
  const defaults = eligible.filter((config) => config.is_default === true);
  const selected =
    result.has_more === true
      ? null
      : defaults.length === 1
        ? defaults[0]
        : eligible.length === 1
          ? eligible[0]
          : null;
  if (!selected) {
    console.log(
      "PORTAL_DASHBOARD_REQUIRED: No unambiguous active test Portal with cancellation, payment-method updates and email login was found. Configure or select it in the existing sandbox.",
    );
    return { state: "portal_dashboard_required" };
  }
  console.log(
    `PORTAL_READY: Existing sandbox Portal found; cancellation policy is ${selected.features.subscription_cancel.mode}. No settings changed.`,
  );
  return {
    state: "ready_for_deployment_preparation",
    portalConfigurationId: selected.id,
    portalLoginUrl: selected.login_page.url,
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    await checkReadiness();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
