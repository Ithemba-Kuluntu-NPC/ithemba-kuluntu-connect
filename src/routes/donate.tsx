import { createFileRoute } from "@tanstack/react-router";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { useLang } from "@/components/site/LanguageProvider";
import { Shield, Repeat, FileText, Heart, Award, Check } from "lucide-react";

/* ---------- content (verbatim from /public/content/donate) ---------- */
const COPY = {
  en: {
    hero: {
      eyebrow: "Give monthly",
      title: "Help build stronger rural communities",
      subtitle:
        "Your monthly donation helps sustain safe water, early learning, food security, animal welfare and emergency support.",
    },
    support: {
      heading: "What monthly giving supports",
      items: [
        "Free holistic ECD care for 120 rural children",
        "Safe water access, WASH education and household follow-up",
        "Daily nutrition, learning and protection for young children",
        "Food support for vulnerable families facing hunger or crisis",
        "Rural animal welfare through Pondo Dogs outreach and care",
        "Rapid emergency relief when disasters or hardship hit",
      ],
    },
    trust: [
      "Registered nonprofit",
      "PBO & NPO registered",
      "Transparent reporting",
      "Community-rooted",
    ],
    thankyou: {
      script: "Thank you",
      title: "Your support helps keep practical care moving",
      text: "Every monthly gift helps sustain community-rooted work that reaches children, families, households and animals where support is needed most. Thank you for helping iThemba Kuluntu continue this work with consistency, care and trust.",
      ctaMonthly: "Donate Monthly",
      ctaOnce: "Give Once",
    },
  },
  de: {
    hero: {
      eyebrow: "Monatlich geben",
      title: "Starke ländliche Gemeinschaften mit aufbauen",
      subtitle:
        "Deine monatliche Spende hilft, sicheres Wasser, frühe Förderung, Ernährungssicherheit, Tierschutz und Nothilfe verlässlich weiterzutragen.",
    },
    support: {
      heading: "Was monatliche Spenden ermöglichen",
      items: [
        "Kostenfreie ganzheitliche ECD-Betreuung für 120 Kinder im ländlichen Raum",
        "Sicheres Wasser, WASH-Bildung und Nachbetreuung in Haushalten",
        "Tägliche Mahlzeiten, Lernen und Schutz für kleine Kinder",
        "Ernährungshilfe für Familien, die von Hunger oder Krisen betroffen sind",
        "Tierschutz auf dem Land durch aufsuchende Arbeit und Versorgung von Pondo Dogs",
        "Schnelle Nothilfe bei Katastrophen, Bränden und akuter Not",
      ],
    },
    trust: [
      "Eingetragene gemeinnützige Organisation",
      "PBO- und NPO-registriert",
      "Transparente Berichterstattung",
      "In der Gemeinschaft verwurzelt",
    ],
    thankyou: {
      script: "Danke",
      title: "Deine Unterstützung hält praktische Hilfe in Bewegung",
      text: "Jede monatliche Spende hilft, gemeinschaftsverwurzelte Arbeit verlässlich weiterzutragen und Kinder, Familien, Haushalte und Tiere dort zu erreichen, wo Unterstützung am dringendsten gebraucht wird. Danke, dass du iThemba Kuluntu dabei hilfst, diese Arbeit mit Beständigkeit, Fürsorge und Vertrauen fortzuführen.",
      ctaMonthly: "Monatlich spenden",
      ctaOnce: "Einmalig spenden",
    },
  },
  nl: {
    hero: {
      eyebrow: "Maandelijks geven",
      title: "Help sterke plattelandsgemeenschappen opbouwen",
      subtitle:
        "Met je maandelijkse donatie help je veilig water, vroege ontwikkeling, voedselzekerheid, dierenwelzijn en noodhulp duurzaam mogelijk te maken.",
    },
    support: {
      heading: "Wat maandelijks geven mogelijk maakt",
      items: [
        "Gratis, brede ECD-zorg voor 120 kinderen op het platteland",
        "Veilig water, WASH-educatie en opvolging bij huishoudens",
        "Dagelijkse voeding, leren en bescherming voor jonge kinderen",
        "Voedselhulp voor kwetsbare gezinnen die honger of crisis ervaren",
        "Dierenwelzijn op het platteland via outreach en zorg van Pondo Dogs",
        "Snelle noodhulp bij rampen, branden en acute tegenslag",
      ],
    },
    trust: [
      "Geregistreerde non-profitorganisatie",
      "Geregistreerd als PBO en NPO",
      "Transparante verslaggeving",
      "Geworteld in de gemeenschap",
    ],
    thankyou: {
      script: "Dank je wel",
      title: "Jouw steun houdt praktische zorg in beweging",
      text: "Elke maandelijkse donatie helpt om gemeenschapsgericht werk betrouwbaar voort te zetten en kinderen, gezinnen, huishoudens en dieren te bereiken waar steun het hardst nodig is. Dank je wel dat je iThemba Kuluntu helpt om dit werk met continuïteit, zorg en vertrouwen voort te zetten.",
      ctaMonthly: "Maandelijks doneren",
      ctaOnce: "Eenmalig doneren",
    },
  },
} as const;

const TRUST_ICONS = [Shield, Award, FileText, Heart];
const HERO_PHOTO = "/assets/photos/home/home-hero-community.jpg";

function DonatePage() {
  const { lang } = useLang();
  const c = COPY[lang];

  const scrollToForm = () => {
    if (typeof document === "undefined") return;
    document.getElementById("donate-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Unified donation section: photo + blue overlay, form + copy side by side */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_PHOTO})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-dark)]/90 via-[var(--ithemba-blue-dark)]/80 to-[var(--ithemba-blue)]/70"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-14">
          {/* LEFT on desktop: copy. On mobile: renders first. */}
          <div className="order-1 text-white lg:order-1">
            <p className="hand-eyebrow-lg text-[var(--ithemba-yellow)]">{c.hero.eyebrow}</p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              {c.hero.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
              {c.hero.subtitle}
            </p>

            <div className="mt-6 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
              <h2 className="font-display text-lg font-semibold text-white md:text-xl">
                {c.support.heading}
              </h2>
              <ul className="mt-3 grid gap-2 text-sm text-white/95">
                {c.support.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ithemba-yellow)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-white/85 md:grid-cols-4">
              {c.trust.map((label, i) => {
                const Icon = TRUST_ICONS[i] ?? Heart;
                return (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4 text-[var(--ithemba-yellow)]" /> {label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT on desktop: form. On mobile: renders after copy but before support list would... we keep order simple. */}
          <div id="donate-form" className="order-2 lg:order-2">
            <DonationWidget />
          </div>
        </div>
      </section>

      {/* Thank You closing section — compact */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_PHOTO})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-dark)]/95 via-[var(--ithemba-blue-dark)]/90 to-[var(--ithemba-blue)]/85"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-12 text-center lg:px-8 lg:py-14">
          <p className="hand-eyebrow-lg text-[var(--ithemba-yellow)]">{c.thankyou.script}</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
            {c.thankyou.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base">
            {c.thankyou.text}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ithemba-yellow)] px-6 py-3 text-sm font-bold text-[var(--ithemba-brown)] shadow-lg transition hover:bg-[var(--ithemba-yellow)]/90"
            >
              <Heart className="h-4 w-4 fill-current" /> {c.thankyou.ctaMonthly}
            </button>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Repeat className="h-4 w-4" /> {c.thankyou.ctaOnce}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export const Route = createFileRoute("/donate")({
  component: DonatePage,
  head: () => ({
    meta: [
      { title: "Donate — iThemba Kuluntu" },
      {
        name: "description",
        content:
          "Give monthly to sustain safe water, early learning, food security, animal welfare and emergency support in rural Pondoland.",
      },
      { property: "og:title", content: "Donate — iThemba Kuluntu" },
      {
        property: "og:description",
        content:
          "Your monthly donation helps sustain community-rooted work across Pondoland.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
