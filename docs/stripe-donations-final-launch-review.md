# Final Stripe launch readiness — 23 October 2026

**Recommendation: GO for an owner-approved, controlled initial production launch of cards, eligible Apple Pay/Google Pay and SEPA, one-time/monthly EUR.** This is readiness for approval, not a claim that live payments or delivery have been tested. No approval has yet been granted for production deployment, webhook enablement, payment activation or merging.

## Essential preflight passed

[Final read-only preflight](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39969891026) passed **21 safeguards**, including four new signing-secret checks. The saved `STRIPE_LIVE_WEBHOOK_SECRET` exists, has valid format and is **different from the sandbox secret**. The comparison and reports disclose no secret values and install nothing on a Worker.

The restricted live key still authenticates to the expected German account; charges/payouts and submitted details remain confirmed. The live Portal still matches the approved login fingerprint and management policy. The owner previously confirmed clear account requirements, live domain registration and receipt/failed-payment/authentication emails. Missing API requirement fields remain unknown rather than overriding that Dashboard evidence.

Exact live database **`ithemba-donations-live`**, ID **`67acffe7-2412-44ce-817d-1d7f316d9392`**, is initialized with the expected migration record and **no pending migrations**. It remains unbound. Current production settings still match fingerprint **`e827b67d829a732907c83d400e950e0ef21eee699d86d37b1f24c44f3e3e682a`**; existing `ASSETS`, `BREVO_API_KEY` and `TURNSTILE_SECRET_KEY` bindings and canonical custom domain are unchanged. No donation binding or live Worker secret is installed.

[The last full regression/build run](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39964994738) passed **86 tests**, TypeScript and build. The subsequent changes add only the signing-secret checker/tests, read-only preflight wiring and readiness documentation; application runtime/build inputs are unchanged. The four new tests passed in the final preflight. Production-config local dry run and public-asset secret scan passed previously.

Actual sandbox acceptance covers one-time/monthly cards, decline/SCA, idempotency/ownership, Portal payment-method updates/email login/cancellation, one-time SEPA success/delayed failure and [monthly SEPA pending → succeeded with signed invoice and fixture cancellation](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39963114597). The existing donor's test subscription was not changed.

## Exact approval requested

Approval is requested for **this coordinated production change only**:

1. Use the reviewed donation branch application source, reference **`74b7a8eb8caf3fe5366d2b0cfbdc4764b4deae53`**, to build and deploy the donation integration to the existing **`tanstack-start-app`** Worker serving **`https://ithembakuluntu.org`**. Keep PR #26 **draft and unmerged**; do not write to `main`.
2. Bind only the existing initialized live database above as **`DONATIONS_DB`**. No new migration or database creation is needed. Install the saved live restricted key/publishable key/account ID, saved live signing secret, validated live Portal configuration/login URL, canonical origin and a **new random donation-cookie secret**. Preserve the existing Brevo/Turnstile secrets, asset configuration, compatibility settings, domains/routes and all unrelated settings. Stop on baseline drift; **no DNS changes**.
3. Set donation mode to **`live`** and activate **one-time and monthly EUR donations using cards, eligible Apple Pay/Google Pay and SEPA**. Keep PayPal, recurring PayPal and bank-transfer flags **false**; keep iDEAL/Wero and TWINT excluded. This initial scope is an explicit approval decision, not fulfillment/testing of PayPal.
4. Enable the already-prepared live **`2026-08-26.dahlia` Snapshot** destination for the existing exact 15 events at **`https://ithembakuluntu.org/api/donations/webhook`** in coordination with the deployed handler. **The owner must click Enable in Stripe at the instructed launch point**: the intentionally restricted runtime key has no webhook-administration permission. Do not broaden it or enable delivery early.
5. Verify public configuration/mode and actual live key/Embedded Checkout pairing using **unfunded sessions that are expired afterward**. Their genuine **`checkout.session.expired`** events provide a signed live-webhook/D1 reconciliation check without a charge or confirmed subscription. Also check request/ownership/signature defenses, Portal configuration availability and existing website integrations. Monitor errors and stop/roll back if the rollout fails. No funded test donation, payment details, new subscription confirmation or real charge will be submitted by Codex under this approval.

Enabling Checkout means the site can accept real donor payments; that is why payment activation is explicitly included. There is no separate funded-test authorization. Do not characterize unfunded Checkout creation or local signature tests as actual settlement/delivery proof.

## Rollout limits and stop conditions

A secret's format and difference from sandbox **do not prove its Stripe destination ownership, enabled events/API version, or actual signed delivery**. The owner reported the live destination prepared and disabled following the exact guide. Recheck those Dashboard settings at enablement and verify genuine delivery during the approved rollout; never substitute a locally manufactured signature for that evidence.

Live donor Portal email delivery, payment-method/device eligibility, actual live receipts and key pairing are verified in the approved live context as available. No new real customer/payment has been created to bypass the approval boundary. Eligible-device wallet appearance is not guaranteed from account/domain flags alone.

PayPal remains a separate untested/approval-gated release; bank transfers are unnecessary for this checkout. Real accelerated renewal remains deferred at the owner's request, with regression coverage retained and no Test Clock permission changes. REST stays **`2024-06-20`**, independently of Dahlia Snapshot delivery; upgrading the REST header alone is incompatible with fields used here.

Rollback target remains version **`61de2e47-2398-4c9a-9f87-1a691d2fb460`** at 100% traffic. Preserve the live ledger and reconcile any accepted payments/subscriptions/pending events; code rollback is not a refund. Restore the prior version and original integrations if deployment validation fails. Do not drop/reset the database, discard delayed events or disable reconciliation for accepted donations.

Stripe emails are payment confirmations, not official German donation certificates. The association retains responsibility for its existing legal/privacy/donor wording, staff-issued certificates and settled-payment/reversal reconciliation.

## Current state

**Awaiting explicit owner approval for the changes above.** No merge, production deployment, Worker secret/binding installation, webhook enablement, DNS change or real-payment activation has occurred. No further key, software installation, optional test or account setup is requested before that approval. The one Stripe Enable click is part of the coordinated approved launch, not a request to perform it now.
