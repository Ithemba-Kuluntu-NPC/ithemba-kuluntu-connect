import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import * as Icons from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { t } from "@/data/content";
import type { Project } from "@/data/projects";
import { SmartImage, SmartLogo } from "@/components/site/Asset";
import { assets, projectHeroPhoto } from "@/data/assets";

const toneMap: Record<string, "warm" | "blue" | "earth" | "sun" | "ocean" | "green"> = {
  ecd: "sun",
  pureflow: "ocean",
  greenhouse: "green",
  "food-security": "warm",
  "pondo-dogs": "earth",
  "disaster-relief": "blue",
};

const projectLogo: Record<string, string | undefined> = {
  ecd: assets.logos.no1Ecd,
  pureflow: assets.logos.pureflowAmanzi,
  "pondo-dogs": assets.logos.pondoDogs,
};

export function ProjectCard({ project }: { project: Project }) {
  const { t: tr } = useLang();
  const Icon = (Icons as any)[project.icon] ?? Icons.Heart;
  const tone = toneMap[project.slug] ?? "warm";
  const hero = projectHeroPhoto[project.slug];

  return (
    <article
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_40px_-12px_rgb(15_42_140/0.18)] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgb(15_42_140/0.3)]"
    >
      <div className="relative">
        <SmartImage
          src={hero}
          label={`${tr(project.title)} — feature photo`}
          className="aspect-[16/11] w-full"
          rounded="rounded-none"
          tone={tone}
          showMissingBadge={false}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

        <div
          className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-2 ring-white/40"
          style={{ background: project.accent }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        <div className="absolute right-3 top-3 flex h-10 items-center gap-1 rounded-full bg-white/95 px-2 shadow-sm ring-1 ring-black/5 backdrop-blur">
          {projectLogo[project.slug] ? (
            <SmartLogo
              src={projectLogo[project.slug]!}
              alt={`${tr(project.title)} logo`}
              className="h-8 w-auto max-w-[6rem] object-contain"
              showMissingBadge={false}
              fallback={
                <span className="px-1 text-[9px] font-semibold uppercase tracking-wider text-foreground/70">
                  Logo · {project.slug}
                </span>
              }
            />
          ) : (
            <span className="px-1 text-[9px] font-semibold uppercase tracking-wider text-foreground/70">
              Logo · {project.slug}
            </span>
          )}
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
