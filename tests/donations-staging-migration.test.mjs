import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  assertApprovedMigration,
  assertDatabaseTarget,
  migrateStaging,
  parseStagingConnection,
} from "../scripts/migrate-donations-staging.mjs";
const accountId = "a".repeat(32);
const connectionValue = JSON.stringify({ accountId, apiToken: "fake-token-for-local-tests" });
const uuid = "990e1489-72e6-4a2b-b2f6-dbb4863e4971";
const metadata = { uuid, name: "ithemba-donations-staging" };
const sql = await readFile(new URL("../migrations/0001_donations.sql", import.meta.url));

test("missing or malformed authorization is rejected without exposing its value", () => {
  for (const value of [
    undefined,
    "",
    "invalid",
    "null",
    "[]",
    JSON.stringify({ accountId: "bad", apiToken: "fake" }),
  ])
    assert.throws(() => parseStagingConnection(value));
  assert.equal(parseStagingConnection(connectionValue).accountId, accountId);
});
test("only the unchanged approved SQL and exact staging database are accepted", () => {
  assertApprovedMigration(["0001_donations.sql"], sql);
  assert.throws(() => assertApprovedMigration(["0001_donations.sql", "0002.sql"], sql));
  assert.throws(() =>
    assertApprovedMigration(["0001_donations.sql"], Buffer.concat([sql, Buffer.from("\n")])),
  );
  assertDatabaseTarget(metadata);
  assert.throws(() => assertDatabaseTarget({ ...metadata, name: "production" }));
  assert.throws(() => assertDatabaseTarget({ ...metadata, uuid: "wrong" }));
});
test("account authorization or database mismatch prevents all migration commands", async () => {
  for (const response of [
    new Response("private-error-body", { status: 403 }),
    Response.json({ success: true, result: { ...metadata, uuid: "wrong" } }),
  ]) {
    const calls = [];
    await assert.rejects(
      migrateStaging({
        connectionValue,
        fetchImpl: async () => response,
        run: (...args) => calls.push(args),
      }),
    );
    assert.equal(calls.length, 0);
  }
});
test("historical staging migration runner refuses the new PayPal migration before remote access", async () => {
  let requests = 0;
  let commands = 0;
  await assert.rejects(
    migrateStaging({
      connectionValue,
      fetchImpl: async () => {
        requests++;
        throw new Error("Must not reach Cloudflare");
      },
      run: () => {
        commands++;
      },
    }),
    /Only the already-approved first migration may run/,
  );
  assert.equal(requests, 0);
  assert.equal(commands, 0);
});
