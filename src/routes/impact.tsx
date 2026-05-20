import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks/LegalPage";
import { ImpactCounters } from "@/components/blocks/ImpactCounters";
import { fullImpactCounters } from "@/data/projects";
import { Placeholder } from "@/components/site/MissingInfo";
import { useLang } from "@/components/site/LanguageProvider";

export const Route = createFileRoute("/impact")({ component: Impact });

function Impact() {
  const { lang } = useLang();
  const lbl = (en: string, de: string) => (lang === "en" ? en : de);
  return (
    <>
      <PageHeader eyebrow={lbl("Our", "Unsere")} title={lbl("Impact", "Wirkung")} subtitle={lbl("Our work, our numbers, our accountability.", "Unsere Arbeit, unsere Zahlen, unsere Verantwortung.")} />
      <ImpactCounters items={fullImpactCounters} compact />
      <section className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-[var(--ithemba-blue-dark)]">{lbl("Why it matters", "Warum es zählt")}</h2>
        <p className="mt-3 text-lg text-foreground/85">
          {lbl("Unsafe water, hunger, poor learning conditions and poverty are connected. So our response must be connected too.",
               "Unsicheres Wasser, Hunger, schlechte Lernbedingungen und Armut hängen zusammen. Daher muss auch unsere Antwort vernetzt sein.")}
        </p>
        <h3 className="mt-10 font-display text-xl font-bold">{lbl("Reporting and transparency", "Berichterstattung und Transparenz")}</h3>
        <div className="mt-3 space-y-1">
          <Placeholder text="final impact counters and reporting period" kind="verify" />
          <Placeholder text="annual report download" />
          <Placeholder text="financial statements download" />
          <Placeholder text="monitoring and evaluation report download" />
          <Placeholder text="latest project report download" />
        </div>
      </section>
    </>
  );
}
