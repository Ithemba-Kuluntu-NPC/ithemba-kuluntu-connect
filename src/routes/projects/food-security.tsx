import { createFileRoute } from "@tanstack/react-router";
import { ProjectPageLayout } from "@/components/blocks/ProjectPageLayout";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/projects/food-security")({ component: () => (
  <ProjectPageLayout
    project={projects[3]}
    eyebrow="Food Security"
    why={{
      en: "Hunger affects learning, health and family stability. A monthly feeding rhythm protects families through the year.",
      de: "Hunger beeinträchtigt Lernen, Gesundheit und Familienstabilität. Ein monatlicher Versorgungsrhythmus schützt Familien das ganze Jahr.",
    }}
    what={{
      title: { en: "How we deliver food security", de: "So sichern wir die Ernährung" },
      items: [
        { en: "Monthly feeding scheme", de: "Monatliches Verpflegungsprogramm" },
        { en: "Food parcels", de: "Lebensmittelpakete" },
        { en: "Community kitchens", de: "Gemeinschaftsküchen" },
        { en: "Rescued food partnerships", de: "Partnerschaften zur Lebensmittelrettung" },
      ],
    }}
    who={{ en: "Vulnerable households, children and caregivers across our partner villages.", de: "Gefährdete Haushalte, Kinder und Betreuende in unseren Partnerdörfern." }}
    counters={[
      { value: 300000, suffix: "+", label: { en: "Meals served", de: "Mahlzeiten serviert" } },
      { value: 2800, suffix: "+", label: { en: "Food hampers distributed", de: "Lebensmittelpakete verteilt" } },
      { value: 500, suffix: "", label: { en: "Children fed daily", de: "Kinder täglich versorgt" } },
    ]}
    extraMissing={["final food security project photos", "final feeding scheme schedule", "final food security partner list"]}
  />
)});
