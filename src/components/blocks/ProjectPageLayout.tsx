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

  return (
    <>
      <section
        className="relative overflow-hidden py-14 md:py-20"
        style={{ background: project.bg }}
      >
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full" style={{ background: `${project.accent}30` }} />
        <div className="absolute -bottom-24 -right-12 h-72 w-72 blob-2" style={{ background: `${project.accent}25` }} />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {lbl("All projects", "Alle Projekte")}
          </Link>
          <div className="mt-4 grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full shadow" style={{ background: project.accent }}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="font-hand text-3xl" style={{ color: project.accent }}>{eyebrow ?? lbl("Project", "Projekt")}</div>
              </div>
              <h1 className="mt-3 font-display text-5xl font-bold leading-tight md:text-6xl" style={{ color: project.accent }}>
                {t(project.title)}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-foreground/80">{t(project.description)}</p>
              <Placeholder text={`final ${project.slug} logo file`} />
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/donate">
                  <Button size="lg" className="rounded-full font-semibold" style={{ background: project.accent }}>
                    <Heart className="mr-2 h-4 w-4 fill-current" /> {lbl("Donate Monthly to Support This Project", "Monatlich für dieses Projekt spenden")}
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button size="lg" variant="outline" className="rounded-full">{lbl("Give Once", "Einmalig spenden")}</Button>
                </Link>
              </div>
            </div>
            <PhotoPlaceholder
              label={`${t(project.title)} — hero photo`}
              className="aspect-[4/3]"
              gradient={`from-[${project.accent}] to-[var(--ithemba-blue)]`}
            />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <div className="font-hand text-2xl" style={{ color: project.accent }}>{lbl("Why this matters", "Warum es zählt")}</div>
        <h2 className="font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
          {lbl("Why it matters", "Warum es zählt")}
        </h2>
        <p className="mt-4 text-lg text-foreground/85">{t(why)}</p>
      </section>

      {/* What we do */}
      <section className="bg-[var(--ithemba-cream)] py-14">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">{t(what.title)}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {what.items.map((it) => (
              <div key={it.en} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: project.accent }} />
                <div className="text-sm font-medium">{t(it)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it helps */}
      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-[var(--ithemba-blue-dark)]">{lbl("Who it helps", "Wem es hilft")}</h2>
        <p className="mt-4 text-foreground/85">{t(who)}</p>
      </section>

      {/* Impact */}
      {counters && counters.length > 0 && (
        <ImpactCounters items={counters} title={lbl("Project impact", "Projektwirkung")} />
      )}

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-[var(--ithemba-blue-dark)]">{lbl("Gallery", "Galerie")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PhotoPlaceholder
              key={i}
              label={`${t(project.title)} — photo ${i}`}
              className="aspect-square"
              gradient={`from-[${project.accent}] to-[var(--ithemba-blue)]`}
            />
          ))}
        </div>
        <div className="mt-4 space-y-1">
          <Placeholder text={`final ${project.slug} project photos`} />
          {extraMissing.map((m) => <Placeholder key={m} text={m} />)}
        </div>
      </section>

      {/* Donation */}
      <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
              {lbl(`Support ${t(project.title)}`, `${t(project.title)} unterstützen`)}
            </h2>
            <p className="mt-3 text-lg text-foreground/85">
              {lbl("Your monthly gift sustains practical, locally-led delivery.", "Ihre monatliche Spende sichert praktische, lokal geführte Hilfe.")}
            </p>
            <div className="mt-5">
              <ProjectDonationNotes />
            </div>
          </div>
          <DonationWidget />
        </div>
      </section>
    </>
  );
}
