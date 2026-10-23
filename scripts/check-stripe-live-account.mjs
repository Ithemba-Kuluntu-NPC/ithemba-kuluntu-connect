import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Preparation only. Never imports the payment runtime, Cloudflare, or deploy helpers.
export const LIVE_PREPARATION_API_VERSION = "2024-06-20";

export function parseLiveConnection(value) {
  let connection;
  try {
    connection = JSON.parse(value);
  } catch {
    throw new Error("Invalid STRIPE_LIVE_CONNECTION JSON. Keep key values out of chat and logs.");
  }
  if (
    !connection ||
    typeof connection !== "object" ||
    Array.isArray(connection) ||
    Object.keys(connection).sort().join(",") !== "accountId,publishableKey,restrictedKey"
  )
    throw new Error(
      "Live connection must contain exactly restrictedKey, publishableKey and accountId. No saved values are shown.",
    );
  const invalid = [];
  if (
    typeof connection.restrictedKey !== "string" ||
    !/^rk_live_[A-Za-z0-9]{8,}$/.test(connection.restrictedKey)
  )
    invalid.push("restrictedKey (expected complete rk_live_ key)");
  if (
    typeof connection.publishableKey !== "string" ||
    !/^pk_live_[A-Za-z0-9]{8,}$/.test(connection.publishableKey)
  )
    invalid.push("publishableKey (expected complete pk_live_ key)");
  if (typeof connection.accountId !== "string" || !/^acct_[A-Za-z0-9]+$/.test(connection.accountId))
    invalid.push("accountId (expected live acct_ ID)");
  if (invalid.length)
    throw new Error(
      `Live connection field check failed: ${invalid.join("; ")}. No saved values are shown and no Stripe request was made.`,
    );
  return connection;
}

export async function checkLiveAccount({
  connectionValue = process.env.STRIPE_LIVE_CONNECTION,
  fetchImpl = fetch,
  context = process.env,
} = {}) {
  if (
    context.GITHUB_ACTIONS === "true" &&
    (context.GITHUB_REPOSITORY !== "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect" ||
      context.GITHUB_REF !== "refs/heads/codex/stripe-donations-integration" ||
      !["push", "workflow_dispatch"].includes(context.GITHUB_EVENT_NAME))
  )
    throw new Error(
      "Live account preparation is restricted to the donations branch and trusted events.",
    );
  if (!connectionValue) return { state: "live_connection_not_saved", readyForLaunch: false };
  const connection = parseLiveConnection(connectionValue);
  if (context.GITHUB_ACTIONS === "true") {
    console.log(`::add-mask::${connection.restrictedKey}`);
    console.log(`::add-mask::${connection.publishableKey}`);
  }
  let account;
  try {
    // This is the only network request. No customer/payment/configuration writes.
    const response = await fetchImpl("https://api.stripe.com/v1/account", {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${connection.restrictedKey}`,
        "Stripe-Version": LIVE_PREPARATION_API_VERSION,
      },
    });
    if (!response.ok) throw new Error("Account read failed");
    account = await response.json();
  } catch {
    throw new Error(
      "Live Stripe account could not be verified. Check the saved connection and Account Read permission. No settings or payments changed; raw errors are omitted.",
    );
  }
  if (account?.id !== connection.accountId || account.country !== "DE")
    throw new Error(
      "Live beneficiary account verification failed. Review the expected German association account; no settings changed.",
    );
  const requirements = account.requirements;
  const lists = [
    requirements?.currently_due,
    requirements?.past_due,
    requirements?.pending_verification,
  ];
  const knownAction =
    lists.some((value) => Array.isArray(value) && value.length > 0) ||
    (typeof requirements?.disabled_reason === "string" && requirements.disabled_reason.length > 0);
  const completeRequirements = lists.every(Array.isArray) && requirements?.disabled_reason === null;
  const requirementsStatus = knownAction
    ? "action_required"
    : completeRequirements
      ? "clear"
      : "unavailable";
  const requirementsClear = requirementsStatus === "clear";
  const operational =
    account.details_submitted === true &&
    account.charges_enabled === true &&
    account.payouts_enabled === true;
  const flags = {
    accountMatches: true,
    germanAccount: true,
    detailsSubmitted: account.details_submitted === true,
    chargesEnabled: account.charges_enabled === true,
    payoutsEnabled: account.payouts_enabled === true,
    requirementsClear,
  };
  return {
    state:
      !operational || requirementsStatus === "action_required"
        ? "account_action_required"
        : requirementsStatus === "unavailable"
          ? "account_verification_needs_dashboard_confirmation"
          : "account_ready_for_configuration_review",
    ...flags,
    requirementsStatus,
    readyForLaunch: false,
    // An account read cannot prove these. They remain explicit approval gates.
    legalOwnershipVerified: false,
    publishableKeyPairingVerified: false,
    runtimeWritePermissionsVerified: false,
    liveWebhookVerified: false,
    livePortalVerified: false,
    siteActivationPerformed: false,
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.length !== 2)
      throw new Error("This helper accepts no action or deployment arguments.");
    console.log(`LIVE_ACCOUNT_PREPARATION: ${JSON.stringify(await checkLiveAccount())}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
