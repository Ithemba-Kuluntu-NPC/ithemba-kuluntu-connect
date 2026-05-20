import { focusAreas } from "@/data/projects";
import { useLang } from "@/components/site/LanguageProvider";
import * as Icons from "lucide-react";

export function FocusAreas() {
  const { t, lang } = useLang();
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-16">
      <div className="absolute -top-10 left-10 h-32 w-32 rounded-full bg-[var(--ithemba-yellow)]/30" />
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="font-hand text-2xl text-[var(--ithemba-yellow)]">{lang === "en" ? "Our" : "Unsere"}</div>
          <h2 className="font-display text-4xl font-bold text-[var(--ithemba-blue-dark)]">
            {lang === "en" ? "focus areas" : "Schwerpunkte"}
          </h2>
          <div className="mx-auto mt-3 h-1.5 w-24 rounded-full bg-[var(--ithemba-yellow)]" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {focusAreas.map((f) => {
            const Icon = (Icons as any)[f.icon] ?? Icons.Heart;
            return (
              <div key={f.icon} className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--ithemba-blue)]/30 bg-white text-[var(--ithemba-blue)] shadow-sm">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="text-sm font-semibold text-[var(--ithemba-blue-dark)]">{t(f.label)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
