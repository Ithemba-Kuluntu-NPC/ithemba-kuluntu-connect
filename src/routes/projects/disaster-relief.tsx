import { createFileRoute } from "@tanstack/react-router";
import { ProjectPageLayout } from "@/components/blocks/ProjectPageLayout";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/projects/disaster-relief")({ component: () => (
  <ProjectPageLayout
    project={projects[5]}
    eyebrow="Emergency support"
    why={{
      en: "When floods, fires, medical crises or sudden hardship hit, fast local response saves lives and protects dignity.",
      de: "Wenn Überschwemmungen, Brände, medizinische Notfälle oder plötzliche Not eintreten, retten schnelle lokale Reaktionen Leben.",
    }}
    what={{
      title: { en: "What emergency support can include", de: "Was Nothilfe umfassen kann" },
      items: [
        { en: "Food", de: "Nahrung" },
        { en: "Blankets", de: "Decken" },
        { en: "Mattresses", de: "Matratzen" },
        { en: "Medical support", de: "Medizinische Hilfe" },
        { en: "Clothing", de: "Kleidung" },
        { en: "Emergency supplies", de: "Notversorgung" },
      ],
    }}
    who={{ en: "Families and individuals across Pondoland facing sudden crisis.", de: "Familien und Einzelpersonen in Pondoland in plötzlicher Krise." }}
    extraMissing={["final disaster relief photos", "disaster relief case stories", "emergency support partner list", "final emergency support wording"]}
  />
)});
