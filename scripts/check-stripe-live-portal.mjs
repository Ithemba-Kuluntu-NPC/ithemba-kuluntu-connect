import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  checkLiveAccount,
  parseLiveConnection,
  LIVE_PREPARATION_API_VERSION,
} from "./check-stripe-live-account.mjs";

export function livePortalFlags(configuration) {
  let liveLoginUrl = false;
  try {
    const url = new URL(configuration?.login_page?.url);
    liveLoginUrl =
      url.origin === "https://billing.stripe.com" &&
      /^\/p\/login\/(?!test_)[A-Za-z0-9_]+$/.test(url.pathname) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash;
  } catch {
    /* Report a boolean, never the submitted URL. */
  }
  return {
    active: configuration?.active === true,
    liveMode: configuration?.livemode === true,
    validId: typeof configuration?.id === "string" && /^bpc_[A-Za-z0-9]+$/.test(configuration.id),
    paymentMethodUpdates: configuration?.features?.payment_method_update?.enabled === true,
    periodEndCancellation:
      configuration?.features?.subscription_cancel?.enabled === true &&
      configuration.features.subscription_cancel.mode === "at_period_end",
    emailLogin: configuration?.login_page?.enabled === true,
    liveLoginUrl,
  };
}

export async function checkLivePortal({
  connectionValue = process.env.STRIPE_LIVE_CONNECTION,
  fetchImpl = fetch,
  context = process.env,
} = {}) {
  // Verify key mode, branch/event and expected beneficiary before reading Portal settings.
  const account = await checkLiveAccount({ connectionValue, fetchImpl, context });
  if (account.state === "live_connection_not_saved")
    return { state: account.state, readyForLaunch: false };
  const connection = parseLiveConnection(connectionValue);
  let result;
  try {
    const response = await fetchImpl(
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
    if (response.status === 403)
      return { state: "portal_dashboard_review_required", readyForLaunch: false };
    if (!response.ok) throw new Error("Portal read failed");
    result = await response.json();
    if (!Array.isArray(result?.data) || typeof result.has_more !== "boolean")
      throw new Error("Invalid Portal response");
  } catch {
    throw new Error(
      "Live Portal configuration could not be read. No settings changed; raw responses and URLs omitted.",
    );
  }
  const eligible = result.data.filter((c) => Object.values(livePortalFlags(c)).every(Boolean));
  const defaults = eligible.filter((c) => c.is_default === true);
  const selected = result.has_more
    ? null
    : defaults.length === 1
      ? defaults[0]
      : eligible.length === 1
        ? eligible[0]
        : null;
  return {
    state: selected ? "live_portal_configuration_ready" : "live_portal_setup_required",
    configurationCompatible: Boolean(selected),
    // A GET cannot test email delivery or log in a live donor. No sessions are created.
    liveDonorLoginTested: false,
    readyForLaunch: false,
    configurationFlags: result.data.map(livePortalFlags),
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.length !== 2)
      throw new Error("Live Portal preparation accepts no action arguments.");
    console.log(`LIVE_PORTAL_PREPARATION: ${JSON.stringify(await checkLivePortal())}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
