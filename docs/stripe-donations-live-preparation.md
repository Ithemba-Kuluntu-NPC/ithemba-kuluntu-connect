# Live Stripe launch preparation — 23 October 2026

PR #26 remains **draft and unmerged**, exclusively on `codex/stripe-donations-integration`. The existing live website, Worker configuration, routes/DNS and live-payment activation have not changed. The owner approved **only the isolated live database migration** plus remaining preparation and verification.

## Finished

- The saved live restricted connection authenticates to the expected German association account; payments and payouts are enabled. Requirement fields remain unavailable in the pinned API response; the owner's previous live-Dashboard confirmation of no outstanding tasks remains the recorded evidence.
- The live Portal is active and matches the exact operator-approved login-link fingerprint. Payment-method updates, cancellation at period end and email login are enabled; plan changes are disabled. Configuration reads do not prove a live donor login or email delivery.
- The owner confirmed `ithembakuluntu.org` verified/enabled in live payment-method domains, and successful-payment, failed-payment and payment-confirmation emails enabled. The key's denied domain read was resolved through Dashboard confirmation; no additional scopes are requested.
- [The approved live D1 migration passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39961846469). Exact target: **`ithemba-donations-live`**, ID **`67acffe7-2412-44ce-817d-1d7f316d9392`**. The unchanged `migrations/0001_donations.sql` created `donations`, `donation_events`, `donation_rate_limits`, `donations_customer` and the standard `d1_migrations` record. Schema/history and empty ledger were verified. [Read-only follow-up](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39964086470) confirms the migration recorded and no pending migrations. The database remains **unbound**.
- [Monthly sandbox SEPA passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39963114597): **open → pending → succeeded**, with a genuine registered Stripe-signed `invoice.paid` event. Only the new cookie-owned test subscription was scheduled to cancel through the Portal; the existing association test subscription was untouched.
- All **86 local regression tests**, TypeScript checking, modified-helper lint/format checks, the application/staging build, compiled public-asset secret scan and a **production-configuration dry run** passed. Dry run uploaded nothing. [The latest GitHub regression/type-check/build run also passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39964086665): 78 tests in its full suite and 20 preparation safeguards, with no deployment. Earlier package-mirror HTTP 429 failures are resolved; no dependency changes were needed. Separate GitHub migration/production-review safeguards passed as well.

## Reviewed production target and rollback

[Read-only production review passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39963622156). Worker **`tanstack-start-app`** serves the existing canonical custom domain. Existing bindings are **`ASSETS`**, **`BREVO_API_KEY`** and **`TURNSTILE_SECRET_KEY`**. No donation bindings/secrets are installed. No secret values are read into reports.

Compatibility date stays **`2025-09-24`**, flags **`nodejs_compat`**. The recorded settings fingerprint is **`e827b67d829a732907c83d400e950e0ef21eee699d86d37b1f24c44f3e3e682a`**. Current rollback version **`61de2e47-2398-4c9a-9f87-1a691d2fb460`** serves 100% of traffic. A fresh read must match before an approved change; stop on drift.

The [inactive launch plan](../config/stripe-donations-launch-plan.json) contains the exact database, binding/secret sources, local Worker draft, preservation checks and rollout/rollback sequence. It is **not a Wrangler config or deployment input**, and no workflow consumes it to deploy. The draft passed local Wrangler `--dry-run` after rendering into a temporary file. It is not permission to install or activate anything.

During a later approved launch, preserve existing secret bindings, asset settings, compatibility settings and all unrelated settings; merge only donation bindings/variables. Preserve existing custom domains/routes and DNS. Do not deploy the staging config or replace production with its binding allowlist. Root `wrangler.jsonc`, the staging config, application runtime, newsletter/contact code and unrelated pages were not changed by this preparation.

Rollback must restore the recorded prior Worker version/traffic while retaining the live database and reconciling any accepted/pending payments and events. Code rollback does not reverse a payment. Never drop the ledger or discard pending SEPA events.

## Essential account step still needed: prepare the live webhook secret

[The final preparation check](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39963622156) reports **`live_webhook_secret_not_ready`**: `STRIPE_LIVE_WEBHOOK_SECRET` is not saved. The restricted runtime key intentionally has no webhook-administration permission. Do **not** broaden it, use the sandbox secret, invent a signing secret or paste one into chat.

This is the remaining account action requiring the owner:

1. In the association's **live** [Stripe Workbench → Webhooks](https://dashboard.stripe.com/workbench/webhooks), create an event destination for **your account**, using **Snapshot** events and API version **`2026-08-26.dahlia`**. Do not choose connected accounts, Thin, Endive or preview events, and do not change the account default/API version.
2. Use endpoint **`https://ithembakuluntu.org/api/donations/webhook`** and the **15 exact events below**. Keep delivery **disabled until the approved launch**. If creation defaults to enabled, disable the new destination immediately afterward; do not test delivery against the current unprepared live handler. Do not alter the sandbox destination.
3. Reveal that destination's signing secret and save it directly as **`STRIPE_LIVE_WEBHOOK_SECRET`** in [GitHub → repository Actions secrets](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/settings/secrets/actions). Use **New repository secret** (or update only this exact live secret if already present). Never replace `STRIPE_SANDBOX_WEBHOOK_SECRET` or `STRIPE_LIVE_CONNECTION`. No installation or commands are needed.
4. Reply **“Live webhook prepared and secret saved.”** Codex will verify saved-secret format and finish the release review without installing it on the Worker or making a real payment. A format check is not genuine delivery verification.

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

Stripe documentation: [event destinations](https://docs.stripe.com/event-destinations), [webhooks](https://docs.stripe.com/webhooks), [endpoint status controls](https://docs.stripe.com/api/webhook_endpoints/update). The disabled destination prepares event delivery; it does not activate donation Checkout.

## Final launch approval remains separate

We are **not yet ready to activate real donations**: the live webhook/signing-secret preparation above remains incomplete. After that account step, present the final source/configuration diff, fresh baseline/credential checks and launch-method scope for explicit approval. Do not merge, deploy, bind the live database, install live Worker secrets, enable delivery, activate real Checkout or process a controlled live donation without the relevant approval.

Planned initial methods are **cards, eligible Apple Pay/Google Pay and SEPA**, one-time and monthly EUR. Eligible-device wallet appearance and actual live key pairing/delivery require verification in the approved live context; they are not proved by prefix checks or a local dry run. **PayPal and recurring PayPal remain disabled pending separate approval/eligibility/testing** despite account-level activation. Bank transfers are off and unnecessary for this checkout; iDEAL/Wero and TWINT remain excluded. Disclose this scope at approval rather than silently changing the requested experience.

Test Clock permission changes remain deferred by the owner. Real accelerated renewal has not been claimed; existing regression coverage exercises renewal success, pending, failure/SCA and cancellation under the pinned REST contract. Actual monthly card and monthly SEPA first payments and Portal cancellation have passed.

REST remains **`2024-06-20`**, independently of Dahlia webhook delivery. Newer REST versions remove invoice-payment and subscription-period fields used by this implementation; changing the REST header alone is incompatible. Exact runtime scopes remain the original **4 Read / 3 Write** permissions in the [setup guide](stripe-donations-setup.md#restricted-key-permissions-server-side); Stripe labels the Portal permission **Customer Portal**.

Before approval, the association should review its existing legal/privacy/donor wording and staff-controlled German donation-certificate process. Enabled Stripe emails are payment confirmations, **not official Zuwendungsbestätigungen**. Actual live receipts, delayed payments and reversals must be reconciled in Stripe; this software does not issue official tax certificates.
