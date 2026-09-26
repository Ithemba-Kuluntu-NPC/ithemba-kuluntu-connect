import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/components/site/LanguageProvider";
import { useNewsletterForm } from "@/components/forms/useNewsletterForm";
import { Link } from "@tanstack/react-router";

export function NewsletterSignup() {
  const { lang } = useLang();
  const lbl = (en: string, de: string, nl: string) =>
    lang === "en" ? en : lang === "de" ? de : nl;
  const form = useNewsletterForm();
  const message =
    form.status === "success"
      ? lbl(
          "Thank you. Please check your inbox and confirm your subscription.",
          "Vielen Dank. Bitte prüfen Sie Ihren Posteingang und bestätigen Sie Ihr Abonnement.",
          "Dank u wel. Controleer uw inbox en bevestig uw inschrijving.",
        )
      : form.status === "validation"
        ? lbl(
            "Please enter a valid email address and accept the consent statement.",
            "Bitte geben Sie eine gültige E-Mail-Adresse ein und stimmen Sie der Einwilligungserklärung zu.",
            "Vul een geldig e-mailadres in en ga akkoord met de toestemmingsverklaring.",
          )
        : form.status === "error"
          ? lbl(
              "Something went wrong while sending your request. Please try again.",
              "Beim Senden Ihrer Anfrage ist etwas schiefgegangen. Bitte versuchen Sie es erneut.",
              "Er ging iets mis bij het verzenden van uw verzoek. Probeer het opnieuw.",
            )
          : "";
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-10 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--ithemba-blue)] px-6 py-7 text-white md:px-8 md:py-8 lg:px-10">
        <div className="absolute -right-10 -top-16 h-36 w-36 rounded-full bg-[var(--ithemba-yellow)]/20" />
        <div className="absolute -bottom-20 -left-10 h-40 w-40 blob-2 bg-[var(--ithemba-teal)]/20" />
        <div className="relative grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] md:gap-8">
          <div>
            <div className="font-hand text-xl text-[var(--ithemba-yellow)] md:text-2xl">
              {lbl("Stay close", "Bleiben Sie verbunden", "Blijf in contact")}
            </div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              {lbl("Follow the journey", "Begleiten Sie unseren Weg", "Volg de reis")}
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/85">
              {lbl(
                "Receive updates from Pondoland, project stories, impact reports and practical ways to support monthly.",
                "Erhalten Sie Updates aus Pondoland, Projektgeschichten, Wirkungsberichte und praktische Möglichkeiten zur monatlichen Unterstützung.",
                "Ontvang updates uit Pondoland, projectverhalen, impactrapportages en praktische manieren om maandelijks te steunen.",
              )}
            </p>
          </div>
          <form onSubmit={form.submit} className="flex min-w-0 flex-col gap-2">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={form.email}
                onChange={(event) => form.setEmail(event.target.value)}
                placeholder={lbl("Your email", "Ihre E-Mail", "Uw e-mail")}
                aria-label={lbl("Email address", "E-Mail-Adresse", "E-mailadres")}
                className="h-11 min-w-0 bg-white text-foreground"
              />
              <Button
                disabled={form.status === "submitting"}
                type="submit"
                className="h-11 shrink-0 rounded-full bg-[var(--ithemba-yellow)] px-6 font-semibold text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90"
              >
                {form.status === "submitting"
                  ? lbl("Sending…", "Wird gesendet…", "Wordt verzonden…")
                  : lbl("Subscribe", "Abonnieren", "Abonneren")}
              </Button>
            </div>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-white/85">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={(event) => form.setConsent(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--ithemba-yellow)]"
              />
              <span>
                {lbl(
                  "I would like to receive email updates from iThemba Kuluntu. I can unsubscribe at any time and my information will be handled in accordance with the ",
                  "Ich möchte E-Mail-Updates von iThemba Kuluntu erhalten. Ich kann mich jederzeit abmelden und meine Daten werden gemäß der ",
                  "Ik wil graag e-mailupdates van iThemba Kuluntu ontvangen. Ik kan mij op elk moment afmelden en mijn gegevens worden verwerkt volgens het ",
                )}
                <Link to="/datenschutz" className="underline underline-offset-2">
                  {lbl("Privacy Policy", "Datenschutzerklärung", "Privacybeleid")}
                </Link>
                .
              </span>
            </label>
            <p aria-live="polite" className="min-h-4 text-xs text-white/90">
              {message}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
