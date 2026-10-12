# Stripe donations setup and launch review

This branch implements EUR donations payable directly to **iThemba Kuluntu e.V.** using Stripe Embedded Checkout inside the existing donation widget. Presets (€10/25/50/100/250), custom amounts, six causes, layout and EN/DE/NL remain. The widget is shared with project pages; those pages and contact/newsletter integrations are unchanged. No deployment, production settings changes or live transactions are part of this work.

## Architecture and safeguards

`src/server.ts` intercepts `/api/donations/*` before TanStack SSR and reads the request's Cloudflare bindings (including Nitro's `request.runtime.cloudflare.env`). All Stripe calls run server-side using the REST API pinned to **2024-06-20**, with a 15-second timeout. Stripe JS is loaded directly from `https://js.stripe.com/v3/`; Stripe owns all payment fields, mandates, wallet buttons, authentication and bank instructions. No payment credentials reach our server.

- `GET /api/donations/config`: public publishable key and portal login link; issues a signed, HttpOnly, SameSite=Lax donor cookie (Secure on HTTPS).
- `POST /api/donations/create`: strict input validation, amount in integer EUR cents (€1–€10,000), cause allowlist, name/email/country, receipt request. Verifies the configured Stripe account ID before creating a dedicated Customer and a one-hour payment/subscription Checkout Session. Same payload/request UUID reuses Stripe operations and checkout; changed payload or another browser cannot reuse that UUID. No Connect/platform fees or third-party destination.
- `GET /api/donations/status?id=<donation UUID>`: cookie ownership required, reads current Stripe state. A completed checkout with unpaid funds is **pending**, never success. For subscriptions, the latest invoice/payment and cancellation state determine status, rather than the original checkout payment. Polls for up to five minutes, then offers manual checks. Pending payments may take days.
- `POST /api/donations/cancel`: expires an open Checkout only. It does not reverse a submitted SEPA debit or transfer. Submitted donations require normal refund/support handling.
- `POST /api/donations/portal`: creates a short-lived Stripe Customer Portal session for the verified browser's recurring donation. Stripe handles cancellation and payment updates. The email-authenticated portal login link provides access on other devices or after the 30-day cookie expires.
- `POST /api/donations/webhook`: verifies the **raw body**, HMAC-SHA256, timestamp within 300 seconds and test/live mode. Re-reads current Stripe state, then commits status and unique event ID atomically to D1. Invalid signatures return 400; transient processing/storage failures return 5xx for Stripe retry. Early events arriving before session persistence also retry. Unrelated account events are ignored. Duplicate events are acknowledged without repeated work. This endpoint must be accessible to Stripe without browser login, cache or Turnstile.

The D1 ledger stores references, a keyed request fingerprint and keyed donor-cookie identity, not donor names/emails or raw webhook payloads. Customer, Checkout, PaymentIntent (one-time) and Subscription (monthly) contain purpose/reference/receipt metadata; donor email and address live on the Stripe Customer/Checkout. Restrict D1 access, back it up and agree retention. Signed-cookie secret rotation invalidates browser access; portal email login remains available. Stripe handles recurring billing and retry emails; this implementation does not send custom donor emails or official tax certificates.

Rate limits: 10 new checkouts/IP/hour, 30 creation attempts/browser/10 minutes, 60 status checks/browser/minute and 20 management requests/browser/hour. IPs are HMAC hashed, and expired rate buckets are removed. Request bodies are bounded. Configure Stripe Radar and Cloudflare donation-specific WAF/bot/rate rules before launch. Never cache these endpoints. Webhook logs deliberately omit payment payloads and donor details. Monitor webhook retries/failures and reconcile Stripe with D1 after outages; Stripe remains the financial system of record.

## Payment methods and decisions for review

| Method                 | One-time         | Monthly                        | Required setup / limitation                                                                                                                                                                                        |
| ---------------------- | ---------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cards                  | Yes              | Yes                            | Enabled on the association's Stripe account; Checkout handles SCA/3DS                                                                                                                                              |
| Apple Pay / Google Pay | Eligible devices | Eligible devices               | Included through `card`, not separate API payment-method types. HTTPS, registered domains, eligible browser/device/wallet; Stripe controls visibility                                                              |
| SEPA Direct Debit      | Yes              | Yes                            | Enable in Stripe; Stripe collects IBAN and mandates. Asynchronous confirmation; returns/disputes remain possible after initial success                                                                             |
| PayPal through Stripe  | Optional         | Optional with approval         | `STRIPE_PAYPAL_ENABLED=true`; monthly also requires `STRIPE_PAYPAL_RECURRING_ENABLED=true` after Stripe/PayPal approval and test verification                                                                      |
| EUR bank transfer      | Optional         | **No automatic monthly debit** | `STRIPE_BANK_TRANSFER_ENABLED=true`; Stripe `customer_balance`, EU bank transfer, German virtual-bank instructions. Enable/verify eligibility. Stripe reconciles transfers; no static association IBAN is invented |
| iDEAL/Wero / TWINT     | Disabled         | Disabled                       | Explicit allowlist excludes them regardless of Dashboard defaults                                                                                                                                                  |

Optional methods default off until the account operator verifies eligibility. Enabling an unavailable method must fail visibly, rather than silently substituting a method. Monthly bank transfer would require a separate `send_invoice` experience, not automatic recurring collection: approval and additional implementation would be needed. No such flow is enabled here. PayPal uses the German association's eligible Stripe account and requires activation; no external PayPal button/account is substituted.

**Decisions needing review:** approve Embedded Checkout replacing the simulated method tabs; confirm the €1–€10,000 custom amount range; authorize purpose restrictions (or describe causes as preferences in the donation terms); confirm PayPal activation/recurring approval and EU bank transfer availability; choose immediate versus end-of-period portal cancellation; approve the German receipt workflow and beneficiary/legal wording. The existing legal pages have not been edited; verify their accuracy before launch.

Official references: [Embedded Checkout](https://docs.stripe.com/checkout/embedded/quickstart), [Checkout Session creation](https://docs.stripe.com/api/checkout/sessions/create), [payment method compatibility](https://docs.stripe.com/payments/payment-methods/payment-method-support), [PayPal recurring approval](https://docs.stripe.com/payments/paypal), [webhook signatures](https://docs.stripe.com/webhooks/signature), [Customer Portal](https://docs.stripe.com/customer-management).

## Account, keys and configuration

Use only the verified **iThemba Kuluntu e.V.** Stripe account, with its German nonprofit details and payout bank account. Record its `acct_…` ID. Using another account's keys fails the account-ID check. Association staff must confirm the legal account ownership, nonprofit eligibility, payout settings and receipt issuer. This code cannot establish those facts.

Use separate test/staging and live Workers, D1 databases, Stripe keys, webhook secrets, cookie secrets and portal configurations. Do not use `VITE_*` variables for secret keys. The publishable key is delivered by the public configuration endpoint so keys never need to be committed or baked into the client bundle.

| Binding / variable                | Test                                         | Live, only after explicit launch approval                       |
| --------------------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| `DONATIONS_DB`                    | Dedicated local/staging D1 binding           | Dedicated live D1 binding                                       |
| `STRIPE_SECRET_KEY`               | `sk_test_…`                                  | `sk_live_…`                                                     |
| `STRIPE_PUBLISHABLE_KEY`          | Same-account `pk_test_…`                     | Same-account `pk_live_…`                                        |
| `STRIPE_WEBHOOK_SECRET`           | CLI `whsec_…` or test endpoint secret        | Live endpoint's distinct `whsec_…`                              |
| `STRIPE_ACCOUNT_ID`               | Verified association `acct_…`                | Same verified association ID                                    |
| `DONATION_COOKIE_SECRET`          | Random 32+ characters                        | Separate high-entropy secret, 32+ characters                    |
| `DONATION_SITE_ORIGIN`            | Exact staging HTTPS origin or localhost HTTP | Exact canonical HTTPS origin; no trailing slash/path            |
| `STRIPE_DONATIONS_MODE`           | `test` (default)                             | Must explicitly be `live`; otherwise live keys fail closed      |
| `STRIPE_PAYPAL_ENABLED`           | `false` until enabled and tested             | `true` only after activation                                    |
| `STRIPE_PAYPAL_RECURRING_ENABLED` | `false` until approved/tested                | `true` only after recurring approval                            |
| `STRIPE_BANK_TRANSFER_ENABLED`    | `false` until eligible/tested                | `true` only after approval/testing                              |
| `STRIPE_PORTAL_CONFIGURATION_ID`  | Test `bpc_…`                                 | Live configuration ID with cancellation/payment updates enabled |
| `STRIPE_PORTAL_LOGIN_URL`         | Test Stripe portal email login URL           | Live `https://billing.stripe.com/p/login/…` URL                 |

Monthly creation fails closed without a portal configuration and login URL. Configure the Portal's branding, verified association name/support details, allowed payment updates and subscription cancellation policy. Enable the portal email login link and test it for recurring donors. Each donation deliberately has its own Stripe Customer: repeated gifts from one email are not automatically merged into an account. Confirm the Portal's same-email behavior with repeat donors, and provide support for association-side reconciliation if Stripe selects one of multiple Customers. Never resolve a customer solely by an unauthenticated email submitted to our backend.

For a **reviewed staging configuration only**, add the D1 binding to the Worker build configuration before building (the generated `.output/server/wrangler.json` must contain it). Example binding snippet:

```json
"d1_databases": [{
  "binding": "DONATIONS_DB",
  "database_name": "ithemba-donations-staging",
  "database_id": "REPLACE_WITH_STAGING_D1_ID",
  "migrations_dir": "migrations"
}]
```

Run `wrangler d1 migrations apply <staging database> --remote --config <staging config>` only against the approved staging database. Configure secrets in that Worker through Cloudflare's dashboard or `wrangler secret put <NAME> --config <staging config>`. Set the remaining settings as Worker variables. Do not copy keys into a PR. No Cloudflare production configuration was changed in this branch; the production D1 binding/migration and secrets are future manual launch steps, requiring separate approval.

## Local testing without deployment

Node **24+** is required for the dependency-free TypeScript/SQLite regression tests. Existing dependencies suffice; no new package installation is required.

```sh
npm run typecheck
npm run test:donations
npm run build
cp .dev.vars.example .dev.vars
# Edit ignored .dev.vars with association TEST credentials, test Portal IDs,
# a random cookie secret and DONATION_SITE_ORIGIN=http://localhost:8787.
# Never commit .dev.vars.
npx wrangler d1 migrations apply ithemba-donations-local-test --local --config wrangler.donations-test.jsonc
npx wrangler dev --local --config wrangler.donations-test.jsonc --port 8787
```

`wrangler.donations-test.jsonc` is explicitly local-only, with a placeholder database ID. Never deploy it. The donation API needs real Worker D1 bindings: ordinary `vite dev` is useful for layout, but use the built local Worker for payment tests. Local test data and migrations do not touch Cloudflare production. If Wrangler reports a generated config redirect, verify the local test config and D1 binding actually appear in its output before proceeding.

In another terminal with the Stripe CLI authenticated to the association's **test** account:

```sh
stripe listen --forward-to http://localhost:8787/api/donations/webhook
```

Copy the CLI's signing secret to ignored `.dev.vars` and restart the local Worker. Use `http://localhost:8787/donate`; do not switch between localhost and 127.0.0.1 because origin and cookies must match. Stripe CLI triggers test fixtures, but complete actual test Checkouts to exercise matching donation references and customer IDs. Generic unrelated fixtures are intentionally ignored. Local CLI forwarding is distinct from the staged HTTPS webhook endpoint.

## Webhook registration

Register **`https://<canonical-staging-or-live-domain>/api/donations/webhook`**, with API version **2024-06-20** and the matching test/live mode. Select:

- `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`
- `payment_intent.processing`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
- `invoice.paid`, `invoice.payment_failed`, `invoice.payment_action_required`, `invoice.voided`
- `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

Watch delivery failures in Stripe, retry them after fixing configuration, and inspect the donation ledger without exposing donors' data. Refunds/disputes are handled by association staff in Stripe; this initial interface reports payment/renewal/cancellation status, not a full refund or dispute history. Official receipt issuance must reconcile settled payments, refunds and reversals in Stripe, not rely on a browser message or the cached D1 status.

## Domain, confirmation and German certificates

Use HTTPS on the canonical payment origin; register that exact domain plus staging domains in Stripe payment-method domains in the correct mode for Embedded Checkout/wallets. Avoid redirecting the webhook or blocking it with Cloudflare Access. Configure CSP to allow Stripe JS, frames and required API connections according to [Stripe security guidance](https://docs.stripe.com/security/guide); keep existing newsletter/contact CSP allowances. Test Safari/Apple Pay and Chrome/Google Pay on eligible devices with funded wallets. Enabling card payments does not guarantee either wallet button will appear.

Enable Stripe successful-payment receipts and Billing invoice/failed-payment/SCA emails in the account's settings, with verified sender/support/association branding. Test card and delayed-payment emails, recurring invoice receipts and cancellation messaging. They are **payment confirmations**, not German tax certificates. The website provides genuine Stripe status immediately when available and shows pending for SEPA/transfers until settlement.

Receipt-request metadata and Stripe's full billing address support a separate association-controlled issuance process. Authorized iThemba Kuluntu e.V. staff should reconcile settled gifts and reversals, verify full donor name/address, review eligibility and purpose restrictions, and issue official **Zuwendungsbestätigungen** using the association's approved template/process. Agree timing, annual aggregation, secure delivery and handling of refunds. The website does not auto-generate or promise that a Stripe receipt is a tax certificate. Have the association's tax adviser approve this process before launch. No donor email was sent by this implementation task.

## Pre-launch acceptance checklist

1. Confirm branch/PR review, beneficiary account, legal terms, privacy/retention, cause restrictions and certificate process.
2. Create staging D1, apply migration, set only test keys and required variables, configure Stripe test webhook/Portal/receipt emails. Verify `/config` succeeds and no secret is present in public assets or responses.
3. Exercise all three languages at mobile/desktop sizes; six causes; every preset and decimal custom amount; invalid/large amounts; donor email/country and receipt-address collection.
4. Complete test card success, decline and 3DS flows; cancel and reload an open checkout; double-click/retry with the same UUID; verify no duplicate Customer/Session/Subscription.
5. Test monthly first payment and renewal success, failure/SCA, pending SEPA, recovery, immediate/scheduled cancellation, Portal payment updates and email login on a different device.
6. Activate/test optional PayPal (one-time and approved recurring separately), wallet eligibility and one-time EU bank instructions/partial transfer/settlement. Confirm no iDEAL/Wero/TWINT appears.
7. Verify pending → paid and pending → failed, signed webhook retries/duplicates/out-of-order delivery, tampered signatures, mode mismatch, wrong owner/cross-origin rejection and D1/Stripe outages. Confirm unavailable status never becomes a thank-you message.
8. Get explicit launch approval before live secrets, live bindings/migrations, production settings, deployment or any live donation. These steps have not been performed.
