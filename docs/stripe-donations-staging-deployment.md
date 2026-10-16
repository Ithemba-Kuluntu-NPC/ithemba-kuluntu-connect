# Approved browser-only staging deployment

The user approved deployment of **`ithemba-donations-staging` for testing only** on 16 October 2026. This does not authorize production deployment, a PR merge, custom domains/DNS changes, real payments or Stripe secret handling.

## What is prepared

The GitHub workflow **Deploy approved donations staging Worker** checks and builds the existing PR branch, then runs Wrangler with **only** `wrangler.donations-staging.jsonc`. The config still names `ithemba-donations-staging`, binds only D1 database `990e1489-72e6-4a2b-b2f6-dbb4863e4971` as `DONATIONS_DB`, has no custom routes and sets Stripe mode to `test`. Production `wrangler.jsonc` remains unchanged.

It is not an automatic deployment on ordinary branch pushes. The workflow requires the explicit commit message **`Deploy approved isolated donations staging Worker`** and checks that application/build/config files are identical to reviewed source commit `4fe7af0236dc23cd2d0786e6263525f1fd448360`. Only this deployment helper, its tests/workflow and documentation may differ. Retrying the same approved run is supported; changing application code requires a newly reviewed deployment plan.

The job uses the existing encrypted GitHub connection `CLOUDFLARE_D1_STAGING` for the account ID and staging D1 verification. If a separate `CLOUDFLARE_WORKER_STAGING_TOKEN` secret exists, it uses that token for Worker operations. Otherwise it first checks whether the existing connection already has Worker access. A D1-only token is expected to fail this read-only permission check **before deployment**, preserving the database setup.

## If the job reports missing Worker deployment permission: your next necessary step

**Save a Worker deployment token in GitHub.** This is the only new authorization task; no installation, terminal command or account-ID entry is needed.

1. In [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens), create a custom token with **Account → Workers Scripts → Edit**, scoped only to the same Cloudflare account as the staging database. Use the narrowest supported Worker scope covering creation/deployment of `ithemba-donations-staging`. If Cloudflare cannot scope creation to a not-yet-existing Worker, the account-scoped permission is broader; the fixed target and reviewed-source checks in the job restrict what the automation does. No DNS, Workers Routes, D1 Edit, global API key or Stripe permission is requested. [Cloudflare's Workers permissions reference](https://developers.cloudflare.com/workers/authorization/workers/) describes Worker deployment/binding authorization.
2. Open [New GitHub repository secret](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/settings/secrets/actions/new). Name it **`CLOUDFLARE_WORKER_STAGING_TOKEN`** and paste **only the new token** into its value (no JSON). Leave the existing `CLOUDFLARE_D1_STAGING` secret unchanged.
3. Save it and tell Codex **“Deployment token saved.”** Do not paste the token into chat. Codex can rerun the same approved GitHub job.

The token is available only to the access-check/deployment steps, never dependency installation, tests or build. Token values are masked in job logs and never committed. Cloudflare API calls use the account ID from the existing saved connection, verify the exact staging D1 metadata, and inspect only the named staging Worker. Existing unexpected bindings, secrets, a different database or a live-mode setting cause the job to stop for review.

## Deployment and verification

After access checks pass, GitHub builds and runs a single deployment command with the explicit staging config. No migrations, custom routes, DNS records, account subdomain registration or production Worker operations are included. It uses the account's existing `workers.dev` subdomain; if one is unavailable, it stops instead of changing account settings.

After deployment the job checks:

- The deployed `DONATIONS_DB` binding matches staging and donation mode is `test`.
- No unreviewed bindings or Stripe secrets are attached.
- The separate staging URL's `/donate` page returns HTTP 200.
- `/api/donations/config` returns HTTP 503, confirming that payments remain unavailable before separate Stripe test configuration.

The staging URL is printed in the job summary after these checks. A successful upload followed by a failed verification must be reported as **deployed but not verified**, not as a completed deployment or a permission failure. The job never submits a donation. Stripe test setup is a later step; live keys and real payments remain outside this authorization.
