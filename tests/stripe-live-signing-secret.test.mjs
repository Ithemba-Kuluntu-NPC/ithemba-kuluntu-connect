import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { checkLiveSigningSecret } from "../scripts/check-stripe-live-signing-secret.mjs";
const live = "whsec_liveFixtureOnly1234567890";
const sandbox = "whsec_sandboxFixtureOnly1234567890";
test("saved live secret is format-checked and distinct without claiming provider or delivery proof", () => {
  const result = checkLiveSigningSecret({live, sandbox});
  assert.equal(result.preparedForApproval, true);
  for (const field of ["providerOwnershipVerified", "deliveryVerified", "secretInstalledOnWorker", "readyForLaunch"]) assert.equal(result[field], false);
  assert.equal(JSON.stringify(result).includes(live), false);
  assert.equal(JSON.stringify(result).includes(sandbox), false);
});
test("missing or malformed live/sandbox values cannot pass the essential preparation gate", () => {
  for (const value of [undefined, "", "whsec_short", "rk_live_fixture", live + "\n", {}, []]) {
    assert.equal(checkLiveSigningSecret({live: value, sandbox}).preparedForApproval, false);
    assert.equal(checkLiveSigningSecret({live, sandbox: value}).preparedForApproval, false);
  }
});
test("reusing the sandbox signing secret fails closed", () => {
  const result = checkLiveSigningSecret({live: sandbox, sandbox});
  assert.equal(result.formatValid, true);
  assert.equal(result.distinctFromSandbox, false);
  assert.equal(result.preparedForApproval, false);
});
test("signing-secret verification has no networking, Worker installation or secret logging paths", () => {
  const source = readFileSync(new URL("../scripts/check-stripe-live-signing-secret.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(source, /fetch\(|child_process|execFile|writeFile|Authorization/);
  assert.doesNotMatch(source, /console\.(?:log|error)\((?:live|sandbox|process\.env)/);
});
