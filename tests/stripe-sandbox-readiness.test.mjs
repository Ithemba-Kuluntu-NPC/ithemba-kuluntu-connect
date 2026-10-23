import assert from "node:assert/strict";
import { test } from "node:test";
import {
  checkReadiness,
  portalReadinessFlags,
  usablePortal,
  validateWebhookSecret,
} from "../scripts/check-stripe-sandbox-readiness.mjs";
const connectionValue = JSON.stringify({
  restrictedKey: "rk_test_fixture123",
  publishableKey: "pk_test_fixture123",
  accountId: "acct_association",
});
const webhookSecret = "whsec_fixture1234567890";
const portal = {
  id: "bpc_fixture",
  active: true,
  livemode: false,
  is_default: true,
  features: {
    subscription_cancel: { enabled: true, mode: "at_period_end" },
    payment_method_update: { enabled: true },
  },
  login_page: { enabled: true, url: "https://billing.stripe.com/p/login/test_fixture" },
};
test("webhook format errors do not disclose the secret or call Stripe", async () => {
  assert.equal(validateWebhookSecret(webhookSecret), webhookSecret);
  for (const value of [undefined, "whsec_short", "private-value", webhookSecret + "\n"]) {
    let calls = 0;
    await assert.rejects(
      checkReadiness({
        connectionValue,
        webhookSecret: value,
        fetchImpl: async () => {
          calls++;
          return Response.json({});
        },
      }),
      (error) => !error.message.includes("private-value") && !error.message.includes("fixture123"),
    );
    assert.equal(calls, 0);
  }
});
test("only usable sandbox Portals with secure test email login are accepted", () => {
  assert.equal(usablePortal(portal), true);
  for (const change of [
    { livemode: true },
    { active: false },
    { id: "other" },
    {
      features: {
        ...portal.features,
        subscription_cancel: { enabled: false, mode: "at_period_end" },
      },
    },
    { features: { ...portal.features, payment_method_update: { enabled: false } } },
    ...[
      "http://billing.stripe.com/p/login/test_x",
      "https://evil.example/p/login/test_x",
      "https://billing.stripe.com/p/login/live_x",
      "https://billing.stripe.com/p/login/test_x?extra=1",
    ].map((url) => ({ login_page: { enabled: true, url } })),
  ])
    assert.equal(usablePortal({ ...portal, ...change }), false);
});
test("Portal diagnostics expose only fixed readiness flags and a policy enum", () => {
  const flags = portalReadinessFlags({
    ...portal,
    id: "private-id",
    business_profile: { headline: "private-name" },
    login_page: { enabled: true, url: "https://private.example/token" },
    features: { ...portal.features, subscription_cancel: { enabled: true, mode: "private-mode" } },
  });
  assert.equal(flags.cancellationMode, "unrecognized");
  assert.equal(flags.testLoginUrl, false);
  assert.ok(!JSON.stringify(flags).includes("private"));
  assert.equal(portalReadinessFlags(portal).testLoginUrl, true);
});

test("readiness uses only version-pinned GET requests and never forwards the webhook secret", async () => {
  const calls = [];
  const result = await checkReadiness({
    connectionValue,
    webhookSecret,
    fetchImpl: async (url, options) => {
      calls.push(url);
      assert.equal(options.method, "GET");
      assert.equal(options.headers["Stripe-Version"], "2024-06-20");
      assert.ok(!JSON.stringify(options).includes(webhookSecret));
      return Response.json(
        url.endsWith("/account") ? { id: "acct_association" } : { data: [portal], has_more: false },
      );
    },
  });
  assert.equal(calls.length, 2);
  assert.equal(result.state, "ready_for_deployment_preparation");
  assert.equal(result.portalConfigurationId, portal.id);
});
test("missing permissions or ambiguous/incomplete Portals require Dashboard action without changes", async () => {
  for (const result of [
    null,
    { data: [], has_more: false },
    { data: [portal], has_more: true },
    {
      data: [
        { ...portal, is_default: false },
        { ...portal, id: "bpc_second", is_default: false },
      ],
      has_more: false,
    },
  ]) {
    const state = await checkReadiness({
      connectionValue,
      webhookSecret,
      fetchImpl: async (url) =>
        url.endsWith("/account")
          ? Response.json({ id: "acct_association" })
          : result === null
            ? new Response("private", { status: 403 })
            : Response.json(result),
    });
    assert.equal(state.state, "portal_dashboard_required");
  }
});
