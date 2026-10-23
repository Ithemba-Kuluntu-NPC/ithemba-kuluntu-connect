import assert from "node:assert/strict";
import { test } from "node:test";
import { checkLiveDomain, LIVE_ORIGIN } from "../scripts/check-stripe-live-domain.mjs";
const connectionValue = JSON.stringify({
  restrictedKey: "rk_live_fixture123",
  publishableKey: "pk_live_fixture123",
  accountId: "acct_fixture",
});
const domain = {
  domain_name: "ithembakuluntu.org",
  livemode: true,
  enabled: true,
  apple_pay: { status: "active" },
  google_pay: { status: "active" },
};
function stripeRead(result, status = 200, calls = []) {
  return async (url, options) => {
    calls.push(url);
    assert.equal(options.method, "GET");
    assert.equal(options.body, undefined);
    assert.equal(options.redirect, "error");
    assert.equal(options.headers["Stripe-Version"], "2024-06-20");
    if (url === "https://api.stripe.com/v1/account")
      return Response.json({ id: "acct_fixture", country: "DE" });
    assert.equal(
      url,
      "https://api.stripe.com/v1/payment_method_domains?domain_name=ithembakuluntu.org&limit=100",
    );
    return Response.json(result, { status });
  };
}
async function publicRead(url, options) {
  assert.equal(url, LIVE_ORIGIN);
  assert.equal(options.method, "GET");
  assert.equal(options.headers, undefined);
  assert.equal(options.body, undefined);
  assert.equal(options.redirect, "manual");
  return new Response("public page");
}
test("domain preparation uses only scoped Stripe GETs and a credential-free website GET", async () => {
  const calls = [];
  const result = await checkLiveDomain({
    connectionValue,
    context: {},
    fetchImpl: stripeRead({ data: [domain], has_more: false }, 200, calls),
    publicFetchImpl: publicRead,
  });
  assert.equal(calls.length, 2);
  assert.equal(result.state, "live_domain_configuration_ready");
  assert.equal(result.readyForLaunch, false);
  assert.equal(result.eligibleDeviceWalletTested, false);
  for (const value of ["rk_live_fixture123", "acct_fixture"])
    assert.equal(JSON.stringify(result).includes(value), false);
});
test("denied domain permission requests Dashboard review without broadening access or printing errors", async () => {
  const result = await checkLiveDomain({
    connectionValue,
    context: {},
    fetchImpl: stripeRead({ error: "privateProviderBody" }, 403),
    publicFetchImpl: publicRead,
  });
  assert.equal(result.state, "domain_dashboard_review_required");
  assert.equal(result.domainReadPermissionAvailable, false);
  assert.equal(result.readyForLaunch, false);
  assert.equal(JSON.stringify(result).includes("privateProviderBody"), false);
  await assert.rejects(
    checkLiveDomain({
      connectionValue,
      context: {},
      fetchImpl: stripeRead({ error: "privateProviderBody" }, 500),
      publicFetchImpl: publicRead,
    }),
    (error) => !error.message.includes("privateProviderBody"),
  );
});
test("wrong/test/disabled domains, incomplete results and public redirects cannot pass", async () => {
  for (const result of [
    { data: [], has_more: false },
    { data: [{ ...domain, domain_name: "other.example" }], has_more: false },
    { data: [{ ...domain, livemode: false }], has_more: false },
    { data: [{ ...domain, enabled: false }], has_more: false },
    { data: [{ ...domain, apple_pay: { status: "inactive" } }], has_more: false },
    { data: [domain], has_more: true },
  ]) {
    const check = await checkLiveDomain({
      connectionValue,
      context: {},
      fetchImpl: stripeRead(result),
      publicFetchImpl: publicRead,
    });
    assert.equal(check.state, "live_domain_review_required");
    assert.equal(check.readyForLaunch, false);
  }
  const redirected = await checkLiveDomain({
    connectionValue,
    context: {},
    fetchImpl: stripeRead({ data: [domain], has_more: false }),
    publicFetchImpl: async () => new Response("", { status: 302 }),
  });
  assert.equal(redirected.canonicalRedirect, true);
  assert.equal(redirected.state, "live_domain_review_required");
  let calls = 0;
  await assert.rejects(
    checkLiveDomain({
      connectionValue: connectionValue.replace("rk_live_", "rk_test_"),
      context: {},
      fetchImpl: () => { calls++; },
      publicFetchImpl: () => { calls++; },
    }),
  );
  assert.equal(calls, 0);
});
