import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { experimental_readRawConfig } from "wrangler";
import { assertStagingIsolation, checkStaging } from "../scripts/check-donations-staging.mjs";

const staging = experimental_readRawConfig({
  config: fileURLToPath(new URL("../wrangler.donations-staging.jsonc", import.meta.url)),
}).rawConfig;

test("standalone staging resolves to the dedicated Worker and exact existing D1 ID", async () => {
  assertStagingIsolation(staging);
  const result = await checkStaging();
  assert.equal(result.worker, "ithemba-donations-staging");
  assert.equal(result.database, "990e1489-72e6-4a2b-b2f6-dbb4863e4971");
});

test("isolation guard rejects production names, routes, other bindings, live mode and secrets", () => {
  for (const edit of [
    (c) => {
      c.name = "tanstack-start-app";
    },
    (c) => {
      c.routes = [{ pattern: "example.org/*", zone_name: "example.org" }];
    },
    (c) => {
      c.route = "example.org/*";
    },
    (c) => {
      c.env = { production: { name: "tanstack-start-app" } };
    },
    (c) => {
      c.d1_databases[0].database_id = "00000000-0000-0000-0000-000000000000";
    },
    (c) => {
      c.d1_databases[0].binding = "OTHER_DB";
    },
    (c) => {
      c.d1_databases.push({ binding: "PRODUCTION_DB" });
    },
    (c) => {
      c.services = [{ binding: "PROD", service: "tanstack-start-app" }];
    },
    (c) => {
      c.vars.STRIPE_DONATIONS_MODE = "live";
    },
    (c) => {
      c.vars.STRIPE_SECRET_KEY = "not-a-real-secret";
    },
  ]) {
    const candidate = structuredClone(staging);
    edit(candidate);
    assert.throws(() => assertStagingIsolation(candidate));
  }
});

test("explicit staging config ignores a generated redirect targeting production", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ithemba-staging-config-"));
  try {
    await mkdir(join(dir, ".wrangler/deploy"), { recursive: true });
    await writeFile(join(dir, "wrangler.jsonc"), JSON.stringify({ name: "tanstack-start-app" }));
    await writeFile(
      join(dir, "generated-production.json"),
      JSON.stringify({ name: "tanstack-start-app" }),
    );
    await writeFile(
      join(dir, ".wrangler/deploy/config.json"),
      JSON.stringify({ configPath: "../../generated-production.json" }),
    );
    const explicit = join(dir, "wrangler.donations-staging.jsonc");
    await writeFile(explicit, JSON.stringify(staging));
    const result = experimental_readRawConfig(
      { config: explicit },
      { useRedirectIfAvailable: true },
    );
    assert.equal(result.redirected, false);
    assert.equal(result.configPath, explicit);
    assert.equal(result.rawConfig.name, "ithemba-donations-staging");
    assertStagingIsolation(result.rawConfig);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
