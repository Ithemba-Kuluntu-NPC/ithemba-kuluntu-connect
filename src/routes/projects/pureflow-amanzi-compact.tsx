// This is a compact comparison concept for PureFlow Amanzi built around the Transformation Pathway, focusing on women's livelihoods.
//
// Route: /projects/pureflow-amanzi-compact
// Content is dynamically loaded at runtime from:
//   - public/content/projects/pureflow-amanzi-en-v4.txt
//   - public/content/projects/pureflow-amanzi-de-v4.txt
//   - public/content/projects/pureflow-amanzi-nl-v4.txt
// Language is driven by the global LanguageProvider (EN / DE / NL).

import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
  Flame,
  TreePine,
  Home as HomeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLang } from "@/components/site/LanguageProvider";
import { partners as allPartners } from "@/data/projects";
import { cn } from "@/lib/utils";
import type { Lang } from "@/data/content";

export const Route = createFileRoute("/projects/pureflow-amanzi-compact")({
  component: PureFlowCompactPage,
});

// ----------------------- Content loading -----------------------

type Dict = Record<string, string>;

function parseContent(raw: string): Dict {
  const out: Dict = {};
  for (const lineRaw of raw.split(/\r?\n/)) {
    const line = lineRaw.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) out[key] = value;
  }
  return out;
}

function useProjectContent(lang: Lang) {
  const [dict, setDict] = useState<Dict>({});
  const [enFallback, setEnFallback] = useState<Dict>({});

  useEffect(() => {
    let cancelled = false;
    fetch(`/content/projects/pureflow-amanzi-en-v4.txt`)
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => !cancelled && setEnFallback(parseContent(t)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/content/projects/pureflow-amanzi-${lang}-v4.txt`)
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
const HERO_VIDEO = "/assets/videos/projects/pureflow-amanzi-hero.mp4";
const HERO_POSTER = "/assets/photos/pureflow/hero.jpg";

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
}: {
  src?: string;
  alt: string;
  className?: string;
  rounded?: string;
  tone?: "ocean" | "earth" | "sun" | "warm" | "blue";
  children?: React.ReactNode;
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
          onError={() => setErrored(true)}
        />
      )}
      {children}
    </div>
  );
}

// ----------------------- Hero (video background) -----------------------

function Hero({ t, goDonate }: { t: (k: string, fb?: string) => string; goDonate: (freq: "monthly" | "once") => void }) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="relative isolate overflow-hidden" style={{ background: BLUE_DEEP }}>
      {/* Looping background video */}
      <div className="absolute inset-0 -z-10">
        {!videoFailed && (
          <video
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
        )}
        {videoFailed && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#081A60] via-[#0F2A8C] to-[#1E40C8]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#081A60]/92 via-[#0F2A8C]/82 to-[#0F2A8C]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(${YELLOW} 1.2px, transparent 1.2px)`,
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      {/* video placeholder badge */}
      <div className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 ring-1 ring-white/15 backdrop-blur">
        <PlayCircle className="h-3.5 w-3.5 text-[var(--ithemba-yellow,#FBBF24)]" />
        Hero video placeholder
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-8 text-white md:px-8 md:pb-20 md:pt-12">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {t("hero.back", "All projects")}
        </Link>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
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

          {/* Right: small decorative illustration cluster (subtle accents only) */}
          <div className="relative hidden h-[260px] lg:block">
            <div className="absolute right-6 top-2">
              <CircleArt src={`${ASSET_BASE}/pureflow-community.png`} alt="Community" size="md" />
            </div>
            <div className="absolute right-40 top-28">
              <CircleArt src={`${ASSET_BASE}/pureflow-cleanwater.png`} alt="Clean water" size="sm" bg="#FBF6E9" />
            </div>
          </div>
        </div>
      </div>
      <WaveDivider from="transparent" to={CREAM} />
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
    <section style={{ background: CREAM }} className="relative">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="text-center">
          <Script color={BLUE}>{t("pathway.script_heading")}</Script>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF, color: BLUE_DEEP }}>
            {t("pathway.main_heading")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-700 md:text-base">
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
                      className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold shadow ring-2 ring-[#FBF6E9]"
                      style={{ background: YELLOW, color: BLUE_DEEP }}
                    >
                      {s.num}
                    </span>
                  </div>
                  <p
                    className="mt-3 text-[13px] font-semibold leading-tight lg:text-sm"
                    style={{ color: BLUE_DEEP, fontFamily: SERIF }}
                  >
                    {s.title}
                  </p>
                  <p className="mt-1 line-clamp-3 text-[11px] leading-snug text-slate-600 lg:text-xs">{s.desc}</p>
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
    { k: "households", icon: HomeIcon, v: t("impact.counters.households.value"), l: t("impact.counters.households.label") },
    { k: "people", icon: Users, v: t("impact.counters.people.value"), l: t("impact.counters.people.label") },
    { k: "litres", icon: Droplets, v: t("impact.counters.litres.value"), l: t("impact.counters.litres.label") },
    { k: "co2", icon: Leaf, v: t("impact.counters.co2.value"), l: t("impact.counters.co2.label") },
    { k: "firewood", icon: Flame, v: t("impact.counters.firewood.value"), l: t("impact.counters.firewood.label") },
    { k: "trees", icon: TreePine, v: t("impact.counters.trees.value"), l: t("impact.counters.trees.label") },
  ];

  return (
    <section style={{ background: BLUE }} className="relative">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="text-center text-white">
          <Script>{t("showcase.script_heading")}</Script>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF }}>
            {t("showcase.main_heading")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/80 md:text-base">{t("showcase.text")}</p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.05fr_1fr]">
          {/* Video */}
          <div className="overflow-hidden rounded-3xl bg-black/90 shadow-2xl ring-1 ring-white/10">
            <div className="relative aspect-video w-full">
              {vid && !playing && (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group absolute inset-0 z-10"
                  aria-label={t("showcase.video.title")}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`}
                    alt={t("showcase.video.title")}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                    <PlayCircle className="h-20 w-20" style={{ color: YELLOW }} />
                  </span>
                </button>
              )}
              {vid && playing && (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`}
                  title={t("showcase.video.title")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {!vid && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#081A60] to-[#1E40C8] text-white/70">
                  <PlayCircle className="h-16 w-16" style={{ color: YELLOW }} />
                </div>
              )}
            </div>
            <div className="bg-white/95 px-5 py-3">
              <p className="text-sm font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                {t("showcase.video.title")}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">{t("showcase.video.description")}</p>
            </div>
          </div>

          {/* Counter matrix — yellow icons, animated numbers, on blue */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {counters.map((c) => {
              const { value, suffix } = parseCounter(c.v);
              const Icon = c.icon;
              return (
                <div key={c.k} className="flex flex-col items-center text-center">
                  <Icon className="h-9 w-9 md:h-10 md:w-10" style={{ color: YELLOW }} strokeWidth={1.75} />
                  <div
                    className="mt-2 font-display text-2xl font-extrabold leading-none md:text-3xl"
                    style={{ color: YELLOW, fontFamily: SERIF }}
                  >
                    <AnimatedNumber value={value} suffix={suffix} locale={locale} />
                  </div>
                  <p className="mt-2 max-w-[14rem] text-[11px] leading-snug text-white/80 md:text-xs">{c.l}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs italic text-white/65 md:text-sm">
          {t("impact.note")}
        </p>
      </div>
    </section>
  );
}

// ----------------------- Step Sheet (read more) -----------------------

function ReadMoreSheet({
  label,
  title,
  body,
  tag,
}: {
  label: string;
  title: string;
  body: string;
  tag: string;
}) {
  if (!label) return null;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="mt-5 rounded-full border-transparent px-5 font-semibold"
          style={{ background: YELLOW, color: BLUE_DEEP }}
        >
          {label} <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-lg overflow-y-auto sm:max-w-xl" style={{ background: CREAM }}>
        <SheetHeader>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: BLUE }}>
            {tag}
          </p>
          <SheetTitle style={{ fontFamily: SERIF, color: BLUE_DEEP }} className="text-2xl">
            {title}
          </SheetTitle>
          <SheetDescription className="text-base leading-relaxed text-slate-700">{body}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

// ----------------------- Step block (photo-first with small illustration accent) -----------------------

function StepBlock({
  id,
  num,
  tag,
  heading,
  body,
  ctaLabel,
  reverse,
  dark,
  photoSrc,
  photoAlt,
  photoTone = "ocean",
  accentSrc,
  accentSrcSecondary,
  children,
}: {
  id: string;
  num: string;
  tag: string;
  heading: string;
  body: string;
  ctaLabel: string;
  reverse?: boolean;
  dark?: boolean;
  photoSrc?: string;
  photoAlt: string;
  photoTone?: "ocean" | "earth" | "sun" | "warm" | "blue";
  accentSrc?: string;
  accentSrcSecondary?: string;
  children?: React.ReactNode;
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
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
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
            <ReadMoreSheet label={ctaLabel} title={heading} body={body} tag={tag} />
          </div>

          {/* Photo-first visual */}
          <div className="relative">
            <PhotoFrame
              src={photoSrc}
              alt={photoAlt}
              tone={photoTone}
              className="aspect-[4/3] w-full"
            />
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
  }));
  return (
    <div className="mt-12 rounded-3xl bg-white/95 p-5 shadow-xl ring-1 ring-black/5 md:p-8">
      <div className="text-center">
        <h4 className="text-xl font-bold md:text-2xl" style={{ fontFamily: SERIF, color: BLUE_DEEP }}>
          {t("step2.loop.heading")}
        </h4>
        <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600 md:text-base">{t("step2.loop.sub_heading")}</p>
      </div>

      {/* Desktop / tablet: horizontal flow */}
      <ol className="relative mt-8 hidden grid-cols-9 items-start gap-0 md:grid">
        {items.map((it, i) => (
          <Fragment key={`loop-${i}`}>
            <li className="col-span-1 flex flex-col items-center px-1 text-center">
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-md"
                style={{ background: BLUE, color: YELLOW, boxShadow: `0 0 0 4px rgba(251,191,36,0.25)` }}
              >
                <it.Icon className="h-7 w-7" strokeWidth={2} />
                <span
                  className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold ring-2 ring-white"
                  style={{ background: YELLOW, color: BLUE_DEEP }}
                >
                  {i + 1}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                {it.title}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-slate-600">{it.desc}</p>
            </li>
            {i < items.length - 1 && (
              <li aria-hidden className="col-span-1 flex justify-center pt-6">
                <ArrowRight className="h-5 w-5" style={{ color: YELLOW }} strokeWidth={3} />
              </li>
            )}
          </Fragment>
        ))}
      </ol>

      {/* Mobile: stacked */}
      <ol className="mt-6 space-y-3 md:hidden">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 rounded-xl bg-slate-50 p-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ background: BLUE, color: YELLOW }}
            >
              <it.Icon className="h-5 w-5" />
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
    <div className="mt-12 overflow-hidden rounded-3xl bg-black/90 shadow-xl ring-1 ring-black/10">
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
  );
}

// ----------------------- SDG Grid (boxless, logo-ready) -----------------------

const SDG_NUMS = [1, 3, 4, 5, 6, 8, 10, 11, 12, 13, 17] as const;
const SDG_COLORS: Record<number, string> = {
  1: "#E5243B",
  3: "#4C9F38",
  4: "#C5192D",
  5: "#FF3A21",
  6: "#26BDE2",
  8: "#A21942",
  10: "#DD1367",
  11: "#FD9D24",
  12: "#BF8B2E",
  13: "#3F7E44",
  17: "#19486A",
};

function SDGLogo({ n }: { n: number }) {
  const [errored, setErrored] = useState(false);
  // Logo-ready path — designers can drop official assets here later.
  const src = `/assets/logos/sdg/E-WEB-Goal-${String(n).padStart(2, "0")}.png`;
  if (errored) {
    return (
      <div
        className="flex h-16 w-16 items-center justify-center rounded-md text-xl font-extrabold text-white shadow-sm"
        style={{ background: SDG_COLORS[n], fontFamily: SERIF }}
        aria-label={`SDG ${n}`}
      >
        {n}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`SDG ${n}`}
      loading="lazy"
      onError={() => setErrored(true)}
      className="h-16 w-16 object-contain"
    />
  );
}

function SDGGrid({ t }: { t: (k: string, fb?: string) => string }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="/assets/photos/pureflow/sdg-bg.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FBF6E9]/95 via-[#FBF6E9]/92 to-[#F5EDD7]/95" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#081A60]/30 via-transparent to-[#081A60]/20 mix-blend-multiply" />
      </div>
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="text-center">
          <Script color={BLUE}>SDG</Script>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF, color: BLUE_DEEP }}>
            {t("sdg.main_heading")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-800 md:text-base">{t("sdg.sub_heading")}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {SDG_NUMS.map((n) => (
            <div key={n} className="flex items-start gap-4 rounded-2xl bg-white/60 p-3 backdrop-blur-sm ring-1 ring-white/40">
              <SDGLogo n={n} />
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                  <span style={{ color: SDG_COLORS[n] }}>SDG {n}</span> · {t(`sdg.${n}.title`)}
                </p>
                <p className="mt-1 text-xs leading-snug text-slate-700">{t(`sdg.${n}.desc`)}</p>
              </div>
            </div>
          ))}
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
          <div className="mt-10 grid grid-cols-2 items-center gap-x-10 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
            {matched.map(({ partner }) => (
              <a
                key={partner!.name}
                href={partner!.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-32 items-center justify-center"
                title={partner!.name}
              >
                <img
                  src={partner!.logo}
                  alt={`${partner!.name} logo`}
                  loading="lazy"
                  className="max-h-[120px] max-w-[260px] object-contain transition group-hover:scale-105"
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
  const [frequency, setFrequency] = useState<"monthly" | "once">("monthly");
  const [selected, setSelected] = useState<number | "custom">(2);
  const [customAmount, setCustomAmount] = useState("");

  const sym = t("donation.currency.symbol", "€");
  const tiers = [1, 2, 3, 4, 5].map((n) => ({
    n,
    value: t(`donation.amt.${n}`),
    desc: t(`donation.amt.${n}_desc`),
  }));

  const trustPoints = t("donation.trust_points")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section ref={anchorRef as React.RefObject<HTMLDivElement>} id="donate" style={{ background: BLUE }} className="relative scroll-mt-20">
      <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
        <div className="text-center text-white">
          <Script>{t("donation.script_heading")}</Script>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF }}>
            {t("donation.main_heading")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/85 md:text-base">
            {t("donation.text_intro")}
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="grid grid-cols-2 bg-slate-100 p-1 text-sm font-semibold">
            {(["monthly", "once"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={cn(
                  "rounded-full py-2 transition",
                  frequency === f ? "shadow" : "text-slate-600",
                )}
                style={frequency === f ? { background: YELLOW, color: BLUE_DEEP } : undefined}
              >
                {t(`donation.tab.${f}`)}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              {t("donation.amount.heading")}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tiers.map((tier) => {
                const active = selected === tier.n;
                return (
                  <button
                    key={tier.n}
                    onClick={() => setSelected(tier.n)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition",
                      active
                        ? "border-transparent shadow-md"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    )}
                    style={active ? { background: CREAM, borderColor: YELLOW } : undefined}
                  >
                    <div className="flex items-baseline gap-1">
                      <span
                        className="text-2xl font-extrabold"
                        style={{ color: BLUE_DEEP, fontFamily: SERIF }}
                      >
                        {sym}
                        {tier.value}
                      </span>
                      {frequency === "monthly" && (
                        <span className="text-xs text-slate-500">/mo</span>
                      )}
                    </div>
                    <p className="mt-2 text-xs leading-snug text-slate-600">{tier.desc}</p>
                  </button>
                );
              })}
              <button
                onClick={() => setSelected("custom")}
                className={cn(
                  "rounded-2xl border p-4 text-left transition",
                  selected === "custom"
                    ? "border-transparent shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300",
                )}
                style={selected === "custom" ? { background: CREAM, borderColor: YELLOW } : undefined}
              >
                <p className="text-sm font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                  {t("donation.amt.custom")}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-slate-500">{sym}</span>
                  <input
                    inputMode="numeric"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value.replace(/[^0-9]/g, ""));
                      setSelected("custom");
                    }}
                    placeholder="0"
                    className="w-full border-0 border-b border-slate-300 bg-transparent py-1 text-base focus:border-slate-500 focus:outline-none focus:ring-0"
                  />
                </div>
              </button>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t("donation.payment.heading")}
              </p>
              <p className="mt-2 text-sm text-slate-600">{t("donation.payment.options")}</p>
            </div>

            <Button
              asChild
              size="lg"
              className="mt-6 w-full rounded-full text-base font-semibold"
              style={{ background: BLUE, color: "#FFFFFF" }}
            >
              <Link to="/donate">
                {frequency === "monthly" ? t("donation.btn.monthly") : t("donation.btn.once")}
              </Link>
            </Button>

            {trustPoints.length > 0 && (
              <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
                {trustPoints.map((p) => (
                  <li key={p} className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" style={{ color: YELLOW }} />
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------- Closing -----------------------

function Closing({ t, goDonate }: { t: (k: string, fb?: string) => string; goDonate: (f: "monthly" | "once") => void }) {
  return (
    <section className="relative" style={{ background: BLUE_DEEP }}>
      <div className="mx-auto max-w-4xl px-5 py-16 text-center text-white md:px-8 md:py-20">
        <h2 className="text-3xl font-bold md:text-5xl" style={{ fontFamily: SERIF }}>
          {t("closing.main_heading")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 md:text-lg">
          {t("closing.text")}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
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
    </section>
  );
}

// ----------------------- Page -----------------------

function PureFlowCompactPage() {
  const { lang } = useLang();
  const { t } = useProjectContent(lang);
  const donationRef = useRef<HTMLDivElement | null>(null);

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

      <WaveDivider from={CREAM} to={BLUE} />
      <Showcase t={t} lang={lang} />

      <WaveDivider from={BLUE} to={CREAM} />

      {/* Step 01 — cream */}
      <StepBlock
        id="step-1"
        num={t("step1.num", "01")}
        tag={t("step1.tag")}
        heading={t("step1.heading")}
        body={t("step1.text_block")}
        ctaLabel={t("step1.cta_label")}
        photoAlt="Women collecting water in rural Pondoland"
        photoSrc="/assets/photos/pureflow/step-1.jpg"
        photoTone="earth"
        accentSrc={`${ASSET_BASE}/pureflow-problem.png`}
        accentSrcSecondary={`${ASSET_BASE}/pureflow-womentime-problem.png`}
      />

      <WaveDivider from={CREAM} to={BLUE} />

      {/* Step 02 — dark blue + horizontal delivery loop */}
      <StepBlock
        id="step-2"
        num={t("step2.num", "02")}
        tag={t("step2.tag")}
        heading={t("step2.heading")}
        body={t("step2.text_block")}
        ctaLabel={t("step2.cta_label")}
        reverse
        dark
        photoAlt="PureFlow Amanzi household filter installation"
        photoSrc="/assets/photos/pureflow/step-2.jpg"
        photoTone="ocean"
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
        ctaLabel={t("step3.cta_label")}
        photoAlt="Children at the No.1 ECD Centre with safe drinking water"
        photoSrc="/assets/photos/pureflow/step-3.jpg"
        photoTone="sun"
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
        ctaLabel={t("step4.cta_label")}
        reverse
        dark
        photoAlt="WASH training session in a Pondoland village"
        photoSrc="/assets/photos/pureflow/step-4.jpg"
        photoTone="blue"
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
        ctaLabel={t("step5.cta_label")}
        photoAlt="Local team assembling and delivering PureFlow filters"
        photoSrc="/assets/photos/pureflow/step-5.jpg"
        photoTone="warm"
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
        ctaLabel={t("step6.cta_label")}
        reverse
        dark
        photoAlt="Pondoland village community living with safe water"
        photoSrc="/assets/photos/pureflow/step-6.jpg"
        photoTone="ocean"
        accentSrc={`${ASSET_BASE}/pureflow-village.png`}
        accentSrcSecondary={`${ASSET_BASE}/pureflow-community.png`}
      />

      <WaveDivider from={BLUE} to={CREAM} />
      <SDGGrid t={t} />

      <WaveDivider from={CREAM} to={CREAM_WARM} />
      <PartnersStrip t={t} />

      <WaveDivider from={CREAM_WARM} to={BLUE} />
      <DonationBox t={t} anchorRef={donationRef} />

      <WaveDivider from={BLUE} to={BLUE_DEEP} />
      <Closing t={t} goDonate={goDonate} />
    </main>
  );
}
