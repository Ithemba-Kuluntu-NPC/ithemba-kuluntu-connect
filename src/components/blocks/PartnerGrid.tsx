import { partners } from "@/data/projects";
import { Placeholder } from "@/components/site/MissingInfo";

export function PartnerGrid({ showPlaceholders = true }: { showPlaceholders?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {partners.map((p) => (
        <div key={p} className="group rounded-2xl border border-border bg-white p-4 text-center shadow-sm transition hover:shadow-md">
          <div className="flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Logo
          </div>
          <div className="mt-3 text-sm font-semibold text-foreground">{p}</div>
          {showPlaceholders && (
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              <Placeholder text={`approved logo: ${p}`} />
              <Placeholder text={`partner URL: ${p}`} />
              <Placeholder text={`permission to display logo: ${p}`} kind="verify" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
