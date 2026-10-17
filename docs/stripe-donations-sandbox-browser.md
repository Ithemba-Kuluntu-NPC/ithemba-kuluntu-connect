# Browser-only Stripe sandbox connection

This setup is for the existing PR #26 branch and isolated `ithemba-donations-staging` Worker only. Production, live keys, DNS and merging remain outside authorization. No software or commands are required on the operator's computer. Never paste credentials in chat, a PR, an issue or a repository file.

## Current next action: save one encrypted connection

In the association's **existing Stripe sandbox**, copy its restricted test key (`rk_test_…`), publishable test key (`pk_test_…`) and account ID (`acct_…`). Confirm the sandbox belongs to iThemba Kuluntu e.V.; the two keys must be from that same sandbox. Find keys in the sandbox's Developers/API keys (or Workbench API keys), and its account ID in account settings. Do not switch to live mode or create another account.

Open [New GitHub repository secret](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/settings/secrets/actions/new). Name it **`STRIPE_SANDBOX_CONNECTION`** and enter this JSON as its value, replacing all three placeholders with the actual values:

```json
{
  "restrictedKey": "rk_test_REPLACE",
  "publishableKey": "pk_test_REPLACE",
  "accountId": "acct_REPLACE"
}
```

Save it, then tell Codex **“Stripe sandbox connection saved.”** Leave the two existing Cloudflare secrets unchanged. GitHub encrypts the connection; the workflow masks individual keys and never writes them to source or artifacts. A saved restricted key cannot necessarily be revealed again in Stripe: if its value was not retained, a replacement restricted **test** key may be needed, using the runtime permissions in [the setup guide](stripe-donations-setup.md#restricted-api-key-permissions). Do not grant broad permissions to automate account administration.

## What Codex handles next

The prepared **Check Stripe sandbox account without changing settings** workflow runs mocked security tests, then makes a single `GET /v1/account` using the restricted key and runtime API version `2024-06-20`. It refuses live/standard keys or an account mismatch, and reports missing Account Read permission without exposing Stripe's raw error response. No Cloudflare credentials are available to this job. It cannot deploy, migrate, configure a webhook, create a Customer or take a payment. Missing connection stops the job; Codex can retry it after the secret is saved.

This first check does not prove the publishable key belongs to the same account, nor validate every Checkout permission. Those require actual sandbox Checkout testing. The account ID is an operator-provided trust anchor; API authentication alone cannot prove legal account ownership.

After account validation, Codex will request only the next necessary Dashboard action. Sandbox webhook signing secrets and a usable Customer Portal configuration/login link are also required. Existing runtime restricted-key permissions intentionally exclude Webhook Endpoint writes and Portal Configuration administration, so these may require the account operator in Stripe's browser UI. Codex supplies the exact staging endpoint, events and configuration details when needed; do not grant new administrative permissions preemptively.

Codex will then prepare the staging-only Cloudflare configuration, generate the cookie signing secret within automation, preserve the exact staging D1 binding, enforce test keys/test mode and optional methods off, and run tests before activating sandbox checkout on staging. The earlier deployment helper deliberately rejects Stripe secrets and locks old application source; it must receive a reviewed staging-only adjustment, rather than being blindly rerun. The public HTTP check must then expect an available test configuration, not the previous intentional 503. No real payment or production change follows automatically.

Sandbox acceptance covers one-time and monthly card success/decline/3DS, ownership and duplicate prevention, genuine webhook settlement/pending/failure, Portal management/cancellation, and EN/DE/NL. SEPA, wallets and optional methods require their separate compatibility/eligibility tests. A successful sandbox run is evidence for launch review, not permission to merge or use live keys. Production activation requires the user's explicit approval and a separate live configuration.
