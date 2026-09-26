const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";
const BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const NEWSLETTER_LIST_ID = 4;
const CONTACT_EMAIL = "info@ithembakuluntu.org";

const EMAIL_MAX = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type JsonObject = Record<string, unknown>;

export type FormResult = { ok: true } | { ok: false; kind: "validation" | "security" | "service" };

function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(value: JsonObject, keys: string[]): boolean {
  const allowed = new Set(keys);
  return Object.keys(value).every((key) => allowed.has(key));
}

function stringWithin(value: unknown, max: number, required = false): value is string {
  return typeof value === "string" && value.length <= max && (!required || value.trim().length > 0);
}

function validEmail(value: string): boolean {
  return value.length <= EMAIL_MAX && EMAIL_PATTERN.test(value);
}

async function verifyTurnstile(
  token: string,
  expectedAction: "newsletter" | "contact",
  remoteIp?: string,
): Promise<boolean> {
  // Read per request: Cloudflare exposes Worker bindings through process.env
  // when nodejs_compat is enabled. Module-scope reads would miss request bindings.
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return isObject(result) && result.success === true && result.action === expectedAction;
  } catch {
    return false;
  }
}

async function brevoRequest(url: string, payload: JsonObject): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeSubject(value: string): string {
  return value
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

export async function subscribeToNewsletter(payload: unknown): Promise<FormResult> {
  if (
    !isObject(payload) ||
    !hasOnlyKeys(payload, ["email", "consent"]) ||
    !stringWithin(payload.email, EMAIL_MAX, true) ||
    payload.consent !== true
  ) {
    return { ok: false, kind: "validation" };
  }

  const email = payload.email.trim();
  if (!validEmail(email)) return { ok: false, kind: "validation" };

  const sent = await brevoRequest(BREVO_CONTACTS_URL, {
    email,
    listIds: [NEWSLETTER_LIST_ID],
    updateEnabled: true,
  });
  return sent ? { ok: true } : { ok: false, kind: "service" };
}

export async function sendContactMessage(payload: unknown, remoteIp?: string): Promise<FormResult> {
  if (
    !isObject(payload) ||
    !hasOnlyKeys(payload, ["name", "email", "country", "subject", "message", "turnstileToken"]) ||
    !stringWithin(payload.name, 120, true) ||
    !stringWithin(payload.email, EMAIL_MAX, true) ||
    !stringWithin(payload.country, 120) ||
    !stringWithin(payload.subject, 160) ||
    !stringWithin(payload.message, 5000, true) ||
    !stringWithin(payload.turnstileToken, 2048, true)
  ) {
    return { ok: false, kind: "validation" };
  }

  const name = payload.name.trim();
  const email = payload.email.trim();
  const country = payload.country.trim();
  const subject = payload.subject.trim();
  const message = payload.message.trim();
  if (!validEmail(email)) return { ok: false, kind: "validation" };

  if (!(await verifyTurnstile(payload.turnstileToken, "contact", remoteIp))) {
    return { ok: false, kind: "security" };
  }

  const emailSubject = `New website enquiry - ${safeSubject(subject || name)}`;
  const htmlContent = `
    <h2>New website enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Country:</strong> ${escapeHtml(country || "Not provided")}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject || "Not provided")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>
  `;
  const textContent = [
    "New website enquiry",
    `Name: ${name}`,
    `Email: ${email}`,
    `Country: ${country || "Not provided"}`,
    `Subject: ${subject || "Not provided"}`,
    "Message:",
    message,
  ].join("\n");

  const sent = await brevoRequest(BREVO_EMAIL_URL, {
    sender: { name: "iThemba Kuluntu", email: CONTACT_EMAIL },
    to: [{ email: CONTACT_EMAIL, name: "iThemba Kuluntu" }],
    replyTo: { email, name },
    subject: emailSubject,
    htmlContent,
    textContent,
  });
  return sent ? { ok: true } : { ok: false, kind: "service" };
}
