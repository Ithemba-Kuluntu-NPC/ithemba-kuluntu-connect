import { createFileRoute } from "@tanstack/react-router";
import { ProjectPageLayout } from "@/components/blocks/ProjectPageLayout";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/projects/greenhouse")({ component: () => (
  <ProjectPageLayout
    project={projects[2]}
    eyebrow="Nutrition"
    why={{
      en: "Food grown close to the community supports nutrition, livelihoods and learning at the same time.",
      de: "Nahrungsmittel vor Ort stärken gleichzeitig Ernährung, Lebensgrundlagen und Bildung.",
    }}
    what={{
      title: { en: "What the greenhouse delivers", de: "Was das Gewächshaus leistet" },
      items: [
        { en: "Locally grown food", de: "Lokal angebaute Nahrungsmittel" },
        { en: "Women's skills and roles", de: "Fähigkeiten und Rollen für Frauen" },
        { en: "Nutrition for children", de: "Ernährung für Kinder" },
        { en: "Partner-powered resilience", de: "Resilienz durch Partner" },
      ],
    }}
    who={{ en: "Rural families, children and trainees engaged in growing and nutrition.", de: "Ländliche Familien, Kinder und Auszubildende im Anbau und in der Ernährung." }}
    extraMissing={["final greenhouse project photos", "SA Harvest approved logo", "SA Harvest partner URL", "final greenhouse impact numbers", "permission to display SA Harvest logo"]}
  />
)});
