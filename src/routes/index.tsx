import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/blocks/Hero";
import { ImpactCounters } from "@/components/blocks/ImpactCounters";
import { FocusAreas } from "@/components/blocks/FocusAreas";
import { ProjectCard } from "@/components/blocks/ProjectCard";
import { PartnerGrid } from "@/components/blocks/PartnerGrid";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { NewsletterSignup } from "@/components/blocks/NewsletterSignup";
import { PhotoPlaceholder } from "@/components/blocks/PhotoPlaceholder";
import { projects, impactCounters } from "@/data/projects";
import { t } from "@/data/content";
import { useLang } from "@/components/site/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t: tr, lang } = useLang();
  return (
    <>
      <Hero />

      <ImpactCounters items={impactCounters} title={lang === "en" ? "Our impact, in numbers" : "Unsere Wirkung in Zahlen"} />

      {/* Who we are */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 lg:px-8">
        <PhotoPlaceholder label="Women-led iThemba Kuluntu team — community photo" className="aspect-[4/5]" gradient="from-[var(--ithemba-blue-dark)] to-[var(--ithemba-blue)]" />
        <div className="relative">
          <div className="absolute -inset-6 -z-10 blob-2 bg-[var(--ithemba-cream)]" />
          <div className="p-2 md:p-6">
            <div className="font-hand text-3xl text-[var(--ithemba-yellow)]">{lang === "en" ? "Who" : "Wer"}</div>
            <h2 className="font-display text-4xl font-bold text-[var(--ithemba-blue-dark)]">{lang === "en" ? "we are" : "wir sind"}</h2>
            <div className="mt-3 h-1.5 w-32 rounded-full bg-[var(--ithemba-yellow)]" />
            <p className="mt-5 text-lg text-foreground/85">{tr(t.home.whoWeAreText)}</p>
            <p className="mt-3 text-foreground/75">{tr(t.home.whoWeAreSupport)}</p>
            <Link to="/about">
              <Button className="mt-6 rounded-full bg-[var(--ithemba-blue)] hover:bg-[var(--ithemba-blue-dark)]">{tr(t.cta.learnMore)}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Belief / Mission / Serve */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { eyebrow: lang === "en" ? "What we" : "Woran wir", title: tr(t.belief.title).split(" ").slice(-1)[0], text: tr(t.belief.text), bg: "var(--ithemba-cream)", accent: "var(--ithemba-blue)" },
            { eyebrow: lang === "en" ? "Our" : "Unsere", title: tr(t.mission.title).split(" ").slice(-1)[0], text: tr(t.mission.text), bg: "var(--ithemba-yellow)", accent: "var(--ithemba-brown)" },
            { eyebrow: lang === "en" ? "Who we" : "Für wen wir", title: tr(t.serve.title).split(" ").slice(-1)[0], text: tr(t.serve.text), bg: "var(--ithemba-teal)", accent: "white" },
          ].map((c, i) => (
            <div key={i} className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-sm" style={{ background: c.bg, color: c.accent }}>
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20" />
              <div className="font-hand text-2xl opacity-80">{c.eyebrow}</div>
              <div className="font-display text-3xl font-bold">{c.title.toLowerCase()}</div>
              <p className="mt-3 text-sm opacity-95">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <FocusAreas />

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <div className="font-hand text-2xl text-[var(--ithemba-yellow)]">{lang === "en" ? "Our" : "Unsere"}</div>
            <h2 className="font-display text-4xl font-bold text-[var(--ithemba-blue-dark)]">{tr(t.home.ourProjects)}</h2>
          </div>
          <Link to="/projects">
            <Button variant="outline" className="rounded-full">{lang === "en" ? "All projects" : "Alle Projekte"}</Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>

      {/* Partners preview */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">{tr(t.home.partnersTitle)}</h2>
          </div>
          <div className="mt-10"><PartnerGrid /></div>
          <div className="mt-8 text-center">
            <Link to="/partners">
              <Button size="lg" className="rounded-full bg-[var(--ithemba-blue)] hover:bg-[var(--ithemba-blue-dark)]">{tr(t.cta.partnerWithUs)}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Donation block */}
      <section id="donate" className="relative overflow-hidden bg-[var(--ithemba-cream)] py-16">
        <div className="absolute -right-20 top-10 h-72 w-72 blob bg-[var(--ithemba-yellow)]/40" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:px-8">
          <div className="relative">
            <div className="font-hand text-3xl text-[var(--ithemba-yellow)]">{lang === "en" ? "Give monthly" : "Monatlich geben"}</div>
            <h2 className="mt-1 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">{tr(t.home.monthlyTitle)}</h2>
            <p className="mt-4 text-lg text-foreground/85">{tr(t.home.monthlyText)}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {(lang === "en"
                ? ["Sustains safe water in households, schools and ECDs", "Keeps community kitchens and feeding moving", "Funds care for vulnerable children and animals", "Builds long-term, locally led delivery"]
                : ["Sichert sauberes Wasser in Haushalten, Schulen und ECDs", "Hält Gemeinschaftsküchen und Verpflegung am Laufen", "Finanziert Versorgung für gefährdete Kinder und Tiere", "Baut langfristige, lokal geführte Hilfe auf"]
              ).map((line) => (
                <li key={line} className="flex items-start gap-2"><Heart className="mt-1 h-4 w-4 shrink-0 fill-[var(--ithemba-yellow)] text-[var(--ithemba-yellow)]" /> {line}</li>
              ))}
            </ul>
          </div>
          <DonationWidget />
        </div>
      </section>

      <NewsletterSignup />
    </>
  );
}
