# Stripe donations readiness — staging review, 19 October 2026

PR #26 remains a draft on `codex/stripe-donations-integration`. The live website, production Worker `tanstack-start-app`, DNS and live Stripe configuration are unchanged. No merge or production deployment is authorized.

## Verified

- The isolated staging Worker serves test-mode donations using only D1 `ithemba-donations-staging`, ID `990e1489-72e6-4a2b-b2f6-dbb4863e4971`, binding `DONATIONS_DB`. [Approved activation passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39107055106).
- The saved restricted test key authenticated to the expected Stripe account. One-time and monthly Checkout creation, idempotent retry, status retrieval and expiration passed with actual Stripe-signed expiration events. [Uncharged smoke evidence](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39107343424).
- One-time and monthly €10 payments using Stripe's published test card reached genuine succeeded status, with registered Stripe-signed completion events in the isolated ledger. No real funds were used. [Payment evidence](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39108364887); that run's final failure was in the Portal browser harness.
- Portal configuration reads and short-lived session creation returned HTTP 200 with the restricted test key. The default test Portal enables payment-method updates, email login and cancellation at period end. The public login link matched the account under both REST and Dahlia versions.
- All **57 regression tests**, TypeScript checking, lint on the modified browser scripts and the application production build passed locally. No application runtime change or additional Worker deployment was needed for the Portal test fixes.

## Portal result

[The real Portal cancellation check passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39258500102). It validated the exact test fixture, opened Stripe's hosted Portal and scheduled its cancellation at period end. A subsequent authenticated Subscription read confirmed `cancel_at_period_end=true`; that fixture will not renew beyond its current period. No new payment or subscription was created by cleanup, and no live subscription or Portal setting was changed.

Two browser-harness assumptions were corrected: requiring the obsolete `/p/session/` path despite a valid Stripe origin, and clicking a background cancellation button while Stripe's reason dialog was open. The runtime already validates the exact `https://billing.stripe.com` origin and required no change. The updated test handles the reason dialog and confirmation action. [The fresh complete browser run passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39258899738): one-time and monthly test-card payments, actual signed completion events, cookie-owned website Portal-session creation, Stripe-hosted cancellation and the website status API reporting scheduled cancellation. Both monthly fixtures created by our browser checks are scheduled to stop at period end. No synthetic subscription from these successful payment checks is awaiting cancellation.

## Next operator action

Open the [sandbox Portal login link](https://billing.stripe.com/p/login/test_28EcN70MMeBD64G5MMfUQ00) using the email address from your own monthly test donation, and confirm that Stripe's email lets you sign in. This requires access to your inbox; automation used a synthetic example.org address and cannot verify your email delivery. No software or terminal command is needed.

## Still required before real donations

1. **Complete acceptance for the launch methods.** Card decline/3DS, renewal success/failure/SCA, delayed SEPA settlement/failure, Portal payment-method replacement, real email login/delivery (including repeat donors with the same email), and eligible-device Apple Pay/Google Pay checks remain separate from the successful card tests. Review pending/failure/retry behavior. Optional PayPal/recurring PayPal and bank transfers remain off until eligibility, approval and their own tests; iDEAL/Wero and TWINT remain disabled.
2. **Association decisions and account readiness.** Confirm the e.V.'s legal account ownership, live activation/payout details, legal/privacy/cause wording, cancellation policy, support contacts and retention. Enable/test payment and Billing emails. Approve the staff-controlled German donation-certificate process; Stripe receipts are payment confirmations, **not Zuwendungsbestätigungen**.
3. **Prepare a separate live configuration for approval.** Use appropriately scoped live keys and matching publishable key/account ID, a distinct live webhook destination/signing secret, live Portal configuration/login link, separate cookie secret, dedicated live D1 binding/migration and canonical HTTPS origin/domain registration. Review the production deployment target and donation-specific protection/monitoring. Do not replace the sandbox configuration or select the staging database for production.
4. **Explicit launch approval.** Obtain the owner's approval before merging PR #26, installing live configuration or deploying to the live website. Arrange a controlled live verification/reconciliation only after that approval; no live payment has been processed by this work.

The [setup guide](stripe-donations-setup.md) lists the exact resource permissions, endpoint events, supported API contract and Cloudflare bindings. REST remains pinned to `2024-06-20`; webhook delivery uses `2026-08-26.dahlia` Snapshot events. Do not merely upgrade the REST header: newer versions changed invoice-payment and subscription-period fields used here.
