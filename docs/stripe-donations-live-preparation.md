# Live Stripe preparation — inactive, live Portal and domain reviewed

PR #26 stays draft on `codex/stripe-donations-integration`. Preparation is authorized; merging, production deployment, production binding/secret installation and real-payment activation are not. Test Clock permission changes are deferred at the owner's request. No live key, live webhook secret or live database ID is committed or installed.

The encrypted live connection is now saved and the restricted key authenticates to the expected German beneficiary account under the pinned REST API. [Read-only verification passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39912044845): account details are submitted and payments/payouts are enabled. The requirements fields are **unavailable** in this response; that is not an assertion of outstanding tasks. The operator already confirmed in the live Dashboard that no verification tasks remain. This operator confirmation is recorded separately from API verification. No account ID, credentials, donor records or raw responses are published here.

**The one next operator action:** In the existing Cloudflare account, open **Storage & databases → D1 SQL Database → Create database**, create a new empty database named **`ithemba-donations-live`**, then share its **Database ID**. If that exact name already exists, share its ID without deleting, recreating or modifying it. Do not bind it to a Worker or run SQL yet. This is an isolated resource preparation step, not permission to migrate, deploy or activate payments.

[The latest read-only verification passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39915719509). The live Portal is active, matches the operator-approved login link, permits payment-method updates and cancellation at period end, enables email login, and disables plan changes. The exact link is compared using a SHA-256 fingerprint; no raw link, configuration ID or donor details are logged. Live donor login/email delivery is not claimed from a configuration read.

The public canonical origin returned HTTPS 200 without a redirect. Payment-method domain retrieval returned HTTP 403 with the intentionally limited restricted key. The operator subsequently confirmed in the **live Dashboard** that `ithembakuluntu.org` is **verified and enabled**. This completes the Dashboard fallback; it is operator evidence, not an API-read pass or an eligible-device wallet test. No broader key permission is needed. Bank transfers remain off and PayPal's account-level availability does not enable untested checkout flags.

The operator confirmed that **Successful payments** emails are enabled in the live account. This records the setting, not actual live delivery: no real payment was submitted. Stripe payment receipts remain separate from official German donation certificates. Recurring failure/authentication settings were subsequently operator-confirmed enabled below; no runtime key permissions were broadened.

The operator confirmed that live **failed-payment emails** and **payment-confirmation/authentication emails** are enabled. Together with successful-payment receipt emails, the requested email-setting checks are now recorded. These are Dashboard confirmations, not proof of live delivery. No live payment, retry-policy change or cancellation-policy change was performed by this work.

## What is ready

The [inactive configuration template](../config/stripe-donations-live.example.json) contains the exact planned origin, binding names, API/webhook versions and event list. All secret values and the new database ID are null. It is **not a Wrangler config** and is never consumed by the website or a deployment helper. Its `live` mode is a review value, not an active Worker setting. Production `wrangler.jsonc` and the staging config remain unchanged.

Existing essential checks cover validation, EUR presentment, one-time/monthly creation, restricted-key mode/account checks, idempotency, ownership/origin/rate limits, genuine pending/failure/success/cancellation, signed webhook validation/retry/deduplication, renewal reconciliation, Portal access and tax-certificate wording. Existing real sandbox evidence covers card success/decline/3DS, recurring first payment, Portal updates/cancellation/email login and SEPA success/delayed failure with signed asynchronous events. See [the readiness evidence](stripe-donations-readiness.md).

Test Clock simulation is deferred, not passed. A separate monthly SEPA first-payment browser case and eligible-device wallets have not been verified. These limitations must remain visible in the eventual launch review; no method is silently removed or substituted to make a checklist pass. The account and Portal configuration reads passed; webhook/email and remaining launch checks still require completion before activation.

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

Runtime resource scopes are unchanged: **Accounts Read, Customers Write, Checkout Sessions Write, Payment Intents Read, Subscriptions Read, Invoices Read, Customer Portal Sessions Write**. Checkout manages payment/subscription creation and the hosted Portal manages donor-authorized updates/cancellation. No Test Clock, direct Subscription/Invoice Write, refund, payout or configuration Write permission is added. See the [exact endpoint/expansion permissions](stripe-donations-setup.md#restricted-key-permissions-server-side). The separate preparation helpers use Account Read and existing Customer Portal configuration reads; a denied payment-method domain read falls back to Dashboard review without broader permissions. They cannot prove the key's write permissions without performing writes, which they refuse to do.

## Read-only live-account verification, ready for later use

`.github/workflows/stripe-live-preparation.yml` runs only on the donations branch and selected preparation paths. It runs the full regression suite, type-check, local staging build and helper safeguards without credentials first. Its account step receives only `STRIPE_LIVE_CONNECTION`; it has no Cloudflare/deployment credentials. The script makes exactly **GET `https://api.stripe.com/v1/account`**, with API `2024-06-20`, redirects refused and a timeout. It creates no Customers, Checkout Sessions, payments, subscriptions, Portal sessions or Stripe configuration. No live endpoint is installed or enabled.

[The initial GitHub preparation run](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39761955158) passed all five safeguards and reported `live_connection_not_saved` / `readyForLaunch=false`; no live API request was made.

A missing secret reports `live_connection_not_saved`. The helper rejects sandbox/mixed/standard keys, unexpected JSON fields, the wrong expected account/country, untrusted branch/events and provider errors without logging key values or account records. Missing requirement fields are classified as `unavailable` and require Dashboard confirmation; they are not misreported as actual outstanding Stripe tasks. Known due/disabled requirements still report action required, and all paths keep `readyForLaunch=false`. It reports only account-readiness booleans. Even a ready account reports **`readyForLaunch=false`**: legal ownership, publishable-key pairing, runtime write scopes, live Portal/webhook/domain/email configuration and launch approval remain separate checks.

The live connection has been saved as an encrypted GitHub Actions repository secret without installing it on a Worker. For reference, its schema is:

```json
{
  "restrictedKey": "rk_live_REPLACE_WITH_COMPLETE_LIVE_KEY",
  "publishableKey": "pk_live_REPLACE_FROM_SAME_LIVE_ACCOUNT",
  "accountId": "acct_REPLACE_WITH_CONFIRMED_LIVE_ACCOUNT"
}
```

Secret name: **`STRIPE_LIVE_CONNECTION`**, stored only in GitHub's **Settings → Secrets and variables → Actions**, never an issue, comment, PR, repository file or chat. This storage step is complete; do not re-enter or rotate the key for database preparation. It does not replace `STRIPE_SANDBOX_CONNECTION`. Saving a secret does not trigger a workflow by itself; Codex can trigger a preparation-path review push afterward. Do not reuse or broaden the sandbox key or run the sandbox activation helper with live credentials.

## Read-only Portal discovery

After account validation succeeds, the workflow also runs `check-stripe-live-portal.mjs`. It verifies the expected beneficiary through Account GET, then performs **GET `/v1/billing_portal/configurations?active=true&limit=100`** under the pinned API. It never creates a Portal session or changes configuration. It requires an active live configuration with payment updates, the current period-end cancellation policy and a live email-login link matching the operator-approved SHA-256 fingerprint, with plan changes disabled; sandbox URLs, wrong origins and ambiguous/paginated selection cannot pass. Only compatibility flags are logged, never configuration IDs, URLs, donor records or credentials. Configuration compatibility is not proof of email delivery or a live donor login. If the current Customer Portal permission cannot read configurations, the helper reports Dashboard review required without requesting broader key permissions.

## Read-only domain verification

After beneficiary validation, `check-stripe-live-domain.mjs` requests **GET `/v1/payment_method_domains?domain_name=ithembakuluntu.org&limit=100`**. It also makes a public HTTPS GET to the canonical origin without Stripe credentials or cookies, refusing redirects. It never registers, enables or validates a domain and never changes DNS. A complete unique live domain must be enabled with active Apple Pay and Google Pay statuses to pass the API check. HTTP 403 requires Dashboard review, not broader key permissions; even a compatible result keeps `readyForLaunch=false` and does not prove eligible-device wallet acceptance.

The latest GitHub run passed **72 regression tests**, including **14 preparation-helper safeguards**, TypeScript checking and `build:donations-staging`. The build is local to the runner and performs no Worker deployment or remote migration.

## Live webhook, Portal and donor confirmations — later reviewed setup

- REST stays **`2024-06-20`**. The planned live webhook URL is **`https://ithembakuluntu.org/api/donations/webhook`**, **`2026-08-26.dahlia` Snapshot** delivery, using the **15 exact events** in the template. No Endive, preview or Thin events. Do not register/enable delivery to the currently unprepared live handler during this read-only phase. Create/configure the separate live destination and secret in the coordinated approved launch change; verify signature rejection and actual delivery afterward. A secret format check is not delivery proof.
- Live Portal: same approved cancellation policy, payment-method updates and email login, with the association's branding/support details. Reuse sandbox acceptance for behavior; verify the actual **live** configuration independently. Reading/discovering Portal configurations needs configuration Read if separately scoped, never configuration Write on the runtime key.
- HTTPS/domain: verify the canonical origin and register the relevant live payment-method domain for Embedded Checkout/wallets in the correct account/mode. Preserve the current site's CSP allowances and newsletter/contact integrations. Check eligible-device wallet appearance; `card` compatibility does not prove wallet availability.
- Successful-payment email enablement is operator-confirmed. Failed-payment and payment-confirmation emails are also operator-confirmed enabled; automatic subscription billing remains unchanged. Review a receipt/Billing email preview or explicit sandbox test delivery; sandbox payments do not prove automatic live receipt delivery. The verified Portal login email is a separate function.
- German donation certificates remain staff-issued after eligibility and settled-payment/reversal reconciliation. Stripe receipts are **not official Zuwendungsbestätigungen**. Confirm the existing association's legal details, donor terms, privacy/retention and support contact. Do not publish donor-specific account/payment details in readiness reports.

## Browser-only live database preparation — awaiting owner action

No direct Cloudflare management tool is available in this session; the existing GitHub preparation workflow has no Cloudflare credentials. Do not extend the staging deployment token or use a staging activation workflow to create production resources.

The next owner action above creates only an **empty, unbound** dedicated D1 database. Record and verify the returned name/ID before preparing any migration. The ID is an identifier, not a secret. If the name already exists, inspect its ownership and existing tables before proposing changes. Leave the staging database untouched.

The reviewed migration remains **`migrations/0001_donations.sql`**, with tables **`donations`**, **`donation_events`** and **`donation_rate_limits`**, plus index **`donations_customer`**. Preserve the exact file rather than copying schema from another environment. A later approved initializer must validate the actual live database name/ID, target it explicitly, list pending migrations, apply only `0001_donations.sql`, and verify these tables/index. Creation is not migration or binding approval. Do not install `DONATIONS_DB` on `tanstack-start-app` yet.

## Cloudflare launch change — not executed or executable from this template

The current live Worker is **`tanstack-start-app`**. Before preparing any executable production deployment, inspect its current bindings/routes/settings and preserve all existing newsletter/contact integrations and unrelated settings. Do not overwrite it with the staging Wrangler file or assume the sparse repository config represents every production binding.

After explicit approval, create the **new dedicated live D1**, verify its actual ID/name, bind it as `DONATIONS_DB` and apply only `migrations/0001_donations.sql` to that new target. Do not use staging ID `990e1489-72e6-4a2b-b2f6-dbb4863e4971`, run migrations on unrelated databases, change DNS, or rotate existing non-donation secrets. Production creation, migration, secret installation, deployment and any controlled live donation need the owner's approval first. None is performed by the prepared workflow.

Prepare the final executable config, binding-preservation evidence, backups/rollback plan, webhook/Portal/domain/email verification and final diff for approval at that stage. The current plan intentionally has no invented live database ID, no live secrets, no production deployment command and no automatic fallback to production. Read-only readiness success must never be used as deployment authorization.
