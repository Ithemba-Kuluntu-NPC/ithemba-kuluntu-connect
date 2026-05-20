import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/blocks/LegalPage";

export const Route = createFileRoute("/donation-terms")({ component: () => (
  <LegalPage title="Donation Terms" intro="Terms governing donations to iThemba Kuluntu."
    missing={["final donation terms", "recurring donation cancellation process", "refund policy", "tax receipt wording"]}
    sections={[
      { heading: "Monthly donations", missing: ["monthly donation terms"] },
      { heading: "One-time donations", missing: ["one-time donation terms"] },
      { heading: "Cancellation", missing: ["cancellation wording"] },
      { heading: "Refunds", missing: ["refund wording"] },
      { heading: "Tax receipts", missing: ["Section 18A wording", "German Spendenbescheinigung wording"] },
      { heading: "Restricted donations", missing: ["restricted donation wording"] },
      { heading: "Reporting", missing: ["donation reporting wording"] },
    ]}
  />
)});
