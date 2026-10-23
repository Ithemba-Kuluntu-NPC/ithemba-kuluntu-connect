import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { checkSandbox, parseSandboxConnection } from "./check-stripe-sandbox.mjs";
import { portalReadinessFlags } from "./check-stripe-sandbox-readiness.mjs";

// Public sandbox login URL supplied by the account operator. Not a key or donor session.
export const PUBLIC_TEST_PORTAL_URL =
  "https://billing.stripe.com/p/login/test_28EcN70MMeBD64G5MMfUQ00";

export function publicPageFlags(body, accountId, configurationIds) {
  const accountReferences = body.match(/acct_[A-Za-z0-9]+/g) ?? [];
  return {
    containsExpectedAccountId: accountReferences.includes(accountId),
    containsOtherAccountReference: accountReferences.some((id) => id !== accountId),
    containsExpectedConfigurationId: configurationIds.some((id) => body.includes(id)),
    containsSuppliedLoginReference: body.includes(
      new URL(PUBLIC_TEST_PORTAL_URL).pathname.split("/").at(-1),
    ),
    containsStripeLoginMarkup: /customer.?portal|billing.?portal|portal.?login/i.test(body),
  };
}

export async function inspectPortalLink({
  connectionValue = process.env.STRIPE_SANDBOX_CONNECTION,
  fetchImpl = fetch,
} = {}) {
  const connection = parseSandboxConnection(connectionValue);
  await checkSandbox({ connectionValue, fetchImpl });
  const ids = new Set();
  for (const version of ["2024-06-20", "2026-08-26.dahlia"]) {
    let response;
    try {
      response = await fetchImpl(
        "https://api.stripe.com/v1/billing_portal/configurations?active=true&limit=100",
        {
          method: "GET",
          redirect: "error",
          signal: AbortSignal.timeout(15000),
          headers: {
            Authorization: `Bearer ${connection.restrictedKey}`,
            "Stripe-Version": version,
          },
        },
      );
    } catch {
      throw new Error("Read-only Portal configuration lookup failed; no settings changed.");
    }
    if (!response.ok)
      throw new Error(
        `Read-only Portal lookup failed (HTTP ${response.status}); no settings changed.`,
      );
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid Portal configuration response.");
    }
    if (!Array.isArray(data?.data)) throw new Error("Invalid Portal configuration response.");
    const matches = data.data.filter(
      (configuration) => configuration?.login_page?.url === PUBLIC_TEST_PORTAL_URL,
    );
    for (const configuration of data.data)
      if (typeof configuration?.id === "string" && /^bpc_[A-Za-z0-9]+$/.test(configuration.id))
        ids.add(configuration.id);
    console.log(
      `PORTAL_LINK_ACCOUNT_CHECK: ${JSON.stringify({ version, matchesSuppliedLink: matches.length > 0, configurations: data.data.map(portalReadinessFlags), morePages: data.has_more === true })}`,
    );
  }
  let page;
  try {
    page = await fetchImpl(PUBLIC_TEST_PORTAL_URL, {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      "Public test Portal page could not be fetched without a redirect. No login or settings change attempted.",
    );
  }
  const body = (await page.text()).slice(0, 2000000);
  const flags = publicPageFlags(body, connection.accountId, [...ids]);
  console.log(`PUBLIC_PORTAL_LINK_CHECK: ${JSON.stringify({ status: page.status, ...flags })}`);
  console.log(
    "Public-page text references alone do not prove the login link belongs to the sandbox. No raw page content, keys, account IDs or configuration IDs are printed; no form submitted.",
  );
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    await inspectPortalLink();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
