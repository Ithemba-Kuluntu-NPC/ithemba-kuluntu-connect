import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/blocks/LegalPage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cookie-policy")({ component: () => (
  <>
    <LegalPage
      title="Cookie Policy"
      intro="How we use cookies and how you can manage them."
      missing={["final cookie category descriptions", "final cookie consent wording", "cookie consent provider"]}
      sections={[
        { heading: "Essential cookies", missing: ["final essential cookie list"] },
        { heading: "Analytics cookies", missing: ["analytics cookie list and tool"] },
        { heading: "Marketing cookies", missing: ["marketing cookie list"] },
        { heading: "Embedded media cookies", missing: ["embedded media cookie list"] },
      ]}
    />
    <div className="mx-auto max-w-3xl px-4 pb-16 lg:px-8">
      <Button onClick={() => { localStorage.removeItem("cookie-consent"); location.reload(); }} className="rounded-full bg-[var(--ithemba-blue)] hover:bg-[var(--ithemba-blue-dark)]">
        Reopen cookie settings
      </Button>
    </div>
  </>
)});
