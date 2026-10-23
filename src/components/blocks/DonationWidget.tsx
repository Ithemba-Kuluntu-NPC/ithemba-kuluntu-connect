import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ShieldCheck, Repeat, FileText, Sprout } from "lucide-react";
import { Placeholder } from "@/components/site/MissingInfo";
import { useLang } from "@/components/site/LanguageProvider";
import { StripeDonationCheckout } from "./StripeDonationCheckout";

const AMOUNTS = [10, 25, 50, 100, 250];
const PROJECTS = [
  {
    en: "Where needed most",
    de: "Wo am dringendsten benötigt",
    nl: "Waar het het hardst nodig is",
  },
  { en: "Education", de: "Bildung", nl: "Onderwijs" },
  { en: "Safe Water", de: "Sauberes Wasser", nl: "Veilig water" },
  { en: "Food Security", de: "Ernährungssicherheit", nl: "Voedselzekerheid" },
  { en: "Animal Welfare", de: "Tierwohl", nl: "Dierenwelzijn" },
  { en: "Disaster Relief", de: "Katastrophenhilfe", nl: "Noodhulp" },
];

export function DonationWidget({ defaultProject }: { defaultProject?: string } = {}) {
  const { lang } = useLang();
  const [frequency, setFrequency] = useState<"monthly" | "once">("monthly");
  const [amount, setAmount] = useState<number | "custom">(25);
  const [customAmount, setCustomAmount] = useState("");
  const [project, setProject] = useState(defaultProject ?? PROJECTS[0].en);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [receiptRequested, setReceiptRequested] = useState(false);
  const [configuration, setConfiguration] = useState<{
    publishableKey: string;
    portalLoginUrl?: string;
    mode: string;
  } | null>(null);
  const [configurationUnavailable, setConfigurationUnavailable] = useState(false);
  const [checkout, setCheckout] = useState<{ id: string; clientSecret?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const lbl = (en: string, de: string, nl: string) => ({ en, de, nl })[lang];
  useEffect(() => {
    let active = true;
    void fetch("/api/donations/config", { credentials: "same-origin" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Donations unavailable");
        const config = await res.json();
        if (!active) return;
        setConfiguration(config);
        const id = new URLSearchParams(window.location.search).get("donation");
        if (id && /^[0-9a-f-]{36}$/i.test(id)) setCheckout({ id });
      })
      .catch(() => {
        if (active) setConfigurationUnavailable(true);
      });
    return () => {
      active = false;
    };
  }, []);

  async function startDonation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !configuration) return;
    const text = amount === "custom" ? customAmount.replace(",", ".") : String(amount);
    if (!/^\d+(\.\d{1,2})?$/.test(text)) {
      setError(true);
      return;
    }
    const cents = Math.round(Number(text) * 100);
    if (cents < 100 || cents > 1000000) {
      setError(true);
      return;
    }
    const id = requestId ?? crypto.randomUUID();
    setRequestId(id);
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/donations/create", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: id,
          amount: cents,
          frequency,
          cause: project,
          lang,
          name,
          email,
          country: country.toUpperCase(),
          receiptRequested,
        }),
      });
      if (!res.ok) {
        const failure = await res.json();
        if (failure.error === "expired_attempt") setRequestId(null);
        throw new Error("Donations unavailable");
      }
      const result = await res.json();
      setCheckout({ id: result.id, clientSecret: result.clientSecret });
      // Save only a random reference in the URL; never donor data or a Stripe client secret.
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}?donation=${result.id}`,
      );
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  const reset = () => {
    setCheckout(null);
    setRequestId(null);
    window.history.replaceState(window.history.state, "", window.location.pathname);
  };
  if (checkout && configuration)
    return (
      <StripeDonationCheckout
        {...checkout}
        publishableKey={configuration.publishableKey}
        lang={lang}
        onReset={reset}
      />
    );

  return (
    <form
      onSubmit={startDonation}
      onChange={() => setRequestId(null)}
      className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-[var(--ithemba-blue)]/15 md:p-6"
    >
      <fieldset disabled={busy} className="min-w-0">
        {/* Frequency toggle */}
        <div className="grid grid-cols-2 rounded-full bg-muted p-1">
          <button
            type="button"
            onClick={() => {
              setRequestId(null);
              setFrequency("monthly");
            }}
            className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
              frequency === "monthly"
                ? "bg-[var(--ithemba-blue)] text-white shadow"
                : "text-foreground"
            }`}
          >
            <Repeat className="h-4 w-4" /> {lbl("Monthly", "Monatlich", "Maandelijks")}
          </button>
          <button
            type="button"
            onClick={() => {
              setRequestId(null);
              setFrequency("once");
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              frequency === "once"
                ? "bg-[var(--ithemba-blue)] text-white shadow"
                : "text-foreground"
            }`}
          >
            {lbl("One-time", "Einmalig", "Eenmalig")}
          </button>
        </div>

        {/* Amounts */}
        <div className="mt-6">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {lbl("Choose an amount", "Betrag wählen", "Kies een bedrag")}
          </Label>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setRequestId(null);
                  setAmount(a);
                }}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  amount === a
                    ? "border-[var(--ithemba-blue)] bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]"
                    : "border-border hover:border-[var(--ithemba-blue)]/40"
                }`}
              >
                €{a}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setRequestId(null);
                setAmount("custom");
              }}
              className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                amount === "custom"
                  ? "border-[var(--ithemba-blue)] bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]"
                  : "border-border hover:border-[var(--ithemba-blue)]/40"
              }`}
            >
              {lbl("Custom", "Eigen", "Anders")}
            </button>
          </div>
          {amount === "custom" && (
            <Input
              type="number"
              min={1}
              max={10000}
              step="0.01"
              required
              aria-label={lbl(
                "Custom amount in EUR",
                "Eigener Betrag in EUR",
                "Ander bedrag in EUR",
              )}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={lbl("Enter amount (€)", "Betrag eingeben (€)", "Bedrag invoeren (€)")}
              className="mt-2"
            />
          )}
          <p className="mt-2 text-xs text-muted-foreground">EUR · €1–€10,000</p>
        </div>

        {/* Project */}
        <div className="mt-6">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {lbl("Direct your gift", "Spende zuordnen", "Kies een doel")}
          </Label>
          <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
            {PROJECTS.map((p) => (
              <button
                key={p.en}
                type="button"
                onClick={() => {
                  setRequestId(null);
                  setProject(p.en);
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  project === p.en
                    ? "border-[var(--ithemba-blue)] bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]"
                    : "border-border hover:border-[var(--ithemba-blue)]/40"
                }`}
              >
                <Sprout className="h-3 w-3" /> {lbl(p.en, p.de, p.nl)}
              </button>
            ))}
          </div>
        </div>

        {/* Donor */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div>
            <Label htmlFor="d-name">{lbl("Name", "Name", "Naam")}</Label>
            <Input
              id="d-name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={150}
              required
            />
          </div>
          <div>
            <Label htmlFor="d-email">Email</Label>
            <Input
              id="d-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
              required
            />
          </div>
          <div>
            <Label htmlFor="d-country">
              {lbl(
                "Country (e.g. DE, NL, ZA)",
                "Land (z. B. DE, NL, ZA)",
                "Land (bijv. DE, NL, ZA)",
              )}
            </Label>
            <Input
              id="d-country"
              autoComplete="country"
              value={country}
              onChange={(e) => setCountry(e.target.value.toUpperCase())}
              pattern="[A-Z]{2}"
              minLength={2}
              maxLength={2}
              required
            />
          </div>
        </div>

        <div className="mt-5 space-y-3 text-xs text-muted-foreground">
          <p>
            {lbl(
              "Payment methods available to you are shown securely by Stripe, including eligible cards, wallets and bank payments.",
              "Stripe zeigt dir die verfügbaren Zahlungsmethoden sicher an, einschließlich geeigneter Karten, Wallets und Bankzahlungen.",
              "Stripe toont veilig welke betaalmethoden voor jou beschikbaar zijn, waaronder geschikte kaarten, wallets en bankbetalingen.",
            )}
          </p>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={receiptRequested}
              onChange={(e) => setReceiptRequested(e.target.checked)}
            />
            <span>
              {lbl(
                "Request a German donation certificate from iThemba Kuluntu e.V. (full billing address required at checkout). Stripe receipts are payment confirmations, not tax certificates.",
                "Zuwendungsbestätigung von iThemba Kuluntu e.V. anfordern (vollständige Rechnungsadresse bei der Zahlung erforderlich). Stripe-Belege sind Zahlungsbestätigungen, keine Zuwendungsbestätigungen.",
                "Vraag een Duits donatiecertificaat aan bij iThemba Kuluntu e.V. (volledig factuuradres vereist bij de betaling). Stripe-betaalbewijzen zijn geen fiscale donatiecertificaten.",
              )}
            </span>
          </label>
          <p>
            {lbl(
              "Donations are received by iThemba Kuluntu e.V. Monthly donations continue until cancelled. You can manage or cancel them securely through Stripe.",
              "Spenden gehen an iThemba Kuluntu e.V. Monatliche Spenden laufen bis zur Kündigung weiter und können sicher über Stripe verwaltet oder gekündigt werden.",
              "Donaties worden ontvangen door iThemba Kuluntu e.V. Maandelijkse donaties lopen door tot je opzegt. Je kunt ze veilig via Stripe beheren of stopzetten.",
            )}
          </p>
          <a href="/donation-terms" className="underline">
            {lbl("Donation terms", "Spendenbedingungen", "Donatievoorwaarden")}
          </a>
          {configuration?.portalLoginUrl && (
            <a href={configuration.portalLoginUrl} className="block underline">
              {lbl(
                "Manage an existing monthly donation",
                "Bestehende monatliche Spende verwalten",
                "Bestaande maandelijkse donatie beheren",
              )}
            </a>
          )}
          {configuration?.mode === "test" && (
            <p className="font-semibold">
              {lbl(
                "Test mode — no real payments",
                "Testmodus — keine echten Zahlungen",
                "Testmodus — geen echte betalingen",
              )}
            </p>
          )}
        </div>
        {configurationUnavailable && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {lbl(
              "Online donations are currently unavailable. Please try again later or contact iThemba Kuluntu.",
              "Online-Spenden sind derzeit nicht verfügbar. Bitte versuche es später erneut oder kontaktiere iThemba Kuluntu.",
              "Online doneren is momenteel niet beschikbaar. Probeer het later opnieuw of neem contact op met iThemba Kuluntu.",
            )}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {lbl(
              "Unable to start checkout. Check your details (EUR 1–10,000) and try again. If unavailable, contact iThemba Kuluntu.",
              "Zahlung konnte nicht gestartet werden. Prüfe deine Angaben (EUR 1–10.000) und versuche es erneut. Bei Problemen kontaktiere iThemba Kuluntu.",
              "De betaling kon niet worden gestart. Controleer je gegevens (EUR 1–10.000) en probeer het opnieuw. Neem bij problemen contact op met iThemba Kuluntu.",
            )}
          </p>
        )}
        <Button
          type="submit"
          disabled={busy || !configuration}
          size="lg"
          className="mt-6 w-full rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-bold text-base shadow-lg"
        >
          <Heart className="mr-2 h-5 w-5 fill-current" />
          {busy
            ? lbl(
                "Loading secure checkout…",
                "Sichere Zahlung wird geladen…",
                "Veilige betaling wordt geladen…",
              )
            : frequency === "monthly"
              ? lbl(
                  `Donate €${amount === "custom" ? customAmount || "—" : amount} monthly`,
                  `Monatlich €${amount === "custom" ? customAmount || "—" : amount} spenden`,
                  `Doneer €${amount === "custom" ? customAmount || "—" : amount} per maand`,
                )
              : lbl(
                  `Donate €${amount === "custom" ? customAmount || "—" : amount}`,
                  `€${amount === "custom" ? customAmount || "—" : amount} spenden`,
                  `Doneer €${amount === "custom" ? customAmount || "—" : amount}`,
                )}
        </Button>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5 text-xs text-muted-foreground md:grid-cols-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[var(--ithemba-blue)]" />{" "}
            {lbl("Secure donation", "Sichere Spende", "Veilige donatie")}
          </div>
          <div className="flex items-center gap-1.5">
            <Repeat className="h-4 w-4 text-[var(--ithemba-blue)]" />{" "}
            {lbl("Monthly giving", "Monatliches Geben", "Maandelijks geven")}
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-[var(--ithemba-blue)]" />{" "}
            {lbl("Transparent reporting", "Transparente Berichte", "Transparante rapportage")}
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-[var(--ithemba-blue)]" />{" "}
            {lbl(
              "Community-rooted impact",
              "Verwurzelt in der Gemeinschaft",
              "Impact in de gemeenschap",
            )}
          </div>
        </div>
      </fieldset>
    </form>
  );
}

export function MiniDonate() {
  // not used; placeholder export
  return null;
}

export function ProjectDonationNotes() {
  return (
    <div className="space-y-1.5">
      <Placeholder text="project-specific donation reference" />
      <Placeholder text="project-specific payment connection" />
      <Placeholder text="whether restricted donations to this project are allowed" kind="verify" />
    </div>
  );
}

// shared placeholder for textareas (used elsewhere)
export const _Textarea = Textarea;
