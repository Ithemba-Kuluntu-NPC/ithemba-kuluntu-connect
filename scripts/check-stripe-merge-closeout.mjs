import assert from "node:assert/strict";
let stage = "authorization";
try {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.ok(["refs/heads/main", "refs/heads/codex/stripe-donations-integration"].includes(process.env.GITHUB_REF));
  const connection = JSON.parse(process.env.CLOUDFLARE_D1_STAGING);
  const token = process.env.CLOUDFLARE_WORKER_STAGING_TOKEN;
  assert.match(connection.accountId, /^[a-f0-9]{32}$/i);
  assert.ok(typeof token === "string" && token.length > 20);
  console.log("::add-mask::" + token);
  const base = "https://api.cloudflare.com/client/v4/accounts/" + connection.accountId + "/workers";
  async function get(path) {
    const response = await fetch(base + path, { headers: { Authorization: "Bearer " + token }, redirect: "error", signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.success, true);
    return data.result;
  }
  stage = "production_bindings";
  const settings = await get("/scripts/tanstack-start-app/settings");
  const bindings = settings.bindings;
  assert.ok(Array.isArray(bindings));
  for (const name of ["STRIPE_SECRET_KEY","STRIPE_PUBLISHABLE_KEY","STRIPE_ACCOUNT_ID","STRIPE_WEBHOOK_SECRET","DONATION_COOKIE_SECRET","DONATION_SITE_ORIGIN","STRIPE_PORTAL_CONFIGURATION_ID","STRIPE_PORTAL_LOGIN_URL","BREVO_API_KEY","TURNSTILE_SECRET_KEY"])
    assert.ok(bindings.some(b => b.name === name && b.type === "secret_text"));
  assert.ok(bindings.some(b => b.name === "ASSETS" && b.type === "assets"));
  assert.ok(bindings.some(b => b.name === "DONATIONS_DB" && b.type === "d1" && b.id === "67acffe7-2412-44ce-817d-1d7f316d9392"));
  for (const [name,text] of Object.entries({ STRIPE_DONATIONS_MODE: "live", STRIPE_PAYPAL_ENABLED: "false", STRIPE_PAYPAL_RECURRING_ENABLED: "false", STRIPE_BANK_TRANSFER_ENABLED: "false" }))
    assert.ok(bindings.some(b => b.name === name && b.type === "plain_text" && b.text === text));
  assert.equal(settings.compatibility_date, "2025-09-24");
  assert.deepEqual(settings.compatibility_flags, ["nodejs_compat"]);
  stage = "active_deployment";
  const data = await get("/scripts/tanstack-start-app/deployments");
  const deployments = Array.isArray(data) ? data : data.deployments;
  const active = [...deployments].sort((a,b) => Date.parse(b.created_on)-Date.parse(a.created_on))[0];
  assert.equal(active.versions.reduce((sum,v) => sum+v.percentage,0),100);
  stage = "canonical_domain";
  const domains = await get("/domains");
  assert.ok(domains.some(d => d.hostname === "ithembakuluntu.org" && d.service === "tanstack-start-app" && d.environment === "production"));
  stage = "public_health";
  for (const path of ["/","/donate","/contact","/projects/greenhouse"]) {
    const response = await fetch("https://ithembakuluntu.org"+path, {redirect:"error",cache:"no-store",signal:AbortSignal.timeout(20000)});
    assert.equal(response.status,200);
    await response.arrayBuffer();
  }
  const configResponse = await fetch("https://ithembakuluntu.org/api/donations/config", {cache:"no-store",signal:AbortSignal.timeout(20000)});
  assert.equal(configResponse.status,200);
  assert.match(configResponse.headers.get("cache-control")??"",/no-store/);
  const config=await configResponse.json();
  assert.equal(config.mode,"live");
  assert.match(config.publishableKey??"",/^pk_live_[A-Za-z0-9]+$/);
  console.log(JSON.stringify({state:"stripe_merge_live_preservation_verified",activeVersions:active.versions,requiredBindingsPreserved:true,exactLiveDatabaseVerified:true,canonicalDomainVerified:true,publicPagesHealthy:true,liveModeVerified:true,sourceCommit:process.env.GITHUB_SHA,workerChanged:false,paymentCreated:false}));
} catch {
  console.error(JSON.stringify({state:"stripe_merge_live_preservation_incomplete",stage,secretOrDonorValuesPrinted:false}));
  process.exitCode=1;
}
