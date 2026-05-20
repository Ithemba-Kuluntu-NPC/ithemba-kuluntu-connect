import { mediaItems } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Placeholder } from "@/components/site/MissingInfo";

export function MediaGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {mediaItems.map((m) => (
        <article key={m.name} className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
          <div className="aspect-[16/9] bg-gradient-to-br from-slate-200 to-slate-300 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-center">
            Media thumbnail
          </div>
          <div className="p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ithemba-blue)]">{m.kind}</div>
            <h3 className="mt-1 font-display text-lg font-bold">{m.name}</h3>
            <div className="mt-2 space-y-1">
              <Placeholder text={`final article or video URL: ${m.name}`} />
              <Placeholder text={`media thumbnail: ${m.name}`} />
              <Placeholder text={`final title and description: ${m.name}`} kind="verify" />
            </div>
            <Button size="sm" variant="outline" className="mt-3 rounded-full" disabled>
              View <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
