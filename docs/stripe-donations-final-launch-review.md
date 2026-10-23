# Stripe production launch review — 23 October 2026

**Live one-time card acceptance passed.** After the approved launch and final checks, the owner completed the €1 real one-time card donation and supplied screenshots of the website's Stripe-confirmed successful status and the delivered Stripe receipt. The owner explicitly approved the controlled production launch and subsequently confirmed webhook enablement. PR #26 remains **draft and unmerged**, exclusively on `codex/stripe-donations-integration`; `main` is unchanged.

## Completed production change

[The production launch](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39973404974) passed **95 tests**, TypeScript checking and the application/staging build before credentials entered the deployment step. Application source matches reviewed reference **`74b7a8eb8caf3fe5366d2b0cfbdc4764b4deae53`**; operations commit **`69d0eac91d01db26d2e0a20386fdc96a524ae62e`** installed and activated Worker version **`da9a5be3-ca7c-4379-9108-88db3ccf0e9e`** on **`tanstack-start-app`**, serving **https://ithembakuluntu.org**.

Only the initialized live database **`ithemba-donations-live`**, ID **`67acffe7-2412-44ce-817d-1d7f316d9392`**, was bound as **`DONATIONS_DB`**. Distinct live credentials, saved signing secret, canonical origin, validated Portal settings and a fresh random donation-cookie secret were installed privately. No secret values are in reports or source.

The inactive version was validated before traffic changed. Existing **`ASSETS`**, **`BREVO_API_KEY`**, **`TURNSTILE_SECRET_KEY`**, compatibility settings, unrelated settings and domains/routes were preserved. No DNS changes, staging deployment, newsletter/contact source changes or unrelated page edits occurred. Home, donation and contact pages returned HTTP 200. Public config confirmed live mode/no-store and the approved Portal fingerprint; invalid webhook signatures returned HTTP 400.

## Genuine live backend verification passed

After owner enablement, [unfunded browser verification](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39977640521), source **`ff1052f1125b9cceeb9b752263feb206ca100262`**, verified **both one-time and monthly**:

- The actual website form created live Checkout sessions; identical retries returned the same session/client secret.
- Cookie-owned status remained open, with no subscription management access. Unrelated browser contexts were denied status.
- Every unfunded session was explicitly expired and its status became cancelled.
- Genuine provider **`checkout.session.expired`** events with Stripe `evt_` IDs were recorded against each corresponding donation in the exact live D1 database. No synthetic signatures were used.

No payment fields were filled, mandates accepted, payments submitted or subscriptions confirmed. Earlier diagnostic attempts also expired their unfunded sessions. The runtime restricted key was not broadened.

The owner prepared **`2026-08-26.dahlia` Snapshot** account-event delivery for the exact 15 events in the setup guide and confirmed enablement. Genuine expiration delivery proves that signed delivery/reconciliation path; it does not claim real settlement or delivery of every event type.

## Browser acceptance resolved by owner evidence

The owner confirmed in a normal browser, with a screenshot, that the **€1 one-time live Checkout** displays the correct amount, secure card fields, Apple Pay, Link and SEPA Direct Debit. No payment was submitted. This resolves the specific card-rendering gate for the controlled one-time card test and provides actual live key-pairing evidence. Do not publish the screenshot's donor email in repository records. Monthly live rendering was not separately owner-confirmed; its live backend and earlier sandbox acceptance remain the recorded evidence.

The earlier automated end-to-end workflow remains historically **red**: it did not detect card fields and observed aborted hCaptcha requests. No JavaScript error, failed Stripe HTTP response or visible website alert was captured. The precise automation failure cause remains unconfirmed; it is not relabeled as a passing browser run or a repaired application defect. CAPTCHA controls were not bypassed. No runtime change or redeployment was needed to resolve the owner's browser check.

[Final no-payment health check](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39980255268) passed after the owner's confirmation: current home/donation/contact HTTP 200, live public configuration/no-store, exact approved Portal fingerprint and invalid-signature HTTP 400. It uses no account credentials and creates no Checkout, customer, payment or subscription.

## First real payment and receipt confirmed

The owner supplied screenshots showing the website's **“Stripe has confirmed your payment”** state and a delivered Stripe receipt from iThemba Kuluntu e.V. for the **€1 one-time donation**. This is owner-provided evidence of live card payment success and receipt email delivery, not an independent Stripe API or payment-event audit. The receipt identifies the expected association, EUR amount and donation purpose. No donor email, receipt identifier, card digits or screenshot is published in repository records.

The funded donation was submitted by the owner, not Codex. No further donation, refund, recurring subscription, configuration change, deployment or merge was performed during this confirmation. No repeat test payment is required to confirm this one-time card flow.

The earlier genuine signed-expiration delivery checks still cover both frequencies. Actual signed completion of this particular funded donation was not independently inspected; do not relabel expiration evidence as a paid-completion event audit. A paid live recurring donor's Portal session, monthly live funding and wallet/SEPA live settlement remain outside this one-time card evidence; the existing sandbox coverage and configuration checks remain unchanged.

## Launch scope and retained limitations

Activated scope is one-time/monthly EUR **cards, eligible Apple Pay/Google Pay and SEPA**. **PayPal and recurring PayPal remain disabled pending separate approval/testing**; bank transfers are off and unnecessary, and iDEAL/Wero/TWINT remain excluded. Wallet display depends on the donor's eligible device/browser.

Sandbox acceptance already covered paid cards, decline/SCA, Portal login/payment-method updates/cancellation and delayed SEPA success/failure, including monthly SEPA. Existing evidence is retained in the [readiness report](stripe-donations-readiness.md). Test Clock permission changes and actual accelerated renewal remain deferred at the owner's request; regression tests cover renewal outcomes.

REST remains **`2024-06-20`**, independently of Dahlia Snapshot delivery. Upgrading only the REST header is incompatible with invoice-payment and subscription-period fields used here. Current-mode/account checks, input validation, idempotency, ownership and signature defenses remain enforced.

## Rollback and records

Pre-launch rollback target: **`61de2e47-2398-4c9a-9f87-1a691d2fb460`**, 100% traffic. The pre-launch settings fingerprint in the [launch record](../config/stripe-donations-launch-plan.json) is historical; approved live bindings intentionally changed it. Do not blindly rerun the initial deployment against the historical baseline.

Retain the live ledger and signed-event reconciliation for accepted payments/subscriptions and pending SEPA. A code rollback does not refund a payment. Never drop/reset the database or discard delayed events.

Stripe receipts are payment confirmations, **not official German Zuwendungsbestätigungen**. The association remains responsible for staff-issued certificates, legal/privacy wording and settlement/refund/reversal reconciliation.
