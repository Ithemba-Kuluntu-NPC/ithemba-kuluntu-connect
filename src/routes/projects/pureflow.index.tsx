// This is a compact comparison concept for PureFlow Amanzi built around the Transformation Pathway, focusing on women's livelihoods.
//
// Route: /projects/pureflow-amanzi-compact
// Content is dynamically loaded at runtime from:
//   - public/content/projects/pureflow-amanzi-en-v4.4.txt
//   - public/content/projects/pureflow-amanzi-de-v4.4.txt
//   - public/content/projects/pureflow-amanzi-nl-v4.4.txt
// Language is driven by the global LanguageProvider (EN / DE / NL).

import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Ear,
  Wrench,
  Truck,
  GraduationCap,
  HeartHandshake,
  Droplets,
  Users,
  Leaf,
  Home as HomeIcon,
  Briefcase,
  School,
  Presentation,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/site/LanguageProvider";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { partners as allPartners } from "@/data/projects";
import { cn } from "@/lib/utils";
import type { Lang } from "@/data/content";

// Lazy-loaded, client-only Leaflet map (Leaflet touches `window` at import).
const PureFlowEventMap = lazy(() => import("@/components/blocks/PureFlowEventMap"));

export const Route = createFileRoute("/projects/pureflow/")({
  component: PureFlowCompactPage,
  head: () => ({
    meta: [
      { title: "PureFlow Amanzi | iThemba Kuluntu" },
      { name: "description", content: "PureFlow Amanzi brings cleaner, safer water to rural households and learning sites through locally led delivery." },
      { property: "og:title", content: "PureFlow Amanzi | iThemba Kuluntu" },
      { property: "og:description", content: "Explore PureFlow Amanzi's locally led safe-water model, verified impact, field events, and community transformation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

// ----------------------- Content loading -----------------------

type Dict = Record<string, string>;

function parseContent(raw: string): Dict {
  const out: Dict = {};
  let lastKey: string | null = null;
  const keyLine = /^([a-zA-Z0-9_.]+)\s*:\s*(.*)$/;
  for (const lineRaw of raw.split(/\r?\n/)) {
    const trimmed = lineRaw.trim();
    if (trimmed.startsWith("#")) {
      lastKey = null;
      continue;
    }
    if (!trimmed) {
      if (lastKey) out[lastKey] += "\n\n";
      continue;
    }
    const m = trimmed.match(keyLine);
    if (m) {
      lastKey = m[1];
      out[lastKey] = m[2].trim();
    } else if (lastKey) {
      const cur = out[lastKey];
      out[lastKey] = cur.endsWith("\n\n") || cur === "" ? cur + trimmed : cur + " " + trimmed;
    }
  }
  for (const k of Object.keys(out)) out[k] = out[k].trim();
  return out;
}

function useProjectContent(lang: Lang) {
  const [dict, setDict] = useState<Dict>({});
  const [enFallback, setEnFallback] = useState<Dict>({});

  useEffect(() => {
    let cancelled = false;
    fetch(`/content/projects/pureflow-amanzi-en-v4.4.txt`)
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => !cancelled && setEnFallback(parseContent(t)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/content/projects/pureflow-amanzi-${lang}-v4.4.txt`)
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => !cancelled && setDict(parseContent(t)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return useMemo(() => {
    const t = (key: string, fb = ""): string =>
      dict[key] ?? enFallback[key] ?? fb;
    return { t };
  }, [dict, enFallback]);
}

// ----------------------- Tokens -----------------------

const BLUE = "#0F2A8C";
const BLUE_DEEP = "#081A60";
const YELLOW = "#FBBF24";
const CREAM = "#FBF6E9";
const CREAM_WARM = "#F5EDD7";
const SERIF = '"Fraunces", "Georgia", serif';
const SCRIPT = '"Caveat", "Kalam", cursive';

const ASSET_BASE = "/assets/icons/projects/pureflow";
const PHOTO_BASE = "/assets/photos/projects/pureflow";
const HERO_VIDEO = "/assets/videos/projects/pureflow/pureflow-hero-loop.mp4";
const HERO_POSTER = "/assets/photos/projects/pureflow/pureflow-hero-poster.jpg";

const FIELD_PHOTOS = {
  loop: [
    "pureflow-community-engagement-sibonda-outdoor-meeting-team-and-filter-01.jpg",
    "pureflow-handout-event-01-assembly-components-table-01.jpg",
    "pureflow-big-hand-out-event-giving-filters-to-people.jpg",
    "pureflow-rural-handout-wash-training-community-speaker-01.jpg",
    "pureflow-home-visit-household-monitoring-discussion-01.jpg",
  ],
  structural: {
    background: "pureflow-water-source-muddy-stream-woman-01.jpg",
    main: "pureflow-woman-carrying-water-bucket-on-head-01.jpg",
    carrying: "pureflow-water-source-muddy-stream-scooping-01.jpg",
    source: "pureflow-step-01-structural-problem-3.jpg",
    household: "pureflow-home-visit-boiling-water-open-fire-01.jpg",
  },
  climate: [
    "pureflow-young-woman-drinking-filtered-water-01.jpg",
    "pureflow-sdg-background.jpg",
    "pureflow-home-visit-family-filter-use-guidance-01.jpg",
    "pureflow-ecd-handout-event-smiling-mom-at-training-station.jpg",
  ],
  sdg: "pureflow-community-engagement-royal-house-large-community-meeting-01.jpg",
  donation: "pureflow-happy-dancing-recipients-of-filter-after-event.jpg",
  closing: [
    "pureflow-handout-event-01-community-group-with-filters-02.jpg",
    "pureflow-rural-handout-community-group-holding-filter-buckets-01.jpg",
    "pureflow-ecd-handout-event-group-photo.jpg",
    "pureflow-handout-event-bholani-group-photo-1.jpg",
  ],
} as const;

// ----------------------- Reusable building blocks -----------------------

function WaveDivider({
  from = "#FBF6E9",
  to = "#0F2A8C",
  flip = false,
}: {
  from?: string;
  to?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden
      className="relative -mb-px w-full overflow-hidden leading-[0]"
      style={{ background: from, transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 70"
        preserveAspectRatio="none"
        className="block h-[40px] w-full md:h-[60px]"
      >
        <path
          d="M0,35 C240,70 480,0 720,35 C960,70 1200,5 1440,40 L1440,70 L0,70 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}

function Script({ children, color = YELLOW, className = "" }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <p
      className={cn("text-2xl md:text-3xl leading-none", className)}
      style={{ fontFamily: SCRIPT, color }}
    >
      {children}
    </p>
  );
}

/** Circular illustration mask (used as small accents on the redesigned page). */
function CircleArt({
  src,
  alt,
  size = "md",
  className = "",
  ring = "rgba(251,191,36,0.7)",
  bg = "rgba(255,255,255,0.92)",
}: {
  src: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  ring?: string;
  bg?: string;
}) {
  const sizes = {
    xs: "h-28 w-28",
    sm: "h-36 w-36 md:h-40 md:w-40",
    md: "h-44 w-44 md:h-52 md:w-52",
    lg: "h-56 w-56 md:h-64 md:w-64",
  } as const;
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full p-2 shadow-2xl",
        sizes[size],
        className,
      )}
      style={{
        background: bg,
        boxShadow: `0 18px 45px -20px rgba(8,26,96,0.55), 0 0 0 4px ${ring}`,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full rounded-full object-contain p-1.5"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
        }}
      />
    </div>
  );
}

/** Photo-first frame with branded gradient fallback when the source asset is missing. */
function PhotoFrame({
  src,
  alt,
  className = "",
  rounded = "rounded-3xl",
  tone = "ocean",
  children,
  objectPosition,
}: {
  src?: string;
  alt: string;
  className?: string;
  rounded?: string;
  tone?: "ocean" | "earth" | "sun" | "warm" | "blue";
  children?: React.ReactNode;
  objectPosition?: string;
}) {
  const [errored, setErrored] = useState(!src);
  const tones: Record<string, string> = {
    ocean: "from-[#0B1F66] via-[#1E40C8] to-[#3F8CCF]",
    blue: "from-[#0B1F66] via-[#1E40C8] to-[#3F8CCF]",
    earth: "from-[#3F2A14] via-[#7A4A24] to-[#D9A86C]",
    sun: "from-[#7C3A12] via-[#E0902C] to-[#FBBF24]",
    warm: "from-[#7C3A12] via-[#C26A2A] to-[#F0B870]",
  };
  return (
    <div className={cn("relative isolate overflow-hidden shadow-xl ring-1 ring-black/10", rounded, className)}>
      {errored || !src ? (
        <div className={cn("absolute inset-0 bg-gradient-to-br", tones[tone])}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_25%_15%,rgba(255,240,200,0.45),transparent_55%),radial-gradient(120%_80%_at_85%_90%,rgba(0,0,0,0.45),transparent_55%)]" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1 backdrop-blur-sm">
            <PlayCircle className="h-3 w-3 shrink-0 text-white/90" />
            <span className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-white/90">
              Photo · {alt}
            </span>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={objectPosition ? { objectPosition } : undefined}
          onError={() => setErrored(true)}
        />
      )}
      {children}
    </div>
  );
}

// ----------------------- Hero (video background) -----------------------

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

function Hero({ t, goDonate }: { t: (k: string, fb?: string) => string; goDonate: (freq: "monthly" | "once") => void }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const reduced = useReducedMotion();
  const showVideo = !videoFailed && !reduced;

  return (
    <section className="relative isolate overflow-hidden" style={{ background: BLUE_DEEP }}>
      {/* Looping background video */}
      <div className="absolute inset-0 -z-10">
        {showVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_POSTER}
            onError={() => setVideoFailed(true)}
            aria-hidden="true"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <img
            src={HERO_POSTER}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#081A60]/[0.55] via-[#0F2A8C]/[0.40] to-[#0F2A8C]/[0.25] md:from-[#0F2A8C]/[0.38] md:via-[#0F2A8C]/[0.28] md:to-[#2B4FD0]/[0.18]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081A60]/[0.40] via-transparent to-transparent md:from-[#081A60]/[0.22]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(${YELLOW} 1.2px, transparent 1.2px)`,
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-8 text-white md:px-8 md:pb-20 md:pt-12">
        {/* PureFlow project logo — top right (consistent with other project pages) */}
        <img
          src="/assets/logos/pureflow-amanzi-logo.png"
          alt="PureFlow Amanzi logo"
          className="pointer-events-none absolute right-5 top-6 z-10 h-16 w-auto drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] md:right-8 md:top-10 md:h-24 lg:h-28"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {t("hero.back", "All projects")}
        </Link>


        <div className="mt-6">
          <div className="min-w-0">
            <Script>{t("hero.script_heading")}</Script>
            <h1
              className="mt-2 text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl"
              style={{ fontFamily: SERIF }}
            >
              {t("hero.main_heading")}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/90 md:text-xl" style={{ fontFamily: SERIF }}>
              {t("hero.sub_heading")}
            </p>
            <p className="mt-4 max-w-2xl text-sm text-white/80 md:text-base">
              {t("hero.text_long")}
            </p>
            <p className="mt-2 max-w-2xl text-xs text-white/65 md:text-sm">{t("hero.text_small_line")}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => goDonate("monthly")}
                className="rounded-full px-6 text-base font-semibold"
                style={{ background: YELLOW, color: BLUE_DEEP }}
              >
                <Heart className="mr-2 h-4 w-4 fill-current" />
                {t("hero.cta.monthly")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => goDonate("once")}
                className="rounded-full border-white/40 bg-white/5 px-6 text-base text-white hover:bg-white/10"
              >
                {t("hero.cta.once")}
              </Button>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85 ring-1 ring-white/15">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("hero.patent_trust_line")}
            </div>
          </div>
        </div>
      </div>
      <WaveDivider from="transparent" to={BLUE_DEEP} />
    </section>
  );
}

// ----------------------- Pathway Stepper (horizontal flow with images) -----------------------

const STEP_IDS = ["step-1", "step-2", "step-3", "step-4", "step-5", "step-6"] as const;
const PATHWAY_IMAGES = [
  "pureflow-problem.png",
  "pureflow-solution.png",
  "pureflow-school.png",
  "pureflow-jobs.png",
  "pureflow-community.png",
  "pureflow-village.png",
];

function scrollToStep(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function PathwayStepper({ t }: { t: (k: string, fb?: string) => string }) {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const steps = [1, 2, 3, 4, 5, 6].map((n) => ({
    num: t(`pathway.step${n}.num`, String(n).padStart(2, "0")),
    title: t(`pathway.step${n}.title`),
    desc: t(`pathway.step${n}.short_desc`),
    id: STEP_IDS[n - 1],
    img: `${ASSET_BASE}/${PATHWAY_IMAGES[n - 1]}`,
  }));

  const scroll = (dir: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section style={{ background: BLUE_DEEP }} className="relative text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="text-center">
          <Script color={YELLOW}>{t("pathway.script_heading")}</Script>
          <h2 className="mt-1 text-3xl font-bold text-white md:text-4xl" style={{ fontFamily: SERIF }}>
            {t("pathway.main_heading")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/80 md:text-base">
            {t("pathway.sub_heading")}
          </p>
        </div>

        {/* Desktop: horizontal 6-up flow with image bubbles + arrow connectors */}
        <ol className="relative mx-auto mt-10 hidden max-w-5xl grid-cols-11 items-stretch gap-0 md:grid">
          {steps.map((s, i) => (
            <Fragment key={s.id}>
              <li className="col-span-1 flex">
                <button
                  onClick={() => scrollToStep(s.id)}
                  className="group flex w-full flex-col items-center text-center transition hover:-translate-y-0.5"
                >
                  <div className="relative">
                    <div
                      className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 lg:h-36 lg:w-36"
                      style={{ boxShadow: `0 18px 40px -20px rgba(8,26,96,0.45), 0 0 0 3px rgba(251,191,36,0.55)` }}
                    >
                      <img
                        src={s.img}
                        alt={s.title}
                        loading="lazy"
                        className="h-full w-full rounded-full object-contain p-2"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
                      />
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold shadow ring-2 ring-[#081A60]"
                      style={{ background: YELLOW, color: BLUE_DEEP }}
                    >
                      {s.num}
                    </span>
                  </div>
                  <p
                    className="mt-3 text-[13px] font-semibold leading-tight lg:text-sm"
                    style={{ color: "#FFFFFF", fontFamily: SERIF }}
                  >
                    {s.title}
                  </p>
                  <p className="mt-1 line-clamp-3 text-[11px] leading-snug text-white/70 lg:text-xs">{s.desc}</p>
                </button>
              </li>
              {i < steps.length - 1 && (
                <li key={`arrow-${i}`} aria-hidden className="col-span-1 flex items-center justify-center pt-12">
                  <ArrowRight className="h-7 w-7" style={{ color: YELLOW }} strokeWidth={3} />
                </li>
              )}
            </Fragment>
          ))}
        </ol>

        {/* Mobile: horizontal swipe */}
        <div className="relative mt-8 md:hidden">
          <div
            ref={carouselRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ scrollbarWidth: "none" }}
          >
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToStep(s.id)}
                className="min-w-[72%] shrink-0 snap-center rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.img}
                    alt=""
                    aria-hidden
                    className="h-14 w-14 shrink-0 rounded-full object-contain p-1 ring-2"
                    style={{ background: CREAM, boxShadow: `0 0 0 3px ${YELLOW}` }}
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
                  />
                  <div className="min-w-0">
                    <span
                      className="inline-flex h-6 items-center rounded-full px-2 text-[10px] font-bold"
                      style={{ background: YELLOW, color: BLUE_DEEP }}
                    >
                      {s.num}
                    </span>
                    <p className="mt-1 text-sm font-semibold leading-tight" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                      {s.title}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-600">{s.desc}</p>
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button
              aria-label="Previous"
              onClick={() => scroll(-1)}
              className="rounded-full bg-white p-2 shadow ring-1 ring-black/5"
            >
              <ChevronLeft className="h-4 w-4" style={{ color: BLUE_DEEP }} />
            </button>
            <button
              aria-label="Next"
              onClick={() => scroll(1)}
              className="rounded-full bg-white p-2 shadow ring-1 ring-black/5"
            >
              <ChevronRight className="h-4 w-4" style={{ color: BLUE_DEEP }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------- Showcase + Animated Counters (blue background) -----------------------

function youtubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function parseCounter(v: string): { value: number; suffix: string } {
  const m = v.match(/^([\d,.]+)(.*)$/);
  if (!m) return { value: 0, suffix: v };
  const num = parseFloat(m[1].replace(/,/g, ""));
  return { value: isNaN(num) ? 0 : num, suffix: m[2] };
}

function AnimatedNumber({ value, suffix, locale }: { value: number; suffix: string; locale: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const dur = 1400;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(eased * value);
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  // Whole vs decimal? Keep integer rendering with locale grouping.
  const display = Math.floor(n).toLocaleString(locale);
  return (
    <span ref={ref} className="whitespace-nowrap tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

function Showcase({ t, lang }: { t: (k: string, fb?: string) => string; lang: Lang }) {
  const [playing, setPlaying] = useState(false);
  const videoUrl = t("showcase.video.url");
  const vid = youtubeId(videoUrl);
  const locale = lang === "de" ? "de-DE" : lang === "nl" ? "nl-NL" : "en-US";

  const counters = [
    { k: "households", iconSrc: "/assets/icons/projects/pureflow/pureflow-households-safe-water.png", v: t("impact.counters.households.value"), l: t("impact.counters.households.label") },
    { k: "people", iconSrc: "/assets/icons/projects/pureflow/pureflow-individuals-reached.png", v: t("impact.counters.people.value"), l: t("impact.counters.people.label") },
    { k: "green_jobs", iconSrc: "/assets/icons/projects/pureflow/pureflow-green-jobs.png", v: t("impact.counters.green_jobs.value"), l: t("impact.counters.green_jobs.label") },
    { k: "learning_sites", iconSrc: "/assets/icons/projects/pureflow/pureflow-schools-ecd-supported.png", v: t("impact.counters.learning_sites.value"), l: t("impact.counters.learning_sites.label") },
    { k: "educators", iconSrc: "/assets/icons/projects/pureflow/pureflow-educators-practitioners.png", v: t("impact.counters.educators.value"), l: t("impact.counters.educators.label") },
    { k: "wash_events", iconSrc: "/assets/icons/projects/pureflow/pureflow-wash-training-sessions.png", v: t("impact.counters.wash_events.value"), l: t("impact.counters.wash_events.label") },
    { k: "litres", iconSrc: "/assets/icons/projects/pureflow/pureflow-clean-water-capacity.png", v: t("impact.counters.litres.value"), l: t("impact.counters.litres.label") },
    { k: "co2", iconSrc: "/assets/icons/projects/pureflow/pureflow-co2e-reduced.png", v: t("impact.counters.co2.value"), l: t("impact.counters.co2.label") },
  ];


  return (
    <section style={{ background: BLUE }} className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-6 md:px-8 md:pt-16 md:pb-8">
        <div className="text-center text-white">
          <Script>{t("showcase.script_heading")}</Script>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF }}>
            {t("showcase.main_heading")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/80 md:text-base">{t("showcase.text")}</p>
        </div>

        {/* Counter matrix — yellow icons, animated numbers, on blue */}
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4">
          {counters.map((c) => {
            const { value, suffix } = parseCounter(c.v);
            return (
              <div key={c.k} className="flex flex-col items-center text-center">
                <img
                  src={c.iconSrc}
                  alt=""
                  aria-hidden
                  className="h-16 w-16 object-contain sm:h-[72px] sm:w-[72px] md:h-[84px] md:w-[84px]"
                />
                <div
                  className="mt-4 font-display text-2xl font-extrabold leading-none md:text-3xl"
                  style={{ color: YELLOW, fontFamily: SERIF }}
                >
                  <AnimatedNumber value={value} suffix={suffix} locale={locale} />
                </div>
                <p className="mt-3 max-w-[15rem] text-[11px] leading-snug text-white/80 md:text-xs">{c.l}</p>
              </div>
            );
          })}

        </div>


        <p className="mx-auto mt-8 max-w-3xl text-center text-xs italic text-white/65 md:text-sm">
          {t("impact.note")}
        </p>

        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl bg-black/90 shadow-2xl ring-1 ring-white/10 md:max-w-[900px]">
          <div className="relative aspect-video w-full">
            {vid && !playing && (
              <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 z-10" aria-label={t("showcase.video.title")}>
                <img src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`} alt={t("showcase.video.title")} className="h-full w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                  <PlayCircle className="h-20 w-20" style={{ color: YELLOW }} />
                </span>
              </button>
            )}
            {vid && playing && (
              <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`} title={t("showcase.video.title")} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            )}
            {!vid && <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#081A60] to-[#1E40C8] text-white/70"><PlayCircle className="h-16 w-16" style={{ color: YELLOW }} /></div>}
          </div>
          <div className="bg-white/95 px-5 py-3">
            <p className="text-sm font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>{t("showcase.video.title")}</p>
            <p className="mt-0.5 text-xs text-slate-600">{t("showcase.video.description")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------- Editorial collage (3–4 photo placeholders) -----------------------

function StepCollage({
  photos,
  variant = "A",
  alt,
  tone = "ocean",
  accent = YELLOW,
}: {
  photos: Array<{ src?: string; objectPosition?: string; alt?: string }>;
  variant?: "A" | "B" | "C";
  alt: string;
  tone?: "ocean" | "earth" | "sun" | "warm" | "blue";
  accent?: string;
}) {
  // Ensure exactly 3 or 4 slots
  const slots = photos.slice(0, 4);
  while (slots.length < 3) slots.push({});

  // Layout definitions map slot index → grid cell classes + rounded corners
  const layouts: Record<"A" | "B" | "C", string[]> = {
    // 4 photos — mirrors Step 01 (portrait main + top right + mid right + wide bottom)
    A: [
      "col-span-7 row-span-4 rounded-tl-[2.5rem] rounded-br-2xl rounded-tr-xl rounded-bl-xl",
      "col-span-5 row-span-3 rounded-tr-[2.5rem] rounded-bl-xl rounded-tl-xl rounded-br-xl",
      "col-span-5 row-span-3 rounded-xl",
      "col-span-7 row-span-2 rounded-bl-[2.5rem] rounded-tr-xl rounded-tl-xl rounded-br-xl",
    ],
    // 3 photos — tall left, two stacked right
    B: [
      "col-span-7 row-span-6 rounded-tl-[2.5rem] rounded-bl-[2.5rem] rounded-tr-xl rounded-br-xl",
      "col-span-5 row-span-3 rounded-tr-[2.5rem] rounded-bl-xl rounded-tl-xl rounded-br-xl",
      "col-span-5 row-span-3 rounded-br-[2.5rem] rounded-tl-xl rounded-tr-xl rounded-bl-xl",
    ],
    // 4 photos — offset 2×2 with a hero cell
    C: [
      "col-span-6 row-span-3 rounded-tl-[2.5rem] rounded-br-2xl rounded-tr-xl rounded-bl-xl",
      "col-span-6 row-span-3 rounded-tr-[2.5rem] rounded-bl-2xl rounded-tl-xl rounded-br-xl",
      "col-span-7 row-span-3 rounded-bl-[2.5rem] rounded-tr-xl rounded-tl-xl rounded-br-xl",
      "col-span-5 row-span-3 rounded-br-[2.5rem] rounded-tl-xl rounded-tr-xl rounded-bl-xl",
    ],
  };
  const cells = layouts[variant];
  const usable = slots.slice(0, cells.length);

  return (
    <div className="relative">
      <div
        className="relative grid aspect-[4/5] grid-cols-12 grid-rows-6 gap-2.5 md:gap-3"
        style={{ filter: "drop-shadow(0 28px 60px rgba(8,26,96,0.35))" }}
      >
        {usable.map((p, i) => (
          <div key={i} className={cn("overflow-hidden ring-1 ring-black/10", cells[i])}>
            <PhotoFrame
              src={p.src}
              alt={p.alt ?? alt}
              tone={tone}
              rounded="rounded-none"
              className="h-full w-full"
              objectPosition={p.objectPosition}
            />
          </div>
        ))}
      </div>
      {/* accent block */}
      <div
        className="pointer-events-none absolute -right-3 -top-3 hidden h-20 w-20 rounded-2xl md:block"
        style={{ background: accent, boxShadow: `0 14px 28px -14px ${accent}B3` }}
        aria-hidden
      />
    </div>
  );
}

// ----------------------- Step block (photo-first with small illustration accent) -----------------------

function StepBlock({
  id,
  num,
  tag,
  heading,
  body,
  reverse,
  dark,
  photoSrc,
  photoAlt,
  photoTone = "ocean",
  photoObjectPosition,
  photoSrcs,
  collageVariant,
  accentSrc,
  accentSrcSecondary,
  children,
  bgPhotoSrc,
}: {
  id: string;
  num: string;
  tag: string;
  heading: string;
  body: string;
  reverse?: boolean;
  dark?: boolean;
  photoSrc?: string;
  photoAlt: string;
  photoTone?: "ocean" | "earth" | "sun" | "warm" | "blue";
  photoObjectPosition?: string;
  photoSrcs?: Array<{ src?: string; objectPosition?: string; alt?: string }>;
  collageVariant?: "A" | "B" | "C";
  accentSrc?: string;
  accentSrcSecondary?: string;
  children?: React.ReactNode;
  bgPhotoSrc?: string;
}) {
  const textColor = dark ? "#FFFFFF" : BLUE_DEEP;
  const bodyColor = dark ? "rgba(255,255,255,0.85)" : "#334155";
  const tagBg = dark ? "rgba(255,255,255,0.12)" : "rgba(15,42,140,0.08)";
  const tagFg = dark ? YELLOW : BLUE;
  return (
    <section
      id={id}
      className="relative scroll-mt-20"
      style={{ background: dark ? BLUE : CREAM }}
    >
      {bgPhotoSrc && !dark && (
        <>
          <img
            src={bgPhotoSrc}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `${CREAM}D9` }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">

        <div
          className={cn(
            "grid items-center gap-8 lg:grid-cols-2 lg:gap-12",
            reverse && "lg:[&>div:first-child]:order-2",
          )}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-base font-extrabold"
                style={{ background: YELLOW, color: BLUE_DEEP, fontFamily: SERIF }}
              >
                {num}
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{ background: tagBg, color: tagFg }}
              >
                {tag}
              </span>
            </div>
            <h3
              className="mt-4 text-3xl font-bold leading-tight md:text-4xl"
              style={{ fontFamily: SERIF, color: textColor }}
            >
              {heading}
            </h3>
            <p className="mt-3 text-base leading-relaxed md:text-lg" style={{ color: bodyColor }}>
              {body}
            </p>
          </div>

          {/* Visual: editorial collage (preferred) or single photo fallback */}
          <div className="relative">
            {photoSrcs && photoSrcs.length > 0 ? (
              <StepCollage
                photos={photoSrcs}
                variant={collageVariant ?? "A"}
                alt={photoAlt}
                tone={photoTone}
              />
            ) : (
              <PhotoFrame
                src={photoSrc}
                alt={photoAlt}
                tone={photoTone}
                className="aspect-[4/3] w-full"
                objectPosition={photoObjectPosition}
              />
            )}
            {/* Small illustration accent bubble (secondary) */}
            {accentSrc && (
              <div className="absolute -bottom-6 -left-4 md:-bottom-8 md:-left-8">
                <CircleArt src={accentSrc} alt={photoAlt} size="sm" />
              </div>
            )}
            {accentSrcSecondary && (
              <div className="absolute -right-3 -top-5 md:-right-6 md:-top-8">
                <CircleArt src={accentSrcSecondary} alt={photoAlt} size="xs" bg="#FFFFFF" ring="rgba(15,42,140,0.25)" />
              </div>
            )}
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}


// ----------------------- Horizontal 5-step delivery loop (under Step 02) -----------------------

function DeliveryLoop({ t }: { t: (k: string, fb?: string) => string }) {
  const ICONS = [Ear, Wrench, Truck, GraduationCap, HeartHandshake];
  const items = [1, 2, 3, 4, 5].map((n, i) => ({
    title: t(`step2.loop.${n}.title`),
    desc: t(`step2.loop.${n}.desc`),
    Icon: ICONS[i],
    photo: `${PHOTO_BASE}/${FIELD_PHOTOS.loop[i]}`,
  }));

  const LoopPhoto = ({ src, Icon, alt, size }: { src: string; Icon: typeof Ear; alt: string; size: "lg" | "sm" }) => {
    const [errored, setErrored] = useState(false);
    const box = size === "lg" ? "h-28 w-28 md:h-32 md:w-32" : "h-16 w-16";
    const ring = size === "lg" ? "ring-[6px]" : "ring-[4px]";
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${box} ${ring}`}
        style={{ background: BLUE, boxShadow: "0 12px 28px -12px rgba(8,26,96,0.45)", ["--tw-ring-color" as never]: CREAM }}
      >
        {!errored ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: `radial-gradient(120% 80% at 30% 20%, ${YELLOW}33, transparent 60%), linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DEEP} 100%)` }}
            />
            <Icon className={size === "lg" ? "relative h-10 w-10 md:h-12 md:w-12" : "relative h-6 w-6"} style={{ color: YELLOW }} strokeWidth={1.75} />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="mt-12 rounded-3xl bg-white/95 p-5 shadow-xl ring-1 ring-black/5 md:p-8">
      <div className="text-center">
        <h4 className="text-xl font-bold md:text-2xl" style={{ fontFamily: SERIF, color: BLUE_DEEP }}>
          {t("step2.loop.heading")}
        </h4>
        <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 md:text-base">{t("step2.loop.sub_heading")}</p>
      </div>

      {/* Desktop / tablet: horizontal flow */}
      <ol className="relative mt-10 hidden grid-cols-9 items-start gap-0 md:grid">
        {items.map((it, i) => (
          <Fragment key={`loop-${i}`}>
            <li className="col-span-1 flex flex-col items-center px-1 text-center">
              <div className="relative">
                <LoopPhoto src={it.photo} Icon={it.Icon} alt={it.title} size="lg" />
                <span
                  className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ring-2 ring-white"
                  style={{ background: YELLOW, color: BLUE_DEEP }}
                >
                  {i + 1}
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                {it.title}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-slate-600">{it.desc}</p>
            </li>
            {i < items.length - 1 && (
              <li aria-hidden className="col-span-1 flex justify-center pt-12">
                <ArrowRight className="h-5 w-5" style={{ color: YELLOW }} strokeWidth={3} />
              </li>
            )}
          </Fragment>
        ))}
      </ol>

      {/* Mobile: stacked */}
      <ol className="mt-6 space-y-3 md:hidden">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="relative">
              <LoopPhoto src={it.photo} Icon={it.Icon} alt={it.title} size="sm" />
              <span
                className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold ring-2 ring-white"
                style={{ background: YELLOW, color: BLUE_DEEP }}
              >
                {i + 1}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                {i + 1}. {it.title}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">{it.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );

}

// ----------------------- ECD YouTube Embed (for Step 03) -----------------------

function EcdVideoEmbed() {
  const [playing, setPlaying] = useState(false);
  const vid = "0Y4YB7WniTw";
  return (
    <div className="mt-12 lg:mx-auto lg:max-w-[860px]">
      <div className="overflow-hidden rounded-3xl bg-black/90 shadow-xl ring-1 ring-black/10">
        <div className="relative aspect-video w-full">
          {!playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0"
              aria-label="Play PureFlow Amanzi at the ECD Centre"
            >
              <img
                src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`}
                alt="PureFlow Amanzi at the ECD Centre"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                <PlayCircle className="h-20 w-20" style={{ color: YELLOW }} />
              </span>
            </button>
          ) : (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`}
              title="PureFlow Amanzi at the ECD Centre"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        <div className="bg-white/95 px-5 py-3 text-center">
          <p className="text-sm font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
            PureFlow Amanzi at the No.1 ECD Centre
          </p>
          <p className="mt-0.5 text-xs text-slate-600">Safe water in action for early childhood learners.</p>
        </div>
      </div>
    </div>
  );
}

// ----------------------- SDG Grid -----------------------

const SDG_NUMS = [1, 3, 4, 5, 6, 8, 10, 11, 12, 13, 17] as const;

function SDGIcon({ n }: { n: number }) {
  const [errored, setErrored] = useState(false);
  const src = `/assets/icons/SDG/E-WEB-Goal-${String(n).padStart(2, "0")}.png`;
  if (errored) {
    return (
      <div
        className="flex h-[58px] w-[58px] items-center justify-center rounded-lg bg-slate-200 text-[10px] font-bold text-slate-500 sm:h-[62px] sm:w-[62px] md:h-[68px] md:w-[68px] lg:h-[72px] lg:w-[72px]"
        aria-label={`SDG ${n}`}
      >
        SDG {n}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`SDG ${n}`}
      loading="lazy"
      onError={() => setErrored(true)}
      className="h-auto w-[58px] object-contain sm:w-[62px] md:w-[68px] lg:w-[72px]"
    />
  );
}

function SDGGrid({ t }: { t: (k: string, fb?: string) => string }) {
  const [selected, setSelected] = useState<number>(6);
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={`${PHOTO_BASE}/${FIELD_PHOTOS.sdg}`}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#081A60]/55 via-[#081A60]/35 to-[#081A60]/55" />
      </div>
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-12">
        <div className="text-center">
          <Script color={YELLOW}>SDG</Script>
          <h2 className="mt-1 text-3xl font-bold text-white md:text-4xl" style={{ fontFamily: SERIF }}>
            {t("sdg.main_heading")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/90 md:text-base">{t("sdg.sub_heading")}</p>
        </div>

        {/* Compact icon grid */}
        <div
          role="tablist"
          aria-label="Sustainable Development Goals"
          className="mx-auto mt-6 grid max-w-3xl grid-cols-3 justify-items-center gap-3 sm:grid-cols-4 sm:gap-4 md:mt-8 md:max-w-4xl md:grid-cols-6 lg:grid-cols-6"
        >
          {SDG_NUMS.map((n) => {
            const isActive = selected === n;
            return (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`${t(`sdg.${n}.title`)}`}
                onClick={() => setSelected(n)}
                onMouseEnter={() => setSelected(n)}
                onFocus={() => setSelected(n)}
                className={`group rounded-xl p-1.5 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[${YELLOW}] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081A60] ${
                  isActive
                    ? "scale-105 ring-2 ring-[#FFC629] ring-offset-2 ring-offset-transparent"
                    : "opacity-80 hover:opacity-100 hover:scale-105"
                }`}
              >
                <SDGIcon n={n} />
              </button>
            );
          })}
        </div>

        {/* Detail panel for selected SDG */}
        <div
          className="mx-auto mt-6 max-w-3xl rounded-2xl border border-white/40 p-5 shadow-lg backdrop-blur-md sm:p-6 md:mt-8"
          style={{ background: "rgba(255, 251, 240, 0.94)" }}
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
            <div className="shrink-0">
              <SDGIcon n={selected} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#FFC629]" style={{ color: "#B8860B" }}>
                SDG {selected}
              </div>
              <h3 className="mt-0.5 text-lg font-bold text-[#081A60] md:text-xl" style={{ fontFamily: SERIF }}>
                {t(`sdg.${selected}.title`)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-800 md:text-[15px]">
                {t(`sdg.${selected}.desc`)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------- Partners (large, full colour) -----------------------

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function PartnersStrip({ t }: { t: (k: string, fb?: string) => string }) {
  const list = t("partners.list")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const matched = list
    .map((name) => {
      const norm = normalize(name);
      const found = allPartners.find((p) => {
        const pn = normalize(p.name);
        return pn === norm || pn.includes(norm) || norm.includes(pn);
      });
      return { name, partner: found };
    })
    .filter((x) => x.partner);

  return (
    <section style={{ background: CREAM_WARM }} className="relative">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="text-center">
          <Script color={BLUE}>{t("partners.script_heading")}</Script>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF, color: BLUE_DEEP }}>
            {t("partners.main_heading")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-700 md:text-base">{t("partners.text")}</p>
        </div>

        {matched.length > 0 ? (
          <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {matched.map(({ partner }) => (
              <a
                key={partner!.name}
                href={partner!.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-28 w-[200px] items-center justify-center sm:w-[220px] md:h-32 md:w-[240px]"
                title={partner!.name}
              >
                <img
                  src={partner!.logo}
                  alt={`${partner!.name} logo`}
                  loading="lazy"
                  className="max-h-[110px] max-w-full object-contain transition group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                  }}
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {list.map((n) => (
              <span
                key={n}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5"
              >
                {n}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ----------------------- Donation Box -----------------------

function DonationBox({ t, anchorRef }: { t: (k: string, fb?: string) => string; anchorRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <section ref={anchorRef as React.RefObject<HTMLDivElement>} id="donate" className="relative isolate scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={`${PHOTO_BASE}/${FIELD_PHOTOS.donation}`}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${BLUE_DEEP}EE 0%, ${BLUE}E6 60%, ${BLUE}D9 100%)` }} />
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(560px,1.2fr)] lg:items-start">
        <div className="text-white lg:pt-6">
          <Script>{t("donation.script_heading")}</Script>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF }}>{t("donation.main_heading")}</h2>
          <p className="mt-3 max-w-xl text-base text-white/85">{t("donation.text_intro")}</p>
        </div>
        <DonationWidget defaultProject="Safe Water" />
          </div>
    </section>
  );
}

// ----------------------- Closing -----------------------

function Closing({ t, goDonate }: { t: (k: string, fb?: string) => string; goDonate: (f: "monthly" | "once") => void }) {
  return (
    <section id="pureflow-closing" className="relative" style={{ background: BLUE_DEEP }}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 text-white md:px-8 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="relative">
          <StepCollage
            photos={FIELD_PHOTOS.closing.map((photo, index) => ({
              src: `${PHOTO_BASE}/${photo}`,
              objectPosition: index === 2 ? "center 38%" : "center 42%",
              alt: "PureFlow Amanzi community members with household water filters",
            }))}
            variant="C"
            alt="PureFlow Amanzi community groups"
          />
          <div className="absolute -bottom-6 -right-4 md:-bottom-8 md:-right-6">
            <CircleArt src={`${ASSET_BASE}/pureflow-community.png`} alt="Community" size="sm" />
          </div>
        </div>
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold md:text-5xl" style={{ fontFamily: SERIF }}>
            {t("closing.main_heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 md:text-lg lg:mx-0">
            {t("closing.text")}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button
              size="lg"
              onClick={() => goDonate("monthly")}
              className="rounded-full px-6 text-base font-semibold"
              style={{ background: YELLOW, color: BLUE_DEEP }}
            >
              <Heart className="mr-2 h-4 w-4 fill-current" />
              {t("closing.btn.monthly")}
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-white/5 px-6 text-base text-white hover:bg-white/10"
            >
              <Link to="/projects">{t("closing.btn.projects")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------- Step 01 — Structural Problem (4-photo editorial collage) -----------------------


function Step01Collage({ t }: { t: (k: string, fb?: string) => string }) {
  return (
    <section id="structural-problem" className="relative isolate overflow-hidden" style={{ background: CREAM, scrollMarginTop: "calc(var(--header-height, 80px) + 16px)" }}>
      <img
        src={`${PHOTO_BASE}/${FIELD_PHOTOS.structural.background}`}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: `${CREAM}CC` }} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${CREAM}E6 0%, ${CREAM_WARM}B3 60%, ${CREAM}D9 100%)` }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          {/* Text */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-base font-extrabold"
                style={{ background: YELLOW, color: BLUE_DEEP, fontFamily: SERIF }}
              >
                {t("step1.num", "01")}
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{ background: "rgba(15,42,140,0.08)", color: BLUE }}
              >
                {t("step1.tag")}
              </span>
            </div>
            <h3
              className="mt-4 text-3xl font-bold leading-tight md:text-4xl"
              style={{ fontFamily: SERIF, color: BLUE_DEEP }}
            >
              {t("step1.heading")}
            </h3>
            <p className="mt-3 text-base leading-relaxed md:text-lg" style={{ color: "#334155" }}>
              {t("step1.text_block")}
            </p>
          </div>

          {/* Editorial 4-photo collage */}
          <div className="relative">
            <div
              className="relative grid aspect-[4/5] grid-cols-12 grid-rows-6 gap-2.5 md:gap-3"
              style={{ filter: "drop-shadow(0 28px 60px rgba(8,26,96,0.45))" }}
            >
              {/* main tall portrait, left */}
              <div className="col-span-7 row-span-4 overflow-hidden rounded-tl-[2.5rem] rounded-br-2xl rounded-tr-xl rounded-bl-xl ring-1 ring-black/10">
                <img
                  src={`${PHOTO_BASE}/${FIELD_PHOTOS.structural.main}`}
                  alt="Women in rural Pondoland carrying the daily burden of unsafe water"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 42%" }}
                />
              </div>
              {/* top right */}
              <div className="col-span-5 row-span-3 overflow-hidden rounded-tr-[2.5rem] rounded-bl-xl rounded-tl-xl rounded-br-xl ring-1 ring-black/10">
                <img
                  src={`${PHOTO_BASE}/${FIELD_PHOTOS.structural.carrying}`}
                  alt="Daily reality of collecting water in Pondoland"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center" }}
                />
              </div>
              {/* mid right */}
              <div className="col-span-5 row-span-3 overflow-hidden rounded-xl ring-1 ring-black/10">
                <img
                  src={`${PHOTO_BASE}/${FIELD_PHOTOS.structural.source}`}
                  alt="Unsafe water source serving rural households"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 40%" }}
                />
              </div>
              {/* bottom wide */}
              <div className="col-span-7 row-span-2 overflow-hidden rounded-bl-[2.5rem] rounded-tr-xl rounded-tl-xl rounded-br-xl ring-1 ring-black/10">
                <img
                  src={`${PHOTO_BASE}/${FIELD_PHOTOS.structural.household}`}
                  alt="Community context behind the water crisis"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center" }}
                />
              </div>
            </div>

            {/* yellow framed accent block top-right */}
            <div
              className="pointer-events-none absolute -right-3 -top-3 hidden h-20 w-20 rounded-2xl md:block"
              style={{ background: YELLOW, boxShadow: "0 14px 28px -14px rgba(251,191,36,0.7)" }}
              aria-hidden
            />
            {/* step icon bubble */}
            <div className="absolute -bottom-6 -left-4 z-10 md:-bottom-8 md:-left-8">
              <CircleArt
                src={`${ASSET_BASE}/pureflow-problem.png`}
                alt="Structural Problem"
                size="sm"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}



// ----------------------- Climate Resilience & Sustainability -----------------------

const CLIMATE_PHOTOS: Array<{ src?: string; objectPosition?: string; alt?: string }> = [
  { src: `${PHOTO_BASE}/${FIELD_PHOTOS.climate[0]}`, alt: "Household filter maintenance and backwashing" },
  { src: `${PHOTO_BASE}/${FIELD_PHOTOS.climate[1]}`, alt: "Field team testing household water quality" },
  { src: `${PHOTO_BASE}/${FIELD_PHOTOS.climate[2]}`, alt: "Untreated water compared with filtered drinking water" },
  { src: `${PHOTO_BASE}/${FIELD_PHOTOS.climate[3]}`, alt: "Resident using a PureFlow filter during a home visit" },
];

function ClimateSection({ t }: { t: (k: string, fb?: string) => string }) {
  const paragraphs = t("climate.text_block")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="climate" className="relative scroll-mt-20" style={{ background: CREAM }}>
      <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Text side */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: YELLOW, color: BLUE_DEEP }}
              >
                <CircleDollarSign className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{ background: "rgba(15,42,140,0.08)", color: BLUE }}
              >
                {t("climate.script_heading", "Climate Resilience")}
              </span>
            </div>
            <h3
              className="mt-4 text-3xl font-bold leading-tight md:text-4xl"
              style={{ fontFamily: SERIF, color: BLUE_DEEP }}
            >
              {t("climate.main_heading")}
            </h3>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

          </div>

          {/* Collage side */}
          <div className="relative">
            <StepCollage
              photos={CLIMATE_PHOTOS}
              variant="A"
              alt="Climate resilience and sustainability"
              tone="ocean"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------- Video Library -----------------------

function VideoCard({ url, title, size = "md" }: { url: string; title: string; size?: "md" | "sm" }) {
  const [playing, setPlaying] = useState(false);
  const vid = youtubeId(url);
  return (
    <div className="overflow-hidden rounded-2xl bg-black/90 shadow-xl ring-1 ring-white/10">
      <div className="relative aspect-video w-full">
        {vid && !playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0"
            aria-label={title}
          >
            <img
              src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
              <PlayCircle className={size === "sm" ? "h-12 w-12" : "h-16 w-16"} style={{ color: YELLOW }} />
            </span>
          </button>
        )}
        {vid && playing && (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {!vid && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#081A60] to-[#1E40C8] text-white/70">
            <PlayCircle className="h-12 w-12" style={{ color: YELLOW }} />
          </div>
        )}
      </div>
      <div className="bg-white/95 px-4 py-3">
        <p
          className={cn("font-semibold", size === "sm" ? "text-xs" : "text-sm")}
          style={{ color: BLUE_DEEP, fontFamily: SERIF }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

function VideoLibrary({ t }: { t: (k: string, fb?: string) => string }) {
  const fieldVideos = [1, 2, 3, 4]
    .map((n) => ({ title: t(`videos.field.${n}.title`), url: t(`videos.field.${n}.url`) }))
    .filter((v) => v.url);
  const guideVideos = [1, 2, 3]
    .map((n) => ({ title: t(`videos.guide.${n}.title`), url: t(`videos.guide.${n}.url`) }))
    .filter((v) => v.url);

  return (
    <section id="videos" className="relative isolate overflow-hidden scroll-mt-20" style={{ background: BLUE }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(1000px 500px at 85% 10%, ${YELLOW}1A 0%, transparent 60%), radial-gradient(900px 500px at 10% 100%, ${BLUE_DEEP} 0%, transparent 60%)`,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="text-center text-white">
          <Script color={YELLOW}>{t("videos.script_heading", "Watch More")}</Script>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF }}>
            {t("videos.main_heading")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 md:text-base">
            {t("videos.text")}
          </p>
        </div>

        {/* Primary group */}
        <div className="mt-10">
          <div className="mb-4 flex flex-col items-start gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
            <h3 className="text-xl font-bold text-white md:text-2xl" style={{ fontFamily: SERIF }}>
              {t("videos.category1.title")}
            </h3>
            <p className="text-xs text-white/70 md:max-w-md md:text-right md:text-sm">
              {t("videos.category1.desc")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fieldVideos.map((v) => (
              <VideoCard key={v.url} url={v.url} title={v.title} />
            ))}
          </div>
        </div>

        {/* Secondary group */}
        <div className="mt-12">
          <div className="mb-4 flex flex-col items-start gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
            <h3 className="text-lg font-bold text-white md:text-xl" style={{ fontFamily: SERIF }}>
              {t("videos.category2.title")}
            </h3>
            <p className="text-xs text-white/70 md:max-w-md md:text-right md:text-sm">
              {t("videos.category2.desc")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guideVideos.map((v) => (
              <VideoCard key={v.url} url={v.url} title={v.title} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function PureFlowCompactPage() {
  const { lang } = useLang();
  const { t } = useProjectContent(lang);
  const donationRef = useRef<HTMLDivElement | null>(null);
  const [mapMounted, setMapMounted] = useState(false);
  useEffect(() => setMapMounted(true), []);


  const goDonate = (_freq: "monthly" | "once") => {
    const el = donationRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <main className="overflow-x-hidden">
      <Hero t={t} goDonate={goDonate} />
      <PathwayStepper t={t} />

      <WaveDivider from={BLUE_DEEP} to={BLUE} />
      <Showcase t={t} lang={lang} />

      <WaveDivider from={BLUE} to={CREAM_WARM} />

      {/* Field Map — verified rollout events on a distinct light section. */}
      <section
        id="event-map"
        className="relative scroll-mt-20 isolate overflow-hidden"
        style={{ background: CREAM_WARM }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(1200px 500px at 15% 0%, ${YELLOW}24 0%, transparent 60%)`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <Script color={YELLOW}>{t("fieldmap.script_heading", "Impact Map")}</Script>
            <h2
              className="mt-1 text-3xl font-bold md:text-4xl"
              style={{ fontFamily: SERIF, color: BLUE_DEEP }}
            >
              PureFlow Amanzi – Impact Map
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-700 md:text-base">
              Real communities. Cleaner water. Brighter futures.
            </p>
          </div>

          <div className="mt-8">
            {mapMounted ? (
              <Suspense
                fallback={
                  <div
                    className="grid h-[540px] place-items-center rounded-3xl text-sm"
                    style={{ background: "#fff", color: BLUE_DEEP }}
                  >
                    Loading map…
                  </div>
                }
              >
                <PureFlowEventMap />
              </Suspense>
            ) : (
              <div
                className="grid h-[540px] place-items-center rounded-3xl text-sm"
                style={{ background: "#fff", color: BLUE_DEEP }}
              >
                Loading map…
              </div>
            )}
          </div>


        </div>
      </section>

      <WaveDivider from={CREAM_WARM} to={CREAM} />

      {/* Step 01 — cream w/ 4-photo collage */}
      <Step01Collage t={t} />




      <WaveDivider from={CREAM} to={BLUE} />

      {/* Step 02 — dark blue + horizontal delivery loop */}
      <StepBlock
        id="step-2"
        num={t("step2.num", "02")}
        tag={t("step2.tag")}
        heading={t("step2.heading")}
        body={t("step2.text_block")}
        reverse
        dark
        photoAlt="PureFlow Amanzi household filter installation"
        photoTone="ocean"
        collageVariant="B"
        photoSrcs={[
          { src: `${PHOTO_BASE}/pureflow-home-visit-filter-installation-family-01.jpg`, objectPosition: "center 42%", alt: "Family learning how to install and use a PureFlow filter" },
          { src: `${PHOTO_BASE}/pureflow-giftofthegivers-smiling-woman-at-training-station-at-handout-event.jpg`, objectPosition: "center 35%", alt: "Woman smiling at a PureFlow training station" },
          { src: `${PHOTO_BASE}/pureflow-ecd-handout-event-wash-education.jpg`, objectPosition: "center 40%", alt: "WASH education at an ECD handout event" },
        ]}
        accentSrc={`${ASSET_BASE}/pureflow-solution.png`}
      >
        <DeliveryLoop t={t} />
      </StepBlock>

      <WaveDivider from={BLUE} to={CREAM} />

      {/* Step 03 — cream */}
      <StepBlock
        id="step-3"
        num={t("step3.num", "03")}
        tag={t("step3.tag")}
        heading={t("step3.heading")}
        body={t("step3.text_block")}
        photoAlt="Children at the No.1 ECD Centre with safe drinking water"
        photoTone="sun"
        collageVariant="C"
        photoSrcs={[
          { src: `${PHOTO_BASE}/pureflow-children-drinking-filtered-water-01.jpg`, objectPosition: "center 35%", alt: "Children drinking freshly filtered water" },
          { src: `${PHOTO_BASE}/pureflow-ecd-child-using-filter-in-class.jpg`, objectPosition: "center 35%", alt: "Child using a PureFlow filter in an ECD classroom" },
          { src: `${PHOTO_BASE}/pureflow-rural-ECD-classroom-kids-holding-up-cups-during-education.jpg`, objectPosition: "center 42%", alt: "Children holding drinking cups during rural ECD safe-water education" },
          { src: `${PHOTO_BASE}/pureflow-rural-ECD-handwashing-kid-filter-two-teachers.jpg`, objectPosition: "center 38%", alt: "Teachers guiding a child through handwashing at a rural ECD centre" },
        ]}
        accentSrc={`${ASSET_BASE}/pureflow-school.png`}
        accentSrcSecondary={`${ASSET_BASE}/pureflow-ecd.png`}
      >
        <EcdVideoEmbed />
      </StepBlock>

      <WaveDivider from={CREAM} to={BLUE} />

      {/* Step 04 — dark blue */}
      <StepBlock
        id="step-4"
        num={t("step4.num", "04")}
        tag={t("step4.tag")}
        heading={t("step4.heading")}
        body={t("step4.text_block")}
        reverse
        dark
        photoAlt="WASH training session in a Pondoland village"
        photoTone="blue"
        collageVariant="A"
        photoSrcs={[
          { src: `${PHOTO_BASE}/pureflow-giftofthegivers-handout-event-before-and-after-photo-of-water-woman-fascinated.jpg`, objectPosition: "center 38%", alt: "Woman comparing untreated and filtered water" },
          { src: `${PHOTO_BASE}/pureflow-home-visit-child-operating-filter-01.jpg`, objectPosition: "center 38%", alt: "Child operating a PureFlow filter at home" },
          { src: `${PHOTO_BASE}/pureflow-home-visit-filter-backwash-demonstration-01.jpg`, objectPosition: "center 42%", alt: "Filter backwash demonstration during a home visit" },
          { src: `${PHOTO_BASE}/pureflow-home-visit-filter-maintenance-training-with-resident-01.jpg`, objectPosition: "center 38%", alt: "Resident receiving filter maintenance training" },
        ]}
        accentSrc={`${ASSET_BASE}/pureflow-wash.png`}
      />

      <WaveDivider from={BLUE} to={CREAM} />

      {/* Step 05 — cream */}
      <StepBlock
        id="step-5"
        num={t("step5.num", "05")}
        tag={t("step5.tag")}
        heading={t("step5.heading")}
        body={t("step5.text_block")}
        photoAlt="Local team assembling and delivering PureFlow filters"
        photoTone="warm"
        collageVariant="B"
        photoSrcs={[
          { src: `${PHOTO_BASE}/pureflow-happy-dancing-recipients-of-filter-after-event.jpg`, objectPosition: "center 36%", alt: "Community members celebrating after a filter event" },
          { src: `${PHOTO_BASE}/pureflow-g20-indaba-east-london-booth-team-01.jpg`, objectPosition: "center 42%", alt: "PureFlow Amanzi team at the G20 Indaba booth" },
          { src: `${PHOTO_BASE}/pureflow-handout-event-01-assembly-station-team-02.jpg`, objectPosition: "center 38%", alt: "Local implementation team at the assembly station" },
        ]}
        accentSrc={`${ASSET_BASE}/pureflow-jobs.png`}
      />

      <WaveDivider from={CREAM} to={BLUE} />

      {/* Step 06 — dark blue */}
      <StepBlock
        id="step-6"
        num={t("step6.num", "06")}
        tag={t("step6.tag")}
        heading={t("step6.heading")}
        body={t("step6.text_block")}
        reverse
        dark
        photoAlt="Pondoland village community living with safe water"
        photoTone="ocean"
        collageVariant="C"
        photoSrcs={[
          { src: `${PHOTO_BASE}/pureflow-ecd-handout-child-drinking-filtered-water-01.jpg`, objectPosition: "center 35%", alt: "Child drinking filtered water at an ECD handout" },
          { src: `${PHOTO_BASE}/pureflow-happy-recipients-after-event-child-smiling.jpg`, objectPosition: "center 35%", alt: "Child smiling after a community filter event" },
          { src: `${PHOTO_BASE}/pureflow-handout-event-bholani-training-station.jpg`, objectPosition: "center 40%", alt: "PureFlow training station at Bholani" },
          { src: `${PHOTO_BASE}/pureflow-step-06-long-term-transformation.jpg`, objectPosition: "center 42%", alt: "Long-term transformation through safe water" },
        ]}
        accentSrc={`${ASSET_BASE}/pureflow-village.png`}
        accentSrcSecondary={`${ASSET_BASE}/pureflow-community.png`}
      />


      <WaveDivider from={BLUE} to={CREAM} />
      <ClimateSection t={t} />

      <SDGGrid t={t} />

      <WaveDivider from={CREAM} to={BLUE} />
      <VideoLibrary t={t} />

      <WaveDivider from={BLUE} to={CREAM_WARM} />
      <PartnersStrip t={t} />


      <WaveDivider from={CREAM_WARM} to={BLUE} />
      <DonationBox t={t} anchorRef={donationRef} />

      <WaveDivider from={BLUE} to={BLUE_DEEP} />
      <Closing t={t} goDonate={goDonate} />
      <style>{`main:has(#pureflow-closing) + footer { margin-top: 0; }`}</style>
    </main>
  );
}
