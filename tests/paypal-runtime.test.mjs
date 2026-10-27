import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSync } from "esbuild";
import { Miniflare, createFetchMock } from "miniflare";

// Exercise the actual Workers fetch implementation, not Node's more permissive fetch.
const bundle = buildSync({
  stdin: {
    resolveDir: new URL("..", import.meta.url).pathname,
    loader: "ts",
    contents: `import {handlePayPalRequest,verifyPayPalIPN} from './src/lib/paypal.server.ts';
      export default {async fetch(request) {
        if (new URL(request.url).pathname === '/verify') {
          try { return Response.json({verified:await verifyPayPalIPN('txn_id=fixture','production')}); }
          catch { return Response.json({unavailable:true},{status:503}); }
        }
        return handlePayPalRequest(request,{
          DONATIONS_DB:{},DONATION_SITE_ORIGIN:'https://donate.example.org',
          PAYPAL_DONATIONS_ENABLED:'true',PAYPAL_MODE:'production',PAYPAL_LIVE_APPROVED:'true',
          PAYPAL_HOSTED_BUTTON_ID:'2QSG3U3XQNJNQ',PAYPAL_MERCHANT_ID:'A3HPHWGZ35D9J'
        });
      }};`,
  },
  bundle: true,
  platform: "browser",
  format: "esm",
  write: false,
}).outputFiles[0].text;

test("Workers rejects unverified PayPal notifications and accepts only VERIFIED postbacks", async () => {
  const mock = createFetchMock();
  mock.disableNetConnect();
  const paypal = mock.get("https://ipnpb.paypal.com");
  paypal.intercept({ method: "POST", path: "/cgi-bin/webscr" }).reply(200, "INVALID");
  paypal.intercept({ method: "POST", path: "/cgi-bin/webscr" }).reply(200, "VERIFIED");
  const mf = new Miniflare({
    modules: true,
    script: bundle,
    compatibilityDate: "2025-09-24",
    fetchMock: mock,
  });
  try {
    const invalid = await mf.dispatchFetch("https://donate.example.org/api/paypal/ipn", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "txn_id=invalid",
    });
    assert.equal(invalid.status, 400);
    const valid = await mf.dispatchFetch("https://donate.example.org/verify");
    assert.equal(valid.status, 200);
    assert.deepEqual(await valid.json(), { verified: true });
  } finally {
    await mf.dispose();
  }
});

test("Workers never follows PayPal verification redirects", async () => {
  const mock = createFetchMock();
  mock.disableNetConnect();
  mock
    .get("https://ipnpb.paypal.com")
    .intercept({ method: "POST", path: "/cgi-bin/webscr" })
    .reply(302, "", { headers: { location: "https://unexpected.example/collect" } });
  const mf = new Miniflare({
    modules: true,
    script: bundle,
    compatibilityDate: "2025-09-24",
    fetchMock: mock,
  });
  try {
    const res = await mf.dispatchFetch("https://donate.example.org/verify");
    assert.equal(res.status, 503);
    assert.deepEqual(await res.json(), { unavailable: true });
  } finally {
    await mf.dispose();
  }
});
