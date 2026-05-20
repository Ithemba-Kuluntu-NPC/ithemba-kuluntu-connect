import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/blocks/LegalPage";

export const Route = createFileRoute("/datenschutz")({ component: () => (
  <LegalPage
    title="Datenschutz"
    intro="Information on data processing under GDPR and POPIA."
    missing={["final Datenschutz text reviewed for GDPR and POPIA"]}
    sections={[
      { heading: "Verantwortlicher / Controller", missing: ["controller details"] },
      { heading: "Kontakt Datenschutz", missing: ["data protection contact"] },
      { heading: "Hosting", missing: ["hosting provider"] },
      { heading: "Cookies", missing: ["cookie tool"] },
      { heading: "Analyse / Analytics", missing: ["analytics tool"] },
      { heading: "Formulare", missing: ["form handling service"] },
      { heading: "Newsletter", missing: ["newsletter platform"] },
      { heading: "Spenden und Zahlungen", missing: ["payment provider"] },
      { heading: "Social Media Links", missing: ["social embed handling"] },
      { heading: "Eingebettete Videos", missing: ["video embed provider"] },
      { heading: "Ihre Rechte", missing: ["user rights wording"] },
      { heading: "Speicherdauer", missing: ["data retention wording"] },
      { heading: "Aktualisierungen", missing: ["updates wording"] },
    ]}
  />
)});
