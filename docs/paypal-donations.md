# Direct live PayPal donations

The owner authorized a **live-first launch on 27 October 2026**, using the established German iThemba Kuluntu e.V. PayPal Business account and one small real donation after deployment. PayPal Sandbox setup/testing is **not a prerequisite**. Earlier sandbox-only launch instructions are superseded by this authorization.

## Implementation

Use the association's own hosted Donate button with the [official Donate SDK](https://developer.paypal.com/sdk/donate/). No PayPal money passes through Stripe. Stripe's server module, Checkout component, cards/wallets/SEPA, credentials and disabled Stripe PayPal flags remain unchanged.

The EN/DE/NL widget retains its design and controls. The PayPal option appears only when configured; the official SDK loads only after the donor chooses it. Native one-time/monthly choices are provided by the live hosted button. Monthly availability must be enabled in that button/account; the website does not create subscription products or plans.

**Hosted flow limitation:** the website's amount and frequency are not automatically applied. Donors are explicitly told to reconfirm them in PayPal. Fixed-amount parameters are omitted to preserve PayPal's native monthly option. Purpose is passed as `item_name`/`item_number`; a random attempt reference is passed as `custom`. PayPal controls its hosted translations and final donor choices. The first real donation will verify the account-specific parameter handoff; no successful project transfer or recurring settlement is claimed in advance.

Name, email and country remain in the shared form, but PayPal collects its payment identity/address separately. No donor name/email/address is stored in the new ledger. The certificate-request flag is saved; PayPal donors are instructed to contact the association with their transaction ID and full postal address. Provider receipts are not German donation certificates. Existing Stripe certificate handling is unchanged.

## Essential PayPal account step

1. Sign into the **live iThemba Kuluntu e.V. German Business account** and open [Donate buttons](https://www.paypal.com/donate/buttons). Reuse an existing suitable button or create one.
2. Use **EUR**, allow donors to choose the amount, and enable **monthly recurring donations** where offered. Suggested amounts can match €10/€25/€50/€100/€250. Do not set a single fixed amount.
3. Provide the generated embed code or **hosted_button_id**, plus **PayPal Merchant ID** from **Settings → Business information**. Confirm the recipient name is iThemba Kuluntu e.V. and whether the monthly option is available. These are public identifiers; no password or API secret is required.
4. The integration passes `https://ithembakuluntu.org/api/paypal/ipn` as its notification URL. If the button/account requires notification configuration, use **Account Settings → Notifications → Instant payment notifications → Update / Choose IPN Settings**. First inspect the current setting: **do not overwrite an existing handler for other PayPal integrations**. Report an existing URL so notifications can be preserved. Configure this donation button's notification URL where supported; enable account-wide delivery only if needed and there is no conflicting consumer.

A hosted button ID must come from the association's account; it cannot be derived from an email address or guessed. The merchant ID independently restricts which verified notifications the website accepts.

## Confirmation security

[PayPal IPN](https://developer.paypal.com/api/nvp-soap/ipn/IPNIntro) is verified server-to-server against the fixed live verification endpoint. Browser callbacks, query parameters and closing the popup never mark a donation paid.

- Same-origin creation, a random HttpOnly/SameSite cookie, strict form validation, bounded requests and rate limits protect donation attempts.
- Notifications must be verified by PayPal and match the configured receiving merchant, live environment and EUR currency. Duplicate fields are refused. No raw provider payloads or secrets are logged.
- A separate additive D1 ledger stores references, requested selections, certificate flag, verified amount/status and subscription reference. Actual PayPal amounts, not browser amounts, determine the receipt confirmation.
- Transaction IDs deduplicate; delayed Pending cannot overwrite Completed. Refunds/reversals require manual reconciliation. Renewals may correlate through a previously verified subscription ID; refunds through the parent transaction.
- Signup/cancellation alone never proves payment. The interface confirms receipt of funds, not guaranteed current mandate status. Donors manage/cancel monthly giving inside PayPal.
- Provider/database outages leave the website pending and return retryable IPN errors. If PayPal received money but correlation is unavailable, the website must remain pending; check PayPal Activity/IPN history and repair/resend delivery rather than asking the donor to pay twice.

This allows the requested small live verification without treating it as a prevalidated settlement flow. Account-specific metadata, renewal notifications and mobile popup behavior remain unproven until exercised. Reconcile the association's PayPal Activity/reports before issuing certificates. A refund conservatively keeps the entire recurring attempt in review, including subsequent renewals.

## Live configuration and deployment

Use the existing GitHub/Cloudflare setup and live Worker `tanstack-start-app`, domain `https://ithembakuluntu.org`, and existing live database `67acffe7-2412-44ce-817d-1d7f316d9392` (`ithemba-donations-live`). Keep Stripe untouched.

| Binding                    | Live value                                                |
| -------------------------- | --------------------------------------------------------- |
| `DONATIONS_DB`             | Existing live database above                              |
| `DONATION_SITE_ORIGIN`     | Existing `https://ithembakuluntu.org` binding             |
| `PAYPAL_DONATIONS_ENABLED` | `true` after live account/button and ledger configuration |
| `PAYPAL_MODE`              | `production`                                              |
| `PAYPAL_HOSTED_BUTTON_ID`  | Owner-supplied live button ID                             |
| `PAYPAL_MERCHANT_ID`       | Owner-supplied live German e.V. Merchant ID               |
| `PAYPAL_LIVE_APPROVED`     | `true`, authorized by the owner's live-first instruction  |

Configuration is fail-closed until the identifiers are supplied. The live approval flag is a deployment configuration marker, not another request for confirmation. No PayPal REST API secret or Stripe PayPal activation is needed.

Deployment sequence:

1. Run the automated code/security tests, type-check and build. Inspect current active Cloudflare versions, existing secrets/bindings, canonical domain and database using the read-only `paypal-live-preflight.yml` workflow. It uses the existing saved Cloudflare connections without printing their values or creating payments.
2. Verify the supplied hosted button displays the intended live recipient and native monthly option. Preserve any existing account IPN consumer.
3. Apply **only** additive migration `0002_paypal.sql` to the verified live database. Preserve all Stripe tables, records and bindings. Do not run historical Stripe launch helpers: their source/baseline pins are for a different release.
4. Configure the six PayPal values above, preserve existing Cloudflare bindings, and publish the reviewed PR source through the existing setup. Keep `STRIPE_PAYPAL_ENABLED=false` and `STRIPE_PAYPAL_RECURRING_ENABLED=false`. Retain the prior active version for code rollback.
5. Verify `/donate`, public pages and live Stripe configuration; verify PayPal config reports production and invalid/unverified notifications are rejected. Do not create a real payment automatically.
6. Give the owner the live donation page for **one small real PayPal donation**. Check the recipient before payment. Afterwards verify receipt in the association's PayPal Activity and a verified matching IPN/ledger record. Website confirmation must show the actual received amount; check purpose/reference handoff. One donation does not independently establish a later monthly renewal.

No further sandbox phase or separate deployment approval is required by this document. If a concrete account conflict or failing security check blocks launch, report that specific problem rather than introducing a generic testing prerequisite.

## Checks and current evidence

```sh
node --test --test-isolation=none tests/paypal.test.ts tests/donations.test.ts
npm run typecheck
npm run build
```

The prior PR passed 30 tests, type-checking, production build and GitHub CI; Cloudflare's branch build succeeded and created preview version `c412a60d-97d1-431d-9f29-70bd7ec2b7d3`. That branch build was a preview, not a production traffic promotion. A production-mode test now also checks that live operation needs no sandbox setup, uses only the live verification host and refuses sandbox notifications.

These automated tests use mocked provider verification and in-memory SQLite. No real PayPal transaction, receiving-account verification, mobile/browser acceptance or successful monthly renewal is claimed. Live identifiers and any required PayPal notification settings remain the account-owner dependency.

Rollback: set `PAYPAL_DONATIONS_ENABLED=false` to hide new checkout entry while retaining the configured, verified IPN handler for existing recurring donations. Preserve merchant/mode configuration, the ledger, existing PayPal notification consumers and staff reconciliation. Code rollback does not cancel mandates or refund payments.
