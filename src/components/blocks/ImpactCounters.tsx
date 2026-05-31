import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { SmartImage } from "@/components/site/Asset";
import { assets } from "@/data/assets";


type CounterItem = {
  value: number;
  suffix: string;
  label: { en: string; de: string; nl?: string };
  icon?: string;
  iconSrc?: string;
};


function Counter({ value, suffix, locale }: { value: number; suffix: string; locale: string }) {
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
  return (
    <span ref={ref} className="whitespace-nowrap tabular-nums">
      {n.toLocaleString(locale)}
      {suffix}
    </span>
  );
}


export function ImpactCounters({
  items,
  title,
  compact = false,
}: {
  items: CounterItem[];
  title?: string;
  compact?: boolean;
}) {
  const { t, lang } = useLang();

  return (
    <section className="relative isolate overflow-hidden py-20">
      {/* photo background — uses real image when present, otherwise tonal placeholder */}
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={assets.photos.home.impact}
          label="community work background"
          className="h-full w-full"
          rounded="rounded-none"
          tone="blue"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/88 to-[var(--ithemba-blue-deepest)]/95" />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="hand-eyebrow !text-[var(--ithemba-yellow)]">
            {lang === "en" ? "Together" : lang === "de" ? "Gemeinsam" : "Samen"}
            <span aria-hidden className="ml-1 inline-block translate-y-[2px]">✦</span>
          </div>
          {title && (
            <h2 className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">
              {title}
            </h2>
          )}
          <p className="mt-3 text-sm text-white/75 md:text-base">
            {lang === "en"
              ? "Real numbers from communities we walk with, built through practical care, local trust and long-term commitment."
              : lang === "de"
              ? "Diese Zahlen stehen für praktische Arbeit vor Ort in Südafrika — getragen von lokalem Vertrauen, langfristigem Engagement und Unterstützung aus Deutschland und darüber hinaus."
              : "Deze cijfers staan voor praktisch werk ter plaatse in Zuid-Afrika — gedragen door lokaal vertrouwen, langdurige inzet en steun vanuit Duitsland en daarbuiten."}
          </p>

        </div>

        <div
          className={`mx-auto mt-12 flex flex-wrap justify-center gap-x-6 gap-y-10 ${
            compact ? "max-w-6xl" : "max-w-6xl"
          }`}
        >
          {items.map((it, i) => {
            const Icon =
              (it.icon && ((Icons as unknown) as Record<string, Icons.LucideIcon>)[it.icon]) ||
              Icons.Sparkles;
            return (
              <div
                key={i}
                className="group flex basis-[calc(50%-12px)] flex-col items-center text-center sm:basis-[calc(33.333%-16px)] lg:basis-[calc(33.333%-16px)] xl:basis-[calc(25%-18px)]"
              >
                <div className="flex items-center justify-center">
                  {it.iconSrc ? (
                    <img
                      src={it.iconSrc}
                      alt=""
                      aria-hidden
                      className="h-[60px] w-[60px] object-contain drop-shadow-[0_2px_12px_rgba(251,191,36,0.25)] md:h-20 md:w-20 lg:h-24 lg:w-24"
                    />
                  ) : (
                    <Icon className="h-14 w-14 text-[var(--ithemba-yellow)] md:h-20 md:w-20 lg:h-24 lg:w-24" />
                  )}
                </div>
                <div
                  className="mt-4 font-display font-extrabold leading-none text-[var(--ithemba-yellow)] drop-shadow-[0_2px_18px_rgba(251,191,36,0.25)]"
                  style={{ fontSize: "clamp(1.75rem, 2.4vw, 2.5rem)" }}
                >
                  <Counter value={it.value} suffix={it.suffix} locale={lang === "en" ? "en-US" : lang === "de" ? "de-DE" : "nl-NL"} />
                </div>
                <div className="mt-3 max-w-[14rem] text-[12px] font-medium leading-snug text-white/85 md:text-sm">
                  {t(it.label)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

