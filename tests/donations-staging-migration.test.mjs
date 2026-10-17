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
test("migration runner lists then applies only staging and verifies tables and tracking", async () => {
  const commands = [];
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    const result = !options.body
      ? metadata
      : JSON.parse(options.body).params
        ? [{ results: [{ name: "0001_donations.sql" }] }]
        : [
            {
              results: [
                "donations",
                "donation_events",
                "donation_rate_limits",
                "d1_migrations",
              ].map((name) => ({ name })),
            },
          ];
    return Response.json({ success: true, result });
  };
  await migrateStaging({ connectionValue, fetchImpl, run: (...args) => commands.push(args) });
  assert.equal(commands.length, 2);
  assert.equal(commands[0][1][3], "list");
  assert.equal(commands[1][1][3], "apply");
  for (const [, args, options] of commands) {
    assert.ok(args.includes("--remote"));
    assert.ok(args.includes("ithemba-donations-staging"));
    assert.ok(args.at(-1).endsWith("wrangler.donations-staging.jsonc"));
    assert.equal(options.env.CLOUDFLARE_ACCOUNT_ID, accountId);
    assert.equal(args.includes("deploy"), false);
  }
  assert.ok(
    requests.every(({ url }) =>
      url.startsWith(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${uuid}`,
      ),
    ),
  );
});
