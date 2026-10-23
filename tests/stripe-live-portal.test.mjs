import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { test } from "node:test";
import { checkLivePortal, livePortalFlags } from "../scripts/check-stripe-live-portal.mjs";
const connectionValue = JSON.stringify({
  restrictedKey: "rk_live_fixture123",
  publishableKey: "pk_live_fixture123",
  accountId: "acct_fixture",
});
const account = { id: "acct_fixture", country: "DE" };
const portal = {
  id: "bpc_fixture",
  active: true,
  livemode: true,
  is_default: true,
  features: {
    subscription_cancel: { enabled: true, mode: "at_period_end" },
    payment_method_update: { enabled: true },
    subscription_update: { enabled: false },
  },
  login_page: { enabled: true, url: "https://billing.stripe.com/p/login/fixtureLive" },
};
const expectedLoginSha256 = createHash("sha256").update(portal.login_page.url).digest("hex");
function read(result, status = 200, calls = []) {
  return async (url, options) => {
    calls.push(url);
    assert.equal(options.method, "GET");
    assert.equal(options.body, undefined);
    assert.equal(options.redirect, "error");
    assert.equal(options.headers["Stripe-Version"], "2024-06-20");
    if (url === "https://api.stripe.com/v1/account") return Response.json(account);
    assert.equal(
      url,
      "https://api.stripe.com/v1/billing_portal/configurations?active=true&limit=100",
    );
    return Response.json(result, { status });
  };
}
test("live Portal verification performs only beneficiary and configuration GETs, disclosing no IDs or URLs", async () => {
  const calls = [];
  const result = await checkLivePortal({
    connectionValue,
    expectedLoginSha256,
    context: {},
    fetchImpl: read({ data: [portal], has_more: false }, 200, calls),
  });
  assert.equal(calls.length, 2);
  assert.equal(result.state, "live_portal_configuration_ready");
  assert.equal(result.readyForLaunch, false);
  assert.equal(result.liveDonorLoginTested, false);
  for (const sensitive of ["bpc_fixture", "fixtureLive", "acct_fixture", "rk_live_fixture123"])
    assert.equal(JSON.stringify(result).includes(sensitive), false);
});
test("test-mode URLs, wrong origins, missing controls and ambiguous/paginated Portal results never establish readiness", async () => {
  for (const changed of [
    { ...portal, livemode: false },
    { ...portal, active: false },
    { ...portal, id: "wrong" },
    {
      ...portal,
      login_page: { enabled: true, url: "https://billing.stripe.com/p/login/test_fixture" },
    },
    {
      ...portal,
      login_page: {
        enabled: true,
        url: "https://billing.stripe.com.attacker.example/p/login/fixture",
      },
    },
    {
      ...portal,
      login_page: {
        enabled: true,
        url: "https://billing.stripe.com/p/login/fixture?secret=private",
      },
    },
    { ...portal, features: { ...portal.features, payment_method_update: { enabled: false } } },
    {
      ...portal,
      features: { ...portal.features, subscription_cancel: { enabled: true, mode: "immediately" } },
    },
    { ...portal, login_page: { enabled: false, url: portal.login_page.url } },
  ])
    assert.ok(
      Object.values(livePortalFlags(changed, expectedLoginSha256)).some((v) => v === false),
    );
  for (const response of [
    { data: [], has_more: false },
    { data: [portal], has_more: true },
    {
      data: [
        { ...portal, is_default: false },
        { ...portal, id: "bpc_other", is_default: false },
      ],
      has_more: false,
    },
  ]) {
    const r = await checkLivePortal({
      connectionValue,
      expectedLoginSha256,
      context: {},
      fetchImpl: read(response),
    });
    assert.equal(r.state, "live_portal_setup_required");
  }
});
test("missing/mixed credentials, wrong beneficiary, denied permissions and provider errors never write or disclose responses", async () => {
  let calls = 0;
  const r = await checkLivePortal({
    connectionValue: "",
    context: {},
    fetchImpl: () => {
      calls++;
    },
  });
  assert.equal(r.state, "live_connection_not_saved");
  assert.equal(calls, 0);
  await assert.rejects(
    checkLivePortal({
      connectionValue: connectionValue.replace("rk_live_", "rk_test_"),
      context: {},
      fetchImpl: () => {
        calls++;
      },
    }),
  );
  assert.equal(calls, 0);
  await assert.rejects(
    checkLivePortal({
      connectionValue,
      context: {},
      fetchImpl: async () => Response.json({ ...account, id: "acct_other" }),
    }),
  );
  const denied = await checkLivePortal({
    connectionValue,
    expectedLoginSha256,
    context: {},
    fetchImpl: read({ private: "doNotPrint" }, 403),
  });
  assert.equal(denied.state, "portal_dashboard_review_required");
  for (const fixture of [{ data: "doNotPrint" }, { data: [], has_more: "doNotPrint" }])
    await assert.rejects(
      checkLivePortal({
        connectionValue,
        expectedLoginSha256,
        context: {},
        fetchImpl: read(fixture),
      }),
      (e) => !e.message.includes("doNotPrint"),
    );
});

test("only the approved live login fingerprint with plan changes disabled can pass", async () => {
  assert.ok(Object.values(livePortalFlags(portal, expectedLoginSha256)).every(Boolean));
  const different = {
    ...portal,
    login_page: {
      ...portal.login_page,
      url: "https://billing.stripe.com/p/login/differentLiveLink",
    },
  };
  assert.equal(livePortalFlags(different, expectedLoginSha256).approvedLoginMatches, false);
  for (const subscription_update of [{ enabled: true }, undefined]) {
    const changed = { ...portal, features: { ...portal.features, subscription_update } };
    assert.equal(livePortalFlags(changed, expectedLoginSha256).planChangesDisabled, false);
  }
  const result = await checkLivePortal({
    connectionValue,
    context: {},
    expectedLoginSha256,
    fetchImpl: read({ data: [different], has_more: false }),
  });
  assert.equal(result.state, "live_portal_setup_required");
  assert.equal(result.readyForLaunch, false);
});
