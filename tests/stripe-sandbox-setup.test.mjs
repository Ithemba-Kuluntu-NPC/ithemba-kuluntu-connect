import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  checkSandbox,
  parseSandboxConnection,
  SANDBOX_API_VERSION,
} from "../scripts/check-stripe-sandbox.mjs";

const connection = {
  restrictedKey: "rk_test_fixture123",
  publishableKey: "pk_test_fixture123",
  accountId: "acct_association",
};

test("sandbox connection accepts only restricted test keys and the explicit expected account", () => {
  assert.deepEqual(parseSandboxConnection(JSON.stringify(connection)), connection);
  for (const value of [
    null,
    "not-json",
    "[]",
    "null",
    ...[
      { restrictedKey: "rk_live_fixture123" },
      { restrictedKey: "sk_test_fixture123" },
      { publishableKey: "pk_live_fixture123" },
      { accountId: "other" },
      { extra: "unexpected" },
    ].map((change) => JSON.stringify({ ...connection, ...change })),
  ]) {
    assert.throws(
      () => parseSandboxConnection(value),
      (error) => !error.message.includes("fixture123"),
    );
  }
});

test("account validation makes exactly one version-pinned read-only request", async () => {
  const calls = [];
  await checkSandbox({
    connectionValue: JSON.stringify(connection),
    fetchImpl: async (url, options) => {
      calls.push(url);
      assert.equal(url, "https://api.stripe.com/v1/account");
      assert.equal(options.method, "GET");
      assert.equal(options.redirect, "error");
      assert.equal(options.headers.Authorization, `Bearer ${connection.restrictedKey}`);
      assert.equal(options.headers["Stripe-Version"], SANDBOX_API_VERSION);
      return Response.json({ id: connection.accountId });
    },
  });
  assert.equal(calls.length, 1);
  assert.ok(
    readFileSync(new URL("../src/lib/donations.server.ts", import.meta.url), "utf8").includes(
      `API_VERSION = "${SANDBOX_API_VERSION}"`,
    ),
  );
});

test("wrong account and API failures stop without exposing Stripe error content", async () => {
  for (const [status, result] of [
    [200, { id: "acct_other" }],
    [401, { error: connection.restrictedKey }],
    [403, { error: connection.restrictedKey }],
    [500, { error: connection.restrictedKey }],
  ]) {
    await assert.rejects(
      checkSandbox({
        connectionValue: JSON.stringify(connection),
        fetchImpl: async () => Response.json(result, { status }),
      }),
      (error) => !error.message.includes(connection.restrictedKey),
    );
  }
  await assert.rejects(
    checkSandbox({
      connectionValue: JSON.stringify(connection),
      fetchImpl: async () => {
        throw new Error(connection.restrictedKey);
      },
    }),
    (error) => !error.message.includes(connection.restrictedKey),
  );
});
