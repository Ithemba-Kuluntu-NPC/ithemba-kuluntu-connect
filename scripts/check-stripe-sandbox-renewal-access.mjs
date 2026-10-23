import assert from "node:assert/strict";
import {
  checkSandbox,
  parseSandboxConnection,
  SANDBOX_API_VERSION,
} from "./check-stripe-sandbox.mjs";

async function main() {
  assert.equal(process.env.GITHUB_REPOSITORY, "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect");
  assert.equal(process.env.GITHUB_REF, "refs/heads/codex/stripe-donations-integration");
  const connection = parseSandboxConnection(process.env.STRIPE_SANDBOX_CONNECTION);
  console.log(`::add-mask::${connection.restrictedKey}`);
  console.log(`::add-mask::${connection.publishableKey}`);
  await checkSandbox();
  // Probe only. Do not create clocks, alter billing dates or expand key permissions.
  const response = await fetch("https://api.stripe.com/v1/test_helpers/test_clocks?limit=1", {
    method: "GET",
    redirect: "error",
    signal: AbortSignal.timeout(15000),
    headers: {
      Authorization: `Bearer ${connection.restrictedKey}`,
      "Stripe-Version": SANDBOX_API_VERSION,
    },
  });
  assert.ok([200, 403].includes(response.status));
  console.log(
    `SANDBOX_RENEWAL_CLOCK_ACCESS: ${response.status === 200 ? "read_available_write_not_established" : "restricted_key_denied"}. No clock or subscription changed; real accelerated-renewal acceptance is not implied.`,
  );
}
main().catch(() => {
  console.error("Sandbox renewal-access probe incomplete; raw errors and credentials omitted.");
  process.exitCode = 1;
});
