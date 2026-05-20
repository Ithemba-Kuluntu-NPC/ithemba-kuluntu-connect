import { createFileRoute } from "@tanstack/react-router";
import { ProjectPageLayout } from "@/components/blocks/ProjectPageLayout";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/projects/pureflow")({ component: () => (
  <ProjectPageLayout
    project={projects[1]}
    eyebrow="Safe Water"
    why={{
      en: "Unsafe water harms health, learning and household resilience. Practical, sustained access changes the everyday.",
      de: "Unsicheres Wasser schadet Gesundheit, Lernen und Familien. Praktischer, dauerhafter Zugang verändert den Alltag.",
    }}
    what={{
      title: { en: "More than a filter", de: "Mehr als ein Filter" },
      items: [
        { en: "Safe water access at point of use", de: "Sauberes Wasser am Verbrauchsort" },
        { en: "WASH education", de: "WASH-Bildung" },
        { en: "Local assembly", de: "Lokale Montage" },
        { en: "Distribution and aftercare", de: "Verteilung und Nachsorge" },
        { en: "Monitoring and reporting", de: "Monitoring und Berichte" },
        { en: "Community-led delivery", de: "Lokal geführte Umsetzung" },
      ],
    }}
    who={{ en: "Households, schools and ECD centres across rural Pondoland.", de: "Haushalte, Schulen und ECD-Zentren im ländlichen Pondoland." }}
    counters={[
      { value: 3000, suffix: "+", label: { en: "Systems distributed", de: "Systeme verteilt" } },
      { value: 14000, suffix: "+", label: { en: "People impacted", de: "Menschen erreicht" } },
    ]}
    extraMissing={["final PureFlow Amanzi project photos", "final lab test download links", "final user guide links", "final PureFlow impact figures"]}
  />
)});
