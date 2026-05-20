import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks/LegalPage";
import { MediaGrid } from "@/components/blocks/MediaGrid";
import { Placeholder } from "@/components/site/MissingInfo";

export const Route = createFileRoute("/media")({ component: () => (
  <>
    <PageHeader eyebrow="Media" title="Media and Stories" subtitle="In the news, on screen and in conversation." />
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <MediaGrid />
    </section>
    <section className="mx-auto max-w-3xl px-4 pb-16 lg:px-8">
      <h2 className="font-display text-2xl font-bold">YouTube channel</h2>
      <div className="mt-2"><Placeholder text="final YouTube channel URL" /></div>
      <h2 className="mt-10 font-display text-2xl font-bold">Press contact</h2>
      <p className="mt-2 text-foreground/80">info@ithembakuluntu.org</p>
      <Placeholder text="dedicated press contact, if different" />
    </section>
  </>
)});
