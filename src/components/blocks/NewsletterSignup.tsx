import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/components/site/LanguageProvider";
import { Placeholder } from "@/components/site/MissingInfo";

export function NewsletterSignup() {
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const lbl = (en: string, de: string, nl: string) =>
    lang === "en" ? en : lang === "de" ? de : nl;
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--ithemba-blue)] p-8 text-white md:p-12">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[var(--ithemba-yellow)]/20" />
        <div className="absolute -bottom-16 -left-10 h-56 w-56 blob-2 bg-[var(--ithemba-teal)]/20" />
        <div className="relative">
          <div className="font-hand text-2xl text-[var(--ithemba-yellow)]">
            {lbl("Stay close", "Bleiben Sie verbunden", "Blijf in contact")}
          </div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            {lbl("Follow the journey", "Begleiten Sie unseren Weg", "Volg de reis")}
          </h2>
          <p className="mt-2 max-w-xl text-white/85">
            {lbl(
              "Receive updates from Pondoland, project stories, impact reports and practical ways to support monthly.",
              "Erhalten Sie Updates aus Pondoland, Projektgeschichten, Wirkungsberichte und praktische Möglichkeiten zur monatlichen Unterstützung.",
              "Ontvang updates uit Pondoland, projectverhalen, impactrapportages en praktische manieren om maandelijks te steunen."
            )}
          </p>
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lbl("Your email", "Ihre E-Mail", "Uw e-mail")}
              className="bg-white text-foreground"
            />
            <Button type="submit" className="rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold">
              {done
                ? lbl("Subscribed ✓", "Abonniert ✓", "Geabonneerd ✓")
                : lbl("Subscribe", "Abonnieren", "Abonneren")}
            </Button>
          </form>
          <div className="mt-3 space-y-1">
            <Placeholder text="newsletter platform" />
            <Placeholder text="newsletter form endpoint" />
            <Placeholder text="newsletter consent wording" />
          </div>
        </div>
      </div>
    </section>
  );
}
