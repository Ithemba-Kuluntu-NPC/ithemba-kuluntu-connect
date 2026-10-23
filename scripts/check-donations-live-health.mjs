import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { APPROVED_LIVE_LOGIN_SHA256 } from "./check-stripe-live-portal.mjs";

const MARKER = "Verify owner-confirmed live Checkout readiness without creating payments";
const ORIGIN = "https://ithembakuluntu.org";
let stage = "authorization";
try {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  assert.equal(process.env.GITHUB_EVENT_NAME, "push");
  const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
  assert.equal(event.head_commit?.message, MARKER);
  async function request(path, options = {}) {
    return fetch(ORIGIN + path, {
      ...options,
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
  }
  stage = "public_health";
  for (const path of ["/", "/donate", "/contact"]) {
    const response = await request(path);
    assert.equal(response.status, 200);
    await response.arrayBuffer();
  }
  stage = "live_public_configuration";
  const response = await request("/api/donations/config");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  const config = await response.json();
  assert.equal(config.mode, "live");
  assert.match(config.publishableKey ?? "", /^pk_live_[A-Za-z0-9]+$/);
  assert.equal(createHash("sha256").update(config.portalLoginUrl ?? "").digest("hex"), APPROVED_LIVE_LOGIN_SHA256);
  stage = "invalid_webhook_rejection";
  const invalid = await request("/api/donations/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json", "stripe-signature": "t=0,v1=invalid" },
    body: "{}",
  });
  assert.equal(invalid.status, 400);
  console.log(JSON.stringify({
    state: "owner_confirmed_live_checkout_ready_for_small_card_test",
    publicPagesHealthy: true,
    liveConfigurationVerified: true,
    approvedPortalFingerprintVerified: true,
    invalidWebhookRejected: true,
    ownerVerifiedOneTimeCardRendering: true,
    ownerReportedApplePayLinkAndSepaVisible: true,
    genuineSignedDeliveryPreviouslyVerifiedForBothFrequencies: true,
    paymentOrCheckoutCreated: false,
    fundedPaymentSubmitted: false,
    deploymentPerformed: false,
    mergePerformed: false,
  }));
} catch {
  console.error(JSON.stringify({ state: "live_final_health_incomplete", stage, secretOrDonorValuesPrinted: false }));
  process.exitCode = 1;
}
