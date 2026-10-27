import { useEffect, useRef, useState } from "react";
import type { DonationInput } from "@/lib/donations";
import { Button } from "@/components/ui/button";

type Options = Record<string, string>;
type DonateSDK = {
  Donation: {
    Button: (options: Record<string, unknown>) => { render: (target: string) => void };
  };
};
let sdkPromise: Promise<DonateSDK> | undefined;
function loadSDK(): Promise<DonateSDK> {
  if (!sdkPromise)
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";
      script.charset = "UTF-8";
      script.onload = () => {
        const sdk = (window as Window & { PayPal?: DonateSDK }).PayPal;
        if (sdk?.Donation?.Button) resolve(sdk);
        else {
          sdkPromise = undefined;
          script.remove();
          reject(new Error("PayPal unavailable"));
        }
      };
      script.onerror = () => {
        script.remove();
        sdkPromise = undefined;
        reject(new Error("PayPal unavailable"));
      };
      document.head.appendChild(script);
    });
  return sdkPromise;
}

export function PayPalDonation({ input }: { input: Omit<DonationInput, "requestId"> }) {
  const { lang } = input;
  const t = (en: string, de: string, nl: string) => ({ en, de, nl })[lang];
  const [mode, setMode] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<{ id: string; options: Options } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState("pending");
  const [paidAmount, setPaidAmount] = useState<number>();
  const container = useRef<HTMLDivElement>(null);
  const inputKey = JSON.stringify(input);
  const latestKey = useRef(inputKey);
  latestKey.current = inputKey;
  useEffect(() => {
    let active = true;
    void fetch("/api/paypal/config", { credentials: "same-origin" })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (active) setMode(data.mode);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    setAttempt(null);
    setError(false);
    setStatus("pending");
    setPaidAmount(undefined);
  }, [inputKey]);
  useEffect(() => {
    if (!attempt || !container.current) return;
    let active = true;
    const target = container.current;
    target.replaceChildren();
    target.id = `paypal-donate-${attempt.id}`;
    void loadSDK()
      .then((sdk) => {
        if (!active) return;
        sdk.Donation.Button({
          ...attempt.options,
          image: {
            src: `https://www.paypalobjects.com/${lang === "de" ? "de_DE/DE" : lang === "nl" ? "nl_NL/NL" : "en_US"}/i/btn/btn_donateCC_LG.gif`,
            alt: t("Donate with PayPal", "Mit PayPal spenden", "Doneren met PayPal"),
            title: "PayPal",
          },
          onComplete: () => {
            /* Browser data is deliberately ignored. Only verified IPN updates status. */
          },
        }).render(`#${target.id}`);
      })
      .catch(() => {
        if (active) setError(true);
      });
    const deadline = Date.now() + 10 * 60 * 1000;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const res = await fetch(`/api/paypal/status?id=${attempt!.id}`, {
          credentials: "same-origin",
        });
        if (res.ok) {
          const result = await res.json();
          if (!active) return;
          setStatus(result.status);
          setPaidAmount(result.amount);
        }
      } catch {
        /* Keep pending when confirmation is unavailable. */
      }
      if (active && Date.now() < deadline) timer = setTimeout(poll, 5000);
    }
    timer = setTimeout(poll, 5000);
    return () => {
      active = false;
      clearTimeout(timer);
      target.replaceChildren();
    };
  }, [attempt, lang]);
  if (!mode) return null;
  async function prepare(event: React.MouseEvent<HTMLButtonElement>) {
    if (!event.currentTarget.form?.reportValidity() || busy) return;
    const key = inputKey;
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/paypal/create", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, requestId: crypto.randomUUID() }),
      });
      if (!res.ok) throw new Error("PayPal unavailable");
      const result = await res.json();
      if (latestKey.current === key) setAttempt(result);
    } catch {
      if (latestKey.current === key) setError(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mt-5 space-y-3 rounded-2xl border border-border p-4">
      <p className="text-sm font-semibold">
        {t(
          "Or donate directly with PayPal",
          "Oder direkt mit PayPal spenden",
          "Of doneer rechtstreeks met PayPal",
        )}
      </p>
      {mode === "sandbox" && (
        <p className="text-xs font-semibold">
          {t(
            "PayPal sandbox — no real payments",
            "PayPal-Sandbox — keine echten Zahlungen",
            "PayPal-sandbox — geen echte betalingen",
          )}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        {t(
          "PayPal pays iThemba Kuluntu e.V. directly. Confirm your amount and choose one-time or monthly giving in PayPal (where available). Your amount and frequency above are not automatically applied. Your selected purpose is included.",
          "PayPal zahlt direkt an iThemba Kuluntu e.V. Bestätige den Betrag und wähle einmalig oder monatlich bei PayPal (sofern verfügbar). Betrag und Rhythmus von oben werden nicht automatisch übernommen. Dein Spendenzweck wird mitgegeben.",
          "PayPal betaalt rechtstreeks aan iThemba Kuluntu e.V. Bevestig je bedrag en kies eenmalig of maandelijks in PayPal (waar beschikbaar). Het bedrag en de frequentie hierboven worden niet automatisch overgenomen. Je gekozen doel wordt meegestuurd.",
        )}
      </p>
      <p className="text-xs text-muted-foreground">
        {t(
          "PayPal collects your payment details separately. Manage monthly PayPal donations in your PayPal account. For a German donation certificate, contact info@ithembakuluntu.org with your PayPal transaction ID and full postal address; PayPal receipts are not tax certificates.",
          "PayPal erfasst deine Zahlungsdaten separat. Monatliche PayPal-Spenden verwaltest du in deinem PayPal-Konto. Für eine Zuwendungsbestätigung sende deine PayPal-Transaktionsnummer und vollständige Postanschrift an info@ithembakuluntu.org; PayPal-Belege sind keine Zuwendungsbestätigungen.",
          "PayPal verzamelt je betaalgegevens apart. Beheer maandelijkse PayPal-donaties in je PayPal-account. Voor een Duits donatiecertificaat stuur je je PayPal-transactienummer en volledige postadres naar info@ithembakuluntu.org; PayPal-betaalbewijzen zijn geen fiscale certificaten.",
        )}
      </p>
      {!attempt && (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full"
          disabled={busy}
          onClick={prepare}
        >
          {busy
            ? t("Loading…", "Wird geladen…", "Laden…")
            : t("Continue with PayPal", "Weiter mit PayPal", "Verder met PayPal")}
        </Button>
      )}
      {attempt && (
        <>
          <div
            ref={container}
            hidden={status !== "pending"}
            className="min-h-12 max-w-full overflow-hidden [&_img]:max-w-full"
          />
          <p role="status" className="text-xs">
            {status === "succeeded"
              ? t(
                  `PayPal confirmed receipt of €${((paidAmount ?? 0) / 100).toFixed(2)}. Thank you!`,
                  `PayPal hat den Eingang von €${((paidAmount ?? 0) / 100).toFixed(2)} bestätigt. Vielen Dank!`,
                  `PayPal heeft de ontvangst van €${((paidAmount ?? 0) / 100).toFixed(2)} bevestigd. Bedankt!`,
                )
              : status === "review"
                ? t(
                    "This payment needs reconciliation. Please contact iThemba Kuluntu.",
                    "Diese Zahlung muss abgeglichen werden. Bitte kontaktiere iThemba Kuluntu.",
                    "Deze betaling moet worden gecontroleerd. Neem contact op met iThemba Kuluntu.",
                  )
                : t(
                    "Waiting for PayPal confirmation. Closing the popup does not confirm a payment. If you already paid, do not pay again; check your PayPal activity or contact us.",
                    "Warte auf PayPal-Bestätigung. Das Schließen des Fensters bestätigt keine Zahlung. Wenn du bereits gezahlt hast, zahle nicht erneut; prüfe deine PayPal-Aktivitäten oder kontaktiere uns.",
                    "Wachten op PayPal-bevestiging. Het sluiten van het venster bevestigt geen betaling. Heb je al betaald, betaal dan niet opnieuw; controleer je PayPal-activiteit of neem contact op.",
                  )}
          </p>
        </>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {t(
            "PayPal could not be loaded. Check your details and try again later.",
            "PayPal konnte nicht geladen werden. Prüfe deine Angaben und versuche es später erneut.",
            "PayPal kon niet worden geladen. Controleer je gegevens en probeer het later opnieuw.",
          )}
        </p>
      )}
    </div>
  );
}
