# Isolated donations staging: operator runbook

Prepared on `codex/stripe-donations-integration` for Draft PR #26. **Preparation only: no remote migration, deployment, merge, production setting change or Stripe secret handling has been performed.** All commands below run from the repository root. Commands marked **remote** are future operator actions, not commands executed during this preparation.

## Fixed targets

| Item                                        | Exact value                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| Worker to create/update                     | `ithemba-donations-staging`                                                  |
| Existing production Worker — never target   | `tanstack-start-app`                                                         |
| Staging config                              | `./wrangler.donations-staging.jsonc`                                         |
| D1 database                                 | `ithemba-donations-staging`                                                  |
| D1 database ID                              | `990e1489-72e6-4a2b-b2f6-dbb4863e4971`                                       |
| Worker D1 binding                           | `DONATIONS_DB`                                                               |
| Existing migration                          | `migrations/0001_donations.sql` — unchanged                                  |
| Migration tracking table                    | Wrangler default `d1_migrations`                                             |
| Public address after an approved deployment | `https://ithemba-donations-staging.<YOUR_WORKERS_DEV_SUBDOMAIN>.workers.dev` |
| Stripe mode                                 | `test`; no credentials configured yet                                        |

This is a standalone Worker config, **not** an `env.staging` section inheriting production settings. It uses the existing built `.output/server/index.mjs` and `.output/public` assets. Worker identity and D1 selection come from the explicit staging config, not from a name embedded in the JavaScript bundle. No service binding, production D1, custom hostname, zone route, schedule or production secrets are configured. `workers_dev=true`, `preview_urls=false`, `routes=[]`; the staging D1 is the only database bound.

## 1. Confirm the branch, account and target before remote work

Use Node 24+ and the repository's installed dependencies. Review Draft PR #26; stay on the existing branch. No merge is needed for an isolated staging deployment.

```sh
git switch codex/stripe-donations-integration
git pull --ff-only origin codex/stripe-donations-integration
npm run check:donations-staging
npm run test:donations-staging
npm run test:donations
npm run typecheck
npm run build:donations-staging
```

The build/check commands are local only. The guard checks both the source config and the installed Wrangler's resolved config, requires the exact staging name/database/binding, and rejects live mode, custom routes, named environments, extra bindings or secrets. It also checks that the compiled Worker and asset directory exist after building. The checks never invoke `wrangler deploy` (including dry-run) or a remote D1 command.

In your own terminal, authenticate to the Cloudflare account that owns the D1 database, if necessary, and confirm it:

```sh
npx wrangler whoami
```

If you are not authenticated, use `npx wrangler login` yourself. Do not paste tokens or secrets into chat. In the Cloudflare dashboard, confirm that the database ID above belongs to the selected account, and confirm its `workers.dev` subdomain. Check that `ithemba-donations-staging` is available or is a Worker dedicated to this staging task; if it is already used for another purpose, stop for a reviewed name change. `tanstack-start-app` must not be renamed, selected, updated or given a staging route.

If your login has multiple Cloudflare accounts, prefix **each remote command** below with `CLOUDFLARE_ACCOUNT_ID=<THE_CONFIRMED_ACCOUNT_ID>` in your terminal. The account ID is intentionally not guessed or committed. Do not set Worker-name/environment overrides, add `--name`/`--env`, or use the production config. The existing database ID ensures an incorrect account cannot resolve this staging database; verify the account for Worker deployment as well.

## 2. Apply the existing migration — remote, only when you choose to proceed

First inspect pending migrations for **this staging database only**:

```sh
npx wrangler d1 migrations list ithemba-donations-staging --remote --config ./wrangler.donations-staging.jsonc
```

Verify the output identifies the staging database and lists `0001_donations.sql` as pending on a fresh database. Then apply it:

```sh
npx wrangler d1 migrations apply ithemba-donations-staging --remote --config ./wrangler.donations-staging.jsonc
```

Read Wrangler's confirmation prompt and stop if the target is not staging. Do not replace the database ID, re-create the database or use `wrangler d1 execute --file` as an alternative migration path. The migration runner records `0001_donations.sql` in `d1_migrations` and skips it on subsequent applies. It creates `donations`, `donation_events`, `donation_rate_limits` and the customer-reference index. It changes no Stripe data. No migration SQL has been edited for this task.

Verify application and schema:

```sh
npx wrangler d1 migrations list ithemba-donations-staging --remote --config ./wrangler.donations-staging.jsonc
npx wrangler d1 execute ithemba-donations-staging --remote --config ./wrangler.donations-staging.jsonc --command "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('donations','donation_events','donation_rate_limits','d1_migrations') ORDER BY name;"
```

Expect no pending migrations and those four table names. These are future remote operator commands; none has been executed during preparation.

## 3. Create the isolated Worker — remote, requires a separate decision to deploy

Re-run the local isolation/artifact check after building. Only after you have reviewed the target and chosen to authorize the initial staging deployment, run:

```sh
node scripts/check-donations-staging.mjs --built
npx wrangler deploy --config ./wrangler.donations-staging.jsonc
```

Wrangler must report **`ithemba-donations-staging`**, binding **`DONATIONS_DB`**, database **`ithemba-donations-staging`**, and ID **`990e1489-72e6-4a2b-b2f6-dbb4863e4971`**. It creates/updates that named Worker and uploads the website's public assets under that Worker; it must not report `tanstack-start-app` or a custom production route. Confirm the resulting URL is the separate staging `workers.dev` URL in the table above. No custom domain or production DNS/routing change is needed.

**Why explicit config is mandatory:** the ordinary `npm run build` emits `.output/server/wrangler.json` with the production name and may generate `.wrangler/deploy/config.json` pointing to it. Do not use bare `wrangler deploy`, `.output/server/wrangler.json`, `wrangler.jsonc`, `nitro deploy` or a hosting UI that auto-selects these for staging. Installed Wrangler resolves an explicit `--config` directly instead of following the generated redirect; the regression test verifies this even with a synthetic production redirect. Neither the production config nor its generated name needs to change.

These are configuration safeguards, not a Cloudflare authorization boundary. Someone using an account-wide token and deliberately overriding `--name` or selecting the production config could still affect production. For an account-level prohibition, use credentials restricted to staging resources wherever Cloudflare supports it, or a separate staging account; neither credential nor account changes are part of this task. The supplied config and commands do not select the production Worker.

## 4. Leave payments unavailable until a separate Stripe setup phase

The initial staging site can render, but `/api/donations/config` and payment operations intentionally return **503 unavailable** until the required staging/test secrets and configuration exist. No donations can be accepted with this prepared configuration. Do not reuse production credentials or copy production newsletter/contact bindings. No API keys, webhook signing secrets, cookie secrets, Stripe account IDs, Portal IDs, or donation origins have been read, set or committed for staging.

After you confirm the staging URL, the next separately authorized phase is to review and configure only association-owned **test** Stripe credentials, the cookie secret, test webhook/Portal details and that exact staging origin, then run the sandbox acceptance checks in [the setup guide](stripe-donations-setup.md). The staging isolation guard deliberately rejects extra variables; adding reviewed non-secret origin/account/Portal variables requires updating the guard with the staging config in that later phase. Do not change `STRIPE_DONATIONS_MODE` to live. No Stripe secret commands are included in this preparation runbook.

## What you need to provide or decide next

1. Confirm the Cloudflare account and `workers.dev` subdomain, and that `ithemba-donations-staging` is the intended dedicated Worker name.
2. Review the configuration/PR and choose whether to run the explicitly scoped **remote staging migration** commands above yourself, or separately authorize them.
3. Decide separately when to authorize the initial **staging-only deployment**; it is expected to have payments unavailable initially.
4. Provide the resulting staging URL when ready for the later Stripe test configuration phase. Do not send secrets in chat.

No production deployment, merge, production binding change or live donation is required for any of these staging steps.
