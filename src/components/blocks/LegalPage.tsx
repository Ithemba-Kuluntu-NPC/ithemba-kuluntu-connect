import { type ReactNode } from "react";
import { Placeholder } from "@/components/site/MissingInfo";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

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

/**
 * Reusable photo-led page hero used by About, Projects, Partners, Media, Contact, Donate.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  accent = "var(--ithemba-blue)",
  tone = "earth",
  photoLabel,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: string;
  tone?: "warm" | "blue" | "earth" | "sun" | "ocean" | "green";
  photoLabel?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <PhotoPlaceholder
          label={photoLabel ?? `${title} — hero image`}
          className="h-full w-full"
          rounded="rounded-none"
          tone={tone}
          showLabel={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ithemba-blue-deepest)]/85 via-[var(--ithemba-blue-dark)]/55 to-[var(--ithemba-blue-dark)]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute -top-20 right-0 h-72 w-72 sun-glow" />
        <div className="absolute bottom-3 right-3 hidden rounded-full bg-black/35 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/80 backdrop-blur sm:block">
          Photo placeholder · {photoLabel ?? "hero image"}
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center md:py-28 lg:px-8">
        {eyebrow && <div className="hand-eyebrow-lg">{eyebrow}</div>}
        <h1
          className="mt-2 font-display text-4xl font-extrabold leading-tight text-white md:text-6xl"
          style={{ textShadow: "0 2px 24px rgba(8,26,96,0.4)" }}
        >
          {title}
        </h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90 md:text-xl">{subtitle}</p>}
        {children && <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>

      <svg className="block w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
        <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
      </svg>
    </section>
  );
}
