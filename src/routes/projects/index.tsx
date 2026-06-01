import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ProjectCard } from "@/components/blocks/ProjectCard";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { projects } from "@/data/projects";
import { useLang } from "@/components/site/LanguageProvider";
import { SmartImage } from "@/components/site/Asset";
import type { Lang } from "@/data/content";

export const Route = createFileRoute("/projects/")({ component: ProjectsOverview });

type HeroCopy = { eyebrow: string; title: string; subtitle: string; donate: string };

const HERO: Record<Lang, HeroCopy> = {
  en: {
    eyebrow: "Our",
    title: "Projects",
    subtitle: "Choose a project. Support lasting community care.",
    donate: "Donate Monthly",
  },
  de: {
    eyebrow: "Unsere",
    title: "Projekte",
    subtitle: "Wählen Sie ein Projekt. Unterstützen Sie nachhaltige Gemeinschaftspflege.",
    donate: "Monatlich spenden",
  },
  nl: {
    eyebrow: "Onze",
    title: "Projecten",
    subtitle: "Kies een project. Steun duurzame gemeenschapszorg.",
    donate: "Maandelijks doneren",
  },
};

const HERO_VIDEO = "/assets/videos/projects/projects-hero.mp4";
const HERO_POSTER = "/assets/photos/projects/ecd-hero.jpg";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function ProjectsHero({ c }: { c: HeroCopy }) {
  const reduced = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const showVideo = !reduced && !videoFailed;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {showVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_POSTER}
            onError={() => setVideoFailed(true)}
            aria-hidden
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <SmartImage
            src={HERO_POSTER}
            label="iThemba Kuluntu projects — community hero"
            className="h-full w-full"
            rounded="rounded-none"
            tone="earth"
            showMissingBadge={false}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/85 via-[var(--ithemba-blue-dark)]/70 to-[var(--ithemba-blue)]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>

      {!showVideo && (
        <div className="pointer-events-none absolute right-4 top-4 z-10 hidden items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 ring-1 ring-white/15 backdrop-blur md:inline-flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ithemba-yellow)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ithemba-yellow)]" />
          </span>
          Hero video placeholder · ready for real project video
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 md:pb-28 md:pt-28 lg:min-h-[58vh] lg:px-8">
        <div className="relative max-w-3xl text-white">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm flex items-center gap-2">
            <Sparkles className="h-5 w-5" aria-hidden /> {c.eyebrow}
          </div>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            {c.title}
          </h1>
          <svg className="mt-4 block w-48 md:w-72" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
            <path d="M2,8 C50,2 120,14 198,6" stroke="var(--ithemba-yellow)" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/95 md:text-xl">{c.subtitle}</p>
        </div>
      </div>

      <svg className="block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--background)" />
      </svg>
    </section>
  );
}

function ProjectsOverview() {
  const { lang } = useLang();
  const c = HERO[lang] ?? HERO.en;
  return (
    <>
      <ProjectsHero c={c} />
      <section className="mx-auto max-w-7xl px-4 py-12 text-center lg:px-8">
        <Link to="/donate">
          <Button size="lg" className="rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold">
            <Heart className="mr-2 h-4 w-4 fill-current" /> {c.donate}
          </Button>
        </Link>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>
    </>
  );
}
