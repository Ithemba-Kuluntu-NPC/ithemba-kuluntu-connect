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
import { SmartImage } from "@/components/site/Asset";
import { assets } from "@/data/assets";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t: tr, lang } = useLang();
  return (
    <>
      <Hero />

      <ImpactCounters
        items={impactCounters}
        title={lang === "en" ? "Our impact, in numbers" : "Unsere Wirkung in Zahlen"}
      />

      {/* Who we are — editorial split with layered photos */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 blob bg-[var(--ithemba-yellow)]/15" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 lg:px-8">
          <div className="relative">
            <PhotoPlaceholder
              label="women-led iThemba team — community photo"
              className="aspect-[4/5]"
              tone="warm"
            />
            {/* overlapping smaller photo */}
            <div className="absolute -bottom-8 -right-6 hidden w-44 sm:block">
              <PhotoPlaceholder
                label="children of Pondoland"
                className="aspect-square"
                tone="sun"
                rounded="rounded-[40%_60%_55%_45%/55%_45%_60%_40%]"
              />
            </div>
            {/* yellow blob accent */}
            <div className="absolute -left-6 -top-6 h-20 w-20 blob bg-[var(--ithemba-yellow)] shadow-lg" aria-hidden />
          </div>

          <div className="relative">
            <div className="hand-eyebrow-lg">{lang === "en" ? "Who" : "Wer"}</div>
            <h2 className="-mt-2 font-display text-5xl font-bold text-[var(--ithemba-blue-dark)] md:text-6xl">
              {lang === "en" ? "we are" : "wir sind"}
            </h2>
            <div className="mt-4 h-1.5 w-32 rounded-full bg-[var(--ithemba-yellow)]" />
            <p className="mt-6 text-lg leading-relaxed text-foreground/85">{tr(t.home.whoWeAreText)}</p>
            <p className="mt-4 leading-relaxed text-foreground/75">{tr(t.home.whoWeAreSupport)}</p>
            <Link to="/about">
              <Button className="mt-7 rounded-full bg-[var(--ithemba-blue)] px-6 hover:bg-[var(--ithemba-blue-dark)]">
                {tr(t.cta.learnMore)}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Belief / Mission / Serve — overlapping cards on a photo strip */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <PhotoPlaceholder
            label="Pondoland landscape and community"
            className="h-full w-full"
            rounded="rounded-none"
            tone="earth"
            showLabel={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--ithemba-blue-deepest)]/80 via-[var(--ithemba-blue-dark)]/65 to-[var(--ithemba-blue-deepest)]/85" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center text-white">
            <div className="hand-eyebrow !text-[var(--ithemba-yellow)]">{lang === "en" ? "What guides us" : "Was uns leitet"}</div>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">
              {lang === "en" ? "A women-led story of practical hope" : "Eine von Frauen geführte Geschichte praktischer Hoffnung"}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                eyebrow: lang === "en" ? "What we" : "Woran wir",
                title: tr(t.belief.title).split(" ").slice(-1)[0],
                text: tr(t.belief.text),
                accent: "var(--ithemba-yellow)",
                bubble: assets.photos.home.beliefBubble1,
                bubbleLabel: "Belief — community moment",
                tone: "warm" as const,
                bubbleShape: "rounded-[55%_45%_55%_45%/55%_45%_55%_45%]",
              },
              {
                eyebrow: lang === "en" ? "Our" : "Unsere",
                title: tr(t.mission.title).split(" ").slice(-1)[0],
                text: tr(t.mission.text),
                accent: "var(--ithemba-teal)",
                bubble: assets.photos.home.beliefBubble2,
                bubbleLabel: "Mission — practical work",
                tone: "ocean" as const,
                bubbleShape: "rounded-[60%_40%_50%_50%/45%_55%_45%_55%]",
              },
              {
                eyebrow: lang === "en" ? "Who we" : "Für wen wir",
                title: tr(t.serve.title).split(" ").slice(-1)[0],
                text: tr(t.serve.text),
                accent: "var(--ithemba-orange)",
                bubble: assets.photos.home.beliefBubble3,
                bubbleLabel: "Who we serve — family",
                tone: "sun" as const,
                bubbleShape: "rounded-[45%_55%_60%_40%/55%_45%_60%_40%]",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="group relative overflow-visible rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1"
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-25 blur-2xl transition group-hover:opacity-50"
                  style={{ background: c.accent }}
                />
                {/* organic bubble photo — small, supportive, never crowding the text */}
                <div className="pointer-events-none absolute -top-8 right-4 hidden h-20 w-20 md:block lg:h-24 lg:w-24">
                  <SmartImage
                    src={c.bubble}
                    label={c.bubbleLabel}
                    tone={c.tone}
                    rounded={c.bubbleShape}
                    className="h-full w-full shadow-lg ring-4 ring-white"
                    showMissingBadge={false}
                  />
                </div>
                <div className="hand-eyebrow" style={{ color: c.accent }}>{c.eyebrow}</div>
                <div className="-mt-2 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)]">
                  {c.title.toLowerCase()}
                </div>
                <div className="mt-3 h-1 w-12 rounded-full" style={{ background: c.accent }} />
                <p className="mt-5 leading-relaxed text-foreground/80">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FocusAreas />

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="hand-eyebrow-lg">{lang === "en" ? "Our" : "Unsere"}</div>
            <h2 className="-mt-2 font-display text-5xl font-bold text-[var(--ithemba-blue-dark)]">{tr(t.home.ourProjects)}</h2>
            <p className="mt-3 max-w-md text-foreground/70">
              {lang === "en"
                ? "Six interconnected programmes that strengthen rural families every day."
                : "Sechs miteinander verbundene Programme, die ländliche Familien jeden Tag stärken."}
            </p>
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
      <section className="bg-[var(--ithemba-cream)] py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="hand-eyebrow">{lang === "en" ? "Partner" : "Partner"}</div>
            <h2 className="-mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">{tr(t.home.partnersTitle)}</h2>
          </div>
          <div className="mt-10"><PartnerGrid /></div>
          <div className="mt-10 text-center">
            <Link to="/partners">
              <Button size="lg" className="rounded-full bg-[var(--ithemba-blue)] hover:bg-[var(--ithemba-blue-dark)]">{tr(t.cta.partnerWithUs)}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Donation block — photo background + clean form card */}
      <section id="donate" className="relative isolate overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 -z-10">
          <PhotoPlaceholder
            label="children and community — donation hero"
            className="h-full w-full"
            rounded="rounded-none"
            tone="sun"
            showLabel={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/80 to-[var(--ithemba-blue-dark)]/30" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-[1.05fr_1fr] lg:px-8">
          <div className="text-white">
            <div className="hand-eyebrow-lg">{lang === "en" ? "Give monthly" : "Monatlich geben"}</div>
            <h2 className="-mt-2 font-display text-4xl font-extrabold leading-tight md:text-6xl">
              {tr(t.home.monthlyTitle)}
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/90">{tr(t.home.monthlyText)}</p>
            <ul className="mt-7 space-y-3">
              {(lang === "en"
                ? ["Sustains safe water in households, schools and ECDs", "Keeps community kitchens and feeding moving", "Funds care for vulnerable children and animals", "Builds long-term, locally led delivery"]
                : ["Sichert sauberes Wasser in Haushalten, Schulen und ECDs", "Hält Gemeinschaftsküchen und Verpflegung am Laufen", "Finanziert Versorgung für gefährdete Kinder und Tiere", "Baut langfristige, lokal geführte Hilfe auf"]
              ).map((line) => (
                <li key={line} className="flex items-start gap-3 text-white/90">
                  <Heart className="mt-1 h-4 w-4 shrink-0 fill-[var(--ithemba-yellow)] text-[var(--ithemba-yellow)]" />
                  <span>{line}</span>
                </li>
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
