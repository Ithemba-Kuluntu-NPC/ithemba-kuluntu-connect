import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/components/site/LanguageProvider";

export function NewsletterSignup() {
  const { lang } = useLang();
  const lbl = (en: string, de: string, nl: string) =>
    lang === "en" ? en : lang === "de" ? de : nl;
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
                "Ontvang updates uit Pondoland, projectverhalen, impactrapportages en praktische manieren om maandelijks te steunen."
              )}
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              required
              placeholder={lbl("Your email", "Ihre E-Mail", "Uw e-mail")}
              aria-label={lbl("Email address", "E-Mail-Adresse", "E-mailadres")}
              className="h-11 min-w-0 bg-white text-foreground"
            />
            <Button type="submit" className="h-11 shrink-0 rounded-full bg-[var(--ithemba-yellow)] px-6 font-semibold text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90">
              {lbl("Subscribe", "Abonnieren", "Abonneren")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
