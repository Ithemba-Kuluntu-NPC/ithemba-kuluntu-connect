import assert from "node:assert/strict";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import {
  migrateLiveDatabase,
  LIVE_MIGRATION_APPROVAL,
} from "../scripts/migrate-donations-live.mjs";
import { LIVE_DATABASE_ID, LIVE_DATABASE_NAME } from "../scripts/check-donations-live-database.mjs";

const token = "fake-local-migration-test-token";
const accountId = "a".repeat(32);
const connectionValue = JSON.stringify({ accountId, apiToken: token });
function fixture({ metadata, failWrite = false } = {}) {
  const db = new DatabaseSync(":memory:");
  const calls = [];
  const fetchImpl = async (url, options) => {
    assert.ok(
      url.startsWith(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${LIVE_DATABASE_ID}`,
      ),
    );
    assert.equal(options.redirect, "error");
    assert.equal(options.headers.Authorization, `Bearer ${token}`);
    calls.push({ url, options });
    if (options.method === "GET")
      return Response.json({
        success: true,
        result: metadata ?? { uuid: LIVE_DATABASE_ID, name: LIVE_DATABASE_NAME },
      });
    const { sql } = JSON.parse(options.body);
    if (/CREATE TABLE/.test(sql)) {
      if (failWrite) return Response.json({ success: false, errors: [token] });
      db.exec(sql);
      return Response.json({ success: true, result: [{ success: true, results: [] }] });
    }
    return Response.json({
      success: true,
      result: [{ success: true, results: db.prepare(sql).all() }],
    });
  };
  return { db, calls, fetchImpl };
}
const options = {
  connectionValue,
  approval: LIVE_DATABASE_ID,
  approvalMessage: LIVE_MIGRATION_APPROVAL,
  context: {},
};

test("approved live migration applies the immutable file to exact target and verifies actual SQLite schema/history", async () => {
  const f = fixture();
  const reports = [];
  const result = await migrateLiveDatabase({
    ...options,
    fetchImpl: f.fetchImpl,
    report: (r) => reports.push(r),
  });
  assert.equal(result.state, "live_migration_applied_verified");
  assert.equal(result.ledgerEmpty, true);
  assert.equal(result.workerBindingChanged, false);
  assert.equal(result.readyForLaunch, false);
  assert.deepEqual(reports[0].pendingMigrations, ["0001_donations.sql"]);
  assert.deepEqual(
    f.db
      .prepare("SELECT name FROM d1_migrations")
      .all()
      .map((r) => r.name),
    ["0001_donations.sql"],
  );
  assert.equal(f.calls.filter((c) => /CREATE TABLE/.test(c.options.body ?? "")).length, 1);
  assert.equal(JSON.stringify(result).includes(token), false);
  const repeat = await migrateLiveDatabase({ ...options, fetchImpl: f.fetchImpl });
  assert.equal(repeat.state, "live_migration_already_applied_verified");
  assert.equal(repeat.migrationApplied, false);
  assert.equal(f.calls.filter((c) => /CREATE TABLE/.test(c.options.body ?? "")).length, 1);
  f.db.close();
});

test("missing approval, wrong database approval, untrusted context and wrong marker prevent all requests", async () => {
  for (const change of [
    { approval: undefined },
    { approval: "990e1489-72e6-4a2b-b2f6-dbb4863e4971" },
    { approvalMessage: "unapproved" },
    { context: { GITHUB_ACTIONS: "true", GITHUB_REF: "refs/heads/main" } },
  ]) {
    let calls = 0;
    await assert.rejects(
      migrateLiveDatabase({
        ...options,
        ...change,
        fetchImpl: () => {
          calls++;
        },
      }),
    );
    assert.equal(calls, 0);
  }
});

test("wrong authenticated name/ID prevents schema writes", async () => {
  for (const metadata of [
    { uuid: LIVE_DATABASE_ID, name: "production" },
    { uuid: "990e1489-72e6-4a2b-b2f6-dbb4863e4971", name: LIVE_DATABASE_NAME },
  ]) {
    const f = fixture({ metadata });
    await assert.rejects(migrateLiveDatabase({ ...options, fetchImpl: f.fetchImpl }));
    assert.equal(f.calls.length, 1);
    f.db.close();
  }
});

test("nonempty/partial/unrelated schemas are never overwritten or repaired automatically", async () => {
  for (const sql of [
    "CREATE TABLE unrelated(id TEXT)",
    "CREATE TABLE donations(id TEXT)",
    "CREATE TABLE acf_private(id TEXT)",
  ]) {
    const f = fixture();
    f.db.exec(sql);
    await assert.rejects(migrateLiveDatabase({ ...options, fetchImpl: f.fetchImpl }));
    assert.equal(
      f.calls.some((c) => /CREATE TABLE/.test(c.options.body ?? "")),
      false,
    );
    f.db.close();
  }
});

test("provider failure cannot produce success, history, or leak raw error details", async () => {
  const f = fixture({ failWrite: true });
  await assert.rejects(
    migrateLiveDatabase({ ...options, fetchImpl: f.fetchImpl }),
    (error) => !error.message.includes(token),
  );
  assert.equal(
    f.db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE name='d1_migrations'").get().n,
    0,
  );
  f.db.close();
});
