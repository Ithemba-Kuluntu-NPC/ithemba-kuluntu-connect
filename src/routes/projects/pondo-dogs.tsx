import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Heart,
  PawPrint,
  PlayCircle,
  Sparkles,
  Stethoscope,
  Syringe,
  ShieldCheck,
  HandHeart,
  Home as HomeIcon,
  Utensils,
  BookOpen,
  Truck,
  AlertCircle,
  Repeat,
  Users,
  Cat,
  Dog,
  Bird,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { SmartImage, SmartLogo } from "@/components/site/Asset";
import { FocusAreaBadges } from "@/components/blocks/FocusAreaBadges";
import { focusAreaBadgeMeta } from "@/data/projects";
import { assets } from "@/data/assets";
import type { Lang } from "@/data/content";

export const Route = createFileRoute("/projects/pondo-dogs")({
  component: PondoDogsPage,
});

/* ---------- assets ---------- */
const HERO_VIDEO = "/assets/videos/projects/pondo-dogs-hero.mp4";
const HERO_POSTER = "/assets/photos/projects/pondo-dogs-hero-poster.jpg";
const FALLBACK_POSTER = assets.photos.projects.pondoDogsHero;
const PHOTO_HERO = assets.photos.pondoDogs.hero;
const PHOTO_CARE = assets.photos.pondoDogs.care;
const PHOTO_COMMUNITY = assets.photos.pondoDogs.community;

const KUSTENHUND_URL = "https://www.kuestenhund.com/";

/* ---------- custom Pondo Dogs icons ---------- */
const PD_ICON = "/assets/icons/projects/pondo-dogs";
const ICON = {
  project: `${PD_ICON}/pondo-dogs-project.png`,
  communityWellbeing: `${PD_ICON}/pondo-dogs-community-wellbeing.png`,
  location: `${PD_ICON}/pondo-dogs-location.png`,
  animalsSupported: `${PD_ICON}/pondo-dogs-animals-supported.png`,
  communityTeams: `${PD_ICON}/pondo-dogs-community-teams.png`,
  coreSupport: `${PD_ICON}/pondo-dogs-core-support.png`,
  monthlySupport: `${PD_ICON}/pondo-dogs-monthly-support.png`,
  medicalCare: `${PD_ICON}/pondo-dogs-medical-care.png`,
  preventiveCare: `${PD_ICON}/pondo-dogs-preventive-care.png`,
  sterilisation: `${PD_ICON}/pondo-dogs-sterilisation.png`,
  homeBased: `${PD_ICON}/pondo-dogs-home-based-support.png`,
  foodAndShelter: `${PD_ICON}/pondo-dogs-food-and-shelter.png`,
  ownerEducation: `${PD_ICON}/pondo-dogs-owner-education.png`,
  emergencyCare: `${PD_ICON}/pondo-dogs-emergency-care.png`,
  deworming: `${PD_ICON}/pondo-dogs-deworming-parasite-control.png`,
  foodSupport: `${PD_ICON}/pondo-dogs-food-support.png`,
  shelterSupport: `${PD_ICON}/pondo-dogs-shelter-support.png`,
  transportVet: `${PD_ICON}/pondo-dogs-transport-vet-care.png`,
  localCoordination: `${PD_ICON}/pondo-dogs-local-coordination.png`,
} as const;

/** Small helper: render a custom Pondo Dogs icon cleanly without bubble container. */
function PdIcon({
  src,
  alt = "",
  className = "h-14 w-14",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      className={`${className} object-contain`}
      loading="lazy"
    />
  );
}

/* ---------- reduced motion ---------- */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/* ---------- types ---------- */
type Fact = { label: string; value: string };
type Bullet = { text: string };
type Counter = { value: string; label: string };

type Copy = {
  back: string;
  hero: {
    eyebrow: string;
    title: string;
    text: string;
    monthly: string;
    once: string;
    location: string;
    placeholder: string;
  };
  snapshot: {
    eyebrow: string;
    title: string;
    body: string[];
    facts: Fact[];
    partnerLine: { pre: string; post: string }; // "... with Küstenhund e.V. for monthly sterilisation campaigns"
  };
  who: { eyebrow: string; title: string; body: string[] };
  believe: { eyebrow: string; title: string; body: string[] };
  why: { eyebrow: string; title: string; body: string[] };
  what: {
    eyebrow: string;
    title: string;
    intro: string;
    areas: string[];
    outro: string;
  };
  medical: {
    eyebrow: string;
    title: string;
    body: string[];
    items: Bullet[];
  };
  preventive: {
    eyebrow: string;
    title: string;
    body: string[];
    items: Bullet[];
  };
  sterilisation: {
    eyebrow: string;
    title: string;
    bodyPre: string; // "Together with"
    bodyPost: string; // ", our local team runs monthly sterilisation campaigns..."
    body2: string;
    body3: string;
  };
  home: {
    eyebrow: string;
    title: string;
    body: string[];
    items: Bullet[];
    outro: string;
  };
  food: { eyebrow: string; title: string; body: string[] };
  education: {
    eyebrow: string;
    title: string;
    body: string[];
    topics: string[];
  };
  more: { eyebrow: string; title: string; body: string[] };
  focus: {
    eyebrow: string;
    title: string;
    body: string[];
    areas: { key: "animal-welfare" | "education" | "skills-livelihoods" | "community-health"; label: string }[];
  };
  donation: {
    eyebrow: string;
    title: string;
    body: string[];
    items: string[];
    outro: string;
  };
  monthly: {
    eyebrow: string;
    title: string;
    body: string[];
    cardHeading: string;
    cardAmount: string;
    cardText: string;
    cta1: string;
    cta2: string;
    trust: string[];
  };
  impact: { eyebrow: string; title: string; counters: Counter[] };
  closing: {
    eyebrow: string;
    title: string;
    body: string[];
    monthly: string;
    once: string;
    all: string;
  };
};

/* ---------- content ---------- */
const COPY: Record<Lang, Copy> = {
  en: {
    back: "All projects",
    hero: {
      eyebrow: "Animal Welfare",
      title: "Pondo Dogs",
      text:
        "Pondo Dogs is the animal welfare programme of iThemba Kuluntu. We work with animals, owners and local community teams in Pondoland, South Africa, supporting vulnerable dogs, cats and other animals through practical care, prevention, medical support, food, shelter and owner education.",
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      location: "Pondoland · Eastern Cape · South Africa",
      placeholder: "Hero video placeholder · ready for real Pondo Dogs video",
    },
    snapshot: {
      eyebrow: "At a glance",
      title: "Animal welfare by iThemba Kuluntu",
      body: [
        "Pondo Dogs is the animal welfare programme of iThemba Kuluntu. It exists because animals and families live closely together in rural communities, and animal welfare is deeply connected to safety, health, dignity and daily life.",
        "We support animals and their owners where they live, through medical and emergency care, preventive care, sterilisation campaigns, food and shelter support, home-based guidance and practical owner education.",
      ],
      facts: [
        { label: "Project", value: "Pondo Dogs" },
        { label: "Focus", value: "Animal welfare and community wellbeing" },
        { label: "Where", value: "Pondoland, Eastern Cape, South Africa" },
        { label: "Who it helps", value: "Vulnerable dogs and cats, and where possible other domestic or working animals" },
        { label: "How we work", value: "With animals, owners and local community teams" },
        { label: "Core support", value: "Medical care, emergency response, prevention, sterilisation, food, shelter and education" },
        { label: "Donation focus", value: "Monthly support for animal welfare care" },
      ],
      partnerLine: { pre: "Partner: ", post: " for monthly sterilisation campaigns" },
    },
    who: {
      eyebrow: "Who",
      title: "we are",
      body: [
        "Pondo Dogs is the animal welfare programme of iThemba Kuluntu.",
        "We work with animals, owners and local community teams in Pondoland, South Africa. Our work is practical and community-based. We do not only respond when animals are already suffering. We support animals and families where they live, with care that is respectful, realistic and sustainable.",
        "Pondo Dogs is built on the understanding that many families care about their animals deeply, but do not always have access to veterinary support, transport, food, sterilisation, medication or reliable information. Our role is to help bridge that gap.",
      ],
    },
    believe: {
      eyebrow: "What we",
      title: "believe",
      body: [
        "Animal welfare is not only about rescue. It is about supporting animals and their owners where they live, with care that is practical, respectful and sustainable.",
        "We believe that healthier animals help create safer homes and kinder communities. We believe that families should not be judged for what poverty makes difficult. We believe that animal welfare works best when it is rooted in trust, education, prevention and local relationships.",
        "Pondo Dogs exists to reduce suffering, strengthen responsible care and help animals and people live together more safely.",
      ],
    },
    why: {
      eyebrow: "Why this",
      title: "matters",
      body: [
        "When animals are healthier, suffering is reduced. Families feel supported, communities become safer, and long-term animal welfare becomes possible.",
        "In rural communities, animals live close to children, families, homes and shared public spaces. When animals are sick, injured, hungry, fearful or breeding without support, the whole community feels the impact.",
        "A sick or injured animal suffers. A hungry animal becomes weaker. Repeated litters create pressure on families who may already be struggling. Untreated wounds, infections, parasites and preventable illnesses can quickly become serious.",
        "Pondo Dogs responds with practical care before suffering becomes deeper, and with emergency help when urgent support is needed.",
      ],
    },
    what: {
      eyebrow: "What we do",
      title: "Practical animal welfare support",
      intro: "Pondo Dogs works across several connected areas of animal welfare.",
      areas: [
        "Medical and emergency care",
        "Preventive care",
        "Monthly sterilisation campaigns",
        "Home-based support",
        "Food and shelter support",
        "Owner education",
      ],
      outro:
        "Each area matters on its own. Together, they create a more complete animal welfare response: treating animals when they are sick, preventing future suffering, helping owners understand animal needs and making care possible in places where formal veterinary access is limited.",
    },
    medical: {
      eyebrow: "Medical care",
      title: "Help when animals are sick or injured",
      body: [
        "We support sick and injured animals, including animals with chronic illnesses, cancer, wounds, infections and emergency medical needs.",
        "Medical care is often urgent, practical and deeply personal. For many families, an animal may be loved but veterinary care may be too far away, too expensive or too difficult to organise. Pondo Dogs helps where possible so that animals do not suffer without support.",
      ],
      items: [
        { text: "Veterinary treatment" },
        { text: "Wound care" },
        { text: "Emergency transport support" },
        { text: "Medication support" },
        { text: "Care for chronic illness" },
        { text: "Support for serious medical cases" },
        { text: "Follow-up where possible" },
      ],
    },
    preventive: {
      eyebrow: "Preventive care",
      title: "Protecting animals before they become seriously ill",
      body: [
        "We help protect animals before they become seriously ill through parasite control, deworming and 5-in-1 vaccinations against diseases like parvo and distemper.",
        "Preventive care matters because many animal illnesses can become severe quickly, especially where families do not have easy access to veterinary care. Prevention is often kinder, more affordable and more effective than waiting until an animal is already in crisis.",
      ],
      items: [
        { text: "Parasite control" },
        { text: "Deworming" },
        { text: "5-in-1 vaccinations" },
        { text: "Basic health checks" },
        { text: "Early identification of illness" },
        { text: "Owner guidance on warning signs" },
      ],
    },
    sterilisation: {
      eyebrow: "Prevention",
      title: "Monthly sterilisation campaigns",
      bodyPre: "Together with ",
      bodyPost:
        ", our local team runs monthly sterilisation campaigns to reduce unwanted litters and improve long-term animal wellbeing.",
      body2:
        "Sterilisation is one of the most important parts of sustainable animal welfare. It helps reduce repeated litters, lowers pressure on families, prevents future suffering and supports healthier animal populations over time.",
      body3:
        "Sterilisation is not a quick one-time solution. It needs consistency, planning, transport, community trust, veterinary support and follow-up. Monthly giving helps make that consistency possible.",
    },
    home: {
      eyebrow: "Home-based",
      title: "Support where animals live",
      body: [
        "We work with animals and their owners in their homes, helping families understand what their animals need and how to care for them better.",
        "Home-based support is important because animal welfare does not happen only at a clinic. It happens in yards, homes, pathways and villages, where animals live every day.",
      ],
      items: [
        { text: "Checking animals at home" },
        { text: "Talking with owners" },
        { text: "Identifying urgent needs" },
        { text: "Explaining basic care" },
        { text: "Supporting practical changes" },
        { text: "Following up where possible" },
      ],
      outro:
        "This approach is respectful and realistic. It recognises that care must work in the actual conditions families live in.",
    },
    food: {
      eyebrow: "Food and shelter",
      title: "Practical care for vulnerable animals",
      body: [
        "Where needed, we support animals with food, basic sleeping spots and practical care so they can be safer, healthier and more comfortable.",
        "Food and shelter support can make an immediate difference. A hungry animal becomes weaker and more vulnerable to illness. An animal without a safe resting place is more exposed to cold, rain, injury and stress.",
        "Pondo Dogs provides practical help where it is needed most, especially for vulnerable animals and families facing hardship.",
      ],
    },
    education: {
      eyebrow: "Owner education",
      title: "Helping families care with confidence",
      body: [
        "We share simple, practical guidance on animal wellbeing, feeding, illness signs, hygiene, kindness and responsible care.",
        "Owner education is not about blame. Many families have never had access to veterinary advice or animal welfare information. Practical guidance helps people understand what animals need and when help is urgent.",
      ],
      topics: [
        "Animal wellbeing",
        "Feeding and clean water",
        "Illness signs",
        "Parasite control",
        "Hygiene",
        "Kind handling",
        "Safe behaviour around animals",
        "Why sterilisation matters",
        "Responsible care",
      ],
    },
    more: {
      eyebrow: "Beyond dogs",
      title: "Care where it is needed",
      body: [
        "The project is called Pondo Dogs because dogs are at the heart of the work. But in rural community life, animal welfare does not stop with dogs.",
        "Dogs and cats are supported as core companion animals in the programme. Where possible, Pondo Dogs also helps other domestic or working animals in emergencies. This may include donkeys, goats, sheep and cows when urgent support is needed and when help is possible.",
        "This reflects the reality of community life. Animals are part of households, livelihoods, safety and daily care.",
      ],
    },
    focus: {
      eyebrow: "Connected care",
      title: "Animal welfare supports community wellbeing",
      body: [
        "Pondo Dogs connects to several iThemba Kuluntu focus areas.",
        "The project supports animal welfare through direct care. It supports education through owner education and humane learning. It supports skills and livelihoods through local team coordination, practical response and community-based work. It supports community health by helping reduce preventable suffering, fear and risk in shared spaces.",
        "Pondo Dogs is not separate from community development. It is part of building safer, kinder and healthier communities.",
      ],
      areas: [
        { key: "animal-welfare", label: "Animal welfare" },
        { key: "education", label: "Education" },
        { key: "skills-livelihoods", label: "Skills & livelihoods" },
        { key: "community-health", label: "Community health" },
      ],
    },
    donation: {
      eyebrow: "Your support",
      title: "What donations make possible",
      body: [
        "Donations help keep Pondo Dogs moving. Animal welfare work needs fuel, transport, food, medication, veterinary care, sterilisation, follow-up and local coordination.",
      ],
      items: [
        "Sterilisation",
        "Emergency medical care",
        "Treatment for sick or injured animals",
        "Vaccinations and preventive care",
        "Deworming and parasite control",
        "Food support",
        "Basic shelter support",
        "Transport to veterinary care",
        "Owner education",
        "Follow-up visits",
        "Local animal welfare coordination",
      ],
      outro:
        "Every donation helps reduce suffering and makes practical animal welfare possible where formal services are limited.",
    },
    monthly: {
      eyebrow: "Give monthly",
      title: "Help keep animal welfare care moving",
      body: [
        "Animal welfare needs consistency. Sterilisation, food, medical care and emergency response cannot depend only on once-off support when a crisis appears.",
        "Monthly giving helps Pondo Dogs plan ahead. It helps cover food, transport, veterinary support, sterilisation, medication, emergency response and owner education.",
      ],
      cardHeading: "Support animal welfare",
      cardAmount: "€20 / month",
      cardText:
        "Helps fund sterilisation, food, medical care, preventive care and emergency support for vulnerable animals.",
      cta1: "Support animal welfare monthly",
      cta2: "Give once to Pondo Dogs",
      trust: [
        "Secure donation",
        "Monthly giving",
        "Practical animal welfare",
        "Community-rooted care",
        "Transparent reporting",
      ],
    },
    impact: {
      eyebrow: "Impact",
      title: "What your support helps make possible",
      counters: [
        { value: "200+", label: "Sterilisations" },
        { value: "1,500+", label: "Animals treated" },
        { value: "500+", label: "Owners and families reached" },
      ],
    },
    closing: {
      eyebrow: "Kinder communities",
      title: "Help animals and families live safer, healthier lives",
      body: [
        "Pondo Dogs exists because animal welfare is part of community wellbeing. Every sterilisation, treatment, meal, emergency response and education moment helps reduce suffering and build kinder relationships between animals and people.",
        "Your support helps vulnerable animals receive care, and helps families and communities create safer, healthier daily life.",
      ],
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      all: "Explore All Projects",
    },
  },

  de: {
    back: "Alle Projekte",
    hero: {
      eyebrow: "Tierschutz",
      title: "Pondo Dogs",
      text:
        "Pondo Dogs ist das Tierschutzprogramm von iThemba Kuluntu. Gemeinsam mit Tieren, Tierhalterinnen und Tierhaltern sowie lokalen Community-Teams in Pondoland, Südafrika, unterstützen wir gefährdete Hunde, Katzen und andere Tiere durch praktische Hilfe, Prävention, medizinische Versorgung, Futter, Schutz und Aufklärung.",
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      location: "Pondoland · Eastern Cape · Südafrika",
      placeholder: "Hero-Video-Platzhalter · bereit für echtes Pondo-Dogs-Video",
    },
    snapshot: {
      eyebrow: "Auf einen Blick",
      title: "Tierschutz durch iThemba Kuluntu",
      body: [
        "Pondo Dogs ist das Tierschutzprogramm von iThemba Kuluntu. Das Projekt ist entstanden, weil Tiere und Familien in ländlichen Gemeinden eng miteinander leben und Tierwohl unmittelbar mit Sicherheit, Gesundheit, Würde und Alltag verbunden ist.",
        "Wir unterstützen Tiere und ihre Halterinnen und Halter dort, wo sie leben, durch medizinische Versorgung und Notfallhilfe, Prävention, Sterilisationskampagnen, Futter- und Schutzunterstützung, Hausbesuche und praktische Aufklärung.",
      ],
      facts: [
        { label: "Projekt", value: "Pondo Dogs" },
        { label: "Fokus", value: "Tierschutz und Gemeinwohl" },
        { label: "Wo", value: "Pondoland, Eastern Cape, Südafrika" },
        { label: "Wem es hilft", value: "Gefährdete Hunde und Katzen sowie, wo möglich, andere Haus- und Nutztiere in Not" },
        { label: "Wie wir arbeiten", value: "Mit Tieren, Tierhalterinnen und Tierhaltern sowie lokalen Community-Teams" },
        { label: "Kernunterstützung", value: "Medizinische Versorgung, Notfallhilfe, Prävention, Sterilisation, Futter, Schutz und Aufklärung" },
        { label: "Spendenfokus", value: "Monatliche Unterstützung für Tierschutzarbeit" },
      ],
      partnerLine: { pre: "Partner: ", post: " für monatliche Sterilisationskampagnen" },
    },
    who: {
      eyebrow: "Wer",
      title: "wir sind",
      body: [
        "Pondo Dogs ist das Tierschutzprogramm von iThemba Kuluntu.",
        "Wir arbeiten mit Tieren, Tierhalterinnen und Tierhaltern sowie lokalen Community-Teams in Pondoland, Südafrika. Unsere Arbeit ist praktisch und gemeindenah. Wir reagieren nicht erst dann, wenn Tiere bereits sichtbar leiden. Wir unterstützen Tiere und Familien dort, wo sie leben, mit Hilfe, die respektvoll, realistisch und langfristig tragfähig ist.",
        "Pondo Dogs basiert auf dem Verständnis, dass viele Familien ihre Tiere sehr lieben, aber nicht immer Zugang zu tierärztlicher Versorgung, Transport, Futter, Sterilisation, Medikamenten oder verlässlicher Information haben. Unsere Aufgabe ist es, diese Lücke zu überbrücken.",
      ],
    },
    believe: {
      eyebrow: "Woran",
      title: "wir glauben",
      body: [
        "Tierschutz bedeutet nicht nur Rettung. Tierschutz bedeutet, Tiere und ihre Halterinnen und Halter dort zu unterstützen, wo sie leben, mit Hilfe, die praktisch, respektvoll und nachhaltig ist.",
        "Wir glauben, dass gesündere Tiere zu sichereren Haushalten und mitfühlenderen Gemeinschaften beitragen. Wir glauben, dass Familien nicht dafür verurteilt werden sollten, was Armut erschwert. Und wir glauben, dass Tierschutz am besten funktioniert, wenn er auf Vertrauen, Aufklärung, Prävention und lokalen Beziehungen aufbaut.",
        "Pondo Dogs gibt es, um Leid zu verringern, verantwortungsvolle Tierhaltung zu stärken und das Zusammenleben von Menschen und Tieren sicherer zu machen.",
      ],
    },
    why: {
      eyebrow: "Warum",
      title: "das wichtig ist",
      body: [
        "Wenn Tiere gesünder sind, wird Leid verringert. Familien fühlen sich unterstützt, Gemeinschaften werden sicherer und langfristiger Tierschutz wird möglich.",
        "In ländlichen Gemeinden leben Tiere eng mit Kindern, Familien, Haushalten und gemeinsam genutzten Räumen zusammen. Wenn Tiere krank, verletzt, hungrig, verängstigt oder ohne Unterstützung fortpflanzungsfähig sind, betrifft das die ganze Gemeinschaft.",
        "Ein krankes oder verletztes Tier leidet. Ein hungriges Tier wird schwächer. Wiederholte Würfe belasten Familien, die oft selbst schon mit großen Herausforderungen leben. Unbehandelte Wunden, Infektionen, Parasiten und vermeidbare Krankheiten können schnell ernst werden.",
        "Pondo Dogs hilft mit praktischer Unterstützung, bevor Leid größer wird, und mit Notfallhilfe, wenn schnelle Versorgung gebraucht wird.",
      ],
    },
    what: {
      eyebrow: "Was wir tun",
      title: "Praktische Tierschutzarbeit",
      intro: "Pondo Dogs arbeitet in mehreren miteinander verbundenen Bereichen des Tierschutzes.",
      areas: [
        "Medizinische Versorgung und Notfallhilfe",
        "Prävention",
        "Monatliche Sterilisationskampagnen",
        "Hausbesuche und Unterstützung vor Ort",
        "Futter- und Schutzunterstützung",
        "Aufklärung für Tierhalterinnen und Tierhalter",
      ],
      outro:
        "Jeder dieser Bereiche ist wichtig. Zusammen schaffen sie eine umfassendere Tierschutzarbeit: Tiere werden behandelt, wenn sie krank sind, zukünftiges Leid wird verhindert, Halterinnen und Halter verstehen besser, was ihre Tiere brauchen, und Versorgung wird auch dort möglich, wo formale tierärztliche Angebote nur schwer erreichbar sind.",
    },
    medical: {
      eyebrow: "Medizinische Hilfe",
      title: "Hilfe für kranke und verletzte Tiere",
      body: [
        "Wir unterstützen kranke und verletzte Tiere, darunter Tiere mit chronischen Erkrankungen, Krebs, Wunden, Infektionen und dringenden medizinischen Notfällen.",
        "Medizinische Hilfe ist oft akut, praktisch und sehr persönlich. Für viele Familien ist ein Tier geliebt, aber tierärztliche Versorgung ist zu weit entfernt, zu teuer oder organisatorisch kaum zu bewältigen. Pondo Dogs hilft, wo es möglich ist, damit Tiere nicht ohne Unterstützung leiden müssen.",
      ],
      items: [
        { text: "Tierärztliche Behandlung" },
        { text: "Wundversorgung" },
        { text: "Unterstützung bei Notfalltransporten" },
        { text: "Unterstützung mit Medikamenten" },
        { text: "Versorgung bei chronischen Erkrankungen" },
        { text: "Hilfe bei schweren medizinischen Fällen" },
        { text: "Nachbetreuung, wo möglich" },
      ],
    },
    preventive: {
      eyebrow: "Prävention",
      title: "Tiere schützen, bevor sie schwer erkranken",
      body: [
        "Wir helfen dabei, Tiere vor schweren Erkrankungen zu schützen, unter anderem durch Parasitenkontrolle, Entwurmung und 5-in-1-Impfungen gegen Krankheiten wie Parvo und Staupe.",
        "Prävention ist wichtig, weil viele Tierkrankheiten schnell schwer verlaufen können, besonders dort, wo Familien keinen einfachen Zugang zu tierärztlicher Versorgung haben. Vorbeugende Hilfe ist oft schonender, günstiger und wirksamer, als erst zu reagieren, wenn ein Tier bereits in einer Krise ist.",
      ],
      items: [
        { text: "Parasitenkontrolle" },
        { text: "Entwurmung" },
        { text: "5-in-1-Impfungen" },
        { text: "Einfache Gesundheitschecks" },
        { text: "Frühes Erkennen von Krankheitssymptomen" },
        { text: "Praktische Hinweise für Halterinnen und Halter zu Warnzeichen" },
      ],
    },
    sterilisation: {
      eyebrow: "Vorbeugen",
      title: "Monatliche Sterilisationskampagnen",
      bodyPre: "Gemeinsam mit ",
      bodyPost:
        " führt unser lokales Team monatliche Sterilisationskampagnen durch, um ungewollte Würfe zu reduzieren und langfristiges Tierwohl zu stärken.",
      body2:
        "Sterilisation ist einer der wichtigsten Bausteine nachhaltiger Tierschutzarbeit. Sie hilft, wiederholte Würfe zu vermeiden, Familien zu entlasten, zukünftiges Leid zu verringern und Tierpopulationen langfristig gesünder zu halten.",
      body3:
        "Sterilisation ist keine schnelle Einmallösung. Sie braucht Verlässlichkeit, Planung, Transport, Vertrauen in der Gemeinschaft, tierärztliche Unterstützung und Nachbetreuung. Monatliche Spenden helfen, genau diese Kontinuität möglich zu machen.",
    },
    home: {
      eyebrow: "Vor Ort",
      title: "Hilfe dort, wo Tiere leben",
      body: [
        "Wir arbeiten mit Tieren und ihren Halterinnen und Haltern in ihrem Zuhause und helfen Familien zu verstehen, was ihre Tiere brauchen und wie sie besser versorgt werden können.",
        "Hausbesuche und Unterstützung vor Ort sind wichtig, weil Tierschutz nicht nur in einer Praxis stattfindet. Er findet in Höfen, Häusern, Wegen und Dörfern statt, dort, wo Tiere jeden Tag leben.",
      ],
      items: [
        { text: "Tiere vor Ort anschauen" },
        { text: "Mit Halterinnen und Haltern sprechen" },
        { text: "Dringenden Bedarf erkennen" },
        { text: "Grundlagen der Versorgung erklären" },
        { text: "Praktische Veränderungen unterstützen" },
        { text: "Nachbetreuung, wo möglich" },
      ],
      outro:
        "Dieser Ansatz ist respektvoll und realistisch. Er erkennt an, dass Hilfe unter den tatsächlichen Lebensbedingungen der Familien funktionieren muss.",
    },
    food: {
      eyebrow: "Futter und Schutz",
      title: "Praktische Hilfe für gefährdete Tiere",
      body: [
        "Wo es nötig ist, unterstützen wir Tiere mit Futter, einfachen Schlafplätzen und praktischer Hilfe, damit sie sicherer, gesünder und geschützter leben können.",
        "Futter- und Schutzunterstützung kann unmittelbar etwas verändern. Ein hungriges Tier wird schwächer und anfälliger für Krankheit. Ein Tier ohne sicheren Ruheplatz ist Kälte, Regen, Verletzungen und Stress stärker ausgesetzt.",
        "Pondo Dogs leistet praktische Hilfe dort, wo sie am dringendsten gebraucht wird, besonders für gefährdete Tiere und Familien in schwierigen Lebenssituationen.",
      ],
    },
    education: {
      eyebrow: "Aufklärung",
      title: "Familien stärken, damit sie sicherer versorgen können",
      body: [
        "Wir geben einfache, praktische Hinweise zu Tierwohl, Fütterung, Krankheitsanzeichen, Hygiene, freundlichem Umgang und verantwortungsvoller Tierhaltung weiter.",
        "Aufklärung bedeutet nicht Schuldzuweisung. Viele Familien hatten nie Zugang zu tierärztlicher Beratung oder Informationen über Tierwohl. Praktisches Wissen hilft Menschen zu verstehen, was Tiere brauchen und wann Hilfe dringend ist.",
      ],
      topics: [
        "Tierwohl",
        "Fütterung und sauberes Wasser",
        "Krankheitsanzeichen",
        "Parasitenkontrolle",
        "Hygiene",
        "Freundlicher Umgang",
        "Sicheres Verhalten im Umgang mit Tieren",
        "Warum Sterilisation wichtig ist",
        "Verantwortungsvolle Tierhaltung",
      ],
    },
    more: {
      eyebrow: "Mehr als Hunde",
      title: "Hilfe dort, wo sie gebraucht wird",
      body: [
        "Das Projekt heißt Pondo Dogs, weil Hunde im Mittelpunkt der Arbeit stehen. Doch im ländlichen Gemeinschaftsleben endet Tierschutz nicht bei Hunden.",
        "Hunde und Katzen werden als zentrale Begleittiere im Programm unterstützt. Wo möglich, hilft Pondo Dogs auch anderen Haus- oder Nutztieren in Notlagen. Das kann Esel, Ziegen, Schafe und Kühe umfassen, wenn dringend Unterstützung gebraucht wird und Hilfe möglich ist.",
        "Das entspricht der Realität des Gemeinschaftslebens. Tiere sind Teil von Haushalten, Lebensgrundlagen, Sicherheit und täglicher Fürsorge.",
      ],
    },
    focus: {
      eyebrow: "Verbundene Hilfe",
      title: "Tierschutz stärkt Gemeinwohl",
      body: [
        "Pondo Dogs ist mit mehreren Schwerpunktbereichen von iThemba Kuluntu verbunden.",
        "Das Projekt stärkt Tierschutz durch direkte Versorgung. Es stärkt Bildung durch Aufklärung von Halterinnen und Haltern und humanes Lernen. Es stärkt Fähigkeiten und Lebensgrundlagen durch lokale Koordination, praktische Reaktion und gemeindenahe Arbeit. Es stärkt Gemeinwohl, indem vermeidbares Leid, Angst und Risiken in gemeinsam genutzten Räumen verringert werden.",
        "Pondo Dogs steht nicht losgelöst von Gemeindeentwicklung. Es ist Teil des Aufbaus sichererer, freundlicherer und gesünderer Gemeinschaften.",
      ],
      areas: [
        { key: "animal-welfare", label: "Tierschutz" },
        { key: "education", label: "Bildung" },
        { key: "skills-livelihoods", label: "Fähigkeiten & Lebensgrundlagen" },
        { key: "community-health", label: "Gemeinwohl" },
      ],
    },
    donation: {
      eyebrow: "Ihre Unterstützung",
      title: "Was Spenden möglich machen",
      body: [
        "Spenden halten Pondo Dogs am Laufen. Tierschutzarbeit braucht Treibstoff, Transport, Futter, Medikamente, tierärztliche Versorgung, Sterilisation, Nachbetreuung und lokale Koordination.",
      ],
      items: [
        "Sterilisation",
        "Medizinische Notfallhilfe",
        "Behandlung kranker oder verletzter Tiere",
        "Impfungen und präventive Versorgung",
        "Entwurmung und Parasitenkontrolle",
        "Futterunterstützung",
        "Einfache Schutz- und Schlafplätze",
        "Transport zur tierärztlichen Versorgung",
        "Aufklärung für Tierhalterinnen und Tierhalter",
        "Nachbetreuung",
        "Lokale Tierschutzkoordination",
      ],
      outro:
        "Jede Spende hilft, Leid zu verringern und praktische Tierschutzarbeit dort möglich zu machen, wo formale Angebote nur begrenzt erreichbar sind.",
    },
    monthly: {
      eyebrow: "Monatlich geben",
      title: "Helfen Sie, Tierschutz kontinuierlich möglich zu machen",
      body: [
        "Tierschutz braucht Verlässlichkeit. Sterilisation, Futter, medizinische Hilfe und Notfallversorgung können nicht nur von einmaliger Unterstützung abhängen, wenn eine Krise bereits da ist.",
        "Monatliche Spenden helfen Pondo Dogs, vorausschauend zu planen. Sie tragen zu Futter, Transport, tierärztlicher Versorgung, Sterilisation, Medikamenten, Notfallhilfe und Aufklärung bei.",
      ],
      cardHeading: "Tierschutz unterstützen",
      cardAmount: "20 € / Monat",
      cardText:
        "Hilft, Sterilisation, Futter, medizinische Versorgung, Prävention und Notfallhilfe für gefährdete Tiere zu finanzieren.",
      cta1: "Tierschutz monatlich unterstützen",
      cta2: "Einmalig für Pondo Dogs spenden",
      trust: [
        "Sichere Spende",
        "Monatliche Unterstützung",
        "Praktische Tierschutzarbeit",
        "Gemeindenahe Hilfe",
        "Transparente Berichterstattung",
      ],
    },
    impact: {
      eyebrow: "Wirkung",
      title: "Was Ihre Unterstützung möglich macht",
      counters: [
        { value: "200+", label: "Sterilisationen" },
        { value: "1.500+", label: "Tiere behandelt" },
        { value: "500+", label: "Tierhalterinnen, Tierhalter und Familien erreicht" },
      ],
    },
    closing: {
      eyebrow: "Mitfühlendere Gemeinschaften",
      title: "Helfen Sie Tieren und Familien, sicherer und gesünder zu leben",
      body: [
        "Pondo Dogs gibt es, weil Tierschutz Teil von Gemeinwohl ist. Jede Sterilisation, Behandlung, Mahlzeit, Notfallhilfe und Aufklärung hilft, Leid zu verringern und freundlichere Beziehungen zwischen Tieren und Menschen aufzubauen.",
        "Ihre Unterstützung hilft gefährdeten Tieren, Versorgung zu erhalten, und hilft Familien und Gemeinschaften, einen sichereren und gesünderen Alltag zu gestalten.",
      ],
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      all: "Alle Projekte entdecken",
    },
  },

  nl: {
    back: "Alle projecten",
    hero: {
      eyebrow: "Dierenwelzijn",
      title: "Pondo Dogs",
      text:
        "Pondo Dogs is het dierenwelzijnsprogramma van iThemba Kuluntu. Samen met dieren, eigenaren en lokale communityteams in Pondoland, Zuid-Afrika, ondersteunen we kwetsbare honden, katten en andere dieren met praktische zorg, preventie, medische hulp, voeding, beschutting en voorlichting.",
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      location: "Pondoland · Eastern Cape · Zuid-Afrika",
      placeholder: "Hero-video-placeholder · klaar voor echte Pondo-Dogs-video",
    },
    snapshot: {
      eyebrow: "In één oogopslag",
      title: "Dierenwelzijn door iThemba Kuluntu",
      body: [
        "Pondo Dogs is het dierenwelzijnsprogramma van iThemba Kuluntu. Het project bestaat omdat dieren en families in landelijke gemeenschappen nauw met elkaar samenleven, en dierenwelzijn direct verbonden is met veiligheid, gezondheid, waardigheid en het dagelijks leven.",
        "Wij ondersteunen dieren en hun eigenaren daar waar zij wonen, met medische zorg en noodhulp, preventieve zorg, sterilisatiecampagnes, voedsel- en beschuttingsondersteuning, huisbezoeken en praktische voorlichting.",
      ],
      facts: [
        { label: "Project", value: "Pondo Dogs" },
        { label: "Focus", value: "Dierenwelzijn en gemeenschapswelzijn" },
        { label: "Waar", value: "Pondoland, Eastern Cape, Zuid-Afrika" },
        { label: "Wie het helpt", value: "Kwetsbare honden en katten, en waar mogelijk andere huis- en werkdieren in nood" },
        { label: "Hoe wij werken", value: "Met dieren, eigenaren en lokale communityteams" },
        { label: "Kernondersteuning", value: "Medische zorg, noodhulp, preventie, sterilisatie, voeding, beschutting en voorlichting" },
        { label: "Donatiefocus", value: "Maandelijkse steun voor dierenwelzijnswerk" },
      ],
      partnerLine: { pre: "Partner: ", post: " voor maandelijkse sterilisatiecampagnes" },
    },
    who: {
      eyebrow: "Wie",
      title: "wij zijn",
      body: [
        "Pondo Dogs is het dierenwelzijnsprogramma van iThemba Kuluntu.",
        "Wij werken met dieren, eigenaren en lokale communityteams in Pondoland, Zuid-Afrika. Ons werk is praktisch en gemeenschapsgericht. We komen niet pas in actie wanneer dieren al zichtbaar lijden. We ondersteunen dieren en families daar waar zij wonen, met zorg die respectvol, realistisch en duurzaam is.",
        "Pondo Dogs vertrekt vanuit het besef dat veel families veel om hun dieren geven, maar niet altijd toegang hebben tot diergeneeskundige zorg, vervoer, voeding, sterilisatie, medicatie of betrouwbare informatie. Onze rol is om die kloof te helpen overbruggen.",
      ],
    },
    believe: {
      eyebrow: "Waarin",
      title: "wij geloven",
      body: [
        "Dierenwelzijn gaat niet alleen over redding. Het gaat over het ondersteunen van dieren en hun eigenaren daar waar zij leven, met zorg die praktisch, respectvol en duurzaam is.",
        "Wij geloven dat gezondere dieren bijdragen aan veiligere huishoudens en vriendelijkere gemeenschappen. Wij geloven dat families niet beoordeeld moeten worden op wat armoede moeilijk maakt. En wij geloven dat dierenwelzijn het beste werkt wanneer het is gebaseerd op vertrouwen, voorlichting, preventie en lokale relaties.",
        "Pondo Dogs bestaat om lijden te verminderen, verantwoord zorgen voor dieren te versterken en het samenleven van mensen en dieren veiliger te maken.",
      ],
    },
    why: {
      eyebrow: "Waarom",
      title: "dit belangrijk is",
      body: [
        "Wanneer dieren gezonder zijn, wordt lijden verminderd. Families voelen zich gesteund, gemeenschappen worden veiliger en duurzaam dierenwelzijn wordt mogelijk.",
        "In landelijke gemeenschappen leven dieren dicht bij kinderen, families, huizen en gedeelde leefruimtes. Wanneer dieren ziek, gewond, hongerig, angstig of niet-gesteriliseerd zijn, raakt dat de hele gemeenschap.",
        "Een ziek of gewond dier lijdt. Een hongerig dier wordt zwakker. Herhaalde nestjes leggen druk op families die vaak zelf al met grote uitdagingen te maken hebben. Onbehandelde wonden, infecties, parasieten en vermijdbare ziektes kunnen snel ernstig worden.",
        "Pondo Dogs biedt praktische ondersteuning voordat lijden groter wordt, en noodhulp wanneer snelle zorg nodig is.",
      ],
    },
    what: {
      eyebrow: "Wat we doen",
      title: "Praktisch dierenwelzijnswerk",
      intro: "Pondo Dogs werkt binnen verschillende verbonden gebieden van dierenwelzijn.",
      areas: [
        "Medische zorg en noodhulp",
        "Preventieve zorg",
        "Maandelijkse sterilisatiecampagnes",
        "Huisbezoeken en ondersteuning thuis",
        "Voedsel- en beschuttingsondersteuning",
        "Voorlichting voor eigenaren",
      ],
      outro:
        "Elk onderdeel is op zichzelf belangrijk. Samen vormen ze een meer complete aanpak van dierenwelzijn: dieren worden geholpen wanneer ze ziek zijn, toekomstig lijden wordt voorkomen, eigenaren begrijpen beter wat hun dieren nodig hebben en zorg wordt mogelijk op plekken waar formele diergeneeskundige diensten moeilijk bereikbaar zijn.",
    },
    medical: {
      eyebrow: "Medische hulp",
      title: "Hulp voor zieke en gewonde dieren",
      body: [
        "We ondersteunen zieke en gewonde dieren, waaronder dieren met chronische aandoeningen, kanker, wonden, infecties en dringende medische noodsituaties.",
        "Medische zorg is vaak dringend, praktisch en heel persoonlijk. Voor veel families is een dier geliefd, maar diergeneeskundige hulp is te ver weg, te duur of organisatorisch moeilijk te regelen. Pondo Dogs helpt waar mogelijk, zodat dieren niet zonder ondersteuning hoeven te lijden.",
      ],
      items: [
        { text: "Diergeneeskundige behandeling" },
        { text: "Wondverzorging" },
        { text: "Ondersteuning bij noodtransport" },
        { text: "Ondersteuning met medicatie" },
        { text: "Zorg bij chronische aandoeningen" },
        { text: "Hulp bij ernstige medische gevallen" },
        { text: "Nazorg waar mogelijk" },
      ],
    },
    preventive: {
      eyebrow: "Preventie",
      title: "Dieren beschermen voordat ze ernstig ziek worden",
      body: [
        "We helpen dieren beschermen voordat ze ernstig ziek worden, onder andere met parasietenbestrijding, ontworming en 5-in-1-vaccinaties tegen ziektes zoals parvo en distemper.",
        "Preventieve zorg is belangrijk omdat veel dierziektes snel ernstig kunnen worden, vooral waar families geen gemakkelijke toegang hebben tot diergeneeskundige zorg. Voorkomen is vaak vriendelijker, betaalbaarder en effectiever dan pas ingrijpen wanneer een dier al in crisis is.",
      ],
      items: [
        { text: "Parasietenbestrijding" },
        { text: "Ontworming" },
        { text: "5-in-1-vaccinaties" },
        { text: "Eenvoudige gezondheidscontroles" },
        { text: "Vroege herkenning van ziekteverschijnselen" },
        { text: "Praktische begeleiding voor eigenaren rond waarschuwingssignalen" },
      ],
    },
    sterilisation: {
      eyebrow: "Voorkomen",
      title: "Maandelijkse sterilisatiecampagnes",
      bodyPre: "Samen met ",
      bodyPost:
        " organiseert ons lokale team maandelijkse sterilisatiecampagnes om ongewenste nestjes te verminderen en dierenwelzijn op lange termijn te versterken.",
      body2:
        "Sterilisatie is een van de belangrijkste bouwstenen van duurzaam dierenwelzijnswerk. Het helpt herhaalde nestjes te voorkomen, vermindert druk op families, voorkomt toekomstig lijden en ondersteunt gezondere dierenpopulaties op de lange termijn.",
      body3:
        "Sterilisatie is geen snelle eenmalige oplossing. Het vraagt om continuïteit, planning, vervoer, vertrouwen binnen de gemeenschap, diergeneeskundige ondersteuning en nazorg. Maandelijkse donaties helpen om precies die continuïteit mogelijk te maken.",
    },
    home: {
      eyebrow: "Thuis en dichtbij",
      title: "Hulp daar waar dieren leven",
      body: [
        "We werken met dieren en hun eigenaren in hun eigen leefomgeving en helpen families beter te begrijpen wat hun dieren nodig hebben en hoe zij beter voor hen kunnen zorgen.",
        "Huisbezoeken en ondersteuning thuis zijn belangrijk, omdat dierenwelzijn niet alleen in een kliniek plaatsvindt. Het gebeurt in erven, huizen, op paden en in dorpen, daar waar dieren elke dag leven.",
      ],
      items: [
        { text: "Dieren thuis bekijken" },
        { text: "Met eigenaren praten" },
        { text: "Dringende behoeften herkennen" },
        { text: "Basiszorg uitleggen" },
        { text: "Praktische verbeteringen ondersteunen" },
        { text: "Nazorg waar mogelijk" },
      ],
      outro:
        "Deze aanpak is respectvol en realistisch. Hij erkent dat zorg moet werken binnen de werkelijke leefomstandigheden van families.",
    },
    food: {
      eyebrow: "Voeding en beschutting",
      title: "Praktische hulp voor kwetsbare dieren",
      body: [
        "Waar dat nodig is, ondersteunen we dieren met voeding, eenvoudige slaapplaatsen en praktische zorg, zodat zij veiliger, gezonder en beter beschermd kunnen leven.",
        "Voedsel- en beschuttingsondersteuning kan direct verschil maken. Een hongerig dier wordt zwakker en vatbaarder voor ziekte. Een dier zonder veilige rustplek is meer blootgesteld aan kou, regen, verwonding en stress.",
        "Pondo Dogs biedt praktische hulp waar die het hardst nodig is, vooral voor kwetsbare dieren en families in moeilijke omstandigheden.",
      ],
    },
    education: {
      eyebrow: "Voorlichting",
      title: "Families versterken om beter en veiliger te zorgen",
      body: [
        "We delen eenvoudige, praktische informatie over dierenwelzijn, voeding, ziekteverschijnselen, hygiëne, vriendelijk omgaan met dieren en verantwoord eigenaarschap.",
        "Voorlichting gaat niet over schuld. Veel families hebben nooit toegang gehad tot diergeneeskundig advies of informatie over dierenwelzijn. Praktische kennis helpt mensen begrijpen wat dieren nodig hebben en wanneer hulp dringend is.",
      ],
      topics: [
        "Dierenwelzijn",
        "Voeding en schoon water",
        "Ziekteverschijnselen",
        "Parasietenbestrijding",
        "Hygiëne",
        "Vriendelijk omgaan met dieren",
        "Veilig gedrag rond dieren",
        "Waarom sterilisatie belangrijk is",
        "Verantwoord zorgen voor dieren",
      ],
    },
    more: {
      eyebrow: "Meer dan honden",
      title: "Zorg waar die nodig is",
      body: [
        "Het project heet Pondo Dogs omdat honden centraal staan in het werk. Maar in het landelijke gemeenschapsleven stopt dierenwelzijn niet bij honden.",
        "Honden en katten worden als belangrijke gezelschapsdieren binnen het programma ondersteund. Waar mogelijk helpt Pondo Dogs ook andere huis- en werkdieren in noodsituaties. Dat kan gaan om ezels, geiten, schapen en koeien wanneer dringende ondersteuning nodig is en hulp mogelijk gemaakt kan worden.",
        "Dit sluit aan bij de werkelijkheid van het gemeenschapsleven. Dieren maken deel uit van huishoudens, bestaanszekerheid, veiligheid en dagelijkse zorg.",
      ],
    },
    focus: {
      eyebrow: "Verbonden zorg",
      title: "Dierenwelzijn versterkt gemeenschapswelzijn",
      body: [
        "Pondo Dogs sluit aan bij meerdere focusgebieden van iThemba Kuluntu.",
        "Het project versterkt dierenwelzijn door directe zorg. Het versterkt educatie door voorlichting aan eigenaren en door leren over verantwoord omgaan met dieren. Het ondersteunt vaardigheden en bestaansmogelijkheden door lokale coördinatie, praktische projectuitvoering en gemeenschapsgericht werk. Het versterkt gemeenschapsgezondheid door vermijdbaar lijden, angst en risico’s in gedeelde leefruimtes te verminderen.",
        "Pondo Dogs staat niet los van gemeenschapsontwikkeling. Het is onderdeel van het bouwen aan veiligere, vriendelijkere en gezondere gemeenschappen.",
      ],
      areas: [
        { key: "animal-welfare", label: "Dierenwelzijn" },
        { key: "education", label: "Educatie" },
        { key: "skills-livelihoods", label: "Vaardigheden & bestaansmogelijkheden" },
        { key: "community-health", label: "Gemeenschapsgezondheid" },
      ],
    },
    donation: {
      eyebrow: "Uw steun",
      title: "Wat donaties mogelijk maken",
      body: [
        "Donaties helpen Pondo Dogs in beweging te houden. Dierenwelzijnswerk vraagt om brandstof, vervoer, voeding, medicatie, diergeneeskundige zorg, sterilisatie, nazorg en lokale coördinatie.",
      ],
      items: [
        "Sterilisatie",
        "Medische noodhulp",
        "Behandeling van zieke of gewonde dieren",
        "Vaccinaties en preventieve zorg",
        "Ontworming en parasietenbestrijding",
        "Voedselondersteuning",
        "Eenvoudige beschutting en slaapplaatsen",
        "Vervoer naar diergeneeskundige zorg",
        "Voorlichting voor eigenaren",
        "Nazorg",
        "Lokale coördinatie van dierenwelzijnswerk",
      ],
      outro:
        "Elke donatie helpt lijden verminderen en maakt praktische dierenwelzijnszorg mogelijk op plekken waar formele voorzieningen beperkt bereikbaar zijn.",
    },
    monthly: {
      eyebrow: "Geef maandelijks",
      title: "Help dierenwelzijn continu mogelijk te maken",
      body: [
        "Dierenwelzijn vraagt om betrouwbaarheid. Sterilisatie, voeding, medische zorg en noodhulp kunnen niet alleen afhangen van eenmalige steun wanneer een crisis al is ontstaan.",
        "Maandelijkse donaties helpen Pondo Dogs vooruit te plannen. Ze dragen bij aan voeding, vervoer, diergeneeskundige zorg, sterilisatie, medicatie, noodhulp en voorlichting.",
      ],
      cardHeading: "Steun dierenwelzijn",
      cardAmount: "€20 / maand",
      cardText:
        "Helpt sterilisatie, voeding, medische zorg, preventieve zorg en noodhulp voor kwetsbare dieren te financieren.",
      cta1: "Steun dierenwelzijn maandelijks",
      cta2: "Doneer eenmalig aan Pondo Dogs",
      trust: [
        "Veilig doneren",
        "Maandelijkse steun",
        "Praktisch dierenwelzijnswerk",
        "Gemeenschapsgerichte zorg",
        "Transparante rapportage",
      ],
    },
    impact: {
      eyebrow: "Impact",
      title: "Wat uw steun mogelijk maakt",
      counters: [
        { value: "200+", label: "Sterilisaties" },
        { value: "1.500+", label: "Dieren behandeld" },
        { value: "500+", label: "Eigenaren, verzorgers en families bereikt" },
      ],
    },
    closing: {
      eyebrow: "Vriendelijkere gemeenschappen",
      title: "Help dieren en families veiliger en gezonder leven",
      body: [
        "Pondo Dogs bestaat omdat dierenwelzijn onderdeel is van gemeenschapswelzijn. Elke sterilisatie, behandeling, maaltijd, noodhulpactie en voorlichtingsmoment helpt lijden verminderen en vriendelijkere relaties tussen dieren en mensen opbouwen.",
        "Uw steun helpt kwetsbare dieren zorg te krijgen, en helpt families en gemeenschappen een veiliger en gezonder dagelijks leven op te bouwen.",
      ],
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      all: "Alle projecten bekijken",
    },
  },
};

/* ---------- shared helpers ---------- */
function KustenhundLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={KUSTENHUND_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline decoration-[var(--ithemba-yellow)] decoration-2 underline-offset-4 hover:text-[var(--ithemba-yellow)] ${className}`}
    >
      Küstenhund e.V.
    </a>
  );
}

function PawDoodle({ className = "h-5 w-5" }: { className?: string }) {
  return <PawPrint className={`${className} text-[var(--ithemba-yellow)]`} aria-hidden />;
}

function SectionHeading({
  eyebrow,
  title,
  center = false,
  color = "var(--ithemba-yellow)",
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
  color?: string;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <div className="hand-eyebrow-lg" style={{ color }}>
        {eyebrow}
      </div>
      <h2 className="-mt-1 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero({ c }: { c: Copy }) {
  const reduced = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = !reduced && !videoFailed;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {showVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_POSTER}
            onError={() => setVideoFailed(true)}
            aria-hidden
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <SmartImage
            src={HERO_POSTER}
            label="Pondo Dogs — animal welfare in Pondoland"
            className="h-full w-full"
            rounded="rounded-none"
            tone="earth"
            showMissingBadge={false}
          />
        )}
        {!showVideo && (
          <img
            src={FALLBACK_POSTER}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover -z-10"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/82 via-[var(--ithemba-blue-dark)]/62 to-[var(--ithemba-blue)]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>

      {/* video placeholder badge */}
      <div className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 ring-1 ring-white/15 backdrop-blur">
        <PlayCircle className="h-3.5 w-3.5 text-[var(--ithemba-yellow)]" />
        {c.hero.placeholder}
      </div>

      {/* logo */}
      <div className="absolute right-4 top-14 z-10 md:right-8 md:top-16">
        <SmartLogo
          src={assets.logos.pondoDogs}
          alt="Pondo Dogs logo"
          className="h-20 w-auto max-w-[10rem] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] md:h-28 md:max-w-[13rem]"
          showMissingBadge={false}
          fallback={<span className="sr-only">Pondo Dogs</span>}
        />
      </div>

      {/* decorative paws */}
      <div className="pointer-events-none absolute left-8 top-20 opacity-30 md:left-16">
        <PawPrint className="h-8 w-8 text-[var(--ithemba-yellow)] rotate-[-15deg]" />
      </div>
      <div className="pointer-events-none absolute left-24 top-40 opacity-20 md:left-40">
        <PawPrint className="h-6 w-6 text-[var(--ithemba-yellow)] rotate-12" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 md:pb-32 md:pt-28 lg:px-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-white/85 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {c.back}
        </Link>

        <div className="mt-8 max-w-3xl text-white">
          <FocusAreaBadges
            badges={["animal-welfare", "education", "skills-livelihoods", "community-health"]}
            size="md"
            className="mb-5"
          />
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm flex items-center gap-2">
            <PawDoodle className="h-5 w-5" /> {c.hero.eyebrow}
          </div>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            {c.hero.title}
          </h1>
          <svg
            className="mt-4 block w-48 md:w-72"
            height="14"
            viewBox="0 0 200 14"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M2,8 C50,2 120,14 198,6"
              stroke="var(--ithemba-yellow)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/95 md:text-xl">
            {c.hero.text}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 ring-1 ring-white/20 backdrop-blur">
            <Star className="h-3.5 w-3.5 text-[var(--ithemba-yellow)] fill-current" />
            {c.hero.location}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <Link to="/donate">
              <Button
                size="lg"
                className="rounded-full bg-[var(--ithemba-yellow)] font-semibold text-[var(--ithemba-brown)] shadow-lg hover:bg-[var(--ithemba-yellow)]/95"
              >
                <Heart className="mr-2 h-4 w-4 fill-current" /> {c.hero.monthly}
              </Button>
            </Link>
            <Link to="/donate">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                {c.hero.once}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <svg className="block w-full -mb-px" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="var(--ithemba-cream)"
        />
      </svg>
    </section>
  );
}

/* ---------- SNAPSHOT ---------- */
const SNAPSHOT_ICONS: string[] = [
  ICON.project,
  ICON.communityWellbeing,
  ICON.location,
  ICON.animalsSupported,
  ICON.communityTeams,
  ICON.coreSupport,
  ICON.monthlySupport,
];

function Snapshot({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -left-10 top-10 h-44 w-44 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-52 w-52 blob-2 bg-[var(--ithemba-blue)]/15" />
      <div className="pointer-events-none absolute right-12 top-12 opacity-30">
        <PawPrint className="h-7 w-7 text-[var(--ithemba-blue-dark)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
        <div className="text-center">
          <SectionHeading eyebrow={c.snapshot.eyebrow} title={c.snapshot.title} center />
        </div>
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center text-lg leading-relaxed text-foreground/85">
          {c.snapshot.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
          {c.snapshot.facts.map((f, i) => (
            <div key={f.label} className="flex flex-col items-center text-center">
              <PdIcon
                src={SNAPSHOT_ICONS[i] ?? ICON.project}
                className="h-16 w-16 md:h-20 md:w-20"
              />
              <div className="mt-4 font-display text-base font-extrabold leading-tight text-[var(--ithemba-blue-dark)]">
                {f.value}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/60">
                {f.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partner line */}
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 px-5 py-4 text-center text-sm text-foreground/85 ring-1 ring-[var(--ithemba-blue)]/15">
          <PawPrint className="mr-2 inline h-4 w-4 text-[var(--ithemba-yellow)]" />
          {c.snapshot.partnerLine.pre}
          <KustenhundLink />
          {c.snapshot.partnerLine.post}
        </div>
      </div>
    </section>
  );
}

/* ---------- WHO — photo left, text right (cream) ---------- */
function Who({ c }: { c: Copy }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="relative">
          <div className="absolute -left-6 -top-6 h-24 w-24 blob bg-[var(--ithemba-yellow)]/35 -z-10" />
          <SmartImage
            src={PHOTO_COMMUNITY}
            label="Dogs and people in a Pondoland community"
            className="aspect-[4/5] w-full"
            rounded="rounded-[55%_45%_60%_40%/45%_55%_45%_55%]"
            tone="earth"
            showMissingBadge={false}
          />
          <div className="absolute -bottom-5 -right-5 hidden h-24 w-24 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] shadow-xl md:flex">
            <PawPrint className="h-9 w-9" />
          </div>
        </div>
        <div>
          <SectionHeading eyebrow={c.who.eyebrow} title={c.who.title} />
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
            {c.who.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- BELIEVE — blue photo overlay, text-left ---------- */
function Believe({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white md:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_COMMUNITY}
          label="Animals and families in community"
          className="h-full w-full"
          rounded="rounded-none"
          tone="earth"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/93 via-[var(--ithemba-blue-dark)]/85 to-[var(--ithemba-blue)]/55" />
        <div className="absolute left-[-6rem] bottom-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 lg:px-8">
        <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
          <PawDoodle /> {c.believe.eyebrow}
        </div>
        <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.believe.title}</h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/90">
          {c.believe.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- WHY — blue photo bg ---------- */
function Why({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white md:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_HERO}
          label="Animals and people sharing daily life in Pondoland"
          className="h-full w-full"
          rounded="rounded-none"
          tone="earth"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 lg:px-8">
        <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
          <PawDoodle /> {c.why.eyebrow}
        </div>
        <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.why.title}</h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/90">
          {c.why.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- WHAT — six connected support areas ---------- */
const AREA_ICONS: string[] = [
  ICON.medicalCare,
  ICON.preventiveCare,
  ICON.sterilisation,
  ICON.homeBased,
  ICON.foodAndShelter,
  ICON.ownerEducation,
];

function What({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 blob-2 bg-[var(--ithemba-yellow)]/20" />
      <div className="pointer-events-none absolute -left-16 bottom-16 h-48 w-48 blob bg-[var(--ithemba-blue)]/12" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.what.eyebrow} title={c.what.title} />
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">{c.what.intro}</p>
        </div>
        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {c.what.areas.map((area, i) => (
            <div key={area} className="flex items-start gap-5">
              <PdIcon
                src={AREA_ICONS[i] ?? ICON.coreSupport}
                className="h-16 w-16 shrink-0 md:h-20 md:w-20"
              />
              <div className="pt-2 font-display text-lg font-bold leading-snug text-[var(--ithemba-blue-dark)]">
                {area}
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-base leading-relaxed text-foreground/80">
          {c.what.outro}
        </p>
      </div>
    </section>
  );
}

/* ---------- Generic care section: photo bubble + text + bullet items ---------- */
function CareSection({
  eyebrow,
  title,
  body,
  items,
  outro,
  photo,
  photoLabel,
  reversed = false,
  background = "cream",
}: {
  eyebrow: string;
  title: string;
  body: string[];
  items?: Bullet[];
  outro?: string;
  photo: string;
  photoLabel: string;
  reversed?: boolean;
  background?: "cream" | "white" | "blue";
}) {
  const isBlue = background === "blue";
  const bg =
    background === "cream"
      ? "bg-[var(--ithemba-cream)]"
      : isBlue
        ? "bg-[var(--ithemba-blue-dark)]"
        : "bg-background";
  const textColor = isBlue ? "text-white/90" : "text-foreground/85";
  const outroColor = isBlue ? "text-white/75" : "text-foreground/75";
  return (
    <section className={`relative overflow-hidden ${bg} py-20`}>
      {isBlue && (
        <>
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 sun-glow" />
          <div className="pointer-events-none absolute -left-16 bottom-16 h-48 w-48 blob bg-[var(--ithemba-yellow)]/10" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className={`grid items-center gap-10 md:grid-cols-2 ${reversed ? "md:[&>*:first-child]:order-2" : ""}`}>
          <div className="relative">
            <div className={`absolute -left-6 -top-6 -z-10 h-24 w-24 blob ${isBlue ? "bg-[var(--ithemba-yellow)]/20" : "bg-[var(--ithemba-yellow)]/30"}`} />
            <SmartImage
              src={photo}
              label={photoLabel}
              className="aspect-[4/5] w-full"
              rounded="rounded-[55%_45%_60%_40%/45%_55%_45%_55%]"
              tone="earth"
              showMissingBadge={false}
            />
          </div>
          <div>
            {isBlue ? (
              <>
                <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
                  <PawDoodle /> {eyebrow}
                </div>
                <h2 className="-mt-1 font-display text-4xl font-bold text-white md:text-5xl">{title}</h2>
              </>
            ) : (
              <SectionHeading eyebrow={eyebrow} title={title} />
            )}
            <div className={`mt-5 space-y-4 text-lg leading-relaxed ${textColor}`}>
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {items && items.length > 0 && (
              <ul className="mt-6 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                {items.map((it) => (
                  <li
                    key={it.text}
                    className={`flex items-start gap-2 text-sm font-medium ${isBlue ? "text-white/90" : "text-foreground/85"}`}
                  >
                    <PawPrint className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ithemba-yellow)]" />
                    <span>{it.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {outro && (
              <p className={`mt-6 text-base leading-relaxed ${outroColor}`}>{outro}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- STERILISATION — partnership feature ---------- */
function Sterilisation({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-24 text-white">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_CARE}
          label="Sterilisation campaign in Pondoland"
          className="h-full w-full"
          rounded="rounded-none"
          tone="earth"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/93 via-[var(--ithemba-blue-dark)]/86 to-[var(--ithemba-blue)]/60" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 sun-glow" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* photo bubble */}
          <div className="relative">
            <div className="pointer-events-none absolute -left-6 -top-6 -z-10 h-28 w-28 blob bg-[var(--ithemba-yellow)]/25" />
            <SmartImage
              src={PHOTO_CARE}
              label="Animal welfare team preparing a sterilisation campaign"
              className="aspect-[4/5] w-full"
              rounded="rounded-[55%_45%_60%_40%/45%_55%_45%_55%]"
              tone="earth"
              showMissingBadge={false}
            />
            {/* clean icon badge */}
            <div className="absolute -bottom-4 -right-2 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[var(--ithemba-blue-dark)] shadow-lg ring-1 ring-[var(--ithemba-yellow)]/40 backdrop-blur">
              <PdIcon src={ICON.sterilisation} className="h-7 w-7" />
              <span className="pr-1 text-xs font-semibold uppercase tracking-wide">
                {c.sterilisation.eyebrow}
              </span>
            </div>
          </div>

          {/* text + partner */}
          <div>
            <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
              <PawDoodle /> {c.sterilisation.eyebrow}
            </div>
            <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">
              {c.sterilisation.title}
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/90">
              <p>
                {c.sterilisation.bodyPre}
                <KustenhundLink className="text-white" />
                {c.sterilisation.bodyPost}
              </p>
              <p>{c.sterilisation.body2}</p>
              <p>{c.sterilisation.body3}</p>
            </div>

            {/* Partner card — discreet, references partner without over-emphasis */}
            <div className="mt-8 flex flex-wrap items-center gap-4 rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur">
              <PdIcon src={ICON.sterilisation} className="h-12 w-12" />
              <div className="flex-1 min-w-[200px]">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Partner
                </div>
                <div className="font-display text-lg font-bold">
                  <KustenhundLink className="text-white" />
                </div>
              </div>
              <a
                href={KUSTENHUND_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[var(--ithemba-yellow)] px-4 py-2 text-sm font-semibold text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/95"
              >
                kuestenhund.com →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- EDUCATION — soft bubbles ---------- */
function Education({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -left-16 top-16 h-48 w-48 blob bg-[var(--ithemba-yellow)]/20" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative">
            <SmartImage
              src={PHOTO_COMMUNITY}
              label="Owner education in the community"
              className="aspect-[4/5] w-full"
              rounded="rounded-[60%_40%_45%_55%/50%_60%_40%_50%]"
              tone="earth"
              showMissingBadge={false}
            />
          </div>
          <div>
            <SectionHeading eyebrow={c.education.eyebrow} title={c.education.title} />
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
              {c.education.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {c.education.topics.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--ithemba-blue-dark)] shadow-sm ring-1 ring-[var(--ithemba-yellow)]/30"
            >
              <PawPrint className="mr-1.5 inline h-3.5 w-3.5 text-[var(--ithemba-yellow)]" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- MORE THAN DOGS ---------- */
function More({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_COMMUNITY}
          label="Animals and people in Pondoland"
          className="h-full w-full"
          rounded="rounded-none"
          tone="earth"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/85 to-[var(--ithemba-blue)]/60" />
      </div>
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 sun-glow" />
      <div className="pointer-events-none absolute -left-16 bottom-12 h-48 w-48 blob bg-[var(--ithemba-yellow)]/10" />
      <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
        <div className="text-center">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] inline-flex items-center gap-2">
            <PawDoodle /> {c.more.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.more.title}</h2>
        </div>
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center text-lg leading-relaxed text-white/90">
          {c.more.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FOCUS AREAS ---------- */
function Focus({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.focus.eyebrow} title={c.focus.title} />
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
            {c.focus.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 items-start gap-x-6 gap-y-10 md:grid-cols-4">
          {c.focus.areas.map((a) => {
            const meta = focusAreaBadgeMeta[a.key];
            return (
              <div key={a.key} className="flex flex-col items-center text-center">
                <img
                  src={meta.src}
                  alt={a.label}
                  className="h-20 w-20 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)] md:h-24 md:w-24"
                  loading="lazy"
                />
                <div className="mt-5 font-display text-base font-bold text-[var(--ithemba-blue-dark)] md:text-lg">
                  {a.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- DONATION HELP LIST ---------- */
const DONATION_ICONS: string[] = [
  ICON.sterilisation,
  ICON.emergencyCare,
  ICON.medicalCare,
  ICON.preventiveCare,
  ICON.deworming,
  ICON.foodSupport,
  ICON.shelterSupport,
  ICON.transportVet,
  ICON.ownerEducation,
  ICON.homeBased,
  ICON.localCoordination,
];

function DonationHelp({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_HERO}
          label="Pondo Dogs in the community"
          className="h-full w-full"
          rounded="rounded-none"
          tone="earth"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
            <PawDoodle /> {c.donation.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">
            {c.donation.title}
          </h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-white/90">
            {c.donation.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {c.donation.items.map((it, i) => (
            <div key={it} className="flex items-center gap-4">
              <PdIcon
                src={DONATION_ICONS[i] ?? ICON.coreSupport}
                className="h-14 w-14 shrink-0 md:h-16 md:w-16"
              />
              <span className="text-sm font-medium leading-snug text-white/95 md:text-base">
                {it}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-base leading-relaxed text-white/85">
          {c.donation.outro}
        </p>
      </div>
    </section>
  );
}

/* ---------- MONTHLY DONATION CARD ---------- */
function Monthly({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 blob bg-[var(--ithemba-yellow)]/20" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center lg:px-8">
        <div>
          <SectionHeading eyebrow={c.monthly.eyebrow} title={c.monthly.title} />
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
            {c.monthly.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {c.monthly.trust.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--ithemba-blue-dark)] ring-1 ring-[var(--ithemba-blue)]/15"
              >
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[var(--ithemba-yellow)]" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl ring-1 ring-[var(--ithemba-blue)]/15">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)]">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                {c.monthly.cardHeading}
              </div>
              <div className="font-display text-3xl font-extrabold text-[var(--ithemba-blue-dark)]">
                {c.monthly.cardAmount}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            {c.monthly.cardText}
          </p>
          <div className="mt-6 grid gap-2">
            <Link to="/donate">
              <Button
                size="lg"
                className="w-full rounded-full bg-[var(--ithemba-yellow)] font-semibold text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/95"
              >
                <Heart className="mr-2 h-4 w-4 fill-current" /> {c.monthly.cta1}
              </Button>
            </Link>
            <Link to="/donate">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-[var(--ithemba-blue)]/25"
              >
                {c.monthly.cta2}
              </Button>
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] font-medium text-foreground/60">
            <span>Card</span>·<span>PayPal</span>·<span>Bank</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- IMPACT ---------- */
const IMPACT_ICONS: LucideIcon[] = [Syringe, Stethoscope, Users];

function parseCounter(value: string): { n: number; suffix: string } {
  const m = value.match(/^([\d.,]+)(.*)$/);
  if (!m) return { n: 0, suffix: value };
  const numeric = parseInt(m[1].replace(/[.,]/g, ""), 10);
  return { n: isNaN(numeric) ? 0 : numeric, suffix: m[2] };
}

function AnimatedNumber({ target, locale }: { target: number; locale: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const dur = 1400;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString(locale)}
    </span>
  );
}

function Impact({ c }: { c: Copy }) {
  const { lang } = useLang();
  const locale = lang === "en" ? "en-US" : lang === "de" ? "de-DE" : "nl-NL";
  return (
    <section className="relative isolate overflow-hidden py-20 text-white md:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_HERO}
          label="Pondo Dogs impact"
          className="h-full w-full"
          rounded="rounded-none"
          tone="earth"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/88 to-[var(--ithemba-blue-deepest)]/95" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center justify-center gap-2">
            <PawDoodle /> {c.impact.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-3xl font-bold md:text-4xl">{c.impact.title}</h2>
        </div>

        <div className="mx-auto mt-12 flex flex-wrap justify-center gap-x-6 gap-y-10">
          {c.impact.counters.map((cnt, i) => {
            const Icon = IMPACT_ICONS[i] ?? PawPrint;
            const { n, suffix } = parseCounter(cnt.value);
            return (
              <div
                key={cnt.label}
                className="flex basis-[calc(50%-12px)] flex-col items-center text-center sm:basis-[calc(33.333%-16px)]"
              >
                <Icon className="h-14 w-14 text-[var(--ithemba-yellow)] md:h-20 md:w-20 lg:h-24 lg:w-24" />
                <div
                  className="mt-4 font-display font-extrabold leading-none text-[var(--ithemba-yellow)] drop-shadow-[0_2px_18px_rgba(251,191,36,0.25)]"
                  style={{ fontSize: "clamp(1.75rem, 2.4vw, 2.5rem)" }}
                >
                  <AnimatedNumber target={n} locale={locale} />
                  {suffix}
                </div>
                <div className="mt-3 max-w-[14rem] text-[12px] font-medium leading-snug text-white/85 md:text-sm">
                  {cnt.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* gentle wave divider into Closing */}
      <svg
        className="relative mt-16 block w-full"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,30 C240,55 480,5 720,30 C960,55 1200,5 1440,30"
          stroke="var(--ithemba-yellow)"
          strokeOpacity="0.35"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M0,38 C240,62 480,12 720,38 C960,62 1200,12 1440,38"
          stroke="#ffffff"
          strokeOpacity="0.18"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </section>
  );
}

/* ---------- CLOSING ---------- */
function Closing({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-24 text-white">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_HERO}
          label="Pondo Dogs — animals and families"
          className="h-full w-full"
          rounded="rounded-none"
          tone="earth"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/80 to-[var(--ithemba-blue)]/55" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
        <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center justify-center gap-2">
          <PawDoodle /> {c.closing.eyebrow}
        </div>
        <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.closing.title}</h2>
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-white/90">
          {c.closing.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link to="/donate">
            <Button
              size="lg"
              className="rounded-full bg-[var(--ithemba-yellow)] font-semibold text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/95"
            >
              <Heart className="mr-2 h-4 w-4 fill-current" /> {c.closing.monthly}
            </Button>
          </Link>
          <Link to="/donate">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              {c.closing.once}
            </Button>
          </Link>
          <Link to="/projects">
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              {c.closing.all}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- PAGE ---------- */
function PondoDogsPage() {
  const { lang } = useLang();
  const c = COPY[lang];
  return (
    <>
      <Hero c={c} />
      <Snapshot c={c} />
      <Who c={c} />
      <Believe c={c} />
      <Why c={c} />
      <What c={c} />
      <CareSection
        eyebrow={c.medical.eyebrow}
        title={c.medical.title}
        body={c.medical.body}
        items={c.medical.items}
        photo={PHOTO_CARE}
        photoLabel="Caring for a sick or injured animal"
        background="blue"
      />
      <CareSection
        eyebrow={c.preventive.eyebrow}
        title={c.preventive.title}
        body={c.preventive.body}
        items={c.preventive.items}
        photo={PHOTO_COMMUNITY}
        photoLabel="Preventive care for animals"
        reversed
        background="white"
      />
      <Sterilisation c={c} />
      <CareSection
        eyebrow={c.home.eyebrow}
        title={c.home.title}
        body={c.home.body}
        items={c.home.items}
        outro={c.home.outro}
        photo={PHOTO_COMMUNITY}
        photoLabel="Home visit in a Pondoland village"
        background="cream"
      />
      <CareSection
        eyebrow={c.food.eyebrow}
        title={c.food.title}
        body={c.food.body}
        photo={PHOTO_CARE}
        photoLabel="Food and shelter support for animals"
        reversed
        background="blue"
      />
      <Education c={c} />
      <More c={c} />
      <Focus c={c} />
      <DonationHelp c={c} />
      <Monthly c={c} />
      <Impact c={c} />
      <Closing c={c} />
    </>
  );
}
