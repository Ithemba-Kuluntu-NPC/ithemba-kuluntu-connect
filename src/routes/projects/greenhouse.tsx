import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Sun,
  Sprout,
  Leaf,
  Droplet,
  Wrench,
  Users,
  GraduationCap,
  Handshake,
  MapPin,
  Calendar,
  Building2,
  Cookie,
  PackageOpen,
  Hammer,
  Truck,
  ArrowDown,
  ArrowRight,
  PlayCircle,
  Star,
  Award,
} from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { SmartImage } from "@/components/site/Asset";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { FocusAreaBadges } from "@/components/blocks/FocusAreaBadges";
import { assets } from "@/data/assets";
import { focusAreaBadgeMeta } from "@/data/projects";
import type { Lang } from "@/data/content";

export const Route = createFileRoute("/projects/greenhouse")({ component: GreenhousePage });

/* ---------- assets ---------- */
const HERO_VIDEO = "/assets/videos/projects/greenhouse-hero.mp4";
const HERO_POSTER = "/assets/photos/projects/greenhouse-hero-poster.jpg";
const FALLBACK_POSTER = assets.photos.projects.greenhouseHero;
const PHOTO_MAIN = assets.photos.greenhouse.main;
const PHOTO_WOMEN = assets.photos.greenhouse.womenTraining;
const PHOTO_FOOD = assets.photos.greenhouse.foodGrowing;
const PHOTO_MEAL = assets.photos.ecd.meal;
const SA_HARVEST_LOGO = "/assets/logos/partners/sa-harvest-logo.png";
const FRESH_LIFE_LOGO = "/assets/logos/partners/fresh-life-produce-transparent-logo.png";
const ITHEMBA_LOGO = assets.logos.ithembaRoundColor;

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

/* ---------- content (EN/DE/NL — verbatim from /public/content/projects) ---------- */
type Fact = { label: string; value: string };
type Step = { title: string; text: string };
type DonationItem = { icon: string; label: string };
type FocusItem = { badge: "food-security" | "skills-livelihoods" | "community-health" | "education" | "safe-water"; label: string };

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
  };
  why: {
    eyebrow: string;
    title: string;
    body: string[];
  };
  partnership: {
    eyebrow: string;
    title: string;
    body: string[];
    roles: { name: string; logo?: string; role: string }[];
  };
  how: {
    eyebrow: string;
    title: string;
    body: string[];
    benefits: string[];
    steps: Step[];
  };
  nutrition: {
    eyebrow: string;
    title: string;
    body: string[];
  };
  focus: {
    eyebrow: string;
    title: string;
    body: string[];
    items: FocusItem[];
  };
  donation: {
    eyebrow: string;
    title: string;
    intro: string;
    items: DonationItem[];
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
  };
  closing: {
    eyebrow: string;
    title: string;
    body: string[];
    monthly: string;
    once: string;
    all: string;
  };
};

const COPY: Record<Lang, Copy> = {
  en: {
    back: "All projects",
    hero: {
      eyebrow: "Food growing",
      title: "Greenhouse with SA Harvest",
      text:
        "A water-efficient vertical growing project in Cwebeni, sponsored by SA Harvest and implemented in cooperation with Fresh Life Produce. The greenhouse helps local women build practical growing skills while producing fresh food to supplement the daily meals at the iThemba Kuluntu No.1 ECD Centre.",
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      location: "Cwebeni · Port St Johns · Eastern Cape · South Africa",
      placeholder: "Hero video placeholder · ready for real greenhouse video",
    },
    snapshot: {
      eyebrow: "At a glance",
      title: "Food, skills and nutrition close to home",
      body: [
        "The Greenhouse with SA Harvest is a practical food-growing and skills-development project rooted in Cwebeni, Port St Johns, South Africa.",
        "The project is sponsored by SA Harvest and happens in cooperation with Fresh Life Produce. The growing system used is the African Grower, a vertical, water-efficient system from Fresh Life Produce, and their team has trained local women in how to work with the system, care for the plants and build practical growing skills.",
        "The greenhouse is directly connected to the iThemba Kuluntu No.1 ECD Centre. It helps supplement the daily meals served to 120 children, strengthening child nutrition while building local skills and food resilience.",
        "This project is about more than vegetables. It is about local food production, women's training, nutrition, water-wise growing, community resilience and the possibility of growing more food close to the children and families who need it.",
      ],
      facts: [
        { label: "Project", value: "Greenhouse with SA Harvest" },
        { label: "Focus", value: "Food security, skills development and local growing" },
        { label: "Where", value: "Cwebeni, Port St Johns, Eastern Cape, South Africa" },
        { label: "Sponsored by", value: "SA Harvest" },
        { label: "In cooperation with", value: "Fresh Life Produce" },
        { label: "Growing system", value: "African Grower — water-efficient vertical growing" },
        { label: "Training", value: "Local women trained by the Fresh Life Produce team" },
        { label: "Connected project", value: "iThemba Kuluntu No.1 ECD Centre · 120 children" },
      ],
    },
    why: {
      eyebrow: "Why",
      title: "local growing matters",
      body: [
        "Food insecurity is not only about a shortage of food. It is also about distance, cost, access, skills, infrastructure and the ability of communities to grow and sustain food close to home.",
        "In rural communities, families may depend on food that has travelled far, costs too much or is not always available when households need it most. Fresh, nutritious produce can be especially difficult to access consistently.",
        "The Greenhouse with SA Harvest responds to this challenge in a practical way. It helps grow food locally, trains local women and strengthens the food system around one of iThemba Kuluntu's most important daily commitments: feeding children.",
        "At the No.1 ECD Centre, 120 children receive daily meals. Fresh produce from the greenhouse helps supplement those meals and creates a direct connection between local growing, early childhood development and community care.",
        "The goal is simple but powerful: communities should not only receive food in times of need. They should also be supported to grow, learn and build more resilient local food systems.",
      ],
    },
    partnership: {
      eyebrow: "Together",
      title: "Supported by SA Harvest, grown with Fresh Life Produce",
      body: [
        "This greenhouse project is made possible through partnership.",
        "SA Harvest supports the project as sponsor, helping make the food-growing opportunity possible as part of a wider commitment to addressing hunger and strengthening food systems in South Africa.",
        "Fresh Life Produce brings the growing system and technical knowledge. Their team trained local women to understand the African Grower vertical growing system, care for the plants and build practical agricultural skills.",
        "iThemba Kuluntu anchors the project locally in Cwebeni, connecting the greenhouse to community needs, food security work, the No.1 ECD Centre and long-term local development.",
        "Together, the partnership brings sponsorship, technology, training and community-rooted implementation into one practical project.",
      ],
      roles: [
        { name: "SA Harvest", logo: SA_HARVEST_LOGO, role: "Project sponsor and food security partner" },
        { name: "Fresh Life Produce", logo: FRESH_LIFE_LOGO, role: "African Grower system, technical support and training partner" },
        { name: "iThemba Kuluntu", logo: ITHEMBA_LOGO, role: "Local implementation, community coordination and connection to the No.1 ECD Centre" },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "Vertical growing, practical training and daily care",
      body: [
        "The greenhouse uses the African Grower vertical growing system from Fresh Life Produce. Instead of relying on large areas of land, the system grows upward, allowing more plants to be cultivated in a smaller footprint.",
        "This matters in communities where land, water, infrastructure and growing conditions can be challenging. A compact, water-efficient system can help create a productive growing space that is organised, manageable and realistic for local training.",
        "Fresh Life Produce trained local women to work with the system and understand the routines of growing. This includes planting, caring for seedlings, monitoring plant health, managing water and nutrients, harvesting and maintaining the greenhouse.",
        "The learning is practical. Women build skills by working directly with the system, and the produce grown through this work helps support children who eat daily at the No.1 ECD Centre.",
      ],
      benefits: [
        "Uses vertical space efficiently",
        "Supports local food production",
        "Designed for careful water use",
        "Creates a structured training environment",
        "Builds practical growing skills",
        "Supports women's learning and responsibility",
        "Helps supplement meals at the No.1 ECD Centre",
        "Connects food security with local livelihoods",
      ],
      steps: [
        { title: "Plant", text: "Seeds and seedlings go into the African Grower vertical system." },
        { title: "Care", text: "Local women, trained by Fresh Life Produce, monitor plants, water and nutrients." },
        { title: "Grow", text: "The vertical system uses space and water efficiently as plants mature." },
        { title: "Harvest", text: "Fresh produce is picked and prepared for the children at the No.1 ECD Centre." },
      ],
    },
    nutrition: {
      eyebrow: "Children first",
      title: "Fresh produce for 120 children",
      body: [
        "The greenhouse is directly connected to iThemba Kuluntu's food security work and to the No.1 ECD Centre.",
        "At the No.1 ECD Centre, 120 children receive care, early learning, play, rest and daily meals. The greenhouse helps supplement those meals with fresh produce grown close to the centre and close to the community.",
        "This connection matters. Children need regular, nutritious food to grow, learn, concentrate and feel safe throughout the day. A local growing project can help strengthen the food system around the centre and reduce dependence on food that must always come from far away.",
        "For iThemba Kuluntu, early childhood development is not only about classroom learning. It is also about food, safety, health, routine and the systems that support a child's whole day.",
        "Food growing, child nutrition and community wellbeing belong together.",
      ],
    },
    focus: {
      eyebrow: "Connected care",
      title: "One greenhouse, many layers of impact",
      body: [
        "The Greenhouse with SA Harvest connects several iThemba Kuluntu focus areas in one practical project.",
        "It supports food security by growing fresh produce close to the community. It supports skills and livelihoods by training local women in a practical growing system. It supports community health through better access to fresh food and nutrition. It supports education through hands-on learning and through its direct connection to the No.1 ECD Centre. It connects to safe water because responsible growing depends on careful water use.",
        "This is why the greenhouse is more than a food project. It is part of building stronger, more resilient community systems around children, families and local women.",
      ],
      items: [
        { badge: "food-security", label: "Food security" },
        { badge: "skills-livelihoods", label: "Skills & livelihoods" },
        { badge: "community-health", label: "Community health" },
        { badge: "education", label: "Education" },
        { badge: "safe-water", label: "Safe water" },
      ],
    },
    donation: {
      eyebrow: "Your support",
      title: "Help keep the greenhouse growing",
      intro: "Donations help keep the Greenhouse with SA Harvest active, productive and useful for the community. Your support can help provide:",
      items: [
        { icon: "Sprout", label: "Seeds and seedlings" },
        { icon: "PackageOpen", label: "Growing materials" },
        { icon: "Droplet", label: "Water and nutrient inputs" },
        { icon: "Hammer", label: "Basic tools and maintenance" },
        { icon: "GraduationCap", label: "Training and follow-up support" },
        { icon: "Truck", label: "Harvesting and distribution support" },
        { icon: "Users", label: "Local coordination" },
        { icon: "Heart", label: "Support for women working with the system" },
        { icon: "Cookie", label: "Fresh produce to supplement meals at the No.1 ECD Centre" },
        { icon: "Handshake", label: "Connection to wider food security work" },
      ],
      outro: "A donation to the greenhouse helps strengthen practical food-growing skills and supports the systems that keep fresh produce closer to vulnerable families and children.",
    },
    monthly: {
      eyebrow: "Give monthly",
      title: "Support local food growing and child nutrition",
      body: [
        "Food security needs more than once-off support. Growing food takes planning, care, materials, training and daily attention.",
        "Monthly giving helps keep the greenhouse working. It supports the practical costs that make growing possible and helps local women continue building skills through hands-on experience.",
        "It also helps strengthen the food system around the No.1 ECD Centre, where 120 children receive daily meals.",
      ],
      cardHeading: "Support food growing",
      cardAmount: "€10 / month",
      cardText: "Helps support seeds, growing materials, training, maintenance and fresh produce for the No.1 ECD Centre meal programme.",
      cta1: "Support the greenhouse monthly",
      cta2: "Give once to the Greenhouse",
    },
    closing: {
      eyebrow: "Growing resilience",
      title: "Help food and skills grow close to home",
      body: [
        "The Greenhouse with SA Harvest exists because food security is stronger when communities can also grow, learn and build skills for themselves.",
        "Your support helps keep the greenhouse productive, supports local women as they build practical growing skills and helps supplement daily meals for 120 children at the No.1 ECD Centre.",
      ],
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      all: "Explore All Projects",
    },
  },
  de: {
    back: "Alle Projekte",
    hero: {
      eyebrow: "Lebensmittel anbauen",
      title: "Greenhouse with SA Harvest",
      text:
        "Ein wassereffizientes vertikales Anbauprojekt in Cwebeni, gefördert von SA Harvest und umgesetzt in Kooperation mit Fresh Life Produce. Das Greenhouse stärkt praktische Anbaufähigkeiten lokaler Frauen und hilft zugleich, die täglichen Mahlzeiten im iThemba Kuluntu No.1 ECD Centre mit frischen Lebensmitteln zu ergänzen.",
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      location: "Cwebeni · Port St Johns · Eastern Cape · Südafrika",
      placeholder: "Hero-Video Platzhalter · bereit für echtes Greenhouse-Video",
    },
    snapshot: {
      eyebrow: "Auf einen Blick",
      title: "Lebensmittel, Fähigkeiten und Ernährung nah an der Gemeinschaft",
      body: [
        "Das Greenhouse with SA Harvest ist ein praktisches Projekt für lokalen Lebensmittelanbau und Kompetenzaufbau in Cwebeni, Port St Johns, Südafrika.",
        "Das Projekt wird von SA Harvest gefördert und in Kooperation mit Fresh Life Produce umgesetzt. Genutzt wird der African Grower, ein vertikales, wassereffizientes Anbausystem von Fresh Life Produce. Das Team von Fresh Life Produce hat lokale Frauen darin geschult, mit dem System zu arbeiten, Pflanzen zu versorgen und praktische Fähigkeiten im Anbau aufzubauen.",
        "Das Greenhouse ist direkt mit dem iThemba Kuluntu No.1 ECD Centre verbunden. Es hilft, die täglichen Mahlzeiten für 120 Kinder mit frischen Lebensmitteln zu ergänzen und stärkt so Kinderernährung, lokale Fähigkeiten und Ernährungssicherheit.",
        "Dieses Projekt ist mehr als Gemüseanbau. Es steht für lokale Lebensmittelproduktion, Ausbildung von Frauen, Ernährung, wasserschonenden Anbau, gemeinschaftliche Resilienz und die Möglichkeit, Nahrung näher an den Kindern und Familien anzubauen, die sie brauchen.",
      ],
      facts: [
        { label: "Projekt", value: "Greenhouse with SA Harvest" },
        { label: "Schwerpunkt", value: "Ernährungssicherheit, Kompetenzaufbau und lokaler Anbau" },
        { label: "Wo", value: "Cwebeni, Port St Johns, Eastern Cape, Südafrika" },
        { label: "Gefördert von", value: "SA Harvest" },
        { label: "In Kooperation mit", value: "Fresh Life Produce" },
        { label: "Anbausystem", value: "African Grower — wassereffizientes vertikales Anbausystem" },
        { label: "Schulung", value: "Lokale Frauen, geschult durch das Team von Fresh Life Produce" },
        { label: "Verbundenes Projekt", value: "iThemba Kuluntu No.1 ECD Centre · 120 Kinder" },
      ],
    },
    why: {
      eyebrow: "Warum",
      title: "lokaler Anbau wichtig ist",
      body: [
        "Ernährungsunsicherheit bedeutet nicht nur, dass zu wenig Nahrung vorhanden ist. Sie hängt auch mit Entfernung, Kosten, Zugang, Wissen, Infrastruktur und der Fähigkeit von Gemeinschaften zusammen, Lebensmittel selbst und nah am eigenen Lebensumfeld anzubauen.",
        "In ländlichen Gemeinden sind Familien oft auf Lebensmittel angewiesen, die weite Wege zurücklegen, zu teuer sind oder nicht immer verfügbar sind, wenn Haushalte sie am dringendsten brauchen. Frische, nährstoffreiche Lebensmittel sind besonders schwer dauerhaft zugänglich.",
        "Das Greenhouse with SA Harvest reagiert darauf auf praktische Weise. Es ermöglicht lokalen Anbau, bildet Frauen vor Ort aus und stärkt das Ernährungssystem rund um eine der wichtigsten täglichen Aufgaben von iThemba Kuluntu: Kinder zu ernähren.",
        "Im No.1 ECD Centre erhalten 120 Kinder täglich Mahlzeiten. Frische Lebensmittel aus dem Greenhouse helfen, diese Mahlzeiten zu ergänzen und schaffen eine direkte Verbindung zwischen lokalem Anbau, frühkindlicher Entwicklung und gemeinschaftlicher Fürsorge.",
        "Die Idee dahinter ist einfach und kraftvoll: Gemeinschaften sollten in Zeiten der Not nicht nur Lebensmittel erhalten. Sie sollten auch dabei unterstützt werden, selbst anzubauen, zu lernen und widerstandsfähigere lokale Ernährungssysteme aufzubauen.",
      ],
    },
    partnership: {
      eyebrow: "Gemeinsam",
      title: "Gefördert von SA Harvest, angebaut mit Fresh Life Produce",
      body: [
        "Dieses Greenhouse-Projekt wird durch Partnerschaft möglich.",
        "SA Harvest unterstützt das Projekt als Förderpartner und macht damit diese Möglichkeit für lokalen Lebensmittelanbau als Teil eines umfassenderen Engagements gegen Hunger und für stärkere Ernährungssysteme in Südafrika möglich.",
        "Fresh Life Produce bringt das Anbausystem und die technische Expertise ein. Das Team hat lokale Frauen darin geschult, das African Grower System zu verstehen, Pflanzen zu versorgen und praktische landwirtschaftliche Fähigkeiten aufzubauen.",
        "iThemba Kuluntu verankert das Projekt lokal in Cwebeni und verbindet das Greenhouse mit den Bedürfnissen der Gemeinschaft, der Ernährungssicherungsarbeit, dem No.1 ECD Centre und langfristiger lokaler Entwicklung.",
        "Zusammen bringt diese Partnerschaft Förderung, Technologie, Schulung und gemeindenahe Umsetzung in einem praktischen Projekt zusammen.",
      ],
      roles: [
        { name: "SA Harvest", logo: SA_HARVEST_LOGO, role: "Projektförderer und Partner für Ernährungssicherheit" },
        { name: "Fresh Life Produce", logo: FRESH_LIFE_LOGO, role: "African Grower System, technische Unterstützung und Schulungspartner" },
        { name: "iThemba Kuluntu", logo: ITHEMBA_LOGO, role: "Lokale Umsetzung, Community-Koordination und Verbindung zum No.1 ECD Centre" },
      ],
    },
    how: {
      eyebrow: "So funktioniert es",
      title: "Vertikaler Anbau, praktische Schulung und tägliche Pflege",
      body: [
        "Das Greenhouse nutzt das African Grower vertikale Anbausystem von Fresh Life Produce. Statt große Flächen zu benötigen, wächst das System in die Höhe und ermöglicht so den Anbau von mehr Pflanzen auf kleinerem Raum.",
        "Das ist besonders wichtig in Gemeinden, in denen Land, Wasser, Infrastruktur und Anbaubedingungen herausfordernd sein können. Ein kompaktes, wassereffizientes System kann helfen, einen produktiven Anbauraum zu schaffen, der organisiert, überschaubar und für lokale Schulung realistisch nutzbar ist.",
        "Fresh Life Produce hat lokale Frauen darin geschult, mit dem System zu arbeiten und die Abläufe des Anbaus zu verstehen. Dazu gehören Pflanzen, Setzlingspflege, Beobachtung der Pflanzengesundheit, Wasser- und Nährstoffmanagement, Ernte und die Instandhaltung des Greenhouses.",
        "Das Lernen ist praktisch. Frauen bauen Fähigkeiten auf, indem sie direkt mit dem System arbeiten. Die Lebensmittel, die durch diese Arbeit wachsen, helfen wiederum, Kinder zu unterstützen, die täglich im No.1 ECD Centre essen.",
      ],
      benefits: [
        "Nutzt vertikalen Raum effizient",
        "Unterstützt lokale Lebensmittelproduktion",
        "Ist auf bewussten und sparsamen Wassereinsatz ausgelegt",
        "Schafft eine strukturierte Lern- und Trainingsumgebung",
        "Baut praktische Anbaufähigkeiten auf",
        "Stärkt Lernen und Verantwortung lokaler Frauen",
        "Hilft, Mahlzeiten im No.1 ECD Centre zu ergänzen",
        "Verbindet Ernährungssicherheit mit lokalen Lebensgrundlagen",
      ],
      steps: [
        { title: "Pflanzen", text: "Saatgut und Setzlinge kommen in das vertikale African Grower System." },
        { title: "Pflegen", text: "Lokale Frauen, geschult von Fresh Life Produce, beobachten Pflanzen, Wasser und Nährstoffe." },
        { title: "Wachsen", text: "Das vertikale System nutzt Raum und Wasser effizient, während die Pflanzen reifen." },
        { title: "Ernten", text: "Frische Lebensmittel werden gepflückt und für die Kinder im No.1 ECD Centre vorbereitet." },
      ],
    },
    nutrition: {
      eyebrow: "Kinder zuerst",
      title: "Frische Lebensmittel für 120 Kinder",
      body: [
        "Das Greenhouse ist direkt mit der Ernährungssicherungsarbeit von iThemba Kuluntu und dem No.1 ECD Centre verbunden.",
        "Im No.1 ECD Centre erhalten 120 Kinder Betreuung, frühe Bildung, Spiel, Ruhe und tägliche Mahlzeiten. Das Greenhouse hilft, diese Mahlzeiten mit frischen Lebensmitteln zu ergänzen, die nah am Centre und nah an der Gemeinschaft angebaut werden.",
        "Diese Verbindung ist wichtig. Kinder brauchen regelmäßige, nährstoffreiche Mahlzeiten, um zu wachsen, zu lernen, sich zu konzentrieren und sich über den Tag hinweg sicher zu fühlen. Ein lokales Anbauprojekt kann das Ernährungssystem rund um das Centre stärken und die Abhängigkeit von Lebensmitteln verringern, die immer von weit her kommen müssen.",
        "Für iThemba Kuluntu bedeutet frühkindliche Entwicklung nicht nur Lernen im Klassenraum. Sie umfasst auch Nahrung, Sicherheit, Gesundheit, Routine und die Systeme, die den ganzen Tag eines Kindes tragen.",
        "Lebensmittelanbau, Kinderernährung und Gemeinwohl gehören zusammen.",
      ],
    },
    focus: {
      eyebrow: "Verbundene Fürsorge",
      title: "Ein Greenhouse, viele Ebenen von Wirkung",
      body: [
        "Das Greenhouse with SA Harvest verbindet mehrere Arbeitsschwerpunkte von iThemba Kuluntu in einem praktischen Projekt.",
        "Es stärkt Ernährungssicherheit, indem frische Lebensmittel nah an der Gemeinschaft angebaut werden. Es stärkt Kompetenzen und Lebensgrundlagen, indem lokale Frauen in einem praktischen Anbausystem geschult werden. Es stärkt Gemeindegesundheit durch besseren Zugang zu frischen Lebensmitteln und Ernährung. Es stärkt Bildung durch praktisches Lernen und durch die direkte Verbindung zum No.1 ECD Centre. Es ist mit sicherem Wasser verbunden, weil verantwortungsvoller Anbau bewussten Wassereinsatz braucht.",
        "Deshalb ist das Greenhouse mehr als ein Lebensmittelprojekt. Es ist Teil des Aufbaus stärkerer und widerstandsfähigerer Gemeinschaftssysteme rund um Kinder, Familien und lokale Frauen.",
      ],
      items: [
        { badge: "food-security", label: "Ernährungssicherheit" },
        { badge: "skills-livelihoods", label: "Kompetenzen & Lebensgrundlagen" },
        { badge: "community-health", label: "Gemeindegesundheit" },
        { badge: "education", label: "Bildung" },
        { badge: "safe-water", label: "Sicheres Wasser" },
      ],
    },
    donation: {
      eyebrow: "Ihre Unterstützung",
      title: "Helfen Sie, das Greenhouse wachsen zu lassen",
      intro: "Spenden helfen, das Greenhouse with SA Harvest aktiv, produktiv und nützlich für die Gemeinschaft zu halten. Ihre Unterstützung kann Folgendes ermöglichen:",
      items: [
        { icon: "Sprout", label: "Saatgut und Setzlinge" },
        { icon: "PackageOpen", label: "Anbaumaterialien" },
        { icon: "Droplet", label: "Wasser- und Nährstoffversorgung" },
        { icon: "Hammer", label: "Einfache Werkzeuge und Instandhaltung" },
        { icon: "GraduationCap", label: "Schulung und Nachbetreuung" },
        { icon: "Truck", label: "Unterstützung bei Ernte und Verteilung" },
        { icon: "Users", label: "Lokale Koordination" },
        { icon: "Heart", label: "Unterstützung für Frauen, die mit dem System arbeiten" },
        { icon: "Cookie", label: "Frische Lebensmittel zur Ergänzung der Mahlzeiten im No.1 ECD Centre" },
        { icon: "Handshake", label: "Verbindung zur weiteren Ernährungssicherungsarbeit" },
      ],
      outro: "Eine Spende für das Greenhouse stärkt praktische Fähigkeiten im Lebensmittelanbau und unterstützt Systeme, die frische Lebensmittel näher zu vulnerablen Familien und Kindern bringen.",
    },
    monthly: {
      eyebrow: "Monatlich geben",
      title: "Lokalen Lebensmittelanbau und Kinderernährung unterstützen",
      body: [
        "Ernährungssicherheit braucht mehr als einmalige Unterstützung. Lebensmittel anzubauen bedeutet Planung, Pflege, Materialien, Schulung und tägliche Aufmerksamkeit.",
        "Monatliche Spenden helfen, das Greenhouse am Laufen zu halten. Sie unterstützen die praktischen Kosten, die Anbau möglich machen, und helfen lokalen Frauen, durch direkte Erfahrung weiter Fähigkeiten aufzubauen.",
        "Sie stärken außerdem das Ernährungssystem rund um das No.1 ECD Centre, in dem 120 Kinder täglich Mahlzeiten erhalten.",
      ],
      cardHeading: "Lebensmittelanbau unterstützen",
      cardAmount: "10 € / Monat",
      cardText: "Hilft, Saatgut, Anbaumaterialien, Schulung, Instandhaltung und frische Lebensmittel für das Mahlzeitenprogramm des No.1 ECD Centre zu unterstützen.",
      cta1: "Greenhouse monatlich unterstützen",
      cta2: "Einmalig für das Greenhouse spenden",
    },
    closing: {
      eyebrow: "Resilienz wächst",
      title: "Helfen Sie, Lebensmittel und Fähigkeiten vor Ort wachsen zu lassen",
      body: [
        "Das Greenhouse with SA Harvest gibt es, weil Ernährungssicherheit stärker wird, wenn Gemeinschaften selbst anbauen, lernen und Fähigkeiten aufbauen können.",
        "Ihre Unterstützung hilft, das Greenhouse produktiv zu halten, unterstützt lokale Frauen beim Aufbau praktischer Anbaufähigkeiten und hilft, die täglichen Mahlzeiten für 120 Kinder im No.1 ECD Centre zu ergänzen.",
      ],
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      all: "Alle Projekte entdecken",
    },
  },
  nl: {
    back: "Alle projecten",
    hero: {
      eyebrow: "Voedsel verbouwen",
      title: "Greenhouse with SA Harvest",
      text:
        "Een waterefficiënt verticaal teeltproject in Cwebeni, gesponsord door SA Harvest en uitgevoerd in samenwerking met Fresh Life Produce. De kas helpt lokale vrouwen praktische teeltvaardigheden op te bouwen en levert tegelijk verse producten om de dagelijkse maaltijden in het iThemba Kuluntu No.1 ECD Centre aan te vullen.",
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      location: "Cwebeni · Port St Johns · Eastern Cape · Zuid-Afrika",
      placeholder: "Hero-video placeholder · klaar voor echte kasvideo",
    },
    snapshot: {
      eyebrow: "In één oogopslag",
      title: "Voedsel, vaardigheden en voeding dicht bij de gemeenschap",
      body: [
        "De Greenhouse with SA Harvest is een praktisch project voor lokale voedselteelt en vaardigheidsontwikkeling in Cwebeni, Port St Johns, Zuid-Afrika.",
        "Het project wordt gesponsord door SA Harvest en uitgevoerd in samenwerking met Fresh Life Produce. Er wordt gewerkt met de African Grower, een verticaal en waterefficiënt teeltsysteem van Fresh Life Produce. Het team van Fresh Life Produce heeft lokale vrouwen getraind om met het systeem te werken, de planten te verzorgen en praktische teeltvaardigheden op te bouwen.",
        "De kas is direct verbonden met het iThemba Kuluntu No.1 ECD Centre. Ze helpt de dagelijkse maaltijden voor 120 kinderen aan te vullen met verse producten en versterkt zo kindervoeding, lokale vaardigheden en voedselzekerheid.",
        "Dit project gaat over meer dan groente verbouwen. Het gaat over lokale voedselproductie, training voor vrouwen, voeding, waterbewuste teelt, gemeenschapsveerkracht en de mogelijkheid om voedsel dichter bij de kinderen en families te verbouwen die het nodig hebben.",
      ],
      facts: [
        { label: "Project", value: "Greenhouse with SA Harvest" },
        { label: "Focus", value: "Voedselzekerheid, vaardigheidsontwikkeling en lokale teelt" },
        { label: "Waar", value: "Cwebeni, Port St Johns, Eastern Cape, Zuid-Afrika" },
        { label: "Gesponsord door", value: "SA Harvest" },
        { label: "In samenwerking met", value: "Fresh Life Produce" },
        { label: "Teeltsysteem", value: "African Grower — waterefficiënt verticaal teeltsysteem" },
        { label: "Training", value: "Lokale vrouwen getraind door het team van Fresh Life Produce" },
        { label: "Verbonden project", value: "iThemba Kuluntu No.1 ECD Centre · 120 kinderen" },
      ],
    },
    why: {
      eyebrow: "Waarom",
      title: "lokale teelt belangrijk is",
      body: [
        "Voedselonzekerheid gaat niet alleen over een tekort aan voedsel. Het gaat ook over afstand, kosten, toegang, kennis, infrastructuur en het vermogen van gemeenschappen om voedsel dichtbij huis te verbouwen en in stand te houden.",
        "In landelijke gemeenschappen zijn families vaak afhankelijk van voedsel dat van ver komt, te duur is of niet altijd beschikbaar is wanneer huishoudens het het hardst nodig hebben. Verse, voedzame producten zijn vaak bijzonder moeilijk om regelmatig te verkrijgen.",
        "De Greenhouse with SA Harvest reageert hierop op een praktische manier. Het project maakt lokale teelt mogelijk, traint vrouwen uit de gemeenschap en versterkt het voedselsysteem rond een van de belangrijkste dagelijkse verantwoordelijkheden van iThemba Kuluntu: kinderen voeden.",
        "In het No.1 ECD Centre krijgen 120 kinderen dagelijks maaltijden. Verse producten uit de kas helpen deze maaltijden aan te vullen en creëren een directe verbinding tussen lokale teelt, vroege ontwikkeling en gemeenschapszorg.",
        "De gedachte daarachter is eenvoudig maar krachtig: gemeenschappen zouden in tijden van nood niet alleen voedsel moeten ontvangen. Ze moeten ook ondersteund worden om zelf te verbouwen, te leren en sterkere lokale voedselsystemen op te bouwen.",
      ],
    },
    partnership: {
      eyebrow: "Samen",
      title: "Gesponsord door SA Harvest, geteeld met Fresh Life Produce",
      body: [
        "Dit kasproject wordt mogelijk gemaakt door samenwerking.",
        "SA Harvest ondersteunt het project als sponsor en maakt zo deze kans voor lokale voedselteelt mogelijk als onderdeel van een bredere inzet tegen honger en voor sterkere voedselsystemen in Zuid-Afrika.",
        "Fresh Life Produce brengt het teeltsysteem en de technische kennis in. Hun team heeft lokale vrouwen getraind om het African Grower-systeem te begrijpen, de planten te verzorgen en praktische landbouwvaardigheden op te bouwen.",
        "iThemba Kuluntu verankert het project lokaal in Cwebeni en verbindt de kas met de behoeften van de gemeenschap, voedselzekerheidswerk, het No.1 ECD Centre en duurzame lokale ontwikkeling.",
        "Samen brengen deze partners sponsoring, technologie, training en gemeenschapsgerichte uitvoering samen in één praktisch project.",
      ],
      roles: [
        { name: "SA Harvest", logo: SA_HARVEST_LOGO, role: "Projectsponsor en partner voor voedselzekerheid" },
        { name: "Fresh Life Produce", logo: FRESH_LIFE_LOGO, role: "African Grower-systeem, technische ondersteuning en trainingspartner" },
        { name: "iThemba Kuluntu", logo: ITHEMBA_LOGO, role: "Lokale uitvoering, communitycoördinatie en verbinding met het No.1 ECD Centre" },
      ],
    },
    how: {
      eyebrow: "Zo werkt het",
      title: "Verticale teelt, praktische training en dagelijkse zorg",
      body: [
        "De kas gebruikt het African Grower verticale teeltsysteem van Fresh Life Produce. In plaats van grote stukken land nodig te hebben, groeit het systeem omhoog, waardoor er meer planten op een kleinere oppervlakte kunnen worden geteeld.",
        "Dat is belangrijk in gemeenschappen waar land, water, infrastructuur en teeltomstandigheden uitdagend kunnen zijn. Een compact, waterefficiënt systeem kan helpen om een productieve teeltruimte te creëren die georganiseerd, beheersbaar en geschikt is voor lokale training.",
        "Fresh Life Produce heeft lokale vrouwen getraind om met het systeem te werken en de dagelijkse routines van teelt te begrijpen. Dit omvat planten, zorg voor zaailingen, het monitoren van plantgezondheid, water- en voedingsbeheer, oogsten en het onderhouden van de kas.",
        "Het leren is praktisch. Vrouwen bouwen vaardigheden op door direct met het systeem te werken. De producten die door dit werk groeien, ondersteunen vervolgens de kinderen die dagelijks in het No.1 ECD Centre eten.",
      ],
      benefits: [
        "Gebruikt verticale ruimte efficiënt",
        "Ondersteunt lokale voedselproductie",
        "Is ontworpen voor zorgvuldig watergebruik",
        "Biedt een gestructureerde leer- en trainingsomgeving",
        "Bouwt praktische teeltvaardigheden op",
        "Versterkt leren en verantwoordelijkheid van lokale vrouwen",
        "Helpt maaltijden in het No.1 ECD Centre aan te vullen",
        "Verbindt voedselzekerheid met lokale bestaansmogelijkheden",
      ],
      steps: [
        { title: "Planten", text: "Zaden en zaailingen gaan in het verticale African Grower-systeem." },
        { title: "Verzorgen", text: "Lokale vrouwen, getraind door Fresh Life Produce, monitoren planten, water en voeding." },
        { title: "Groeien", text: "Het verticale systeem gebruikt ruimte en water efficiënt terwijl de planten rijpen." },
        { title: "Oogsten", text: "Verse producten worden geplukt en voorbereid voor de kinderen in het No.1 ECD Centre." },
      ],
    },
    nutrition: {
      eyebrow: "Kinderen eerst",
      title: "Verse producten voor 120 kinderen",
      body: [
        "De kas is direct verbonden met het voedselzekerheidswerk van iThemba Kuluntu en met het No.1 ECD Centre.",
        "In het No.1 ECD Centre krijgen 120 kinderen zorg, vroege ontwikkeling, spel, rust en dagelijkse maaltijden. De kas helpt deze maaltijden aan te vullen met verse producten die dichtbij het centre en dichtbij de gemeenschap worden verbouwd.",
        "Die verbinding is belangrijk. Kinderen hebben regelmatige, voedzame maaltijden nodig om te groeien, te leren, zich te concentreren en zich gedurende de dag veilig te voelen. Een lokaal teeltproject kan het voedselsysteem rond het centre versterken en de afhankelijkheid verminderen van voedsel dat altijd van ver moet komen.",
        "Voor iThemba Kuluntu gaat vroege ontwikkeling niet alleen over leren in een klaslokaal. Het gaat ook over voeding, veiligheid, gezondheid, routine en de systemen die de hele dag van een kind ondersteunen.",
        "Voedselteelt, kindervoeding en gemeenschapswelzijn horen bij elkaar.",
      ],
    },
    focus: {
      eyebrow: "Verbonden zorg",
      title: "Eén kas, meerdere lagen van impact",
      body: [
        "De Greenhouse with SA Harvest verbindt meerdere focusgebieden van iThemba Kuluntu in één praktisch project.",
        "Het project versterkt voedselzekerheid door verse producten dichtbij de gemeenschap te verbouwen. Het versterkt vaardigheden en bestaansmogelijkheden door lokale vrouwen te trainen in een praktisch teeltsysteem. Het ondersteunt gemeenschapsgezondheid door betere toegang tot verse voeding. Het versterkt educatie door praktisch leren en door de directe verbinding met het No.1 ECD Centre. Het sluit aan bij veilig water, omdat verantwoord telen zorgvuldig watergebruik vraagt.",
        "Daarom is de kas meer dan een voedselproject. Ze maakt deel uit van het opbouwen van sterkere en veerkrachtigere gemeenschapsstructuren rond kinderen, families en lokale vrouwen.",
      ],
      items: [
        { badge: "food-security", label: "Voedselzekerheid" },
        { badge: "skills-livelihoods", label: "Vaardigheden & bestaansmogelijkheden" },
        { badge: "community-health", label: "Gemeenschapsgezondheid" },
        { badge: "education", label: "Educatie" },
        { badge: "safe-water", label: "Veilig water" },
      ],
    },
    donation: {
      eyebrow: "Uw steun",
      title: "Help de kas blijven groeien",
      intro: "Donaties helpen de Greenhouse with SA Harvest actief, productief en waardevol voor de gemeenschap te houden. Uw steun kan het volgende mogelijk maken:",
      items: [
        { icon: "Sprout", label: "Zaden en zaailingen" },
        { icon: "PackageOpen", label: "Teeltmaterialen" },
        { icon: "Droplet", label: "Water- en voedingsinputs" },
        { icon: "Hammer", label: "Basisgereedschap en onderhoud" },
        { icon: "GraduationCap", label: "Training en opvolging" },
        { icon: "Truck", label: "Ondersteuning bij oogst en verdeling" },
        { icon: "Users", label: "Lokale coördinatie" },
        { icon: "Heart", label: "Ondersteuning voor vrouwen die met het systeem werken" },
        { icon: "Cookie", label: "Verse producten om maaltijden in het No.1 ECD Centre aan te vullen" },
        { icon: "Handshake", label: "Verbinding met breder voedselzekerheidswerk" },
      ],
      outro: "Een donatie aan de kas versterkt praktische voedselteeltvaardigheden en ondersteunt systemen die verse producten dichter bij kwetsbare families en kinderen brengen.",
    },
    monthly: {
      eyebrow: "Geef maandelijks",
      title: "Steun lokale voedselteelt en kindervoeding",
      body: [
        "Voedselzekerheid vraagt om meer dan eenmalige steun. Voedsel verbouwen vraagt planning, zorg, materialen, training en dagelijkse aandacht.",
        "Maandelijkse donaties helpen de kas draaiende te houden. Ze ondersteunen de praktische kosten die teelt mogelijk maken en helpen lokale vrouwen verder vaardigheden op te bouwen door directe ervaring.",
        "Ze versterken ook het voedselsysteem rond het No.1 ECD Centre, waar 120 kinderen dagelijks maaltijden ontvangen.",
      ],
      cardHeading: "Steun voedselteelt",
      cardAmount: "€10 / maand",
      cardText: "Helpt zaden, teeltmaterialen, training, onderhoud en verse producten voor het maaltijdprogramma van het No.1 ECD Centre te ondersteunen.",
      cta1: "Steun de kas maandelijks",
      cta2: "Doneer eenmalig aan de kas",
    },
    closing: {
      eyebrow: "Veerkracht laten groeien",
      title: "Help voedsel en vaardigheden dichtbij huis groeien",
      body: [
        "De Greenhouse with SA Harvest bestaat omdat voedselzekerheid sterker wordt wanneer gemeenschappen zelf kunnen verbouwen, leren en vaardigheden opbouwen.",
        "Uw steun helpt de kas productief te houden, ondersteunt lokale vrouwen bij het opbouwen van praktische teeltvaardigheden en helpt de dagelijkse maaltijden voor 120 kinderen in het No.1 ECD Centre aan te vullen.",
      ],
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      all: "Alle projecten bekijken",
    },
  },
};

/* ---------- icon registry ---------- */
const ICONS: Record<string, typeof Sprout> = {
  Sprout, Leaf, Droplet, Wrench, Users, GraduationCap, Handshake, Cookie,
  PackageOpen, Hammer, Truck, Heart, Building2, MapPin, Calendar, Award,
};

/* ---------- snapshot fact icons (index-aligned) ---------- */
const SNAPSHOT_ICONS = [Sprout, Leaf, MapPin, Award, Handshake, Wrench, GraduationCap, Building2];

function SparkleDoodle({ className = "h-5 w-5 text-[var(--ithemba-yellow)]" }) {
  return <Sparkles className={className} aria-hidden />;
}
function SunDoodle({ className = "h-8 w-8 text-[var(--ithemba-yellow)]" }) {
  return <Sun className={className} aria-hidden />;
}

/* ---------- HERO ---------- */
function Hero({ c }: { c: Copy }) {
  const reduced = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const showVideo = !reduced && !videoFailed;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {showVideo ? (
          <video
            ref={videoRef}
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
            label="Greenhouse with SA Harvest — vertical growing in Cwebeni"
            className="h-full w-full"
            rounded="rounded-none"
            tone="green"
            showMissingBadge={false}
          />
        )}
        {!showVideo && (
          <img src={FALLBACK_POSTER} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover -z-10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/85 via-[var(--ithemba-blue-dark)]/65 to-[var(--ithemba-blue)]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>

      <div className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 ring-1 ring-white/15 backdrop-blur">
        <PlayCircle className="h-3.5 w-3.5 text-[var(--ithemba-yellow)]" />
        {c.hero.placeholder}
      </div>

      {/* floating leaf accents */}
      <div className="pointer-events-none absolute left-10 top-24 text-[var(--ithemba-yellow)]/40">
        <Leaf className="h-6 w-6" />
      </div>
      <div className="pointer-events-none absolute right-20 bottom-32 text-[var(--ithemba-yellow)]/30">
        <Sprout className="h-8 w-8" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 md:pb-32 md:pt-28 lg:px-8">
        <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-white/85 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> {c.back}
        </Link>

        <div className="mt-8 max-w-3xl text-white">
          <FocusAreaBadges
            badges={["food-security", "skills-livelihoods", "community-health", "education", "safe-water"]}
            size="md"
            className="mb-5"
          />
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm flex items-center gap-2">
            <Leaf className="h-5 w-5" /> {c.hero.eyebrow}
          </div>
          <h1 className="mt-2 font-display text-[clamp(2.25rem,5.5vw,4.25rem)] font-extrabold leading-[1.02] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            {c.hero.title}
          </h1>
          <svg className="mt-4 block w-48 md:w-72" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
            <path d="M2,8 C50,2 120,14 198,6" stroke="var(--ithemba-yellow)" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/95 md:text-xl">{c.hero.text}</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 ring-1 ring-white/20 backdrop-blur">
            <Star className="h-3.5 w-3.5 text-[var(--ithemba-yellow)] fill-current" />
            {c.hero.location}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <Link to="/donate">
              <Button size="lg" className="rounded-full bg-[var(--ithemba-yellow)] font-semibold text-[var(--ithemba-brown)] shadow-lg hover:bg-[var(--ithemba-yellow)]/95">
                <Heart className="mr-2 h-4 w-4 fill-current" /> {c.hero.monthly}
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                {c.hero.once}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <svg className="block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--ithemba-cream)" />
      </svg>
    </section>
  );
}

function SectionHeading({ eyebrow, title, center = false, color = "var(--ithemba-yellow)" }: {
  eyebrow: string; title: string; center?: boolean; color?: string;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <div className="hand-eyebrow-lg" style={{ color }}>{eyebrow}</div>
      <h2 className="-mt-1 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">{title}</h2>
    </div>
  );
}

/* ---------- SNAPSHOT ---------- */
function Snapshot({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -left-10 top-10 h-44 w-44 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-52 w-52 blob-2 bg-[var(--ithemba-blue)]/15" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center">
          <SectionHeading eyebrow={c.snapshot.eyebrow} title={c.snapshot.title} center />
        </div>
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center text-lg leading-relaxed text-foreground/85">
          {c.snapshot.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {c.snapshot.facts.map((f, i) => {
            const Icon = SNAPSHOT_ICONS[i] ?? Sprout;
            return (
              <div key={f.label} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-emerald-200">
                  <Icon className="h-7 w-7 text-emerald-700" />
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/60">{f.label}</div>
                <div className="mt-1 font-display text-base font-extrabold leading-tight text-[var(--ithemba-blue-dark)]">{f.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- WHY — blue photo-backed ---------- */
function Why({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white md:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_FOOD}
          label="Fresh produce growing in the greenhouse"
          className="h-full w-full"
          rounded="rounded-none"
          tone="green"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ithemba-blue-deepest)]/70 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>
      <div className="pointer-events-none absolute left-10 top-16 text-[var(--ithemba-yellow)]/40"><Leaf className="h-7 w-7" /></div>
      <div className="pointer-events-none absolute right-16 bottom-16 text-[var(--ithemba-yellow)]/40"><Sprout className="h-8 w-8" /></div>

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
            <SparkleDoodle /> {c.why.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.why.title}</h2>
        </div>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-white/90">
          {c.why.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- PARTNERSHIP — cream with three partner cards ---------- */
function Partnership({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 blob bg-emerald-300/25" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 blob-2 bg-[var(--ithemba-yellow)]/25" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.partnership.eyebrow} title={c.partnership.title} />
        </div>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-foreground/85">
          {c.partnership.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {c.partnership.roles.map((r, i) => (
            <div
              key={r.name}
              className="relative flex flex-col items-center rounded-3xl bg-white p-7 text-center shadow-md ring-1 ring-black/5"
            >
              <div className="flex h-24 w-full items-center justify-center">
                {r.logo ? (
                  <img
                    src={r.logo}
                    alt={`${r.name} logo`}
                    className="max-h-20 max-w-[180px] object-contain"
                    loading="lazy"
                  />
                ) : (
                  <Building2 className="h-12 w-12 text-[var(--ithemba-blue)]" />
                )}
              </div>
              <div className="mt-4 font-display text-lg font-bold text-[var(--ithemba-blue-dark)]">{r.name}</div>
              <div className="mt-2 text-sm leading-snug text-foreground/75">{r.role}</div>
              {i < c.partnership.roles.length - 1 && (
                <div className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 md:block">
                  <div className="h-6 w-6 rotate-45 rounded-md bg-[var(--ithemba-yellow)]/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- HOW IT WORKS — blue photo-backed with flow ---------- */
function HowItWorks({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white md:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_MAIN}
          label="African Grower vertical growing system in the greenhouse"
          className="h-full w-full"
          rounded="rounded-none"
          tone="green"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
        <div className="absolute right-[-6rem] bottom-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
            <SparkleDoodle /> {c.how.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.how.title}</h2>
        </div>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="space-y-4 text-lg leading-relaxed text-white/90">
            {c.how.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <ul className="grid grid-cols-1 gap-2 self-start sm:grid-cols-2">
            {c.how.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 rounded-2xl bg-white/10 p-3 text-sm text-white/95 ring-1 ring-white/15 backdrop-blur">
                <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ithemba-yellow)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* growing flow */}
        <div className="mt-14">
          <div className="grid gap-4 md:grid-cols-4">
            {c.how.steps.map((s, i) => (
              <div key={s.title} className="relative rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] font-display text-base font-extrabold">
                    {i + 1}
                  </div>
                  <div className="font-display text-lg font-bold text-white">{s.title}</div>
                </div>
                <p className="mt-3 text-sm leading-snug text-white/85">{s.text}</p>
                {i < c.how.steps.length - 1 && (
                  <ArrowDown className="absolute -bottom-3 right-6 hidden h-5 w-5 rotate-[-90deg] text-[var(--ithemba-yellow)] md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- NUTRITION ---------- */
function Nutrition({ c }: { c: Copy }) {
  return (
    <section className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 lg:px-8">
      <div className="relative">
        <div className="absolute -right-8 -top-8 h-28 w-28 blob bg-[var(--ithemba-yellow)]/40 -z-10" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 blob-2 bg-emerald-300/30 -z-10" />
        <SmartImage
          src={PHOTO_MEAL}
          label="Fresh produce supplementing daily meals at the No.1 ECD Centre"
          className="aspect-[4/5] w-full"
          rounded="rounded-[2.5rem]"
          tone="warm"
          showMissingBadge={false}
        />
      </div>
      <div className="flex flex-col justify-center">
        <SectionHeading eyebrow={c.nutrition.eyebrow} title={c.nutrition.title} />
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
          {c.nutrition.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <Sprout className="h-4 w-4" /> 120 children
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ithemba-yellow)]/25 px-3 py-1.5 text-sm font-semibold text-[var(--ithemba-brown)]">
            <Cookie className="h-4 w-4" /> Daily meals
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-700">
            <Building2 className="h-4 w-4" /> No.1 ECD Centre
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOCUS — blue photo-backed ---------- */
function Focus({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white md:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_WOMEN}
          label="Local women training and working with the African Grower system"
          className="h-full w-full"
          rounded="rounded-none"
          tone="ocean"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
        <div className="absolute left-[-6rem] top-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
            <SparkleDoodle /> {c.focus.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.focus.title}</h2>
        </div>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-white/90">
          {c.focus.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {c.focus.items.map((it) => {
            const meta = focusAreaBadgeMeta[it.badge];
            return (
              <div key={it.badge} className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center md:h-24 md:w-24">
                  <img
                    src={meta.src}
                    alt={meta.label}
                    className="h-full w-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 text-sm font-semibold leading-snug text-white">{it.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- DONATION SUPPORT ITEMS — cream ---------- */
function DonationSupport({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 blob-2 bg-emerald-300/25" />
      <div className="pointer-events-none absolute -left-16 bottom-16 h-48 w-48 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.donation.eyebrow} title={c.donation.title} />
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">{c.donation.intro}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
          {c.donation.items.map((it) => {
            const Icon = ICONS[it.icon] ?? Sprout;
            return (
              <div key={it.label} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-emerald-200 md:h-20 md:w-20">
                  <Icon className="h-7 w-7 text-emerald-700 md:h-8 md:w-8" />
                </div>
                <div className="mt-3 text-sm font-medium leading-snug text-[var(--ithemba-blue-dark)]">{it.label}</div>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-12 max-w-3xl text-center text-base leading-relaxed text-foreground/75">{c.donation.outro}</p>
      </div>
    </section>
  );
}

/* ---------- MONTHLY (with widget) ---------- */
function Monthly({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_WOMEN}
          label="Support the greenhouse monthly"
          className="h-full w-full"
          rounded="rounded-none"
          tone="green"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/80 to-[var(--ithemba-blue-dark)]/45" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:px-8">
        <div className="text-white">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)]">{c.monthly.eyebrow}</div>
          <h2 className="-mt-1 font-display text-4xl font-extrabold md:text-5xl">{c.monthly.title}</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-white/90">
            {c.monthly.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className="mt-7 rounded-3xl bg-[var(--ithemba-yellow)] p-6 text-[var(--ithemba-brown)] shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wide opacity-80">{c.monthly.cardHeading}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <Sprout className="h-6 w-6" />
              <div className="font-display text-3xl font-extrabold">{c.monthly.cardAmount}</div>
            </div>
            <p className="mt-2 text-sm font-medium">{c.monthly.cardText}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/donate">
                <Button className="rounded-full bg-[var(--ithemba-brown)] font-semibold text-white hover:bg-[var(--ithemba-brown)]/90">
                  <Heart className="mr-2 h-4 w-4 fill-current" /> {c.monthly.cta1}
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="outline" className="rounded-full border-[var(--ithemba-brown)]/40 bg-white/40 text-[var(--ithemba-brown)] hover:bg-white/60">
                  {c.monthly.cta2}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <DonationWidget defaultProject="Food Security" />
      </div>
    </section>
  );
}

/* ---------- CLOSING ---------- */
function Closing({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ithemba-blue-deepest)] via-[var(--ithemba-blue-dark)] to-[var(--ithemba-blue)] py-20 text-white">
      <div className="pointer-events-none absolute right-[-6rem] top-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      <div className="pointer-events-none absolute left-10 top-10">
        <SunDoodle className="h-12 w-12 text-[var(--ithemba-yellow)]/60" />
      </div>
      <div className="pointer-events-none absolute right-10 bottom-10">
        <Sprout className="h-9 w-9 text-[var(--ithemba-yellow)]/70" />
      </div>
      <div className="pointer-events-none absolute left-16 bottom-16">
        <Leaf className="h-7 w-7 text-[var(--ithemba-yellow)]/50" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-8">
        <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)]">{c.closing.eyebrow}</div>
        <h2 className="-mt-1 font-display text-4xl font-extrabold md:text-5xl">{c.closing.title}</h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-white/90">
          {c.closing.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Link to="/donate">
            <Button size="lg" className="rounded-full bg-[var(--ithemba-yellow)] font-semibold text-[var(--ithemba-brown)] shadow-lg hover:bg-[var(--ithemba-yellow)]/95">
              <Heart className="mr-2 h-4 w-4 fill-current" /> {c.closing.monthly}
            </Button>
          </Link>
          <Link to="/donate">
            <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              {c.closing.once}
            </Button>
          </Link>
          <Link to="/projects">
            <Button size="lg" variant="ghost" className="rounded-full text-white hover:bg-white/10 hover:text-white">
              {c.closing.all}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- PAGE ---------- */
function GreenhousePage() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.en;
  return (
    <>
      <Hero c={c} />
      <Snapshot c={c} />
      <Why c={c} />
      <Partnership c={c} />
      <HowItWorks c={c} />
      <Nutrition c={c} />
      <Focus c={c} />
      <DonationSupport c={c} />
      <Monthly c={c} />
      <Closing c={c} />
    </>
  );
}
