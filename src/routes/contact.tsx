import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Instagram,
  HandHeart,
  Handshake,
  Megaphone,
  HeartHandshake,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { assets } from "@/data/assets";

export const Route = createFileRoute("/contact")({ component: ContactPage });

const HERO_IMG = assets.photos.about.cwebeni;
const CTA_BG = assets.photos.home.impact;

/* ---------- shared visual atoms ---------- */
function Wave({ from, to }: { from: string; to: string }) {
  return (
    <div className="relative" style={{ background: from, lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-[44px] w-full md:h-[64px]"
        aria-hidden
      >
        <path d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,50 L1440,90 L0,90 Z" fill={to} />
      </svg>
    </div>
  );
}


/* ---------- copy ---------- */
type Copy = {
  hero: { eyebrow: string; title: string; text: string };
  details: {
    heading: string;
    intro: string;
    emailLabel: string;
    phoneLabel: string;
    whatsappLabel: string;
    saLabel: string;
    deLabel: string;
  };
  form: {
    heading: string;
    subheading: string;
    name: string;
    email: string;
    country: string;
    subject: string;
    message: string;
    submit: string;
    success: string;
    sending: string;
  };
  help: {
    eyebrow: string;
    title: string;
    text: string;
    items: { icon: keyof typeof HELP_ICONS; label: string }[];
  };
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    projects: string;
    partner: string;
  };
};

const HELP_ICONS = {
  Handshake,
  Megaphone,
  HeartHandshake,
  HandHeart,
  UserCheck,
  Sparkles,
} as const;

const COPY: Record<"en" | "de" | "nl", Copy> = {
  en: {
    hero: {
      eyebrow: "Get in touch",
      title: "Contact",
      text: "For partnerships, funders, media, donations or project support, please contact us.",
    },
    details: {
      heading: "Get in touch",
      intro:
        "For partnerships, funders, media, donations or project support, please use the form or contact us directly.",
      emailLabel: "Email",
      phoneLabel: "Phone",
      whatsappLabel: "WhatsApp",
      saLabel: "South Africa",
      deLabel: "Germany",
    },
    form: {
      heading: "Send us a message",
      subheading: "We will get back to you as soon as possible.",
      name: "Name",
      email: "Email",
      country: "Country",
      subject: "Subject",
      message: "Message",
      submit: "Send message",
      sending: "Sending…",
      success:
        "Thank you. Your message has been received, and we will get back to you as soon as possible.",
    },
    help: {
      eyebrow: "How we can help",
      title: "The right message reaches the right team",
      text: "We welcome messages from partners, funders, donors, media, volunteers and organisations interested in supporting or learning more about our work.",
      items: [
        { icon: "Handshake", label: "Partnerships and funding" },
        { icon: "Megaphone", label: "Media and interviews" },
        { icon: "HandHeart", label: "Project support" },
        { icon: "HeartHandshake", label: "Donations and giving" },
        { icon: "UserCheck", label: "Volunteer or skills-based support" },
        { icon: "Sparkles", label: "General enquiries" },
      ],
    },
    cta: {
      eyebrow: "Let’s connect",
      title: "Together, care can reach further",
      text: "Whether you want to partner, support a project, share our story or ask a question, we would be glad to hear from you.",
      projects: "Explore Our Projects",
      partner: "Partner With Us",
    },
  },
  de: {
    hero: {
      eyebrow: "Kontakt aufnehmen",
      title: "Kontakt",
      text: "Für Partnerschaften, Förderer, Medienanfragen, Spenden oder Projektunterstützung kontaktieren Sie uns gerne.",
    },
    details: {
      heading: "Kontakt",
      intro:
        "Für Partnerschaften, Förderer, Medienanfragen, Spenden oder Projektunterstützung nutzen Sie bitte das Formular oder kontaktieren Sie uns direkt.",
      emailLabel: "E-Mail",
      phoneLabel: "Telefon",
      whatsappLabel: "WhatsApp",
      saLabel: "Südafrika",
      deLabel: "Deutschland",
    },
    form: {
      heading: "Nachricht senden",
      subheading: "Wir melden uns so bald wie möglich bei Ihnen.",
      name: "Name",
      email: "E-Mail",
      country: "Land",
      subject: "Betreff",
      message: "Nachricht",
      submit: "Nachricht senden",
      sending: "Wird gesendet…",
      success:
        "Vielen Dank. Ihre Nachricht wurde empfangen, und wir melden uns so bald wie möglich bei Ihnen.",
    },
    help: {
      eyebrow: "Wobei wir helfen können",
      title: "Die richtige Nachricht erreicht das richtige Team",
      text: "Wir freuen uns über Nachrichten von Partnern, Förderern, Spenderinnen und Spendern, Medien, Freiwilligen und Organisationen, die unsere Arbeit unterstützen oder mehr darüber erfahren möchten.",
      items: [
        { icon: "Handshake", label: "Partnerschaften und Förderung" },
        { icon: "Megaphone", label: "Medien und Interviews" },
        { icon: "HandHeart", label: "Projektunterstützung" },
        { icon: "HeartHandshake", label: "Spenden und Geben" },
        { icon: "UserCheck", label: "Ehrenamtliche oder kompetenzbasierte Unterstützung" },
        { icon: "Sparkles", label: "Allgemeine Anfragen" },
      ],
    },
    cta: {
      eyebrow: "Lassen Sie uns ins Gespräch kommen",
      title: "Gemeinsam kann Fürsorge weiter reichen",
      text: "Ob Sie eine Partnerschaft aufbauen, ein Projekt unterstützen, unsere Geschichte teilen oder eine Frage stellen möchten: Wir freuen uns, von Ihnen zu hören.",
      projects: "Unsere Projekte entdecken",
      partner: "Partner werden",
    },
  },
  nl: {
    hero: {
      eyebrow: "Neem contact op",
      title: "Contact",
      text: "Voor partnerschappen, fondsen, media, donaties of projectondersteuning kunt u contact met ons opnemen.",
    },
    details: {
      heading: "Contact",
      intro:
        "Voor partnerschappen, fondsen, media, donaties of projectondersteuning kunt u het formulier gebruiken of rechtstreeks contact met ons opnemen.",
      emailLabel: "E-mail",
      phoneLabel: "Telefoon",
      whatsappLabel: "WhatsApp",
      saLabel: "Zuid-Afrika",
      deLabel: "Duitsland",
    },
    form: {
      heading: "Stuur een bericht",
      subheading: "We nemen zo snel mogelijk contact met u op.",
      name: "Naam",
      email: "E-mail",
      country: "Land",
      subject: "Onderwerp",
      message: "Bericht",
      submit: "Bericht verzenden",
      sending: "Wordt verzonden…",
      success:
        "Dank u wel. Uw bericht is ontvangen, en we nemen zo snel mogelijk contact met u op.",
    },
    help: {
      eyebrow: "Waarmee we kunnen helpen",
      title: "Uw bericht komt bij het juiste team terecht",
      text: "Wij ontvangen graag berichten van partners, fondsen, donoren, media, vrijwilligers en organisaties die ons werk willen ondersteunen of er meer over willen weten.",
      items: [
        { icon: "Handshake", label: "Partnerschappen en financiering" },
        { icon: "Megaphone", label: "Media en interviews" },
        { icon: "HandHeart", label: "Projectondersteuning" },
        { icon: "HeartHandshake", label: "Donaties en giften" },
        { icon: "UserCheck", label: "Vrijwillige of vaardigheidsgerichte ondersteuning" },
        { icon: "Sparkles", label: "Algemene vragen" },
      ],
    },
    cta: {
      eyebrow: "Laten we verbinden",
      title: "Samen kan zorg verder reiken",
      text: "Of u nu een partnerschap wilt aangaan, een project wilt steunen, ons verhaal wilt delen of een vraag heeft: wij horen graag van u.",
      projects: "Ontdek onze projecten",
      partner: "Word partner",
    },
  },
};

/* ---------- contact constants (single source of truth) ---------- */
const EMAIL = "info@ithembakuluntu.org";
const PHONE = "+27 71 977 8063";
const WHATSAPP = "+27 71 977 8063";
const WHATSAPP_HREF = "https://wa.me/27719778063";
const SA_ADDRESS = ["Cwebeni, Ward 5, Caguba A/A", "Port St. Johns", "Eastern Cape", "South Africa", "5120"];
const DE_ADDRESS = ["Am Emberg 20", "57399 Kirchhundem", "Germany"];

/* ---------- form (presentation-only; no fake backend) ---------- */
function ContactFormCard({ copy }: { copy: Copy["form"] }) {
  const [sent, setSent] = useState(false);

  // No backend wired yet. TODO: connect submission handler when backend is ready.
  // Keep form purely presentational so we do not invent a working pipeline.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_-30px_rgba(11,37,69,0.35)] ring-1 ring-[color:var(--ithemba-blue,#1d4e89)]/10 md:p-10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[color:var(--ithemba-teal,#2bb0a4)]" />
        <h3 className="mt-4 font-display text-2xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
          {copy.heading}
        </h3>
        <p className="mt-3 text-[15px] text-foreground/80">{copy.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-white p-5 shadow-[0_20px_60px_-30px_rgba(11,37,69,0.35)] ring-1 ring-[color:var(--ithemba-blue,#1d4e89)]/10 md:p-7"
    >
      <h3 className="font-display text-2xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-[26px]">
        {copy.heading}
      </h3>
      <p className="mt-1 text-sm text-foreground/70">{copy.subheading}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="c-name" className="text-[13px] font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
            {copy.name}
          </Label>
          <Input id="c-name" name="name" required autoComplete="name" className="h-10 rounded-xl border-[color:var(--ithemba-blue,#1d4e89)]/15 bg-[color:var(--ithemba-cream,#fdf7ed)]/40 shadow-none focus-visible:ring-[color:var(--ithemba-blue,#1d4e89)]" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-email" className="text-[13px] font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
            {copy.email}
          </Label>
          <Input id="c-email" name="email" type="email" required autoComplete="email" className="h-10 rounded-xl border-[color:var(--ithemba-blue,#1d4e89)]/15 bg-[color:var(--ithemba-cream,#fdf7ed)]/40 shadow-none focus-visible:ring-[color:var(--ithemba-blue,#1d4e89)]" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-country" className="text-[13px] font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
            {copy.country}
          </Label>
          <Input id="c-country" name="country" autoComplete="country-name" className="h-10 rounded-xl border-[color:var(--ithemba-blue,#1d4e89)]/15 bg-[color:var(--ithemba-cream,#fdf7ed)]/40 shadow-none focus-visible:ring-[color:var(--ithemba-blue,#1d4e89)]" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-subject" className="text-[13px] font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
            {copy.subject}
          </Label>
          <Input id="c-subject" name="subject" className="h-10 rounded-xl border-[color:var(--ithemba-blue,#1d4e89)]/15 bg-[color:var(--ithemba-cream,#fdf7ed)]/40 shadow-none focus-visible:ring-[color:var(--ithemba-blue,#1d4e89)]" />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="c-message" className="text-[13px] font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
            {copy.message}
          </Label>
          <Textarea id="c-message" name="message" rows={4} required className="rounded-xl border-[color:var(--ithemba-blue,#1d4e89)]/15 bg-[color:var(--ithemba-cream,#fdf7ed)]/40 shadow-none focus-visible:ring-[color:var(--ithemba-blue,#1d4e89)]" />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-5 w-full rounded-full bg-[color:var(--ithemba-blue,#1d4e89)] py-5 text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(29,78,137,0.6)] hover:bg-[color:var(--ithemba-blue-deepest,#0b2545)]"
      >
        <Send className="mr-2 h-5 w-5" />
        {copy.submit}
      </Button>
    </form>

  );
}

/* ---------- page ---------- */
function ContactPage() {
  const { lang } = useLang();
  const c = COPY[lang];

  const blueDeep = "var(--ithemba-blue-deepest, #0b2545)";
  const blue = "var(--ithemba-blue, #1d4e89)";
  const cream = "var(--ithemba-cream, #fdf7ed)";
  const yellow = "var(--ithemba-yellow, #f5c64a)";

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[48vh] min-h-[360px] w-full">
          <img
            src={HERO_IMG}
            alt="Cwebeni community landscape in Pondoland, Eastern Cape"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/75" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(60% 80% at 20% 30%, rgba(11,37,69,0.45), transparent 70%)" }}
          />
          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-10 pt-20 md:px-8 md:pb-14">
            <p
              className="text-2xl md:text-3xl"
              style={{ fontFamily: '"Caveat", "Kalam", cursive', color: yellow }}
            >
              {c.hero.eyebrow}
            </p>
            <h1 className="mt-1 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl">
              {c.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/90 md:text-lg">{c.hero.text}</p>
          </div>
        </div>
        <Wave from="rgba(0,0,0,0)" to={cream} />
      </section>

      {/* ============ DETAILS + FORM ============ */}
      <section style={{ background: cream }}>
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          {/* Left — details */}
          <div>
            <p
              className="text-3xl"
              style={{ fontFamily: '"Caveat", "Kalam", cursive', color: blue }}
            >
              {c.details.heading}
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
              {c.details.heading}
            </h2>
            <p className="mt-3 max-w-md text-[15px] text-foreground/80">{c.details.intro}</p>

            <ul className="mt-6 space-y-4">

              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[color:var(--ithemba-blue,#1d4e89)]/10 text-[color:var(--ithemba-blue,#1d4e89)]" aria-hidden>
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">{c.details.emailLabel}</p>
                  <a href={`mailto:${EMAIL}`} className="text-[15px] font-medium text-[color:var(--ithemba-blue-deepest,#0b2545)] underline-offset-4 hover:underline md:text-base">
                    {EMAIL}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[color:var(--ithemba-blue,#1d4e89)]/10 text-[color:var(--ithemba-blue,#1d4e89)]" aria-hidden>
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">{c.details.phoneLabel}</p>
                  <a href={`tel:${PHONE.replace(/\s+/g, "")}`} className="text-[15px] font-medium text-[color:var(--ithemba-blue-deepest,#0b2545)] underline-offset-4 hover:underline md:text-base">
                    {PHONE}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[color:var(--ithemba-blue,#1d4e89)]/10 text-[color:var(--ithemba-blue,#1d4e89)]" aria-hidden>
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">{c.details.whatsappLabel}</p>
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="text-[15px] font-medium text-[color:var(--ithemba-blue-deepest,#0b2545)] underline-offset-4 hover:underline md:text-base">
                    {WHATSAPP}
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-[color:var(--ithemba-blue,#1d4e89)]/10">
                <div className="flex items-center gap-2 text-[color:var(--ithemba-blue,#1d4e89)]">
                  <MapPin className="h-4 w-4" aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-wide">{c.details.saLabel}</p>
                </div>
                <address className="mt-2 not-italic text-[14px] leading-relaxed text-foreground/85">
                  {SA_ADDRESS.map((line) => (<div key={line}>{line}</div>))}
                </address>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-[color:var(--ithemba-blue,#1d4e89)]/10">
                <div className="flex items-center gap-2 text-[color:var(--ithemba-blue,#1d4e89)]">
                  <MapPin className="h-4 w-4" aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-wide">{c.details.deLabel}</p>
                </div>
                <address className="mt-2 not-italic text-[14px] leading-relaxed text-foreground/85">
                  {DE_ADDRESS.map((line) => (<div key={line}>{line}</div>))}
                </address>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2">
              <a
                href="https://www.instagram.com/ithemba.kuluntu/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--ithemba-blue,#1d4e89)] text-white transition hover:bg-[color:var(--ithemba-blue-deepest,#0b2545)]"
              >
                <Instagram className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          {/* Right — form */}
          <ContactFormCard copy={c.form} />
        </div>
      </section>

      <Wave from={cream} to="#ffffff" />

      {/* ============ HOW WE CAN HELP ============ */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p
            className="text-3xl"
            style={{ fontFamily: '"Caveat", "Kalam", cursive', color: blue }}
          >
            {c.help.eyebrow}
          </p>
          <h2 className="mt-1 max-w-3xl font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
            {c.help.title}
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] text-foreground/80 md:text-base">{c.help.text}</p>

          <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.help.items.map((it) => {
              const Icon = HELP_ICONS[it.icon];
              return (
                <li key={it.label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[color:var(--ithemba-blue,#1d4e89)]/10 text-[color:var(--ithemba-blue,#1d4e89)]" aria-hidden>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="pt-1.5 text-[15px] font-medium text-foreground md:text-base">{it.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Wave from="#ffffff" to={blueDeep} />

      {/* ============ CLOSING CTA ============ */}
      <section className="relative isolate overflow-hidden text-white" style={{ background: blueDeep }}>
        <img
          src={CTA_BG}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b2545]/85 via-[#0b2545]/80 to-[#0b2545]/95" />
        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center md:px-8 md:py-32">
          <p
            className="text-3xl md:text-4xl"
            style={{ fontFamily: '"Caveat", "Kalam", cursive', color: yellow }}
          >
            {c.cta.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-5xl">{c.cta.title}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] text-white/85 md:text-base">{c.cta.text}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-[color:var(--ithemba-yellow,#f5c64a)] text-[#0b2545] hover:bg-[color:var(--ithemba-yellow,#f5c64a)]/90">
              <Link to="/projects">
                {c.cta.projects}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white/20">
              <Link to="/partners">
                <Handshake className="mr-2 h-5 w-5" />
                {c.cta.partner}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
