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
  Users,
  GraduationCap,
  Handshake,
  MapPin,
  Building2,
  Cookie,
  PackageOpen,
  Truck,
  PlayCircle,
  Star,
  Award,
  UtensilsCrossed,
  Soup,
  Baby,
  Flame,
  HandHeart,
  ShieldAlert,
  Package,
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

export const Route = createFileRoute("/projects/food-security")({ component: FoodSecurityPage });

/* ---------- assets ---------- */
const HERO_VIDEO = "/assets/videos/projects/food-security-hero.mp4";
const HERO_POSTER = "/assets/photos/projects/food-security-hero-poster.jpg";
const FALLBACK_POSTER = assets.photos.projects.foodSecurityHero;
const PHOTO_MEALS = assets.photos.foodSecurity.meals;
const PHOTO_PARCELS = assets.photos.foodSecurity.parcels;
const PHOTO_KITCHEN = assets.photos.foodSecurity.communityKitchen;
const PHOTO_ECD_MEAL = assets.photos.ecd.meal;
const PHOTO_GREENHOUSE = assets.photos.greenhouse.foodGrowing;

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
type DonationItem = { icon: string; label: string };
type FocusItem = {
  badge: "food-security" | "community-health" | "education" | "skills-livelihoods" | "disaster-relief";
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
  hampers: { eyebrow: string; title: string; body: string[] };
  kitchen: { eyebrow: string; title: string; body: string[] };
  ecd: { eyebrow: string; title: string; body: string[]; chips: string[] };
  greenhouse: { eyebrow: string; title: string; body: string[] };
  focus: { eyebrow: string; title: string; body: string[]; items: FocusItem[] };
  donation: { eyebrow: string; title: string; intro: string; items: DonationItem[]; outro: string };
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
  impact: { title: string; items: { value: number; suffix: string; iconSrc?: string; label: { en: string; de: string; nl?: string } }[] };
  closing: { eyebrow: string; title: string; body: string[]; monthly: string; once: string; all: string };
};

/* ---------- COPY (verbatim from /public/content/projects/food-security-*-v1-1.txt) ---------- */
const COPY: Record<Lang, Copy> = {
  en: {
    back: "All projects",
    hero: {
      eyebrow: "Food Security",
      title: "Food Security",
      text:
        "Practical food support for vulnerable families in Cwebeni and surrounding communities, through monthly food hampers, a volunteer-run soup kitchen, and daily meals for children at the iThemba Kuluntu No.1 ECD Centre.",
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      location: "Cwebeni · Port St Johns · Eastern Cape · South Africa",
      placeholder: "Hero video placeholder · ready for real Food Security video",
    },
    snapshot: {
      eyebrow: "At a glance",
      title: "Food support where it is needed most",
      body: [
        "Food security is one of iThemba Kuluntu’s core areas of work. In rural communities, hunger is often linked to poverty, unemployment, transport barriers, food prices and limited access to regular income.",
        "Our food security work supports vulnerable families through practical, direct food assistance. This includes monthly food hampers for households in need, meals prepared through a local soup kitchen, and the daily feeding programme at the iThemba Kuluntu No.1 ECD Centre.",
        "The project is rooted in local knowledge. Our team understands which households are under pressure, which families need urgent support, and where practical food assistance can make an immediate difference.",
      ],
      facts: [
        { label: "Project", value: "Food Security" },
        { label: "Focus", value: "Food support for vulnerable families and children" },
        { label: "Where", value: "Cwebeni, Port St Johns, Eastern Cape, South Africa" },
        { label: "Core support", value: "Monthly food hampers, soup kitchen meals and ECD Centre meals" },
        { label: "Community role", value: "Local women volunteers help cook and serve meals through the soup kitchen" },
        { label: "Connected projects", value: "No.1 ECD Centre and Greenhouse with SA Harvest" },
        { label: "Donation focus", value: "Helping keep food support consistent for families and children" },
      ],
    },
    why: {
      eyebrow: "Why",
      title: "food support matters",
      body: [
        "Food insecurity affects every part of family life. When food is not guaranteed, children struggle to learn, caregivers carry constant stress, and families are forced to make difficult choices.",
        "In rural communities, even basic food access can become difficult. Families may live far from shops, have limited transport, face unstable income, or depend on support from relatives who are also struggling.",
        "Food Security responds to this reality with practical help. It is not complicated. It is about making sure families have food when they need it, and that children are not expected to learn, grow or play while hungry.",
        "For iThemba Kuluntu, food support is part of dignity. It is part of care. It is part of standing with families through difficult seasons.",
      ],
    },
    hampers: {
      eyebrow: "Monthly care",
      title: "Food hampers for vulnerable families",
      body: [
        "Every month, iThemba Kuluntu supports vulnerable households with food hampers.",
        "These hampers help families get through periods when food is not guaranteed. They are especially important for households facing unemployment, illness, crisis, disability, old age, child-headed or caregiver-led households, and other forms of vulnerability.",
        "The food hampers are practical and direct. They help reduce immediate pressure and give families basic support they can use at home.",
        "This monthly support is possible because of donations, partnerships and local coordination. Consistency matters because hunger does not happen only once.",
      ],
    },
    kitchen: {
      eyebrow: "Community care",
      title: "A soup kitchen run by local women volunteers",
      body: [
        "The soup kitchen is one of the most community-rooted parts of iThemba Kuluntu’s food security work.",
        "Local women volunteers help prepare and serve meals for people who need food support. Their work is practical, generous and deeply connected to the community.",
        "The soup kitchen provides more than a meal. It creates a place of care, presence and response. It shows how community members can stand together when families are struggling.",
        "This work also reflects one of iThemba Kuluntu’s core beliefs: solutions are strongest when they are carried by local people who understand the realities around them.",
      ],
    },
    ecd: {
      eyebrow: "Children first",
      title: "Daily meals for children at the No.1 ECD Centre",
      body: [
        "Food security is directly connected to the iThemba Kuluntu No.1 ECD Centre.",
        "At the No.1 ECD Centre, 120 children receive daily care, early learning, play, rest and meals. Food is not separate from early childhood development. Children need regular meals to concentrate, feel safe, build routines and grow.",
        "The feeding programme at the ECD Centre helps make early learning possible for children from vulnerable households. It also helps relieve pressure on families who may not be able to provide consistent childcare and daily nutrition on their own.",
        "The centre’s meals are also connected to the Greenhouse with SA Harvest, which helps supplement the daily meals with fresh produce grown locally.",
        "Food, learning and care belong together.",
      ],
      chips: ["120 children", "Daily meals", "No.1 ECD Centre"],
    },
    greenhouse: {
      eyebrow: "Fresh support",
      title: "Greenhouse produce for child nutrition",
      body: [
        "The Greenhouse with SA Harvest strengthens iThemba Kuluntu’s food security work by growing fresh produce close to the community.",
        "The greenhouse is connected to the No.1 ECD Centre and helps supplement the daily meals for 120 children. This means food security is not only about emergency support or food parcels. It is also about building local food systems that can support children and families over time.",
        "Through the greenhouse, local women build growing skills while fresh produce supports child nutrition. This creates a practical connection between food security, skills development, early childhood development and community health.",
      ],
    },
    focus: {
      eyebrow: "Connected care",
      title: "Food security supports the whole family",
      body: [
        "Food Security connects to several iThemba Kuluntu focus areas.",
        "The project supports food security through direct food assistance. It supports community health because nutrition affects wellbeing. It supports education because children learn better when they are not hungry. It connects to skills and livelihoods through local women’s involvement in cooking, growing and community care. It also connects to disaster relief because food support is often one of the first needs during crisis.",
        "Food security is not separate from family wellbeing. It is one of the foundations that helps children, caregivers and households move through daily life with more stability.",
      ],
      items: [
        { badge: "food-security", label: "Food security" },
        { badge: "community-health", label: "Community health" },
        { badge: "education", label: "Education" },
        { badge: "skills-livelihoods", label: "Skills & livelihoods" },
        { badge: "disaster-relief", label: "Disaster relief" },
      ],
    },
    donation: {
      eyebrow: "Your support",
      title: "Help keep food support moving",
      intro: "Donations help iThemba Kuluntu keep food support practical, regular and community-rooted. Your support can help provide:",
      items: [
        { icon: "PackageOpen", label: "Monthly food hampers for vulnerable families" },
        { icon: "Soup", label: "Ingredients for soup kitchen meals" },
        { icon: "Utensils", label: "Daily meals for children at the No.1 ECD Centre" },
        { icon: "Sprout", label: "Fresh produce support through the Greenhouse with SA Harvest" },
        { icon: "Flame", label: "Cooking supplies and basic kitchen needs" },
        { icon: "Truck", label: "Transport and distribution support" },
        { icon: "Users", label: "Local coordination" },
        { icon: "ShieldAlert", label: "Emergency food support when families face sudden hardship" },
      ],
      outro:
        "A donation to Food Security helps provide practical care where it is needed most. It helps families get through difficult periods and helps children receive the nutrition they need to learn, grow and feel safe.",
    },
    monthly: {
      eyebrow: "Give monthly",
      title: "Help families access food each month",
      body: [
        "Food security needs consistency. Families need food not only during visible emergencies, but throughout the ordinary months when income is low, prices rise and support is difficult to find.",
        "Monthly giving helps iThemba Kuluntu plan ahead. It helps keep food hampers, soup kitchen meals and ECD Centre feeding more stable.",
      ],
      cardHeading: "Support food security",
      cardAmount: "€25 / month",
      cardText: "Helps support food hampers, soup kitchen meals and daily nutrition for vulnerable children and families.",
      cta1: "Support food security monthly",
      cta2: "Give once to Food Security",
    },
    impact: {
      title: "What your support helps make possible",
      items: [
        { value: 300000, suffix: "+", iconSrc: "/assets/icons/impact/impact-meals-served.png", label: { en: "Meals served", de: "Mahlzeiten ausgegeben", nl: "Maaltijden verstrekt" } },
        { value: 2863, suffix: "", iconSrc: "/assets/icons/impact/impact-food-hampers.png", label: { en: "Food hampers distributed", de: "Lebensmittelpakete verteilt", nl: "Voedselpakketten verdeeld" } },
        { value: 120, suffix: "", iconSrc: "/assets/icons/impact/impact-ecd-children.png", label: { en: "Children receiving daily meals at the No.1 ECD Centre", de: "Kinder erhalten tägliche Mahlzeiten im No.1 ECD Centre", nl: "Kinderen ontvangen dagelijkse maaltijden in het No.1 ECD Centre" } },
      ],
    },
    closing: {
      eyebrow: "Food with dignity",
      title: "Help keep families and children nourished",
      body: [
        "Food Security exists because no child should be expected to learn hungry, and no family should face hardship without practical support.",
        "Your donation helps provide food hampers, soup kitchen meals and daily nutrition for children at the No.1 ECD Centre. It helps keep care moving in a way that is practical, local and rooted in dignity.",
      ],
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      all: "Explore All Projects",
    },
  },

  de: {
    back: "Alle Projekte",
    hero: {
      eyebrow: "Ernährungssicherheit",
      title: "Food Security",
      text:
        "Praktische Lebensmittelhilfe für vulnerable Familien in Cwebeni und den umliegenden Gemeinden, durch monatliche Lebensmittelpakete, eine von lokalen Frauen ehrenamtlich geführte Suppenküche und tägliche Mahlzeiten für Kinder im iThemba Kuluntu No.1 ECD Centre.",
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      location: "Cwebeni · Port St Johns · Eastern Cape · Südafrika",
      placeholder: "Hero-Video Platzhalter · bereit für echtes Food Security-Video",
    },
    snapshot: {
      eyebrow: "Auf einen Blick",
      title: "Lebensmittelhilfe dort, wo sie am dringendsten gebraucht wird",
      body: [
        "Ernährungssicherheit ist einer der zentralen Arbeitsschwerpunkte von iThemba Kuluntu. In ländlichen Gemeinden ist Hunger oft mit Armut, Arbeitslosigkeit, fehlendem Transport, steigenden Lebensmittelpreisen und begrenztem Zugang zu regelmäßigem Einkommen verbunden.",
        "Unsere Arbeit im Bereich Ernährungssicherheit unterstützt vulnerable Familien durch direkte, praktische Lebensmittelhilfe. Dazu gehören monatliche Lebensmittelpakete für Haushalte in Not, Mahlzeiten aus einer lokalen Suppenküche und das tägliche Mahlzeitenprogramm im iThemba Kuluntu No.1 ECD Centre.",
        "Das Projekt ist in lokalem Wissen verankert. Unser Team kennt die Haushalte, die unter besonderem Druck stehen, die Familien, die dringend Unterstützung brauchen, und die Situationen, in denen praktische Lebensmittelhilfe sofort Entlastung bringen kann.",
      ],
      facts: [
        { label: "Projekt", value: "Food Security" },
        { label: "Schwerpunkt", value: "Lebensmittelhilfe für vulnerable Familien und Kinder" },
        { label: "Wo", value: "Cwebeni, Port St Johns, Eastern Cape, Südafrika" },
        { label: "Kernunterstützung", value: "Monatliche Lebensmittelpakete, Suppenküchen-Mahlzeiten und Mahlzeiten im ECD Centre" },
        { label: "Rolle der Gemeinschaft", value: "Lokale Frauen helfen ehrenamtlich beim Kochen und Ausgeben der Mahlzeiten in der Suppenküche" },
        { label: "Verbundene Projekte", value: "No.1 ECD Centre und Greenhouse with SA Harvest" },
        { label: "Spendenfokus", value: "Lebensmittelhilfe für Familien und Kinder verlässlich weiterführen" },
      ],
    },
    why: {
      eyebrow: "Warum",
      title: "Lebensmittelhilfe wichtig ist",
      body: [
        "Ernährungsunsicherheit wirkt sich auf jeden Bereich des Familienlebens aus. Wenn Lebensmittel nicht verlässlich verfügbar sind, fällt Kindern das Lernen schwerer, Betreuungspersonen stehen unter dauerhaftem Druck und Familien müssen schwierige Entscheidungen treffen.",
        "In ländlichen Gemeinden kann selbst der Zugang zu Grundnahrungsmitteln eine Herausforderung sein. Familien wohnen oft weit entfernt von Einkaufsmöglichkeiten, haben nur begrenzte Transportmöglichkeiten, leben mit unsicherem Einkommen oder sind auf Unterstützung von Angehörigen angewiesen, die selbst wenig haben.",
        "Food Security reagiert auf diese Realität mit praktischer Hilfe. Es ist kein kompliziertes Projekt. Es geht darum, sicherzustellen, dass Familien Essen haben, wenn sie es brauchen, und dass Kinder nicht hungrig lernen, wachsen oder spielen müssen.",
        "Für iThemba Kuluntu ist Lebensmittelhilfe Teil von Würde. Sie ist Teil von Fürsorge. Und sie ist Teil davon, Familien in schwierigen Zeiten verlässlich zur Seite zu stehen.",
      ],
    },
    hampers: {
      eyebrow: "Monatliche Hilfe",
      title: "Lebensmittelpakete für vulnerable Familien",
      body: [
        "Jeden Monat unterstützt iThemba Kuluntu vulnerable Haushalte mit Lebensmittelpaketen.",
        "Diese Pakete helfen Familien durch Zeiten, in denen Essen nicht gesichert ist. Besonders wichtig sind sie für Haushalte, die von Arbeitslosigkeit, Krankheit, Krisen, Behinderung, hohem Alter, Kinderhaushalten, allein sorgenden Betreuungspersonen oder anderen Formen von Vulnerabilität betroffen sind.",
        "Die Lebensmittelpakete sind praktische und direkte Hilfe. Sie verringern akuten Druck und geben Familien grundlegende Unterstützung, die sie zu Hause nutzen können.",
        "Diese monatliche Unterstützung ist durch Spenden, Partnerschaften und lokale Koordination möglich. Verlässlichkeit ist entscheidend, denn Hunger tritt nicht nur einmal auf.",
      ],
    },
    kitchen: {
      eyebrow: "Gemeindenahe Fürsorge",
      title: "Eine Suppenküche, getragen von lokalen Frauen",
      body: [
        "Die Suppenküche ist einer der besonders gemeindenahen Bereiche unserer Arbeit für Ernährungssicherheit.",
        "Lokale Frauen helfen ehrenamtlich dabei, Mahlzeiten für Menschen vorzubereiten und auszugeben, die Lebensmittelhilfe benötigen. Ihre Arbeit ist praktisch, großzügig und tief mit der Gemeinschaft verbunden.",
        "Die Suppenküche bietet mehr als eine Mahlzeit. Sie schafft einen Ort der Fürsorge, der Präsenz und der direkten Antwort auf Not. Sie zeigt, wie Menschen aus der Gemeinschaft füreinander einstehen können, wenn Familien unter Druck geraten.",
        "Diese Arbeit spiegelt eine Grundüberzeugung von iThemba Kuluntu wider: Lösungen sind am stärksten, wenn sie von lokalen Menschen getragen werden, die die Lebensrealitäten vor Ort verstehen.",
      ],
    },
    ecd: {
      eyebrow: "Kinder zuerst",
      title: "Tägliche Mahlzeiten für Kinder im No.1 ECD Centre",
      body: [
        "Ernährungssicherheit ist direkt mit dem iThemba Kuluntu No.1 ECD Centre verbunden.",
        "Im No.1 ECD Centre erhalten 120 Kinder täglich Betreuung, frühe Bildung, Spiel, Ruhe und Mahlzeiten. Ernährung ist nicht von frühkindlicher Entwicklung zu trennen. Kinder brauchen regelmäßige Mahlzeiten, um sich zu konzentrieren, sich sicher zu fühlen, Routinen aufzubauen und gesund zu wachsen.",
        "Das Mahlzeitenprogramm im ECD Centre hilft, frühe Bildung für Kinder aus vulnerablen Haushalten möglich zu machen. Gleichzeitig entlastet es Familien, die regelmäßige Kinderbetreuung und tägliche Ernährung nicht allein sicherstellen können.",
        "Die Mahlzeiten im Centre sind außerdem mit dem Greenhouse with SA Harvest verbunden, das hilft, die täglichen Mahlzeiten mit lokal angebauten frischen Lebensmitteln zu ergänzen.",
        "Essen, Lernen und Fürsorge gehören zusammen.",
      ],
      chips: ["120 Kinder", "Tägliche Mahlzeiten", "No.1 ECD Centre"],
    },
    greenhouse: {
      eyebrow: "Frische Unterstützung",
      title: "Greenhouse-Produkte für Kinderernährung",
      body: [
        "Das Greenhouse with SA Harvest stärkt die Ernährungssicherungsarbeit von iThemba Kuluntu, indem frische Lebensmittel nah an der Gemeinschaft angebaut werden.",
        "Das Greenhouse ist mit dem No.1 ECD Centre verbunden und hilft, die täglichen Mahlzeiten für 120 Kinder zu ergänzen. Dadurch bedeutet Ernährungssicherheit nicht nur Nothilfe oder Lebensmittelpakete. Sie bedeutet auch, lokale Ernährungssysteme aufzubauen, die Kinder und Familien langfristig unterstützen können.",
        "Durch das Greenhouse bauen lokale Frauen praktische Anbaufähigkeiten auf, während frische Lebensmittel die Kinderernährung stärken. So entsteht eine konkrete Verbindung zwischen Ernährungssicherheit, Kompetenzaufbau, frühkindlicher Entwicklung und Gemeindegesundheit.",
      ],
    },
    focus: {
      eyebrow: "Verbundene Fürsorge",
      title: "Ernährungssicherheit stärkt die ganze Familie",
      body: [
        "Food Security ist mit mehreren Arbeitsschwerpunkten von iThemba Kuluntu verbunden.",
        "Das Projekt stärkt Ernährungssicherheit durch direkte Lebensmittelhilfe. Es stärkt Gemeindegesundheit, weil Ernährung unmittelbar mit Wohlbefinden verbunden ist. Es stärkt Bildung, weil Kinder besser lernen können, wenn sie nicht hungrig sind. Es verbindet sich mit Kompetenzen und Lebensgrundlagen durch die Beteiligung lokaler Frauen beim Kochen, Anbauen und in der Gemeindefürsorge. Es ist außerdem mit Katastrophenhilfe verbunden, weil Lebensmittelhilfe in Krisen oft zu den ersten und dringendsten Bedürfnissen gehört.",
        "Ernährungssicherheit ist nicht getrennt vom Wohlergehen einer Familie. Sie ist eine der Grundlagen, die Kindern, Betreuungspersonen und Haushalten mehr Stabilität im Alltag geben.",
      ],
      items: [
        { badge: "food-security", label: "Ernährungssicherheit" },
        { badge: "community-health", label: "Gemeindegesundheit" },
        { badge: "education", label: "Bildung" },
        { badge: "skills-livelihoods", label: "Kompetenzen & Lebensgrundlagen" },
        { badge: "disaster-relief", label: "Katastrophenhilfe" },
      ],
    },
    donation: {
      eyebrow: "Ihre Unterstützung",
      title: "Helfen Sie, Lebensmittelhilfe verlässlich weiterzuführen",
      intro: "Spenden helfen iThemba Kuluntu, Lebensmittelhilfe praktisch, regelmäßig und gemeindenah umzusetzen. Ihre Unterstützung kann helfen, Folgendes bereitzustellen:",
      items: [
        { icon: "PackageOpen", label: "Monatliche Lebensmittelpakete für vulnerable Familien" },
        { icon: "Soup", label: "Zutaten für Mahlzeiten in der Suppenküche" },
        { icon: "Utensils", label: "Tägliche Mahlzeiten für Kinder im No.1 ECD Centre" },
        { icon: "Sprout", label: "Frische Lebensmittel durch das Greenhouse with SA Harvest" },
        { icon: "Flame", label: "Kochmaterialien und grundlegenden Küchenbedarf" },
        { icon: "Truck", label: "Transport- und Verteilungsunterstützung" },
        { icon: "Users", label: "Lokale Koordination" },
        { icon: "ShieldAlert", label: "Notfall-Lebensmittelhilfe, wenn Familien plötzlich in eine Krise geraten" },
      ],
      outro:
        "Eine Spende für Food Security hilft, praktische Fürsorge dort möglich zu machen, wo sie am dringendsten gebraucht wird. Sie hilft Familien durch schwierige Zeiten und unterstützt Kinder dabei, die Ernährung zu erhalten, die sie brauchen, um zu lernen, zu wachsen und sich sicher zu fühlen.",
    },
    monthly: {
      eyebrow: "Monatlich geben",
      title: "Helfen Sie Familien, jeden Monat Zugang zu Lebensmitteln zu haben",
      body: [
        "Ernährungssicherheit braucht Verlässlichkeit. Familien benötigen Lebensmittel nicht nur in sichtbaren Notfällen, sondern auch in den normalen Monaten, in denen Einkommen niedrig ist, Preise steigen und Unterstützung schwer zu finden ist.",
        "Monatliche Spenden helfen iThemba Kuluntu, vorausschauend zu planen. Sie tragen dazu bei, Lebensmittelpakete, Suppenküchen-Mahlzeiten und die Versorgung im ECD Centre stabiler zu halten.",
      ],
      cardHeading: "Ernährungssicherheit unterstützen",
      cardAmount: "25 € / Monat",
      cardText: "Hilft, Lebensmittelpakete, Suppenküchen-Mahlzeiten und tägliche Ernährung für vulnerable Kinder und Familien zu unterstützen.",
      cta1: "Ernährungssicherheit monatlich unterstützen",
      cta2: "Einmalig für Food Security spenden",
    },
    impact: {
      title: "Was Ihre Unterstützung möglich macht",
      items: [
        { value: 300000, suffix: "+", iconSrc: "/assets/icons/impact/impact-meals-served.png", label: { en: "Meals served", de: "Mahlzeiten ausgegeben", nl: "Maaltijden verstrekt" } },
        { value: 2863, suffix: "", iconSrc: "/assets/icons/impact/impact-food-hampers.png", label: { en: "Food hampers distributed", de: "Lebensmittelpakete verteilt", nl: "Voedselpakketten verdeeld" } },
        { value: 120, suffix: "", iconSrc: "/assets/icons/impact/impact-ecd-children.png", label: { en: "Children receiving daily meals at the No.1 ECD Centre", de: "Kinder erhalten tägliche Mahlzeiten im No.1 ECD Centre", nl: "Kinderen ontvangen dagelijkse maaltijden in het No.1 ECD Centre" } },
      ],
    },
    closing: {
      eyebrow: "Essen mit Würde",
      title: "Helfen Sie, Familien und Kinder zu versorgen",
      body: [
        "Food Security gibt es, weil kein Kind hungrig lernen sollte und keine Familie in schwierigen Zeiten ohne praktische Unterstützung bleiben sollte.",
        "Ihre Spende hilft, Lebensmittelpakete, Suppenküchen-Mahlzeiten und tägliche Ernährung für Kinder im No.1 ECD Centre bereitzustellen. Sie hilft, Fürsorge auf eine Weise weiterzuführen, die praktisch, lokal und in Würde verankert ist.",
      ],
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      all: "Alle Projekte entdecken",
    },
  },

  nl: {
    back: "Alle projecten",
    hero: {
      eyebrow: "Voedselzekerheid",
      title: "Food Security",
      text:
        "Praktische voedselondersteuning voor kwetsbare families in Cwebeni en omliggende gemeenschappen, via maandelijkse voedselpakketten, een soepkeuken gerund door lokale vrouwelijke vrijwilligers en dagelijkse maaltijden voor kinderen in het iThemba Kuluntu No.1 ECD Centre.",
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      location: "Cwebeni · Port St Johns · Eastern Cape · Zuid-Afrika",
      placeholder: "Hero-video plaatshouder · klaar voor een echte Food Security-video",
    },
    snapshot: {
      eyebrow: "In één oogopslag",
      title: "Voedselhulp waar die het hardst nodig is",
      body: [
        "Voedselzekerheid is een van de centrale werkgebieden van iThemba Kuluntu. In landelijke gemeenschappen hangt honger vaak samen met armoede, werkloosheid, beperkte vervoersmogelijkheden, stijgende voedselprijzen en weinig toegang tot een regelmatig inkomen.",
        "Ons werk rond voedselzekerheid ondersteunt kwetsbare families met directe en praktische voedselhulp. Dit omvat maandelijkse voedselpakketten voor huishoudens in nood, maaltijden vanuit een lokale soepkeuken en het dagelijkse voedingsprogramma in het iThemba Kuluntu No.1 ECD Centre.",
        "Het project is geworteld in lokale kennis. Ons team weet welke huishoudens onder druk staan, welke families dringend ondersteuning nodig hebben en waar praktische voedselhulp direct verschil kan maken.",
      ],
      facts: [
        { label: "Project", value: "Food Security" },
        { label: "Focus", value: "Voedselondersteuning voor kwetsbare families en kinderen" },
        { label: "Waar", value: "Cwebeni, Port St Johns, Eastern Cape, Zuid-Afrika" },
        { label: "Kernondersteuning", value: "Maandelijkse voedselpakketten, maaltijden uit de soepkeuken en maaltijden in het ECD Centre" },
        { label: "Rol van de gemeenschap", value: "Lokale vrouwelijke vrijwilligers helpen koken en maaltijden uitdelen via de soepkeuken" },
        { label: "Verbonden projecten", value: "No.1 ECD Centre en Greenhouse with SA Harvest" },
        { label: "Donatiefocus", value: "Voedselondersteuning voor families en kinderen consistent mogelijk maken" },
      ],
    },
    why: {
      eyebrow: "Waarom",
      title: "voedselondersteuning belangrijk is",
      body: [
        "Voedselonzekerheid raakt elk deel van het gezinsleven. Wanneer voedsel niet zeker is, wordt leren moeilijker voor kinderen, ervaren verzorgers voortdurende stress en moeten families moeilijke keuzes maken.",
        "In landelijke gemeenschappen kan zelfs toegang tot basisvoedsel lastig zijn. Families wonen soms ver van winkels, hebben beperkt vervoer, leven met onzeker inkomen of zijn afhankelijk van steun van familieleden die zelf ook weinig hebben.",
        "Food Security reageert op deze werkelijkheid met praktische hulp. Het is geen ingewikkeld project. Het gaat erom dat families eten hebben wanneer ze dat nodig hebben, en dat kinderen niet hoeven te leren, groeien of spelen met honger.",
        "Voor iThemba Kuluntu is voedselhulp onderdeel van waardigheid. Het is onderdeel van zorg. En het is onderdeel van naast families blijven staan in moeilijke periodes.",
      ],
    },
    hampers: {
      eyebrow: "Maandelijkse zorg",
      title: "Voedselpakketten voor kwetsbare families",
      body: [
        "Elke maand ondersteunt iThemba Kuluntu kwetsbare huishoudens met voedselpakketten.",
        "Deze pakketten helpen families door periodes heen waarin voedsel niet vanzelfsprekend is. Ze zijn vooral belangrijk voor huishoudens die te maken hebben met werkloosheid, ziekte, crisis, beperking, ouderdom, kinderhuishoudens, huishoudens geleid door verzorgers of andere vormen van kwetsbaarheid.",
        "De voedselpakketten zijn praktisch en direct. Ze verminderen acute druk en geven families basissteun die zij thuis kunnen gebruiken.",
        "Deze maandelijkse steun is mogelijk door donaties, partnerschappen en lokale coördinatie. Continuïteit is belangrijk, want honger komt niet maar één keer voor.",
      ],
    },
    kitchen: {
      eyebrow: "Gemeenschapszorg",
      title: "Een soepkeuken gedragen door lokale vrouwen",
      body: [
        "De soepkeuken is een van de meest gemeenschapsgerichte onderdelen van iThemba Kuluntu’s werk rond voedselzekerheid.",
        "Lokale vrouwelijke vrijwilligers helpen maaltijden bereiden en uitdelen aan mensen die voedselondersteuning nodig hebben. Hun werk is praktisch, gul en diep verbonden met de gemeenschap.",
        "De soepkeuken biedt meer dan een maaltijd. Ze creëert een plek van zorg, aanwezigheid en directe respons. Ze laat zien hoe mensen binnen de gemeenschap elkaar kunnen dragen wanneer families onder druk staan.",
        "Dit werk weerspiegelt een van de kernwaarden van iThemba Kuluntu: oplossingen zijn het sterkst wanneer ze worden gedragen door lokale mensen die de realiteit ter plaatse begrijpen.",
      ],
    },
    ecd: {
      eyebrow: "Kinderen eerst",
      title: "Dagelijkse maaltijden voor kinderen in het No.1 ECD Centre",
      body: [
        "Voedselzekerheid is direct verbonden met het iThemba Kuluntu No.1 ECD Centre.",
        "In het No.1 ECD Centre ontvangen 120 kinderen dagelijkse zorg, vroege ontwikkeling, spel, rust en maaltijden. Voeding staat niet los van vroege ontwikkeling. Kinderen hebben regelmatige maaltijden nodig om zich te kunnen concentreren, zich veilig te voelen, routines op te bouwen en gezond te groeien.",
        "Het voedingsprogramma in het ECD Centre helpt vroege ontwikkeling mogelijk te maken voor kinderen uit kwetsbare huishoudens. Tegelijk verlicht het de druk op families die niet alleen kunnen zorgen voor consistente kinderopvang en dagelijkse voeding.",
        "De maaltijden in het Centre zijn ook verbonden met de Greenhouse with SA Harvest, die helpt om de dagelijkse maaltijden aan te vullen met lokaal geteelde verse producten.",
        "Voeding, leren en zorg horen bij elkaar.",
      ],
      chips: ["120 kinderen", "Dagelijkse maaltijden", "No.1 ECD Centre"],
    },
    greenhouse: {
      eyebrow: "Verse ondersteuning",
      title: "Greenhouse-producten voor kindervoeding",
      body: [
        "De Greenhouse with SA Harvest versterkt het voedselzekerheidswerk van iThemba Kuluntu door verse producten dicht bij de gemeenschap te verbouwen.",
        "De greenhouse is verbonden met het No.1 ECD Centre en helpt de dagelijkse maaltijden voor 120 kinderen aan te vullen. Daardoor gaat voedselzekerheid niet alleen over noodhulp of voedselpakketten. Het gaat ook over het opbouwen van lokale voedselsystemen die kinderen en families op langere termijn kunnen ondersteunen.",
        "Via de greenhouse bouwen lokale vrouwen praktische teeltvaardigheden op, terwijl verse producten bijdragen aan kindervoeding. Zo ontstaat een concrete verbinding tussen voedselzekerheid, vaardigheidsontwikkeling, vroege ontwikkeling en gemeenschapsgezondheid.",
      ],
    },
    focus: {
      eyebrow: "Verbonden zorg",
      title: "Voedselzekerheid ondersteunt het hele gezin",
      body: [
        "Food Security sluit aan bij verschillende focusgebieden van iThemba Kuluntu.",
        "Het project versterkt voedselzekerheid door directe voedselhulp. Het ondersteunt gemeenschapsgezondheid omdat voeding direct invloed heeft op welzijn. Het versterkt educatie omdat kinderen beter kunnen leren wanneer ze geen honger hebben. Het sluit aan bij vaardigheden en bestaansmogelijkheden door de betrokkenheid van lokale vrouwen bij koken, verbouwen en gemeenschapszorg. Het is ook verbonden met noodhulp, omdat voedsel vaak een van de eerste en meest dringende behoeften is tijdens een crisis.",
        "Voedselzekerheid staat niet los van het welzijn van een gezin. Het is een van de fundamenten die kinderen, verzorgers en huishoudens meer stabiliteit geven in het dagelijks leven.",
      ],
      items: [
        { badge: "food-security", label: "Voedselzekerheid" },
        { badge: "community-health", label: "Gemeenschapsgezondheid" },
        { badge: "education", label: "Educatie" },
        { badge: "skills-livelihoods", label: "Vaardigheden & bestaansmogelijkheden" },
        { badge: "disaster-relief", label: "Noodhulp" },
      ],
    },
    donation: {
      eyebrow: "Uw steun",
      title: "Help voedselondersteuning door te laten gaan",
      intro: "Donaties helpen iThemba Kuluntu om voedselondersteuning praktisch, regelmatig en gemeenschapsgericht te blijven bieden. Uw steun kan helpen om het volgende mogelijk te maken:",
      items: [
        { icon: "PackageOpen", label: "Maandelijkse voedselpakketten voor kwetsbare families" },
        { icon: "Soup", label: "Ingrediënten voor maaltijden in de soepkeuken" },
        { icon: "Utensils", label: "Dagelijkse maaltijden voor kinderen in het No.1 ECD Centre" },
        { icon: "Sprout", label: "Verse producten via de Greenhouse with SA Harvest" },
        { icon: "Flame", label: "Kookbenodigdheden en basisuitrusting voor de keuken" },
        { icon: "Truck", label: "Transport- en distributieondersteuning" },
        { icon: "Users", label: "Lokale coördinatie" },
        { icon: "ShieldAlert", label: "Noodvoedselhulp wanneer families plotseling in crisis raken" },
      ],
      outro:
        "Een donatie aan Food Security helpt praktische zorg mogelijk te maken waar die het hardst nodig is. Ze helpt families door moeilijke periodes heen en ondersteunt kinderen met de voeding die zij nodig hebben om te leren, te groeien en zich veilig te voelen.",
    },
    monthly: {
      eyebrow: "Geef maandelijks",
      title: "Help families elke maand toegang tot voedsel te houden",
      body: [
        "Voedselzekerheid vraagt om continuïteit. Families hebben voedsel niet alleen nodig tijdens zichtbare noodsituaties, maar ook in gewone maanden waarin inkomen laag is, prijzen stijgen en steun moeilijk te vinden is.",
        "Maandelijkse donaties helpen iThemba Kuluntu vooruit te plannen. Ze helpen voedselpakketten, soepkeukenmaaltijden en de voeding in het ECD Centre stabieler te houden.",
      ],
      cardHeading: "Steun voedselzekerheid",
      cardAmount: "€25 / maand",
      cardText: "Helpt voedselpakketten, soepkeukenmaaltijden en dagelijkse voeding voor kwetsbare kinderen en families te ondersteunen.",
      cta1: "Steun voedselzekerheid maandelijks",
      cta2: "Doneer eenmalig aan Food Security",
    },
    impact: {
      title: "Wat uw steun mogelijk maakt",
      items: [
        { value: 300000, suffix: "+", iconSrc: "/assets/icons/impact/impact-meals-served.png", label: { en: "Meals served", de: "Mahlzeiten ausgegeben", nl: "Maaltijden verstrekt" } },
        { value: 2863, suffix: "", iconSrc: "/assets/icons/impact/impact-food-hampers.png", label: { en: "Food hampers distributed", de: "Lebensmittelpakete verteilt", nl: "Voedselpakketten verdeeld" } },
        { value: 120, suffix: "", iconSrc: "/assets/icons/impact/impact-ecd-children.png", label: { en: "Children receiving daily meals at the No.1 ECD Centre", de: "Kinder erhalten tägliche Mahlzeiten im No.1 ECD Centre", nl: "Kinderen ontvangen dagelijkse maaltijden in het No.1 ECD Centre" } },
      ],
    },
    closing: {
      eyebrow: "Voeding met waardigheid",
      title: "Help families en kinderen gevoed te blijven",
      body: [
        "Food Security bestaat omdat geen kind met honger zou moeten leren en geen familie in moeilijke tijden zonder praktische steun zou moeten staan.",
        "Uw donatie helpt voedselpakketten, soepkeukenmaaltijden en dagelijkse voeding voor kinderen in het No.1 ECD Centre mogelijk te maken. Ze helpt zorg door te laten gaan op een manier die praktisch, lokaal en geworteld in waardigheid is.",
      ],
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      all: "Alle projecten bekijken",
    },
  },
};

/* ---------- icon registry ---------- */
const ICONS: Record<string, typeof Sprout> = {
  Sprout, Leaf, Users, GraduationCap, Handshake, Cookie, PackageOpen, Truck,
  Heart, Building2, MapPin, Award, UtensilsCrossed, Soup, Baby, Flame, HandHeart,
  ShieldAlert, Package, Utensils,
};

/* snapshot fact icons (index-aligned) */
const SNAPSHOT_ICONS = [UtensilsCrossed, HandHeart, MapPin, Soup, Users, Building2, Heart];

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
            label="Food Security — community food support in Cwebeni"
            className="h-full w-full"
            rounded="rounded-none"
            tone="warm"
            showMissingBadge={false}
          />
        )}
        {!showVideo && (
          <img src={FALLBACK_POSTER} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover -z-10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/85 via-[var(--ithemba-blue-dark)]/65 to-[var(--ithemba-blue)]/40" />
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
        <UtensilsCrossed className="h-8 w-8" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 md:pb-32 md:pt-28 lg:px-8">
        <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-white/85 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> {c.back}
        </Link>

        <div className="mt-8 max-w-3xl text-white">
          <FocusAreaBadges
            badges={["food-security", "community-health", "education", "skills-livelihoods", "disaster-relief"]}
            size="md"
            className="mb-5"
          />
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" /> {c.hero.eyebrow}
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
      <div className="pointer-events-none absolute -right-10 bottom-10 h-52 w-52 blob-2 bg-orange-300/20" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center">
          <SectionHeading eyebrow={c.snapshot.eyebrow} title={c.snapshot.title} center />
        </div>
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center text-lg leading-relaxed text-foreground/85">
          {c.snapshot.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {c.snapshot.facts.map((f, i) => {
            const Icon = SNAPSHOT_ICONS[i] ?? UtensilsCrossed;
            return (
              <div key={f.label} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-orange-200">
                  <Icon className="h-7 w-7 text-orange-700" />
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
          src={PHOTO_PARCELS}
          label="Food parcels for vulnerable families in Pondoland"
          className="h-full w-full"
          rounded="rounded-none"
          tone="warm"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ithemba-blue-deepest)]/70 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>
      <div className="pointer-events-none absolute left-10 top-16 text-[var(--ithemba-yellow)]/40"><Heart className="h-7 w-7" /></div>
      <div className="pointer-events-none absolute right-16 bottom-16 text-[var(--ithemba-yellow)]/40"><Sun className="h-8 w-8" /></div>

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

/* ---------- HAMPERS — cream with photo bubble ---------- */
function Hampers({ c }: { c: Copy }) {
  return (
    <section className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 lg:px-8">
      <div className="flex flex-col justify-center order-2 md:order-1">
        <SectionHeading eyebrow={c.hampers.eyebrow} title={c.hampers.title} />
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
          {c.hampers.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
      <div className="relative order-1 md:order-2">
        <div className="absolute -right-8 -top-8 h-28 w-28 blob bg-[var(--ithemba-yellow)]/40 -z-10" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 blob-2 bg-orange-300/30 -z-10" />
        <SmartImage
          src={PHOTO_PARCELS}
          label="Monthly food hampers distributed to families"
          className="aspect-[4/5] w-full"
          rounded="rounded-[2.5rem]"
          tone="warm"
          showMissingBadge={false}
        />
      </div>
    </section>
  );
}

/* ---------- KITCHEN — blue photo-backed ---------- */
function Kitchen({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white md:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_KITCHEN}
          label="Local women volunteers cooking in the soup kitchen"
          className="h-full w-full"
          rounded="rounded-none"
          tone="warm"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
        <div className="absolute left-[-6rem] bottom-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      </div>
      <div className="pointer-events-none absolute left-12 top-16 text-[var(--ithemba-yellow)]/40"><Soup className="h-8 w-8" /></div>
      <div className="pointer-events-none absolute right-12 top-24 text-[var(--ithemba-yellow)]/30"><HandHeart className="h-7 w-7" /></div>
      <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
            <Soup className="h-5 w-5" /> {c.kitchen.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.kitchen.title}</h2>
        </div>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-white/90">
          {c.kitchen.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- ECD MEALS — cream, photo + text ---------- */
function EcdMeals({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 blob bg-[var(--ithemba-yellow)]/30" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-48 w-48 blob-2 bg-orange-300/25" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:px-8">
        <div className="relative">
          <div className="absolute -right-8 -top-8 h-28 w-28 blob bg-[var(--ithemba-yellow)]/40 -z-10" />
          <SmartImage
            src={PHOTO_ECD_MEAL}
            label="Daily meals for children at the No.1 ECD Centre"
            className="aspect-[4/5] w-full"
            rounded="rounded-[2.5rem]"
            tone="warm"
            showMissingBadge={false}
          />
        </div>
        <div className="flex flex-col justify-center">
          <SectionHeading eyebrow={c.ecd.eyebrow} title={c.ecd.title} />
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
            {c.ecd.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-semibold text-orange-700">
              <Baby className="h-4 w-4" /> {c.ecd.chips[0]}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ithemba-yellow)]/25 px-3 py-1.5 text-sm font-semibold text-[var(--ithemba-brown)]">
              <Cookie className="h-4 w-4" /> {c.ecd.chips[1]}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-700">
              <Building2 className="h-4 w-4" /> {c.ecd.chips[2]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- GREENHOUSE CONNECTION — short, cream split ---------- */
function GreenhouseConnection({ c }: { c: Copy }) {
  return (
    <section className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 lg:px-8">
      <div className="flex flex-col justify-center order-2 md:order-1">
        <div className="hand-eyebrow-lg text-emerald-700 flex items-center gap-2">
          <Sprout className="h-5 w-5" /> {c.greenhouse.eyebrow}
        </div>
        <h2 className="-mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">{c.greenhouse.title}</h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
          {c.greenhouse.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-6">
          <Link to="/projects/greenhouse">
            <Button variant="outline" className="rounded-full border-emerald-300 text-emerald-700 hover:bg-emerald-50">
              <Leaf className="mr-2 h-4 w-4" /> Greenhouse with SA Harvest
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative order-1 md:order-2">
        <div className="absolute -left-8 -top-8 h-28 w-28 blob bg-emerald-300/40 -z-10" />
        <div className="absolute -bottom-6 -right-6 h-24 w-24 blob-2 bg-[var(--ithemba-yellow)]/30 -z-10" />
        <SmartImage
          src={PHOTO_GREENHOUSE}
          label="Fresh produce from the greenhouse supplementing ECD meals"
          className="aspect-[4/5] w-full"
          rounded="rounded-[2.5rem]"
          tone="green"
          showMissingBadge={false}
        />
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
          src={PHOTO_MEALS}
          label="Community food support across iThemba Kuluntu focus areas"
          className="h-full w-full"
          rounded="rounded-none"
          tone="warm"
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
      <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 blob-2 bg-orange-300/25" />
      <div className="pointer-events-none absolute -left-16 bottom-16 h-48 w-48 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.donation.eyebrow} title={c.donation.title} />
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">{c.donation.intro}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
          {c.donation.items.map((it) => {
            const Icon = ICONS[it.icon] ?? UtensilsCrossed;
            return (
              <div key={it.label} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-orange-200 md:h-20 md:w-20">
                  <Icon className="h-7 w-7 text-orange-700 md:h-8 md:w-8" />
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
    <section className="relative isolate overflow-hidden pt-28 pb-20 md:pt-32">
      {/* soft wave transition from the impact section above */}
      <svg
        className="pointer-events-none absolute -top-px left-0 z-10 block w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,60 C240,110 480,10 720,55 C960,100 1200,20 1440,65 L1440,0 L0,0 Z"
          fill="var(--ithemba-blue-deepest)"
          opacity="0.55"
        />
        <path
          d="M0,80 C240,30 480,120 720,75 C960,30 1200,110 1440,70 L1440,0 L0,0 Z"
          fill="var(--ithemba-blue-deepest)"
        />
      </svg>
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_KITCHEN}
          label="Support food security monthly"
          className="h-full w-full"
          rounded="rounded-none"
          tone="warm"
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
              <UtensilsCrossed className="h-6 w-6" />
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
        <Heart className="h-9 w-9 text-[var(--ithemba-yellow)]/70" />
      </div>
      <div className="pointer-events-none absolute left-16 bottom-16">
        <UtensilsCrossed className="h-7 w-7 text-[var(--ithemba-yellow)]/50" />
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
function FoodSecurityPage() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.en;
  return (
    <>
      <Hero c={c} />
      <Snapshot c={c} />
      <Wave from="var(--ithemba-cream)" to="var(--background)" />
      <Why c={c} />
      <Hampers c={c} />
      <Kitchen c={c} />
      <EcdMeals c={c} />
      <Wave from="var(--ithemba-cream)" to="var(--background)" />
      <GreenhouseConnection c={c} />
      <Focus c={c} />
      <DonationSupport c={c} />
      <Impact c={c} />
      <Monthly c={c} />
      <Closing c={c} />
    </>
  );
}
