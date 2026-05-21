import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/site/LanguageProvider";
import { Placeholder } from "@/components/site/MissingInfo";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const dur = 1400;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.floor(eased * value));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

export function ImpactCounters({
  items,
  title,
  compact = false,
}: {
  items: { value: number; suffix: string; label: { en: string; de: string } }[];
  title?: string;
  compact?: boolean;
}) {
  const { t, lang } = useLang();
  return (
    <section className="relative isolate overflow-hidden py-20">
      {/* photo background */}
      <div className="absolute inset-0 -z-10">
        <PhotoPlaceholder
          label="community work background"
          className="h-full w-full"
          rounded="rounded-none"
          tone="blue"
          showLabel={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--ithemba-blue-deepest)]/90 via-[var(--ithemba-blue-dark)]/85 to-[var(--ithemba-blue-dark)]/95" />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="hand-eyebrow !text-[var(--ithemba-yellow)]">
            {lang === "en" ? "Together" : "Gemeinsam"}
          </div>
          {title && (
            <h2 className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">
              {title}
            </h2>
          )}
          <p className="mt-3 text-sm text-white/75 md:text-base">
            {lang === "en"
              ? "Real numbers from communities we walk with."
              : "Echte Zahlen aus den Gemeinschaften, die wir begleiten."}
          </p>
        </div>

        <div className={`mt-10 grid gap-3 sm:gap-4 ${compact ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
          {items.map((it, i) => (
            <div
              key={i}
              className="glass-dark relative overflow-hidden rounded-3xl p-5 text-center transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[var(--ithemba-yellow)]/15 blur-xl" />
              <div className="impact-number text-[var(--ithemba-yellow)]">
                <Counter value={it.value} suffix={it.suffix} />
              </div>
              <div className="mt-2 text-[12px] font-medium leading-snug text-white/85 md:text-sm">
                {t(it.label)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Placeholder text="final impact counter values and reporting date" kind="verify" />
        </div>
      </div>
    </section>
  );
}
