import assert from "node:assert/strict";
import { test } from "node:test";
import {
  inspectPortalLink,
  publicPageFlags,
  PUBLIC_TEST_PORTAL_URL,
} from "../scripts/inspect-stripe-portal-link.mjs";
const connectionValue = JSON.stringify({
  restrictedKey: "rk_test_fixture123",
  publishableKey: "pk_test_fixture123",
  accountId: "acct_association",
});
test("public-page diagnostics expose only booleans, never IDs or page content", () => {
  const flags = publicPageFlags(
    "private-name acct_association acct_other bpc_private customer_portal",
    "acct_association",
    ["bpc_private"],
  );
  assert.equal(flags.containsExpectedAccountId, true);
  assert.equal(flags.containsOtherAccountReference, true);
  assert.equal(flags.containsExpectedConfigurationId, true);
  assert.ok(!JSON.stringify(flags).includes("private"));
});
test("inspection makes only GET requests and never sends a secret to the public page", async () => {
  const calls = [];
  await inspectPortalLink({
    connectionValue,
    fetchImpl: async (url, options) => {
      calls.push(url);
      assert.equal(options.method, "GET");
      assert.equal(options.redirect, "error");
      if (url === PUBLIC_TEST_PORTAL_URL) {
        assert.equal(options.headers, undefined);
        return new Response("customer_portal");
      }
      assert.equal(new URL(url).hostname, "api.stripe.com");
      return Response.json(
        url.endsWith("/account") ? { id: "acct_association" } : { data: [], has_more: false },
      );
    },
  });
  assert.equal(calls.length, 4);
});
test("network and API failures do not expose secret-bearing error details", async () => {
  await assert.rejects(
    inspectPortalLink({
      connectionValue,
      fetchImpl: async (url) => {
        if (url.endsWith("/account")) return Response.json({ id: "acct_association" });
        throw new Error("rk_test_fixture123");
      },
    }),
    (error) => !error.message.includes("fixture123"),
  );
});
