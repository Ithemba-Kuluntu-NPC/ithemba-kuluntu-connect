import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Landmark, Heart, ShieldCheck, Repeat, FileText, Sprout } from "lucide-react";
import { Placeholder } from "@/components/site/MissingInfo";
import { useLang } from "@/components/site/LanguageProvider";

const AMOUNTS = [10, 25, 50, 100, 250];
const PROJECTS = [
  { en: "Where needed most", de: "Wo am dringendsten benötigt" },
  { en: "Education", de: "Bildung" },
  { en: "Safe Water", de: "Sauberes Wasser" },
  { en: "Food Security", de: "Ernährungssicherheit" },
  { en: "Animal Welfare", de: "Tierwohl" },
  { en: "Disaster Relief", de: "Katastrophenhilfe" },
];

export function DonationWidget({ defaultProject }: { defaultProject?: string } = {}) {
  const { lang } = useLang();
  const [frequency, setFrequency] = useState<"monthly" | "once">("monthly");
  const [amount, setAmount] = useState<number | "custom">(25);
  const [customAmount, setCustomAmount] = useState("");
  const [project, setProject] = useState(defaultProject ?? PROJECTS[0].en);
  const [method, setMethod] = useState<"card" | "paypal" | "bank">("card");
  const [submitted, setSubmitted] = useState(false);

  const lbl = (en: string, de: string) => (lang === "en" ? en : de);

  if (submitted) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-[var(--ithemba-blue)]/20">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ithemba-yellow)]">
          <Heart className="h-8 w-8 fill-current text-[var(--ithemba-brown)]" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-[var(--ithemba-blue-dark)]">
          {lbl("Thank you for choosing to support Pondoland.", "Vielen Dank für Ihre Unterstützung von Pondoland.")}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {lbl(
            "This is a prototype confirmation. In the live version you will be taken to a secure payment provider.",
            "Dies ist eine Prototyp-Bestätigung. In der Live-Version werden Sie zu einem sicheren Zahlungsanbieter weitergeleitet."
          )}
        </p>
        <div className="mt-4 inline-block">
          <Placeholder text="monthly donation payment provider" />
        </div>
        <Button className="mt-4" variant="outline" onClick={() => setSubmitted(false)}>
          {lbl("Back to donation form", "Zurück zum Spendenformular")}
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-[var(--ithemba-blue)]/15 md:p-8">
      {/* Frequency toggle */}
      <div className="grid grid-cols-2 rounded-full bg-muted p-1">
        <button
          type="button"
          onClick={() => setFrequency("monthly")}
          className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
            frequency === "monthly" ? "bg-[var(--ithemba-blue)] text-white shadow" : "text-foreground"
          }`}
        >
          <Repeat className="h-4 w-4" /> {lbl("Monthly", "Monatlich")}
        </button>
        <button
          type="button"
          onClick={() => setFrequency("once")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            frequency === "once" ? "bg-[var(--ithemba-blue)] text-white shadow" : "text-foreground"
          }`}
        >
          {lbl("One-time", "Einmalig")}
        </button>
      </div>

      {/* Amounts */}
      <div className="mt-6">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {lbl("Choose an amount", "Betrag wählen")}
        </Label>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
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
            onClick={() => setAmount("custom")}
            className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
              amount === "custom"
                ? "border-[var(--ithemba-blue)] bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]"
                : "border-border hover:border-[var(--ithemba-blue)]/40"
            }`}
          >
            {lbl("Custom", "Eigen")}
          </button>
        </div>
        {amount === "custom" && (
          <Input
            type="number"
            min={1}
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder={lbl("Enter amount (€)", "Betrag eingeben (€)")}
            className="mt-2"
          />
        )}
        <Placeholder text="final donation currency and amounts" kind="verify" />
      </div>

      {/* Project */}
      <div className="mt-6">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {lbl("Direct your gift", "Spende zuordnen")}
        </Label>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <button
              key={p.en}
              type="button"
              onClick={() => setProject(p.en)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                project === p.en
                  ? "border-[var(--ithemba-blue)] bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]"
                  : "border-border hover:border-[var(--ithemba-blue)]/40"
              }`}
            >
              <Sprout className="h-3 w-3" /> {lbl(p.en, p.de)}
            </button>
          ))}
        </div>
      </div>

      {/* Donor */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div>
          <Label htmlFor="d-name">{lbl("Name", "Name")}</Label>
          <Input id="d-name" required />
        </div>
        <div>
          <Label htmlFor="d-email">Email</Label>
          <Input id="d-email" type="email" required />
        </div>
        <div>
          <Label htmlFor="d-country">{lbl("Country", "Land")}</Label>
          <Input id="d-country" />
        </div>
      </div>

      {/* Method */}
      <div className="mt-6">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {lbl("Payment method", "Zahlungsmethode")}
        </Label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {([
            ["card", "Card", "Karte", CreditCard],
            ["paypal", "PayPal", "PayPal", Heart],
            ["bank", "Bank Transfer", "Überweisung", Landmark],
          ] as const).map(([k, en, de, Icon]) => (
            <button
              key={k}
              type="button"
              onClick={() => setMethod(k)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                method === k
                  ? "border-[var(--ithemba-blue)] bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]"
                  : "border-border hover:border-[var(--ithemba-blue)]/40"
              }`}
            >
              <Icon className="h-4 w-4" /> {lbl(en, de)}
            </button>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          <Placeholder text={`${frequency === "monthly" ? "monthly" : "one-time"} donation payment provider`} />
          {method === "bank" && <Placeholder text="bank transfer details (IBAN, BIC, account, reference)" />}
          <Placeholder text="donation receipt process" />
        </div>
      </div>

      <Button
        type="button"
        onClick={() => setSubmitted(true)}
        size="lg"
        className="mt-6 w-full rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-bold text-base shadow-lg"
      >
        <Heart className="mr-2 h-5 w-5 fill-current" />
        {frequency === "monthly"
          ? lbl(`Donate €${amount === "custom" ? customAmount || "—" : amount} monthly`, `Monatlich €${amount === "custom" ? customAmount || "—" : amount} spenden`)
          : lbl(`Donate €${amount === "custom" ? customAmount || "—" : amount}`, `€${amount === "custom" ? customAmount || "—" : amount} spenden`)}
      </Button>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5 text-xs text-muted-foreground md:grid-cols-4">
        <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[var(--ithemba-blue)]" /> {lbl("Secure donation", "Sichere Spende")}</div>
        <div className="flex items-center gap-1.5"><Repeat className="h-4 w-4 text-[var(--ithemba-blue)]" /> {lbl("Monthly giving", "Monatliches Geben")}</div>
        <div className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-[var(--ithemba-blue)]" /> {lbl("Transparent reporting", "Transparente Berichte")}</div>
        <div className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-[var(--ithemba-blue)]" /> {lbl("Community-rooted impact", "Verwurzelt in der Gemeinschaft")}</div>
      </div>
    </div>
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
