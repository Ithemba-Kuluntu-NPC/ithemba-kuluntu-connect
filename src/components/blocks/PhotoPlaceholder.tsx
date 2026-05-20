import { type ReactNode } from "react";

export function PhotoPlaceholder({
  label,
  className = "",
  gradient = "from-[var(--ithemba-blue)] via-[var(--ithemba-teal)] to-[var(--ithemba-yellow)]",
  children,
}: {
  label: string;
  className?: string;
  gradient?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_50%)]" />
      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
        <div>
          <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4M3 17l9 4 9-4" /></svg>
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/90">Photo placeholder</div>
          <div className="mt-1 text-sm text-white/95">{label}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
