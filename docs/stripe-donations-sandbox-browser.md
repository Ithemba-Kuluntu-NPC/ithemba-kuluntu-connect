# Browser-only Stripe sandbox setup — connected

The existing PR #26 branch is connected to the isolated **ithemba-donations-staging** Worker at <https://ithemba-donations-staging.super-tooth-55f1.workers.dev/donate>. No installation or terminal commands are required from the operator. The [readiness report](stripe-donations-readiness.md) records completed checks and the remaining launch gates. Production, live keys, DNS and merging require separate approval.

## Saved configuration

The operator saved these encrypted GitHub repository secrets. Never paste their values in chat, a PR or a repository file.

- `STRIPE_SANDBOX_CONNECTION`: JSON containing `restrictedKey` (`rk_test_…`), `publishableKey` (`pk_test_…`) and the expected `accountId` (`acct_…`), all from the same existing association sandbox. See the [runtime permission table](stripe-donations-setup.md#restricted-key-permissions-server-side). Setup discovery additionally reads Portal configurations; no configuration Write is needed.
- `STRIPE_SANDBOX_WEBHOOK_SECRET`: the matching destination's raw `whsec_…` signing secret.
- `CLOUDFLARE_D1_STAGING` and `CLOUDFLARE_WORKER_STAGING_TOKEN`: existing isolated staging access. Leave them unchanged.

After explicit approval, the [activation workflow](stripe-donations-sandbox-activation.md) installed the encrypted Worker bindings, generated the cookie secret and verified the exact staging D1 target. Ordinary documentation/test changes do not deploy. Do not blindly rerun the source-pinned activation helper after later branch changes.

## Sandbox webhook

The registered endpoint is **https://ithemba-donations-staging.super-tooth-55f1.workers.dev/api/donations/webhook**, for the sandbox's own account, using **2026-08-26.dahlia Snapshot events**. Do not select Endive, preview or Thin events. Server REST requests independently remain pinned to **2024-06-20**.

Required events:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
checkout.session.expired
payment_intent.processing
payment_intent.succeeded
payment_intent.payment_failed
payment_intent.canceled
invoice.paid
invoice.payment_failed
invoice.payment_action_required
invoice.voided
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
```

The destination must remain reachable without login, redirect, caching or Turnstile. Inspect delivery failures in Stripe and retry after correcting their cause; do not disclose payloads or signing secrets.

## Sandbox SEPA and EUR presentment

SEPA is enabled in the existing sandbox. Checkout explicitly disables Adaptive Pricing so international donors also see EUR; automatic USD presentment had hidden EUR-only SEPA on the US browser runner. Both frequencies were accepted under the pinned REST API, and the reviewed fix was deployed only to the isolated staging Worker on 22 October. [A real one-time SEPA payment check](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39755408888) observed pending before success and verified the registered signed asynchronous completion event. A delayed-failure test also stayed pending without premature success, then [read-only Stripe/ledger reconciliation](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39759270511) confirmed failed with its genuine signed asynchronous failure event and no success event. That follow-up completed after the original six-minute browser window, whose failed timing assertion is disclosed in the readiness report. Only Stripe's published test IBANs and the existing association inbox were used. Staging is still test-only.

The SEPA browser workflow submits payments only for the exact push message `Verify approved isolated sandbox SEPA success and delayed failure` on the guarded donations branch, under sandbox-testing authorization. Routine helper/documentation changes do not submit debits. It runs separate success and delayed-failure scenarios using fixed [published Stripe test IBANs](https://docs.stripe.com/testing#sepa-direct-debit-payments). It never accepts arbitrary bank credentials, creates monthly subscriptions or reverses a submitted debit. Every terminal result must match the scenario and its genuine signed asynchronous webhook. The browser waits up to ten minutes (the job allows twenty including setup); Stripe's delayed result is not guaranteed at exactly three minutes. The initial six-minute failure window elapsed before the provider outcome, so a separate authenticated read-only reconciliation was used rather than another debit. A successful pending-only check explicitly reports that settlement is unverified; it cannot establish full payment acceptance.

## Sandbox Customer Portal

The supplied public [sandbox email-login link](https://billing.stripe.com/p/login/test_28EcN70MMeBD64G5MMfUQ00) matched the authenticated default sandbox configuration under both REST and Dahlia. Email login, payment-method updates and cancellation at the end of the billing period are enabled. The login page, restricted-key session creation and actual period-end cancellation passed real checks, including the [complete website browser flow](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39258899738). The operator does not need to recreate the configuration.

Owned monthly donors use the website's management action to get a short-lived Portal session. Its bearer URL must never be logged or shared. Stripe may change its path; validate the exact HTTPS origin `https://billing.stripe.com`, rather than requiring `/p/session/`. Cross-device access uses the public email-login link. Each donation creates a separate Customer; email delivery to `info@ithembakuluntu.org` has now passed, and the operator signed in through that email and confirmed the correct active €100 Animal Welfare donation and default test card 4444. Earlier automated fixtures used example.org; subsequent acceptance tests use the existing association inbox. See the current readiness report for verified card replacement and SCA/decline evidence.

### Why this webhook version is compatible

The handler verifies the raw-body signature, timestamp and test/live mode before using the snapshot event ID/type and `data.object.customer` (a Customer ID or expanded Customer). It uses only those stable routing fields and optional metadata to locate the dedicated donation. It then retrieves the current Checkout Session with `Stripe-Version: 2024-06-20`, including the existing payment/subscription/invoice expansions. Dahlia's changed invoice-payment and subscription-period fields are never used to decide payment status from the event itself. A snapshot saying `paid` cannot make a pending fetched payment succeed.

The implementation was checked against Stripe's [Dahlia GA changelog](https://docs.stripe.com/changelog/dahlia) and official [`stripe-node` v22.6.0 API version](https://github.com/stripe/stripe-node/blob/v22.6.0/src/apiVersion.ts), [Events](https://github.com/stripe/stripe-node/blob/v22.6.0/src/resources/Events.ts), [Invoices](https://github.com/stripe/stripe-node/blob/v22.6.0/src/resources/Invoices.ts), [Checkout Sessions](https://github.com/stripe/stripe-node/blob/v22.6.0/src/resources/Checkout/Sessions.ts), [PaymentIntents](https://github.com/stripe/stripe-node/blob/v22.6.0/src/resources/PaymentIntents.ts) and [Subscriptions](https://github.com/stripe/stripe-node/blob/v22.6.0/src/resources/Subscriptions.ts). Stripe documents the distinction between [snapshot delivery versions and API request versions](https://docs.stripe.com/webhooks#api-versioning). No SDK dependency was added.

Signed synthetic Dahlia fixtures test all 15 events, string/expanded Customer references, duplicate suppression, monthly success/pending/failure/cancellation, malformed/Thin/live-event rejection and retry on failed reconciliation. These are contract regression tests, not real Dashboard deliveries. Actual Stripe-signed expiration and payment-completion deliveries have now passed on the approved staging deployment. No Stripe account default or production configuration was changed.
