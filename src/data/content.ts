export type Lang = "en" | "de" | "nl";

/** Translatable string: English required, German required for now,
 *  Dutch optional (falls back to English via LanguageProvider). */
export type TString = { en: string; de: string; nl?: string };

export const t = {
  nav: {
    home: { en: "Home", de: "Start", nl: "Home" },
    about: { en: "About", de: "Über uns", nl: "Over ons" },
    projects: { en: "Projects", de: "Projekte", nl: "Projecten" },
    media: { en: "Media", de: "Medien", nl: "Media" },
    partners: { en: "Partners", de: "Partner", nl: "Partners" },
    donate: { en: "Donate", de: "Spenden", nl: "Doneren" },
    contact: { en: "Contact", de: "Kontakt", nl: "Contact" },
  },
  cta: {
    donateMonthly: { en: "Donate Monthly", de: "Monatlich spenden", nl: "Maandelijks doneren" },
    giveOnce: { en: "Give Once", de: "Einmalig spenden", nl: "Eenmalig doneren" },
    learnMore: { en: "Learn More", de: "Mehr erfahren", nl: "Meer lezen" },
    learnMoreAbout: { en: "Learn More About Us", de: "Mehr über uns erfahren", nl: "Lees meer over ons" },
    supportProject: { en: "Support This Project", de: "Dieses Projekt unterstützen", nl: "Steun dit project" },
    partnerWithUs: { en: "Partner With Us", de: "Partner werden", nl: "Partner worden" },
    submit: { en: "Send Message", de: "Nachricht senden", nl: "Bericht versturen" },
    subscribe: { en: "Subscribe", de: "Abonnieren", nl: "Abonneren" },
  },
  home: {
    heroTitle: {
      en: "Hope for communities. Built from the ground up in Pondoland.",
      de: "Hoffnung für Gemeinschaften. Von Deutschland aus unterstützt. In Südafrika verwurzelt.",
      nl: "Hoop voor gemeenschappen. Gesteund vanuit Duitsland. Geworteld in Zuid-Afrika.",
    },
    heroIntro: {
      en: "We are a women-led, community-rooted nonprofit working with rural families in Pondoland through early childhood education, safe water, food security, skills and livelihoods, animal welfare and emergency support.",
      de: "iThemba Kuluntu e.V. mit Sitz in Kirchhundem unterstützt die Arbeit von iThemba Kuluntu NPC in Cwebeni, Port St Johns, Südafrika. Gemeinsam stärken wir ländliche Familien an der Wild Coast in Pondoland durch frühkindliche Bildung, sicheres Wasser, Ernährungssicherheit, lokale Arbeitsmöglichkeiten, Tierschutz und Nothilfe.",
      nl: "iThemba Kuluntu e.V., gevestigd in Kirchhundem, ondersteunt het werk van iThemba Kuluntu NPC in Cwebeni, Port St Johns, Zuid-Afrika. Samen versterken we landelijke gezinnen aan de Wild Coast in Pondoland door vroegschoolse educatie, veilig water, voedselzekerheid, lokale werkgelegenheid, dierenwelzijn en noodhulp.",
    },
    welcome: { en: "Welcome to", de: "Willkommen bei", nl: "Welkom bij" },
    whoWeAre: { en: "Who we are", de: "Wer wir sind", nl: "Wie wij zijn" },
    whoWeAreText: {
      en: "We are a women-led, community-rooted nonprofit based in Cwebeni, Port St Johns, along the Wild Coast in Pondoland.",
      de: "iThemba Kuluntu e.V. ist ein gemeinnütziger Verein mit Sitz in Kirchhundem. Wir leisten in Deutschland Aufklärungsarbeit, bauen Unterstützung auf und begleiten die direkte Arbeit von iThemba Kuluntu NPC in Südafrika.",
      nl: "iThemba Kuluntu e.V. is een Duitse non-profitvereniging met zetel in Kirchhundem. In Duitsland doen we aan bewustwording, bouwen we steun op en begeleiden we het directe werk van iThemba Kuluntu NPC in Zuid-Afrika.",
    },
    whoWeAreSupport: {
      en: "We work with communities, not above them. Our work is built on local trust, practical delivery and long-term care — from safe water and early learning to food support, animal welfare and emergency response.",
      de: "Die praktische Projektarbeit findet in Cwebeni, Port St Johns, an der Wild Coast in Pondoland statt. Dort arbeitet iThemba Kuluntu NPC eng mit ländlichen Gemeinschaften zusammen — nicht über sie hinweg, sondern mit lokalem Vertrauen, praktischer Umsetzung und langfristiger Verantwortung.",
      nl: "Het praktische projectwerk vindt plaats in Cwebeni, Port St Johns, aan de Wild Coast in Pondoland. Daar werkt iThemba Kuluntu NPC nauw samen met landelijke gemeenschappen — niet van bovenaf, maar op basis van lokaal vertrouwen, praktische uitvoering en langdurige verantwoordelijkheid.",
    },
    focusAreas: { en: "Our focus areas", de: "Unsere Schwerpunkte", nl: "Onze speerpunten" },
    ourProjects: { en: "Our Projects", de: "Unsere Projekte", nl: "Onze Projecten" },
    partnersTitle: {
      en: "Partners who help make this possible",
      de: "Partner, die diese Arbeit möglich machen",
      nl: "Partners die dit werk mogelijk maken",
    },
    monthlyTitle: {
      en: "Become a monthly supporter",
      de: "Werden Sie monatliche Unterstützerin oder monatlicher Unterstützer",
      nl: "Word maandelijkse ondersteuner",
    },
    monthlyText: {
      en: "Monthly giving helps us keep care consistent. It allows us to plan ahead, employ local people, support children and families, and keep practical help moving month after month.",
      de: "Monatliche Spenden machen Unterstützung verlässlich. Sie helfen, die Arbeit in Südafrika vorauszuplanen, lokale Arbeitsplätze zu sichern, Kinder und Familien zu begleiten und praktische Hilfe Monat für Monat fortzuführen.",
      nl: "Maandelijkse donaties maken steun betrouwbaar. Ze helpen om het werk in Zuid-Afrika vooruit te plannen, lokale banen te behouden, kinderen en gezinnen te ondersteunen en praktische hulp maand na maand voort te zetten.",
    },
    newsletterTitle: { en: "Follow the journey", de: "Begleiten Sie unseren Weg", nl: "Volg de reis" },
    newsletterText: {
      en: "Receive updates from Pondoland, project stories, impact reports and practical ways to support monthly.",
      de: "Erhalten Sie Updates aus Pondoland, Projektgeschichten, Wirkungsberichte und praktische Möglichkeiten zur monatlichen Unterstützung.",
      nl: "Ontvang updates uit Pondoland, projectverhalen, impactrapportages en praktische manieren om maandelijks te steunen.",
    },
  },
  belief: {
    title: { en: "What we believe", de: "Woran wir glauben", nl: "Waarin wij geloven" },
    text: {
      en: "Lasting change begins with dignity, local leadership and practical solutions that communities can trust, use and own.",
      de: "Nachhaltige Veränderung beginnt mit Würde, lokaler Verantwortung und praktischen Lösungen, denen Gemeinschaften vertrauen, die sie nutzen und selbst mittragen können.",
      nl: "Duurzame verandering begint met waardigheid, lokaal leiderschap en praktische oplossingen die gemeenschappen vertrouwen, gebruiken en zelf mee kunnen dragen.",
    },
  },
  mission: {
    title: { en: "Our mission", de: "Unsere Aufgabe", nl: "Onze opdracht" },
    text: {
      en: "To strengthen rural families through safe water, education, food security, skills and livelihoods, emergency support and care.",
      de: "Als gemeinnütziger Verein in Deutschland unterstützen wir direkte, gemeindenahe Arbeit in Südafrika — durch Spenden, Partnerschaften, Aufklärung, Netzwerke und langfristige Begleitung.",
      nl: "Als non-profitvereniging in Duitsland ondersteunen we directe, gemeenschapsgerichte hulp in Zuid-Afrika — via donaties, partnerschappen, bewustwording, netwerken en langdurige begeleiding.",
    },
  },
  serve: {
    title: { en: "Who we serve", de: "Wem wir dienen", nl: "Voor wie wij er zijn" },
    text: {
      en: "Children, caregivers, schools, ECD centres, vulnerable households, local women, rural families and animals in underserved communities.",
      de: "Die Arbeit unterstützt Kinder, Familien, Betreuungspersonen, Schulen, ECD-Zentren, besonders belastete Haushalte, Frauen vor Ort sowie Tiere in ländlichen, unterversorgten Gemeinschaften in Südafrika.",
      nl: "Het werk ondersteunt kinderen, gezinnen, verzorgers, scholen, ECD-centra, kwetsbare huishoudens, vrouwen ter plaatse en dieren in landelijke, onderbediende gemeenschappen in Zuid-Afrika.",
    },
  },
} as const;

export const useTr = (lang: Lang) => (key: TString) =>
  lang === "en" ? key.en : lang === "de" ? (key.de ?? key.en) : (key.nl ?? key.en);
