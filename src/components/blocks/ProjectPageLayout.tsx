import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

import { PhotoPlaceholder } from "@/components/blocks/PhotoPlaceholder";
import { DonationWidget, ProjectDonationNotes } from "@/components/blocks/DonationWidget";
import { Placeholder } from "@/components/site/MissingInfo";
import { useLang } from "@/components/site/LanguageProvider";
import type { Project } from "@/data/projects";
import { ImpactCounters } from "./ImpactCounters";
import { SmartImage, SmartLogo } from "@/components/site/Asset";
import { assets, projectHeroPhoto } from "@/data/assets";

const projectLogo: Record<string, string | undefined> = {
  ecd: assets.logos.no1Ecd,
  pureflow: assets.logos.pureflowAmanzi,
  "pondo-dogs": assets.logos.pondoDogs,
};

const toneMap: Record<string, "warm" | "blue" | "earth" | "sun" | "ocean" | "green"> = {
  ecd: "sun",
  pureflow: "ocean",
  greenhouse: "green",
  "food-security": "warm",
  "pondo-dogs": "earth",
  "disaster-relief": "blue",
};

export function ProjectPageLayout({
  project,
  why,
  what,
  who,
  counters,
  extraMissing = [],
  eyebrow,
}: {
  project: Project;
  why: { en: string; de: string };
  what: { title: { en: string; de: string }; items: { en: string; de: string }[] };
  who: { en: string; de: string };
  counters?: { value: number; suffix: string; label: { en: string; de: string } }[];
  extraMissing?: string[];
  eyebrow?: string;
}) {
  const { lang, t } = useLang();
  const lbl = (en: string, de: string) => (lang === "en" ? en : de);
  const Icon = (Icons as any)[project.icon] as LucideIcon;
  const tone = toneMap[project.slug] ?? "warm";
  const hero = projectHeroPhoto[project.slug];
  const logoSrc = projectLogo[project.slug];

  return (
    <>
      {/* Hero — photo background with overlay */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <SmartImage
            src={hero}
            label={`${t(project.title)} hero`}
            className="h-full w-full"
            rounded="rounded-none"
            tone={tone}
            showMissingBadge={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{ background: `linear-gradient(135deg, ${project.accent}66, transparent 60%)` }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28 lg:px-8">
          <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-white/85 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {lbl("All projects", "Alle Projekte")}
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-2 ring-white/30" style={{ background: project.accent }}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div className="hand-eyebrow-lg" style={{ color: "var(--ithemba-yellow)" }}>
                {eyebrow ?? lbl("Project", "Projekt")}
              </div>
            </div>

            <h1
              className="mt-3 font-display text-5xl font-extrabold leading-[1.02] text-white md:text-6xl"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}
            >
              {t(project.title)}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">{t(project.description)}</p>

            {logoSrc && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-sm ring-1 ring-black/10">
                <SmartLogo
                  src={logoSrc}
                  alt={`${t(project.title)} logo`}
                  className="h-7 w-auto max-w-[8rem] object-contain"
                  showMissingBadge={false}
                  fallback={<span className="sr-only">{t(project.title)}</span>}
                />
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/donate">
                <Button size="lg" className="rounded-full bg-[var(--ithemba-yellow)] font-semibold text-[var(--ithemba-brown)] shadow-lg hover:bg-[var(--ithemba-yellow)]/95">
                  <Heart className="mr-2 h-4 w-4 fill-current" /> {lbl("Donate Monthly to Support This Project", "Monatlich für dieses Projekt spenden")}
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  {lbl("Give Once", "Einmalig spenden")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <svg className="block w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
        </svg>
      </section>

      {/* Why — editorial split */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 lg:px-8">
        <div className="relative">
          <SmartImage
            src={hero}
            label={`${t(project.title)} — why it matters`}
            className="aspect-[4/5] w-full"
            tone={tone}
            showMissingBadge={false}
          />
          <div
            className="absolute -bottom-6 -right-6 hidden h-28 w-28 items-center justify-center rounded-full text-white shadow-xl md:flex"
            style={{ background: project.accent }}
          >
            <Icon className="h-10 w-10" />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="hand-eyebrow-lg" style={{ color: project.accent }}>
            {lbl("Why", "Warum")}
          </div>
          <h2 className="-mt-2 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">
            {lbl("it matters", "es zählt")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">{t(why)}</p>
        </div>
      </section>

      {/* What we do */}
      <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
        <div className="pointer-events-none absolute -top-10 right-0 h-40 w-40 blob bg-[var(--ithemba-yellow)]/30" />
        <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
          <div className="hand-eyebrow-lg">{lbl("What we", "Was wir")}</div>
          <h2 className="-mt-2 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">
            {t(what.title)}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {what.items.map((it) => (
              <div
                key={it.en}
                className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
              >
                <div className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: project.accent }} />
                <div className="text-sm font-medium leading-relaxed">{t(it)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it helps */}
      <section className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
        <div className="hand-eyebrow-lg">{lbl("Who", "Wem")}</div>
        <h2 className="-mt-2 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">
          {lbl("it helps", "es hilft")}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-foreground/85">{t(who)}</p>
      </section>

      {/* Impact */}
      {counters && counters.length > 0 && (
        <ImpactCounters items={counters} title={lbl("Project impact", "Projektwirkung")} />
      )}

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="hand-eyebrow">{lbl("Stories", "Geschichten")}</div>
        <h2 className="-mt-2 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
          {lbl("Gallery", "Galerie")}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PhotoPlaceholder
              key={i}
              label={`${t(project.title)} — photo ${i}`}
              className="aspect-square"
              tone={tone}
            />
          ))}
        </div>
        <div className="mt-4 space-y-1">
          <Placeholder text={`final ${project.slug} project photos`} />
          {extraMissing.map((m) => <Placeholder key={m} text={m} />)}
        </div>
      </section>

      {/* Donation — photo-led */}
      <section className="relative isolate overflow-hidden py-20">
        <div className="absolute inset-0 -z-10">
          <SmartImage
            src={hero}
            label={`${t(project.title)} — donate`}
            className="h-full w-full"
            rounded="rounded-none"
            tone={tone}
            showMissingBadge={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--ithemba-blue-deepest)]/90 via-[var(--ithemba-blue-dark)]/75 to-[var(--ithemba-blue-dark)]/40" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:px-8">
          <div className="text-white">
            <div className="hand-eyebrow-lg">{lbl("Give monthly", "Monatlich geben")}</div>
            <h2 className="-mt-2 font-display text-4xl font-extrabold md:text-5xl">
              {lbl(`Support ${t(project.title)}`, `${t(project.title)} unterstützen`)}
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/90">
              {lbl("Your monthly gift sustains practical, locally-led delivery.", "Ihre monatliche Spende sichert praktische, lokal geführte Hilfe.")}
            </p>
            <div className="mt-6">
              <ProjectDonationNotes />
            </div>
          </div>
          <DonationWidget />
        </div>
      </section>
    </>
  );
}
