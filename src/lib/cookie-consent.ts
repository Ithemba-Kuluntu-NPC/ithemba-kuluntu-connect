export const CONSENT_KEY = "cookie-consent";
export const CONSENT_VERSION = 1;

export type Consent = {
  version: typeof CONSENT_VERSION;
  essential: true;
  externalMedia: boolean;
  updatedAt: string;
};

export function createConsent(externalMedia: boolean): Consent {
  return {
    version: CONSENT_VERSION,
    essential: true,
    externalMedia,
    updatedAt: new Date().toISOString(),
  };
}

/** Old acceptance did not distinguish services: ask again rather than infer permission. */
export function parseConsent(raw: string | null): Consent | null {
  if (raw === "rejected") return createConsent(false);
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      value &&
      typeof value === "object" &&
      "version" in value &&
      value.version === CONSENT_VERSION &&
      "essential" in value &&
      value.essential === true &&
      "externalMedia" in value &&
      typeof value.externalMedia === "boolean" &&
      "updatedAt" in value &&
      typeof value.updatedAt === "string" &&
      Number.isFinite(Date.parse(value.updatedAt))
    )
      return value as Consent;
  } catch {
    /* Missing, legacy acceptance, or malformed storage means no optional consent. */
  }
  return null;
}
