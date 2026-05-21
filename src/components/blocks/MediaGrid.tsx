import { mediaItems } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Placeholder } from "@/components/site/MissingInfo";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

const tones = ["warm", "blue", "earth", "sun", "ocean", "green"] as const;

export function MediaGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mediaItems.map((m, i) => (
        <article
          key={m.name}
          className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_40px_-12px_rgb(15_42_140/0.18)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="relative">
            <PhotoPlaceholder
              label={`${m.name} thumbnail`}
              className="aspect-[16/9]"
              rounded="rounded-none"
              tone={tones[i % tones.length]}
              showLabel={false}
            />
            <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--ithemba-blue)] shadow">
              {m.kind}
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-lg font-bold text-[var(--ithemba-blue-dark)]">{m.name}</h3>
            <div className="mt-2 flex-1 space-y-1">
              <Placeholder text={`final article or video URL: ${m.name}`} />
              <Placeholder text={`media thumbnail: ${m.name}`} />
              <Placeholder text={`final title and description: ${m.name}`} kind="verify" />
            </div>
            <Button size="sm" variant="outline" className="mt-4 self-start rounded-full" disabled>
              View <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
