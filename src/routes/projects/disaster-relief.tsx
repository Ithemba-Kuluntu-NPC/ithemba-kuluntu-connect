import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Sun,
  Users,
  MapPin,
  Building2,
  Truck,
  PlayCircle,
  Star,
  HandHeart,
  ShieldAlert,
  Package,
  Flame,
  Home,
  Droplets,
  Stethoscope,
  Footprints,
  Accessibility,
  Shirt,
  Bed,
  LifeBuoy,
  Compass,
  Utensils,
} from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { SmartImage } from "@/components/site/Asset";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { FocusAreaBadges } from "@/components/blocks/FocusAreaBadges";
import { ImpactCounters } from "@/components/blocks/ImpactCounters";
import { assets } from "@/data/assets";
import { focusAreaBadgeMeta } from "@/data/projects";
import type { Lang } from "@/data/content";

export const Route = createFileRoute("/projects/disaster-relief")({ component: DisasterReliefPage });

/* ---------- assets ---------- */
const HERO_VIDEO = "/assets/videos/projects/disaster-relief-hero.mp4";
const HERO_POSTER = "/assets/photos/projects/disaster-relief-hero-poster.jpg";
const FALLBACK_POSTER = assets.photos.projects.disasterReliefHero;
const PHOTO_SUPPORT = assets.photos.disasterRelief.support;
const PHOTO_SUPPLIES = assets.photos.disasterRelief.supplies;

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

/* ---------- content types ---------- */
type Fact = { label: string; value: string };
type IconItem = { icon: string; label: string };
type FocusItem = {
  badge:
    | "disaster-relief"
    | "food-security"
    | "safe-water"
    | "education"
    | "skills-livelihoods"
    | "community-health";
  label: string;
};

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
  snapshot: { eyebrow: string; title: string; body: string[]; facts: Fact[] };
  why: { eyebrow: string; title: string; body: string[] };
  provide: { eyebrow: string; title: string; intro: string; items: IconItem[]; outro: string };
  respond: { eyebrow: string; title: string; body: string[] };
  focus: { eyebrow: string; title: string; body: string[]; items: FocusItem[] };
  donation: { eyebrow: string; title: string; intro: string; items: IconItem[]; outro: string };
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
  impact: {
    title: string;
    items: {
      value: number;
      suffix: string;
      iconSrc?: string;
      label: { en: string; de: string; nl?: string };
    }[];
  };
  closing: { eyebrow: string; title: string; body: string[]; monthly: string; once: string; all: string };
};

/* ---------- COPY (verbatim from /public/content/projects/disaster-relief-*-v1-1.txt) ---------- */
const COPY: Record<Lang, Copy> = {
  en: {
    back: "All projects",
    hero: {
      eyebrow: "Disaster Relief",
      title: "Disaster Relief",
      text:
        "Practical emergency support for families in Cwebeni and surrounding communities when crisis hits, from floods, fires and sudden hardship to urgent household needs, medical situations and recovery support.",
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      location: "Cwebeni · Port St Johns · Eastern Cape · South Africa",
      placeholder: "Hero video placeholder · ready for real Disaster Relief video",
    },
    snapshot: {
      eyebrow: "At a glance",
      title: "Practical help when families need it most",
      body: [
        "Disaster Relief is iThemba Kuluntu’s response to urgent hardship in the communities we work with.",
        "In rural communities, a crisis can become overwhelming quickly. A flood, fire, illness, accident, loss of income or sudden family emergency can leave households without food, bedding, transport, basic supplies or a safe way to recover.",
        "Our response is practical and community-rooted. We work with local knowledge, trusted relationships and direct support to help families through the most urgent moments.",
      ],
      facts: [
        { label: "Project", value: "Disaster Relief" },
        { label: "Focus", value: "Emergency support for families facing crisis or sudden hardship" },
        { label: "Where", value: "Cwebeni, Port St Johns, Eastern Cape, South Africa" },
        { label: "Core support", value: "Food, blankets, mattresses, school shoes, wheelchairs, emergency supplies and practical recovery support" },
        { label: "How we respond", value: "Through local coordination, household-level support and direct practical assistance" },
        { label: "Donation focus", value: "Helping families recover from crisis with dignity and practical care" },
      ],
    },
    why: {
      eyebrow: "Why",
      title: "emergency support matters",
      body: [
        "For many families, there is no safety net when crisis hits.",
        "A fire can destroy household belongings in one night. Heavy rain or flooding can damage homes and cut families off from support. A medical situation can create urgent transport or care needs. A child may need school shoes. A caregiver may need a mattress, blankets or basic supplies to restore dignity at home.",
        "Disaster Relief exists because practical help matters in the first difficult days after a crisis. It helps families breathe, stabilise and begin again.",
        "This work is not about creating dependency. It is about standing with families when the pressure is too heavy to carry alone.",
      ],
    },
    provide: {
      eyebrow: "Practical care",
      title: "Support that responds to real needs",
      intro: "Disaster Relief support depends on the situation and the needs of each household. Support may include:",
      items: [
        { icon: "Utensils", label: "Emergency food support" },
        { icon: "Bed", label: "Blankets" },
        { icon: "Mattress", label: "Mattresses" },
        { icon: "Footprints", label: "School shoes" },
        { icon: "Accessibility", label: "Wheelchairs" },
        { icon: "Shirt", label: "Clothing or basic household supplies" },
        { icon: "Truck", label: "Transport or coordination support" },
        { icon: "Flame", label: "Support after floods, fires or sudden hardship" },
        { icon: "Stethoscope", label: "Help for families facing urgent medical or care-related needs" },
      ],
      outro:
        "The support is simple, direct and practical. It is shaped by what families actually need, not by a one-size-fits-all response.",
    },
    respond: {
      eyebrow: "Local trust",
      title: "Fast help through local knowledge",
      body: [
        "Disaster Relief works because iThemba Kuluntu is present in the community.",
        "Our local team understands the area, the families and the situations that create urgent need. This makes it possible to respond quickly, identify real priorities and support households in a respectful way.",
        "We do not respond from a distance. We respond through relationships, local coordination and practical follow-up where possible.",
        "This local trust helps ensure that support reaches families who need it most.",
      ],
    },
    focus: {
      eyebrow: "Connected care",
      title: "Emergency support touches every part of family life",
      body: [
        "Disaster Relief connects to several iThemba Kuluntu focus areas.",
        "A crisis often affects more than one part of life. Food may be needed first. Safe water may become urgent. Children may need school supplies to return to learning. A family may need basic household items to sleep safely again. Health, dignity and stability are all connected.",
        "This is why Disaster Relief is part of iThemba Kuluntu’s wider community care. It helps families move from immediate crisis toward recovery.",
      ],
      items: [
        { badge: "disaster-relief", label: "Disaster relief" },
        { badge: "food-security", label: "Food security" },
        { badge: "safe-water", label: "Safe water" },
        { badge: "education", label: "Education" },
        { badge: "skills-livelihoods", label: "Skills & livelihoods" },
        { badge: "community-health", label: "Community health" },
      ],
    },
    donation: {
      eyebrow: "Your support",
      title: "Help families recover with dignity",
      intro: "Donations help iThemba Kuluntu respond when families face urgent hardship. Your support can help provide:",
      items: [
        { icon: "Utensils", label: "Food for households in crisis" },
        { icon: "Bed", label: "Blankets and mattresses" },
        { icon: "Footprints", label: "School shoes for children" },
        { icon: "Accessibility", label: "Wheelchairs and mobility support" },
        { icon: "Package", label: "Emergency household supplies" },
        { icon: "Truck", label: "Transport and delivery support" },
        { icon: "Flame", label: "Support after floods, fires or sudden hardship" },
        { icon: "Compass", label: "Local coordination and follow-up" },
      ],
      outro:
        "A donation to Disaster Relief helps provide practical care at the moment it is needed most. It helps families recover with dignity, stability and support from people who know the community.",
    },
    monthly: {
      eyebrow: "Give monthly",
      title: "Help us respond when crisis hits",
      body: [
        "Emergency needs are often unpredictable, but the ability to respond should not be.",
        "Monthly giving helps iThemba Kuluntu stay ready. It allows us to keep practical support moving when families suddenly face floods, fires, illness, accidents or urgent hardship.",
      ],
      cardHeading: "Support emergency relief",
      cardAmount: "€10 / month",
      cardText:
        "Helps provide emergency food, blankets, mattresses, school shoes, mobility support and practical care for families in crisis.",
      cta1: "Support disaster relief monthly",
      cta2: "Give once to Disaster Relief",
    },
    impact: {
      title: "What your support helps make possible",
      items: [
        { value: 600, suffix: "+", iconSrc: "/assets/icons/impact/impact-mattresses.png", label: { en: "Mattresses distributed", de: "Matratzen verteilt", nl: "Matrassen verdeeld" } },
        { value: 2100, suffix: "+", iconSrc: "/assets/icons/impact/impact-blankets.png", label: { en: "Blankets distributed", de: "Decken verteilt", nl: "Dekens verdeeld" } },
        { value: 114, suffix: "", iconSrc: "/assets/icons/impact/impact-wheelchairs.png", label: { en: "Wheelchairs distributed", de: "Rollstühle verteilt", nl: "Rolstoelen verdeeld" } },
        { value: 1300, suffix: "+", iconSrc: "/assets/icons/impact/impact-school-shoes.png", label: { en: "School shoes distributed", de: "Schulschuhe verteilt", nl: "Schoolschoenen verdeeld" } },
      ],
    },
    closing: {
      eyebrow: "When crisis hits",
      title: "Help families begin again",
      body: [
        "Disaster Relief exists because families should not face crisis alone.",
        "Your support helps provide practical emergency care when households are overwhelmed, and helps families take the first steps from crisis toward recovery.",
      ],
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      all: "Explore All Projects",
    },
  },

  de: {
    back: "Alle Projekte",
    hero: {
      eyebrow: "Katastrophenhilfe",
      title: "Disaster Relief",
      text:
        "Praktische Nothilfe für Familien in Cwebeni und den umliegenden Gemeinden, wenn Krisen eintreten, von Überschwemmungen, Bränden und plötzlicher Not bis hin zu dringenden Haushaltsbedarfen, medizinischen Situationen und Unterstützung beim Wiederaufbau.",
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      location: "Cwebeni · Port St Johns · Eastern Cape · Südafrika",
      placeholder: "Hero-Video Platzhalter · bereit für echtes Disaster Relief-Video",
    },
    snapshot: {
      eyebrow: "Auf einen Blick",
      title: "Praktische Hilfe, wenn Familien sie am dringendsten brauchen",
      body: [
        "Disaster Relief ist die Nothilfe von iThemba Kuluntu für akute Notlagen in den Gemeinden, in denen wir arbeiten.",
        "In ländlichen Gemeinden kann eine Krise sehr schnell überwältigend werden. Eine Überschwemmung, ein Brand, eine Krankheit, ein Unfall, der Verlust von Einkommen oder eine plötzliche familiäre Notlage kann dazu führen, dass Haushalte ohne Lebensmittel, Bettzeug, Transport, grundlegende Versorgung oder eine sichere Möglichkeit zur Erholung dastehen.",
        "Unsere Hilfe ist praktisch und gemeindenah. Wir arbeiten mit lokalem Wissen, vertrauensvollen Beziehungen und direkter Unterstützung, um Familien in den dringendsten Momenten beizustehen.",
      ],
      facts: [
        { label: "Projekt", value: "Disaster Relief" },
        { label: "Schwerpunkt", value: "Nothilfe für Familien in Krisen oder plötzlichen Notlagen" },
        { label: "Wo", value: "Cwebeni, Port St Johns, Eastern Cape, Südafrika" },
        { label: "Kernunterstützung", value: "Lebensmittel, Decken, Matratzen, Schulschuhe, Rollstühle, Notfallversorgung und praktische Unterstützung beim Wiederaufbau" },
        { label: "So reagieren wir", value: "Durch lokale Koordination, direkte Unterstützung auf Haushaltsebene und praktische Hilfe" },
        { label: "Spendenfokus", value: "Familien helfen, Krisen mit Würde und praktischer Unterstützung zu bewältigen" },
      ],
    },
    why: {
      eyebrow: "Warum",
      title: "Nothilfe wichtig ist",
      body: [
        "Für viele Familien gibt es kein Sicherheitsnetz, wenn eine Krise eintritt.",
        "Ein Brand kann den Besitz eines Haushalts in einer Nacht zerstören. Starker Regen oder Überschwemmungen können Häuser beschädigen und Familien von Unterstützung abschneiden. Eine medizinische Situation kann plötzlich Transport, Versorgung oder besondere Hilfe notwendig machen. Ein Kind braucht vielleicht Schulschuhe. Eine Betreuungsperson braucht möglicherweise eine Matratze, Decken oder grundlegende Haushaltsgegenstände, um zu Hause wieder Würde und Sicherheit herzustellen.",
        "Disaster Relief gibt es, weil praktische Hilfe in den ersten schwierigen Tagen nach einer Krise entscheidend ist. Sie hilft Familien, durchzuatmen, sich zu stabilisieren und wieder einen Anfang zu finden.",
        "Diese Arbeit schafft keine Abhängigkeit. Sie bedeutet, Familien beizustehen, wenn die Belastung zu schwer ist, um sie allein zu tragen.",
      ],
    },
    provide: {
      eyebrow: "Praktische Fürsorge",
      title: "Hilfe, die auf reale Bedarfe reagiert",
      intro: "Die Unterstützung durch Disaster Relief richtet sich nach der jeweiligen Situation und den konkreten Bedürfnissen eines Haushalts. Sie kann umfassen:",
      items: [
        { icon: "Utensils", label: "Lebensmittelhilfe in Notlagen" },
        { icon: "Bed", label: "Decken" },
        { icon: "Bed", label: "Matratzen" },
        { icon: "Footprints", label: "Schulschuhe" },
        { icon: "Accessibility", label: "Rollstühle" },
        { icon: "Shirt", label: "Kleidung oder grundlegende Haushaltsgegenstände" },
        { icon: "Truck", label: "Transport- oder Koordinationsunterstützung" },
        { icon: "Flame", label: "Hilfe nach Überschwemmungen, Bränden oder plötzlicher Not" },
        { icon: "Stethoscope", label: "Unterstützung für Familien mit dringenden medizinischen oder pflegebezogenen Bedarfen" },
      ],
      outro:
        "Die Hilfe ist einfach, direkt und praktisch. Sie richtet sich danach, was Familien tatsächlich brauchen, nicht nach einer pauschalen Einheitslösung.",
    },
    respond: {
      eyebrow: "Lokales Vertrauen",
      title: "Schnelle Hilfe durch lokale Kenntnis",
      body: [
        "Disaster Relief funktioniert, weil iThemba Kuluntu in der Gemeinschaft präsent ist.",
        "Unser lokales Team kennt die Region, die Familien und die Situationen, die akute Not entstehen lassen. Dadurch können wir schnell reagieren, echte Prioritäten erkennen und Haushalte respektvoll unterstützen.",
        "Wir helfen nicht aus der Distanz. Wir reagieren über Beziehungen, lokale Koordination und, wo möglich, praktische Nachbetreuung.",
        "Dieses lokale Vertrauen hilft sicherzustellen, dass Unterstützung dort ankommt, wo sie am dringendsten gebraucht wird.",
      ],
    },
    focus: {
      eyebrow: "Verbundene Fürsorge",
      title: "Nothilfe berührt jeden Bereich des Familienlebens",
      body: [
        "Disaster Relief ist mit mehreren Arbeitsschwerpunkten von iThemba Kuluntu verbunden.",
        "Eine Krise betrifft oft mehr als nur einen Lebensbereich. Lebensmittel werden möglicherweise zuerst gebraucht. Sicheres Wasser kann dringend werden. Kinder benötigen Schulmaterialien, um wieder lernen zu können. Eine Familie braucht vielleicht grundlegende Haushaltsgegenstände, um wieder sicher schlafen zu können. Gesundheit, Würde und Stabilität hängen zusammen.",
        "Deshalb ist Disaster Relief Teil der breiteren gemeindenahen Fürsorge von iThemba Kuluntu. Es hilft Familien, von der akuten Krise in Richtung Stabilisierung und Erholung zu gehen.",
      ],
      items: [
        { badge: "disaster-relief", label: "Katastrophenhilfe" },
        { badge: "food-security", label: "Ernährungssicherheit" },
        { badge: "safe-water", label: "Sicheres Wasser" },
        { badge: "education", label: "Bildung" },
        { badge: "skills-livelihoods", label: "Kompetenzen & Lebensgrundlagen" },
        { badge: "community-health", label: "Gemeindegesundheit" },
      ],
    },
    donation: {
      eyebrow: "Ihre Unterstützung",
      title: "Helfen Sie Familien, sich mit Würde zu erholen",
      intro: "Spenden helfen iThemba Kuluntu, Familien in akuten Notlagen zu unterstützen. Ihre Unterstützung kann helfen, Folgendes bereitzustellen:",
      items: [
        { icon: "Utensils", label: "Lebensmittel für Haushalte in Krisen" },
        { icon: "Bed", label: "Decken und Matratzen" },
        { icon: "Footprints", label: "Schulschuhe für Kinder" },
        { icon: "Accessibility", label: "Rollstühle und Mobilitätsunterstützung" },
        { icon: "Package", label: "Notfallbedarf für Haushalte" },
        { icon: "Truck", label: "Transport- und Lieferunterstützung" },
        { icon: "Flame", label: "Hilfe nach Überschwemmungen, Bränden oder plötzlicher Not" },
        { icon: "Compass", label: "Lokale Koordination und Nachbetreuung" },
      ],
      outro:
        "Eine Spende für Disaster Relief hilft, praktische Unterstützung genau dann bereitzustellen, wenn sie am dringendsten gebraucht wird. Sie hilft Familien, sich mit Würde, Stabilität und Unterstützung von Menschen zu erholen, die die Gemeinschaft kennen.",
    },
    monthly: {
      eyebrow: "Monatlich geben",
      title: "Helfen Sie uns, zu reagieren, wenn Krisen eintreten",
      body: [
        "Notlagen sind oft unvorhersehbar. Die Fähigkeit zu helfen sollte es nicht sein.",
        "Monatliche Spenden helfen iThemba Kuluntu, einsatzbereit zu bleiben. Sie ermöglichen es, praktische Unterstützung aufrechtzuerhalten, wenn Familien plötzlich von Überschwemmungen, Bränden, Krankheit, Unfällen oder akuter Not betroffen sind.",
      ],
      cardHeading: "Nothilfe unterstützen",
      cardAmount: "10 € / Monat",
      cardText:
        "Hilft, Lebensmittel in Notlagen, Decken, Matratzen, Schulschuhe, Mobilitätsunterstützung und praktische Hilfe für Familien in Krisen bereitzustellen.",
      cta1: "Katastrophenhilfe monatlich unterstützen",
      cta2: "Einmalig für Disaster Relief spenden",
    },
    impact: {
      title: "Was Ihre Unterstützung möglich macht",
      items: [
        { value: 600, suffix: "+", iconSrc: "/assets/icons/impact/impact-mattresses.png", label: { en: "Mattresses distributed", de: "Matratzen verteilt", nl: "Matrassen verdeeld" } },
        { value: 2100, suffix: "+", iconSrc: "/assets/icons/impact/impact-blankets.png", label: { en: "Blankets distributed", de: "Decken verteilt", nl: "Dekens verdeeld" } },
        { value: 114, suffix: "", iconSrc: "/assets/icons/impact/impact-wheelchairs.png", label: { en: "Wheelchairs distributed", de: "Rollstühle verteilt", nl: "Rolstoelen verdeeld" } },
        { value: 1300, suffix: "+", iconSrc: "/assets/icons/impact/impact-school-shoes.png", label: { en: "School shoes distributed", de: "Schulschuhe verteilt", nl: "Schoolschoenen verdeeld" } },
      ],
    },
    closing: {
      eyebrow: "Wenn Krisen eintreten",
      title: "Helfen Sie Familien, wieder anzufangen",
      body: [
        "Disaster Relief gibt es, weil Familien Krisen nicht allein bewältigen sollten.",
        "Ihre Unterstützung hilft, praktische Nothilfe bereitzustellen, wenn Haushalte überfordert sind, und ermöglicht Familien die ersten Schritte aus der Krise hin zu Stabilität und Erholung.",
      ],
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      all: "Alle Projekte entdecken",
    },
  },

  nl: {
    back: "Alle projecten",
    hero: {
      eyebrow: "Noodhulp",
      title: "Disaster Relief",
      text:
        "Praktische noodhulp voor families in Cwebeni en omliggende gemeenschappen wanneer een crisis toeslaat, van overstromingen, branden en plotselinge nood tot dringende huishoudelijke behoeften, medische situaties en ondersteuning bij herstel.",
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      location: "Cwebeni · Port St Johns · Eastern Cape · Zuid-Afrika",
      placeholder: "Hero-video placeholder · klaar voor echte Disaster Relief-video",
    },
    snapshot: {
      eyebrow: "In één oogopslag",
      title: "Praktische hulp wanneer families die het hardst nodig hebben",
      body: [
        "Disaster Relief is de noodhulp van iThemba Kuluntu voor acute crisissituaties in de gemeenschappen waar wij werken.",
        "In landelijke gemeenschappen kan een crisis snel overweldigend worden. Een overstroming, brand, ziekte, ongeval, inkomensverlies of plotselinge familiesituatie kan ertoe leiden dat huishoudens zonder voedsel, beddengoed, vervoer, basisbenodigdheden of een veilige manier om te herstellen achterblijven.",
        "Onze hulp is praktisch en gemeenschapsgericht. We werken met lokale kennis, vertrouwde relaties en directe ondersteuning om families door de meest urgente momenten heen te helpen.",
      ],
      facts: [
        { label: "Project", value: "Disaster Relief" },
        { label: "Focus", value: "Noodhulp voor families in crisis of plotselinge noodsituaties" },
        { label: "Waar", value: "Cwebeni, Port St Johns, Eastern Cape, Zuid-Afrika" },
        { label: "Kernondersteuning", value: "Voedsel, dekens, matrassen, schoolschoenen, rolstoelen, noodbenodigdheden en praktische herstelondersteuning" },
        { label: "Hoe we reageren", value: "Via lokale coördinatie, directe ondersteuning op huishoudniveau en praktische hulp" },
        { label: "Donatiefocus", value: "Families helpen herstellen van crisis met waardigheid en praktische zorg" },
      ],
    },
    why: {
      eyebrow: "Waarom",
      title: "noodhulp belangrijk is",
      body: [
        "Voor veel families bestaat er geen vangnet wanneer een crisis toeslaat.",
        "Een brand kan in één nacht bezittingen van een huishouden vernietigen. Hevige regen of overstroming kan huizen beschadigen en families afsluiten van ondersteuning. Een medische situatie kan plotseling vervoer, zorg of praktische hulp noodzakelijk maken. Een kind kan schoolschoenen nodig hebben. Een verzorger kan een matras, dekens of basisbenodigdheden nodig hebben om thuis weer veiligheid en waardigheid te herstellen.",
        "Disaster Relief bestaat omdat praktische hulp in de eerste moeilijke dagen na een crisis van groot belang is. Het helpt families ademhalen, stabiliseren en opnieuw beginnen.",
        "Dit werk gaat niet over afhankelijkheid creëren. Het gaat over naast families staan wanneer de druk te zwaar is om alleen te dragen.",
      ],
    },
    provide: {
      eyebrow: "Praktische zorg",
      title: "Hulp die aansluit bij echte behoeften",
      intro: "De ondersteuning vanuit Disaster Relief hangt af van de situatie en van wat een huishouden op dat moment nodig heeft. Ondersteuning kan omvatten:",
      items: [
        { icon: "Utensils", label: "Noodvoedselhulp" },
        { icon: "Bed", label: "Dekens" },
        { icon: "Bed", label: "Matrassen" },
        { icon: "Footprints", label: "Schoolschoenen" },
        { icon: "Accessibility", label: "Rolstoelen" },
        { icon: "Shirt", label: "Kleding of basisbenodigdheden voor het huishouden" },
        { icon: "Truck", label: "Ondersteuning bij vervoer of coördinatie" },
        { icon: "Flame", label: "Hulp na overstromingen, branden of plotselinge nood" },
        { icon: "Stethoscope", label: "Ondersteuning voor families met urgente medische of zorggerelateerde behoeften" },
      ],
      outro:
        "De hulp is eenvoudig, direct en praktisch. Ze wordt gevormd door wat families werkelijk nodig hebben, niet door een standaardoplossing die voor iedereen hetzelfde is.",
    },
    respond: {
      eyebrow: "Lokaal vertrouwen",
      title: "Snelle hulp door lokale kennis",
      body: [
        "Disaster Relief werkt omdat iThemba Kuluntu aanwezig is in de gemeenschap.",
        "Ons lokale team kent het gebied, de families en de situaties waardoor acute nood kan ontstaan. Daardoor kunnen we snel reageren, echte prioriteiten herkennen en huishoudens op een respectvolle manier ondersteunen.",
        "We reageren niet vanop afstand. We reageren via relaties, lokale coördinatie en, waar mogelijk, praktische opvolging.",
        "Dit lokale vertrouwen helpt ervoor te zorgen dat ondersteuning terechtkomt bij families die haar het hardst nodig hebben.",
      ],
    },
    focus: {
      eyebrow: "Verbonden zorg",
      title: "Noodhulp raakt elk deel van het gezinsleven",
      body: [
        "Disaster Relief sluit aan bij verschillende focusgebieden van iThemba Kuluntu.",
        "Een crisis raakt vaak meer dan één onderdeel van het leven. Voedsel kan als eerste nodig zijn. Veilig water kan urgent worden. Kinderen kunnen schoolbenodigdheden nodig hebben om weer te kunnen leren. Een familie heeft misschien basisbenodigdheden nodig om weer veilig te kunnen slapen. Gezondheid, waardigheid en stabiliteit hangen met elkaar samen.",
        "Daarom is Disaster Relief onderdeel van de bredere gemeenschapsgerichte zorg van iThemba Kuluntu. Het helpt families van acute crisis richting stabiliteit en herstel te bewegen.",
      ],
      items: [
        { badge: "disaster-relief", label: "Noodhulp" },
        { badge: "food-security", label: "Voedselzekerheid" },
        { badge: "safe-water", label: "Veilig water" },
        { badge: "education", label: "Educatie" },
        { badge: "skills-livelihoods", label: "Vaardigheden & bestaansmogelijkheden" },
        { badge: "community-health", label: "Gemeenschapsgezondheid" },
      ],
    },
    donation: {
      eyebrow: "Uw steun",
      title: "Help families met waardigheid herstellen",
      intro: "Donaties helpen iThemba Kuluntu om families in acute noodsituaties te ondersteunen. Uw steun kan helpen om het volgende mogelijk te maken:",
      items: [
        { icon: "Utensils", label: "Voedsel voor huishoudens in crisis" },
        { icon: "Bed", label: "Dekens en matrassen" },
        { icon: "Footprints", label: "Schoolschoenen voor kinderen" },
        { icon: "Accessibility", label: "Rolstoelen en mobiliteitsondersteuning" },
        { icon: "Package", label: "Noodbenodigdheden voor huishoudens" },
        { icon: "Truck", label: "Ondersteuning bij vervoer en levering" },
        { icon: "Flame", label: "Hulp na overstromingen, branden of plotselinge nood" },
        { icon: "Compass", label: "Lokale coördinatie en opvolging" },
      ],
      outro:
        "Een donatie aan Disaster Relief helpt praktische zorg mogelijk te maken precies op het moment dat die het hardst nodig is. Ze helpt families met waardigheid, stabiliteit en steun te herstellen, gedragen door mensen die de gemeenschap kennen.",
    },
    monthly: {
      eyebrow: "Geef maandelijks",
      title: "Help ons reageren wanneer een crisis toeslaat",
      body: [
        "Noodsituaties zijn vaak onvoorspelbaar. Het vermogen om te helpen zou dat niet moeten zijn.",
        "Maandelijkse donaties helpen iThemba Kuluntu voorbereid te blijven. Ze maken het mogelijk om praktische ondersteuning te blijven bieden wanneer families plotseling worden getroffen door overstromingen, branden, ziekte, ongevallen of acute nood.",
      ],
      cardHeading: "Steun noodhulp",
      cardAmount: "€10 / maand",
      cardText:
        "Helpt noodvoedsel, dekens, matrassen, schoolschoenen, mobiliteitsondersteuning en praktische zorg voor families in crisis mogelijk te maken.",
      cta1: "Steun noodhulp maandelijks",
      cta2: "Doneer eenmalig aan Disaster Relief",
    },
    impact: {
      title: "Wat uw steun mogelijk maakt",
      items: [
        { value: 600, suffix: "+", iconSrc: "/assets/icons/impact/impact-mattresses.png", label: { en: "Mattresses distributed", de: "Matratzen verteilt", nl: "Matrassen verdeeld" } },
        { value: 2100, suffix: "+", iconSrc: "/assets/icons/impact/impact-blankets.png", label: { en: "Blankets distributed", de: "Decken verteilt", nl: "Dekens verdeeld" } },
        { value: 114, suffix: "", iconSrc: "/assets/icons/impact/impact-wheelchairs.png", label: { en: "Wheelchairs distributed", de: "Rollstühle verteilt", nl: "Rolstoelen verdeeld" } },
        { value: 1300, suffix: "+", iconSrc: "/assets/icons/impact/impact-school-shoes.png", label: { en: "School shoes distributed", de: "Schulschuhe verteilt", nl: "Schoolschoenen verdeeld" } },
      ],
    },
    closing: {
      eyebrow: "Wanneer crisis toeslaat",
      title: "Help families opnieuw beginnen",
      body: [
        "Disaster Relief bestaat omdat families een crisis niet alleen zouden moeten hoeven dragen.",
        "Uw steun helpt praktische noodhulp mogelijk te maken wanneer huishoudens overweldigd zijn, en helpt families de eerste stappen te zetten van crisis naar stabiliteit en herstel.",
      ],
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      all: "Alle projecten bekijken",
    },
  },
};

/* ---------- icon registry ---------- */
const ICONS: Record<string, typeof Heart> = {
  Heart, Users, MapPin, Building2, Truck, HandHeart, ShieldAlert, Package, Flame,
  Home, Droplets, Stethoscope, Footprints, Accessibility, Shirt, Bed, LifeBuoy, Compass, Utensils,
};


const SNAPSHOT_ICONS = [LifeBuoy, HandHeart, MapPin, Package, Compass, Heart];

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
            label="Disaster Relief — emergency support in Cwebeni"
            className="h-full w-full"
            rounded="rounded-none"
            tone="blue"
            showMissingBadge={false}
          />
        )}
        {!showVideo && (
          <img src={FALLBACK_POSTER} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover -z-10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/88 via-[var(--ithemba-blue-dark)]/70 to-[var(--ithemba-blue)]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>

      <div className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 ring-1 ring-white/15 backdrop-blur">
        <PlayCircle className="h-3.5 w-3.5 text-[var(--ithemba-yellow)]" />
        {c.hero.placeholder}
      </div>

      <div className="pointer-events-none absolute left-10 top-24 text-[var(--ithemba-yellow)]/40">
        <Heart className="h-6 w-6" />
      </div>
      <div className="pointer-events-none absolute right-20 bottom-32 text-[var(--ithemba-yellow)]/30">
        <HandHeart className="h-8 w-8" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 md:pb-32 md:pt-28 lg:px-8">
        <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-white/85 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> {c.back}
        </Link>

        <div className="mt-8 max-w-3xl text-white">
          <FocusAreaBadges
            badges={["disaster-relief", "food-security", "safe-water", "education", "skills-livelihoods", "community-health"]}
            size="md"
            className="mb-5"
          />
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm flex items-center gap-2">
            <LifeBuoy className="h-5 w-5" /> {c.hero.eyebrow}
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
      <div className="pointer-events-none absolute -right-10 bottom-10 h-52 w-52 blob-2 bg-sky-300/20" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center">
          <SectionHeading eyebrow={c.snapshot.eyebrow} title={c.snapshot.title} center />
        </div>
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center text-lg leading-relaxed text-foreground/85">
          {c.snapshot.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {c.snapshot.facts.map((f, i) => {
            const Icon = SNAPSHOT_ICONS[i] ?? HandHeart;
            return (
              <div key={f.label} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-sky-200">
                  <Icon className="h-7 w-7 text-[var(--ithemba-blue-dark)]" />
                </div>
                <div className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-foreground/60">{f.label}</div>
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
          src={PHOTO_SUPPORT}
          label="Community support after crisis in Pondoland"
          className="h-full w-full"
          rounded="rounded-none"
          tone="blue"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ithemba-blue-deepest)]/70 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>
      <div className="pointer-events-none absolute left-10 top-16 text-[var(--ithemba-yellow)]/40"><Heart className="h-7 w-7" /></div>
      <div className="pointer-events-none absolute right-16 bottom-16 text-[var(--ithemba-yellow)]/40"><Home className="h-8 w-8" /></div>

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

/* ---------- PROVIDE — cream with icon grid ---------- */
function Provide({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 blob-2 bg-sky-300/25" />
      <div className="pointer-events-none absolute -left-16 bottom-16 h-48 w-48 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.provide.eyebrow} title={c.provide.title} />
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">{c.provide.intro}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-3">
          {c.provide.items.map((it, i) => {
            const Icon = ICONS[it.icon] ?? HandHeart;
            return (
              <div key={i} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ithemba-blue-dark)]/10 ring-1 ring-[var(--ithemba-blue-dark)]/15">
                  <Icon className="h-6 w-6 text-[var(--ithemba-blue-dark)]" />
                </div>
                <div className="text-sm font-medium leading-snug text-[var(--ithemba-blue-dark)]">{it.label}</div>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-base leading-relaxed text-foreground/75">{c.provide.outro}</p>
      </div>
    </section>
  );
}

/* ---------- RESPOND — blue photo-backed ---------- */
function Respond({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white md:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_SUPPLIES}
          label="Local team coordinating disaster relief support"
          className="h-full w-full"
          rounded="rounded-none"
          tone="blue"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
        <div className="absolute left-[-6rem] bottom-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      </div>
      <div className="pointer-events-none absolute left-12 top-16 text-[var(--ithemba-yellow)]/40"><HandHeart className="h-8 w-8" /></div>
      <div className="pointer-events-none absolute right-12 top-24 text-[var(--ithemba-yellow)]/30"><MapPin className="h-7 w-7" /></div>
      <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
            <MapPin className="h-5 w-5" /> {c.respond.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.respond.title}</h2>
        </div>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-white/90">
          {c.respond.body.map((p, i) => <p key={i}>{p}</p>)}
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
          src={PHOTO_SUPPORT}
          label="Connected community care across iThemba Kuluntu focus areas"
          className="h-full w-full"
          rounded="rounded-none"
          tone="blue"
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
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
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
      <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 blob-2 bg-sky-300/25" />
      <div className="pointer-events-none absolute -left-16 bottom-16 h-48 w-48 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.donation.eyebrow} title={c.donation.title} />
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">{c.donation.intro}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
          {c.donation.items.map((it, i) => {
            const Icon = ICONS[it.icon] ?? HandHeart;
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-sky-200 md:h-20 md:w-20">
                  <Icon className="h-7 w-7 text-[var(--ithemba-blue-dark)] md:h-8 md:w-8" />
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

/* ---------- IMPACT ---------- */
function Impact({ c }: { c: Copy }) {
  return <ImpactCounters items={c.impact.items} title={c.impact.title} />;
}

/* ---------- MONTHLY (with widget) ---------- */
function Monthly({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_SUPPLIES}
          label="Support disaster relief monthly"
          className="h-full w-full"
          rounded="rounded-none"
          tone="blue"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/80 to-[var(--ithemba-blue-dark)]/45" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>
      <svg className="pointer-events-none absolute inset-x-0 top-0 -mt-px block h-12 w-full md:h-16" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z" fill="var(--ithemba-blue-deepest)" opacity="0.55" />
        <path d="M0,55 C240,90 480,15 720,55 C960,90 1200,15 1440,55 L1440,0 L0,0 Z" fill="var(--ithemba-blue-deepest)" />
      </svg>
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
              <LifeBuoy className="h-6 w-6" />
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
        <DonationWidget defaultProject="Disaster Relief" />
      </div>
    </section>
  );
}

/* ---------- CLOSING ---------- */
function Closing({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ithemba-blue-deepest)] via-[var(--ithemba-blue-dark)] to-[var(--ithemba-blue)] py-20 text-white">
      <svg className="pointer-events-none absolute inset-x-0 top-0 -mt-px block h-12 w-full md:h-16" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z" fill="var(--ithemba-blue-deepest)" opacity="0.55" />
        <path d="M0,55 C240,90 480,15 720,55 C960,90 1200,15 1440,55 L1440,0 L0,0 Z" fill="var(--ithemba-blue-deepest)" />
      </svg>
      <div className="pointer-events-none absolute right-[-6rem] top-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      <div className="pointer-events-none absolute left-10 top-10"><SunDoodle className="h-12 w-12 text-[var(--ithemba-yellow)]/60" /></div>
      <div className="pointer-events-none absolute right-10 bottom-10"><Heart className="h-9 w-9 text-[var(--ithemba-yellow)]/70" /></div>
      <div className="pointer-events-none absolute left-16 bottom-16"><Home className="h-7 w-7 text-[var(--ithemba-yellow)]/50" /></div>
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

/* ---------- wave divider ---------- */
function Wave({ from = "var(--ithemba-cream)", to = "var(--background)" }: { from?: string; to?: string }) {
  return (
    <div style={{ background: from }}>
      <svg className="block w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
        <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill={to} />
      </svg>
    </div>
  );
}

/* ---------- PAGE ---------- */
function DisasterReliefPage() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.en;
  return (
    <>
      <Hero c={c} />
      <Snapshot c={c} />
      <Wave from="var(--ithemba-cream)" to="var(--background)" />
      <Why c={c} />
      <Provide c={c} />
      <Respond c={c} />
      <Focus c={c} />
      <DonationSupport c={c} />
      <Impact c={c} />
      <Monthly c={c} />
      <Closing c={c} />
    </>
  );
}
