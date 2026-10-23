import assert from "node:assert/strict";
import { test } from "node:test";
import { checkProductionPreparation } from "../scripts/check-donations-production-preparation.mjs";
const workerToken = "fake-test-worker-access-token";
const connectionValue = JSON.stringify({
  accountId: "a".repeat(32),
  apiToken: "not-used-for-worker-reads",
});
const id = "11111111-2222-4333-8444-555555555555";
const settings = {
  bindings: [
    { name: "CONTACT_SECRET", type: "secret_text" },
    { name: "NEWSLETTER", type: "plain_text", text: "private-existing-config-value" },
  ],
  compatibility_date: "2025-09-24",
  compatibility_flags: ["nodejs_compat"],
};

test("production review uses only fixed GETs, preserves privacy and records current rollback versions", async () => {
  const calls = [];
  const result = await checkProductionPreparation({
    connectionValue,
    workerToken,
    context: {},
    fetchImpl: async (url, options) => {
      calls.push(url);
      assert.equal(options.method, "GET");
      assert.equal(options.body, undefined);
      assert.equal(options.redirect, "error");
      assert.equal(options.headers.Authorization, `Bearer ${workerToken}`);
      const data = url.endsWith("/settings")
        ? settings
        : url.endsWith("/deployments")
          ? {
              deployments: [
                {
                  id,
                  created_on: "2026-10-23T00:00:00Z",
                  versions: [{ version_id: id, percentage: 100 }],
                },
              ],
            }
          : [
              {
                hostname: "ithembakuluntu.org",
                service: "tanstack-start-app",
                environment: "production",
              },
            ];
      return Response.json({ success: true, result: data });
    },
  });
  assert.equal(calls.length, 3);
  assert.ok(
    calls.every(
      (url) =>
        url.endsWith("/tanstack-start-app/settings") ||
        url.endsWith("/tanstack-start-app/deployments") ||
        url.endsWith("/workers/domains"),
    ),
  );
  assert.equal(result.rollbackVerified, true);
  assert.equal(result.canonicalCustomDomainMatches, true);
  assert.equal(result.donationBindingPresence.DONATIONS_DB, false);
  assert.equal(result.workerChanged, false);
  assert.equal(result.readyForLaunch, false);
  assert.equal(JSON.stringify(result).includes("private-existing-config-value"), false);
  assert.equal(JSON.stringify(result).includes(workerToken), false);
});
test("missing permission is a Dashboard review requirement, never authority to overwrite production", async () => {
  const result = await checkProductionPreparation({
    connectionValue,
    workerToken,
    context: {},
    fetchImpl: async () => new Response(workerToken, { status: 403 }),
  });
  assert.equal(result.state, "production_settings_dashboard_review_required");
  assert.equal(result.readyForLaunch, false);
});
test("untrusted branches and malformed credentials fail before network; provider details remain private", async () => {
  let calls = 0;
  for (const change of [
    { connectionValue: "invalid" },
    { workerToken: "short" },
    { context: { GITHUB_ACTIONS: "true", GITHUB_REF: "refs/heads/main" } },
  ]) {
    await assert.rejects(
      checkProductionPreparation({
        connectionValue,
        workerToken,
        context: {},
        ...change,
        fetchImpl: () => {
          calls++;
        },
      }),
    );
  }
  assert.equal(calls, 0);
  await assert.rejects(
    checkProductionPreparation({
      connectionValue,
      workerToken,
      context: {},
      fetchImpl: async () => {
        throw new Error(workerToken);
      },
    }),
    (error) => !error.message.includes(workerToken),
  );
});
