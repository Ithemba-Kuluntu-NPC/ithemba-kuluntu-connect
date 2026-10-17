import assert from "node:assert/strict";
import { test } from "node:test";
import { assertTestOnlySettings, deployStaging } from "../scripts/deploy-donations-staging.mjs";
const id = "990e1489-72e6-4a2b-b2f6-dbb4863e4971";
const account = "a".repeat(32);
const connectionValue = JSON.stringify({
  accountId: account,
  apiToken: "fake-d1-token-for-local-tests",
});
const deploymentToken = "fake-worker-token-for-local-tests";
const settings = {
  bindings: [
    { name: "DONATIONS_DB", type: "d1", id },
    { name: "STRIPE_DONATIONS_MODE", type: "plain_text", text: "test" },
  ],
};

test("production bindings, secrets, wrong D1 and live mode are rejected", () => {
  assertTestOnlySettings(settings, { deployed: true });
  for (const candidate of [
    { bindings: [{ name: "PRODUCTION_DB", type: "d1", id }] },
    { bindings: [{ name: "STRIPE_SECRET_KEY", type: "secret_text" }] },
    { bindings: [{ name: "DONATIONS_DB", type: "d1", id: "wrong" }, settings.bindings[1]] },
    {
      bindings: [
        settings.bindings[0],
        { name: "STRIPE_DONATIONS_MODE", type: "plain_text", text: "live" },
      ],
    },
  ])
    assert.throws(() => assertTestOnlySettings(candidate, { deployed: true }));
});
test("D1-only authorization fails before deploying or building anything", async () => {
  const commands = [];
  const fetchImpl = async (url) =>
    url.includes("/d1/database/")
      ? Response.json({ success: true, result: { uuid: id, name: "ithemba-donations-staging" } })
      : new Response("private-error", { status: 403 });
  await assert.rejects(
    deployStaging({
      phase: "preflight",
      connectionValue,
      fetchImpl,
      run: (...args) => commands.push(args),
    }),
    /deployment permission is missing/,
  );
  assert.equal(commands.length, 1);
  assert.equal(commands[0][0], "git");
});
test("wrong database metadata prevents Worker calls", async () => {
  const requests = [];
  await assert.rejects(
    deployStaging({
      phase: "preflight",
      connectionValue,
      fetchImpl: async (url) => {
        requests.push(url);
        return Response.json({
          success: true,
          result: { uuid: "wrong", name: "ithemba-donations-staging" },
        });
      },
      run: () => {},
    }),
  );
  assert.equal(requests.length, 1);
});
test("preflight uses only the exact account and staging Worker with no mutations", async () => {
  const requests = [];
  const commands = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    if (url.includes("/d1/database/"))
      return Response.json({
        success: true,
        result: { uuid: id, name: "ithemba-donations-staging" },
      });
    if (url.endsWith("/workers/subdomain"))
      return Response.json({ success: true, result: { subdomain: "test-account" } });
    return new Response("missing", { status: 404 });
  };
  await deployStaging({
    phase: "preflight",
    connectionValue,
    deploymentToken,
    fetchImpl,
    run: (...args) => commands.push(args),
  });
  assert.equal(commands.length, 1);
  assert.equal(requests.length, 3);
  assert.ok(
    requests.every(
      ({ url, options }) =>
        url.startsWith(`https://api.cloudflare.com/client/v4/accounts/${account}/`) &&
        options.method === "GET",
    ),
  );
  assert.ok(requests[2].url.endsWith("/workers/scripts/ithemba-donations-staging/settings"));
});

test("approved deployment has one explicit staging command and verifies test-only unavailable payments", async () => {
  const commands = [];
  const checks = [];
  const fetchImpl = async (url) => {
    if (url.includes("/d1/database/"))
      return Response.json({
        success: true,
        result: { uuid: id, name: "ithemba-donations-staging" },
      });
    if (url.endsWith("/workers/subdomain"))
      return Response.json({ success: true, result: { subdomain: "test-account" } });
    if (url.endsWith("/settings")) return Response.json({ success: true, result: settings });
    if (url.endsWith("/donate")) return new Response("Donation page", { status: 200 });
    if (url.endsWith("/api/donations/config"))
      return Response.json({ error: "unavailable" }, { status: 503 });
    throw new Error("Unexpected endpoint");
  };
  const url = await deployStaging({
    connectionValue,
    deploymentToken,
    fetchImpl,
    check: async (options) => checks.push(options),
    run: (...args) => commands.push(args),
  });
  assert.equal(url, "https://ithemba-donations-staging.test-account.workers.dev");
  assert.deepEqual(checks, [{ built: true }]);
  const [, args, options] = commands[1];
  assert.equal(commands.length, 2);
  assert.deepEqual(args.slice(1, 3), ["deploy", "--config"]);
  assert.ok(args[3].endsWith("wrangler.donations-staging.jsonc"));
  assert.equal(options.env.CLOUDFLARE_ACCOUNT_ID, account);
  assert.equal(options.env.CLOUDFLARE_API_TOKEN, deploymentToken);
  assert.equal(
    args.some((arg) => arg.includes("tanstack-start-app")),
    false,
  );
});
