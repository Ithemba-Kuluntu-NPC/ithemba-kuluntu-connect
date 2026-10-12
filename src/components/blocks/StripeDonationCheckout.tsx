import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { DonationStatus } from "@/lib/donations";

type EmbeddedCheckout = { mount: (element: HTMLElement) => void; destroy: () => void };
type StripeClient = {
  initEmbeddedCheckout: (options: {
    clientSecret: string;
    onComplete: () => void;
  }) => Promise<EmbeddedCheckout>;
};
declare global {
  interface Window {
    Stripe?: (key: string) => StripeClient;
  }
}
let stripeScript: Promise<void> | undefined;
function loadStripe(): Promise<void> {
  if (window.Stripe) return Promise.resolve();
  if (!stripeScript)
    stripeScript = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.async = true;
      script.onload = () => (window.Stripe ? resolve() : reject(new Error("Stripe unavailable")));
      script.onerror = () => {
        script.remove();
        reject(new Error("Stripe unavailable"));
      };
      document.head.appendChild(script);
    }).catch((error) => {
      stripeScript = undefined;
      throw error;
    });
  return stripeScript;
}
function EmbeddedPayment({
  clientSecret,
  publishableKey,
  onComplete,
  onError,
}: {
  clientSecret: string;
  publishableKey: string;
  onComplete: () => void;
  onError: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let checkout: EmbeddedCheckout | undefined;
    void (async () => {
      await loadStripe();
      if (cancelled || !window.Stripe) return;
      checkout = await window
        .Stripe(publishableKey)
        .initEmbeddedCheckout({ clientSecret, onComplete });
      if (cancelled) checkout.destroy();
      else if (container.current) checkout.mount(container.current);
    })().catch(() => {
      if (!cancelled) onError();
    });
    return () => {
      cancelled = true;
      checkout?.destroy();
    };
  }, [clientSecret, publishableKey, onComplete, onError]);
  return <div ref={container} className="mt-4 min-h-64" />;
}
const COPY = {
  en: {
    bankInstructions: "View Stripe bank transfer instructions",
    open: "Complete your donation securely below.",
    pending:
      "Your payment is pending. No donation has been confirmed yet. Bank transfers and SEPA payments can take several business days.",
    succeeded: "Thank you. Stripe has confirmed your payment.",
    failed:
      "Your payment failed or needs attention. Check the payment form or manage your monthly donation.",
    cancelled:
      "This checkout or recurring donation has been cancelled. Earlier successful payments are unaffected.",
    error:
      "We could not verify your payment status. Please try again. Do not submit another donation until you have checked this payment.",
    refresh: "Check payment status",
    cancel: "Cancel checkout",
    back: "Back to donation form",
    manage: "Manage or cancel monthly donation",
    cancelling: "Cancellation is scheduled for the end of the current billing period.",
    receipt:
      "Stripe payment receipts are not official German donation certificates. If requested, iThemba Kuluntu e.V. will review your details and issue the certificate separately.",
    monthly: "Monthly payments continue until cancelled. Manage them securely through Stripe.",
  },
  de: {
    bankInstructions: "Stripe-Überweisungsanweisungen anzeigen",
    open: "Schließe deine Spende unten sicher ab.",
    pending:
      "Deine Zahlung ist noch ausstehend. Es wurde noch keine Spende bestätigt. Überweisungen und SEPA-Zahlungen können mehrere Werktage dauern.",
    succeeded: "Danke. Stripe hat deine Zahlung bestätigt.",
    failed:
      "Deine Zahlung ist fehlgeschlagen oder erfordert eine Aktion. Prüfe das Zahlungsformular oder verwalte deine monatliche Spende.",
    cancelled:
      "Dieser Zahlungsvorgang oder diese Dauerspende wurde storniert. Frühere erfolgreiche Zahlungen bleiben unberührt.",
    error:
      "Wir konnten den Zahlungsstatus nicht prüfen. Bitte versuche es erneut. Bitte spende nicht erneut, bevor du diese Zahlung geprüft hast.",
    refresh: "Zahlungsstatus prüfen",
    cancel: "Zahlungsvorgang abbrechen",
    back: "Zurück zum Spendenformular",
    manage: "Monatliche Spende verwalten oder kündigen",
    cancelling: "Die Kündigung ist zum Ende des aktuellen Abrechnungszeitraums vorgemerkt.",
    receipt:
      "Stripe-Zahlungsbelege sind keine offiziellen deutschen Zuwendungsbestätigungen. Auf Wunsch prüft iThemba Kuluntu e.V. deine Angaben und stellt die Bestätigung separat aus.",
    monthly:
      "Monatliche Zahlungen laufen bis zur Kündigung weiter. Du kannst sie sicher über Stripe verwalten.",
  },
  nl: {
    bankInstructions: "Stripe-instructies voor bankoverschrijving bekijken",
    open: "Rond je donatie hieronder veilig af.",
    pending:
      "Je betaling is nog in behandeling. Er is nog geen donatie bevestigd. Bankoverschrijvingen en SEPA-betalingen kunnen meerdere werkdagen duren.",
    succeeded: "Dank je wel. Stripe heeft je betaling bevestigd.",
    failed:
      "Je betaling is mislukt of vereist actie. Controleer het betaalformulier of beheer je maandelijkse donatie.",
    cancelled:
      "Deze betaling of terugkerende donatie is geannuleerd. Eerdere geslaagde betalingen blijven ongewijzigd.",
    error:
      "We konden je betaalstatus niet controleren. Probeer het opnieuw. Dien geen nieuwe donatie in voordat je deze betaling hebt gecontroleerd.",
    refresh: "Betaalstatus controleren",
    cancel: "Betaling annuleren",
    back: "Terug naar het donatieformulier",
    manage: "Maandelijkse donatie beheren of stopzetten",
    cancelling: "De opzegging is gepland voor het einde van de huidige factureringsperiode.",
    receipt:
      "Stripe-betaalbewijzen zijn geen officiële Duitse donatiecertificaten. Op verzoek controleert iThemba Kuluntu e.V. je gegevens en verstrekt het certificaat afzonderlijk.",
    monthly: "Maandelijkse betalingen lopen door tot je opzegt. Beheer ze veilig via Stripe.",
  },
} as const;
interface StatusResult {
  status: DonationStatus;
  bankInstructionsUrl?: string;
  clientSecret?: string;
  canManage?: boolean;
  cancelAtPeriodEnd?: boolean;
  frequency?: string;
}
export function StripeDonationCheckout({
  id,
  clientSecret,
  publishableKey,
  lang,
  onReset,
}: {
  id: string;
  clientSecret?: string;
  publishableKey: string;
  lang: "en" | "de" | "nl";
  onReset: () => void;
}) {
  const c = COPY[lang];
  const [result, setResult] = useState<StatusResult | null>(null);
  const [secret, setSecret] = useState(clientSecret);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const mounted = useRef(true);
  const refreshing = useRef(false);
  const refresh = useCallback(async () => {
    if (refreshing.current) return;
    refreshing.current = true;
    try {
      const res = await fetch(`/api/donations/status?id=${encodeURIComponent(id)}`, {
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Status unavailable");
      const value: StatusResult = await res.json();
      if (mounted.current) {
        setResult(value);
        setSecret(value.clientSecret);
        setError(false);
      }
    } catch {
      if (mounted.current) setError(true);
    } finally {
      refreshing.current = false;
    }
  }, [id]);
  useEffect(() => {
    mounted.current = true;
    void refresh();
    return () => {
      mounted.current = false;
    };
  }, [refresh]);
  useEffect(() => {
    if (result?.status !== "pending" && result?.status !== "open") return;
    // Bounded polling, then let donors manually check asynchronous payments later.
    let checks = 0;
    const timer = window.setInterval(() => {
      if (++checks <= 30 && document.visibilityState === "visible") void refresh();
      else if (checks > 30) window.clearInterval(timer);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [result?.status, refresh]);
  const onComplete = useCallback(() => {
    setSecret(undefined);
    void refresh();
  }, [refresh]);
  const onError = useCallback(() => setScriptError(true), []);
  async function action(route: "cancel" | "portal") {
    setBusy(true);
    try {
      const res = await fetch(`/api/donations/${route}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Action unavailable");
      const value = await res.json();
      if (route === "portal") window.location.assign(value.url);
      else {
        setSecret(undefined);
        await refresh();
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  const status = result?.status;
  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-[var(--ithemba-blue)]/15 md:p-6">
      <p role="status" aria-live="polite" className="font-semibold text-[var(--ithemba-blue-dark)]">
        {status ? c[status] : c.refresh}
      </p>
      {(error || scriptError) && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {c.error}
        </p>
      )}
      {secret && !scriptError && (status === "open" || status === "failed" || !status) && (
        <EmbeddedPayment
          clientSecret={secret}
          publishableKey={publishableKey}
          onComplete={onComplete}
          onError={onError}
        />
      )}
      {result?.bankInstructionsUrl && status === "pending" && (
        <a
          href={result.bankInstructionsUrl}
          className="mt-3 block text-sm underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {c.bankInstructions}
        </a>
      )}
      {result?.cancelAtPeriodEnd && <p className="mt-3 text-sm">{c.cancelling}</p>}
      {result?.frequency === "monthly" && <p className="mt-3 text-sm">{c.monthly}</p>}
      <p className="mt-4 text-xs text-muted-foreground">{c.receipt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => {
            setScriptError(false);
            void refresh();
          }}
        >
          {c.refresh}
        </Button>
        {result?.canManage && (
          <Button disabled={busy} onClick={() => void action("portal")}>
            {c.manage}
          </Button>
        )}
        {(status === "open" || (status === "failed" && secret)) && (
          <Button variant="outline" disabled={busy} onClick={() => void action("cancel")}>
            {c.cancel}
          </Button>
        )}
        {(status === "succeeded" || status === "cancelled") && (
          <Button variant="outline" onClick={onReset}>
            {c.back}
          </Button>
        )}
      </div>
    </div>
  );
}
