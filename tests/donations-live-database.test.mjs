import assert from "node:assert/strict";
import { test } from "node:test";
import { checkLiveDatabase, LIVE_DATABASE_ID, LIVE_DATABASE_NAME } from "../scripts/check-donations-live-database.mjs";
const accountId = "a".repeat(32);
const apiToken = "fake-test-token-for-local-checks";
const connectionValue = JSON.stringify({ accountId, apiToken });
const metadata = { uuid: LIVE_DATABASE_ID, name: LIVE_DATABASE_NAME };
const rows = (results) => Response.json({ success: true, result: [{ success: true, results }] });

test("live database inspection authenticates exact target then issues only fixed read SQL", async () => {
  const calls = [];
  const result = await checkLiveDatabase({ connectionValue, context: {}, fetchImpl: async (url, options) => {
    calls.push({ url, options });
    assert.equal(options.redirect, "error");
    assert.equal(options.headers.Authorization, `Bearer ${apiToken}`);
    assert.ok(url.startsWith(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${LIVE_DATABASE_ID}`));
    if (options.method === "GET") {
      assert.equal(options.body, undefined);
      return Response.json({ success: true, result: metadata });
    }
    assert.equal(options.method, "POST");
    const { sql } = JSON.parse(options.body);
    assert.match(sql, /^SELECT name, type FROM sqlite_master /);
    assert.doesNotMatch(sql, /CREATE|INSERT|UPDATE|DELETE|DROP|ALTER/);
    return rows([]);
  }});
  assert.equal(calls.length, 2);
  assert.equal(result.empty, true);
  assert.deepEqual(result.pendingMigrations, ["0001_donations.sql"]);
  assert.equal(result.migrationApplied, false);
  assert.equal(result.workerBindingChanged, false);
  assert.equal(result.readyForLaunch, false);
  assert.equal(JSON.stringify(result).includes(apiToken), false);
});

test("wrong or staging database prevents even schema inspection", async () => {
  for (const change of [{ uuid: "990e1489-72e6-4a2b-b2f6-dbb4863e4971" }, { name: "ithemba-donations-staging" }]) {
    let calls = 0;
    await assert.rejects(checkLiveDatabase({ connectionValue, context: {}, fetchImpl: async () => {
      calls++;
      return Response.json({ success: true, result: { ...metadata, ...change } });
    }}), /mismatch/);
    assert.equal(calls, 1);
  }
});

test("nonempty and incomplete databases never get an invented pending list", async () => {
  for (const results of [[{ name: "donations", type: "table" }], [{ name: "unrelated", type: "table" }]]) {
    let n = 0;
    const r = await checkLiveDatabase({ connectionValue, context: {}, fetchImpl: async () =>
      ++n === 1 ? Response.json({ success: true, result: metadata }) : rows(results) });
    assert.equal(r.state, "live_database_nonempty_review_required");
    assert.equal(r.pendingMigrations, null);
  }
  let n = 0;
  await assert.rejects(checkLiveDatabase({ connectionValue, context: {}, fetchImpl: async () =>
    ++n === 1 ? Response.json({ success: true, result: metadata }) : Response.json({ success: true, result: [] }) }), /Incomplete/);
});

test("missing/invalid credentials and untrusted branch events make no request", async () => {
  let calls = 0;
  const fetchImpl = () => { calls++; throw new Error("unexpected"); };
  assert.equal((await checkLiveDatabase({ connectionValue: "", context: {}, fetchImpl })).state, "cloudflare_connection_unavailable");
  for (const value of ["bad", "null", "[]", JSON.stringify({ accountId, apiToken, extra: true })]) {
    await assert.rejects(checkLiveDatabase({ connectionValue: value, context: {}, fetchImpl }));
  }
  for (const change of [{ GITHUB_REF: "refs/heads/main" }, { GITHUB_EVENT_NAME: "pull_request" }, { GITHUB_REPOSITORY: "other/repo" }]) {
    await assert.rejects(checkLiveDatabase({ connectionValue, context: {
      GITHUB_ACTIONS: "true", GITHUB_REF: "refs/heads/codex/stripe-donations-integration",
      GITHUB_EVENT_NAME: "push", GITHUB_REPOSITORY: "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect", ...change,
    }, fetchImpl }));
  }
  assert.equal(calls, 0);
});

test("provider errors cannot disclose tokens or raw response details", async () => {
  for (const fetchImpl of [
    async () => new Response(apiToken, { status: 403 }),
    async () => { throw new Error(apiToken); },
    async () => new Response(apiToken),
    async () => Response.json({ success: false, errors: [apiToken] }),
  ]) {
    await assert.rejects(checkLiveDatabase({ connectionValue, context: {}, fetchImpl }),
      error => !error.message.includes(apiToken));
  }
});
