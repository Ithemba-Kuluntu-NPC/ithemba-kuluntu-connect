import assert from "node:assert/strict";
import { test } from "node:test";
import { assertSmokeConfig, smokeSandbox, SMOKE_ORIGIN } from "../scripts/smoke-stripe-sandbox.mjs";
const connectionValue = JSON.stringify({
  accountId: "a".repeat(32),
  apiToken: "fixture-d1-token-for-testing",
});
const config = {
  mode: "test",
  publishableKey: "pk_test_fixture123",
  portalLoginUrl: "https://billing.stripe.com/p/login/test_28EcN70MMeBD64G5MMfUQ00",
};
test("smoke checks refuse live or mismatched configuration before creating Checkout", () => {
  assertSmokeConfig(config);
  for (const change of [
    { mode: "live" },
    { publishableKey: "pk_live_fixture" },
    { portalLoginUrl: "https://evil.example" },
  ])
    assert.throws(() => assertSmokeConfig({ ...config, ...change }));
});
test("both uncharged flows use only staging, expire sessions and verify read-only webhook records", async () => {
  let cancelled = false;
  const creates = [];
  await smokeSandbox({
    connectionValue,
    pause: async () => {},
    fetchImpl: async (url, options) => {
      if (url.includes("api.cloudflare.com")) {
        assert.ok(url.includes("/d1/database/990e1489-72e6-4a2b-b2f6-dbb4863e4971"));
        if (options.method === "GET")
          return Response.json({
            success: true,
            result: {
              name: "ithemba-donations-staging",
              uuid: "990e1489-72e6-4a2b-b2f6-dbb4863e4971",
            },
          });
        const query = JSON.parse(options.body);
        assert.ok(query.sql.startsWith("SELECT id FROM donation_events"));
        assert.equal(query.params.length, 1);
        return Response.json({
          success: true,
          result: [{ success: true, results: [{ id: "evt_fixture" }] }],
        });
      }
      assert.equal(new URL(url).origin, SMOKE_ORIGIN);
      assert.equal(options.headers.Authorization, undefined);
      if (url.endsWith("/config"))
        return Response.json(config, {
          headers: { "set-cookie": "owner=fixture; HttpOnly; Secure" },
        });
      if (url.endsWith("/create")) {
        const payload = JSON.parse(options.body);
        creates.push(payload);
        cancelled = false;
        assert.equal(payload.email, "stripe-sandbox-check@example.org");
        return Response.json({
          id: payload.requestId,
          status: "open",
          clientSecret: "cs_test_fixture_secret_fixture",
        });
      }
      if (url.endsWith("/cancel")) {
        cancelled = true;
        return Response.json({ status: "cancelled" });
      }
      return Response.json({
        status: cancelled ? "cancelled" : "open",
        frequency: creates.at(-1).frequency,
        canManage: false,
      });
    },
  });
  assert.deepEqual(
    creates.map((c) => c.frequency),
    ["once", "once", "monthly", "monthly"],
  );
  assert.equal(creates[0].requestId, creates[1].requestId);
});
test("wrong D1 metadata prevents any donation API operation", async () => {
  let calls = 0;
  await assert.rejects(
    smokeSandbox({
      connectionValue,
      fetchImpl: async () => {
        calls++;
        return Response.json({ success: true, result: { name: "production", uuid: "wrong" } });
      },
    }),
  );
  assert.equal(calls, 1);
});
