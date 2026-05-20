import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks/LegalPage";
import { ProjectCard } from "@/components/blocks/ProjectCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { projects } from "@/data/projects";
import { useLang } from "@/components/site/LanguageProvider";

export const Route = createFileRoute("/projects/")({ component: ProjectsOverview });

function ProjectsOverview() {
  const { lang } = useLang();
  const lbl = (en: string, de: string) => (lang === "en" ? en : de);
  return (
    <>
      <PageHeader
        eyebrow={lbl("Our", "Unsere")}
        title={lbl("Projects", "Projekte")}
        subtitle={lbl(
          "Choose a project. Support lasting community care.",
          "Wählen Sie ein Projekt. Unterstützen Sie nachhaltige Gemeinschaftspflege."
        )}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 text-center lg:px-8">
        <Link to="/donate">
          <Button size="lg" className="rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold">
            <Heart className="mr-2 h-4 w-4 fill-current" /> {lbl("Donate Monthly", "Monatlich spenden")}
          </Button>
        </Link>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>
    </>
  );
}
