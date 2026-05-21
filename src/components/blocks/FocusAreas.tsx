import { focusAreas } from "@/data/projects";
import { useLang } from "@/components/site/LanguageProvider";
import * as Icons from "lucide-react";

const palette = [
  "var(--ithemba-blue)",
  "var(--ithemba-teal)",
  "var(--ithemba-orange)",
  "var(--ithemba-green)",
  "var(--ithemba-blue-dark)",
  "var(--ithemba-yellow-warm)",
  "var(--ithemba-brown)",
];

export function FocusAreas() {
  const { t, lang } = useLang();
  return (
    <section className="relative overflow-hidden bg-white py-20">
      {/* decorative */}
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 blob bg-[var(--ithemba-yellow)]/20" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 dotted-divider opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="hand-eyebrow-lg">{lang === "en" ? "Our" : "Unsere"}</div>
          <h2 className="-mt-2 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">
            {lang === "en" ? "focus areas" : "Schwerpunkte"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/70">
            {lang === "en"
              ? "Seven interconnected ways we walk alongside rural communities in Pondoland."
              : "Sieben miteinander verbundene Wege, wie wir ländliche Gemeinschaften in Pondoland begleiten."}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
          {focusAreas.map((f, i) => {
            const Icon = (Icons as any)[f.icon] ?? Icons.Heart;
            const color = palette[i % palette.length];
            return (
              <div key={f.icon} className="group flex flex-col items-center gap-3 text-center">
                <div
                  className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition group-hover:-translate-y-1 group-hover:shadow-lg"
                  style={{ color }}
                >
                  <div
                    className="absolute inset-0 -z-10 blob opacity-15 transition group-hover:opacity-30"
                    style={{ background: color }}
                  />
                  <Icon className="h-8 w-8" />
                </div>
                <div className="text-sm font-semibold text-[var(--ithemba-blue-dark)]">
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
