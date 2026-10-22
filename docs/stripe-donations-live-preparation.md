# Live Stripe preparation — inactive, awaiting secure live connection

PR #26 stays draft on `codex/stripe-donations-integration`. Preparation is authorized; merging, production deployment, production binding/secret installation and real-payment activation are not. Test Clock permission changes are deferred at the owner's request. No live key, live webhook secret or live database ID is committed or installed.

The operator completed the live-account Dashboard review. That is an operator report, not automated API verification or approval to install production settings. The live connection has not been saved or verified by the prepared workflow. Bank transfers remain off; account-level PayPal availability does not enable the checkout flag or establish recurring PayPal acceptance.

**The one next operator action:** in the live association account's API keys page, create a **restricted key** named **iThemba donations - live**, using the ordinary account permissions below (no connected-account access). Keep the resulting key private and available for the following secure-storage step; do not paste it into chat. Creating a credential does not deploy or activate the website.

| Resource            | Permission                                                              |
| ------------------- | ----------------------------------------------------------------------- |
| Accounts            | Read                                                                    |
| Customers           | Write                                                                   |
| Checkout Sessions   | Write                                                                   |
| Payment Intents     | Read                                                                    |
| Subscriptions       | Read                                                                    |
| Invoices            | Read                                                                    |
| Customer Portal     | Write; Sessions only if the editor separates Sessions and Configuration |
| All other resources | None                                                                    |

No Test Clock, direct Subscription/Invoice Write, payout, refund or configuration Write is requested. If a suitable dedicated live restricted key already exists, reuse it only after checking these scopes; do not rotate another integration's key. This step does not ask for the publishable key, webhook secret or a new payment. The next separate browser step will save the live connection in encrypted GitHub storage, with no Worker installation.

## What is ready

The [inactive configuration template](../config/stripe-donations-live.example.json) contains the exact planned origin, binding names, API/webhook versions and event list. All secret values and the new database ID are null. It is **not a Wrangler config** and is never consumed by the website or a deployment helper. Its `live` mode is a review value, not an active Worker setting. Production `wrangler.jsonc` and the staging config remain unchanged.

Existing essential checks cover validation, EUR presentment, one-time/monthly creation, restricted-key mode/account checks, idempotency, ownership/origin/rate limits, genuine pending/failure/success/cancellation, signed webhook validation/retry/deduplication, renewal reconciliation, Portal access and tax-certificate wording. Existing real sandbox evidence covers card success/decline/3DS, recurring first payment, Portal updates/cancellation/email login and SEPA success/delayed failure with signed asynchronous events. See [the readiness evidence](stripe-donations-readiness.md).

Test Clock simulation is deferred, not passed. A separate monthly SEPA first-payment browser case and eligible-device wallets have not been verified. These limitations must remain visible in the eventual launch review; no method is silently removed or substituted to make a checklist pass. Production-only account/Portal/webhook/domain/email checks remain necessary before activation.

## Prepared runtime mapping — install only after approval

| Worker binding                                                                             | Source / intended value                                                                                                |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `STRIPE_SECRET_KEY`                                                                        | Appropriately scoped **live restricted** `rk_live_…` key from the approved association account                         |
| `STRIPE_PUBLISHABLE_KEY`                                                                   | Same live account's `pk_live_…`; prefix alone does not verify pairing                                                  |
| `STRIPE_ACCOUNT_ID`                                                                        | Explicitly confirmed live `acct_…`; never infer it from the sandbox ID                                                 |
| `STRIPE_WEBHOOK_SECRET`                                                                    | Distinct live destination `whsec_…`, never the sandbox secret                                                          |
| `DONATION_COOKIE_SECRET`                                                                   | New high-entropy value generated during the approved installation, separate from staging                               |
| `DONATION_SITE_ORIGIN`                                                                     | `https://ithembakuluntu.org`, the repository's canonical origin; verify redirects/domain ownership before installation |
| `STRIPE_PORTAL_CONFIGURATION_ID`                                                           | Live `bpc_…` with payment updates and period-end cancellation                                                          |
| `STRIPE_PORTAL_LOGIN_URL`                                                                  | Live `https://billing.stripe.com/p/login/…` with email login; never the sandbox `test_…` link                          |
| `DONATIONS_DB`                                                                             | New dedicated live D1 database; proposed name `ithemba-donations-live`, **ID not yet created/assigned**                |
| `STRIPE_DONATIONS_MODE`                                                                    | `live`, installed only in the later approved production change                                                         |
| `STRIPE_PAYPAL_ENABLED`, `STRIPE_PAYPAL_RECURRING_ENABLED`, `STRIPE_BANK_TRANSFER_ENABLED` | `false`; preserve existing eligibility/approval gates                                                                  |

Runtime resource scopes are unchanged: **Accounts Read, Customers Write, Checkout Sessions Write, Payment Intents Read, Subscriptions Read, Invoices Read, Customer Portal Sessions Write**. Checkout manages payment/subscription creation and the hosted Portal manages donor-authorized updates/cancellation. No Test Clock, direct Subscription/Invoice Write, refund, payout or configuration Write permission is added. See the [exact endpoint/expansion permissions](stripe-donations-setup.md#restricted-key-permissions-server-side). The separate preparation helper requires only **Account Read**; it cannot prove the key's write permissions without performing writes, which it refuses to do.

## Read-only live-account verification, ready for later use

`.github/workflows/stripe-live-preparation.yml` runs only on the donations branch and selected preparation paths. It tests its safeguards without credentials first. Its account step receives only `STRIPE_LIVE_CONNECTION`; it has no Cloudflare/deployment credentials. The script makes exactly **GET `https://api.stripe.com/v1/account`**, with API `2024-06-20`, redirects refused and a timeout. It creates no Customers, Checkout Sessions, payments, subscriptions, Portal sessions or Stripe configuration. No live endpoint is installed or enabled.

[The initial GitHub preparation run](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39761955158) passed all five safeguards and reported `live_connection_not_saved` / `readyForLaunch=false`; no live API request was made.

A missing secret reports `live_connection_not_saved`. The helper rejects sandbox/mixed/standard keys, unexpected JSON fields, the wrong expected account/country, untrusted branch/events and provider errors without logging key values or account records. It reports only account-readiness booleans. Even a ready account reports **`readyForLaunch=false`**: legal ownership, publishable-key pairing, runtime write scopes, live Portal/webhook/domain/email configuration and launch approval remain separate checks.

After the restricted live key is ready, Codex can guide the operator through the **following single browser action** to save the connection as an encrypted GitHub Actions repository secret, without installing it on a Worker. Its schema is:

```json
{
  "restrictedKey": "rk_live_REPLACE_WITH_COMPLETE_LIVE_KEY",
  "publishableKey": "pk_live_REPLACE_FROM_SAME_LIVE_ACCOUNT",
  "accountId": "acct_REPLACE_WITH_CONFIRMED_LIVE_ACCOUNT"
}
```

Secret name: **`STRIPE_LIVE_CONNECTION`**, stored only in GitHub's **Settings → Secrets and variables → Actions**, never an issue, comment, PR, repository file or chat. This is a later account step, **not the current requested action**. It does not replace `STRIPE_SANDBOX_CONNECTION`. Saving a secret does not trigger a workflow by itself; Codex can trigger a preparation-path review push afterward. Do not reuse or broaden the sandbox key or run the sandbox activation helper with live credentials.

## Live webhook, Portal and donor confirmations — later reviewed setup

- REST stays **`2024-06-20`**. The planned live webhook URL is **`https://ithembakuluntu.org/api/donations/webhook`**, **`2026-08-26.dahlia` Snapshot** delivery, using the **15 exact events** in the template. No Endive, preview or Thin events. Do not register/enable delivery to the currently unprepared live handler during this read-only phase. Create/configure the separate live destination and secret in the coordinated approved launch change; verify signature rejection and actual delivery afterward. A secret format check is not delivery proof.
- Live Portal: same approved cancellation policy, payment-method updates and email login, with the association's branding/support details. Reuse sandbox acceptance for behavior; verify the actual **live** configuration independently. Reading/discovering Portal configurations needs configuration Read if separately scoped, never configuration Write on the runtime key.
- HTTPS/domain: verify the canonical origin and register the relevant live payment-method domain for Embedded Checkout/wallets in the correct account/mode. Preserve the current site's CSP allowances and newsletter/contact integrations. Check eligible-device wallet appearance; `card` compatibility does not prove wallet availability.
- Confirm successful-payment receipts and recurring invoice/failed-payment/SCA emails in the live account. Review a receipt/Billing email preview or explicit sandbox test delivery; sandbox payments do not prove automatic live receipt delivery. The verified Portal login email is a separate function.
- German donation certificates remain staff-issued after eligibility and settled-payment/reversal reconciliation. Stripe receipts are **not official Zuwendungsbestätigungen**. Confirm the existing association's legal details, donor terms, privacy/retention and support contact. Do not publish donor-specific account/payment details in readiness reports.

## Cloudflare launch change — not executed or executable from this template

The current live Worker is **`tanstack-start-app`**. Before preparing any executable production deployment, inspect its current bindings/routes/settings and preserve all existing newsletter/contact integrations and unrelated settings. Do not overwrite it with the staging Wrangler file or assume the sparse repository config represents every production binding.

After explicit approval, create the **new dedicated live D1**, verify its actual ID/name, bind it as `DONATIONS_DB` and apply only `migrations/0001_donations.sql` to that new target. Do not use staging ID `990e1489-72e6-4a2b-b2f6-dbb4863e4971`, run migrations on unrelated databases, change DNS, or rotate existing non-donation secrets. Production creation, migration, secret installation, deployment and any controlled live donation need the owner's approval first. None is performed by the prepared workflow.

Prepare the final executable config, binding-preservation evidence, backups/rollback plan, webhook/Portal/domain/email verification and final diff for approval at that stage. The current plan intentionally has no invented live database ID, no live secrets, no production deployment command and no automatic fallback to production. Read-only readiness success must never be used as deployment authorization.
