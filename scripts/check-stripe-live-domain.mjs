import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  checkLiveAccount,
  parseLiveConnection,
  LIVE_PREPARATION_API_VERSION,
} from "./check-stripe-live-account.mjs";

export const LIVE_ORIGIN = "https://ithembakuluntu.org";
const DOMAIN = new URL(LIVE_ORIGIN).hostname;

export async function checkLiveDomain({
  connectionValue = process.env.STRIPE_LIVE_CONNECTION,
  fetchImpl = fetch,
  publicFetchImpl = fetch,
  context = process.env,
} = {}) {
  const account = await checkLiveAccount({ connectionValue, fetchImpl, context });
  if (account.state === "live_connection_not_saved")
    return { state: account.state, readyForLaunch: false };
  const connection = parseLiveConnection(connectionValue);
  let canonicalHttpsReady = false;
  let canonicalRedirect = false;
  try {
    // No Stripe credentials, cookies or authentication headers go to the website.
    const publicResponse = await publicFetchImpl(LIVE_ORIGIN, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    });
    canonicalHttpsReady = publicResponse.status === 200;
    canonicalRedirect = publicResponse.status >= 300 && publicResponse.status < 400;
    await publicResponse.body?.cancel();
  } catch {
    // Reachability is reported as unknown/not ready, never as activation permission.
  }
  const publicFlags = { canonicalHttpsReady, canonicalRedirect };
  let result;
  try {
    const response = await fetchImpl(
      "https://api.stripe.com/v1/payment_method_domains?domain_name=" + DOMAIN + "&limit=100",
      {
        method: "GET",
        redirect: "error",
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: "Bearer " + connection.restrictedKey,
          "Stripe-Version": LIVE_PREPARATION_API_VERSION,
        },
      },
    );
    if (response.status === 403)
      return {
        state: "domain_dashboard_review_required",
        domainReadPermissionAvailable: false,
        ...publicFlags,
        readyForLaunch: false,
      };
    if (!response.ok) throw new Error("Domain read failed");
    result = await response.json();
    if (!Array.isArray(result?.data) || typeof result.has_more !== "boolean")
      throw new Error("Invalid domain response");
  } catch {
    throw new Error(
      "Live payment-method domain could not be read. No settings changed; raw responses omitted.",
    );
  }
  const matching = result.data.filter(
    (domain) => domain.domain_name === DOMAIN && domain.livemode === true,
  );
  const domain = !result.has_more && matching.length === 1 ? matching[0] : null;
  const flags = {
    registeredLiveDomain: Boolean(domain),
    enabled: domain?.enabled === true,
    applePayActive: domain?.apple_pay?.status === "active",
    googlePayActive: domain?.google_pay?.status === "active",
  };
  return {
    state:
      canonicalHttpsReady && Object.values(flags).every(Boolean)
        ? "live_domain_configuration_ready"
        : "live_domain_review_required",
    domainReadPermissionAvailable: true,
    ...publicFlags,
    ...flags,
    // Domain registration does not establish device eligibility or payment acceptance.
    eligibleDeviceWalletTested: false,
    readyForLaunch: false,
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.length !== 2)
      throw new Error("Live domain preparation accepts no action arguments.");
    console.log("LIVE_DOMAIN_PREPARATION: " + JSON.stringify(await checkLiveDomain()));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
