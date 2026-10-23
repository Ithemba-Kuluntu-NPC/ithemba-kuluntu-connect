import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Matches the donation runtime; no account-default API-version changes.
export const SANDBOX_API_VERSION = "2024-06-20";

export function parseSandboxConnection(value) {
  if (!value)
    throw new Error(
      "Save the STRIPE_SANDBOX_CONNECTION GitHub secret using the browser setup guide.",
    );
  let connection;
  try {
    connection = JSON.parse(value);
  } catch {
    throw new Error("Invalid sandbox connection JSON. Do not paste keys into chat.");
  }
  if (
    !connection ||
    typeof connection !== "object" ||
    Array.isArray(connection) ||
    Object.keys(connection).sort().join(",") !== "accountId,publishableKey,restrictedKey"
  )
    throw new Error(
      "Sandbox connection must contain restrictedKey (rk_test_), publishableKey (pk_test_) and accountId (acct_) only. Live credentials are refused.",
    );
  const invalid = [];
  if (
    typeof connection.restrictedKey !== "string" ||
    !/^rk_test_[A-Za-z0-9]{8,}$/.test(connection.restrictedKey)
  )
    invalid.push("restrictedKey: copy the complete restricted test key beginning rk_test_");
  if (
    typeof connection.publishableKey !== "string" ||
    !/^pk_test_[A-Za-z0-9]{8,}$/.test(connection.publishableKey)
  )
    invalid.push("publishableKey: copy the complete publishable test key beginning pk_test_");
  if (typeof connection.accountId !== "string" || !/^acct_[A-Za-z0-9]+$/.test(connection.accountId))
    invalid.push("accountId: use the Stripe account ID beginning acct_, not a sandbox ID or name");
  if (invalid.length)
    throw new Error(
      `Sandbox connection field check failed: ${invalid.join("; ")}. No saved values are shown and no Stripe request was made.`,
    );
  return connection;
}

export async function checkSandbox({
  connectionValue = process.env.STRIPE_SANDBOX_CONNECTION,
  fetchImpl = fetch,
} = {}) {
  const connection = parseSandboxConnection(connectionValue);
  if (process.env.GITHUB_ACTIONS === "true") {
    console.log(`::add-mask::${connection.restrictedKey}`);
    console.log(`::add-mask::${connection.publishableKey}`);
    if (
      process.env.GITHUB_REPOSITORY !== "Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect" ||
      process.env.GITHUB_REF !== "refs/heads/codex/stripe-donations-integration"
    )
      throw new Error("Sandbox account checks are restricted to the donations branch.");
  }
  let response;
  try {
    response = await fetchImpl("https://api.stripe.com/v1/account", {
      method: "GET",
      redirect: "error",
      headers: {
        Authorization: `Bearer ${connection.restrictedKey}`,
        "Stripe-Version": SANDBOX_API_VERSION,
      },
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      "Could not reach Stripe for the read-only sandbox account check. Retry the job.",
    );
  }
  if (response.status === 401)
    throw new Error("Stripe rejected the sandbox key. Check the saved restricted test key.");
  if (response.status === 403)
    throw new Error(
      "The restricted test key needs Account: Read for beneficiary-account verification.",
    );
  if (!response.ok)
    throw new Error(
      `Stripe sandbox account check failed (HTTP ${response.status}); no settings or payments changed.`,
    );
  let account;
  try {
    account = await response.json();
  } catch {
    throw new Error("Stripe returned an invalid account response.");
  }
  if (account?.id !== connection.accountId)
    throw new Error(
      "The restricted key belongs to a different Stripe account than the approved accountId. Setup stopped.",
    );
  console.log(
    "Restricted test key authenticated to the expected Stripe account using API 2024-06-20. No settings, Customers, payments or subscriptions created. Checkout scopes, publishable-key pairing, webhook and Portal still need sandbox verification.",
  );
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    await checkSandbox();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
