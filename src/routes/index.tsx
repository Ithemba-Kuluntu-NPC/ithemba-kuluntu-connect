import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/blocks/Hero";
import { ImpactCounters } from "@/components/blocks/ImpactCounters";
import { FocusAreas } from "@/components/blocks/FocusAreas";
import { ProjectCard } from "@/components/blocks/ProjectCard";
import { PartnerCarousel } from "@/components/blocks/PartnerCarousel";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { NewsletterSignup } from "@/components/blocks/NewsletterSignup";
import { projects, impactCounters } from "@/data/projects";
import { t } from "@/data/content";
import { useLang } from "@/components/site/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { SmartImage } from "@/components/site/Asset";
import { assets } from "@/data/assets";

export const Route = createFileRoute("/")({ component: Home });

function pick<T>(lang: string, en: T, de: T, nl: T): T {
  return lang === "en" ? en : lang === "de" ? de : nl;
}

function Home() {
  const { t: tr, lang } = useLang();
  const impactTitle = pick(
    lang,
    "Our impact, in numbers",
    "Unsere Wirkung in Zahlen",
    "Onze impact in cijfers",
  );
  return (
    <>
      <Hero />

      <ImpactCounters items={impactCounters} title={impactTitle} />

      {/* Who we are — editorial split with layered photos */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 blob bg-[var(--ithemba-yellow)]/15" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 lg:px-8">
          <div className="relative">
            <SmartImage
              src={assets.photos.home.aboutTeam}
              label="women-led iThemba team — community photo"
              className="aspect-[4/5] w-full"
              tone="warm"
              showMissingBadge={false}
            />
            <div className="absolute -left-6 -top-6 h-20 w-20 blob bg-[var(--ithemba-yellow)] shadow-lg" aria-hidden />
            {/* subtle handwritten heart accent */}
            <svg
              className="pointer-events-none absolute -right-3 -bottom-3 h-14 w-14 text-[var(--ithemba-yellow)] opacity-80 drop-shadow-md"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden
            >
              <path d="M23 5c-3 0-5.5 2-7 4.5C14.5 7 12 5 9 5 5 5 2 8 2 12c0 7 9 13 14 16 5-3 14-9 14-16 0-4-3-7-7-7z" />
            </svg>
          </div>

          <div className="relative">
            <div className="hand-eyebrow-lg">{pick(lang, "Who", "Wer", "Wie")}</div>
            <h2 className="-mt-2 font-display text-5xl font-bold text-[var(--ithemba-blue-dark)] md:text-6xl">
              {pick(lang, "we are", "wir sind", "wij zijn")}
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
          <SmartImage
            src={assets.photos.about.hero}
            label="Pondoland landscape and community"
            className="h-full w-full"
            rounded="rounded-none"
            tone="earth"
            showMissingBadge={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--ithemba-blue-deepest)]/85 via-[var(--ithemba-blue-dark)]/72 to-[var(--ithemba-blue-deepest)]/88" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center text-white">
            <div className="hand-eyebrow !text-[var(--ithemba-yellow)]">
              {pick(lang, "What guides us", "Was uns leitet", "Wat ons leidt")}
            </div>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">
              {pick(
                lang,
                "A women-led story of practical hope",
                "Eine von Frauen geführte Geschichte praktischer Hoffnung",
                "Een door vrouwen geleid verhaal van praktische hoop",
              )}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                eyebrow: pick(lang, "What we", "Woran", "Waarin"),
                title: pick(lang, "believe", "wir glauben", "wij geloven"),
                text: tr(t.belief.text),
                accent: "var(--ithemba-yellow)",
              },
              {
                eyebrow: pick(lang, "Our", "Unsere", "Onze"),
                title: pick(lang, "mission", "Aufgabe", "opdracht"),
                text: tr(t.mission.text),
                accent: "var(--ithemba-teal)",
              },
              {
                eyebrow: pick(lang, "Who we", "Wem", "Voor wie"),
                title: pick(lang, "serve", "wir dienen", "wij er zijn"),
                text: tr(t.serve.text),
                accent: "var(--ithemba-orange)",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1"
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-25 blur-2xl transition group-hover:opacity-50"
                  style={{ background: c.accent }}
                />
                <div className="hand-eyebrow" style={{ color: c.accent }}>{c.eyebrow}</div>
                <div className="-mt-2 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)]">
                  {c.title}
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
            <div className="hand-eyebrow-lg">{pick(lang, "Our", "Unsere", "Onze")}</div>
            <h2 className="-mt-2 font-display text-5xl font-bold text-[var(--ithemba-blue-dark)]">
              {pick(lang, "projects", "Projekte", "Projecten")}
            </h2>
            <p className="mt-3 max-w-md text-foreground/70">
              {pick(
                lang,
                "Our programmes are connected by one goal: stronger, safer and more dignified daily life for rural families.",
                "Die Projekte in Südafrika verfolgen ein gemeinsames Ziel: ein sichereres, stärkeres und würdevolleres Leben für ländliche Familien im Alltag.",
                "De projecten in Zuid-Afrika hebben één gezamenlijk doel: een veiliger, sterker en waardiger dagelijks leven voor landelijke gezinnen.",
              )}
            </p>
          </div>
          <Link to="/projects">
            <Button variant="outline" className="rounded-full">
              {pick(lang, "All projects", "Alle Projekte", "Alle projecten")}
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>

      {/* Partners preview — softly textured warm band, distinct from focus areas */}
      <section className="relative isolate overflow-hidden py-24">
        {/* Layered warm background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #fbf6ec 0%, #f6efe0 55%, #fbf6ec 100%)",
          }}
        />
        {/* Subtle photo wash */}
        <div className="absolute inset-0 -z-10 opacity-[0.10] mix-blend-multiply">
          <SmartImage
            src={assets.photos.partners.hero}
            label="Partners hero wash"
            className="h-full w-full"
            rounded="rounded-none"
            tone="warm"
            showMissingBadge={false}
          />
        </div>
        {/* Soft decorative blobs */}
        <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 blob bg-[var(--ithemba-yellow)]/20" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 blob bg-[var(--ithemba-teal)]/10" />

        {/* Top wave divider for elegant transition from projects section */}
        <svg
          className="pointer-events-none absolute -top-px left-0 w-full text-white"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,30 C240,60 480,0 720,20 C960,40 1200,60 1440,30 L1440,0 L0,0 Z"
            fill="currentColor"
          />
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="hand-eyebrow">{pick(lang, "Partner", "Partner", "Partner")}</div>
            <h2 className="-mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">{tr(t.home.partnersTitle)}</h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--ithemba-yellow)]" />
          </div>
          <div className="mt-10"><PartnerCarousel /></div>
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
          <SmartImage
            src={assets.photos.home.donation}
            label="Donation background — community moment"
            tone="sun"
            rounded="rounded-none"
            className="h-full w-full"
            showMissingBadge={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue-dark)]/45" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-[1.05fr_1fr] lg:px-8">
          <div className="text-white">
            <div className="hand-eyebrow-lg">
              {pick(lang, "Give monthly", "Monatlich geben", "Maandelijks geven")}
            </div>
            <h2 className="-mt-2 font-display text-4xl font-extrabold leading-tight md:text-6xl">
              {tr(t.home.monthlyTitle)}
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/90">{tr(t.home.monthlyText)}</p>
            <ul className="mt-7 space-y-3">
              {pick(
                lang,
                [
                  "Keeps the No.1 ECD Centre free for children and families",
                  "Helps households access safer water through PureFlow Amanzi",
                  "Supports food, care and emergency response where families need it most",
                  "Funds sterilisation, food and medical care for vulnerable dogs and other animals",
                  "Helps keep local people employed in care, cooking, teaching, delivery and community support roles",
                  "Builds long-term, locally led delivery in rural communities",
                ],
                [
                  "Hält das No.1 ECD Centre für Kinder und Familien kostenfrei zugänglich",
                  "Hilft Haushalten durch PureFlow Amanzi, sichereres Wasser zu nutzen",
                  "Unterstützt Ernährung, Fürsorge und Nothilfe dort, wo Familien sie am dringendsten brauchen",
                  "Finanziert Sterilisationen, Futter und medizinische Versorgung für gefährdete Hunde und andere Tiere",
                  "Hilft, lokale Arbeitsplätze in Betreuung, Küche, Bildung, Verteilung und Gemeindearbeit zu sichern",
                  "Stärkt langfristige, lokal getragene Arbeit in ländlichen Gemeinschaften in Südafrika",
                ],
                [
                  "Houdt het No.1 ECD Centre kosteloos toegankelijk voor kinderen en gezinnen",
                  "Helpt huishoudens via PureFlow Amanzi veiliger water te gebruiken",
                  "Ondersteunt voeding, zorg en noodhulp waar gezinnen dit het hardst nodig hebben",
                  "Financiert sterilisaties, voeding en medische zorg voor kwetsbare honden en andere dieren",
                  "Helpt lokale banen in zorg, keuken, onderwijs, distributie en gemeenschapswerk te behouden",
                  "Versterkt langdurig, lokaal gedragen werk in landelijke gemeenschappen in Zuid-Afrika",
                ],
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
