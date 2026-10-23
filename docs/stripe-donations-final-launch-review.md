# Stripe production launch review — 23 October 2026

**Production deployment and genuine live webhook reconciliation passed. Final browser acceptance remains incomplete: do not describe the launch as fully verified or request a funded donation yet.** The owner explicitly approved the controlled production launch and subsequently confirmed webhook enablement. PR #26 remains **draft and unmerged**, exclusively on `codex/stripe-donations-integration`; `main` is unchanged.

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

## Essential remaining browser check

**The verification workflow is red, not a passing end-to-end acceptance run.** It deliberately fails because neither frequency displayed a detectable secure card field within the automated browser's wait. Diagnostics recorded no page JavaScript errors, failed Stripe HTTP responses or visible website error alert, but did record aborted hCaptcha network requests while Stripe initialization remained incomplete. This is not conclusive proof of an application defect or of a particular anti-bot cause. CAPTCHA controls were not bypassed.

**Next owner action:** open https://ithembakuluntu.org/donate in a normal browser, start a custom **€1 one-time donation** using the existing association email, and **stop before entering card details or paying**. Confirm whether Stripe's secure card form appears, or report the displayed error/challenge. This is the essential human browser acceptance check; no installation, commands, new email or additional credentials are required.

Do not claim live publishable/restricted-key pairing is fully browser-verified from prefixes, session creation or signed expiration alone. Do not declare readiness for a real payment until the form-rendering result is resolved. Actual live receipt delivery and a paid live donor's Portal session also remain unverified until appropriate live use.

## Launch scope and retained limitations

Activated scope is one-time/monthly EUR **cards, eligible Apple Pay/Google Pay and SEPA**. **PayPal and recurring PayPal remain disabled pending separate approval/testing**; bank transfers are off and unnecessary, and iDEAL/Wero/TWINT remain excluded. Wallet display depends on the donor's eligible device/browser.

Sandbox acceptance already covered paid cards, decline/SCA, Portal login/payment-method updates/cancellation and delayed SEPA success/failure, including monthly SEPA. Existing evidence is retained in the [readiness report](stripe-donations-readiness.md). Test Clock permission changes and actual accelerated renewal remain deferred at the owner's request; regression tests cover renewal outcomes.

REST remains **`2024-06-20`**, independently of Dahlia Snapshot delivery. Upgrading only the REST header is incompatible with invoice-payment and subscription-period fields used here. Current-mode/account checks, input validation, idempotency, ownership and signature defenses remain enforced.

## Rollback and records

Pre-launch rollback target: **`61de2e47-2398-4c9a-9f87-1a691d2fb460`**, 100% traffic. The pre-launch settings fingerprint in the [launch record](../config/stripe-donations-launch-plan.json) is historical; approved live bindings intentionally changed it. Do not blindly rerun the initial deployment against the historical baseline.

Retain the live ledger and signed-event reconciliation for accepted payments/subscriptions and pending SEPA. A code rollback does not refund a payment. Never drop/reset the database or discard delayed events.

Stripe receipts are payment confirmations, **not official German Zuwendungsbestätigungen**. The association remains responsible for staff-issued certificates, legal/privacy wording and settlement/refund/reversal reconciliation.
