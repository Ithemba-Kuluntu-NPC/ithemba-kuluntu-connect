import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks/LegalPage";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { useLang } from "@/components/site/LanguageProvider";
import { Shield, Repeat, FileText, Heart, Award } from "lucide-react";

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

function DonatePage() {
  const { lang } = useLang();
  const c = COPY[lang];

  const scrollToForm = () => {
    if (typeof document === "undefined") return;
    document.getElementById("donate-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PageHeader
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        accent="var(--ithemba-blue)"
      />

      <section
        id="donate-form"
        className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_1fr] lg:px-8"
      >
        <DonationWidget />
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-[var(--ithemba-blue-dark)]">
            {c.support.heading}
          </h2>
          <ul className="grid gap-2 text-sm">
            {c.support.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-2xl bg-white p-3 ring-1 ring-[var(--ithemba-blue)]/10"
              >
                <Heart className="mt-0.5 h-4 w-4 shrink-0 fill-[var(--ithemba-yellow)] text-[var(--ithemba-yellow)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-muted-foreground">
            {c.trust.map((label, i) => {
              const Icon = TRUST_ICONS[i] ?? Heart;
              return (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-[var(--ithemba-blue)]" /> {label}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Thank You closing section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/assets/photos/home/home-hero-community.jpg)" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-dark)]/95 via-[var(--ithemba-blue-dark)]/90 to-[var(--ithemba-blue)]/85"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
          <p className="font-script text-3xl text-[var(--ithemba-yellow)] md:text-4xl">
            {c.thankyou.script}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            {c.thankyou.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg">
            {c.thankyou.text}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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

export const Route = createFileRoute("/donate")({ component: DonatePage });
