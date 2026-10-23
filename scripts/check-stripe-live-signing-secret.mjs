import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function checkLiveSigningSecret({ live, sandbox } = {}) {
  const format = value => typeof value === "string" && value.trim() === value && /^whsec_[A-Za-z0-9]{16,}$/.test(value);
  const liveFormatValid = format(live);
  const sandboxComparisonAvailable = format(sandbox);
  const distinctFromSandbox = liveFormatValid && sandboxComparisonAvailable && live !== sandbox;
  return {
    state: distinctFromSandbox ? "live_signing_secret_prepared" : "live_signing_secret_not_ready",
    secretSaved: typeof live === "string" && live.length > 0,
    formatValid: liveFormatValid,
    sandboxComparisonAvailable,
    distinctFromSandbox,
    preparedForApproval: distinctFromSandbox,
    providerOwnershipVerified: false,
    deliveryVerified: false,
    secretInstalledOnWorker: false,
    readyForLaunch: false,
  };
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.length !== 2 || process.env.GITHUB_ACTIONS !== "true" ||
        process.env.GITHUB_REPOSITORY !== "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect" ||
        process.env.GITHUB_REF !== "refs/heads/codex/stripe-donations-integration" ||
        process.env.GITHUB_EVENT_NAME !== "push") throw new Error("Untrusted signing-secret check");
    const result = checkLiveSigningSecret({
      live: process.env.STRIPE_LIVE_WEBHOOK_SECRET,
      sandbox: process.env.STRIPE_SANDBOX_WEBHOOK_SECRET,
    });
    console.log(JSON.stringify(result));
    if (!result.preparedForApproval) process.exitCode = 1;
  } catch {
    console.error("Signing-secret preparation check failed. No secret values are shown or installed.");
    process.exitCode = 1;
  }
}
