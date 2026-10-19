# Isolated Stripe sandbox activation — completed

The supplied public test login link was verified on 18 October against the authenticated sandbox's default Portal under **both** API `2024-06-20` and `2026-08-26.dahlia`. Both returned the exact link with email login enabled, cancellation at period end and payment-method updates enabled. The public page returned HTTP 200. [Read-only verification](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39106099986) resolved the previous mismatch; no account setting was changed by automation. The earlier unavailable state does not establish an API-version bug.

## Approved staging activation

Activate **test payments only** on existing Worker **`ithemba-donations-staging`**, at `https://ithemba-donations-staging.super-tooth-55f1.workers.dev`, using existing **`DONATIONS_DB`** binding to D1 database **`990e1489-72e6-4a2b-b2f6-dbb4863e4971`**. Deploy the current reviewed donation application (including the unavailable-message fix and Dahlia webhook support) and saved sandbox configuration together. Optional PayPal/recurring PayPal/bank transfer settings stay off; card/eligible-wallet and SEPA compatibility remains as implemented.

The user explicitly approved **“I approve staging sandbox activation.”** [The approved activation](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39107055106) completed successfully on 18 October 2026. The eight encrypted bindings below were installed on staging, and public test configuration, secure cookies and signature probes passed. No further activation action is pending from the operator. Production Worker `tanstack-start-app`, production credentials/database, live Stripe settings, DNS/routes and merging PR #26 are outside this request.

## Prepared automation and approval gates

`.github/workflows/stripe-sandbox-activate.yml` triggers only for the donations branch and selected activation-helper paths. Ordinary preparation pushes install locked dependencies, run all suites/typecheck, build locally on GitHub and perform **read-only** Stripe/Cloudflare preflight. Credentials are supplied only to preflight/activation steps, after installation, testing and build; no credential artifacts are uploaded.

Activation is skipped unless the push's exact message is **`Activate approved Stripe sandbox on isolated staging Worker`**. Codex must create that marker push only after explicit user approval. The helper independently requires an approval flag and exact repository/branch/push event/marker. A source check against `7a7509eb6fe486a3d0f8ed5887c7cd7d4f39108c` permits differences only in the new activation helper/workflow/tests, documentation and public staging-check workflow. Application source, dependencies, production config and staging Wrangler config must match that reference. Later changes outside that allowlist fail closed, including the subsequently added sandbox smoke/browser/cleanup helpers. Do not rerun activation against the current branch without reviewing and updating that source guard. The Portal test fixes do not require a Worker deployment.

Preflight authenticates the restricted **test** key to the operator-supplied expected account, rediscovers the test Portal, verifies exact existing staging D1 metadata and workers.dev subdomain, and validates only the named staging Worker's bindings. Wrong/live/unexpected bindings, duplicate names, plaintext credentials, optional methods enabled or a different domain/database stop the job. No Stripe configuration is created or modified. The older credential-free deployment helper remains unchanged and is not used.

## Secret installation during the approved deployment

The helper uses the installed Wrangler's supported `deploy --config <absolute staging config> --secrets-file <temporary file>` operation. Explicit staging config ignores the generated production redirect. These become encrypted Worker secret bindings in the deployment:

| Worker binding                   | Source                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `STRIPE_SECRET_KEY`              | Saved `rk_test_` restricted key                                                                   |
| `STRIPE_PUBLISHABLE_KEY`         | Same sandbox's saved `pk_test_` key                                                               |
| `STRIPE_ACCOUNT_ID`              | Operator-supplied account ID, verified by API lookup                                              |
| `STRIPE_WEBHOOK_SECRET`          | Saved `STRIPE_SANDBOX_WEBHOOK_SECRET`                                                             |
| `DONATION_SITE_ORIGIN`           | Fixed staging HTTPS origin above                                                                  |
| `STRIPE_PORTAL_CONFIGURATION_ID` | Rediscovered eligible sandbox Portal                                                              |
| `STRIPE_PORTAL_LOGIN_URL`        | Its verified Stripe test email-login URL                                                          |
| `DONATION_COOKIE_SECRET`         | Generated 256-bit random value on first activation; existing encrypted value inherited on retries |

The secrets file is outside the checkout in a private temporary directory (0700), with file permissions 0600, removed in `finally` on success/failure. Values are masked in GitHub logs; Wrangler displays secret bindings as hidden. Keys are absent from command-line arguments and stripped from the child's inherited Stripe/donation environment. No secret enters tracked files, build output or artifacts. Non-secret runtime values are also encrypted, preserving the strict staging config's plaintext variable allowlist. The public endpoint exposes only the publishable test key, test mode and Portal login URL.

## Checks after activation

- Re-read settings: exact staging D1, test mode, optional methods off and only approved encrypted bindings.
- Retry initial URL checks briefly for propagation. `/donate` and `/api/donations/config` must return 200. Configuration must contain only expected public test fields, an uncached response and a Secure/HttpOnly/SameSite=Lax cookie scoped to `/api/donations`.
- Send one **synthetic unsupported-event signature probe** with the installed secret and one invalid signature, expecting 200 and 400. These create no donation row, Customer, Checkout or Subscription and do not contact Stripe.

Synthetic probes prove the Worker uses the installed secret and checks signatures; they **do not prove** the secret belongs to the registered Stripe destination. [Uncharged Checkout checks](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39107343424) subsequently verified both frequencies, idempotent retries, expiration and actual Stripe-signed expiration deliveries. [Browser payment checks](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39108364887) confirmed one-time and monthly test-card payments, genuine succeeded statuses and registered Stripe-signed completion events; that run then failed in the Portal test harness, not the payment flow. After correcting the harness, [the complete browser run passed](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/actions/runs/39258899738), including cookie-owned website Portal creation and confirmed period-end cancellation. Renewal, delayed-payment, failure and broader method acceptance remain separate checks. Never use live card details for these tests.

An upload followed by failed verification is **deployed but unverified**, not rolled back. Inspect the job and existing staging Worker before retrying. Existing cookie secrets are inherited on retries rather than invalidating donor ownership. No automatic production fallback, migration, DNS change, merge or live activation occurs.

The read-only public-check workflow recognizes either intentionally unavailable 503 or valid public **test-only** 200 configuration, reporting which it observed. It never claims a payment succeeded. The activation helper requires 200 and cannot declare 503 ready. Raw HTTP bodies are omitted from failure logs.
