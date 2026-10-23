# Live Stripe connection and launch record — 23 October 2026

The owner-approved controlled production deployment is complete and the owner has enabled the live webhook. **The owner completed the €1 real one-time card donation and provided successful website status and delivered Stripe receipt evidence.** The owner has now authorized PR #26 to merge and waived the real monthly test. See the [closeout](stripe-donations-closeout.md) and PR record for final merge/verification status. No DNS change is part of closeout. The [final launch review](stripe-donations-final-launch-review.md) is the current source of status, evidence, next action and rollback.

## Finished

- Restricted live connection authenticates to the expected German association account with payments and payouts enabled. The owner confirmed no outstanding verification tasks. Unavailable API requirement fields were not interpreted as new tasks.
- The active live Portal matches the supplied login fingerprint: payment-method updates, period-end cancellation and email login enabled; plan changes disabled. Configuration reads do not prove a paid live donor's Portal login.
- The owner confirmed the live domain verified/enabled and successful-payment receipts, failed-payment and payment-confirmation emails enabled. Live receipt email delivery is now confirmed by the owner's first-payment screenshot; no claim is made for other email types.
- [Live migration](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39961846469) and [follow-up](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39964086470) verified unchanged `0001_donations.sql`, expected tables/index/history and no pending migrations. Exact **`ithemba-donations-live`**, ID **`67acffe7-2412-44ce-817d-1d7f316d9392`**, is now bound as **`DONATIONS_DB`**.
- [Approved deployment](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39973404974) passed **95 tests**, TypeScript and application/staging build. Worker **`tanstack-start-app`** version **`da9a5be3-ca7c-4379-9108-88db3ccf0e9e`** serves https://ithembakuluntu.org with distinct live donation secrets and a fresh cookie secret.
- Existing Brevo/Turnstile secrets, assets, compatibility/unrelated settings and domains/routes were preserved. Public pages/configuration and invalid-signature rejection passed.
- After owner enablement, [live unfunded checks](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39977640521) passed creation, idempotency, ownership, cancellation and genuine signed expiration reconciliation for **both frequencies**. Sessions were expired; no payment details, payment submission or confirmed subscription.

## Live webhook

Endpoint: **`https://ithembakuluntu.org/api/donations/webhook`**. Contract: **`2026-08-26.dahlia` Snapshot**, account events, exact 15 events in the [setup guide](stripe-donations-setup.md). The real signing secret is encrypted in GitHub **`STRIPE_LIVE_WEBHOOK_SECRET`** and installed on the approved Worker. Presence/format/difference-from-sandbox checks preceded genuine live delivery verification.

Do not recreate the destination, replace saved credentials, change the account API version or broaden permissions. The runtime key intentionally has no webhook administration.

## Final acceptance gate resolved

The owner confirmed the live **€1 one-time** amount, card fields, Apple Pay, Link and SEPA Direct Debit in a normal browser, without paying. The earlier automated browser run remains historically incomplete; hCaptcha request errors do not establish the cause. No CAPTCHA bypass, runtime change or additional deployment was needed.

[Final no-payment health check](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39980255268) passed current public pages, live mode/no-store, approved Portal fingerprint and invalid-signature rejection without credentials or creating payment objects.

**Live card acceptance completed:** the owner supplied screenshots of the successful website payment status and delivered Stripe receipt for the €1 one-time donation. This is owner-confirmed payment/receipt evidence; no independent API audit of this payment or its completion webhook is claimed. No repeat donation or account action is needed for this acceptance step. Paid live recurring Portal access, monthly live funding and other methods' live settlement remain unverified. No configuration change, deployment, merge or further payment was performed.

Live method scope remains cards, eligible Apple Pay/Google Pay and SEPA, one-time/monthly EUR. PayPal/recurring PayPal remain disabled pending separate approval/testing; bank transfers, iDEAL/Wero and TWINT remain off. Real accelerated renewal and Test Clock scope changes remain deferred. Existing sandbox card/Portal/SEPA acceptance is documented in the readiness report.

REST stays **`2024-06-20`**, independently of webhook delivery. Changing that header alone breaks fields used here. Runtime restricted scopes remain **4 Read / 3 Write**, including Stripe's **Customer Portal** permission, in the [permission table](stripe-donations-setup.md#restricted-key-permissions-server-side).

The [launch record](../config/stripe-donations-launch-plan.json) is documentation, not a deployable Wrangler configuration. Preserve the live database and reconciliation on rollback; code rollback does not refund payments. Stripe emails are **not official German donation certificates**; staff issue these separately after reconciliation.
