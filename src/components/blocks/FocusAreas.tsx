import { focusAreas } from "@/data/projects";
import { useLang } from "@/components/site/LanguageProvider";
import { assets } from "@/data/assets";
import { SmartIcon, SmartImage } from "@/components/site/Asset";

const palette = [
  "var(--ithemba-yellow)",
  "var(--ithemba-yellow-warm)",
  "var(--ithemba-orange)",
  "var(--ithemba-teal)",
  "var(--ithemba-yellow)",
  "var(--ithemba-yellow-warm)",
  "var(--ithemba-orange)",
];

const iconMap: Record<string, { src: string; fallback: string }> = {
  BookOpen: { src: assets.focusAreaIcons.education, fallback: "BookOpen" },
  Droplet: { src: assets.focusAreaIcons["safe-water"], fallback: "Droplet" },
  UtensilsCrossed: { src: assets.focusAreaIcons["food-security"], fallback: "UtensilsCrossed" },
  Wrench: { src: assets.focusAreaIcons["skills-livelihoods"], fallback: "Wrench" },
  HeartPulse: { src: assets.focusAreaIcons["community-health"], fallback: "HeartPulse" },
  PawPrint: { src: assets.focusAreaIcons["animal-welfare"], fallback: "PawPrint" },
  ShieldAlert: { src: assets.focusAreaIcons["disaster-relief"], fallback: "ShieldAlert" },
};

export function FocusAreas() {
  const { t, lang } = useLang();
  return (
    <section className="relative isolate overflow-hidden py-24 md:py-28">
      {/* Top wave divider for smooth transition from "What guides us" */}
      <svg
        className="pointer-events-none absolute -top-px left-0 z-10 w-full text-[var(--ithemba-blue-deepest)]"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,40 C240,80 480,0 720,30 C960,60 1200,80 1440,40 L1440,0 L0,0 Z"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>

      {/* Full-width photo background */}
      <div className="absolute inset-0 -z-10">

        <SmartImage
          src={assets.photos.home.impact}
          label="Community impact in Pondoland"
          className="h-full w-full"
          rounded="rounded-none"
          tone="warm"
          showMissingBadge={false}
        />
        {/* Layered overlay: deep blue with warm cream wash for a rich, readable backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--ithemba-blue-deepest)]/88 via-[var(--ithemba-blue-dark)]/78 to-[var(--ithemba-blue-deepest)]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--ithemba-yellow)/15,transparent_55%)] opacity-60" />
      </div>

      {/* Decorative accents */}
      <div className="pointer-events-none absolute -left-24 top-16 h-56 w-56 blob bg-[var(--ithemba-yellow)]/10" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 dotted-divider opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center text-white">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)]">
            {lang === "en" ? "Our" : lang === "de" ? "Unsere" : "Onze"}
          </div>
          <h2 className="-mt-2 font-display text-4xl font-bold md:text-5xl">
            {lang === "en" ? "focus areas" : lang === "de" ? "Schwerpunkte" : "focus areas"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            {lang === "en"
              ? "Seven interconnected ways we walk alongside rural communities in Pondoland."
              : lang === "de"
              ? "Sieben miteinander verbundene Wege, wie wir ländliche Gemeinschaften in Pondoland begleiten."
              : "Seven interconnected ways we walk alongside rural communities in Pondoland."}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
          {focusAreas.map((f, i) => {
            const color = palette[i % palette.length];
            const mapping = iconMap[f.icon] ?? { src: "", fallback: f.icon };
            return (
              <div key={f.icon} className="group flex flex-col items-center gap-3 text-center">
                <div
                  className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-black/5 transition group-hover:-translate-y-1 group-hover:shadow-2xl md:h-28 md:w-28"
                  style={{ color }}
                >
                  <SmartIcon
                    src={mapping.src}
                    alt={t(f.label)}
                    fallbackLucideName={mapping.fallback}
                    className="absolute inset-2.5 h-[calc(100%-1.25rem)] w-[calc(100%-1.25rem)] md:inset-3"
                    color={color}
                  />
                </div>

                <div className="text-sm font-semibold text-white drop-shadow-sm">
                  {t(f.label)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
