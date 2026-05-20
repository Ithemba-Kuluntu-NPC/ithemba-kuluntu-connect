import { createFileRoute } from "@tanstack/react-router";
import { ProjectPageLayout } from "@/components/blocks/ProjectPageLayout";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/projects/pondo-dogs")({ component: () => (
  <ProjectPageLayout
    project={projects[4]}
    eyebrow="Animal welfare"
    why={{
      en: "Care for animals is part of community wellbeing. Healthier animals mean safer, healthier families.",
      de: "Tierwohl gehört zum Wohl der Gemeinschaft. Gesündere Tiere bedeuten sicherere, gesündere Familien.",
    }}
    what={{
      title: { en: "What Pondo Dogs covers", de: "Was Pondo Dogs umfasst" },
      items: [
        { en: "Veterinary access", de: "Tierärztliche Versorgung" },
        { en: "Food and shelter support", de: "Futter und Unterkunft" },
        { en: "Parasite protection", de: "Parasitenschutz" },
        { en: "Vaccinations and sterilisation", de: "Impfungen und Sterilisation" },
        { en: "Community education", de: "Gemeinschaftsbildung" },
      ],
    }}
    who={{ en: "Rural dogs and the families who share their lives.", de: "Hunde im ländlichen Raum und die Familien, die ihr Leben teilen." }}
    extraMissing={["final Pondo Dogs photos", "final animal welfare impact numbers", "final veterinary partner details", "final animal welfare donation references"]}
  />
)});
