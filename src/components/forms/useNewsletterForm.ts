import { useCallback, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { TurnstileWidgetHandle } from "./TurnstileWidget";

export type NewsletterStatus =
  "idle" | "submitting" | "success" | "validation" | "security" | "error";

export function useNewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const onToken = useCallback((value: string) => {
    setToken(value);
    setStatus((current) => (current === "security" ? "idle" : current));
  }, []);
  const onExpire = useCallback(() => setToken(""), []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    if (!consent) {
      setStatus("validation");
      return;
    }
    if (!token) {
      setStatus("security");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, consent, turnstileToken: token }),
      });
      if (response.ok) {
        setStatus("success");
        setEmail("");
        setConsent(false);
      } else {
        const body: unknown = await response.json().catch(() => undefined);
        const kind = body && typeof body === "object" && "error" in body ? body.error : undefined;
        setStatus(
          kind === "security" ? "security" : kind === "validation" ? "validation" : "error",
        );
      }
    } catch {
      setStatus("error");
    } finally {
      setToken("");
      turnstileRef.current?.reset();
    }
  };

  return {
    email,
    setEmail,
    consent,
    setConsent,
    status,
    submit,
    onToken,
    onExpire,
    turnstileRef,
  };
}
