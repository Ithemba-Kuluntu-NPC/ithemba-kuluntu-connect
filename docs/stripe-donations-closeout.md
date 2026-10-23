# Stripe donation integration closeout — 23 October 2026

The owner authorized merging [PR #26](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/pull/26) and accepted existing sandbox monthly tests for launch, explicitly waiving a real monthly test. The PR's merge record and linked closeout workflow provide the final merge commit and verification result.

## Preservation and production configuration

Current main at **`f06afef0f72032730a2b0b670510ad2595f928e6`** was incorporated into the donation branch before merge. Its exact ECD, Greenhouse, Pondo Dogs and PureFlow page/content blobs were retained. Existing main files outside the intended donation widget, donation API routing, package scripts and production Wrangler configuration must remain byte-for-byte unchanged; the final tree comparison verifies this. Contact/newsletter source and dependencies are unchanged.

Default `wrangler.jsonc` now declares existing **`DONATIONS_DB`**, exact live database **`67acffe7-2412-44ce-817d-1d7f316d9392`**, live donation mode and the approved disabled method flags, with **`keep_vars: true`**. This prevents routine Cloudflare main builds from dropping the manually installed donation database or dashboard variables. No credential values are committed. Existing secrets remain on the Worker; no DNS/routes or account configuration change is required. The standalone staging configuration still explicitly selects only its test Worker/database and test-mode variables.

The closeout workflow runs the existing regression suite, the necessary production-config preservation assertion, type-check and build, then performs read-only live binding/domain/public-health checks. It does not create a payment, subscription, refund or migration, and does not deploy a Worker. Cloudflare's existing main build may publish the merged source; its resulting production bindings and public health must be verified before declaring alignment.

## Accepted evidence

- Full deployment regression/type-check/build checks passed before the approved production launch.
- Actual live one-time/monthly unfunded creation, idempotency, ownership, expiration and genuine signed expiration delivery to the live database passed.
- The owner confirmed live one-time secure card rendering and then completed the **€1 real one-time card donation**, supplying website success and delivered Stripe receipt evidence. This is owner-provided evidence, not an independent API or completion-webhook audit of that payment.
- Sandbox paid monthly card/SEPA, delayed success/failure, authentication, Portal login, payment-method update and cancellation evidence remains linked in the [readiness report](stripe-donations-readiness.md). No further real monthly donation is requested.

## Remaining limitations

- Live **cards, eligible Apple Pay/Google Pay and SEPA** are in the approved one-time/monthly EUR scope. Apple Pay and Link button visibility was owner-confirmed; actual live wallet and SEPA settlement were not tested. Eligibility depends on Stripe/device/browser.
- **PayPal/recurring PayPal remain disabled** pending separate approval and testing. Bank transfers are off and unnecessary for this Checkout; iDEAL/Wero and TWINT remain excluded.
- A real monthly first payment, paid live recurring donor Portal session and accelerated renewal were not tested. The owner accepted sandbox monthly evidence; Test Clock permission changes remain deferred.
- Earlier automated live card rendering remains a historically failed browser run; normal-browser owner evidence resolved that specific one-time rendering gate. No CAPTCHA bypass or runtime fix was needed.
- REST remains **`2024-06-20`**, separately from **`2026-08-26.dahlia` Snapshot** delivery. Upgrading only the REST header breaks fields used here. Runtime restricted permissions remain the documented **4 Read / 3 Write**, including **Customer Portal**.
- Stripe receipts are **not official German donation certificates**. Staff issue certificates separately after settled-payment/refund/reversal reconciliation.

Retain the live ledger and signed-event reconciliation during any rollback. Code rollback does not refund donations. Historical pre-launch fingerprints/version records are not a reusable deployment baseline.
