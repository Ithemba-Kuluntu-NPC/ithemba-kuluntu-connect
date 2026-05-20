import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks/LegalPage";
import { PartnerGrid } from "@/components/blocks/PartnerGrid";
import { ContactForm } from "@/components/blocks/ContactForm";

export const Route = createFileRoute("/partners")({ component: () => (
  <>
    <PageHeader eyebrow="Work with us" title="Partner with iThemba Kuluntu" subtitle="Work with a community-rooted organisation delivering practical support in rural Pondoland." />
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h2 className="font-display text-2xl font-bold">Why partner with us</h2>
      <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
        {["Local trust and grounded delivery","Women-led, community-rooted leadership","Transparent reporting and accountability","Connected programmes — water, food, learning, care","Proven response capacity","Long-term presence in Pondoland"].map(x => (
          <li key={x} className="rounded-2xl border border-border bg-white p-3">• {x}</li>
        ))}
      </ul>
      <h2 className="mt-12 font-display text-2xl font-bold">Project partnership opportunities</h2>
      <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
        {["Education","Safe Water","Food Security","Greenhouse & Nutrition","Animal Welfare","Emergency Support"].map(x => (
          <div key={x} className="rounded-2xl bg-[var(--ithemba-cream)] p-3 font-medium">{x}</div>
        ))}
      </div>
      <h2 className="mt-12 font-display text-2xl font-bold">Our current partners</h2>
      <div className="mt-5"><PartnerGrid /></div>
      <h2 className="mt-12 font-display text-2xl font-bold">Start a partnership conversation</h2>
      <p className="mt-2 text-foreground/80">For CSI, ESG, foundation, grant-making or implementation partnerships.</p>
      <div className="mt-5"><ContactForm partnership /></div>
    </section>
  </>
)});
