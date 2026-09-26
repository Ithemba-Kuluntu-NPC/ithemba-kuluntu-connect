import { useState } from "react";
import type { FormEvent } from "react";

export type NewsletterStatus = "idle" | "submitting" | "success" | "validation" | "error";

export function useNewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    if (!consent) {
      setStatus("validation");
      return;
    }
    setStatus("submitting");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      if (response.ok) {
        setStatus("success");
        setEmail("");
        setConsent(false);
      } else {
        const body: unknown = await response.json().catch(() => undefined);
        const kind = body && typeof body === "object" && "error" in body ? body.error : undefined;
        setStatus(kind === "validation" ? "validation" : "error");
      }
    } catch {
      setStatus("error");
    }
  };

  return {
    email,
    setEmail,
    consent,
    setConsent,
    status,
    submit,
  };
}
