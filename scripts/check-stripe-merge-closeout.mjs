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
  stage = "active_deployment";
  const data = await get("/scripts/tanstack-start-app/deployments");
  const deployments = Array.isArray(data) ? data : data.deployments;
  const active = [...deployments].sort((a,b) => Date.parse(b.created_on)-Date.parse(a.created_on))[0];
  assert.equal(active.versions.reduce((sum,v) => sum+v.percentage,0),100);
  stage = "production_bindings";
  for (const traffic of active.versions.filter(v => v.percentage > 0)) {
    const version = await get("/scripts/tanstack-start-app/versions/" + traffic.version_id);
    const bindings = version.resources?.bindings;
    assert.ok(Array.isArray(bindings));
    const requiredSecrets = ["STRIPE_SECRET_KEY","STRIPE_PUBLISHABLE_KEY","STRIPE_ACCOUNT_ID","STRIPE_WEBHOOK_SECRET","DONATION_COOKIE_SECRET","DONATION_SITE_ORIGIN","STRIPE_PORTAL_CONFIGURATION_ID","STRIPE_PORTAL_LOGIN_URL","BREVO_API_KEY","TURNSTILE_SECRET_KEY"];
    const missingSecrets = requiredSecrets.filter(name => !bindings.some(b => b.name === name && b.type === "secret_text"));
    const databaseVerified = bindings.some(b => b.name === "DONATIONS_DB" && b.type === "d1" && b.id === "67acffe7-2412-44ce-817d-1d7f316d9392");
    const vars = {STRIPE_DONATIONS_MODE:"live",STRIPE_PAYPAL_ENABLED:"false",STRIPE_PAYPAL_RECURRING_ENABLED:"false",STRIPE_BANK_TRANSFER_ENABLED:"false"};
    const missingVariables = Object.entries(vars).filter(([name,text]) => !bindings.some(b => b.name === name && b.type === "plain_text" && b.text === text)).map(([name]) => name);
    console.log(JSON.stringify({state:"active_worker_binding_review",versionId:traffic.version_id,missingSecrets,missingVariables,databaseVerified,bindingNames:bindings.map(b=>({name:b.name,type:b.type}))}));
    assert.equal(missingSecrets.length,0);
    assert.equal(missingVariables.length,0);
    assert.equal(databaseVerified,true);
    assert.ok(bindings.some(b => b.name === "ASSETS" && b.type === "assets"));
  }
  const settings = await get("/scripts/tanstack-start-app/settings");
  assert.equal(settings.compatibility_date, "2025-09-24");
  assert.deepEqual(settings.compatibility_flags, ["nodejs_compat"]);
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
