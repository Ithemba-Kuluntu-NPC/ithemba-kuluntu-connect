import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/blocks/LegalPage";

export const Route = createFileRoute("/terms")({ component: () => (
  <LegalPage title="Terms of Use" intro="Terms governing the use of this website."
    missing={["final website terms of use"]}
    sections={[{ heading: "Acceptable use", missing: ["acceptable use wording"] }, { heading: "Intellectual property", missing: ["IP wording"] }, { heading: "Limitation of liability", missing: ["limitation of liability wording"] }]}
  />
)});
