import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Sun,
  Star,
  Utensils,
  BookOpen,
  Music,
  Moon,
  Users,
  ShieldCheck,
  Smile,
  Brain,
  HandHeart,
  School,
  Droplet,
  Sprout,
  HeartPulse,
  Wrench,
  Building2,
  Award,
  Cookie,
  Baby,
  PlayCircle,
} from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { SmartImage, SmartLogo } from "@/components/site/Asset";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { FocusAreaBadges } from "@/components/blocks/FocusAreaBadges";
import { assets } from "@/data/assets";
import { focusAreaBadgeMeta } from "@/data/projects";
import type { Lang } from "@/data/content";

export const Route = createFileRoute("/projects/ecd")({ component: EcdPage });

/* ---------- assets ---------- */
const HERO_VIDEO = "/assets/videos/projects/no1-ecd-centre-hero.mp4";
const HERO_POSTER = "/assets/photos/projects/no1-ecd-centre-hero-poster.jpg";
const FALLBACK_POSTER = assets.photos.projects.ecdHero;
const PHOTO_CLASSROOM = assets.photos.ecd.classroom;
const PHOTO_CHILD = assets.photos.ecd.childPlaying;
const PHOTO_MEAL = assets.photos.ecd.meal;

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

/* ---------- trilingual content (from /public/content/projects) ---------- */

type Fact = { label: string; value: string };
type TimelineItem = { when: string; what: string };
type RhythmItem = { time: string; what: string };
type FocusItem = { label: string; icon: "BookOpen" | "Utensils" | "Droplet" | "Wrench" | "HeartPulse" };

type Copy = {
  back: string;
  hero: {
    eyebrow: string;
    title: string; // No.1 ECD Centre
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
  importance: {
    eyebrow: string;
    title: string;
    body: string[];
    pillars: { icon: "Brain" | "Music" | "ShieldCheck" | "School" | "Cookie" | "HandHeart"; label: string }[];
  };
  building: {
    eyebrow: string;
    title: string;
    body: string[];
    timeline: TimelineItem[];
  };
  women: {
    eyebrow: string;
    title: string;
    body: string[];
    roles: string[];
  };
  provides: {
    eyebrow: string;
    title: string;
    intro: string;
    items: { icon: string; label: string }[];
  };
  rhythm: {
    eyebrow: string;
    title: string;
    intro: string;
    items: RhythmItem[];
    outro: string;
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
  impact: {
    eyebrow: string;
    title: string;
    points: string[];
    monthlyLine: string;
  };
  monthly: {
    eyebrow: string;
    title: string;
    body: string[];
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
      eyebrow: "Early Learning",
      title: "No.1 ECD Centre",
      text:
        "A safe, joyful and free-to-attend early learning centre for young children in Cwebeni — where children eat, play, learn and prepare for school while local women are trained and employed to care for their own community.",
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      location: "Cwebeni · Eastern Cape · South Africa",
      placeholder: "Hero video placeholder · ready for real ECD video",
    },
    snapshot: {
      eyebrow: "At a glance",
      title: "A stronger start for 120 children",
      body: [
        "The No.1 ECD Centre opened its doors in 2025 to provide free early childhood development support for children from vulnerable households in Cwebeni and surrounding communities.",
        "For children between birth and five years old, the centre offers what was previously missing in the community: a safe place to learn, play, eat, rest, build routines and prepare for Grade R and formal schooling.",
      ],
      facts: [
        { label: "Opened", value: "2025" },
        { label: "Children supported daily", value: "120" },
        { label: "Age group", value: "0 to 5 years" },
        { label: "Access", value: "Free-to-attend for children from vulnerable households" },
        { label: "Meals", value: "Breakfast, lunch and snacks every day" },
        { label: "Team", value: "Local teachers, cooks, carers, cleaners and support staff" },
        { label: "Built with support from", value: "FNB Care" },
        { label: "Status", value: "Registered ECD Centre" },
      ],
    },
    why: {
      eyebrow: "Why",
      title: "it matters",
      body: [
        "Before the No.1 ECD Centre, many young children in the community had no dedicated early learning space where they could prepare for school in a safe, caring and structured environment.",
        "For families living with poverty, transport barriers and limited access to paid childcare, early learning is often out of reach. This means children can arrive at school without the routines, language stimulation, play-based learning, nutrition and emotional security that help them feel ready to learn.",
        "The No.1 ECD Centre changes that daily reality. It gives children a safe and joyful place to belong. It gives caregivers support. It gives local women paid roles and training. It gives the wider community a foundation for stronger learning outcomes in the years ahead.",
        "This is not only childcare. It is early learning, nutrition, safety, local employment and community development working together.",
      ],
    },
    importance: {
      eyebrow: "The first years",
      title: "Learning begins long before school",
      body: [
        "The first years of life are a critical period for brain development. During this time, young children build the foundations for language, movement, emotional regulation, social confidence, problem-solving and later learning.",
        "Children do not only learn through formal lessons. They learn through play, rhythm, stories, songs, movement, conversation, routines and caring relationships. When children are nourished, safe and supported early, they are better prepared to enter school with confidence.",
        "ECD is one of the most powerful ways to interrupt cycles of disadvantage. A child who receives early stimulation, daily nutrition, responsive care and school-readiness support has a stronger foundation for learning — and that foundation can influence families and communities for generations.",
        "For Cwebeni, the No.1 ECD Centre is a first step toward making early learning accessible to children who would otherwise be left behind before school even begins.",
      ],
      pillars: [
        { icon: "Brain", label: "Brain development" },
        { icon: "Music", label: "Play, songs & stories" },
        { icon: "ShieldCheck", label: "Safety & routine" },
        { icon: "Cookie", label: "Daily nutrition" },
        { icon: "HandHeart", label: "Responsive care" },
        { icon: "School", label: "School readiness" },
      ],
    },
    building: {
      eyebrow: "Built with care",
      title: "From infrastructure to daily care",
      body: [
        "In 2024, FNB Care made the decision to sponsor the infrastructure for the ECD building. That support helped turn a long-held community need into a real, physical centre for children.",
        "The building was completed in April 2025. After the necessary registration and legal steps required to operate an ECD centre in South Africa, the No.1 ECD Centre opened its doors to children in 2025.",
        "The centre now stands as a place of daily care and learning. It is not only a building. It is a safe environment where children are welcomed, fed, taught, comforted, encouraged and prepared for the next step in their education.",
      ],
      timeline: [
        { when: "30 August 2024", what: "Local women begin ECD teacher training supported by FNB Care." },
        { when: "October 2024", what: "Construction of the ECD infrastructure begins." },
        { when: "March–April 2025", what: "ECD teachers take part in further workshops and practical preparation." },
        { when: "April 2025", what: "The ECD building is completed." },
        { when: "May 2025", what: "The No.1 ECD Centre officially opens its doors." },
      ],
    },
    women: {
      eyebrow: "Local strength",
      title: "Training and employing women from the community",
      body: [
        "The No.1 ECD Centre is built on the belief that communities are strongest when solutions are carried by people from within the community itself.",
        "Between 2024 and 2025, local women were trained to become ECD teachers and support young children in their own community. Today, the centre employs local teachers, cooks, carers, cleaners and support staff.",
        "This matters deeply. The centre does not only serve children — it also creates paid work, skills development and leadership opportunities for women in the community.",
        "Children are cared for by people who know their language, families, culture and daily realities. That local trust makes the centre stronger.",
      ],
      roles: ["Trained local women", "Teachers", "Cooks", "Carers", "Cleaners", "Support staff"],
    },
    provides: {
      eyebrow: "What we provide",
      title: "Care, learning, food and safety every day",
      intro:
        "Every day at the No.1 ECD Centre is built around children's real needs: nourishment, safety, stimulation, rest, routine, play and love.",
      items: [
        { icon: "BookOpen", label: "Early learning and play" },
        { icon: "Utensils", label: "Daily breakfast, lunch and snacks" },
        { icon: "ShieldCheck", label: "Safe routines and care" },
        { icon: "School", label: "School-readiness support for Grade R" },
        { icon: "Users", label: "Age-appropriate learning groups" },
        { icon: "Music", label: "Singing, dancing, stories and movement" },
        { icon: "Moon", label: "Rest and nap time" },
        { icon: "HandHeart", label: "Safe space for vulnerable households" },
        { icon: "Smile", label: "Community-led teaching and care team" },
        { icon: "Award", label: "Employment for local women" },
        { icon: "Sprout", label: "Connection to wider food security & care" },
      ],
    },
    rhythm: {
      eyebrow: "Daily rhythm",
      title: "A day built around children",
      intro:
        "The daily programme gives children structure while still allowing space for play, movement, rest and joy.",
      items: [
        { time: "08:00", what: "Centre opens" },
        { time: "08:00–09:30", what: "Free and guided play" },
        { time: "09:30–10:00", what: "Breakfast" },
        { time: "10:00", what: "Toilet routine and care time" },
        { time: "Morning circle", what: "Singing, dancing, movement and shared learning" },
        { time: "Around 10:30", what: "Age-based learning groups" },
        { time: "Around 11:00", what: "Younger children rest before lunch" },
        { time: "10:30–12:00", what: "Older children learn through guided play with teachers" },
        { time: "12:00", what: "Lunch" },
        { time: "12:30", what: "Nap time for children who need rest" },
        { time: "Afternoon", what: "Free play, care routines and calm activities" },
        { time: "14:00–15:00", what: "Goodbye circle and prayer" },
      ],
      outro:
        "The rhythm is simple, but powerful. Children know what to expect. Teachers can guide learning by age and need. Meals and rest are part of the programme, not an afterthought. Every part of the day helps children feel safe, seen and ready to grow.",
    },
    nutrition: {
      eyebrow: "More than learning",
      title: "Nutrition is part of school readiness",
      body: [
        "Children cannot learn well when they are hungry. At the No.1 ECD Centre, food is part of the learning model.",
        "Every child receives breakfast, lunch and snacks. These meals help children concentrate, build routine and feel cared for throughout the day.",
        "The centre is also connected to iThemba Kuluntu's wider food security work and the Greenhouse with SA Harvest. This connection matters because early childhood development is not separate from nutrition, household stability or community resilience.",
        "When children are fed, safe and stimulated, learning becomes possible.",
      ],
    },
    focus: {
      eyebrow: "Connected care",
      title: "One centre, many layers of impact",
      body: [
        "The No.1 ECD Centre sits at the heart of several iThemba Kuluntu focus areas.",
        "The centre supports education through early learning. It supports food security through daily meals. It supports local livelihoods by employing and training women from the community. It supports community health through routine, care, nutrition and safe spaces. Through its connection with PureFlow Amanzi, safe water and hygiene education can also become part of daily child and family wellbeing.",
        "This is why the centre is more than one project. It is a community anchor.",
      ],
      items: [
        { icon: "BookOpen", label: "Education" },
        { icon: "Utensils", label: "Food security" },
        { icon: "Droplet", label: "Safe water" },
        { icon: "Wrench", label: "Skills & livelihoods" },
        { icon: "HeartPulse", label: "Community health" },
      ],
    },
    impact: {
      eyebrow: "Impact",
      title: "What your support helps make possible",
      points: [
        "120 children attending ECD daily",
        "2 warm meals plus snacks served each day",
        "Local women trained and employed",
        "Free-to-attend access for vulnerable households",
        "A registered ECD centre in a community that previously had no dedicated early learning centre for children aged 0 to 5",
        "A safe, joyful space for learning, care and school readiness",
      ],
      monthlyLine:
        "€42 per month helps support one child for a full month of care on ECD operating days.",
    },
    monthly: {
      eyebrow: "Give monthly",
      title: "Keep the centre free for children",
      body: [
        "The No.1 ECD Centre is free to attend because the families most in need of early learning support are often the families least able to pay for childcare.",
        "Monthly support helps keep the doors open. It helps fund meals, teachers, carers, learning materials, cleaning, care routines and daily operating costs.",
        "A monthly gift does not only support one day. It helps create consistency — and consistency is what children need most.",
      ],
      cardAmount: "€42 / month",
      cardText:
        "Helps support one child for a full month of care on ECD operating days.",
      cta1: "Support a child monthly",
      cta2: "Give once to the ECD Centre",
    },
    closing: {
      eyebrow: "A stronger start",
      title: "Help keep early learning free",
      body: [
        "Every child deserves a safe place to learn, eat, play and grow. In Cwebeni, the No.1 ECD Centre is making that possible — every day.",
        "Your support helps keep the centre free for children from vulnerable households and helps local women continue caring, teaching, cooking and leading within their own community.",
      ],
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      all: "Explore All Projects",
    },
  },
  de: {
    back: "Alle Projekte",
    hero: {
      eyebrow: "Frühe Bildung",
      title: "No.1 ECD Centre",
      text:
        "Ein sicherer, liebevoller und kostenfrei zugänglicher Ort für frühkindliche Bildung in Cwebeni — an dem Kinder essen, spielen, lernen und auf die Schule vorbereitet werden, während Frauen aus der Gemeinschaft ausgebildet und beschäftigt werden, um Kinder in ihrer eigenen Gemeinde zu begleiten.",
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      location: "Cwebeni · Eastern Cape · Südafrika",
      placeholder: "Hero-Video Platzhalter · bereit für echtes ECD-Video",
    },
    snapshot: {
      eyebrow: "Auf einen Blick",
      title: "Ein starker Start für 120 Kinder",
      body: [
        "Das No.1 ECD Centre hat 2025 seine Türen geöffnet, um Kindern aus vulnerablen Haushalten in Cwebeni und den umliegenden Gemeinden kostenfreie frühkindliche Förderung zu ermöglichen.",
        "Für Kinder von Geburt bis fünf Jahren bietet das Centre etwas, das in der Gemeinschaft zuvor fehlte: einen sicheren Ort zum Lernen, Spielen, Essen, Ausruhen, zum Aufbau verlässlicher Routinen und zur Vorbereitung auf Grade R und den weiteren Schulweg.",
      ],
      facts: [
        { label: "Eröffnet", value: "2025" },
        { label: "Kinder täglich betreut", value: "120" },
        { label: "Altersgruppe", value: "0 bis 5 Jahre" },
        { label: "Zugang", value: "Kostenfrei für Kinder aus vulnerablen Haushalten" },
        { label: "Mahlzeiten", value: "Frühstück, Mittagessen und Snacks jeden Tag" },
        { label: "Team", value: "Lokale Lehrkräfte, Köchinnen, Betreuung, Reinigung und Mitarbeitende" },
        { label: "Gebaut mit Unterstützung von", value: "FNB Care" },
        { label: "Status", value: "Registriertes ECD Centre" },
      ],
    },
    why: {
      eyebrow: "Warum",
      title: "es wichtig ist",
      body: [
        "Vor dem No.1 ECD Centre hatten viele kleine Kinder in der Gemeinde keinen eigenen Ort für frühkindliche Bildung, an dem sie in einem sicheren, fürsorglichen und strukturierten Umfeld auf die Schule vorbereitet werden konnten.",
        "Für Familien, die mit Armut, eingeschränkter Mobilität und fehlendem Zugang zu bezahlbarer Kinderbetreuung leben, ist frühe Bildung oft unerreichbar. Viele Kinder kommen dadurch in die Schule, ohne die Routinen, sprachliche Anregung, spielerischen Lernerfahrungen, Ernährung und emotionale Sicherheit, die ihnen helfen, mit Vertrauen zu lernen.",
        "Das No.1 ECD Centre verändert diese tägliche Realität. Es gibt Kindern einen sicheren und fröhlichen Ort, an dem sie dazugehören. Es entlastet Bezugspersonen. Es schafft bezahlte Arbeit und Ausbildungsmöglichkeiten für Frauen aus der Gemeinschaft. Und es legt eine Grundlage für bessere Bildungswege in den kommenden Jahren.",
        "Das ist nicht nur Kinderbetreuung. Es ist frühe Bildung, Ernährung, Schutz, lokale Beschäftigung und Gemeindeentwicklung in einem.",
      ],
    },
    importance: {
      eyebrow: "Die ersten Jahre",
      title: "Lernen beginnt lange vor der Schule",
      body: [
        "Die ersten Lebensjahre sind eine entscheidende Phase für die Entwicklung des Gehirns. In dieser Zeit entstehen grundlegende Fähigkeiten für Sprache, Bewegung, emotionale Regulation, soziales Vertrauen, Problemlösung und späteres Lernen.",
        "Kinder lernen nicht nur durch formale Unterrichtseinheiten. Sie lernen durch Spiel, Rhythmus, Geschichten, Lieder, Bewegung, Gespräche, verlässliche Routinen und zugewandte Beziehungen. Wenn Kinder früh ausreichend ernährt, geschützt und gefördert werden, gehen sie sicherer und besser vorbereitet in die Schule.",
        "Frühkindliche Bildung ist einer der wirksamsten Wege, Kreisläufe von Benachteiligung zu durchbrechen. Ein Kind, das frühe Anregung, tägliche Ernährung, verlässliche Fürsorge und Schulvorbereitung erhält, baut eine stärkere Grundlage für das Lernen auf — und diese Grundlage kann Familien und Gemeinschaften über Generationen hinweg beeinflussen.",
        "Für Cwebeni ist das No.1 ECD Centre ein wichtiger Schritt, um frühe Bildung für Kinder zugänglich zu machen, die sonst bereits vor dem Schuleintritt zurückgelassen würden.",
      ],
      pillars: [
        { icon: "Brain", label: "Gehirnentwicklung" },
        { icon: "Music", label: "Spiel, Lieder & Geschichten" },
        { icon: "ShieldCheck", label: "Sicherheit & Routine" },
        { icon: "Cookie", label: "Tägliche Ernährung" },
        { icon: "HandHeart", label: "Zugewandte Fürsorge" },
        { icon: "School", label: "Schulreife" },
      ],
    },
    building: {
      eyebrow: "Mit Sorgfalt gebaut",
      title: "Von der Infrastruktur zur täglichen Fürsorge",
      body: [
        "Im Jahr 2024 entschied sich FNB Care, die Infrastruktur für das ECD-Gebäude zu unterstützen. Diese Förderung half dabei, einen lang bestehenden Bedarf der Gemeinschaft in einen realen, physischen Ort für Kinder zu verwandeln.",
        "Das Gebäude wurde im April 2025 fertiggestellt. Nach den notwendigen Registrierungs- und rechtlichen Schritten, die für den Betrieb eines ECD Centres in Südafrika erforderlich sind, öffnete das No.1 ECD Centre 2025 seine Türen für Kinder.",
        "Heute ist das Centre ein Ort täglicher Fürsorge und Bildung. Es ist nicht nur ein Gebäude. Es ist ein sicherer Raum, in dem Kinder willkommen geheißen, ernährt, unterrichtet, getröstet, ermutigt und auf den nächsten Schritt ihres Bildungswegs vorbereitet werden.",
      ],
      timeline: [
        { when: "30. August 2024", what: "Frauen aus der Gemeinschaft beginnen die Ausbildung zu ECD-Lehrkräften, unterstützt von FNB Care." },
        { when: "Oktober 2024", what: "Der Bau der ECD-Infrastruktur beginnt." },
        { when: "März–April 2025", what: "Die ECD-Lehrkräfte nehmen an weiteren Workshops und praktischer Vorbereitung teil." },
        { when: "April 2025", what: "Das ECD-Gebäude wird fertiggestellt." },
        { when: "Mai 2025", what: "Das No.1 ECD Centre öffnet offiziell seine Türen." },
      ],
    },
    women: {
      eyebrow: "Lokale Stärke",
      title: "Frauen aus der Gemeinschaft ausbilden und beschäftigen",
      body: [
        "Das No.1 ECD Centre basiert auf der Überzeugung, dass Gemeinschaften am stärksten sind, wenn Lösungen von Menschen aus der Gemeinschaft selbst getragen werden.",
        "Zwischen 2024 und 2025 wurden Frauen aus der Gemeinde ausgebildet, um als ECD-Lehrkräfte kleine Kinder in ihrer eigenen Gemeinschaft zu begleiten. Heute beschäftigt das Centre lokale Lehrkräfte, Köchinnen, Betreuungspersonen, Reinigungskräfte und unterstützende Mitarbeitende.",
        "Das ist von großer Bedeutung. Das Centre unterstützt nicht nur Kinder — es schafft auch bezahlte Arbeit, Qualifizierung und Führungsmöglichkeiten für Frauen vor Ort.",
        "Die Kinder werden von Menschen betreut, die ihre Sprache, Familien, Kultur und alltäglichen Lebensrealitäten kennen. Dieses lokale Vertrauen macht das Centre stärker.",
      ],
      roles: ["Ausgebildete Frauen vor Ort", "Lehrkräfte", "Köchinnen", "Betreuung", "Reinigung", "Unterstützendes Team"],
    },
    provides: {
      eyebrow: "Was wir ermöglichen",
      title: "Fürsorge, Lernen, Ernährung und Sicherheit jeden Tag",
      intro:
        "Jeder Tag im No.1 ECD Centre orientiert sich an den tatsächlichen Bedürfnissen der Kinder: Nahrung, Sicherheit, Anregung, Ruhe, Routine, Spiel und Zuwendung.",
      items: [
        { icon: "BookOpen", label: "Frühkindliches Lernen und Spiel" },
        { icon: "Utensils", label: "Tägliches Frühstück, Mittagessen und Snacks" },
        { icon: "ShieldCheck", label: "Sichere Routinen und verlässliche Betreuung" },
        { icon: "School", label: "Vorbereitung auf Grade R" },
        { icon: "Users", label: "Altersgerechte Lerngruppen" },
        { icon: "Music", label: "Singen, Tanzen, Geschichten und Bewegung" },
        { icon: "Moon", label: "Ruhe- und Schlafzeiten" },
        { icon: "HandHeart", label: "Sicherer Ort für vulnerable Haushalte" },
        { icon: "Smile", label: "Gemeindegeführtes Lehr- und Betreuungsteam" },
        { icon: "Award", label: "Arbeitsplätze für Frauen vor Ort" },
        { icon: "Sprout", label: "Verbindung zu Ernährungssicherheit & Fürsorge" },
      ],
    },
    rhythm: {
      eyebrow: "Täglicher Rhythmus",
      title: "Ein Tag, der sich an den Kindern orientiert",
      intro:
        "Das tägliche Programm gibt Kindern Struktur und lässt zugleich Raum für Spiel, Bewegung, Ruhe und Freude.",
      items: [
        { time: "08:00", what: "Das Centre öffnet" },
        { time: "08:00–09:30", what: "Freies und angeleitetes Spiel" },
        { time: "09:30–10:00", what: "Frühstück" },
        { time: "10:00", what: "Toilettenroutine und Pflegezeit" },
        { time: "Morgenkreis", what: "Singen, Tanzen, Bewegung und gemeinsames Lernen" },
        { time: "Gegen 10:30", what: "Altersgerechte Lerngruppen" },
        { time: "Gegen 11:00", what: "Jüngere Kinder ruhen sich vor dem Mittagessen aus" },
        { time: "10:30–12:00", what: "Ältere Kinder lernen spielerisch und angeleitet mit den Lehrkräften" },
        { time: "12:00", what: "Mittagessen" },
        { time: "12:30", what: "Schlafenszeit für Kinder, die Ruhe brauchen" },
        { time: "Nachmittag", what: "Freies Spiel, Pflegeroutinen und ruhige Aktivitäten" },
        { time: "14:00–15:00", what: "Abschlusskreis und Gebet" },
      ],
      outro:
        "Der Tagesrhythmus ist einfach, aber wirkungsvoll. Kinder wissen, was sie erwartet. Lehrkräfte können Lernen nach Alter und Bedarf begleiten. Mahlzeiten und Ruhezeiten sind Teil des pädagogischen Alltags, nicht nur Ergänzung. Jeder Abschnitt des Tages hilft Kindern, sich sicher, gesehen und bereit zum Wachsen zu fühlen.",
    },
    nutrition: {
      eyebrow: "Mehr als Lernen",
      title: "Ernährung ist Teil von Schulreife",
      body: [
        "Kinder können nicht gut lernen, wenn sie hungrig sind. Im No.1 ECD Centre ist Ernährung Teil des Bildungsansatzes.",
        "Jedes Kind erhält Frühstück, Mittagessen und Snacks. Diese Mahlzeiten helfen Kindern, sich zu konzentrieren, Routinen aufzubauen und sich über den Tag hinweg versorgt und sicher zu fühlen.",
        "Das Centre ist außerdem mit der weiteren Arbeit von iThemba Kuluntu im Bereich Ernährungssicherheit und dem Greenhouse mit SA Harvest verbunden. Diese Verbindung ist wichtig, weil frühkindliche Entwicklung nicht getrennt von Ernährung, Haushaltsstabilität und der Widerstandskraft einer Gemeinschaft betrachtet werden kann.",
        "Wenn Kinder satt, sicher und angeregt sind, wird Lernen möglich.",
      ],
    },
    focus: {
      eyebrow: "Verbundene Fürsorge",
      title: "Ein Centre, viele Ebenen von Wirkung",
      body: [
        "Das No.1 ECD Centre liegt im Herzen mehrerer Arbeitsschwerpunkte von iThemba Kuluntu.",
        "Das Centre stärkt Bildung durch frühkindliches Lernen. Es stärkt Ernährungssicherheit durch tägliche Mahlzeiten. Es stärkt lokale Lebensgrundlagen, indem Frauen aus der Gemeinschaft ausgebildet und beschäftigt werden. Es stärkt Gemeindegesundheit durch Routine, Fürsorge, Ernährung und sichere Räume. Durch die Verbindung mit PureFlow Amanzi können sicheres Wasser und Hygieneaufklärung ebenfalls Teil des täglichen Wohlbefindens von Kindern und Familien werden.",
        "Deshalb ist das Centre mehr als ein einzelnes Projekt. Es ist ein Ankerpunkt für die Gemeinschaft.",
      ],
      items: [
        { icon: "BookOpen", label: "Bildung" },
        { icon: "Utensils", label: "Ernährungssicherheit" },
        { icon: "Droplet", label: "Sicheres Wasser" },
        { icon: "Wrench", label: "Kompetenzen & Lebensgrundlagen" },
        { icon: "HeartPulse", label: "Gemeindegesundheit" },
      ],
    },
    impact: {
      eyebrow: "Wirkung",
      title: "Was Ihre Unterstützung möglich macht",
      points: [
        "120 Kinder besuchen täglich das ECD Centre",
        "2 warme Mahlzeiten plus Snacks jeden Tag",
        "Frauen aus der Gemeinschaft wurden ausgebildet und beschäftigt",
        "Kostenfreier Zugang für vulnerable Haushalte",
        "Ein registriertes ECD Centre in einer Gemeinschaft, die zuvor keinen eigenen Ort für frühkindliche Bildung für Kinder von 0 bis 5 Jahren hatte",
        "Ein sicherer und fröhlicher Ort für Lernen, Fürsorge und Schulvorbereitung",
      ],
      monthlyLine:
        "42 € pro Monat helfen, ein Kind einen vollen Monat lang an den Betriebstagen des ECD Centre zu unterstützen.",
    },
    monthly: {
      eyebrow: "Monatlich geben",
      title: "Helfen Sie, das Centre für Kinder kostenfrei zu halten",
      body: [
        "Das No.1 ECD Centre ist kostenfrei zugänglich, weil gerade die Familien, die frühkindliche Förderung am dringendsten brauchen, sich Kinderbetreuung oft nicht leisten können.",
        "Monatliche Unterstützung hilft, die Türen offen zu halten. Sie trägt zu Mahlzeiten, Lehrkräften, Betreuung, Lernmaterialien, Reinigung, Pflegeroutinen und den täglichen Betriebskosten bei.",
        "Eine monatliche Spende unterstützt nicht nur einen einzelnen Tag. Sie schafft Verlässlichkeit — und genau diese Verlässlichkeit brauchen Kinder am meisten.",
      ],
      cardAmount: "42 € / Monat",
      cardText:
        "Hilft, ein Kind einen vollen Monat lang an den Betriebstagen des ECD Centre zu unterstützen.",
      cta1: "Ein Kind monatlich unterstützen",
      cta2: "Einmalig für das ECD Centre spenden",
    },
    closing: {
      eyebrow: "Ein starker Start",
      title: "Helfen Sie, frühe Bildung kostenfrei zu halten",
      body: [
        "Jedes Kind verdient einen sicheren Ort zum Lernen, Essen, Spielen und Wachsen. In Cwebeni macht das No.1 ECD Centre genau das möglich — jeden Tag.",
        "Ihre Unterstützung hilft, das Centre für Kinder aus vulnerablen Haushalten kostenfrei zu halten und ermöglicht Frauen vor Ort, weiterhin in ihrer eigenen Gemeinschaft zu betreuen, zu lehren, zu kochen und Verantwortung zu übernehmen.",
      ],
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      all: "Alle Projekte entdecken",
    },
  },
  nl: {
    back: "Alle projecten",
    hero: {
      eyebrow: "Vroege ontwikkeling",
      title: "No.1 ECD Centre",
      text:
        "Een veilige, liefdevolle en kosteloos toegankelijke plek voor jonge kinderen in Cwebeni — waar kinderen eten, spelen, leren en worden voorbereid op school, terwijl vrouwen uit de gemeenschap worden opgeleid en in dienst genomen om kinderen in hun eigen gemeenschap te begeleiden.",
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      location: "Cwebeni · Eastern Cape · Zuid-Afrika",
      placeholder: "Hero-video placeholder · klaar voor echte ECD-video",
    },
    snapshot: {
      eyebrow: "In één oogopslag",
      title: "Een sterke start voor 120 kinderen",
      body: [
        "Het No.1 ECD Centre opende in 2025 zijn deuren om jonge kinderen uit kwetsbare huishoudens in Cwebeni en omliggende gemeenschappen kosteloze vroegschoolse ontwikkeling en zorg te bieden.",
        "Voor kinderen van 0 tot 5 jaar biedt het Centre iets wat in de gemeenschap eerder ontbrak: een veilige plek om te leren, spelen, eten, rusten, routines op te bouwen en zich voor te bereiden op Grade R en de verdere schoolloopbaan.",
      ],
      facts: [
        { label: "Geopend", value: "2025" },
        { label: "Kinderen dagelijks ondersteund", value: "120" },
        { label: "Leeftijdsgroep", value: "0 tot 5 jaar" },
        { label: "Toegang", value: "Kosteloos voor kinderen uit kwetsbare huishoudens" },
        { label: "Maaltijden", value: "Elke dag ontbijt, lunch en snacks" },
        { label: "Team", value: "Lokale leerkrachten, koks, verzorgers, schoonmakers en ondersteuning" },
        { label: "Gebouwd met steun van", value: "FNB Care" },
        { label: "Status", value: "Geregistreerd ECD Centre" },
      ],
    },
    why: {
      eyebrow: "Waarom",
      title: "het ertoe doet",
      body: [
        "Vóór het No.1 ECD Centre hadden veel jonge kinderen in de gemeenschap geen eigen plek voor vroege ontwikkeling, waar zij in een veilige, zorgzame en gestructureerde omgeving konden worden voorbereid op school.",
        "Voor gezinnen die leven met armoede, beperkte vervoersmogelijkheden en weinig toegang tot betaalbare kinderopvang, is vroege ontwikkeling vaak buiten bereik. Daardoor kunnen kinderen aan school beginnen zonder de routines, taalstimulering, spelenderwijs leren, voeding en emotionele veiligheid die hen helpen om met vertrouwen te leren.",
        "Het No.1 ECD Centre verandert die dagelijkse werkelijkheid. Het geeft kinderen een veilige en vrolijke plek waar ze thuishoren. Het ondersteunt verzorgers en gezinnen. Het creëert betaald werk en opleidingsmogelijkheden voor vrouwen uit de gemeenschap. En het legt een basis voor sterkere leertrajecten in de jaren die volgen.",
        "Dit is niet alleen kinderopvang. Het is vroege ontwikkeling, voeding, veiligheid, lokale werkgelegenheid en gemeenschapsontwikkeling in één.",
      ],
    },
    importance: {
      eyebrow: "De eerste jaren",
      title: "Leren begint lang vóór school",
      body: [
        "De eerste levensjaren zijn een bepalende periode voor de ontwikkeling van een kind. In deze jaren worden de fundamenten gelegd voor taal, beweging, emotionele regulatie, sociaal vertrouwen, probleemoplossend vermogen en later leren.",
        "Kinderen leren niet alleen door formele lessen. Ze leren door spel, ritme, verhalen, liedjes, beweging, gesprekken, voorspelbare routines en liefdevolle relaties. Wanneer kinderen vroeg voldoende voeding, veiligheid en stimulans krijgen, gaan zij met meer vertrouwen en een sterkere basis naar school.",
        "Vroegschoolse ontwikkeling is een van de krachtigste manieren om achterstand te doorbreken. Een kind dat vroege stimulering, dagelijkse voeding, betrouwbare zorg en schoolvoorbereiding krijgt, bouwt een stevigere basis voor leren op — een basis die gezinnen en gemeenschappen voor generaties kan beïnvloeden.",
        "Voor Cwebeni is het No.1 ECD Centre een belangrijke stap om vroege ontwikkeling bereikbaar te maken voor kinderen die anders al vóór hun eerste schooldag op achterstand zouden staan.",
      ],
      pillars: [
        { icon: "Brain", label: "Hersenontwikkeling" },
        { icon: "Music", label: "Spel, liedjes & verhalen" },
        { icon: "ShieldCheck", label: "Veiligheid & routine" },
        { icon: "Cookie", label: "Dagelijkse voeding" },
        { icon: "HandHeart", label: "Liefdevolle zorg" },
        { icon: "School", label: "Schoolrijpheid" },
      ],
    },
    building: {
      eyebrow: "Met zorg gebouwd",
      title: "Van infrastructuur naar dagelijkse zorg",
      body: [
        "In 2024 besloot FNB Care de infrastructuur voor het ECD-gebouw te ondersteunen. Die steun hielp om een lang bestaande behoefte in de gemeenschap om te zetten in een echte, fysieke plek voor kinderen.",
        "Het gebouw werd in april 2025 voltooid. Na de noodzakelijke registratie en wettelijke stappen die nodig zijn om een ECD Centre in Zuid-Afrika te openen en te exploiteren, opende het No.1 ECD Centre in 2025 zijn deuren voor kinderen.",
        "Vandaag is het Centre een plek van dagelijkse zorg en ontwikkeling. Het is niet alleen een gebouw. Het is een veilige omgeving waar kinderen welkom zijn, eten krijgen, leren, getroost worden, aangemoedigd worden en voorbereid worden op de volgende stap in hun onderwijs.",
      ],
      timeline: [
        { when: "30 augustus 2024", what: "Vrouwen uit de gemeenschap beginnen aan de ECD-leerkrachtenopleiding, ondersteund door FNB Care." },
        { when: "Oktober 2024", what: "De bouw van de ECD-infrastructuur begint." },
        { when: "Maart–april 2025", what: "De ECD-leerkrachten nemen deel aan verdere workshops en praktische voorbereiding." },
        { when: "April 2025", what: "Het ECD-gebouw wordt voltooid." },
        { when: "Mei 2025", what: "Het No.1 ECD Centre opent officieel zijn deuren." },
      ],
    },
    women: {
      eyebrow: "Lokale kracht",
      title: "Vrouwen uit de gemeenschap opleiden en in dienst nemen",
      body: [
        "Het No.1 ECD Centre is gebouwd op de overtuiging dat gemeenschappen het sterkst zijn wanneer oplossingen worden gedragen door mensen uit de gemeenschap zelf.",
        "Tussen 2024 en 2025 werden lokale vrouwen opgeleid om als ECD-leerkrachten jonge kinderen in hun eigen gemeenschap te begeleiden. Vandaag biedt het Centre werk aan lokale leerkrachten, koks, verzorgers, schoonmakers en ondersteunende teamleden.",
        "Dat is van grote betekenis. Het Centre ondersteunt niet alleen kinderen — het creëert ook betaald werk, vaardigheidsontwikkeling en leiderschapskansen voor vrouwen ter plaatse.",
        "Kinderen worden begeleid door mensen die hun taal, families, cultuur en dagelijkse realiteit kennen. Dat lokale vertrouwen maakt het Centre sterker.",
      ],
      roles: ["Opgeleide lokale vrouwen", "Leerkrachten", "Koks", "Verzorgers", "Schoonmakers", "Ondersteunend team"],
    },
    provides: {
      eyebrow: "Wat we bieden",
      title: "Zorg, leren, voeding en veiligheid — elke dag",
      intro:
        "Elke dag in het No.1 ECD Centre is opgebouwd rond wat kinderen werkelijk nodig hebben: voeding, veiligheid, stimulans, rust, routine, spel en geborgenheid.",
      items: [
        { icon: "BookOpen", label: "Vroeg leren en spel" },
        { icon: "Utensils", label: "Dagelijks ontbijt, lunch en snacks" },
        { icon: "ShieldCheck", label: "Veilige routines en zorg" },
        { icon: "School", label: "Voorbereiding op Grade R" },
        { icon: "Users", label: "Leergroepen passend bij leeftijd" },
        { icon: "Music", label: "Zingen, dansen, verhalen en beweging" },
        { icon: "Moon", label: "Rust- en slaaptijd" },
        { icon: "HandHeart", label: "Veilige plek voor kwetsbare huishoudens" },
        { icon: "Smile", label: "Lokaal onderwijs- en zorgteam" },
        { icon: "Award", label: "Werkgelegenheid voor lokale vrouwen" },
        { icon: "Sprout", label: "Verbinding met voedselzekerheid & zorg" },
      ],
    },
    rhythm: {
      eyebrow: "Dagelijks ritme",
      title: "Een dag opgebouwd rond kinderen",
      intro:
        "Het dagelijkse programma geeft kinderen structuur en laat tegelijk ruimte voor spel, beweging, rust en plezier.",
      items: [
        { time: "08:00", what: "Het Centre opent" },
        { time: "08:00–09:30", what: "Vrij en begeleid spel" },
        { time: "09:30–10:00", what: "Ontbijt" },
        { time: "10:00", what: "Toiletroutine en verzorging" },
        { time: "Ochtendkring", what: "Zingen, dansen, bewegen en samen leren" },
        { time: "Rond 10:30", what: "Leergroepen per leeftijd" },
        { time: "Rond 11:00", what: "Jongere kinderen rusten vóór de lunch" },
        { time: "10:30–12:00", what: "Oudere kinderen leren spelenderwijs onder begeleiding" },
        { time: "12:00", what: "Lunch" },
        { time: "12:30", what: "Slaaptijd voor kinderen die rust nodig hebben" },
        { time: "Middag", what: "Vrij spel, verzorgingsroutines en rustige activiteiten" },
        { time: "14:00–15:00", what: "Afsluitkring en gebed" },
      ],
      outro:
        "Het dagritme is eenvoudig, maar krachtig. Kinderen weten wat zij kunnen verwachten. Leerkrachten kunnen leren begeleiden op basis van leeftijd en behoefte. Maaltijden en rustmomenten zijn onderdeel van het programma, geen bijzaak. Elk moment van de dag helpt kinderen zich veilig, gezien en klaar om te groeien te voelen.",
    },
    nutrition: {
      eyebrow: "Meer dan leren",
      title: "Voeding hoort bij schoolrijpheid",
      body: [
        "Kinderen kunnen niet goed leren wanneer ze honger hebben. In het No.1 ECD Centre is voeding onderdeel van de ontwikkelingsaanpak.",
        "Elk kind krijgt ontbijt, lunch en snacks. Deze maaltijden helpen kinderen zich te concentreren, routines op te bouwen en zich door de dag heen verzorgd en veilig te voelen.",
        "Het Centre is ook verbonden met het bredere werk van iThemba Kuluntu rond voedselzekerheid en de Greenhouse met SA Harvest. Die verbinding is belangrijk, omdat vroegschoolse ontwikkeling niet losstaat van voeding, stabiliteit thuis en de veerkracht van de gemeenschap.",
        "Wanneer kinderen gevoed, veilig en gestimuleerd worden, wordt leren mogelijk.",
      ],
    },
    focus: {
      eyebrow: "Verbonden zorg",
      title: "Eén Centre, meerdere lagen van impact",
      body: [
        "Het No.1 ECD Centre staat centraal binnen verschillende focusgebieden van iThemba Kuluntu.",
        "Het Centre versterkt educatie door vroege ontwikkeling en spelenderwijs leren. Het versterkt voedselzekerheid door dagelijkse maaltijden. Het ondersteunt lokale bestaansmogelijkheden door vrouwen uit de gemeenschap op te leiden en in dienst te nemen. Het versterkt gemeenschapsgezondheid door routine, zorg, voeding en veilige ruimtes. Door de verbinding met PureFlow Amanzi kunnen veilig water en hygiëne-educatie ook onderdeel worden van het dagelijkse welzijn van kinderen en gezinnen.",
        "Daarom is het Centre meer dan één project. Het is een ankerpunt voor de gemeenschap.",
      ],
      items: [
        { icon: "BookOpen", label: "Educatie" },
        { icon: "Utensils", label: "Voedselzekerheid" },
        { icon: "Droplet", label: "Veilig water" },
        { icon: "Wrench", label: "Vaardigheden & bestaansmogelijkheden" },
        { icon: "HeartPulse", label: "Gemeenschapsgezondheid" },
      ],
    },
    impact: {
      eyebrow: "Impact",
      title: "Wat uw steun mogelijk maakt",
      points: [
        "120 kinderen bezoeken dagelijks het ECD Centre",
        "2 warme maaltijden plus snacks per dag",
        "Vrouwen uit de gemeenschap zijn opgeleid en in dienst genomen",
        "Kosteloze toegang voor kwetsbare huishoudens",
        "Een geregistreerd ECD Centre in een gemeenschap die eerder geen eigen plek had voor vroege ontwikkeling voor kinderen van 0 tot 5 jaar",
        "Een veilige en vrolijke plek voor leren, zorg en schoolvoorbereiding",
      ],
      monthlyLine:
        "€42 per maand helpt één kind een volledige maand zorg te ontvangen op de openingsdagen van het ECD Centre.",
    },
    monthly: {
      eyebrow: "Geef maandelijks",
      title: "Help het Centre kosteloos te houden voor kinderen",
      body: [
        "Het No.1 ECD Centre is kosteloos toegankelijk omdat juist de gezinnen die vroege ontwikkeling het hardst nodig hebben, kinderopvang vaak niet kunnen betalen.",
        "Maandelijkse steun helpt de deuren open te houden. Het draagt bij aan maaltijden, leerkrachten, verzorgers, leermaterialen, schoonmaak, zorgroutines en dagelijkse operationele kosten.",
        "Een maandelijkse gift ondersteunt niet alleen één dag. Zij maakt continuïteit mogelijk — en juist die continuïteit hebben kinderen het meest nodig.",
      ],
      cardAmount: "€42 / maand",
      cardText:
        "Helpt één kind een volledige maand zorg te ontvangen op de openingsdagen van het ECD Centre.",
      cta1: "Ondersteun een kind maandelijks",
      cta2: "Eenmalig doneren aan het ECD Centre",
    },
    closing: {
      eyebrow: "Een sterke start",
      title: "Help vroege ontwikkeling kosteloos te houden",
      body: [
        "Elk kind verdient een veilige plek om te leren, eten, spelen en groeien. In Cwebeni maakt het No.1 ECD Centre dat elke dag mogelijk.",
        "Uw steun helpt het Centre kosteloos te houden voor kinderen uit kwetsbare huishoudens en helpt lokale vrouwen om in hun eigen gemeenschap te blijven zorgen, onderwijzen, koken en verantwoordelijkheid dragen.",
      ],
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      all: "Alle projecten bekijken",
    },
  },
};

/* ---------- icon helper ---------- */
const ICONS: Record<string, typeof BookOpen> = {
  BookOpen,
  Utensils,
  ShieldCheck,
  School,
  Users,
  Music,
  Moon,
  HandHeart,
  Smile,
  Award,
  Sprout,
  Droplet,
  Wrench,
  HeartPulse,
  Brain,
  Cookie,
};

/* ---------- Doodle SVGs ---------- */
function SunDoodle({ className = "h-8 w-8 text-[var(--ithemba-yellow)]" }) {
  return <Sun className={className} aria-hidden />;
}
function SparkleDoodle({ className = "h-5 w-5 text-[var(--ithemba-yellow)]" }) {
  return <Sparkles className={className} aria-hidden />;
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
            label="No.1 ECD Centre — children at the early learning centre"
            className="h-full w-full"
            rounded="rounded-none"
            tone="sun"
            showMissingBadge={false}
          />
        )}
        {/* on poster fallback fall back to existing ecd hero so something always shows */}
        {!showVideo && (
          <img
            src={FALLBACK_POSTER}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover -z-10"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/80 via-[var(--ithemba-blue-dark)]/60 to-[var(--ithemba-blue)]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>

      {/* Placeholder badge */}
      <div className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 ring-1 ring-white/15 backdrop-blur">
        <PlayCircle className="h-3.5 w-3.5 text-[var(--ithemba-yellow)]" />
        {c.hero.placeholder}
      </div>

      {/* Logo */}
      <div className="absolute right-4 top-14 z-10 md:right-8 md:top-16">
        <SmartLogo
          src={assets.logos.no1Ecd}
          alt="No.1 ECD Centre logo"
          className="h-20 w-auto max-w-[10rem] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] md:h-28 md:max-w-[13rem]"
          showMissingBadge={false}
          fallback={<span className="sr-only">No.1 ECD Centre</span>}
        />
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
            badges={["education", "food-security", "safe-water", "skills-livelihoods", "community-health"]}
            size="md"
            className="mb-5"
          />
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm flex items-center gap-2">
            <SparkleDoodle /> {c.hero.eyebrow}
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

      <svg className="block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="var(--background)"
        />
      </svg>
    </section>
  );
}

/* ---------- Eyebrow / heading helper ---------- */
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

/* ---------- SNAPSHOT ---------- */
function Snapshot({ c }: { c: Copy }) {
  const factIcons = [Sparkles, Baby, Smile, ShieldCheck, Utensils, Users, Building2, Award];
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -left-10 top-10 h-44 w-44 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-52 w-52 blob-2 bg-[var(--ithemba-blue)]/15" />
      <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
        <div className="text-center">
          <SectionHeading eyebrow={c.snapshot.eyebrow} title={c.snapshot.title} center />
        </div>
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center text-lg leading-relaxed text-foreground/85">
          {c.snapshot.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {c.snapshot.facts.map((f, i) => {
            const Icon = factIcons[i % factIcons.length];
            const tones = [
              "bg-[var(--ithemba-yellow)]/25 text-[var(--ithemba-yellow-warm)]",
              "bg-[var(--ithemba-blue)]/15 text-[var(--ithemba-blue-dark)]",
            ];
            return (
              <div key={f.label} className="flex flex-col items-center text-center">
                <div
                  className={`flex h-16 w-16 items-center justify-center ${tones[i % 2]}`}
                  style={{
                    borderRadius:
                      i % 2 === 0
                        ? "60% 40% 55% 45% / 50% 60% 40% 50%"
                        : "9999px",
                  }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div className="mt-3 font-display text-xl font-extrabold leading-tight text-[var(--ithemba-blue-dark)]">
                  {f.value}
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/60">
                  {f.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- WHY ---------- */
function Why({ c }: { c: Copy }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 lg:px-8">
      <div className="relative">
        <div className="absolute -left-6 -top-6 h-24 w-24 blob bg-[var(--ithemba-yellow)]/35 -z-10" />
        <SmartImage
          src={PHOTO_CHILD}
          label="Children at the No.1 ECD Centre"
          className="aspect-[4/5] w-full"
          rounded="rounded-[2.5rem]"
          tone="sun"
          showMissingBadge={false}
        />
        <div className="absolute -bottom-5 -right-5 hidden h-24 w-24 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] shadow-xl md:flex">
          <Heart className="h-9 w-9 fill-current" />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <SectionHeading eyebrow={c.why.eyebrow} title={c.why.title} />
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
          {c.why.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- IMPORTANCE (ECD matters) ---------- */
function Importance({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-blue-deepest)] py-20 text-white">
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 sun-glow" />
      <div className="pointer-events-none absolute left-10 bottom-10 h-32 w-32 blob bg-white/5" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)]">{c.importance.eyebrow}</div>
        <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.importance.title}</h2>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="space-y-4 text-lg leading-relaxed text-white/90">
            {c.importance.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 self-start sm:grid-cols-3">
            {c.importance.pillars.map((p) => {
              const Icon = ICONS[p.icon];
              return (
                <div
                  key={p.label}
                  className="rounded-3xl bg-white/8 p-5 text-center ring-1 ring-white/10 backdrop-blur"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ithemba-yellow)]/20 text-[var(--ithemba-yellow)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-3 text-sm font-semibold leading-snug">{p.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- BUILDING + TIMELINE ---------- */
function Building({ c }: { c: Copy }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow={c.building.eyebrow} title={c.building.title} />
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
            {c.building.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ithemba-yellow)]/20 px-4 py-2 text-sm font-semibold text-[var(--ithemba-brown)]">
            <Building2 className="h-4 w-4" /> FNB Care — infrastructure partner
          </div>
        </div>
        <div className="relative">
          <div className="absolute -right-6 -top-6 h-24 w-24 blob-3 bg-[var(--ithemba-blue)]/15 -z-10" />
          <SmartImage
            src={PHOTO_CLASSROOM}
            label="No.1 ECD Centre — classroom"
            className="aspect-[4/3] w-full"
            rounded="rounded-[2.5rem]"
            tone="blue"
            showMissingBadge={false}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-14">
        <div className="hand-eyebrow">Timeline</div>
        <div className="relative mt-4">
          <div className="absolute left-0 right-0 top-6 hidden h-1 rounded-full bg-[var(--ithemba-yellow)]/40 md:block" />
          <ol className="grid gap-6 md:grid-cols-4">
            {c.building.timeline.map((t, i) => (
              <li key={i} className="relative">
                <div className="flex md:flex-col md:items-center md:text-center">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] shadow-md ring-4 ring-[var(--background)]">
                    <span className="text-sm font-bold">{i + 1}</span>
                  </div>
                  <div className="ml-4 md:ml-0 md:mt-3">
                    <div className="font-display text-lg font-bold text-[var(--ithemba-blue-dark)]">
                      {t.when}
                    </div>
                    <div className="mt-1 text-sm leading-snug text-foreground/80">{t.what}</div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- WOMEN ---------- */
function Women({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute right-10 top-10 h-32 w-32 blob-4 bg-[var(--ithemba-yellow)]/30" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:px-8">
        <div className="relative order-2 md:order-1">
          <SmartImage
            src={PHOTO_CLASSROOM}
            label="Local women caring and teaching at the ECD Centre"
            className="aspect-[4/5] w-full"
            rounded="rounded-[2.5rem]"
            tone="warm"
            showMissingBadge={false}
          />
        </div>
        <div className="order-1 flex flex-col justify-center md:order-2">
          <SectionHeading eyebrow={c.women.eyebrow} title={c.women.title} />
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
            {c.women.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {c.women.roles.map((r) => (
              <span
                key={r}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[var(--ithemba-blue-dark)] shadow-sm ring-1 ring-black/5"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PROVIDES ---------- */
function Provides({ c }: { c: Copy }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="max-w-3xl">
        <SectionHeading eyebrow={c.provides.eyebrow} title={c.provides.title} />
        <p className="mt-5 text-lg leading-relaxed text-foreground/85">{c.provides.intro}</p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.provides.items.map((it, i) => {
          const Icon = ICONS[it.icon] ?? Sparkles;
          const tones = [
            "bg-[var(--ithemba-yellow)]/20 text-[var(--ithemba-yellow-warm)]",
            "bg-[var(--ithemba-blue)]/12 text-[var(--ithemba-blue-dark)]",
            "bg-emerald-100 text-emerald-700",
          ];
          return (
            <div
              key={it.label}
              className="flex items-start gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tones[i % tones.length]}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="pt-1.5 text-sm font-medium leading-snug text-foreground/90">
                {it.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- DAILY RHYTHM ---------- */
function Rhythm({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ithemba-blue-dark)] via-[var(--ithemba-blue)] to-[var(--ithemba-blue-dark)] py-20 text-white">
      <div className="pointer-events-none absolute left-[-6rem] top-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      <div className="pointer-events-none absolute right-10 bottom-10">
        <SunDoodle className="h-20 w-20 text-[var(--ithemba-yellow)]/50" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-2xl">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)]">{c.rhythm.eyebrow}</div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.rhythm.title}</h2>
          <p className="mt-4 text-lg text-white/90">{c.rhythm.intro}</p>
        </div>

        {/* winding rhythm */}
        <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.rhythm.items.map((r, i) => {
            const rhythmIcons = [
              Sun,
              PlayCircle,
              Utensils,
              HandHeart,
              Music,
              BookOpen,
              Moon,
              Smile,
              Cookie,
              Moon,
              Users,
              Heart,
            ];
            const Icon = rhythmIcons[i % rhythmIcons.length];
            return (
              <li
                key={i}
                className="group relative rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
                style={{
                  borderRadius:
                    i % 3 === 0
                      ? "62% 38% 55% 45% / 50% 60% 40% 50%"
                      : i % 3 === 1
                      ? "40% 60% 65% 35% / 55% 45% 55% 45%"
                      : "1.5rem",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-base font-bold text-[var(--ithemba-yellow)]">
                    {r.time}
                  </div>
                </div>
                <div className="mt-3 text-sm leading-snug text-white/95">{r.what}</div>
              </li>
            );
          })}
        </ol>

        <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-white/85">
          {c.rhythm.outro}
        </p>
      </div>
    </section>
  );
}

/* ---------- NUTRITION ---------- */
function Nutrition({ c }: { c: Copy }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 lg:px-8">
      <div className="relative">
        <div className="absolute -right-8 -top-8 h-28 w-28 blob bg-[var(--ithemba-yellow)]/40 -z-10" />
        <SmartImage
          src={PHOTO_MEAL}
          label="Daily meals at the ECD Centre"
          className="aspect-[4/5] w-full"
          rounded="rounded-[2.5rem]"
          tone="warm"
          showMissingBadge={false}
        />
      </div>
      <div className="flex flex-col justify-center">
        <SectionHeading eyebrow={c.nutrition.eyebrow} title={c.nutrition.title} />
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
          {c.nutrition.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ithemba-yellow)]/25 px-3 py-1.5 text-sm font-semibold text-[var(--ithemba-brown)]">
            <Utensils className="h-4 w-4" /> Food Security
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <Sprout className="h-4 w-4" /> Greenhouse with SA Harvest
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOCUS AREAS ---------- */
function Focus({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -left-20 -top-10 h-60 w-60 blob-2 bg-[var(--ithemba-blue)]/12" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.focus.eyebrow} title={c.focus.title} />
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
            {c.focus.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {c.focus.items.map((f) => {
            const Icon = ICONS[f.icon] ?? Sparkles;
            return (
              <div
                key={f.label}
                className="flex flex-col items-center rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-black/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="mt-3 text-sm font-semibold text-[var(--ithemba-blue-dark)]">
                  {f.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- IMPACT ---------- */
function Impact({ c }: { c: Copy }) {
  const big = c.impact.points.slice(0, 2);
  const rest = c.impact.points.slice(2);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="max-w-3xl">
        <SectionHeading eyebrow={c.impact.eyebrow} title={c.impact.title} />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {big.map((p, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[var(--ithemba-yellow)] to-[var(--ithemba-yellow-warm)] p-8 text-[var(--ithemba-brown)] shadow-lg"
          >
            <SunDoodle className="absolute right-4 top-4 h-10 w-10 text-white/60" />
            <div className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
              {p}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {rest.map((p, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]">
              <Heart className="h-4 w-4 fill-current" />
            </div>
            <div className="pt-1 text-sm leading-snug">{p}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-3xl border-2 border-dashed border-[var(--ithemba-yellow)] bg-[var(--ithemba-yellow)]/10 p-6 text-center">
        <SparkleDoodle className="mx-auto h-6 w-6" />
        <p className="mt-2 text-lg font-semibold text-[var(--ithemba-blue-dark)]">
          {c.impact.monthlyLine}
        </p>
      </div>
    </section>
  );
}

/* ---------- MONTHLY ---------- */
function Monthly({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_CHILD}
          label="Support the No.1 ECD Centre monthly"
          className="h-full w-full"
          rounded="rounded-none"
          tone="sun"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/80 to-[var(--ithemba-blue-dark)]/45" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:px-8">
        <div className="text-white">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)]">{c.monthly.eyebrow}</div>
          <h2 className="-mt-1 font-display text-4xl font-extrabold md:text-5xl">
            {c.monthly.title}
          </h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-white/90">
            {c.monthly.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-7 rounded-3xl bg-[var(--ithemba-yellow)] p-6 text-[var(--ithemba-brown)] shadow-xl">
            <div className="flex items-baseline gap-2">
              <Heart className="h-6 w-6 fill-current" />
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
                <Button
                  variant="outline"
                  className="rounded-full border-[var(--ithemba-brown)]/40 bg-white/40 text-[var(--ithemba-brown)] hover:bg-white/60"
                >
                  {c.monthly.cta2}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <DonationWidget defaultProject="Education" />
      </div>
    </section>
  );
}

/* ---------- CLOSING ---------- */
function Closing({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute left-10 top-10">
        <SunDoodle className="h-12 w-12 text-[var(--ithemba-yellow)]/60" />
      </div>
      <div className="pointer-events-none absolute right-10 bottom-10">
        <SparkleDoodle className="h-8 w-8" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-8">
        <div className="hand-eyebrow-lg">{c.closing.eyebrow}</div>
        <h2 className="-mt-1 font-display text-4xl font-extrabold text-[var(--ithemba-blue-dark)] md:text-5xl">
          {c.closing.title}
        </h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
          {c.closing.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Link to="/donate">
            <Button
              size="lg"
              className="rounded-full bg-[var(--ithemba-yellow)] font-semibold text-[var(--ithemba-brown)] shadow-lg hover:bg-[var(--ithemba-yellow)]/95"
            >
              <Heart className="mr-2 h-4 w-4 fill-current" /> {c.closing.monthly}
            </Button>
          </Link>
          <Link to="/donate">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-[var(--ithemba-blue-dark)]/30 text-[var(--ithemba-blue-dark)] hover:bg-[var(--ithemba-blue-dark)]/5"
            >
              {c.closing.once}
            </Button>
          </Link>
          <Link to="/projects">
            <Button size="lg" variant="ghost" className="rounded-full text-[var(--ithemba-blue-dark)]">
              {c.closing.all}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- PAGE ---------- */
function EcdPage() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.en;
  return (
    <>
      <Hero c={c} />
      <Snapshot c={c} />
      <Why c={c} />
      <Importance c={c} />
      <Building c={c} />
      <Women c={c} />
      <Provides c={c} />
      <Rhythm c={c} />
      <Nutrition c={c} />
      <Focus c={c} />
      <Impact c={c} />
      <Monthly c={c} />
      <Closing c={c} />
    </>
  );
}
