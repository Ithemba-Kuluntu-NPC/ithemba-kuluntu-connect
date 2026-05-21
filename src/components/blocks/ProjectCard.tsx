import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import * as Icons from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { t } from "@/data/content";
import type { Project } from "@/data/projects";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

const toneMap: Record<string, "warm" | "blue" | "earth" | "sun" | "ocean" | "green"> = {
  ecd: "sun",
  pureflow: "ocean",
  greenhouse: "green",
  "food-security": "warm",
  "pondo-dogs": "earth",
  "disaster-relief": "blue",
};

export function ProjectCard({ project }: { project: Project }) {
  const { t: tr } = useLang();
  const Icon = (Icons as any)[project.icon] ?? Icons.Heart;
  const tone = toneMap[project.slug] ?? "warm";

  return (
    <article
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_40px_-12px_rgb(15_42_140/0.18)] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgb(15_42_140/0.3)]"
    >
      {/* image area with overlay info */}
      <div className="relative">
        <PhotoPlaceholder
          label={`${tr(project.title)} — feature photo`}
          className="aspect-[16/11]"
          rounded="rounded-none"
          tone={tone}
          showLabel={false}
        />
        {/* gradient base for legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* icon badge */}
        <div
          className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-2 ring-white/40"
          style={{ background: project.accent }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        {/* logo placeholder pill */}
        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-foreground/70 backdrop-blur">
          Logo · {project.slug}
        </div>

        {/* tiny photo placeholder note */}
        <div className="absolute bottom-3 left-3 text-[9px] font-medium uppercase tracking-widest text-white/70">
          Photo placeholder
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold leading-tight" style={{ color: project.accent }}>
          {tr(project.title)}
        </h3>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{tr(project.tagline)}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">{tr(project.description)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={project.path}>
            <Button size="sm" variant="outline" className="rounded-full">
              {tr(t.cta.learnMore)} <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
          <Link to="/donate">
            <Button
              size="sm"
              className="rounded-full text-white"
              style={{ background: project.accent }}
            >
              <Heart className="mr-1 h-3 w-3 fill-current" /> {tr(t.cta.supportProject)}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
