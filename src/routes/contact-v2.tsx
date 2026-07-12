import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { assets } from "@/data/assets";

export const Route = createFileRoute("/contact-v2")({ component: ContactV2Page });

const BG_IMG = assets.photos.about.cwebeni;

/* ---------- copy ---------- */
const COPY = {
  en: {
    eyebrow: "Get in touch",
    title: "We’d love to hear from you",
    intro:
      "For partnerships, funders, media, donations or project support, please use the form or contact us directly.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    whatsappLabel: "WhatsApp",
    saLabel: "South Africa",
    deLabel: "Germany",
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
  },
  de: {
    eyebrow: "Kontakt aufnehmen",
    title: "Wir freuen uns, von Ihnen zu hören",
    intro:
      "Für Partnerschaften, Förderer, Medienanfragen, Spenden oder Projektunterstützung nutzen Sie bitte das Formular oder kontaktieren Sie uns direkt.",
    emailLabel: "E-Mail",
    phoneLabel: "Telefon",
    whatsappLabel: "WhatsApp",
    saLabel: "Südafrika",
    deLabel: "Deutschland",
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
  },
  nl: {
    eyebrow: "Neem contact op",
    title: "We horen graag van u",
    intro:
      "Voor partnerschappen, fondsen, media, donaties of projectondersteuning kunt u het formulier gebruiken of rechtstreeks contact met ons opnemen.",
    emailLabel: "E-mail",
    phoneLabel: "Telefoon",
    whatsappLabel: "WhatsApp",
    saLabel: "Zuid-Afrika",
    deLabel: "Duitsland",
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
  },
};

/* ---------- contact constants (single source of truth) ---------- */
const EMAIL = "info@ithembakuluntu.org";
const PHONE = "+27 71 977 8063";
const WHATSAPP = "+27 71 977 8063";
const WHATSAPP_HREF = "https://wa.me/27719778063";
const SA_ADDRESS = ["Cwebeni, Ward 5, Caguba A/A", "Port St. Johns", "Eastern Cape", "South Africa", "5120"];
const DE_ADDRESS = ["Am Emberg 20", "57399 Kirchhundem", "Germany"];

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.79a8.16 8.16 0 0 0 4.77 1.52V6.86a4.85 4.85 0 0 1-1.84-.17z" />
  </svg>
);

const socialLinks = [
  { href: "https://www.instagram.com/ithemba.kuluntu/", label: "Follow iThemba Kuluntu on Instagram", Icon: Instagram },
  { href: "https://web.facebook.com/people/IThemba-Kuluntu-e-V-NPO/61555304087486/", label: "Follow iThemba Kuluntu on Facebook", Icon: Facebook },
  { href: "https://www.tiktok.com/@ithemba.kuluntu", label: "Follow iThemba Kuluntu on TikTok", Icon: TikTokIcon },
  { href: "https://www.youtube.com/@iThembaKuluntu", label: "Follow iThemba Kuluntu on YouTube", Icon: Youtube },
];

/* ---------- form ---------- */
function ContactFormCard({ copy }: { copy: (typeof COPY)["en"]["form"] }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-3xl bg-[color:var(--ithemba-cream,#fdf7ed)] p-6 text-center shadow-[0_20px_60px_-30px_rgba(11,37,69,0.35)] ring-1 ring-[color:var(--ithemba-blue,#1d4e89)]/10 md:p-8">
        <CheckCircle2 className="mx-auto h-10 w-10 text-[color:var(--ithemba-teal,#2bb0a4)]" />
        <h3 className="mt-3 font-display text-xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
          {copy.heading}
        </h3>
        <p className="mt-2 text-[15px] text-foreground/80">{copy.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-[color:var(--ithemba-cream,#fdf7ed)] p-5 shadow-[0_20px_60px_-30px_rgba(11,37,69,0.35)] ring-1 ring-[color:var(--ithemba-blue,#1d4e89)]/10 md:p-6"
    >
      <h3 className="font-display text-lg font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-xl">
        {copy.heading}
      </h3>
      <p className="mt-0.5 text-sm text-foreground/70">{copy.subheading}</p>

      <div className="mt-3 grid gap-2.5 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="cv2-name" className="text-[13px] font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
            {copy.name}
          </Label>
          <Input
            id="cv2-name"
            name="name"
            required
            autoComplete="name"
            className="h-9 rounded-xl border-[color:var(--ithemba-blue,#1d4e89)]/15 bg-white shadow-none focus-visible:ring-[color:var(--ithemba-blue,#1d4e89)]"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cv2-email" className="text-[13px] font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
            {copy.email}
          </Label>
          <Input
            id="cv2-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-9 rounded-xl border-[color:var(--ithemba-blue,#1d4e89)]/15 bg-white shadow-none focus-visible:ring-[color:var(--ithemba-blue,#1d4e89)]"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cv2-country" className="text-[13px] font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
            {copy.country}
          </Label>
          <Input
            id="cv2-country"
            name="country"
            autoComplete="country-name"
            className="h-9 rounded-xl border-[color:var(--ithemba-blue,#1d4e89)]/15 bg-white shadow-none focus-visible:ring-[color:var(--ithemba-blue,#1d4e89)]"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cv2-subject" className="text-[13px] font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
            {copy.subject}
          </Label>
          <Input
            id="cv2-subject"
            name="subject"
            className="h-9 rounded-xl border-[color:var(--ithemba-blue,#1d4e89)]/15 bg-white shadow-none focus-visible:ring-[color:var(--ithemba-blue,#1d4e89)]"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="cv2-message" className="text-[13px] font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
            {copy.message}
          </Label>
          <Textarea
            id="cv2-message"
            name="message"
            rows={3}
            required
            className="rounded-xl border-[color:var(--ithemba-blue,#1d4e89)]/15 bg-white shadow-none focus-visible:ring-[color:var(--ithemba-blue,#1d4e89)]"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-3 w-full rounded-full bg-[color:var(--ithemba-blue,#1d4e89)] py-5 text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(29,78,137,0.6)] hover:bg-[color:var(--ithemba-blue-deepest,#0b2545)]"
      >
        <Send className="mr-2 h-4 w-4" />
        {copy.submit}
      </Button>
    </form>
  );
}

/* ---------- page ---------- */
function ContactV2Page() {
  const { lang } = useLang();
  const c = COPY[lang];

  const blueDeep = "var(--ithemba-blue-deepest, #0b2545)";
  const yellow = "var(--ithemba-yellow, #f5c64a)";

  return (
    <main className="relative isolate overflow-hidden">
      {/* Background photo */}
      <img
        src={BG_IMG}
        alt="Cwebeni community landscape in Pondoland, Eastern Cape"
        className="fixed inset-0 -z-10 h-full w-full object-cover"
      />

      {/* Deep blue overlay */}
      <div className="absolute inset-0 -z-10 bg-[#0b2545]/80" />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(70% 90% at 30% 20%, rgba(29,78,137,0.35), transparent 70%)" }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(60% 70% at 80% 80%, rgba(11,37,69,0.55), transparent 70%)" }}
      />

      {/* Content */}
      <div className="mx-auto grid min-h-[calc(100vh-var(--header-height))] max-w-6xl grid-cols-1 items-center gap-6 px-5 py-8 md:grid-cols-[1fr_1.05fr] md:gap-10 md:px-8 md:py-10">
        {/* Heading */}
        <div className="order-1 text-white md:col-start-1">
          <p
            className="text-2xl md:text-3xl"
            style={{ fontFamily: '"Caveat", "Kalam", cursive', color: yellow }}
          >
            {c.eyebrow}
          </p>
          <h1 className="mt-1 max-w-xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            {c.title}
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/85 md:text-base">
            {c.intro}
          </p>
        </div>

        {/* Form — right column on desktop, after heading on mobile */}
        <div className="order-2 md:col-start-2 md:row-span-2">
          <ContactFormCard copy={c.form} />
        </div>

        {/* Details — below form on mobile, left column on desktop */}
        <div className="order-3 text-white md:col-start-1">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/10 text-[color:var(--ithemba-yellow,#f5c64a)]"
                aria-hidden
              >
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{c.emailLabel}</p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-[15px] font-medium text-white underline-offset-4 hover:underline md:text-base"
                >
                  {EMAIL}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/10 text-[color:var(--ithemba-yellow,#f5c64a)]"
                aria-hidden
              >
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{c.phoneLabel}</p>
                <a
                  href={`tel:${PHONE.replace(/\s+/g, "")}`}
                  className="text-[15px] font-medium text-white underline-offset-4 hover:underline md:text-base"
                >
                  {PHONE}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/10 text-[color:var(--ithemba-yellow,#f5c64a)]"
                aria-hidden
              >
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{c.whatsappLabel}</p>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-medium text-white underline-offset-4 hover:underline md:text-base"
                >
                  {WHATSAPP}
                </a>
              </div>
            </li>
          </ul>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/95 p-4 text-[color:var(--ithemba-blue-deepest,#0b2545)] ring-1 ring-white/10">
              <div className="flex items-center gap-2 text-[color:var(--ithemba-blue,#1d4e89)]">
                <MapPin className="h-4 w-4" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wide">{c.saLabel}</p>
              </div>
              <address className="mt-1 not-italic text-[13px] leading-relaxed text-foreground/85">
                {SA_ADDRESS.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </address>
            </div>
            <div className="rounded-2xl bg-white/95 p-4 text-[color:var(--ithemba-blue-deepest,#0b2545)] ring-1 ring-white/10">
              <div className="flex items-center gap-2 text-[color:var(--ithemba-blue,#1d4e89)]">
                <MapPin className="h-4 w-4" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wide">{c.deLabel}</p>
              </div>
              <address className="mt-1 not-italic text-[13px] leading-relaxed text-foreground/85">
                {DE_ADDRESS.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </address>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[color:var(--ithemba-blue-deepest,#0b2545)] transition hover:bg-[color:var(--ithemba-yellow,#f5c64a)] hover:text-[color:var(--ithemba-brown,#6b4423)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
