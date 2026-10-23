import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  checkLiveAccount,
  parseLiveConnection,
  LIVE_PREPARATION_API_VERSION,
} from "../scripts/check-stripe-live-account.mjs";

const connection = {
  restrictedKey: "rk_live_fixture123",
  publishableKey: "pk_live_fixture123",
  accountId: "acct_fixture",
};
const value = JSON.stringify(connection);
const ready = {
  id: connection.accountId,
  country: "DE",
  details_submitted: true,
  charges_enabled: true,
  payouts_enabled: true,
  requirements: {
    currently_due: [],
    past_due: [],
    pending_verification: [],
    disabled_reason: null,
  },
};

test("live preparation refuses sandbox/mixed/standard/extra credentials before any network call", async () => {
  assert.deepEqual(parseLiveConnection(value), connection);
  let calls = 0;
  assert.deepEqual(
    await checkLiveAccount({
      connectionValue: "",
      context: {},
      fetchImpl: () => {
        calls++;
      },
    }),
    { state: "live_connection_not_saved", readyForLaunch: false },
  );
  for (const change of [
    { restrictedKey: "rk_test_fixture123" },
    { restrictedKey: "sk_live_fixture123" },
    { restrictedKey: "whsec_privateFixture" },
    { publishableKey: "pk_test_fixture123" },
    { accountId: "sandbox_fixture" },
    { extra: "privateFixture" },
  ])
    await assert.rejects(
      checkLiveAccount({
        connectionValue: JSON.stringify({ ...connection, ...change }),
        context: {},
        fetchImpl: () => {
          calls++;
        },
      }),
      (error) => !error.message.includes("fixture123") && !error.message.includes("privateFixture"),
    );
  for (const invalid of ["null", "[]", "not-json"])
    assert.throws(() => parseLiveConnection(invalid));
  assert.equal(calls, 0);
});

test("invalid live connection diagnostics identify only the offending field and never send credentials", async () => {
  for (const field of ["restrictedKey", "publishableKey", "accountId"]) {
    let calls = 0;
    await assert.rejects(
      checkLiveAccount({
        connectionValue: JSON.stringify({ ...connection, [field]: "private-invalid-value" }),
        context: {},
        fetchImpl: () => {
          calls++;
        },
      }),
      (error) =>
        error.message.includes(field) &&
        !error.message.includes("private-invalid-value") &&
        !error.message.includes("fixture123"),
    );
    assert.equal(calls, 0);
  }
});

test("live preparation has one version-pinned GET and never claims account readiness activates donations", async () => {
  const calls = [];
  const result = await checkLiveAccount({
    connectionValue: value,
    context: {},
    fetchImpl: async (url, options) => {
      calls.push(url);
      assert.equal(url, "https://api.stripe.com/v1/account");
      assert.equal(options.method, "GET");
      assert.equal(options.redirect, "error");
      assert.equal(options.body, undefined);
      assert.equal(options.headers.Authorization, `Bearer ${connection.restrictedKey}`);
      assert.equal(options.headers["Stripe-Version"], LIVE_PREPARATION_API_VERSION);
      return Response.json(ready);
    },
  });
  assert.equal(calls.length, 1);
  assert.equal(result.state, "account_ready_for_configuration_review");
  assert.equal(result.readyForLaunch, false);
  assert.equal(result.siteActivationPerformed, false);
  for (const field of [
    "legalOwnershipVerified",
    "publishableKeyPairingVerified",
    "runtimeWritePermissionsVerified",
    "liveWebhookVerified",
    "livePortalVerified",
  ])
    assert.equal(result[field], false);
  assert.ok(
    readFileSync(new URL("../src/lib/donations.server.ts", import.meta.url), "utf8").includes(
      `API_VERSION = "${LIVE_PREPARATION_API_VERSION}"`,
    ),
  );
  assert.equal(JSON.stringify(result).includes(connection.accountId), false);
  assert.equal(JSON.stringify(result).includes(connection.restrictedKey), false);
});

test("payout, verification, disabled and incomplete accounts require action, never launch readiness", async () => {
  for (const change of [
    { charges_enabled: false },
    { payouts_enabled: false },
    { details_submitted: false },
    { requirements: undefined },
    { requirements: { ...ready.requirements, currently_due: ["privateField"] } },
    { requirements: { ...ready.requirements, past_due: ["privateField"] } },
    { requirements: { ...ready.requirements, pending_verification: ["privateField"] } },
    { requirements: { ...ready.requirements, disabled_reason: "privateReason" } },
  ]) {
    const result = await checkLiveAccount({
      connectionValue: value,
      context: {},
      fetchImpl: async () => Response.json({ ...ready, ...change }),
    });
    assert.equal(result.state, "account_action_required");
    assert.equal(result.readyForLaunch, false);
    assert.equal(JSON.stringify(result).includes("privateField"), false);
    assert.equal(JSON.stringify(result).includes("privateReason"), false);
  }
});

test("wrong beneficiary, untrusted branches/events and provider failures disclose no credentials or response body", async () => {
  for (const context of [
    { GITHUB_REF: "refs/heads/main" },
    { GITHUB_REPOSITORY: "other/repo" },
    { GITHUB_EVENT_NAME: "pull_request" },
  ]) {
    let calls = 0;
    await assert.rejects(
      checkLiveAccount({
        connectionValue: value,
        context: {
          GITHUB_ACTIONS: "true",
          GITHUB_REF: "refs/heads/codex/stripe-donations-integration",
          GITHUB_REPOSITORY: "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect",
          GITHUB_EVENT_NAME: "push",
          ...context,
        },
        fetchImpl: () => {
          calls++;
        },
      }),
    );
    assert.equal(calls, 0);
  }
  for (const fetchImpl of [
    async () => Response.json({ ...ready, id: "acct_other" }),
    async () => Response.json({ ...ready, country: "US" }),
    ...[401, 403, 500].map(
      (status) => async () => Response.json({ error: connection.restrictedKey }, { status }),
    ),
    async () => {
      throw new Error(connection.restrictedKey);
    },
    async () => new Response("privateProviderBody"),
  ])
    await assert.rejects(
      checkLiveAccount({ connectionValue: value, context: {}, fetchImpl }),
      (error) =>
        !error.message.includes(connection.restrictedKey) &&
        !error.message.includes("privateProviderBody"),
    );
});

test("live configuration review template is inert, has no credentials and cannot select the staging database", () => {
  const plan = JSON.parse(
    readFileSync(new URL("../config/stripe-donations-live.example.json", import.meta.url), "utf8"),
  );
  assert.equal(plan.launchApprovalRequired, true);
  for (const field of ["main", "name", "routes", "$schema"])
    assert.equal(Object.hasOwn(plan, field), false);
  assert.ok(Object.values(plan.workerSecrets).every((v) => v === null));
  assert.equal(plan.database.databaseId, null);
  assert.equal(plan.database.binding, "DONATIONS_DB");
  assert.notEqual(plan.database.proposedName, "ithemba-donations-staging");
  assert.equal(plan.stripe.webhookUrl, `${plan.siteOrigin}/api/donations/webhook`);
  assert.equal(plan.stripe.webhookEvents.length, 15);
});
