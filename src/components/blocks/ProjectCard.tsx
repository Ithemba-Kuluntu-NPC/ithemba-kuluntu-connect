import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import * as Icons from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { t } from "@/data/content";
import type { Project } from "@/data/projects";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

export function ProjectCard({ project }: { project: Project }) {
  const { t: tr } = useLang();
  const Icon = (Icons as any)[project.icon] ?? Icons.Heart;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl"
      style={{ borderColor: `${project.accent}33` }}
    >
      <PhotoPlaceholder
        label={`${tr(project.title)} — feature photo`}
        className="aspect-[16/10]"
        gradient="from-[var(--ithemba-blue)] to-[var(--ithemba-teal)]"
      >
        <div
          className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full shadow-md"
          style={{ background: project.accent }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </PhotoPlaceholder>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold" style={{ color: project.accent }}>
          {tr(project.title)}
        </h3>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{tr(project.tagline)}</p>
        <p className="mt-3 flex-1 text-sm text-foreground/80">{tr(project.description)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={project.path}>
            <Button size="sm" variant="outline" className="rounded-full">
              {tr(t.cta.learnMore)} <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
          <Link to="/donate">
            <Button size="sm" className="rounded-full bg-[var(--ithemba-blue)] hover:bg-[var(--ithemba-blue-dark)]">
              <Heart className="mr-1 h-3 w-3 fill-current" /> {tr(t.cta.supportProject)}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
