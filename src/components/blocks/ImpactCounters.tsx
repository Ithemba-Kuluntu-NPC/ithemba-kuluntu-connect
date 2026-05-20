import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/site/LanguageProvider";
import { Placeholder } from "@/components/site/MissingInfo";

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
  const { t } = useLang();
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      {title && <h2 className="mb-8 text-center font-display text-3xl font-bold text-[var(--ithemba-blue-dark)]">{title}</h2>}
      <div className={`grid gap-4 ${compact ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
        {items.map((it, i) => (
          <div key={i} className="rounded-3xl border border-[var(--ithemba-blue)]/10 bg-white p-5 text-center shadow-sm">
            <div className="font-display text-3xl font-bold text-[var(--ithemba-blue)] md:text-4xl">
              <Counter value={it.value} suffix={it.suffix} />
            </div>
            <div className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">{t(it.label)}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center">
        <Placeholder text="final impact counter values and reporting date" kind="verify" />
      </div>
    </section>
  );
}
