# Direct PayPal donations — sandbox integration

## Scope and decision

PayPal uses the association's own hosted Donate button and official Donate SDK. No Stripe request, Connect account, platform transfer or Stripe PayPal method is involved. Stripe's server module, Checkout component, payment methods, credentials, production configuration and deployment workflows are unchanged. Existing Stripe PayPal flags stay false.

The existing EN/DE/NL donation widget and responsive classes remain. A separate PayPal option appears only when its server configuration is enabled and valid. It also works if Stripe configuration is unavailable. PayPal's SDK is loaded only after the donor chooses PayPal.

Official references:

- [Donate SDK](https://developer.paypal.com/sdk/donate/)
- [Hosted Donate button](https://www.paypal.com/donate/buttons)
- [IPN verification](https://developer.paypal.com/api/nvp-soap/ipn/IPNIntro)

### Amount, frequency and purpose handoff

The Donate SDK documents standard Donate parameters, including purpose fields; it does not establish a dependable monthly preselection contract. Supplying a fixed amount can change the hosted recurring flow. We therefore deliberately omit amount and frequency parameters and tell the donor **before continuing** to confirm both in PayPal. Configure the hosted button for donor-chosen EUR amounts and monthly donations where the German Business account offers them. The website's requested amount/frequency are saved for reconciliation, not treated as paid facts.

Purpose is sent in `item_name` and `item_number`; a random attempt reference is sent in `custom`. Sandbox acceptance must prove that the hosted button preserves these fields, including correlation for recurring payments. If the account/button overrides them, stop and reassess rather than silently losing project selection. The existing English cause keys remain stable; the website copy and requested PayPal locale follow EN/DE/NL. PayPal controls its own available translations.

Name, email and country remain in the shared form, but are not assumed to populate PayPal's donor identity or address. PayPal collects its own payment details. No donor name/email/address is stored in the new ledger. The certificate-request flag is saved; the translated PayPal instructions ask donors to contact the association with their transaction ID and full postal address. Staff issue German certificates separately after reconciliation. Neither provider's receipt is a German donation certificate. Existing Stripe certificate handling is unchanged.

This is the simplest hosted Donate implementation. A custom Orders/Subscriptions implementation would add products/plans, REST credentials and additional lifecycle management. That alternative has not been chosen or partially introduced.

## Confirmation and data

Independent `/api/paypal/*` routes use the existing Cloudflare D1 binding, with additive migration `0002_paypal.sql`. No Stripe ledger rows are changed.

- Browser configuration creates an unguessable HttpOnly, SameSite=Lax ownership cookie scoped to `/api/paypal`; HTTPS uses Secure.
- Same-origin checks, strict existing donation validation, bounded bodies and rate limits protect attempt creation. Only an opaque reference is passed as `custom`; donor form details are not put in URLs.
- The browser ignores all `onComplete` values. It polls its owned attempt for up to ten minutes. Failed/unavailable confirmation stays pending; donors are told to check PayPal activity before paying again.
- IPN is posted back to PayPal's fixed sandbox/live verification host with the original encoded body. TLS validation stays enabled; redirects are refused; verification has a timeout. Verification or database outages return a retryable error.
- Only verified notifications for the configured merchant, environment and EUR currency are recorded. Duplicate fields are rejected. Actual PayPal amounts are authoritative because donors can edit them in the hosted flow. Browser-selected amounts are never used to manufacture payment confirmation.
- Transaction IDs deduplicate payments. Delayed Pending cannot overwrite Completed. Refunds/reversals put the attempt into manual reconciliation and cannot be cleared by a stale completion. Renewals can correlate through a previously verified subscription ID; refunds can correlate through the parent transaction. An account-wide unrelated notification does not create a donation record.
- Signup and cancellation notices alone never imply receipt of funds. This UI confirms receipt of a payment, not a guaranteed active monthly mandate. Monthly management/cancellation remains in PayPal.
- Store only correlation references, requested selections, certificate flag, verified transaction amount/status, subscription reference and timestamps. No raw provider payloads are logged. Use the association's PayPal activity/reports for donor identity, fees, current mandate status and financial reconciliation. Keep this ledger access restricted like the existing donation database.

Out-of-order, uncorrelated recurring notifications and hosted parameter behavior require sandbox verification. A permanent failure to deliver correlation must block launch. Reconcile PayPal reports, refunds and disputes before issuing certificates. A refund on a recurring attempt conservatively keeps the whole attempt in review, including later renewals.

## Configuration — disabled by default

No production Wrangler values, secrets, routes, DNS, existing Cloudflare Workers or databases are changed by this PR. No deployment workflow is added. `PAYPAL_DONATIONS_ENABLED` being absent keeps the PayPal UI hidden and routes unavailable, without querying its tables.

Required server bindings for an isolated test runtime:

| Binding                    | Value                                                             |
| -------------------------- | ----------------------------------------------------------------- |
| `DONATIONS_DB`             | Isolated staging D1 database, never the live database for sandbox |
| `DONATION_SITE_ORIGIN`     | Exact HTTPS test origin, or localhost for local development       |
| `PAYPAL_DONATIONS_ENABLED` | `true` only after migration and sandbox button configuration      |
| `PAYPAL_MODE`              | `sandbox`                                                         |
| `PAYPAL_HOSTED_BUTTON_ID`  | Sandbox Business account's generated button ID                    |
| `PAYPAL_MERCHANT_ID`       | Receiving sandbox Business account's Merchant ID                  |
| `PAYPAL_LIVE_APPROVED`     | Absent or `false` during sandbox work                             |

No PayPal API secret is needed for Donate/IPN. Do not put credentials in this repository or chat. Live mode additionally requires `PAYPAL_MODE=production`, a separately verified German e.V. Business merchant/button pair and `PAYPAL_LIVE_APPROVED=true`. That gate is not enabled here and is not a substitute for owner approval.

### Account owner: sandbox setup

1. Open [PayPal Developer](https://developer.paypal.com/), then **Testing Tools → Sandbox Accounts**. Create/select a German **Business** test account. Obtain its test login from the account details; do not send its password.
2. Sign that test Business account into [Sandbox Donate buttons](https://www.sandbox.paypal.com/donate/buttons). Create a **EUR**, donor-chosen amount Donate button. Enable the monthly recurring option if offered. Suggested amounts can match the website's €10/€25/€50/€100/€250. Avoid a fixed amount. If monthly is unavailable, report it; do not imply that a monthly donation was created.
3. Send only the generated **hosted_button_id** and the test account's **PayPal Merchant ID**, found under **Settings → Business information**. Confirm whether monthly giving is offered. These identifiers are not passwords/API secrets.
4. Once a test runtime URL is approved and available, configure sandbox **Account Settings → Notifications → Instant payment notifications → Update / Choose IPN Settings**. Use `https://<approved-test-origin>/api/paypal/ipn`, select **Receive IPN messages**, and save. The SDK also sends this notification URL. Check the generated button's advanced settings for an overriding IPN URL and remove any conflict. Do not change live account IPN settings or replace an existing live handler.
5. Use a separate sandbox Personal buyer account to donate. Verify the recipient is the intended test Business account. Use the sandbox IPN history to inspect/resend delivery when needed.

No test deployment has been requested by this PR. After local checks, any approved isolated staging deployment must use the existing staging Worker/database, apply only the additive migration there, retain Stripe's current test settings, and install the sandbox-only bindings above. Do not use the historical Stripe deployment helper as-is: it pins a different reviewed source revision and deliberately refuses unexpected bindings.

## Validation and launch gate

Local commands:

```sh
node --test --test-isolation=none tests/paypal.test.ts tests/donations.test.ts
npm run typecheck
npm run build
```

The PayPal tests use in-memory SQLite and mocked PayPal verification. They establish application behavior, **not real PayPal settlement or account eligibility**.

Before marking this PR ready, record actual sandbox evidence for:

- One-time and monthly donations, each receiving funds in the intended Business account.
- EUR custom/preset amount changes in PayPal; website confirmation must show actual paid amount.
- Each purpose key surviving into PayPal records and IPN `custom` / `item_number`; recurring renewals retaining a usable correlation reference.
- Valid paid IPN delivery to the test runtime and D1. A popup callback alone must leave confirmation pending.
- Cancellation, rejected/abandoned checkout, delayed notifications, duplicate/resend, verification outage, refund and recurring cancellation/renewal reconciliation.
- EN/DE/NL handoff copy and PayPal locale; mobile/desktop popup behavior, keyboard accessibility, blocked SDK/popup recovery and responsive layout.
- Existing one-time/monthly Stripe card, wallet and SEPA flows, donation certificate selection, project donation widgets, contact and newsletter regression checks.

Only after evidence is complete: request final integration/launch approval. Then verify the live account belongs to **iThemba Kuluntu e.V., Germany**, create its live hosted button, preserve any existing live IPN handler (use a reviewed dispatcher if needed), apply the additive migration and enable PayPal under the approved deployment procedure. Keep all Stripe PayPal flags false. Do not mix sandbox credentials/notifications with the live database.

Rollback: disable `PAYPAL_DONATIONS_ENABLED` to hide new checkout entry. Preserve the PayPal ledger and a functioning IPN reconciliation path for existing monthly donations; disabling the handler also stops this application's notification reconciliation. Do not delete payment data, assume a code rollback cancels mandates, or stop the account's other IPN consumers.

### Current evidence

Local validation on 27 October 2026: **30 tests passed** (8 PayPal security/ledger tests and 22 existing Stripe donation tests), TypeScript check passed, and the production build completed. Stripe source/configuration preservation was checked with an empty diff. No production or staging deployment, database migration, PayPal account change, real sandbox donation or live payment was performed. Actual sandbox checkout, IPN delivery, account eligibility and mobile/browser testing remain required before readiness. The draft PR's check-only CI repeats tests, type-checking and build without deployment or provider secrets.
