// This is a compact comparison concept for PureFlow Amanzi built around the Transformation Pathway, focusing on women's livelihoods.
//
// Route: /projects/pureflow-amanzi-compact
// Content is dynamically loaded at runtime from:
//   - public/content/projects/pureflow-amanzi-en-v3.txt
//   - public/content/projects/pureflow-amanzi-de-v3.txt
//   - public/content/projects/pureflow-amanzi-nl-v3.txt
// Language is driven by the global LanguageProvider (EN / DE / NL).

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
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
    fetch(`/content/projects/pureflow-amanzi-en-v3.txt`)
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => !cancelled && setEnFallback(parseContent(t)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/content/projects/pureflow-amanzi-${lang}-v3.txt`)
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
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-[60px] w-full md:h-[90px]"
      >
        <path
          d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,50 L1440,90 L0,90 Z"
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

function CircleArt({
  src,
  alt,
  size = "lg",
  className = "",
  ring = "rgba(251,191,36,0.7)",
  bg = "rgba(255,255,255,0.92)",
}: {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  ring?: string;
  bg?: string;
}) {
  const sizes = {
    sm: "h-32 w-32",
    md: "h-44 w-44 md:h-52 md:w-52",
    lg: "h-56 w-56 md:h-72 md:w-72",
    xl: "h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96",
  } as const;
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full p-3 shadow-2xl",
        sizes[size],
        className,
      )}
      style={{
        background: bg,
        boxShadow: `0 25px 60px -25px rgba(8,26,96,0.55), 0 0 0 6px ${ring}`,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full rounded-full object-contain p-2"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
        }}
      />
    </div>
  );
}

// ----------------------- Hero -----------------------

function Hero({ t, goDonate }: { t: (k: string, fb?: string) => string; goDonate: (freq: "monthly" | "once") => void }) {
  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${BLUE_DEEP} 0%, ${BLUE} 100%)`,
      }}
    >
      {/* Decorative dots */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `radial-gradient(${YELLOW} 1.2px, transparent 1.2px)`,
          backgroundSize: "26px 26px",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-10 text-white md:px-8 md:pb-24 md:pt-16">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {t("hero.back", "All projects")}
        </Link>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Script>{t("hero.script_heading")}</Script>
            <h1
              className="mt-3 text-4xl font-bold leading-[1.05] md:text-6xl"
              style={{ fontFamily: SERIF }}
            >
              {t("hero.main_heading")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90 md:text-xl" style={{ fontFamily: SERIF }}>
              {t("hero.sub_heading")}
            </p>
            <p className="mt-5 max-w-2xl text-base text-white/80 md:text-lg">
              {t("hero.text_long")}
            </p>
            <p className="mt-3 max-w-2xl text-sm text-white/70">{t("hero.text_small_line")}</p>

            <div className="mt-7 flex flex-wrap gap-3">
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

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85 ring-1 ring-white/15">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("hero.patent_trust_line")}
            </div>
          </div>

          {/* Right: layered circular community art */}
          <div className="relative hidden lg:block">
            <div className="absolute -top-6 right-10">
              <CircleArt src={`${ASSET_BASE}/pureflow-community.png`} alt="Community" size="lg" />
            </div>
            <div className="absolute right-44 top-40">
              <CircleArt src={`${ASSET_BASE}/pureflow-cleanwater.png`} alt="Clean water" size="md" bg="#FBF6E9" />
            </div>
          </div>
        </div>
      </div>
      <WaveDivider from={BLUE} to={CREAM} />
    </section>
  );
}

// ----------------------- Pathway Stepper -----------------------

const STEP_IDS = ["step-1", "step-2", "step-3", "step-4", "step-5", "step-6"] as const;

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
  }));

  const scroll = (dir: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section style={{ background: CREAM }} className="relative">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="text-center">
          <Script color={BLUE}>{t("pathway.script_heading")}</Script>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF, color: BLUE_DEEP }}>
            {t("pathway.main_heading")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-700 md:text-lg">
            {t("pathway.sub_heading")}
          </p>
        </div>

        {/* Desktop: 6-up grid */}
        <ol className="mt-10 hidden grid-cols-6 gap-4 md:grid">
          {steps.map((s, i) => (
            <li key={s.id} className="relative">
              <button
                onClick={() => scrollToStep(s.id)}
                className="group flex h-full w-full flex-col items-start rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: YELLOW, color: BLUE_DEEP }}
                >
                  {s.num}
                </span>
                <span className="mt-3 text-sm font-semibold leading-tight" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                  {s.title}
                </span>
                <span className="mt-1 text-xs text-slate-600">{s.desc}</span>
                <span
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold opacity-0 transition group-hover:opacity-100"
                  style={{ color: BLUE }}
                >
                  Jump <ArrowRight className="h-3 w-3" />
                </span>
              </button>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute right-[-14px] top-1/2 hidden h-0.5 w-7 -translate-y-1/2 md:block"
                  style={{ background: `${BLUE}33` }}
                />
              )}
            </li>
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
                className="min-w-[78%] shrink-0 snap-center rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-black/5"
              >
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: YELLOW, color: BLUE_DEEP }}
                >
                  {s.num}
                </span>
                <p className="mt-3 text-base font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                  {s.title}
                </p>
                <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
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

// ----------------------- Showcase + Counters -----------------------

function youtubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function Showcase({ t }: { t: (k: string, fb?: string) => string }) {
  const [playing, setPlaying] = useState(false);
  const videoUrl = t("showcase.video.url");
  const vid = youtubeId(videoUrl);

  const counters = [
    { k: "households", v: t("impact.counters.households.value"), l: t("impact.counters.households.label") },
    { k: "people", v: t("impact.counters.people.value"), l: t("impact.counters.people.label") },
    { k: "litres", v: t("impact.counters.litres.value"), l: t("impact.counters.litres.label") },
    { k: "co2", v: t("impact.counters.co2.value"), l: t("impact.counters.co2.label") },
    { k: "firewood", v: t("impact.counters.firewood.value"), l: t("impact.counters.firewood.label") },
    { k: "trees", v: t("impact.counters.trees.value"), l: t("impact.counters.trees.label") },
  ];

  return (
    <section style={{ background: CREAM_WARM }} className="relative">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="text-center">
          <Script color={BLUE}>{t("showcase.script_heading")}</Script>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF, color: BLUE_DEEP }}>
            {t("showcase.main_heading")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-700 md:text-lg">{t("showcase.text")}</p>
        </div>

        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-2">
          {/* Video */}
          <div className="overflow-hidden rounded-3xl bg-black/90 shadow-2xl ring-1 ring-black/10">
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
            </div>
            <div className="bg-white px-5 py-4">
              <p className="text-sm font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                {t("showcase.video.title")}
              </p>
              <p className="mt-1 text-xs text-slate-600">{t("showcase.video.description")}</p>
            </div>
          </div>

          {/* Counter matrix */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {counters.map((c) => (
              <div
                key={c.k}
                className="flex flex-col items-start justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <span
                  className="text-2xl font-extrabold leading-tight md:text-3xl"
                  style={{ color: BLUE_DEEP, fontFamily: SERIF }}
                >
                  {c.v}
                </span>
                <span className="mt-2 text-xs leading-snug text-slate-600">{c.l}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm italic text-slate-600">
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

// ----------------------- Step block -----------------------

function StepBlock({
  id,
  num,
  tag,
  heading,
  body,
  ctaLabel,
  reverse,
  dark,
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
  children: React.ReactNode;
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
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div
          className={cn(
            "grid items-center gap-10 lg:grid-cols-2",
            reverse && "lg:[&>div:first-child]:order-2",
          )}
        >
          <div>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-base font-extrabold"
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
              className="mt-5 text-3xl font-bold leading-tight md:text-4xl"
              style={{ fontFamily: SERIF, color: textColor }}
            >
              {heading}
            </h3>
            <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: bodyColor }}>
              {body}
            </p>
            <ReadMoreSheet label={ctaLabel} title={heading} body={body} tag={tag} />
          </div>
          <div className="flex justify-center">{children}</div>
        </div>
      </div>
    </section>
  );
}

// ----------------------- 5-Step delivery loop -----------------------

function DeliveryLoop({ t }: { t: (k: string, fb?: string) => string }) {
  const items = [1, 2, 3, 4, 5].map((n) => ({
    title: t(`step2.loop.${n}.title`),
    desc: t(`step2.loop.${n}.desc`),
  }));
  return (
    <div className="mt-10 rounded-3xl bg-white/95 p-6 shadow-xl ring-1 ring-black/5 md:p-8">
      <h4 className="text-xl font-bold md:text-2xl" style={{ fontFamily: SERIF, color: BLUE_DEEP }}>
        {t("step2.loop.heading")}
      </h4>
      <p className="mt-2 text-sm text-slate-600 md:text-base">{t("step2.loop.sub_heading")}</p>
      <ol className="mt-6 space-y-4">
        {items.map((it, i) => (
          <li key={i} className="flex gap-4">
            <span
              className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: YELLOW, color: BLUE_DEEP }}
            >
              {i + 1}
            </span>
            <div>
              <p className="text-base font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                {it.title}
              </p>
              <p className="text-sm text-slate-600">{it.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ----------------------- SDG Grid -----------------------

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

function SDGGrid({ t }: { t: (k: string, fb?: string) => string }) {
  return (
    <section style={{ background: CREAM }} className="relative">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="text-center">
          <Script color={BLUE}>SDG</Script>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF, color: BLUE_DEEP }}>
            {t("sdg.main_heading")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-700">{t("sdg.sub_heading")}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SDG_NUMS.map((n) => (
            <div
              key={n}
              className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-1.5"
                style={{ background: SDG_COLORS[n] }}
              />
              <div className="flex items-start gap-3 pl-3">
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white"
                  style={{ background: SDG_COLORS[n] }}
                >
                  {n}
                </span>
                <div>
                  <p className="text-sm font-semibold leading-snug" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                    {t(`sdg.${n}.title`)}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-slate-600">{t(`sdg.${n}.desc`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------- Partners -----------------------

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

  // Match v3 names against known partners with logos
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
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="text-center">
          <Script color={BLUE}>{t("partners.script_heading")}</Script>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF, color: BLUE_DEEP }}>
            {t("partners.main_heading")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-700">{t("partners.text")}</p>
        </div>

        {matched.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
            {matched.map(({ partner }) => (
              <a
                key={partner!.name}
                href={partner!.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-24 items-center justify-center"
                title={partner!.name}
              >
                <img
                  src={partner!.logo}
                  alt={`${partner!.name} logo`}
                  loading="lazy"
                  className={cn(
                    "max-h-[90px] max-w-[200px] object-contain opacity-80 grayscale transition group-hover:opacity-100 group-hover:grayscale-0",
                  )}
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
      <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
        <div className="text-center text-white">
          <Script>{t("donation.script_heading")}</Script>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl" style={{ fontFamily: SERIF }}>
            {t("donation.main_heading")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/85 md:text-lg">
            {t("donation.text_intro")}
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
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
      <div className="mx-auto max-w-4xl px-5 py-20 text-center text-white md:px-8 md:py-28">
        <h2 className="text-3xl font-bold md:text-5xl" style={{ fontFamily: SERIF }}>
          {t("closing.main_heading")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 md:text-lg">
          {t("closing.text")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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

      <WaveDivider from={CREAM} to={CREAM_WARM} />
      <Showcase t={t} />

      <WaveDivider from={CREAM_WARM} to={CREAM} />

      {/* Step 01 — cream */}
      <StepBlock
        id="step-1"
        num={t("step1.num", "01")}
        tag={t("step1.tag")}
        heading={t("step1.heading")}
        body={t("step1.text_block")}
        ctaLabel={t("step1.cta_label")}
      >
        <div className="relative h-[360px] w-full max-w-md">
          <div className="absolute left-4 top-2">
            <CircleArt src={`${ASSET_BASE}/pureflow-problem.png`} alt={t("step1.heading")} size="lg" />
          </div>
          <div className="absolute -right-2 top-24">
            <CircleArt
              src={`${ASSET_BASE}/pureflow-womentime-problem.png`}
              alt="Firewood burden"
              size="md"
              ring="rgba(15,42,140,0.25)"
              bg="#FFFFFF"
            />
          </div>
          <div className="absolute bottom-0 left-16">
            <CircleArt
              src={`${ASSET_BASE}/pureflow-medical-problem.png`}
              alt="Healthcare burden"
              size="sm"
              ring="rgba(249,115,22,0.45)"
              bg="#FFFFFF"
            />
          </div>
        </div>
      </StepBlock>

      <WaveDivider from={CREAM} to={BLUE} />

      {/* Step 02 — dark blue */}
      <StepBlock
        id="step-2"
        num={t("step2.num", "02")}
        tag={t("step2.tag")}
        heading={t("step2.heading")}
        body={t("step2.text_block")}
        ctaLabel={t("step2.cta_label")}
        reverse
        dark
      >
        <div className="w-full">
          <div className="flex justify-center">
            <CircleArt
              src={`${ASSET_BASE}/pureflow-solution.png`}
              alt={t("step2.heading")}
              size="xl"
              ring="rgba(251,191,36,0.85)"
              bg="#FFFFFF"
            />
          </div>
          <DeliveryLoop t={t} />
        </div>
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
      >
        <div className="relative h-[340px] w-full max-w-md">
          <div className="absolute left-0 top-4">
            <CircleArt src={`${ASSET_BASE}/pureflow-school.png`} alt="School" size="lg" />
          </div>
          <div className="absolute bottom-0 right-0">
            <CircleArt
              src={`${ASSET_BASE}/pureflow-ecd.png`}
              alt="ECD"
              size="md"
              ring="rgba(20,184,166,0.5)"
              bg="#FFFFFF"
            />
          </div>
        </div>
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
      >
        <CircleArt
          src={`${ASSET_BASE}/pureflow-wash.png`}
          alt={t("step4.heading")}
          size="xl"
          ring="rgba(251,191,36,0.85)"
          bg="#FFFFFF"
        />
      </StepBlock>

      <WaveDivider from={BLUE} to={CREAM} />

      {/* Step 05 — cream */}
      <StepBlock
        id="step-5"
        num={t("step5.num", "05")}
        tag={t("step5.tag")}
        heading={t("step5.heading")}
        body={t("step5.text_block")}
        ctaLabel={t("step5.cta_label")}
      >
        <CircleArt
          src={`${ASSET_BASE}/pureflow-jobs.png`}
          alt={t("step5.heading")}
          size="xl"
          ring="rgba(251,191,36,0.85)"
          bg="#FFFFFF"
        />
      </StepBlock>

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
      >
        <div className="relative h-[360px] w-full max-w-md">
          <div className="absolute left-2 top-0">
            <CircleArt src={`${ASSET_BASE}/pureflow-cleanwater.png`} alt="Clean water" size="md" bg="#FFFFFF" />
          </div>
          <div className="absolute -right-2 top-16">
            <CircleArt src={`${ASSET_BASE}/pureflow-village.png`} alt="Village" size="lg" bg="#FFFFFF" />
          </div>
          <div className="absolute bottom-0 left-10">
            <CircleArt src={`${ASSET_BASE}/pureflow-community.png`} alt="Community" size="md" bg="#FFFFFF" />
          </div>
        </div>
      </StepBlock>

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
