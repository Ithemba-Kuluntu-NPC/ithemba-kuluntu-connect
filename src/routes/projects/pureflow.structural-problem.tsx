// Deep-dive page for PureFlow Amanzi — Step 01: Structural Problem.
// Route: /projects/pureflow/structural-problem
// Content loaded at runtime from:
//   /content/projects/pureflow-structural-problem-{lang}-v2.txt
// Language is driven by the global LanguageProvider (EN / DE / NL).

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  MapPin,
  Droplets,
  Flame,
  School,
  HeartPulse,
  Users,
  Baby,
  Clock,
  ExternalLink,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/components/site/LanguageProvider";
import type { Lang } from "@/data/content";

export const Route = createFileRoute("/projects/pureflow/structural-problem")({
  head: () => ({
    meta: [
      { title: "The Structural Water Access Problem | PureFlow Amanzi" },
      {
        name: "description",
        content:
          "A visual deep-dive into the gap between reported water access and the lived reality of rural households, women, children, schools and ECD centres in South Africa.",
      },
      { property: "og:title", content: "The Structural Water Access Problem | PureFlow Amanzi" },
      {
        property: "og:description",
        content:
          "Reported access is not functional access. See the field reality PureFlow Amanzi responds to.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StructuralProblemPage,
});

// ----------------------- Tokens -----------------------

const BLUE = "#0F2A8C";
const BLUE_DEEP = "#081A60";
const YELLOW = "#FBBF24";
const CREAM = "#FBF6E9";
const CREAM_WARM = "#F5EDD7";
const SERIF = '"Fraunces", "Georgia", serif';
const SCRIPT = '"Caveat", "Kalam", cursive';

const PHOTOS = {
  hero: "/assets/photos/projects/pureflow/pureflow-step-01-structural-problem.jpg",
  hero2: "/assets/photos/projects/pureflow/pureflow-step-01-structural-problem-2.jpg",
  hero3: "/assets/photos/projects/pureflow/pureflow-step-01-structural-problem-3.jpg",
  hero4: "/assets/photos/projects/pureflow/pureflow-step-01-structural-problem-4.jpg",
  heroBg: "/assets/photos/projects/pureflow/pureflow-step-01-structural-problem-background.jpg",
  response: "/assets/photos/projects/pureflow/pureflow-step-02-pureflow-model.jpg",
  closing: "/assets/photos/projects/pureflow/pureflow-closing-group-filters.jpg",
  benefit: "/assets/photos/projects/pureflow/pureflow-step-03-immediate-public-benefit.jpg",
};

// ----------------------- Content parser -----------------------

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
      lastKey = null;
      continue;
    }
    const m = trimmed.match(keyLine);
    if (m && !/^https?:/.test(m[2])) {
      lastKey = m[1];
      out[lastKey] = m[2].trim();
      continue;
    }
    if (lastKey) {
      out[lastKey] = out[lastKey] ? out[lastKey] + "\n" + trimmed : trimmed;
    }
  }
  return out;
}

function useDeepDiveContent(lang: Lang) {
  const [dict, setDict] = useState<Dict>({});
  const [enFallback, setEnFallback] = useState<Dict>({});

  useEffect(() => {
    let cancelled = false;
    fetch(`/content/projects/pureflow-structural-problem-en-v2.txt`)
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => !cancelled && setEnFallback(parseContent(t)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/content/projects/pureflow-structural-problem-${lang}-v2.txt`)
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => !cancelled && setDict(parseContent(t)))
      .catch(() => setDict({}));
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return useMemo(() => {
    const get = (k: string): string => dict[k] || enFallback[k] || "";
    const list = (k: string): string[] =>
      get(k)
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    return { get, list };
  }, [dict, enFallback]);
}

// ----------------------- Small building blocks -----------------------

function ScriptHead({ children, color = YELLOW }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="text-2xl md:text-3xl mb-3"
      style={{ fontFamily: SCRIPT, color }}
    >
      {children}
    </div>
  );
}

function SerifH2({
  children,
  color = "white",
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <h2
      className={cn("text-3xl md:text-5xl font-normal leading-[1.1] tracking-tight", className)}
      style={{ fontFamily: SERIF, color }}
    >
      {children}
    </h2>
  );
}

function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  const paras = text.split("\n").filter(Boolean);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className={cn("text-base md:text-lg leading-relaxed", className)}>
          {p}
        </p>
      ))}
    </>
  );
}

function WaveDivider({ from, to }: { from: string; to: string }) {
  return (
    <div className="relative -mt-px" style={{ background: from }}>
      <svg viewBox="0 0 1440 60" className="block w-full h-[40px] md:h-[56px]" preserveAspectRatio="none">
        <path d="M0,30 C240,60 480,0 720,20 C960,40 1200,50 1440,20 L1440,60 L0,60 Z" fill={to} />
      </svg>
    </div>
  );
}

// ----------------------- Page -----------------------

function StructuralProblemPage() {
  const { lang } = useLang();
  const { get, list } = useDeepDiveContent(lang);

  return (
    <main className="min-h-screen" style={{ background: CREAM }}>
      <Hero get={get} />
      <ReportedVsFunctional get={get} list={list} />
      <StatsGrid get={get} />
      <TrueSource get={get} />
      <FieldReality get={get} />
      <WomenChildren get={get} list={list} />
      <PovertyFunnel get={get} />
      <HealthLearning get={get} list={list} />
      <BeyondHousehold get={get} />
      <PureFlowResponse get={get} />
      <SourcesAccordion get={get} />
      <ClosingNav get={get} />
    </main>
  );
}

// ----------------------- Section 01: Hero -----------------------

function Hero({ get }: { get: (k: string) => string }) {
  return (
    <section className="relative overflow-hidden" style={{ background: BLUE_DEEP }}>
      <div className="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-2">
        <div className="relative z-10 px-6 py-16 md:px-12 md:py-20 lg:py-24">
          <Link
            to="/projects/pureflow"
            hash="structural-problem"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> {get("hero.secondary_cta_label") || "Back"}
          </Link>
          <ScriptHead>{get("hero.small_heading")}</ScriptHead>
          <SerifH2 className="mb-6">{get("hero.main_heading")}</SerifH2>
          <p className="text-lg md:text-xl text-white/90 mb-5 leading-relaxed">{get("hero.hook")}</p>
          <Paragraphs text={get("hero.intro")} className="text-white/80 mb-6" />
          <div
            className="border-l-4 pl-4 py-2 mb-8 italic text-white/95 text-base md:text-lg"
            style={{ borderColor: YELLOW, fontFamily: SERIF }}
          >
            {get("hero.proof_line")}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={get("hero.primary_cta_target") || "#reported-vs-functional-access"}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              style={{ background: YELLOW, color: BLUE_DEEP }}
            >
              {get("hero.primary_cta_label")} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="relative min-h-[300px] lg:min-h-full">
          <img
            src={PHOTOS.hero}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = PHOTOS.heroBg;
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(8,26,96,0.55) 0%, rgba(8,26,96,0.15) 40%, rgba(8,26,96,0.05) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ----------------------- Section 02: Reported vs Functional -----------------------

function ReportedVsFunctional({
  get,
  list,
}: {
  get: (k: string) => string;
  list: (k: string) => string[];
}) {
  const left = list("section_02.graphic_left_items");
  const right = list("section_02.graphic_right_items");
  return (
    <section
      id="reported-vs-functional-access"
      className="px-6 py-14 md:py-20 scroll-mt-24"
      style={{ background: CREAM }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl mb-10">
          <ScriptHead color={BLUE}>{get("section_02.small_heading")}</ScriptHead>
          <SerifH2 color={BLUE_DEEP} className="mb-5">
            {get("section_02.main_heading")}
          </SerifH2>
          <Paragraphs text={get("section_02.copy")} className="text-slate-700" />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border-2 p-6 md:p-7" style={{ borderColor: "#E7C9C1", background: "#FFF3EE" }}>
            <div className="text-xs font-semibold uppercase tracking-widest text-orange-800 mb-2">
              {get("section_02.graphic_left_heading")}
            </div>
            <ul className="space-y-2">
              {left.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-800">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-orange-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-6 md:p-7 text-white" style={{ background: BLUE }}>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: YELLOW }}
            >
              {get("section_02.graphic_right_heading")}
            </div>
            <ul className="space-y-2">
              {right.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: YELLOW }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <blockquote
          className="mt-8 max-w-3xl text-xl md:text-2xl italic"
          style={{ fontFamily: SERIF, color: BLUE_DEEP }}
        >
          <Quote className="inline h-5 w-5 mr-1" style={{ color: YELLOW }} />
          {get("section_02.pull_quote")}
        </blockquote>
        {get("section_02.source_note") && (
          <p className="mt-6 text-xs text-slate-600 max-w-3xl">
            {get("section_02.source_note")}{" "}
            {get("section_02.source_url") && (
              <a
                href={get("section_02.source_url")}
                target="_blank"
                rel="noreferrer"
                className="underline hover:no-underline"
                style={{ color: BLUE }}
              >
                {get("section_02.source_label")}
              </a>
            )}
          </p>
        )}
      </div>
    </section>
  );
}

// ----------------------- Section 03: Stats grid -----------------------

function StatsGrid({ get }: { get: (k: string) => string }) {
  const cards = [1, 2, 3, 4, 5, 6].map((n) => {
    const p = `stat_card_0${n}`;
    return {
      number: get(`${p}.number`),
      label: get(`${p}.label`),
      sub: get(`${p}.sub_label`),
      sourceLabel: get(`${p}.source_label`),
      sourceUrl: get(`${p}.source_url`),
    };
  });
  return (
    <section className="px-6 py-14 md:py-20" style={{ background: BLUE_DEEP }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl mb-10">
          <ScriptHead>{get("section_03.small_heading")}</ScriptHead>
          <SerifH2 className="mb-5">{get("section_03.main_heading")}</SerifH2>
          <Paragraphs text={get("section_03.copy")} className="text-white/85" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <div
                className="text-4xl md:text-5xl font-bold mb-2 leading-none"
                style={{ color: YELLOW, fontFamily: SERIF }}
              >
                {c.number}
              </div>
              <div className="text-white text-sm md:text-base leading-snug">{c.label}</div>
              {c.sub && <div className="mt-2 text-white/60 text-xs leading-snug">{c.sub}</div>}
              {c.sourceUrl && (
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-white/80"
                >
                  <ExternalLink className="h-3 w-3" /> source
                </a>
              )}
            </div>
          ))}
        </div>
        {get("section_03.close_copy") && (
          <p className="mt-8 max-w-3xl text-white/85 text-base md:text-lg leading-relaxed">
            {get("section_03.close_copy")}
          </p>
        )}
      </div>
    </section>
  );
}

// ----------------------- Section 04: True Source -----------------------

function TrueSource({ get }: { get: (k: string) => string }) {
  return (
    <section className="px-6 py-14 md:py-20" style={{ background: CREAM_WARM }}>
      <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <ScriptHead color={BLUE}>{get("section_04.small_heading")}</ScriptHead>
          <SerifH2 color={BLUE_DEEP} className="mb-5">
            {get("section_04.main_heading")}
          </SerifH2>
          <Paragraphs text={get("section_04.copy")} className="text-slate-700 mb-4" />
          <div className="mt-5 border-l-4 pl-4 py-2 text-slate-700 italic" style={{ borderColor: YELLOW }}>
            {get("section_04.supporting_copy")}
          </div>
          {get("section_04.source_url") && (
            <a
              href={get("section_04.source_url")}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs underline"
              style={{ color: BLUE }}
            >
              <ExternalLink className="h-3 w-3" /> {get("section_04.source_label")}
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src={PHOTOS.hero2} alt="" className="h-56 md:h-72 w-full object-cover rounded-2xl" />
          <img src={PHOTOS.hero3} alt="" className="h-56 md:h-72 w-full object-cover rounded-2xl mt-6" />
          <img src={PHOTOS.hero4} alt="" className="h-40 md:h-56 w-full object-cover rounded-2xl col-span-2" />
        </div>
      </div>
    </section>
  );
}

// ----------------------- Section 05: Field Reality -----------------------

function FieldReality({ get }: { get: (k: string) => string }) {
  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden">
      <div className="absolute inset-0">
        <img src={PHOTOS.heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(8,26,96,0.82)" }} />
      </div>
      <div className="relative mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/80 mb-3">
            <MapPin className="h-4 w-4" style={{ color: YELLOW }} /> Pondoland · Eastern Cape
          </div>
          <ScriptHead>{get("section_05.small_heading")}</ScriptHead>
          <SerifH2 className="mb-5">{get("section_05.main_heading")}</SerifH2>
          <Paragraphs text={get("section_05.copy")} className="text-white/85" />
        </div>
        <aside
          className="rounded-2xl p-6 md:p-7 border"
          style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.18)" }}
        >
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: YELLOW }}>
            {get("section_05.field_note_title")}
          </div>
          <p className="text-white text-lg italic leading-relaxed" style={{ fontFamily: SERIF }}>
            "{get("section_05.field_note_copy")}"
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <img src={PHOTOS.hero2} alt="" className="h-28 w-full object-cover rounded-lg" />
            <img src={PHOTOS.hero3} alt="" className="h-28 w-full object-cover rounded-lg" />
          </div>
        </aside>
      </div>
    </section>
  );
}

// ----------------------- Section 06: Women, Children & Unpaid Labour -----------------------

function WomenChildren({
  get,
  list,
}: {
  get: (k: string) => string;
  list: (k: string) => string[];
}) {
  const items = list("section_06.timeline_items");
  return (
    <section className="relative overflow-hidden" style={{ background: BLUE_DEEP }}>
      <div className="absolute inset-0 opacity-20">
        <img src={PHOTOS.hero4} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,26,96,0.85), rgba(8,26,96,0.95))" }} />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="max-w-3xl mb-10">
          <ScriptHead>{get("section_06.small_heading")}</ScriptHead>
          <SerifH2 className="mb-5">{get("section_06.main_heading")}</SerifH2>
          <Paragraphs text={get("section_06.copy")} className="text-white/90 mb-4" />
          <div
            className="mt-5 border-l-4 pl-4 py-2 text-white/85 italic"
            style={{ borderColor: YELLOW }}
          >
            {get("section_06.supporting_copy")}
          </div>
        </div>

        {/* Daily chain */}
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: YELLOW }}>
            {get("section_06.timeline_title")}
          </div>
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl p-3 border"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: YELLOW, color: BLUE_DEEP }}
                >
                  {i + 1}
                </span>
                <span className="text-white/90 text-sm md:text-base leading-snug pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Sub cards */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl p-6 border" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5" style={{ color: YELLOW }} />
              <div className="text-white font-semibold" style={{ fontFamily: SERIF }}>
                {get("section_06.body_burden_heading")}
              </div>
            </div>
            <p className="text-white/85 text-sm md:text-base leading-relaxed">
              {get("section_06.body_burden_copy")}
            </p>
          </div>
          <div className="rounded-2xl p-6 border" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5" style={{ color: YELLOW }} />
              <div className="text-white font-semibold" style={{ fontFamily: SERIF }}>
                {get("section_06.firewood_tax_heading")}
              </div>
            </div>
            <p className="text-white/85 text-sm md:text-base leading-relaxed">
              {get("section_06.firewood_tax_copy")}
            </p>
            {get("section_06.firewood_tax_note") && (
              <p className="mt-3 text-white/70 text-xs italic">{get("section_06.firewood_tax_note")}</p>
            )}
          </div>
        </div>

        {get("section_06.source_url") && (
          <a
            href={get("section_06.source_url")}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-1 text-xs text-white/60 hover:text-white/90 underline"
          >
            <ExternalLink className="h-3 w-3" /> {get("section_06.source_label")}
          </a>
        )}
      </div>
    </section>
  );
}

// ----------------------- Section 07: Poverty Funnel -----------------------

function PovertyFunnel({ get }: { get: (k: string) => string }) {
  const steps = [1, 2, 3, 4, 5]
    .map((n) => get(`section_07.card_0${n}`)) // in case future
    .filter(Boolean);
  // The v2 file doesn't use section_07.card_0N keys — parse from the visual_direction text.
  // Fallback: hardcoded semantic labels derived from v2 (all three languages carry the same 5-step list in visual_direction).
  const fallbackSteps = [
    "No reliable public water",
    "No paid alternative",
    "Open source or shared source",
    "Unsafe water enters the home",
    "Illness, time loss and extra costs follow",
  ];
  const list = steps.length ? steps : fallbackSteps;
  return (
    <section className="px-6 py-14 md:py-20" style={{ background: CREAM }}>
      <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
        <div>
          <ScriptHead color={BLUE}>{get("section_07.small_heading")}</ScriptHead>
          <SerifH2 color={BLUE_DEEP} className="mb-5">
            {get("section_07.main_heading")}
          </SerifH2>
          <Paragraphs text={get("section_07.copy")} className="text-slate-700 mb-4" />
          <blockquote
            className="mt-5 text-lg md:text-xl italic border-l-4 pl-4"
            style={{ borderColor: YELLOW, color: BLUE_DEEP, fontFamily: SERIF }}
          >
            {get("section_07.pull_quote")}
          </blockquote>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: BLUE }}>
            When there is no money for a safer option
          </div>
          <div className="space-y-2">
            {list.map((step, i) => {
              const width = 100 - i * 12;
              return (
                <div
                  key={i}
                  className="mx-auto rounded-xl px-4 py-3 text-white flex items-center gap-3 shadow-sm"
                  style={{
                    width: `${width}%`,
                    background: i === list.length - 1 ? "#B45309" : BLUE,
                  }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: YELLOW, color: BLUE_DEEP }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm md:text-base">{step}</span>
                </div>
              );
            })}
          </div>
          {get("section_07.supporting_copy") && (
            <p className="mt-6 text-slate-600 text-sm italic">
              {get("section_07.supporting_copy")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ----------------------- Section 08: Health & Learning -----------------------

function HealthLearning({
  get,
  list,
}: {
  get: (k: string) => string;
  list: (k: string) => string[];
}) {
  const cards = [
    {
      title: get("section_08.card_01_title"),
      items: list("section_08.card_01_items"),
      icon: HeartPulse,
    },
    {
      title: get("section_08.card_02_title"),
      items: list("section_08.card_02_items"),
      icon: Users,
    },
    {
      title: get("section_08.card_03_title"),
      items: list("section_08.card_03_items"),
      icon: School,
    },
  ];
  return (
    <section className="px-6 py-14 md:py-20" style={{ background: CREAM_WARM }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl mb-10">
          <ScriptHead color={BLUE}>{get("section_08.small_heading")}</ScriptHead>
          <SerifH2 color={BLUE_DEEP} className="mb-5">
            {get("section_08.main_heading")}
          </SerifH2>
          <Paragraphs text={get("section_08.copy")} className="text-slate-700" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border"
              style={{ background: "white", borderColor: "#E7DDBF" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <c.icon className="h-5 w-5" style={{ color: BLUE }} />
                <div className="font-semibold text-lg" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                  {c.title}
                </div>
              </div>
              <ul className="space-y-1.5">
                {c.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2 text-slate-700 text-sm">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full" style={{ background: YELLOW }} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {get("section_08.supporting_copy") && (
          <p className="mt-6 text-slate-600 text-sm italic max-w-3xl">
            {get("section_08.supporting_copy")}
          </p>
        )}
        {get("section_08.source_url") && (
          <a
            href={get("section_08.source_url")}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs underline"
            style={{ color: BLUE }}
          >
            <ExternalLink className="h-3 w-3" /> {get("section_08.source_label")}
          </a>
        )}
      </div>
    </section>
  );
}

// ----------------------- Section 09: Beyond the Household -----------------------

function BeyondHousehold({ get }: { get: (k: string) => string }) {
  const cards = [
    { title: get("section_09.card_01_title"), copy: get("section_09.card_01_copy"), icon: School },
    { title: get("section_09.card_02_title"), copy: get("section_09.card_02_copy"), icon: Baby },
    { title: get("section_09.card_03_title"), copy: get("section_09.card_03_copy"), icon: HeartPulse },
  ];
  return (
    <section className="relative overflow-hidden px-6 py-14 md:py-20">
      <div className="absolute inset-0">
        <img src={PHOTOS.benefit} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(15,42,140,0.78)" }} />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl mb-10">
          <ScriptHead>{get("section_09.small_heading")}</ScriptHead>
          <SerifH2 className="mb-5">{get("section_09.main_heading")}</SerifH2>
          <Paragraphs text={get("section_09.copy")} className="text-white/90" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border"
              style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)" }}
            >
              <c.icon className="h-6 w-6 mb-3" style={{ color: YELLOW }} />
              <div className="font-semibold text-lg mb-2 text-white" style={{ fontFamily: SERIF }}>
                {c.title}
              </div>
              <p className="text-white/85 text-sm leading-relaxed">{c.copy}</p>
            </div>
          ))}
        </div>
        {get("section_09.stat_line") && (
          <p className="mt-6 text-white/80 text-sm italic max-w-3xl">{get("section_09.stat_line")}</p>
        )}
      </div>
    </section>
  );
}

// ----------------------- Section 10: PureFlow Response -----------------------

function PureFlowResponse({ get }: { get: (k: string) => string }) {
  return (
    <section className="px-6 py-14 md:py-20" style={{ background: CREAM }}>
      <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1fr_1fr] items-center">
        <div>
          <ScriptHead color={BLUE}>{get("section_10.small_heading")}</ScriptHead>
          <SerifH2 color={BLUE_DEEP} className="mb-5">
            {get("section_10.main_heading")}
          </SerifH2>
          <Paragraphs text={get("section_10.copy")} className="text-slate-700 mb-4" />
          <div
            className="mt-4 rounded-xl p-4 italic border-l-4"
            style={{ background: "white", borderColor: YELLOW, color: BLUE_DEEP, fontFamily: SERIF }}
          >
            {get("section_10.closing_line")}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/projects/pureflow"
              hash="structural-problem"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border-2"
              style={{ borderColor: BLUE, color: BLUE }}
            >
              <ArrowLeft className="h-4 w-4" /> {get("section_10.button_01_label")}
            </Link>
            <a
              href={get("section_10.button_02_url") || "/projects/pureflow"}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: BLUE }}
            >
              {get("section_10.button_02_label")} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src={PHOTOS.response} alt="" className="h-40 md:h-56 w-full object-cover rounded-2xl" />
          <img src={PHOTOS.closing} alt="" className="h-40 md:h-56 w-full object-cover rounded-2xl mt-6"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }} />
          <img src={PHOTOS.benefit} alt="" className="h-32 md:h-40 w-full object-cover rounded-2xl col-span-2" />
        </div>
      </div>
    </section>
  );
}

// ----------------------- Sources Accordion -----------------------

function SourcesAccordion({ get }: { get: (k: string) => string }) {
  const [open, setOpen] = useState(false);
  const items = [1, 2, 3, 4, 5, 6]
    .map((n) => ({ label: get(`source_0${n}.label`), url: get(`source_0${n}.url`) }))
    .filter((x) => x.label && x.url);
  if (!items.length) return null;
  return (
    <section className="px-6 py-10 md:py-12" style={{ background: CREAM_WARM }}>
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between rounded-xl px-5 py-3 border"
          style={{ background: "white", borderColor: "#E7DDBF", color: BLUE_DEEP }}
        >
          <span className="font-semibold" style={{ fontFamily: SERIF }}>
            Sources ({items.length})
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <ul className="mt-3 space-y-2 rounded-xl bg-white p-4 border" style={{ borderColor: "#E7DDBF" }}>
            {items.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2 text-sm underline hover:no-underline"
                  style={{ color: BLUE }}
                >
                  <ExternalLink className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ----------------------- Closing Nav -----------------------

function ClosingNav({ get }: { get: (k: string) => string }) {
  return (
    <section className="px-6 py-10 md:py-14" style={{ background: BLUE_DEEP }}>
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <Link
          to="/projects/pureflow"
          hash="structural-problem"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> {get("section_10.button_01_label") || "Back to PureFlow Amanzi"}
        </Link>
        <a
          href={get("section_10.button_02_url") || "/projects/pureflow"}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          style={{ background: YELLOW, color: BLUE_DEEP }}
        >
          {get("section_10.button_02_label") || "Step 02"} <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
