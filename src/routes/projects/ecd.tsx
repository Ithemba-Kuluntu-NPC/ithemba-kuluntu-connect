import { createFileRoute } from "@tanstack/react-router";
import { ProjectPageLayout } from "@/components/blocks/ProjectPageLayout";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/projects/ecd")({ component: () => (
  <ProjectPageLayout
    project={projects[0]}
    eyebrow="Early Learning"
    why={{
      en: "When children are nourished, safe and supported early, their future becomes stronger.",
      de: "Wenn Kinder früh genährt, sicher und unterstützt sind, wird ihre Zukunft stärker.",
    }}
    what={{
      title: { en: "What the ECD Centre provides", de: "Was das ECD-Zentrum bietet" },
      items: [
        { en: "Early learning and play", de: "Frühkindliches Lernen und Spielen" },
        { en: "Daily nourishing meals", de: "Tägliche, nahrhafte Mahlzeiten" },
        { en: "Care and safe routines", de: "Betreuung und sichere Routinen" },
        { en: "School readiness for Grade R", de: "Schulvorbereitung für Grade R" },
        { en: "Safe, joyful spaces", de: "Sichere, fröhliche Räume" },
        { en: "Community-led teaching team", de: "Lokal geführtes Lehrteam" },
      ],
    }}
    who={{ en: "Young children and their families in Cwebeni and surrounding villages.", de: "Kleine Kinder und ihre Familien in Cwebeni und Umgebung." }}
    extraMissing={["final ECD Centre photo gallery", "final number of children enrolled", "ECD registration details, if shown", "consent for children's photos"]}
  />
)});
