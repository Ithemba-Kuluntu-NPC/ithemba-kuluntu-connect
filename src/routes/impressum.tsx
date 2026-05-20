import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/blocks/LegalPage";

export const Route = createFileRoute("/impressum")({ component: () => (
  <LegalPage
    title="Impressum"
    intro="iThemba Kuluntu e.V. — Germany"
    missing={["final German Impressum text reviewed by responsible person"]}
    sections={[
      { heading: "Anschrift", missing: ["German registered address"] },
      { heading: "Verantwortlich (V.i.S.d.P.)", missing: ["responsible person under German law"] },
      { heading: "Vereinsregister", missing: ["German Vereinsregister number", "German register court"] },
      { heading: "Steuer", missing: ["German tax number"] },
      { heading: "Kontakt", missing: ["German contact phone", "German contact email"] },
      { heading: "Spendenkonto", missing: ["German donation account details"] },
      { heading: "Haftungsausschluss", missing: ["final liability disclaimer wording"] },
      { heading: "Urheberrecht", missing: ["final copyright wording"] },
    ]}
  />
)});
