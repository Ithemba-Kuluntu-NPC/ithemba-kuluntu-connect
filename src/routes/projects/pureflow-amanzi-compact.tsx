// This is a compact comparison concept for PureFlow Amanzi and should not
// replace the existing live project page until approved.
//
// Route: /projects/pureflow-amanzi-compact
// Content is dynamically loaded at runtime from:
//   - public/content/projects/pureflow-amanzi-en-v2.txt
//   - public/content/projects/pureflow-amanzi-de-v2.txt
//   - public/content/projects/pureflow-amanzi-nl-v2.txt
// Language is driven by the global LanguageProvider (EN / DE / NL).

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Droplets,
  HeartPulse,
  GraduationCap,
  Leaf,
  Users,
  Home as HomeIcon,
  Flame,
  TreePine,
  Cloud,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Wrench,
  GraduationCap as Grad,
  Truck,
  ClipboardCheck,
  HandHeart,
  Building2,
  ShieldCheck,
  Globe2,
  Zap,
  PowerOff,
  Recycle,
  School,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useLang } from "@/components/site/LanguageProvider";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { assets } from "@/data/assets";
import type { Lang } from "@/data/content";

export const Route = createFileRoute("/projects/pureflow-amanzi-compact")({
  component: PureFlowCompactPage,
});

/* ============================== CONTENT LOADER ============================== */

const CONTENT_URLS: Record<Lang, string> = {
  en: "/content/projects/pureflow-amanzi-en-v2.txt",
  de: "/content/projects/pureflow-amanzi-de-v2.txt",
  nl: "/content/projects/pureflow-amanzi-nl-v2.txt",
};

type Dict = Record<string, string>;

function parseContent(raw: string): Dict {
  const out: Dict = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key) out[key] = value;
  }
  return out;
}

function useProjectContent(lang: Lang) {
  const [dict, setDict] = useState<Dict | null>(null);
  useEffect(() => {
    let cancelled = false;
    setDict(null);
    fetch(CONTENT_URLS[lang])
      .then((r) => r.text())
      .then((txt) => {
        if (!cancelled) setDict(parseContent(txt));
      })
      .catch(() => {
        if (!cancelled) setDict({});
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);
  return dict;
}

const list = (s?: string) =>
  (s ?? "")
    .split(/,\s*/)
    .map((x) => x.trim())
    .filter(Boolean);

/* ============================== UI HELPERS ============================== */

function Wave({ from, to }: { from: string; to: string }) {
  return (
    <div className={`relative ${from}`}>
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className={`block h-[44px] w-full md:h-[64px] ${to}`}
        aria-hidden
      >
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function ScriptHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-script text-2xl text-amber-400 md:text-3xl">{children}</p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight md:text-4xl">
      {children}
    </h2>
  );
}

function youTubeEmbed(url?: string) {
  if (!url) return "";
  const m = url.match(/(?:v=|youtu\.be\/)([\w-]{6,})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : "";
}
function youTubeThumb(url?: string) {
  if (!url) return "";
  const m = url.match(/(?:v=|youtu\.be\/)([\w-]{6,})/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : "";
}

/* ============================== ICON MAPS ============================== */

const SNAPSHOT_ICONS: LucideIcon[] = [Droplets, HeartPulse, GraduationCap, Leaf];

const TECH_FEATURE_ICONS: Record<string, LucideIcon> = {
  default: CheckCircle2,
  electric: PowerOff,
  power: PowerOff,
  strom: PowerOff,
  zwaartekracht: Droplets,
  gravity: Droplets,
  chemical: Sparkles,
  chemikal: Sparkles,
  chemicaliën: Sparkles,
  portable: Truck,
  tragbar: Truck,
  draagbaar: Truck,
  assemble: Wrench,
  montier: Wrench,
  montage: Wrench,
  clean: Sparkles,
  reinig: Sparkles,
  maintenance: Wrench,
  wartung: Wrench,
  onderhoud: Wrench,
  household: HomeIcon,
  haushalt: HomeIcon,
  huishoud: HomeIcon,
};

function featureIcon(label: string): LucideIcon {
  const l = label.toLowerCase();
  for (const k of Object.keys(TECH_FEATURE_ICONS)) {
    if (k !== "default" && l.includes(k)) return TECH_FEATURE_ICONS[k];
  }
  return CheckCircle2;
}

const COUNTER_ICONS: Record<string, LucideIcon> = {
  households: HomeIcon,
  people: Users,
  litres: Droplets,
  co2: Cloud,
  firewood: Flame,
  trees: TreePine,
};

const SDG_COLORS: Record<string, string> = {
  "1": "#E5243B",
  "3": "#4C9F38",
  "4": "#C5192D",
  "5": "#FF3A21",
  "6": "#26BDE2",
  "8": "#A21942",
  "10": "#DD1367",
  "11": "#FD9D24",
  "12": "#BF8B2E",
  "13": "#3F7E44",
  "17": "#19486A",
};
const SDG_KEYS = ["1", "3", "4", "5", "6", "8", "10", "11", "12", "13", "17"];

/* ============================== PAGE ============================== */

function PureFlowCompactPage() {
  const { lang } = useLang();
  const dict = useProjectContent(lang);
  const t = (k: string, fb = "") => (dict ? dict[k] ?? fb : fb);

  const heroPoster = assets.photos.projects.pureflowHero;

  const counters = useMemo(
    () =>
      (["households", "people", "litres", "co2", "firewood", "trees"] as const).map(
        (k) => ({
          key: k,
          value: t(`impact.counters.${k}.value`),
          label: t(`impact.counters.${k}.label`),
          Icon: COUNTER_ICONS[k],
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dict],
  );

  // Loading skeleton until first content arrives
  if (!dict) {
    return (
      <main className="min-h-screen bg-[#0b2a4a] text-white">
        <div className="mx-auto max-w-5xl px-4 py-32 text-center opacity-70">
          <Droplets className="mx-auto mb-4 h-10 w-10 animate-pulse" />
          <p>Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf6ec] text-slate-900">
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden bg-[#0b2a4a] text-white">
        <img
          src={heroPoster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b2a4a]/85 via-[#0b2a4a]/75 to-[#0b2a4a]/95" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-24 md:pb-24 md:pt-32">
          <Link
            to="/projects"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === "de" ? "Alle Projekte" : lang === "nl" ? "Alle projecten" : "All projects"}
          </Link>
          <ScriptHeading>{t("hero.script_heading")}</ScriptHeading>
          <h1 className="mt-2 font-serif text-4xl font-bold leading-tight md:text-6xl">
            {t("hero.main_heading")}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/90 md:text-xl">
            {t("hero.sub_heading")}
          </p>
          <p className="mt-3 max-w-3xl text-white/80">{t("hero.text_long")}</p>
          <p className="mt-2 max-w-3xl text-sm text-white/70">
            {t("hero.text_small_line")}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("hero.patent_trust_line")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-amber-400 text-slate-900 hover:bg-amber-300">
              <a href="#donate">{t("hero.cta.monthly")}</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              <a href="#donate">{t("hero.cta.once")}</a>
            </Button>
          </div>
        </div>
        <Wave from="bg-[#0b2a4a]" to="text-[#fbf6ec]" />
      </section>

      {/* ============== CONTEXT + AT A GLANCE ============== */}
      <section className="bg-[#fbf6ec]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-5 md:gap-10 md:py-16">
          <div className="md:col-span-3">
            <ScriptHeading>{t("context.script_heading")}</ScriptHeading>
            <SectionTitle>{t("context.main_heading")}</SectionTitle>
            <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
              {t("context.challenge_text")}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { Icon: Droplets, label: lang === "de" ? "Wasser" : lang === "nl" ? "Water" : "Water" },
                { Icon: HeartPulse, label: lang === "de" ? "Gesundheit" : lang === "nl" ? "Gezondheid" : "Health" },
                { Icon: GraduationCap, label: lang === "de" ? "Bildung" : lang === "nl" ? "Onderwijs" : "Education" },
                { Icon: Leaf, label: lang === "de" ? "Klima" : lang === "nl" ? "Klimaat" : "Climate" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <Icon className="h-7 w-7 text-[#0b2a4a]" />
                  <span className="text-xs font-medium text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <aside className="md:col-span-2">
            <div className="rounded-2xl border border-amber-200/60 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0b2a4a]">
                {t("context.snapshot_heading")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {t("context.snapshot_text")}
              </p>
              <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-slate-800">
                <strong className="text-[#0b2a4a]">€·R130</strong> — {t("context.value_money_line")}
              </div>
              <p className="mt-3 text-xs italic text-slate-500">
                {t("context.impact_summary_line")}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <Wave from="bg-[#fbf6ec]" to="text-[#0b2a4a]" />

      {/* ============== VIDEO + IMPACT COUNTERS ============== */}
      <section className="bg-[#0b2a4a] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="mb-8 text-center">
            <ScriptHeading>{t("showcase.script_heading")}</ScriptHeading>
            <h2 className="mt-1 font-serif text-3xl font-bold md:text-4xl">
              {t("showcase.main_heading")}
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-white/80">{t("showcase.text")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-5 md:gap-10">
            <div className="md:col-span-3">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-xl">
                <div className="aspect-video w-full">
                  <iframe
                    src={youTubeEmbed(t("showcase.video.url"))}
                    title={t("showcase.video.title")}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-amber-300">
                {t("showcase.video.title")}
              </p>
              <p className="text-sm text-white/70">{t("showcase.video.description")}</p>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 gap-3">
                {counters.map(({ key, value, label, Icon }) => (
                  <div
                    key={key}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur"
                  >
                    <Icon className="mx-auto h-5 w-5 text-amber-300" />
                    <div className="mt-2 font-serif text-2xl font-bold text-white md:text-3xl">
                      {value}
                    </div>
                    <div className="mt-1 text-[11px] leading-tight text-white/70">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs italic text-white/60">{t("impact.note")}</p>
            </div>
          </div>
        </div>
        <Wave from="bg-[#0b2a4a]" to="text-[#fbf6ec]" />
      </section>

      {/* ============== DEEP DIVE TABS / ACCORDION ============== */}
      <section className="bg-[#fbf6ec]">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="mb-8 text-center">
            <SectionTitle>{t("tabs.main_heading")}</SectionTitle>
            <p className="mx-auto mt-3 max-w-2xl text-slate-700">{t("tabs.sub_heading")}</p>
          </div>

          {/* Desktop: tabs */}
          <div className="hidden md:block">
            <Tabs defaultValue="t1" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-4 rounded-xl bg-white p-1 shadow-sm">
                {(["t1", "t2", "t3", "t4"] as const).map((k) => (
                  <TabsTrigger
                    key={k}
                    value={k}
                    className="rounded-lg py-3 text-sm font-medium data-[state=active]:bg-[#0b2a4a] data-[state=active]:text-white"
                  >
                    {t(`tabs.${k}.title`)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {(["t1", "t2", "t3", "t4"] as const).map((k) => (
                <TabsContent key={k} value={k} className="mt-6">
                  <TabContent dictKey={k} t={t} />
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Mobile: accordion */}
          <div className="md:hidden">
            <Accordion type="single" collapsible defaultValue="t1">
              {(["t1", "t2", "t3", "t4"] as const).map((k) => (
                <AccordionItem key={k} value={k} className="border-amber-200/60">
                  <AccordionTrigger className="text-left font-serif text-base font-semibold text-[#0b2a4a]">
                    {t(`tabs.${k}.title`)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <TabContent dictKey={k} t={t} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Wave from="bg-[#fbf6ec]" to="text-white" />

      {/* ============== HUMAN IMPACT ============== */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:gap-12 md:py-16">
          <div className="overflow-hidden rounded-3xl shadow-md">
            <img
              src={assets.photos.pureflow.schoolOrEcd}
              alt=""
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <ScriptHeading>{t("human.script_heading")}</ScriptHeading>
            <SectionTitle>{t("human.main_heading")}</SectionTitle>
            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
              <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-[#0b2a4a]">
                <School className="h-5 w-5" />
                {t("human.schools_heading")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {t("human.schools_text")}
              </p>
            </div>
            <h3 className="mt-6 font-serif text-lg font-semibold text-[#0b2a4a]">
              {t("human.outcomes_heading")}
            </h3>
            <p className="mt-1 text-sm text-slate-700">{t("human.outcomes_text")}</p>
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {list(t("human.outcomes_list")).map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Wave from="bg-white" to="text-[#0b2a4a]" />

      {/* ============== CLIMATE ============== */}
      <section className="bg-[#0b2a4a] text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:py-16">
          <div className="md:col-span-2">
            <ScriptHeading>{t("climate.script_heading")}</ScriptHeading>
            <h2 className="mt-1 font-serif text-3xl font-bold md:text-4xl">
              {t("climate.main_heading")}
            </h2>
            <p className="mt-4 text-white/85">{t("climate.text_1")}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {list(t("climate.benefits_list")).map((b, i) => {
                const Icons = [Cloud, Flame, TreePine, Leaf, Recycle, ShieldCheck];
                const Icon = Icons[i % Icons.length];
                return (
                  <div
                    key={b}
                    className="flex flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <Icon className="h-6 w-6 text-amber-300" />
                    <span className="text-sm text-white/90">{b}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <aside className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-6">
            <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-amber-200">
              <ClipboardCheck className="h-5 w-5" />
              {t("climate.tracking_heading")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              {t("climate.tracking_text")}
            </p>
          </aside>
        </div>
        <Wave from="bg-[#0b2a4a]" to="text-[#fbf6ec]" />
      </section>

      {/* ============== SDG GRID ============== */}
      <section className="bg-[#fbf6ec]">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="mb-8 text-center">
            <SectionTitle>{t("sdg.main_heading")}</SectionTitle>
            <p className="mx-auto mt-3 max-w-2xl text-slate-700">{t("sdg.sub_heading")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SDG_KEYS.map((n) => {
              const color = SDG_COLORS[n] ?? "#0b2a4a";
              const title = t(`sdg.${n}.title`);
              const desc = t(`sdg.${n}.desc`);
              return (
                <div
                  key={n}
                  className="flex gap-3 rounded-xl border border-white/0 bg-white p-4 shadow-sm transition hover:shadow-md"
                  style={{ borderLeft: `5px solid ${color}` }}
                >
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg font-serif text-lg font-bold text-white"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  >
                    {n}
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-[#0b2a4a]">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Wave from="bg-[#fbf6ec]" to="text-white" />

      {/* ============== MEDIA + PARTNERS ============== */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="mb-6 text-center">
            <ScriptHeading>{t("media.script_heading")}</ScriptHeading>
            <SectionTitle>{t("media.main_heading")}</SectionTitle>
          </div>

          <Tabs defaultValue="stories" className="w-full">
            <TabsList className="mx-auto grid h-auto w-full max-w-md grid-cols-2 rounded-xl bg-amber-50 p-1">
              <TabsTrigger
                value="stories"
                className="rounded-lg py-2 text-sm font-medium data-[state=active]:bg-[#0b2a4a] data-[state=active]:text-white"
              >
                {lang === "de"
                  ? "Geschichten"
                  : lang === "nl"
                    ? "Verhalen"
                    : "Community Stories"}
              </TabsTrigger>
              <TabsTrigger
                value="guides"
                className="rounded-lg py-2 text-sm font-medium data-[state=active]:bg-[#0b2a4a] data-[state=active]:text-white"
              >
                {lang === "de"
                  ? "Anleitungen"
                  : lang === "nl"
                    ? "Handleidingen"
                    : "Technical Guides"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stories" className="mt-6">
              <div className="grid gap-5 md:grid-cols-2">
                {(["story1", "story2"] as const).map((sk) => {
                  const url = t(`media.${sk}.url`);
                  const title = t(`media.${sk}.title`);
                  const desc = t(`media.${sk}.desc`);
                  return (
                    <a
                      key={sk}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-100">
                        <img
                          src={youTubeThumb(url)}
                          alt=""
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          loading="lazy"
                        />
                        <PlayCircle className="absolute inset-0 m-auto h-14 w-14 text-white drop-shadow-lg" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-base font-semibold text-[#0b2a4a]">
                          {title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">{desc}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="guides" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {(["guide1", "guide2", "guide3"] as const).map((gk) => {
                  const url = t(`media.${gk}.url`);
                  const title = t(`media.${gk}.title`);
                  return (
                    <a
                      key={gk}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-100">
                        <img
                          src={youTubeThumb(url)}
                          alt=""
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          loading="lazy"
                        />
                        <PlayCircle className="absolute inset-0 m-auto h-10 w-10 text-white drop-shadow" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-[#0b2a4a]">{title}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Partners */}
          <div className="mt-12 rounded-2xl border border-slate-200 bg-amber-50/50 p-6 md:p-8">
            <div className="text-center">
              <h3 className="font-serif text-xl font-bold text-[#0b2a4a]">
                {t("partners.heading")}
              </h3>
              <p className="mx-auto mt-2 max-w-3xl text-sm text-slate-700">
                {t("partners.text")}
              </p>
            </div>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {list(t("partners.list")).map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-700"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Wave from="bg-white" to="text-[#fbf6ec]" />

      {/* ============== DONATION + CLOSING ============== */}
      <section id="donate" className="bg-[#fbf6ec]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-5 md:py-16">
          <div className="md:col-span-2">
            <ScriptHeading>{t("donation.script_heading")}</ScriptHeading>
            <SectionTitle>{t("donation.main_heading")}</SectionTitle>
            <p className="mt-4 text-slate-700">{t("donation.text_intro")}</p>
            <ul className="mt-5 space-y-2">
              {list(t("donation.supports_list")).map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-slate-800">
                  <HandHeart className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                  {s}
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-2">
              {list(t("donation.trust_points")).map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-800"
                >
                  ✓ {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-amber-200 bg-white p-2 shadow-sm">
              <DonationWidget defaultProject="pureflow" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-16 text-center">
          <h2 className="font-serif text-2xl font-bold italic text-[#0b2a4a] md:text-3xl">
            {t("donation.closing.heading")}
          </h2>
          <p className="mt-3 text-slate-700">{t("donation.closing.text")}</p>
        </div>
      </section>
    </main>
  );
}

/* ============================== TAB CONTENT ============================== */

function TabContent({
  dictKey,
  t,
}: {
  dictKey: "t1" | "t2" | "t3" | "t4";
  t: (k: string, fb?: string) => string;
}) {
  const heading = t(`tabs.${dictKey}.heading`);
  const text1 = t(`tabs.${dictKey}.text_1`);

  if (dictKey === "t1") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#0b2a4a]">{heading}</h3>
          <p className="mt-3 text-slate-700">{text1}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {list(t("tabs.t1.features")).map((f) => {
              const Icon = featureIcon(f);
              return (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#0b2a4a]/15 bg-white px-3 py-1.5 text-xs font-medium text-[#0b2a4a]"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {f}
                </span>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
              {t("hero.script_heading") ? "Testing" : "Testing"}
            </h4>
            <p className="mt-2 text-sm text-emerald-900/90">{t("tabs.t1.testing_note")}</p>
          </div>
          <div className="rounded-xl border border-[#0b2a4a]/15 bg-white p-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0b2a4a]">
              <Sparkles className="h-4 w-4" />
              Technical proof
            </h4>
            <p className="mt-2 text-sm text-slate-700">{t("tabs.t1.technical_proof")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (dictKey === "t2") {
    const steps = list(t("tabs.t2.steps"));
    return (
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#0b2a4a]">{heading}</h3>
        <p className="mt-3 max-w-3xl text-slate-700">{text1}</p>
        <ol className="mt-6 grid gap-3 md:grid-cols-2">
          {steps.map((step, i) => (
            <li
              key={step}
              className="flex gap-3 rounded-xl border border-amber-200/60 bg-white p-4"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0b2a4a] text-sm font-bold text-amber-300">
                {i + 1}
              </div>
              <span className="text-sm text-slate-800">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (dictKey === "t3") {
    const roles = list(t("tabs.t3.roles"));
    const roleIcons = [Wrench, Truck, HandHeart, Grad, Building2, ClipboardCheck, Briefcase, Users, Zap];
    return (
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#0b2a4a]">{heading}</h3>
        <p className="mt-3 max-w-3xl text-slate-700">{text1}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {roles.map((r, i) => {
            const Icon = roleIcons[i % roleIcons.length];
            return (
              <div
                key={r}
                className="flex items-center gap-3 rounded-xl border border-[#0b2a4a]/10 bg-white p-3"
              >
                <Icon className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-[#0b2a4a]">{r}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // t4
  const outcomes = list(t("tabs.t4.outcomes"));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#0b2a4a]">{heading}</h3>
        <p className="mt-3 text-slate-700">{text1}</p>
      </div>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {outcomes.map((o) => (
          <li
            key={o}
            className="flex items-start gap-2 rounded-lg border border-amber-200/60 bg-white p-3 text-sm text-slate-800"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            {o}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* unused icon imports kept intentionally to avoid future churn */
void Globe2;
void Cloud;
