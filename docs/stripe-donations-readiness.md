# Stripe donations readiness — 23 October 2026

**Live one-time Card acceptance passed:** the owner completed the €1 real donation and supplied successful website status and delivered Stripe receipt screenshots. Production deployment, signed expiration delivery, card rendering and final health checks already passed. The owner approved the controlled launch and then confirmed webhook enablement. The owner has authorized PR #26 to merge and waived a real monthly test. See the [closeout](stripe-donations-closeout.md) and GitHub PR for final merge/verification status. No DNS change is included.

## Current production evidence

| Check | Result |
| --- | --- |
| Tests/build | [Deployment](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39973404974): **95 tests passed**, TypeScript and application/staging build passed before deployment credentials were used. |
| Active Worker | **`tanstack-start-app`**, **`da9a5be3-ca7c-4379-9108-88db3ccf0e9e`**, https://ithembakuluntu.org. Reviewed app source `74b7a8eb8caf3fe5366d2b0cfbdc4764b4deae53`. |
| Live database | Exact **`ithemba-donations-live` / `67acffe7-2412-44ce-817d-1d7f316d9392`**, migrated with no pending migrations and now bound as **`DONATIONS_DB`**. |
| Preservation | Existing **`ASSETS`**, **`BREVO_API_KEY`**, **`TURNSTILE_SECRET_KEY`**, compatibility/unrelated settings and domains/routes retained. Home/donation/contact healthy; no unrelated source edits. |
| Live credentials/Portal | Expected live account and approved Portal policy/fingerprint validated. Distinct live secrets and fresh cookie secret installed. Owner-confirmed domain/email settings. |
| Backend defenses | [Live unfunded check](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39977640521): actual form creation, retry idempotency, ownership denial, open status/no management, cancellation and genuine signed expiration recorded in live D1 for **one-time and monthly**. Invalid signature rejection also passed. |
| Secure card rendering | **Owner-confirmed** in a normal browser with screenshot: €1 one-time Checkout, secure card fields, Apple Pay, Link and SEPA. No payment submitted. Earlier automated workflow remains red; its precise failure cause is unconfirmed. Monthly live rendering is not separately owner-confirmed. |
| Final no-payment health | [Passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39980255268): current public pages, live/no-store config, approved Portal fingerprint and invalid-signature rejection; no credentials or payment objects created. |
| Funded live acceptance | **Owner-confirmed passed**: €1 one-time Card donation, website's Stripe-confirmed success and delivered Stripe receipt. Codex submitted no funded payment. No independent payment API/completion-event audit is claimed; live recurring Portal access remains unverified. |

## First live acceptance completed

The owner-provided screenshots confirm the €1 one-time card flow and actual Stripe receipt delivery. The receipt identifies iThemba Kuluntu e.V., EUR and the donation purpose. Private receipt/card/email details and screenshots are omitted from public repository records.

No further payment or account action is needed to confirm this flow. This evidence does not assert live monthly funding, a recurring donor's live Portal session, wallet/SEPA settlement or an independent audit of this payment's signed completion event. Previously verified signed expiration delivery for both frequencies remains distinct evidence. No additional deployment, configuration change, refund, subscription or merge occurred.

## Existing actual sandbox acceptance reused

- [Complete card/Portal run](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39258899738): one-time/monthly card payments, actual signed completion events, website cookie-owned Portal creation, hosted cancellation and scheduled-cancellation status.
- [Decline, 3DS/SCA, validation and ownership](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39738717361): real decline without success; required test authentication completed; unrelated browser denied status; invalid amounts rejected; unfinished checkout expired.
- [Portal payment-method update](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39738400629) changed the effective recurring default without changing the donation's items/schedule. Its subsequent email-selector timeout was resolved in the [login-only run](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39738958878); actual inbox delivery and owner-supplied Portal confirmation verified the expected sandbox customer using the existing association inbox. Donor-specific email, amount, card digits and dates are omitted.
- [One-time SEPA success](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39755408888) and [repeat success](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39757489987): pending before actual success and signed asynchronous event. A delayed-failure browser wait elapsed before the provider result; it was not a passing browser assertion. [Authenticated follow-up](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39759270511) verified the same fixture's Stripe failure, failed ledger and genuine async-failure event without another debit or synthetic replay.
- EUR presentment is explicit: Adaptive Pricing is disabled for both frequencies. [Actual pinned-API Checkout checks](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39745735130) verified both frequencies with EUR; no REST upgrade needed. [The approved staging-only update](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39746773054) deployed that fix. Subsequent preparation/browser helpers did not deploy again.

## Scope, compatibility and operational limits

Activated scope: one-time/monthly EUR cards, eligible Apple Pay/Google Pay and SEPA. PayPal/recurring PayPal remain disabled pending separate approval/testing; bank transfers are off and unnecessary, and iDEAL/Wero/TWINT remain excluded. Eligible-device wallet appearance is not guaranteed by account/domain settings alone.

Test Clock permission changes and real accelerated renewal remain deferred at the owner's request; regression tests cover renewal success, pending, failure/SCA and cancellation. REST remains **`2024-06-20`**; webhooks use **`2026-08-26.dahlia` Snapshot**. Upgrading the REST header alone is incompatible with fields used here.

See the [final launch review](stripe-donations-final-launch-review.md) and [launch record](../config/stripe-donations-launch-plan.json) for approval, source/version, verification limits and rollback. Retain the live ledger and signed-event reconciliation for accepted or pending payments; code rollback is not a refund.

Stripe receipts are **payment confirmations, not official German Zuwendungsbestätigungen**. Staff issue certificates separately after settlement/reversal reconciliation.
