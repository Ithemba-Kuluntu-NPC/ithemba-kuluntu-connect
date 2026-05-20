import { type ReactNode } from "react";
import { Placeholder } from "@/components/site/MissingInfo";

export function LegalPage({
  title,
  intro,
  sections,
  missing,
}: {
  title: string;
  intro?: string;
  sections: { heading: string; missing: string[] }[];
  missing?: string[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-[var(--ithemba-blue-dark)]">{title}</h1>
      {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
      {missing && (
        <div className="mt-4 space-y-1">
          {missing.map((m) => <Placeholder key={m} text={m} />)}
        </div>
      )}
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl font-bold text-foreground">{s.heading}</h2>
            <div className="mt-3 space-y-1.5">
              {s.missing.map((m) => <Placeholder key={m} text={m} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle, accent = "var(--ithemba-blue)" }: { eyebrow?: string; title: string; subtitle?: string; accent?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-14 md:py-20">
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full" style={{ background: `${accent}20` }} />
      <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
        {eyebrow && <div className="font-hand text-3xl text-[var(--ithemba-yellow)]">{eyebrow}</div>}
        <h1 className="mt-1 font-display text-4xl font-bold leading-tight md:text-5xl" style={{ color: accent }}>{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">{subtitle}</p>}
      </div>
    </section>
  );
}
