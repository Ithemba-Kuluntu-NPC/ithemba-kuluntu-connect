// Deep-dive page for PureFlow Amanzi — Step 01: Structural Problem.
// Route: /projects/pureflow/structural-problem
// Content is loaded at runtime from:
//   /content/projects/pureflow-structural-problem-{lang}-v1.txt
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
  AlertTriangle,
  ExternalLink,
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
          "A visual deep-dive into the gap between reported water access and the lived reality of rural households, schools and clinics in South Africa.",
      },
      { property: "og:title", content: "The Structural Water Access Problem | PureFlow Amanzi" },
      {
        property: "og:description",
        content:
          "Reported access is not the same as functional access. See the field reality PureFlow Amanzi responds to.",
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
  benefit: "/assets/photos/projects/pureflow/pureflow-step-03-immediate-public-benefit.jpg",
};

// ----------------------- Content parser -----------------------

type Dict = Record<string, string>;

/**
 * Parses "key:" then N indented/plain content lines until the next key or blank line.
 * Preserves line breaks between successive content lines so list-like values
 * (e.g. `section_02.graphic_left_items:`) keep their per-line entries.
 */
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
      // treat as new key unless the "value" looks like a URL (which would happen
      // on a bare source_url line — but those always have a proper key prefix).
      lastKey = m[1];
      out[lastKey] = m[2].trim();
      continue;
    }
    if (m) {
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
    fetch(`/content/projects/pureflow-structural-problem-en-v1.txt`)
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => !cancelled && setEnFallback(parseContent(t)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/content/projects/pureflow-structural-problem-${lang}-v1.txt`)
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => !cancelled && setDict(parseContent(t)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return useMemo(() => {
    const t = (key: string, fb = ""): string => dict[key] ?? enFallback[key] ?? fb;
    const list = (key: string): string[] =>
      t(key)
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    return { t, list };
  }, [dict, enFallback]);
}

// ----------------------- Small primitives -----------------------

function Script({ children, color = YELLOW }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="text-2xl md:text-3xl leading-none" style={{ fontFamily: SCRIPT, color }}>
      {children}
    </p>
  );
}

function WaveDivider({
  from = CREAM,
  to = BLUE_DEEP,
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
      <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block h-[40px] w-full md:h-[60px]">
        <path
          d="M0,35 C240,70 480,0 720,35 C960,70 1200,5 1440,40 L1440,70 L0,70 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}

function SectionLabel({
  small,
  heading,
  onDark = false,
}: {
  small: string;
  heading: string;
  onDark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <Script color={YELLOW}>{small}</Script>
      <h2
        className="mt-2 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
        style={{ fontFamily: SERIF, color: onDark ? "#FFFFFF" : BLUE_DEEP }}
      >
        {heading}
      </h2>
    </div>
  );
}

// ----------------------- Page -----------------------

function StructuralProblemPage() {
  const { lang } = useLang();
  const { t, list } = useDeepDiveContent(lang);

  return (
    <main style={{ background: CREAM }} className="min-h-screen">
      {/* ---------- HERO ---------- */}
      <section className="relative isolate overflow-hidden" style={{ background: BLUE_DEEP }}>
        <img
          src={PHOTOS.heroBg}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,26,96,0.85) 0%, rgba(15,42,140,0.75) 60%, rgba(8,26,96,0.65) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 pt-10 md:px-8 md:pt-14">
          <Link
            to="/projects/pureflow"
            hash="structural-problem"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("page.back_button_label", "Back to PureFlow Amanzi")}
          </Link>
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <Script>{t("hero.small_heading", "Step 01 // Structural Problem")}</Script>
            <h1
              className="mt-3 text-4xl font-bold leading-[1.05] text-white md:text-5xl lg:text-6xl"
              style={{ fontFamily: SERIF }}
            >
              {t("hero.main_heading")}
            </h1>
            <p className="mt-6 text-lg font-medium text-white/95 md:text-xl">
              {t("hero.hook")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/85 md:text-lg">
              {t("hero.intro")}
            </p>
            <p
              className="mt-6 border-l-4 pl-4 text-base italic text-white/95 md:text-lg"
              style={{ borderColor: YELLOW }}
            >
              {t("hero.proof_line")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#reported-vs-functional-access"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-md transition hover:shadow-lg"
                style={{ background: YELLOW, color: BLUE_DEEP }}
              >
                {t("hero.primary_cta_label", "See the reality")}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/projects/pureflow"
                hash="structural-problem"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t("hero.secondary_cta_label", "Back to PureFlow Amanzi")}
              </Link>
            </div>
          </div>

          {/* photo collage */}
          <div className="relative">
            <div className="grid aspect-[4/5] grid-cols-12 grid-rows-6 gap-2.5 md:gap-3"
                 style={{ filter: "drop-shadow(0 28px 60px rgba(0,0,0,0.5))" }}>
              <div className="col-span-7 row-span-4 overflow-hidden rounded-tl-[2.5rem] rounded-br-2xl rounded-tr-xl rounded-bl-xl ring-1 ring-white/10">
                <img src={PHOTOS.hero} alt="Rural water reality" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: "center 30%" }} />
              </div>
              <div className="col-span-5 row-span-3 overflow-hidden rounded-tr-[2.5rem] ring-1 ring-white/10">
                <img src={PHOTOS.hero2} alt="Daily collection" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="col-span-5 row-span-3 overflow-hidden rounded-xl ring-1 ring-white/10">
                <img src={PHOTOS.hero3} alt="Unsafe source" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="col-span-7 row-span-2 overflow-hidden rounded-bl-[2.5rem] ring-1 ring-white/10">
                <img src={PHOTOS.hero4} alt="Community context" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Section 02: Reported vs Functional ---------- */}
      <section
        id="reported-vs-functional-access"
        className="relative"
        style={{ background: CREAM, scrollMarginTop: "calc(var(--header-height, 80px) + 16px)" }}
      >
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <SectionLabel small={t("section_02.small_heading")} heading={t("section_02.main_heading")} />
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
            {t("section_02.copy").split(/\n{1,}/).filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <ComparisonCard
              tone="warn"
              heading={t("section_02.graphic_left_heading", "Reported access")}
              items={list("section_02.graphic_left_items")}
            />
            <ComparisonCard
              tone="good"
              heading={t("section_02.graphic_right_heading", "Functional access")}
              items={list("section_02.graphic_right_items")}
            />
          </div>

          {t("section_02.pull_quote") && (
            <blockquote
              className="mt-10 border-l-4 pl-5 text-xl italic md:text-2xl"
              style={{ borderColor: YELLOW, color: BLUE_DEEP, fontFamily: SERIF }}
            >
              “{t("section_02.pull_quote")}”
            </blockquote>
          )}
          {t("section_02.source_note") && (
            <p className="mt-6 max-w-3xl text-sm text-slate-500">{t("section_02.source_note")}</p>
          )}
        </div>
      </section>

      <WaveDivider from={CREAM} to={BLUE_DEEP} />

      {/* ---------- Section 03: Stats grid ---------- */}
      <section className="relative" style={{ background: BLUE_DEEP }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <SectionLabel onDark small={t("section_03.small_heading")} heading={t("section_03.main_heading")} />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
            {t("section_03.copy")}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => {
              const num = t(`stat_card_0${i}.number`);
              if (!num) return null;
              return (
                <StatCard
                  key={i}
                  number={num}
                  label={t(`stat_card_0${i}.label`)}
                  sub={t(`stat_card_0${i}.sub_label`)}
                  sourceLabel={t(`stat_card_0${i}.source_label`)}
                />
              );
            })}
          </div>

          <p className="mt-8 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
            {t("section_03.close_copy")}
          </p>
        </div>
      </section>

      <WaveDivider from={BLUE_DEEP} to={CREAM} />

      {/* ---------- Section 04: True Source ---------- */}
      <TextImageSection
        small={t("section_04.small_heading")}
        heading={t("section_04.main_heading")}
        copy={t("section_04.copy")}
        supporting={t("section_04.supporting_copy")}
        photos={[PHOTOS.hero3, PHOTOS.hero2]}
      />

      {/* ---------- Section 05: Field reality (dark) ---------- */}
      <div style={{ background: CREAM }}>
        <WaveDivider from={CREAM} to="#123A6E" />
      </div>
      <section className="relative" style={{ background: "#123A6E" }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                <MapPin className="h-3.5 w-3.5" style={{ color: YELLOW }} />
                {t("section_05.small_heading", "Field reality")}
              </div>
              <h2
                className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl"
                style={{ fontFamily: SERIF }}
              >
                {t("section_05.main_heading")}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-white/85 md:text-lg">
                {t("section_05.copy").split(/\n{1,}/).filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div
                className="mt-8 rounded-2xl border p-6"
                style={{ borderColor: "rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.08)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: YELLOW }}>
                  {t("section_05.field_note_title", "Local field observation")}
                </p>
                <p className="mt-2 text-base italic text-white/95 md:text-lg" style={{ fontFamily: SERIF }}>
                  “{t("section_05.field_note_copy")}”
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <img src={PHOTOS.hero4} alt="Pondoland field" className="col-span-2 h-56 w-full rounded-2xl object-cover md:h-72" />
              <img src={PHOTOS.hero2} alt="Community collection" className="h-40 w-full rounded-2xl object-cover md:h-52" />
              <img src={PHOTOS.hero3} alt="Water source" className="h-40 w-full rounded-2xl object-cover md:h-52" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Section 06: Rainwater / storage path ---------- */}
      <section className="relative" style={{ background: CREAM_WARM }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <SectionLabel small={t("section_06.small_heading")} heading={t("section_06.main_heading")} />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-700 md:text-lg">
            {t("section_06.copy")}
          </p>

          <PathGraphic
            path={t("section_06.graphic_path")}
            risks={t("section_06.graphic_risks")}
          />
        </div>
      </section>

      {/* ---------- Section 07: Poverty and water choices ---------- */}
      <section className="relative" style={{ background: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <SectionLabel small={t("section_07.small_heading")} heading={t("section_07.main_heading")} />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-700 md:text-lg">
            {t("section_07.copy").split(/\n{1,}/)[0]}
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <ComparisonCard
              tone="good"
              heading={t("section_07.left_heading")}
              items={list("section_07.left_items")}
            />
            <ComparisonCard
              tone="warn"
              heading={t("section_07.right_heading")}
              items={list("section_07.right_items")}
            />
          </div>

          {t("section_07.pull_quote") && (
            <blockquote
              className="mt-10 border-l-4 pl-5 text-xl italic md:text-2xl"
              style={{ borderColor: YELLOW, color: BLUE_DEEP, fontFamily: SERIF }}
            >
              “{t("section_07.pull_quote")}”
            </blockquote>
          )}
        </div>
      </section>

      {/* ---------- Section 08: Women and children timeline ---------- */}
      <div style={{ background: CREAM }}>
        <WaveDivider from={CREAM} to={BLUE_DEEP} />
      </div>
      <section className="relative" style={{ background: BLUE_DEEP }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <SectionLabel onDark small={t("section_08.small_heading")} heading={t("section_08.main_heading")} />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
            {t("section_08.copy").split(/\n{1,}/)[0]}
          </p>

          <Timeline items={list("section_08.timeline_items")} />

          {t("section_08.supporting_copy") && (
            <p className="mt-10 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
              {t("section_08.supporting_copy")}
            </p>
          )}
        </div>
      </section>

      <WaveDivider from={BLUE_DEEP} to={CREAM} />

      {/* ---------- Section 09: Just boil it — firewood tax ---------- */}
      <section className="relative" style={{ background: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <SectionLabel small={t("section_09.small_heading")} heading={t("section_09.main_heading")} />
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
            {t("section_09.copy").split(/\n{1,}/).filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div
            className="mt-10 rounded-3xl border-2 p-6 md:p-8"
            style={{ borderColor: YELLOW, background: "#FFFDF3" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: YELLOW, color: BLUE_DEEP }}
              >
                <Flame className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold md:text-2xl" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
                The Firewood Tax
              </h3>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <ComparisonCard
                tone="warn"
                heading={t("section_09.before_heading", "Before filtration")}
                items={list("section_09.before_items")}
                compact
              />
              <ComparisonCard
                tone="good"
                heading={t("section_09.after_heading", "With PureFlow Amanzi")}
                items={list("section_09.after_items")}
                compact
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Section 10: Health & learning ---------- */}
      <section className="relative" style={{ background: CREAM_WARM }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <SectionLabel small={t("section_10.small_heading")} heading={t("section_10.main_heading")} />
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
            {t("section_10.copy").split(/\n{1,}/).filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <LinkedCard
              icon={<HeartPulse className="h-5 w-5" />}
              title={t("section_10.card_01_title", "Illness")}
              items={list("section_10.card_01_items")}
            />
            <LinkedCard
              icon={<AlertTriangle className="h-5 w-5" />}
              title={t("section_10.card_02_title", "Household cost")}
              items={list("section_10.card_02_items")}
            />
            <LinkedCard
              icon={<School className="h-5 w-5" />}
              title={t("section_10.card_03_title", "Learning cost")}
              items={list("section_10.card_03_items")}
            />
          </div>

          {t("section_10.supporting_copy") && (
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
              {t("section_10.supporting_copy")}
            </p>
          )}
        </div>
      </section>

      {/* ---------- Section 11: Schools & clinics ---------- */}
      <section className="relative" style={{ background: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <SectionLabel small={t("section_11.small_heading")} heading={t("section_11.main_heading")} />
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
                {t("section_11.copy").split(/\n{1,}/).filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {t("section_11.stat_line") && (
                <div
                  className="mt-6 rounded-2xl p-5"
                  style={{ background: "rgba(15,42,140,0.06)", color: BLUE_DEEP }}
                >
                  <p className="text-base font-semibold md:text-lg">{t("section_11.stat_line")}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex h-56 items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:h-64">
                <School className="h-16 w-16" style={{ color: BLUE }} />
              </div>
              <div className="flex h-40 items-center justify-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:h-52">
                <HeartPulse className="h-12 w-12" style={{ color: BLUE }} />
              </div>
              <div className="flex h-40 items-center justify-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:h-52">
                <Users className="h-12 w-12" style={{ color: BLUE }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Section 12: Systemic failure ---------- */}
      <div style={{ background: CREAM }}>
        <WaveDivider from={CREAM} to={BLUE_DEEP} />
      </div>
      <section className="relative" style={{ background: BLUE_DEEP }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <SectionLabel onDark small={t("section_12.small_heading")} heading={t("section_12.main_heading")} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div className="space-y-4 text-base leading-relaxed text-white/85 md:text-lg">
              {t("section_12.copy").split(/\n{1,}/).filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {t("section_12.pull_quote") && (
                <blockquote
                  className="mt-4 border-l-4 pl-4 text-lg italic text-white md:text-xl"
                  style={{ borderColor: YELLOW, fontFamily: SERIF }}
                >
                  “{t("section_12.pull_quote")}”
                </blockquote>
              )}
            </div>
            <LayeredSystem
              outer={t("section_12.outer_layer")}
              middle={t("section_12.middle_layer")}
              household={t("section_12.household_layer")}
              core={t("section_12.core")}
            />
          </div>
        </div>
      </section>

      <WaveDivider from={BLUE_DEEP} to={CREAM} />

      {/* ---------- Section 13: PureFlow response ---------- */}
      <section className="relative" style={{ background: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <SectionLabel small={t("section_13.small_heading")} heading={t("section_13.main_heading")} />
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
                {t("section_13.copy").split(/\n{1,}/).filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {t("section_13.closing_line") && (
                <p
                  className="mt-6 text-xl italic md:text-2xl"
                  style={{ color: BLUE_DEEP, fontFamily: SERIF }}
                >
                  “{t("section_13.closing_line")}”
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src={PHOTOS.response} alt="PureFlow response" className="col-span-2 h-56 w-full rounded-2xl object-cover md:h-72" />
              <img src={PHOTOS.benefit} alt="Immediate benefit" className="h-40 w-full rounded-2xl object-cover md:h-52" />
              <img src={PHOTOS.hero} alt="Household" className="h-40 w-full rounded-2xl object-cover md:h-52" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Sources accordion + closing nav ---------- */}
      <section className="relative" style={{ background: CREAM_WARM }}>
        <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
          <SourcesAccordion t={t} />

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link
              to="/projects/pureflow"
              hash="structural-problem"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-md transition hover:shadow-lg"
              style={{ background: BLUE_DEEP, color: "#FFFFFF" }}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("section_13.button_01_label", "Back to PureFlow Amanzi")}
            </Link>
            <a
              href="/projects/pureflow/model"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-md transition hover:shadow-lg"
              style={{ background: YELLOW, color: BLUE_DEEP }}
            >
              {t("section_13.button_02_label", "Step 02: Explore the PureFlow Model")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

// ----------------------- Building blocks -----------------------

function ComparisonCard({
  tone,
  heading,
  items,
  compact = false,
}: {
  tone: "good" | "warn";
  heading: string;
  items: string[];
  compact?: boolean;
}) {
  const good = tone === "good";
  return (
    <div
      className={cn(
        "rounded-2xl p-6 shadow-sm ring-1",
        good ? "ring-emerald-200" : "ring-amber-200",
      )}
      style={{ background: good ? "#F0FBF4" : "#FFF8E6" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ background: good ? "#10B981" : "#D97706" }}
        />
        <h3
          className={cn("text-lg font-bold md:text-xl", compact && "text-base md:text-lg")}
          style={{ color: BLUE_DEEP, fontFamily: SERIF }}
        >
          {heading}
        </h3>
      </div>
      <ul className={cn("mt-4 space-y-2", compact && "mt-3 space-y-1.5")}>
        {items.map((it, i) => (
          <li
            key={i}
            className={cn(
              "flex items-start gap-2 text-slate-700",
              compact ? "text-sm md:text-base" : "text-base md:text-lg",
            )}
          >
            <span
              className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: good ? "#10B981" : "#D97706" }}
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatCard({
  number,
  label,
  sub,
  sourceLabel,
}: {
  number: string;
  label: string;
  sub?: string;
  sourceLabel?: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 shadow-lg ring-1 ring-white/10"
      style={{ background: "rgba(255,255,255,0.06)" }}
    >
      <p
        className="text-5xl font-black leading-none md:text-6xl"
        style={{ color: YELLOW, fontFamily: SERIF }}
      >
        {number}
      </p>
      <p className="mt-4 text-sm font-semibold leading-snug text-white md:text-base">
        {label}
      </p>
      {sub && <p className="mt-2 text-xs text-white/70 md:text-sm">{sub}</p>}
      {sourceLabel && (
        <p className="mt-4 text-[11px] uppercase tracking-wider text-white/50">
          {sourceLabel}
        </p>
      )}
    </div>
  );
}

function TextImageSection({
  small,
  heading,
  copy,
  supporting,
  photos,
}: {
  small: string;
  heading: string;
  copy: string;
  supporting?: string;
  photos: string[];
}) {
  return (
    <section className="relative" style={{ background: CREAM }}>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionLabel small={small} heading={heading} />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
              {copy.split(/\n{1,}/).filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {supporting && (
              <div
                className="mt-6 rounded-2xl p-5"
                style={{ background: "rgba(15,42,140,0.06)", color: BLUE_DEEP }}
              >
                <div className="flex items-start gap-3">
                  <Droplets className="mt-1 h-5 w-5 shrink-0" style={{ color: BLUE }} />
                  <p className="text-sm leading-relaxed md:text-base">{supporting}</p>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {photos.map((p, i) => (
              <img
                key={i}
                src={p}
                alt=""
                className={cn(
                  "w-full rounded-2xl object-cover shadow-sm",
                  i === 0 ? "col-span-2 h-56 md:h-72" : "h-40 md:h-52",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PathGraphic({ path, risks }: { path: string; risks: string }) {
  const steps = path.split(/->/).map((s) => s.trim()).filter(Boolean);
  const riskSteps = risks.split(/->/).map((s) => s.trim()).filter(Boolean);
  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Water path</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1.5 text-sm font-semibold"
                style={{ background: "rgba(15,42,140,0.08)", color: BLUE_DEEP }}
              >
                {s}
              </span>
              {i < steps.length - 1 && <ArrowRight className="h-4 w-4 text-slate-400" />}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-5 md:p-6" style={{ background: "#FFF4E5" }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#B45309" }}>
          What can go wrong
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-3">
          {riskSteps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1.5 text-sm font-medium"
                style={{ background: "#FDE68A", color: "#7C2D12" }}
              >
                {s}
              </span>
              {i < riskSteps.length - 1 && <ArrowRight className="h-4 w-4" style={{ color: "#B45309" }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Timeline({ items }: { items: string[] }) {
  return (
    <div className="mt-10 overflow-x-auto">
      <ol className="flex min-w-full gap-3 md:gap-4">
        {items.map((it, i) => (
          <li
            key={i}
            className="flex min-w-[160px] flex-1 flex-col rounded-2xl p-4 ring-1 ring-white/10"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: YELLOW, color: BLUE_DEEP, fontFamily: SERIF }}
            >
              {i + 1}
            </span>
            <p className="mt-3 text-sm font-semibold text-white md:text-base">{it}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LinkedCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: YELLOW, color: BLUE_DEEP }}
        >
          {icon}
        </span>
        <h3 className="text-lg font-bold md:text-xl" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
          {title}
        </h3>
      </div>
      <ul className="mt-4 space-y-2 text-slate-700">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm md:text-base">
            <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: BLUE }} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LayeredSystem({
  outer,
  middle,
  household,
  core,
}: {
  outer: string;
  middle: string;
  household: string;
  core: string;
}) {
  const rings: Array<{ label: string; pad: string; opacity: number }> = [
    { label: outer, pad: "p-6 md:p-8", opacity: 0.08 },
    { label: middle, pad: "p-6 md:p-8", opacity: 0.14 },
    { label: household, pad: "p-6 md:p-8", opacity: 0.22 },
  ];
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
      {rings.map((r, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 flex items-start justify-center rounded-full ring-1 ring-white/15",
            r.pad,
          )}
          style={{
            inset: `${i * 12}%`,
            background: `rgba(251,191,36,${r.opacity})`,
          }}
        >
          <p className="mt-2 text-center text-xs font-semibold uppercase tracking-wider text-white/90 md:text-sm">
            {r.label}
          </p>
        </div>
      ))}
      <div
        className="absolute flex aspect-square w-[28%] items-center justify-center rounded-full text-center"
        style={{ background: YELLOW, color: BLUE_DEEP }}
      >
        <p className="px-2 text-xs font-bold md:text-sm" style={{ fontFamily: SERIF }}>
          {core}
        </p>
      </div>
    </div>
  );
}

function SourcesAccordion({ t }: { t: (k: string, fb?: string) => string }) {
  const [open, setOpen] = useState(false);
  const sources: Array<{ label: string; url: string }> = [];
  for (let i = 1; i <= 8; i++) {
    const label = t(`source_0${i}.label`);
    const url = t(`source_0${i}.url`);
    if (label && url) sources.push({ label, url });
  }
  if (!sources.length) return null;
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: BLUE_DEEP }}>
          Sources
        </span>
        <ChevronDown
          className={cn("h-5 w-5 text-slate-500 transition", open && "rotate-180")}
        />
      </button>
      {open && (
        <ul className="border-t border-slate-100 px-5 py-4">
          {sources.map((s, i) => (
            <li key={i} className="py-2">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 text-sm text-slate-700 hover:text-[color:var(--tw-shadow,inherit)] hover:underline md:text-base"
                style={{ color: BLUE_DEEP }}
              >
                <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" />
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
