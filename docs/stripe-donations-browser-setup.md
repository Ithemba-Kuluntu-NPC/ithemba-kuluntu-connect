# Browser-only setup: no terminal or software installation

PR #26 can prepare the already-approved staging database through GitHub Actions. This job **does not build or deploy a Worker**, change DNS, touch Stripe, merge the PR, or use the production Worker. It verifies the account's access to the exact staging database before listing/applying the unchanged `0001_donations.sql`, then verifies its tables and migration record. The migration file is locked to its approved SHA-256; extra migrations or changed SQL stop the job.

## The one necessary authorization task

**Save a Cloudflare staging connection as one GitHub Actions secret.** Codex can access the repository, but cannot log into your Cloudflare account or create credentials for you. No direct Cloudflare app connection is available in this session. Keep the token out of chat, source files and PR comments.

Complete this authorization entirely in your browser:

1. In [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens), create a **Custom Token** named `iThemba staging D1`. Give it **Account → D1 → Edit**, scoped to **only the account containing `ithemba-donations-staging`**. No Workers, DNS, zone or Stripe permissions are needed. Copy the token privately. The D1 permission is account-scoped; the migration helper itself restricts every request to the approved staging database ID.
2. Copy that Cloudflare **Account ID** from your account overview (32 letters/numbers, also visible in the dashboard URL). This is not the D1 database UUID.
3. Open [New GitHub repository secret](https://github.com/Ithemba-Kuluntu-NPC/ithemba-kuluntu-connect/settings/secrets/actions/new). Use the exact name **`CLOUDFLARE_D1_STAGING`** and paste this into the secret value, replacing both placeholders privately:

   ```json
   { "accountId": "YOUR_CLOUDFLARE_ACCOUNT_ID", "apiToken": "YOUR_CLOUDFLARE_D1_TOKEN" }
   ```

4. Save the secret and tell Codex **“Cloudflare connection saved.”** Do not include its contents. Codex can then rerun the failed GitHub job without seeing the secret value. You do not need to install anything or run commands.

Creating the token and saving the single encrypted connection is the unavoidable account-authorization task; it is not a deployment approval. Until the secret exists, the job stops with an authorization-missing message and cannot access Cloudflare. There is no request for a global Cloudflare API key.

## What the GitHub job will do

The workflow **Prepare donations staging database** runs only on pushes to `codex/stripe-donations-integration` affecting its migration helper/configuration. It is intentionally available on this existing PR branch without a merge or default-branch workflow dispatch. GitHub installs locked dependencies on its own runner; the Cloudflare secret is supplied only to the authorization-presence check and migration step, not installation or tests. Actions are pinned to commit SHAs; repository permissions are read-only.

The job checks:

- Existing staging config and binding: `DONATIONS_DB`.
- Authenticated access to account and database metadata; name must be **`ithemba-donations-staging`**, ID **`990e1489-72e6-4a2b-b2f6-dbb4863e4971`**.
- Only the approved, unchanged `migrations/0001_donations.sql` is available.
- Pending migrations are listed before applying them through Wrangler with the explicit staging config.
- `donations`, `donation_events`, `donation_rate_limits`, `d1_migrations` and the applied migration record exist afterwards.

It can be rerun safely: Wrangler skips the already-recorded migration and the job verifies the existing tables. A failed authentication/target check stops before migration commands. Raw Cloudflare errors and credentials are not printed; the token is additionally masked in GitHub logs.

After database setup succeeds, Worker deployment and test Stripe credentials are separate next stages. **Neither a staging nor production Worker will be deployed by this job.** Codex must obtain your approval before a later deployment. The existing [operator runbook](stripe-donations-staging.md) remains available for technical operators, but you do not need its terminal commands for this browser-only route.

No remote migration has been claimed complete until a successful GitHub job verifies it. If GitHub Actions is disabled or requires an administrator to enable it, Codex will report that specific access block rather than ask you to run terminal commands.
