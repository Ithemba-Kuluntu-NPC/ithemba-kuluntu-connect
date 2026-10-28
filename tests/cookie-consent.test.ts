import assert from "node:assert/strict";
import { test } from "node:test";
import { createConsent, parseConsent } from "../src/lib/cookie-consent.ts";

test("optional permission requires a valid explicit category choice", () => {
  for (const raw of [null, "", "accepted", "true", "{}", "null", "[]", "not-json"])
    assert.equal(parseConsent(raw), null);
  for (const externalMedia of [true, false]) {
    const consent = createConsent(externalMedia);
    assert.deepEqual(parseConsent(JSON.stringify(consent)), consent);
    assert.equal(consent.essential, true);
    assert.equal(consent.version, 1);
  }
});

test("legacy rejection remains rejected without treating old acceptance as permission", () => {
  const consent = parseConsent("rejected");
  assert.equal(consent?.externalMedia, false);
  assert.equal(consent?.essential, true);
  assert.equal(parseConsent("accepted"), null);
});

test("malformed and future preferences fail closed", () => {
  const valid = createConsent(true);
  for (const patch of [
    { version: 2 },
    { essential: false },
    { externalMedia: "true" },
    { updatedAt: "bad-date" },
    { updatedAt: null },
    { externalMedia: null },
  ])
    assert.equal(parseConsent(JSON.stringify({ ...valid, ...patch })), null);
});
