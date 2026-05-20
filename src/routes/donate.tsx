import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks/LegalPage";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { Placeholder } from "@/components/site/MissingInfo";
import { Shield, Repeat, FileText, Heart } from "lucide-react";

export const Route = createFileRoute("/donate")({ component: () => (
  <>
    <PageHeader eyebrow="Give monthly" title="Help build stronger rural communities" subtitle="Your monthly donation helps sustain safe water, early learning, food security, animal welfare and emergency support." accent="var(--ithemba-blue)" />
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_1fr] lg:px-8">
      <DonationWidget />
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-[var(--ithemba-blue-dark)]">What monthly giving supports</h2>
        <ul className="grid gap-2 text-sm">
          {[
            ["Heart","Daily meals for children at the ECD Centre"],
            ["Heart","Safe water access for households and schools"],
            ["Heart","Care and supplies for vulnerable families"],
            ["Heart","Rural animal welfare through Pondo Dogs"],
            ["Heart","Rapid emergency response when crises hit"],
          ].map(([_, t]) => (
            <li key={t} className="flex items-start gap-2 rounded-2xl bg-white p-3 ring-1 ring-[var(--ithemba-blue)]/10">
              <Heart className="mt-0.5 h-4 w-4 fill-[var(--ithemba-yellow)] text-[var(--ithemba-yellow)]" /> <span>{t}</span>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-[var(--ithemba-blue)]" /> Registered nonprofit</div>
          <div className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-[var(--ithemba-blue)]" /> PBO & NPO registered</div>
          <div className="flex items-center gap-1.5"><Repeat className="h-4 w-4 text-[var(--ithemba-blue)]" /> Transparent reporting</div>
          <div className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-[var(--ithemba-blue)]" /> Community-rooted</div>
        </div>
        <div className="rounded-2xl bg-[var(--ithemba-cream)] p-4">
          <h3 className="font-display text-base font-bold">Donation integrations</h3>
          <div className="mt-2 space-y-1">
            <Placeholder text="monthly donation payment provider" />
            <Placeholder text="one-time donation payment provider" />
            <Placeholder text="German IBAN" />
            <Placeholder text="German BIC" />
            <Placeholder text="South African bank account details" />
            <Placeholder text="PayPal donation link" />
            <Placeholder text="Stripe payment link" />
            <Placeholder text="donation receipt process" />
            <Placeholder text="Section 18A tax certificate wording" />
            <Placeholder text="German donation receipt wording" />
            <Placeholder text="monthly donation cancellation process" />
          </div>
        </div>
      </div>
    </section>
  </>
)});
