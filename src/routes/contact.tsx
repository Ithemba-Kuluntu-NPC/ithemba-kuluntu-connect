import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks/LegalPage";
import { ContactForm } from "@/components/blocks/ContactForm";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { Placeholder } from "@/components/site/MissingInfo";

export const Route = createFileRoute("/contact")({ component: () => (
  <>
    <PageHeader eyebrow="Get in touch" title="Contact" subtitle="For partnerships, funders, media or project support, please contact us." />
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.2fr] lg:px-8">
      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[var(--ithemba-blue)]/10">
          <h2 className="font-display text-xl font-bold">Get in touch</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[var(--ithemba-blue)]" /> info@ithembakuluntu.org</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[var(--ithemba-blue)]" /> +27 71 977 8063</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-[var(--ithemba-blue)]" /> Flat Rock Cottage, Cwebeni Beach, Port St Johns, Eastern Cape, South Africa, 5090</li>
          </ul>
          <Placeholder text="public phone number" kind="verify" />
          <Placeholder text="public WhatsApp number, if used" />
          <Placeholder text="German contact details" />
        </div>
        <div className="rounded-3xl bg-[var(--ithemba-cream)] p-6">
          <h3 className="font-display text-base font-bold">Find us</h3>
          <div className="mt-3 flex h-48 items-center justify-center rounded-2xl bg-white text-sm text-muted-foreground">Map placeholder</div>
          <Placeholder text="Google Maps embed link" />
        </div>
        <div className="flex gap-2">
          <a href="https://www.instagram.com/ithemba.kuluntu/" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ithemba-blue)] text-white"><Instagram className="h-4 w-4" /></a>
        </div>
      </div>
      <ContactForm />
    </section>
  </>
)});
