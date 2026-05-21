export type Lang = "en" | "de" | "nl";

/** Translatable string: English required, German required for now,
 *  Dutch optional (falls back to English via LanguageProvider). */
export type TString = { en: string; de: string; nl?: string };

export const t = {
  nav: {
    home: { en: "Home", de: "Start" },
    about: { en: "About", de: "Über uns" },
    projects: { en: "Projects", de: "Projekte" },
    media: { en: "Media", de: "Medien" },
    partners: { en: "Partners", de: "Partner" },
    donate: { en: "Donate", de: "Spenden" },
    contact: { en: "Contact", de: "Kontakt" },
  },
  cta: {
    donateMonthly: { en: "Donate Monthly", de: "Monatlich spenden" },
    giveOnce: { en: "Give Once", de: "Einmalig spenden" },
    learnMore: { en: "Learn More", de: "Mehr erfahren" },
    learnMoreAbout: { en: "Learn More About Us", de: "Mehr über uns" },
    supportProject: { en: "Support This Project", de: "Dieses Projekt unterstützen" },
    partnerWithUs: { en: "Partner With Us", de: "Werden Sie Partner" },
    submit: { en: "Send Message", de: "Nachricht senden" },
    subscribe: { en: "Subscribe", de: "Abonnieren" },
  },
  home: {
    heroTitle: {
      en: "Hope for communities. Built from the ground up in Pondoland.",
      de: "Hoffnung für Gemeinschaften. Von Grund auf aufgebaut in Pondoland.",
    },
    heroIntro: {
      en: "iThemba Kuluntu strengthens rural families through education, safe water, food security, community care, animal welfare and emergency support.",
      de: "iThemba Kuluntu stärkt ländliche Familien durch Bildung, sauberes Wasser, Ernährungssicherheit, Gemeinschaftspflege, Tierwohl und Nothilfe.",
    },
    welcome: { en: "Welcome to", de: "Willkommen bei" },
    whoWeAre: { en: "Who we are", de: "Wer wir sind" },
    whoWeAreText: {
      en: "We are a women-led, community-rooted nonprofit working with rural communities in the Eastern Cape.",
      de: "Wir sind eine von Frauen geführte, in der Gemeinschaft verwurzelte Nonprofit-Organisation, die mit ländlichen Gemeinden im Eastern Cape arbeitet.",
    },
    whoWeAreSupport: {
      en: "Our home is Cwebeni, Port St Johns, along the Wild Coast in Pondoland. We work with communities, not above them, combining local trust, practical delivery and long-term care.",
      de: "Unser Zuhause ist Cwebeni, Port St Johns, an der Wild Coast in Pondoland. Wir arbeiten mit den Gemeinschaften, nicht über ihnen — mit lokalem Vertrauen, praktischer Umsetzung und langfristiger Fürsorge.",
    },
    focusAreas: { en: "Our focus areas", de: "Unsere Schwerpunkte" },
    ourProjects: { en: "Our Projects", de: "Unsere Projekte" },
    partnersTitle: { en: "Partners who help make this possible", de: "Partner, die dies möglich machen" },
    monthlyTitle: { en: "Become a monthly supporter", de: "Werden Sie monatliche*r Unterstützer*in" },
    monthlyText: {
      en: "Monthly giving helps keep food, water, learning, care and emergency support moving where it is needed most.",
      de: "Monatliche Spenden halten Nahrung, Wasser, Lernen, Pflege und Nothilfe dort in Bewegung, wo sie am dringendsten gebraucht werden.",
    },
    newsletterTitle: { en: "Follow the journey", de: "Begleiten Sie unseren Weg" },
    newsletterText: {
      en: "Receive updates from Pondoland, project stories and ways to support monthly.",
      de: "Erhalten Sie Updates aus Pondoland, Projektgeschichten und Möglichkeiten zur monatlichen Unterstützung.",
    },
  },
  belief: {
    title: { en: "What we believe", de: "Woran wir glauben" },
    text: {
      en: "Lasting change begins with dignity, local leadership and practical solutions that communities can own.",
      de: "Nachhaltiger Wandel beginnt mit Würde, lokaler Führung und praktischen Lösungen, die Gemeinschaften selbst tragen können.",
    },
  },
  mission: {
    title: { en: "Our mission", de: "Unsere Mission" },
    text: {
      en: "To strengthen rural families through safe water, education, food security, livelihoods, emergency support and care.",
      de: "Ländliche Familien zu stärken durch sauberes Wasser, Bildung, Ernährungssicherheit, Existenzgrundlagen, Nothilfe und Fürsorge.",
    },
  },
  serve: {
    title: { en: "Who we serve", de: "Für wen wir da sind" },
    text: {
      en: "Rural families, children, caregivers, schools, ECD centres, vulnerable households and animals in underserved communities.",
      de: "Ländliche Familien, Kinder, Betreuende, Schulen, ECD-Zentren, gefährdete Haushalte und Tiere in unterversorgten Gemeinschaften.",
    },
  },
} as const;

export const useTr = (lang: Lang) => (key: TString) =>
  lang === "en" ? key.en : lang === "de" ? (key.de ?? key.en) : (key.nl ?? key.en);
