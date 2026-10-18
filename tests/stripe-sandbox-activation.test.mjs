import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync, statSync, existsSync } from "node:fs";
import { test } from "node:test";
import {
  activateSandbox,
  assertActivationApproval,
  ACTIVATION_MARKER,
  assertSandboxWorker,
  sandboxSecretValues,
  STAGING_ORIGIN,
  SECRET_NAMES,
} from "../scripts/activate-stripe-sandbox.mjs";
const connection = {
  restrictedKey: "rk_test_fixture123",
  publishableKey: "pk_test_fixture123",
  accountId: "acct_association",
};
const webhookSecret = "whsec_fixture1234567890";
const portal = {
  state: "ready_for_deployment_preparation",
  portalConfigurationId: "bpc_fixture",
  portalLoginUrl: "https://billing.stripe.com/p/login/test_fixture",
};
const dbId = "990e1489-72e6-4a2b-b2f6-dbb4863e4971";
const baseBindings = [
  { name: "DONATIONS_DB", type: "d1", id: dbId },
  { name: "ASSETS", type: "assets" },
  ...[
    "STRIPE_DONATIONS_MODE",
    "STRIPE_PAYPAL_ENABLED",
    "STRIPE_PAYPAL_RECURRING_ENABLED",
    "STRIPE_BANK_TRANSFER_ENABLED",
  ].map((name) => ({
    name,
    type: "plain_text",
    text: name === "STRIPE_DONATIONS_MODE" ? "test" : "false",
  })),
];
function fixture({
  existingCookie = false,
  failCommand = false,
  badDb = false,
  badConfig = false,
} = {}) {
  const calls = [];
  const commands = [];
  let uploaded = false;
  let secretsPath;
  let capturedSecrets;
  const options = {
    approval: "true",
    cloudflareValue: JSON.stringify({
      accountId: "a".repeat(32),
      apiToken: "fixture-d1-token-for-testing",
    }),
    workerToken: "fixture-worker-token-for-testing",
    stripeValue: JSON.stringify(connection),
    webhookSecret,
    check: async () => {},
    readiness: async () => portal,
    pause: async () => {},
    run(command, args, config) {
      commands.push({ command, args });
      if (command === "git") return;
      assert.equal(command, process.execPath);
      assert.equal(args[1], "deploy");
      assert.equal(args[2], "--config");
      assert.ok(args[3].endsWith("/wrangler.donations-staging.jsonc"));
      assert.equal(args[4], "--secrets-file");
      secretsPath = args[5];
      assert.equal(statSync(secretsPath).mode & 0o777, 0o600);
      assert.equal(statSync(secretsPath.replace(/\/bindings\.json$/, "")).mode & 0o777, 0o700);
      capturedSecrets = JSON.parse(readFileSync(secretsPath, "utf8"));
      assert.ok(!JSON.stringify(args).includes(connection.restrictedKey));
      assert.equal(config.env.STRIPE_SANDBOX_CONNECTION, undefined);
      assert.equal(config.env.STRIPE_SANDBOX_WEBHOOK_SECRET, undefined);
      assert.equal(config.env.CLOUDFLARE_D1_STAGING, undefined);
      assert.equal(config.env.CLOUDFLARE_API_TOKEN, options.workerToken);
      if (failCommand) throw new Error(connection.restrictedKey);
      uploaded = true;
    },
    async fetchImpl(url, request) {
      calls.push({ url, method: request.method ?? "GET" });
      if (url.includes("api.cloudflare.com")) {
        assert.equal(request.method, "GET");
        if (url.includes("/d1/database/"))
          return Response.json({
            success: true,
            result: { uuid: badDb ? "wrong" : dbId, name: "ithemba-donations-staging" },
          });
        if (url.endsWith("/workers/subdomain"))
          return Response.json({ success: true, result: { subdomain: "super-tooth-55f1" } });
        assert.ok(url.endsWith("/workers/scripts/ithemba-donations-staging/settings"));
        return Response.json({
          success: true,
          result: {
            bindings: [
              ...baseBindings,
              ...(uploaded
                ? SECRET_NAMES.map((name) => ({ name, type: "secret_text" }))
                : existingCookie
                  ? [{ name: "DONATION_COOKIE_SECRET", type: "secret_text" }]
                  : []),
            ],
          },
        });
      }
      assert.ok(url.startsWith(STAGING_ORIGIN + "/"));
      if (url.endsWith("/donate")) return new Response("donation page");
      if (url.endsWith("/config"))
        return Response.json(
          {
            publishableKey: connection.publishableKey,
            portalLoginUrl: portal.portalLoginUrl,
            mode: badConfig ? "live" : "test",
          },
          {
            headers: {
              "Set-Cookie": "owner=fixture; HttpOnly; Secure; SameSite=Lax; Path=/api/donations",
              "Cache-Control": "no-store",
            },
          },
        );
      assert.ok(url.endsWith("/webhook"));
      assert.equal(request.method, "POST");
      const event = JSON.parse(request.body);
      assert.equal(event.type, "donation.integration_probe");
      const signature = request.headers["Stripe-Signature"];
      const time = signature.match(/^t=(\d+),v1=/)[1];
      const expected = createHmac("sha256", webhookSecret)
        .update(`${time}.${request.body}`)
        .digest("hex");
      return Response.json(
        { received: true },
        { status: signature.endsWith(expected) ? 200 : 400 },
      );
    },
  };
  return {
    options,
    calls,
    commands,
    secretsPath: () => secretsPath,
    secrets: () => capturedSecrets,
  };
}
test("activation refuses missing approval before credentials, commands or network access", async () => {
  let touched = false;
  await assert.rejects(
    activateSandbox({
      phase: "activate",
      approval: "false",
      fetchImpl: async () => {
        touched = true;
      },
      run: () => {
        touched = true;
      },
    }),
    /approval is required/,
  );
  assert.equal(touched, false);
});
test("activation approval is restricted to the exact repository, branch, event and marker", () => {
  const context = {
    repository: "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect",
    ref: "refs/heads/codex/stripe-donations-integration",
    eventName: "push",
    commitMessage: ACTIVATION_MARKER,
  };
  assertActivationApproval("true", context);
  for (const change of [
    { repository: "other/repo" },
    { ref: "refs/heads/main" },
    { eventName: "pull_request" },
    { commitMessage: "ordinary branch update" },
  ])
    assert.throws(() => assertActivationApproval("true", { ...context, ...change }));
});

test("binding guards reject wrong D1, live mode, plaintext credentials, unknown or duplicate bindings", () => {
  assertSandboxWorker({ bindings: baseBindings });
  for (const bindings of [
    baseBindings.map((b) => (b.name === "DONATIONS_DB" ? { ...b, id: "wrong" } : b)),
    baseBindings.map((b) => (b.name === "STRIPE_DONATIONS_MODE" ? { ...b, text: "live" } : b)),
    [...baseBindings, { name: "STRIPE_SECRET_KEY", type: "plain_text", text: "private" }],
    [...baseBindings, { name: "PRODUCTION_DB", type: "d1", id: dbId }],
    [...baseBindings, baseBindings[0]],
  ])
    assert.throws(() => assertSandboxWorker({ bindings }));
  assert.throws(() => assertSandboxWorker({ bindings: baseBindings }, { activated: true }));
});
test("preflight makes no mutations, creates no secrets file and targets only the existing staging account", async () => {
  const f = fixture();
  await activateSandbox(f.options);
  assert.equal(f.commands.length, 1);
  assert.equal(f.commands[0].command, "git");
  assert.ok(f.calls.every((c) => c.method === "GET"));
  assert.equal(f.secretsPath(), undefined);
});
test("a source mismatch or unready Portal stops before Cloudflare calls or uploading", async () => {
  const source = fixture();
  await assert.rejects(
    activateSandbox({
      ...source.options,
      run: () => {
        throw new Error("Source changed");
      },
    }),
    /Source changed/,
  );
  assert.equal(source.calls.length, 0);
  const portal = fixture();
  await assert.rejects(
    activateSandbox({
      ...portal.options,
      readiness: async () => ({ state: "portal_dashboard_required" }),
    }),
    /Portal setup is not ready/,
  );
  assert.equal(portal.calls.length, 0);
  assert.throws(() =>
    sandboxSecretValues({ ...connection, restrictedKey: "rk_live_fixture123" }, webhookSecret, {
      state: "ready_for_deployment_preparation",
    }),
  );
});

test("a wrong staging database stops activation before uploading", async () => {
  const f = fixture({ badDb: true });
  await assert.rejects(activateSandbox({ ...f.options, phase: "activate" }));
  assert.equal(f.commands.length, 1);
  assert.equal(f.secretsPath(), undefined);
});
test("approved activation uses one explicit staging deploy, protects/removes temporary secrets and verifies signatures", async () => {
  const f = fixture();
  await activateSandbox({ ...f.options, phase: "activate" });
  assert.equal(f.commands.length, 2);
  assert.deepEqual(Object.keys(f.secrets()).sort(), [...SECRET_NAMES].sort());
  assert.equal(f.secrets().STRIPE_SECRET_KEY, connection.restrictedKey);
  assert.equal(f.secrets().DONATION_SITE_ORIGIN, STAGING_ORIGIN);
  assert.match(f.secrets().DONATION_COOKIE_SECRET, /^[0-9a-f]{64}$/);
  assert.equal(existsSync(f.secretsPath()), false);
  assert.equal(f.calls.filter((c) => c.method === "POST").length, 2);
});
test("an existing cookie signing secret is preserved on retry", async () => {
  const f = fixture({ existingCookie: true });
  await activateSandbox({ ...f.options, phase: "activate" });
  assert.equal(f.secrets().DONATION_COOKIE_SECRET, undefined);
  assert.equal(
    sandboxSecretValues(connection, webhookSecret, portal).DONATION_COOKIE_SECRET,
    undefined,
  );
});
test("upload and verification failures remain failures and temporary secrets are removed", async () => {
  for (const settings of [{ failCommand: true }, { badConfig: true }]) {
    const f = fixture(settings);
    await assert.rejects(
      activateSandbox({ ...f.options, phase: "activate" }),
      (error) => !error.message.includes(connection.restrictedKey),
    );
    assert.equal(existsSync(f.secretsPath()), false);
  }
});
