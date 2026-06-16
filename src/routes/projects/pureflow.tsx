import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  ArrowRight,
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
  Package,
  Flame,
  Home,
  Droplets,
  Droplet,
  Stethoscope,
  GraduationCap,
  Sprout,
  Leaf,
  TreePine,
  Wind,
  Recycle,
  Wrench,
  Cog,
  ClipboardCheck,
  LineChart,
  School,
  Baby,
  ShieldCheck,
  Handshake,
  Globe2,
  Briefcase,
  HeartPulse,
  Utensils,
  CloudSun,
  BookOpen,
  Sparkle,
  CheckCircle2,
  Zap,
  PowerOff,
  FlaskConical,
  Hammer,
  SprayCan,
  type LucideIcon,
} from "lucide-react";

import { useLang } from "@/components/site/LanguageProvider";
import { SmartImage, SmartLogo } from "@/components/site/Asset";
import { DonationWidget } from "@/components/blocks/DonationWidget";
import { ImpactCounters } from "@/components/blocks/ImpactCounters";
import { assets } from "@/data/assets";
import type { Lang } from "@/data/content";

export const Route = createFileRoute("/projects/pureflow")({
  component: PureFlowPage,
});

/* ============================== ASSETS ============================== */
const HERO_VIDEO = "/assets/videos/projects/pureflow-amanzi-hero.mp4";
const HERO_POSTER = "/assets/photos/projects/pureflow-amanzi-hero-poster.jpg";
const FALLBACK_POSTER = assets.photos.projects.pureflowHero;
const PHOTO_BUCKET = assets.photos.pureflow.bucketFilter;
const PHOTO_DEMO = assets.photos.pureflow.communityDemo;
const PHOTO_BEFORE_AFTER = assets.photos.pureflow.beforeAfter;
const PHOTO_SCHOOL = assets.photos.pureflow.schoolOrEcd;
const LOGO_PUREFLOW = assets.logos.pureflowAmanzi;

/* ============================== REDUCED MOTION ============================== */
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

/* ============================== CONTENT TYPES ============================== */
type Fact = { label: string; value: string };
type IconItem = { icon: string; label: string };
type Sdg = { number: number; title: string; connection: string };
type ModelStep = { title: string; body: string };
type Video = { id: string; title: string; description?: string };

type Copy = {
  back: string;
  onThisPage: string;
  nav: { id: string; label: string }[];

  hero: {
    eyebrow: string;
    title: string;
    text: string;
    monthly: string;
    once: string;
    small: string;
    placeholder: string;
    location: string;
  };

  impact: {
    eyebrow: string;
    title: string;
    body: string[];
    note: string;
    items: {
      value: number;
      suffix: string;
      iconSrc?: string;
      label: { en: string; de: string; nl?: string };
    }[];
  };

  sdg: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Sdg[];
    outro: string;
  };

  snapshot: {
    eyebrow: string;
    title: string;
    body: string[];
    facts: Fact[];
  };

  why: { eyebrow: string; title: string; body: string[] };

  boil: {
    eyebrow: string;
    title: string;
    body: string[];
    reduces: string[];
    closing: string;
  };

  tech: {
    eyebrow: string;
    title: string;
    body: string[];
    bullets: string[];
    closing: string;
    techNote: string;
    steps: { label: string; text: string }[];
    detailsTitle: string;
    detailsLabel: string;
  };

  jobs: {
    eyebrow: string;
    title: string;
    body: string[];
    items: IconItem[];
    closing: string[];
  };

  model: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: ModelStep[];
    outro: string;
  };

  wash: {
    eyebrow: string;
    title: string;
    body: string[];
    supports: string[];
    closing: string;
  };

  children: { eyebrow: string; title: string; body: string[] };

  climate: {
    eyebrow: string;
    title: string;
    body: string[];
    benefits: string[];
    closing: string;
  };

  monitor: {
    eyebrow: string;
    title: string;
    body: string[];
    items: string[];
    closing: string[];
  };

  results: {
    eyebrow: string;
    title: string;
    intro: string;
    groups: { title: string; icon: string; items: string[] }[];
    closing: string;
  };

  videos: {
    eyebrow: string;
    title: string;
    intro: string;
    mainHeading: string;
    guidesHeading: string;
    mainVideos: Video[];
    guides: Video[];
  };

  focus: {
    eyebrow: string;
    title: string;
    body: string[];
    items: { icon: string; label: string }[];
    closing: string;
  };

  partnership: {
    eyebrow: string;
    title: string;
    body: string[];
    items: string[];
    closing: string;
  };

  donationSupport: {
    eyebrow: string;
    title: string;
    intro: string;
    groups: { title: string; icon: string; items: string[] }[];
    closing: string;
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

  closing: {
    eyebrow: string;
    title: string;
    body: string[];
    monthly: string;
    once: string;
    all: string;
  };
};

/* ============================== COPY (verbatim) ============================== */
const COPY: Record<Lang, Copy> = {
  /* =============================================================== EN */
  en: {
    back: "All projects",
    onThisPage: "On this page",
    nav: [
      { id: "impact", label: "Impact" },
      { id: "sdgs", label: "SDGs" },
      { id: "how-it-works", label: "How it works" },
      { id: "local-jobs", label: "Local jobs" },
      { id: "wash", label: "WASH" },
      { id: "climate", label: "Climate" },
      { id: "videos", label: "Videos" },
      { id: "donate", label: "Donate" },
    ],

    hero: {
      eyebrow: "Safe Water",
      title: "PureFlow Amanzi",
      text:
        "PureFlow Amanzi brings safe drinking water, WASH education, local job creation and climate-resilient household filtration to rural families, schools and ECD centres in South Africa.",
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      small: "€30 per month helps one household access safer water at home.",
      placeholder: "Hero video placeholder · ready for real PureFlow Amanzi video",
      location: "Pondoland · Eastern Cape · South Africa",
    },

    impact: {
      eyebrow: "Impact",
      title: "Safe water that changes daily life",
      body: [
        "PureFlow Amanzi is one of iThemba Kuluntu’s most important programmes because safe water affects health, education, family stability, local employment and climate resilience at the same time.",
        "This project is not only about giving families a water filter. It is about building a practical safe water system around the household: clean drinking water, WASH education, local assembly, community training, household follow-up, data collection and long-term accountability.",
      ],
      note:
        "Every number represents more than distribution. It represents local teams, training, household education, follow-up visits and community trust.",
      items: [
        { value: 3094, suffix: "", iconSrc: "/assets/icons/impact/impact-safe-water-systems.png", label: { en: "Households reached", de: "Haushalte erreicht", nl: "Huishoudens bereikt" } },
        { value: 14211, suffix: "", iconSrc: "/assets/icons/impact/impact-people-reached.png", label: { en: "People with clean water", de: "Menschen mit sauberem Wasser", nl: "Mensen met schoon water" } },
        { value: 30, suffix: "M+", label: { en: "Litres of clean water delivered", de: "Liter sauberes Wasser bereitgestellt", nl: "Liter schoon water geleverd" } },
        { value: 8000, suffix: "+", label: { en: "Tonnes of CO₂ reduced", de: "Tonnen CO₂ reduziert", nl: "Ton CO₂ verminderd" } },
        { value: 4, suffix: "M+", label: { en: "Kilograms of firewood saved", de: "Kilogramm Feuerholz eingespart", nl: "Kilogram brandhout bespaard" } },
        { value: 12000, suffix: "+", label: { en: "Trees saved", de: "Bäume geschützt", nl: "Bomen beschermd" } },
      ],
    },

    sdg: {
      eyebrow: "Global goals",
      title: "One project, many layers of impact",
      intro:
        "PureFlow Amanzi directly supports several Sustainable Development Goals through safe water access, health protection, education, local jobs, climate action and community-led delivery.",
      items: [
        { number: 1, title: "No Poverty", connection: "Reduces pressure on vulnerable households by lowering water-related health risks, reducing medical costs and supporting practical household resilience." },
        { number: 3, title: "Good Health and Well-being", connection: "Safer water and WASH education help protect families from waterborne illness and reduce exposure to indoor smoke from boiling water." },
        { number: 4, title: "Quality Education", connection: "Children learn better when they are healthy, hydrated and protected. WASH education also builds practical knowledge in schools and ECD centres." },
        { number: 5, title: "Gender Equality", connection: "Water insecurity and firewood collection often place a heavy burden on women and girls. Safer household water can reduce daily pressure and free time for care, learning, work and leadership." },
        { number: 6, title: "Clean Water and Sanitation", connection: "This is the core SDG. PureFlow Amanzi provides household-level access to safer drinking water through filtration, education and follow-up." },
        { number: 8, title: "Decent Work and Economic Growth", connection: "The project creates local work through assembly, distribution, training, maintenance, WASH facilitation, household follow-up and data collection, with a focus on community-based employment." },
        { number: 10, title: "Reduced Inequalities", connection: "PureFlow Amanzi reaches rural and underserved communities that often have limited access to infrastructure, services and safe drinking water." },
        { number: 11, title: "Sustainable Cities and Communities", connection: "The programme strengthens community resilience through household-level systems, local participation and practical support in low-infrastructure settings." },
        { number: 12, title: "Responsible Consumption and Production", connection: "The filter reduces reliance on bottled water, supports low-waste water access and encourages sustainable resource use." },
        { number: 13, title: "Climate Action", connection: "By reducing the need to boil water, PureFlow Amanzi lowers firewood use, reduces CO₂ emissions and helps protect trees and local ecosystems." },
        { number: 17, title: "Partnerships for the Goals", connection: "The programme is designed to scale through cooperation between communities, donors, partners, local leadership and iThemba Kuluntu’s field teams." },
      ],
      outro:
        "The SDGs show the wider relevance of the project, but the heart of PureFlow Amanzi remains local: one household, one school, one ECD centre and one community at a time.",
    },

    snapshot: {
      eyebrow: "At a glance",
      title: "Safe water, local skills and accountable delivery",
      body: [
        "PureFlow Amanzi is a community-based safe water programme by iThemba Kuluntu. It supports rural households, schools, ECD centres, clinics and vulnerable community spaces with gravity-fed water filtration, WASH education, local assembly, household training and follow-up.",
        "The system is designed for rural and low-infrastructure areas. It works without electricity, chemicals or boiling, making it practical for families who need a safe water solution they can use at home.",
        "The programme is developed, assembled and distributed in South Africa. Local community members are trained in assembly, maintenance, rollout, WASH education and household follow-up. This creates jobs, builds technical skills and keeps the project rooted in the communities it serves.",
      ],
      facts: [
        { label: "Project", value: "PureFlow Amanzi" },
        { label: "Focus", value: "Safe water, WASH education, local job creation and climate resilience" },
        { label: "Where", value: "Rural and underserved communities in South Africa, with a strong focus on Pondoland and the Eastern Cape" },
        { label: "Core support", value: "Household water filtration, WASH education, local assembly, distribution, maintenance, follow-up visits and impact tracking" },
        { label: "Who it supports", value: "Households, schools, ECD centres, clinics, elderly homes and emergency or disaster response settings" },
        { label: "How it works", value: "Gravity-fed filtration with no electricity, no chemicals and no boiling" },
        { label: "Donation focus", value: "€30 per month helps one household access safer water at home" },
      ],
    },

    why: {
      eyebrow: "Why",
      title: "water changes everything",
      body: [
        "Unsafe water affects far more than thirst.",
        "When families rely on contaminated water, children become more vulnerable to illness, caregivers carry constant stress, school attendance can suffer and household income is often spent on transport, medicine or alternatives.",
        "In many rural communities, families may collect water from unsafe sources that are untreated, shared with animals or exposed to contamination. The effects can include diarrhoea, stomach pain, skin problems, parasites, dehydration and repeated clinic visits.",
        "Safe water changes this daily reality. It supports health, dignity, learning, family stability and community resilience.",
      ],
    },

    boil: {
      eyebrow: "Beyond boiling",
      title: "A safer solution without firewood, smoke or electricity",
      body: [
        "Boiling water may seem like a simple answer, but in many rural households it creates other serious burdens.",
        "Boiling often requires firewood, time and smoke exposure. Women and girls may spend hours collecting wood. Indoor smoke can affect breathing, especially for children. Firewood use contributes to deforestation, soil erosion and climate pressure.",
        "PureFlow Amanzi offers a practical alternative. The system filters water without electricity, chemicals or boiling.",
      ],
      reduces: [
        "Firewood collection",
        "Indoor smoke exposure",
        "Pressure on women and girls",
        "CO₂ emissions",
        "Deforestation",
        "Plastic waste from bottled water",
        "The need for costly or unreliable alternatives",
      ],
      closing: "Safe water should not cost families their health, time, trees or future.",
    },

    tech: {
      eyebrow: "The technology",
      title: "Simple filtration built for rural use",
      body: [
        "PureFlow Amanzi uses gravity-fed ultra-filtration technology.",
        "Water passes through a membrane with ultra-fine pores of around 0.1 microns. Harmful bacteria and dirt are blocked, while cleaner water flows through.",
      ],
      bullets: [
        "Gravity-powered",
        "Electricity-free",
        "Chemical-free",
        "Portable",
        "Easy to assemble",
        "Simple to clean",
        "Low-maintenance",
        "Suitable for household use",
        "Practical in rural and low-infrastructure settings",
      ],
      closing:
        "The system removes harmful bacteria and provides safe drinking water instantly without electricity, chemicals or boiling.",
      techNote:
        "Independent testing confirms more than 99.9999% removal of E. coli and total coliforms.",
      steps: [
        { label: "Dirty water in", text: "Water from an unsafe source is poured into the upper chamber." },
        { label: "Ultra-filtration membrane", text: "A 0.1-micron membrane blocks harmful bacteria and dirt." },
        { label: "Safer drinking water out", text: "Cleaner water flows through, ready to drink — no boiling needed." },
      ],
      detailsTitle: "How the filter works",
      detailsLabel: "Technical details",
    },

    jobs: {
      eyebrow: "Local livelihoods",
      title: "Safe water also creates work",
      body: [
        "PureFlow Amanzi is designed to create local value, not only deliver a product.",
        "Local community members are trained in filter assembly, maintenance, rollout, WASH facilitation, household training and follow-up support. This builds practical skills and creates employment opportunities within the communities where the project works.",
      ],
      items: [
        { icon: "Cog", label: "Filter assembly" },
        { icon: "Truck", label: "Distribution and rollout support" },
        { icon: "BookOpen", label: "WASH education sessions" },
        { icon: "Home", label: "Household demonstrations" },
        { icon: "Wrench", label: "Maintenance guidance" },
        { icon: "HandHeart", label: "Follow-up visits" },
        { icon: "ClipboardCheck", label: "Community feedback collection" },
        { icon: "LineChart", label: "Data collection and reporting" },
        { icon: "MapPin", label: "Field coordination" },
        { icon: "Briefcase", label: "Support for donor and partner reporting" },
      ],
      closing: [
        "This matters because safe water delivery should strengthen the local economy. When trained community members assemble systems, visit households, explain use and maintenance, collect feedback and track impact, the project becomes more accountable, more trusted and more sustainable.",
        "PureFlow Amanzi is therefore not only a safe water project. It is also a skills, employment and community ownership project.",
      ],
    },

    model: {
      eyebrow: "How it works",
      title: "A complete rollout model, not just a filter",
      intro: "PureFlow Amanzi combines technology, training, community mobilisation and follow-up.",
      steps: [
        { title: "Community mobilisation", body: "Local leadership and community structures help identify rollout areas and support trust." },
        { title: "Local team training", body: "Community members are trained in assembly, maintenance, WASH facilitation and household support." },
        { title: "System assembly", body: "Filters are assembled by trained local teams using standardised processes." },
        { title: "Household distribution", body: "Safe water systems are distributed to households, schools, ECD centres and vulnerable community spaces." },
        { title: "WASH education", body: "Families receive practical guidance on safe water, hygiene, filter use, cleaning and storage." },
        { title: "Household follow-up", body: "Trained local teams visit households to check filter use, maintenance, condition and user experience." },
        { title: "Data and reporting", body: "Teams collect feedback and field data to support accountability, donor reporting and future improvement." },
      ],
      outro:
        "This is why PureFlow Amanzi is built to scale. It is practical, measurable, community-led and partnership-ready.",
    },

    wash: {
      eyebrow: "WASH",
      title: "Knowledge makes safe water stronger",
      body: [
        "WASH means water, sanitation and hygiene. In PureFlow Amanzi, WASH education is essential.",
        "Families do not only receive a filter. They also receive guidance on why safe water matters, how to use the system correctly, how to clean it, how to store water safely and how to prevent contamination after filtration.",
      ],
      supports: [
        "Safe water handling",
        "Correct filter use",
        "Cleaning and maintenance",
        "Clean water storage",
        "Hygiene awareness",
        "Reduced contamination risk",
        "Healthier routines at home",
        "Safer learning environments at schools and ECD centres",
      ],
      closing:
        "The filter is the tool. Education is what helps families use it well, trust it and keep it working.",
    },

    children: {
      eyebrow: "Children first",
      title: "Safe water where children learn",
      body: [
        "PureFlow Amanzi also supports places where children learn, play and grow.",
        "Schools and ECD centres need safer water because children are especially vulnerable to waterborne illness. Safe water supports learning, nutrition, hygiene and daily care.",
        "At the iThemba Kuluntu No.1 ECD Centre, PureFlow Amanzi is part of a wider system of child wellbeing. Children need safe water, food, hygiene, routine, play, rest and early learning to thrive.",
        "The system also gives children a hands-on way to learn about water safety. When children understand clean water, they carry that knowledge home and help build healthier habits in their families.",
      ],
    },

    climate: {
      eyebrow: "Climate resilience",
      title: "Safe water without boiling",
      body: [
        "PureFlow Amanzi is also a climate resilience programme.",
        "Because the system works without boiling, it helps reduce the need for firewood. This lowers smoke exposure, reduces pressure on forests and cuts emissions linked to open-fire water purification.",
      ],
      benefits: [
        "Reduced CO₂ emissions",
        "Less firewood use",
        "Less deforestation pressure",
        "Reduced indoor smoke exposure",
        "Less plastic waste from bottled water",
        "Improved air quality",
        "Protection of habitats and ecosystems",
        "Stronger resilience in off-grid and disaster-affected areas",
      ],
      closing:
        "A household water filter cannot solve every water challenge, but it gives families a practical tool to make daily water safer in a changing climate.",
    },

    monitor: {
      eyebrow: "Accountability",
      title: "Follow-up makes the impact stronger",
      body: [
        "PureFlow Amanzi includes monitoring and impact tracking because long-term success depends on more than distribution.",
        "Trained local teams visit a sample of households to check whether filters are being used correctly, whether maintenance is understood, what condition the system is in and how families experience the water.",
      ],
      items: [
        "Regular household spot checks",
        "Assessment of filter use, care and condition",
        "Maintenance support",
        "Collection of household feedback",
        "Feedback on water quality and health outcomes",
        "Data-driven reporting for donors and partners",
        "Continuous learning to improve future rollouts",
      ],
      closing: [
        "This follow-up creates accountability. It helps the team understand what is working, what needs support and how the programme can grow without losing quality.",
        "It also creates local employment and strengthens donor confidence because the project can show real field data, not only distribution numbers.",
      ],
    },

    results: {
      eyebrow: "In daily life",
      title: "What families report",
      intro:
        "Families who have received PureFlow Amanzi systems report practical changes in daily life.",
      groups: [
        {
          title: "Health",
          icon: "HeartPulse",
          items: [
            "Less diarrhoea and stomach pain",
            "Fewer skin rashes and hair problems",
            "Fewer clinic visits linked to stomach illness",
            "Less spending on medicine",
          ],
        },
        {
          title: "Children & school",
          icon: "School",
          items: [
            "Improved children’s health, mood and energy",
            "Fewer school absences",
            "Cleaner-looking and better-tasting food and drinks",
          ],
        },
        {
          title: "Time & household burden",
          icon: "Home",
          items: [
            "Less time spent collecting firewood and boiling water",
            "More time for childcare, rest, schoolwork or study",
          ],
        },
        {
          title: "Dignity & self-reliance",
          icon: "Sparkle",
          items: [
            "Greater dignity, comfort and self-reliance",
          ],
        },
        {
          title: "Climate & smoke reduction",
          icon: "Wind",
          items: [
            "Less smoke exposure in the home",
          ],
        },
      ],
      closing:
        "These stories matter because they show what safe water means at household level. The impact is not abstract. It is visible in cooking, school attendance, health, time, confidence and daily comfort.",
    },

    videos: {
      eyebrow: "Watch",
      title: "See the work in the field",
      intro:
        "Video helps show the reality behind the numbers: the communities, household rollout, WASH education, local teams, partnerships and children learning safe water habits.",
      mainHeading: "Main stories",
      guidesHeading: "Step-by-step guides",
      mainVideos: [
        { id: "IoRHLU5Cm7o", title: "PureFlow Amanzi overview", description: "An introduction to PureFlow Amanzi and the safe water work in rural communities." },
        { id: "ZsCUcyV9MTg", title: "Little ECD Water Champions", description: "Children at the ECD centre learn about safe water and carry WASH knowledge into their families." },
        { id: "MJAD9N-oW3M", title: "Partnership model in practice", description: "A field example showing safe water delivery, local ownership and partnership-based rollout." },
      ],
      guides: [
        { id: "z4AekP8-Luc", title: "How to use" },
        { id: "kz8EPC6FWUc", title: "How to clean" },
        { id: "Ad3enwiOVI0", title: "How to assemble" },
      ],
    },

    focus: {
      eyebrow: "Connected care",
      title: "Safe water supports the whole community",
      body: [
        "PureFlow Amanzi connects to several iThemba Kuluntu focus areas.",
        "The project supports safe water through household filtration. It supports community health because water affects illness, hygiene and family wellbeing. It supports education because children learn better when they are healthy and protected. It connects to food security because safe water matters for cooking, meals and child nutrition. It supports climate resilience by reducing firewood use and helping families manage water risk. It supports skills and livelihoods through local assembly, maintenance, training, follow-up and data work. It also supports disaster relief because the system can provide fast safe water access in emergency situations.",
      ],
      items: [
        { icon: "Droplet", label: "Safe water" },
        { icon: "HeartPulse", label: "Community health" },
        { icon: "GraduationCap", label: "Education" },
        { icon: "Utensils", label: "Food security" },
        { icon: "CloudSun", label: "Climate resilience" },
        { icon: "Wrench", label: "Skills & livelihoods" },
        { icon: "HandHeart", label: "Disaster relief" },
      ],
      closing: "PureFlow Amanzi is not a stand-alone filter project. It is part of a wider system of care.",
    },

    partnership: {
      eyebrow: "Ready to scale",
      title: "A practical model for partners and funders",
      body: [
        "PureFlow Amanzi is designed to scale through partnerships.",
        "The model is practical enough for rural conditions, structured enough for accountability and flexible enough to work across different communities and districts.",
      ],
      items: [
        "Local teams trained in rollout, assembly and WASH facilitation",
        "Community structures engaged for mobilisation and coordination",
        "Household distribution linked to practical education sessions",
        "Standardised rollout steps that can be replicated",
        "Field supervision and simple documentation",
        "Household follow-up and data collection",
        "Reporting for donors and partners",
      ],
      closing:
        "This is grassroots implementation done properly: trusted, measurable, community-led and ready to grow with the right partners.",
    },

    donationSupport: {
      eyebrow: "Your support",
      title: "Help one household access safer water",
      intro:
        "Donations help keep PureFlow Amanzi moving from production to delivery, education, follow-up and long-term accountability.",
      groups: [
        {
          title: "Water systems",
          icon: "Droplet",
          items: ["Household water filtration systems", "Filter components and assembly materials"],
        },
        {
          title: "Training & local jobs",
          icon: "Briefcase",
          items: ["Local assembly training", "Maintenance training", "Field coordination"],
        },
        {
          title: "Household follow-up",
          icon: "HandHeart",
          items: ["WASH education", "Household demonstrations", "Distribution and transport", "Follow-up household visits"],
        },
        {
          title: "Schools, ECD & reporting",
          icon: "School",
          items: ["Support for schools and ECD centres", "Data collection and reporting", "Monitoring and documentation"],
        },
      ],
      closing:
        "A donation to PureFlow Amanzi helps families access safer water at home and supports the local systems that make the programme work.",
    },

    monthly: {
      eyebrow: "Give monthly",
      title: "Support safe water every month",
      body: [
        "Safe water needs consistency. Families do not need safer water only once. They need reliable systems, clear guidance and follow-up that keeps the programme strong.",
        "Monthly giving helps iThemba Kuluntu plan ahead, train local teams, reach more households and keep education, maintenance and monitoring moving.",
      ],
      cardHeading: "Support a household",
      cardAmount: "€30 / month",
      cardText:
        "Helps one household access safer water at home through PureFlow Amanzi, including filtration, WASH education, local delivery and follow-up support.",
      cta1: "Support safe water monthly",
      cta2: "Give once to PureFlow Amanzi",
      trust: [
        "Secure donation",
        "Monthly giving",
        "Safe water access",
        "WASH education",
        "Local jobs",
        "Climate resilience",
        "Transparent reporting",
      ],
    },

    closing: {
      eyebrow: "Safe water",
      title: "Help families build stronger daily life",
      body: [
        "PureFlow Amanzi exists because safe water changes daily life. It protects children, supports caregivers, creates local work, strengthens schools and ECD centres, and helps rural families become more resilient.",
        "Your support helps bring safe water systems, WASH education, trained local teams, household follow-up and accountable delivery to communities that need them.",
      ],
      monthly: "Donate Monthly to Support This Project",
      once: "Give Once",
      all: "Explore All Projects",
    },
  },

  /* =============================================================== DE */
  de: {
    back: "Alle Projekte",
    onThisPage: "Auf dieser Seite",
    nav: [
      { id: "impact", label: "Wirkung" },
      { id: "sdgs", label: "SDGs" },
      { id: "how-it-works", label: "Funktionsweise" },
      { id: "local-jobs", label: "Lokale Arbeit" },
      { id: "wash", label: "WASH" },
      { id: "climate", label: "Klima" },
      { id: "videos", label: "Videos" },
      { id: "donate", label: "Spenden" },
    ],

    hero: {
      eyebrow: "Sicheres Wasser",
      title: "PureFlow Amanzi",
      text:
        "PureFlow Amanzi bringt sicheres Trinkwasser, WASH-Bildung, lokale Arbeitsplätze und klimaresiliente Haushaltsfiltration zu Familien, Schulen und ECD-Zentren in ländlichen Regionen Südafrikas.",
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      small: "30 € pro Monat helfen einem Haushalt, zu Hause Zugang zu sichererem Wasser zu erhalten.",
      placeholder: "Hero-Video Platzhalter · bereit für echtes PureFlow Amanzi-Video",
      location: "Pondoland · Eastern Cape · Südafrika",
    },

    impact: {
      eyebrow: "Wirkung",
      title: "Sicheres Wasser, das den Alltag verändert",
      body: [
        "PureFlow Amanzi ist eines der wichtigsten Programme von iThemba Kuluntu, weil sicheres Wasser gleichzeitig Gesundheit, Bildung, familiäre Stabilität, lokale Beschäftigung und Klimaresilienz beeinflusst.",
        "Dieses Projekt bedeutet nicht nur, Familien einen Wasserfilter zu geben. Es baut ein praktisches System rund um den Haushalt auf: sicheres Trinkwasser, WASH-Bildung, lokale Montage, Schulungen in der Gemeinschaft, Hausbesuche, Datenerfassung und langfristige Verantwortlichkeit.",
      ],
      note:
        "Jede Zahl steht für mehr als Verteilung. Sie steht für lokale Teams, Schulungen, Haushaltsbildung, Nachbetreuung und Vertrauen in der Gemeinschaft.",
      items: [
        { value: 3094, suffix: "", iconSrc: "/assets/icons/impact/impact-safe-water-systems.png", label: { en: "Households reached", de: "Haushalte erreicht", nl: "Huishoudens bereikt" } },
        { value: 14211, suffix: "", iconSrc: "/assets/icons/impact/impact-people-reached.png", label: { en: "People with clean water", de: "Menschen mit sauberem Wasser", nl: "Mensen met schoon water" } },
        { value: 30, suffix: "M+", label: { en: "Litres of clean water delivered", de: "Liter sauberes Wasser bereitgestellt", nl: "Liter schoon water geleverd" } },
        { value: 8000, suffix: "+", label: { en: "Tonnes of CO₂ reduced", de: "Tonnen CO₂ reduziert", nl: "Ton CO₂ verminderd" } },
        { value: 4, suffix: "M+", label: { en: "Kilograms of firewood saved", de: "Kilogramm Feuerholz eingespart", nl: "Kilogram brandhout bespaard" } },
        { value: 12000, suffix: "+", label: { en: "Trees saved", de: "Bäume geschützt", nl: "Bomen beschermd" } },
      ],
    },

    sdg: {
      eyebrow: "Globale Ziele",
      title: "Ein Projekt mit vielen Wirkungsebenen",
      intro:
        "PureFlow Amanzi leistet einen direkten Beitrag zu mehreren Zielen für nachhaltige Entwicklung. Das Projekt verbindet Zugang zu sicherem Wasser, Gesundheitsschutz, Bildung, lokale Arbeitsplätze, Klimaschutz und gemeindenahe Umsetzung.",
      items: [
        { number: 1, title: "Keine Armut", connection: "Verringert die Belastung besonders gefährdeter Haushalte, indem wasserbedingte Gesundheitsrisiken, medizinische Kosten und akute Haushaltsrisiken reduziert werden." },
        { number: 3, title: "Gesundheit und Wohlergehen", connection: "Sichereres Wasser und WASH-Bildung helfen, Familien vor wasserbedingten Krankheiten zu schützen und die Belastung durch Rauch beim Abkochen von Wasser zu verringern." },
        { number: 4, title: "Hochwertige Bildung", connection: "Kinder lernen besser, wenn sie gesund, ausreichend versorgt und geschützt sind. WASH-Bildung vermittelt zudem praktisches Wissen in Schulen und ECD-Zentren." },
        { number: 5, title: "Geschlechtergleichstellung", connection: "Wasserunsicherheit und das Sammeln von Feuerholz belasten häufig besonders Frauen und Mädchen. Sichereres Wasser im Haushalt kann täglichen Druck verringern und Zeit für Fürsorge, Lernen, Arbeit und Verantwortung freisetzen." },
        { number: 6, title: "Sauberes Wasser und Sanitäreinrichtungen", connection: "Dies ist das zentrale SDG des Projekts. PureFlow Amanzi schafft Zugang zu sichererem Trinkwasser auf Haushaltsebene durch Filtration, Bildung und Nachbetreuung." },
        { number: 8, title: "Menschenwürdige Arbeit und Wirtschaftswachstum", connection: "Das Projekt schafft lokale Arbeit in Montage, Verteilung, Schulung, Wartung, WASH-Begleitung, Hausbesuchen und Datenerfassung, mit einem klaren Fokus auf Beschäftigung innerhalb der Gemeinschaft." },
        { number: 10, title: "Weniger Ungleichheiten", connection: "PureFlow Amanzi erreicht ländliche und unterversorgte Gemeinschaften, die häufig nur begrenzten Zugang zu Infrastruktur, Dienstleistungen und sicherem Trinkwasser haben." },
        { number: 11, title: "Nachhaltige Städte und Gemeinden", connection: "Das Programm stärkt die Widerstandsfähigkeit von Gemeinschaften durch haushaltsnahe Lösungen, lokale Beteiligung und praktische Unterstützung in Regionen mit schwacher Infrastruktur." },
        { number: 12, title: "Nachhaltiger Konsum und Produktion", connection: "Der Filter reduziert die Abhängigkeit von abgefülltem Wasser, unterstützt wasserbezogene Lösungen mit wenig Abfall und fördert einen verantwortungsvollen Umgang mit Ressourcen." },
        { number: 13, title: "Maßnahmen zum Klimaschutz", connection: "Indem weniger Wasser abgekocht werden muss, reduziert PureFlow Amanzi den Verbrauch von Feuerholz, senkt CO₂-Emissionen und hilft, Bäume und lokale Ökosysteme zu schützen." },
        { number: 17, title: "Partnerschaften zur Erreichung der Ziele", connection: "Das Programm ist darauf ausgelegt, durch Zusammenarbeit zwischen Gemeinden, Spenderinnen und Spendern, Partnern, lokaler Führung und den Feldteams von iThemba Kuluntu zu wachsen." },
      ],
      outro:
        "Die SDGs zeigen die größere Bedeutung des Projekts. Im Kern bleibt PureFlow Amanzi jedoch lokal verankert: ein Haushalt, eine Schule, ein ECD-Zentrum und eine Gemeinschaft nach der anderen.",
    },

    snapshot: {
      eyebrow: "Auf einen Blick",
      title: "Sicheres Wasser, lokale Kompetenzen und verlässliche Umsetzung",
      body: [
        "PureFlow Amanzi ist ein gemeindebasiertes Safe-Water-Programm von iThemba Kuluntu. Es unterstützt ländliche Haushalte, Schulen, ECD-Zentren, Kliniken und besonders gefährdete Einrichtungen mit schwerkraftbasierter Wasserfiltration, WASH-Bildung, lokaler Montage, Haushaltsschulungen und Nachbetreuung.",
        "Das System ist für ländliche Regionen und Orte mit schwacher Infrastruktur entwickelt. Es funktioniert ohne Strom, ohne Chemikalien und ohne Abkochen. Dadurch ist es für Familien praktisch nutzbar, die eine sichere Wasserlösung für den Alltag zu Hause brauchen.",
        "Das Programm wird in Südafrika entwickelt, montiert und verteilt. Lokale Gemeindemitglieder werden in Montage, Wartung, Rollout, WASH-Bildung und Hausbesuchen geschult. So entstehen Arbeitsplätze, technische Fähigkeiten und eine Umsetzung, die in den Gemeinden verankert bleibt.",
      ],
      facts: [
        { label: "Projekt", value: "PureFlow Amanzi" },
        { label: "Schwerpunkt", value: "Sicheres Wasser, WASH-Bildung, lokale Arbeitsplätze und Klimaresilienz" },
        { label: "Wo", value: "Ländliche und unterversorgte Gemeinschaften in Südafrika, mit starkem Fokus auf Pondoland und das Eastern Cape" },
        { label: "Kernunterstützung", value: "Haushalts-Wasserfiltration, WASH-Bildung, lokale Montage, Verteilung, Wartung, Hausbesuche und Wirkungserfassung" },
        { label: "Wen es unterstützt", value: "Haushalte, Schulen, ECD-Zentren, Kliniken, Alteneinrichtungen sowie Not- und Katastrophenhilfe" },
        { label: "Funktionsweise", value: "Schwerkraftbasierte Filtration ohne Strom, ohne Chemikalien und ohne Abkochen" },
        { label: "Spendenfokus", value: "30 € pro Monat helfen einem Haushalt, zu Hause Zugang zu sichererem Wasser zu erhalten" },
      ],
    },

    why: {
      eyebrow: "Warum",
      title: "Wasser alles verändert",
      body: [
        "Unsicheres Wasser betrifft weit mehr als den Durst.",
        "Wenn Familien auf kontaminiertes Wasser angewiesen sind, werden Kinder anfälliger für Krankheiten, Betreuungspersonen tragen ständige Sorge, der Schulbesuch kann leiden und Haushalte geben oft Geld für Transport, Medikamente oder Alternativen aus.",
        "In vielen ländlichen Gemeinden holen Familien Wasser aus unsicheren Quellen, die unbehandelt sind, mit Tieren geteilt werden oder leicht verunreinigt werden können. Die Folgen können Durchfall, Bauchschmerzen, Hautprobleme, Parasiten, Dehydrierung und wiederholte Klinikbesuche sein.",
        "Sicheres Wasser verändert diese tägliche Realität. Es stärkt Gesundheit, Würde, Lernen, familiäre Stabilität und die Widerstandsfähigkeit der Gemeinschaft.",
      ],
    },

    boil: {
      eyebrow: "Mehr als Abkochen",
      title: "Eine sicherere Lösung ohne Feuerholz, Rauch oder Strom",
      body: [
        "Wasser abzukochen wirkt zunächst wie eine einfache Lösung. In vielen ländlichen Haushalten entstehen dadurch jedoch neue schwere Belastungen.",
        "Abkochen braucht oft Feuerholz, Zeit und bringt Rauchbelastung mit sich. Frauen und Mädchen verbringen mitunter Stunden damit, Holz zu sammeln. Rauch in Innenräumen kann die Atemwege belasten, besonders bei Kindern. Feuerholzverbrauch trägt zu Entwaldung, Bodenerosion und Klimabelastung bei.",
        "PureFlow Amanzi bietet eine praktische Alternative. Das System filtert Wasser ohne Strom, ohne Chemikalien und ohne Abkochen.",
      ],
      reduces: [
        "Sammeln von Feuerholz",
        "Rauchbelastung in Innenräumen",
        "Belastung für Frauen und Mädchen",
        "CO₂-Emissionen",
        "Entwaldung",
        "Plastikmüll durch abgefülltes Wasser",
        "Abhängigkeit von teuren oder unzuverlässigen Alternativen",
      ],
      closing: "Sicheres Wasser sollte Familien nicht Gesundheit, Zeit, Bäume oder Zukunft kosten.",
    },

    tech: {
      eyebrow: "Die Technologie",
      title: "Einfache Filtration für den ländlichen Alltag",
      body: [
        "PureFlow Amanzi nutzt schwerkraftbasierte Ultrafiltration.",
        "Das Wasser fließt durch eine Membran mit ultrafeinen Poren von etwa 0,1 Mikron. Schädliche Bakterien und Schmutzpartikel werden zurückgehalten, während gereinigtes Wasser hindurchfließt.",
      ],
      bullets: [
        "schwerkraftbetrieben",
        "stromfrei",
        "chemikalienfrei",
        "tragbar",
        "leicht zu montieren",
        "einfach zu reinigen",
        "wartungsarm",
        "für den Haushalt geeignet",
        "praktisch in ländlichen Regionen und bei schwacher Infrastruktur",
      ],
      closing:
        "Das System entfernt schädliche Bakterien und stellt sofort sicheres Trinkwasser bereit, ohne Strom, Chemikalien oder Abkochen.",
      techNote:
        "Unabhängige Tests bestätigen eine Entfernung von mehr als 99,9999 % von E. coli und Gesamtcoliformen.",
      steps: [
        { label: "Verschmutztes Wasser hinein", text: "Wasser aus einer unsicheren Quelle wird in die obere Kammer gegossen." },
        { label: "Ultrafiltrationsmembran", text: "Eine Membran mit 0,1 Mikron hält schädliche Bakterien und Schmutz zurück." },
        { label: "Sichereres Trinkwasser heraus", text: "Gereinigtes Wasser fließt durch — direkt trinkbar, ohne Abkochen." },
      ],
      detailsTitle: "So funktioniert der Filter",
      detailsLabel: "Technische Details",
    },

    jobs: {
      eyebrow: "Lokale Lebensgrundlagen",
      title: "Sicheres Wasser schafft auch Arbeit",
      body: [
        "PureFlow Amanzi ist so aufgebaut, dass lokaler Wert entsteht, nicht nur ein Produkt verteilt wird.",
        "Menschen aus der Gemeinschaft werden in Filtermontage, Wartung, Rollout, WASH-Begleitung, Haushaltsschulungen und Nachbetreuung geschult. Dadurch entstehen praktische Fähigkeiten und Beschäftigungsmöglichkeiten innerhalb der Gemeinden, in denen das Projekt umgesetzt wird.",
      ],
      items: [
        { icon: "Cog", label: "Filtermontage" },
        { icon: "Truck", label: "Unterstützung bei Verteilung und Rollout" },
        { icon: "BookOpen", label: "WASH-Schulungen" },
        { icon: "Home", label: "Vorführungen in Haushalten" },
        { icon: "Wrench", label: "Anleitung zur Wartung" },
        { icon: "HandHeart", label: "Hausbesuche zur Nachbetreuung" },
        { icon: "ClipboardCheck", label: "Erfassung von Rückmeldungen aus der Gemeinschaft" },
        { icon: "LineChart", label: "Datenerfassung und Berichterstattung" },
        { icon: "MapPin", label: "Feldkoordination" },
        { icon: "Briefcase", label: "Unterstützung für Berichte an Spender, Partner und Förderer" },
      ],
      closing: [
        "Das ist wichtig, weil sichere Wasserversorgung auch die lokale Wirtschaft stärken sollte. Wenn geschulte Gemeindemitglieder Systeme montieren, Haushalte besuchen, Nutzung und Wartung erklären, Rückmeldungen sammeln und Wirkung dokumentieren, wird das Projekt verlässlicher, vertrauenswürdiger und nachhaltiger.",
        "PureFlow Amanzi ist deshalb nicht nur ein Safe-Water-Projekt. Es ist auch ein Projekt für Kompetenzen, Beschäftigung und lokale Eigenverantwortung.",
      ],
    },

    model: {
      eyebrow: "So funktioniert es",
      title: "Ein vollständiges Rollout-Modell, nicht nur ein Filter",
      intro: "PureFlow Amanzi verbindet Technologie, Schulung, Gemeindemobilisierung und Nachbetreuung.",
      steps: [
        { title: "Gemeindemobilisierung", body: "Lokale Führung und Gemeindestrukturen helfen dabei, Rollout-Gebiete zu identifizieren und Vertrauen aufzubauen." },
        { title: "Schulung lokaler Teams", body: "Gemeindemitglieder werden in Montage, Wartung, WASH-Begleitung und Haushaltsunterstützung geschult." },
        { title: "Systemmontage", body: "Die Filter werden von geschulten lokalen Teams nach standardisierten Abläufen montiert." },
        { title: "Verteilung an Haushalte", body: "Safe-Water-Systeme werden an Haushalte, Schulen, ECD-Zentren und besonders gefährdete Einrichtungen verteilt." },
        { title: "WASH-Bildung", body: "Familien erhalten praktische Anleitung zu sicherem Wasser, Hygiene, Filtergebrauch, Reinigung und Lagerung." },
        { title: "Nachbetreuung der Haushalte", body: "Geschulte lokale Teams besuchen Haushalte, um Nutzung, Wartung, Zustand des Systems und Erfahrungen der Familien zu überprüfen." },
        { title: "Daten und Berichte", body: "Teams erfassen Rückmeldungen und Felddaten, um Verantwortlichkeit, Spenderberichte und zukünftige Verbesserungen zu unterstützen." },
      ],
      outro:
        "Deshalb ist PureFlow Amanzi auf Skalierung ausgelegt. Es ist praktisch, messbar, gemeindegeführt und bereit für starke Partnerschaften.",
    },

    wash: {
      eyebrow: "WASH",
      title: "Wissen macht sicheres Wasser wirksamer",
      body: [
        "WASH steht für Wasser, Sanitärversorgung und Hygiene. Bei PureFlow Amanzi ist WASH-Bildung ein wesentlicher Bestandteil.",
        "Familien erhalten nicht nur einen Filter. Sie bekommen auch Anleitung, warum sicheres Wasser wichtig ist, wie das System richtig benutzt wird, wie es gereinigt wird, wie Wasser sicher gelagert wird und wie erneute Verunreinigung nach der Filtration vermieden werden kann.",
      ],
      supports: [
        "Sicheren Umgang mit Wasser",
        "Richtige Nutzung des Filters",
        "Reinigung und Wartung",
        "Saubere Wasserlagerung",
        "Hygienebewusstsein",
        "Verringerung von Kontaminationsrisiken",
        "Gesündere Routinen zu Hause",
        "Sicherere Lernumgebungen in Schulen und ECD-Zentren",
      ],
      closing:
        "Der Filter ist das Werkzeug. Bildung sorgt dafür, dass Familien ihn richtig nutzen, ihm vertrauen und ihn langfristig funktionsfähig halten.",
    },

    children: {
      eyebrow: "Kinder zuerst",
      title: "Sicheres Wasser dort, wo Kinder lernen",
      body: [
        "PureFlow Amanzi unterstützt auch Orte, an denen Kinder lernen, spielen und wachsen.",
        "Schulen und ECD-Zentren brauchen sichereres Wasser, weil Kinder besonders anfällig für wasserbedingte Krankheiten sind. Sicheres Wasser unterstützt Lernen, Ernährung, Hygiene und tägliche Betreuung.",
        "Im iThemba Kuluntu No.1 ECD Centre ist PureFlow Amanzi Teil eines größeren Systems für das Wohlergehen der Kinder. Kinder brauchen sicheres Wasser, Essen, Hygiene, Routinen, Spiel, Ruhe und frühkindliche Bildung, um sich gut entwickeln zu können.",
        "Das System gibt Kindern außerdem eine praktische Möglichkeit, Wassersicherheit zu verstehen. Wenn Kinder sauberes Wasser begreifen, tragen sie dieses Wissen nach Hause und helfen, gesündere Gewohnheiten in ihren Familien aufzubauen.",
      ],
    },

    climate: {
      eyebrow: "Klimaresilienz",
      title: "Sicheres Wasser ohne Abkochen",
      body: [
        "PureFlow Amanzi ist auch ein Programm für Klimaresilienz.",
        "Da das System ohne Abkochen funktioniert, kann der Bedarf an Feuerholz reduziert werden. Das senkt Rauchbelastung, verringert den Druck auf Wälder und reduziert Emissionen, die durch Wasseraufbereitung über offenem Feuer entstehen.",
      ],
      benefits: [
        "Reduzierte CO₂-Emissionen",
        "Weniger Feuerholzverbrauch",
        "Geringerer Druck auf Wälder",
        "Weniger Rauchbelastung in Innenräumen",
        "Weniger Plastikmüll durch abgefülltes Wasser",
        "Bessere Luftqualität",
        "Schutz von Lebensräumen und Ökosystemen",
        "Mehr Widerstandsfähigkeit in netzfernen und katastrophenbetroffenen Gebieten",
      ],
      closing:
        "Ein Haushaltswasserfilter kann nicht jedes Wasserproblem lösen. Aber er gibt Familien ein praktisches Werkzeug, um Wasser im Alltag sicherer zu machen, gerade in einem sich verändernden Klima.",
    },

    monitor: {
      eyebrow: "Verantwortlichkeit",
      title: "Nachbetreuung macht die Wirkung stärker",
      body: [
        "PureFlow Amanzi umfasst Monitoring und Wirkungserfassung, weil langfristiger Erfolg mehr braucht als Verteilung.",
        "Geschulte lokale Teams besuchen ausgewählte Haushalte, um zu prüfen, ob die Filter richtig genutzt werden, ob die Wartung verstanden wurde, in welchem Zustand sich das System befindet und wie Familien das Wasser erleben.",
      ],
      items: [
        "Regelmäßige stichprobenartige Hausbesuche",
        "Überprüfung von Nutzung, Pflege und Zustand der Filter",
        "Unterstützung bei Wartung",
        "Erfassung von Rückmeldungen aus den Haushalten",
        "Rückmeldungen zu Wasserqualität und gesundheitlichen Veränderungen",
        "Datengestützte Berichte für Spender, Partner und Förderer",
        "Kontinuierliches Lernen zur Verbesserung zukünftiger Rollouts",
      ],
      closing: [
        "Diese Nachbetreuung schafft Verantwortlichkeit. Sie hilft dem Team zu verstehen, was funktioniert, wo Unterstützung nötig ist und wie das Programm wachsen kann, ohne Qualität zu verlieren.",
        "Sie schafft außerdem lokale Beschäftigung und stärkt das Vertrauen von Spendern, weil das Projekt echte Felddaten zeigen kann, nicht nur Verteilungszahlen.",
      ],
    },

    results: {
      eyebrow: "Im Alltag",
      title: "Was Familien berichten",
      intro:
        "Familien, die PureFlow Amanzi Systeme erhalten haben, berichten von konkreten Veränderungen im Alltag.",
      groups: [
        {
          title: "Gesundheit",
          icon: "HeartPulse",
          items: [
            "Weniger Durchfall und Bauchschmerzen",
            "Weniger Hautausschläge und Haarprobleme",
            "Weniger Klinikbesuche wegen Magen-Darm-Beschwerden",
            "Weniger Ausgaben für Medikamente",
          ],
        },
        {
          title: "Kinder & Schule",
          icon: "School",
          items: [
            "Bessere Gesundheit, Stimmung und Energie bei Kindern",
            "Weniger Fehltage in der Schule",
            "Sauberer aussehende und besser schmeckende Speisen und Getränke",
          ],
        },
        {
          title: "Zeit & Haushaltsbelastung",
          icon: "Home",
          items: [
            "Weniger Zeit für Feuerholz sammeln und Wasser abkochen",
            "Mehr Zeit für Kinderbetreuung, Ruhe, Hausaufgaben oder Lernen",
          ],
        },
        {
          title: "Würde & Selbstständigkeit",
          icon: "Sparkle",
          items: ["Mehr Würde, Komfort und Selbstständigkeit"],
        },
        {
          title: "Klima & Rauchminderung",
          icon: "Wind",
          items: ["Weniger Rauchbelastung im Haus"],
        },
      ],
      closing:
        "Diese Erfahrungen sind wichtig, weil sie zeigen, was sicheres Wasser auf Haushaltsebene bedeutet. Die Wirkung ist nicht abstrakt. Sie zeigt sich beim Kochen, in der Schule, in der Gesundheit, in der verfügbaren Zeit, im Selbstvertrauen und im täglichen Wohlbefinden.",
    },

    videos: {
      eyebrow: "Ansehen",
      title: "PureFlow Amanzi im Einsatz",
      intro:
        "Videos zeigen, was hinter den Zahlen steht: die Gemeinden, die Haushalts-Rollouts, WASH-Bildung, lokale Teams, Partnerschaften und Kinder, die sichere Wassergewohnheiten lernen.",
      mainHeading: "Hauptvideos",
      guidesHeading: "Schritt-für-Schritt-Anleitungen",
      mainVideos: [
        { id: "IoRHLU5Cm7o", title: "PureFlow Amanzi Überblick", description: "Eine Einführung in PureFlow Amanzi und die Safe-Water-Arbeit in ländlichen Gemeinden." },
        { id: "ZsCUcyV9MTg", title: "Kleine ECD-Wasserbotschafter", description: "Kinder im ECD-Zentrum lernen über sicheres Wasser und tragen WASH-Wissen in ihre Familien." },
        { id: "MJAD9N-oW3M", title: "Partnerschaftsmodell in der Praxis", description: "Ein Beispiel aus dem Feld, das sichere Wasserverteilung, lokale Eigenverantwortung und partnerschaftlichen Rollout zeigt." },
      ],
      guides: [
        { id: "z4AekP8-Luc", title: "Anleitung zur Nutzung" },
        { id: "kz8EPC6FWUc", title: "Anleitung zur Reinigung" },
        { id: "Ad3enwiOVI0", title: "Anleitung zur Montage" },
      ],
    },

    focus: {
      eyebrow: "Verbundene Fürsorge",
      title: "Sicheres Wasser stärkt die ganze Gemeinschaft",
      body: [
        "PureFlow Amanzi ist mit mehreren Arbeitsschwerpunkten von iThemba Kuluntu verbunden.",
        "Das Projekt unterstützt sicheres Wasser durch Haushaltsfiltration. Es stärkt die Gemeindegesundheit, weil Wasser Krankheit, Hygiene und familiäres Wohlbefinden beeinflusst. Es unterstützt Bildung, weil Kinder besser lernen, wenn sie gesund und geschützt sind. Es ist mit Ernährungssicherheit verbunden, weil sicheres Wasser für Kochen, Mahlzeiten und Kinderernährung wichtig ist. Es unterstützt Klimaresilienz, indem Feuerholzverbrauch reduziert und Familien im Umgang mit Wasserrisiken gestärkt werden. Es stärkt Kompetenzen und Lebensgrundlagen durch lokale Montage, Wartung, Schulung, Nachbetreuung und Datenerfassung. Es unterstützt auch Katastrophenhilfe, weil das System in Notlagen schnellen Zugang zu sichererem Wasser ermöglichen kann.",
      ],
      items: [
        { icon: "Droplet", label: "Sicheres Wasser" },
        { icon: "HeartPulse", label: "Gemeindegesundheit" },
        { icon: "GraduationCap", label: "Bildung" },
        { icon: "Utensils", label: "Ernährungssicherheit" },
        { icon: "CloudSun", label: "Klimaresilienz" },
        { icon: "Wrench", label: "Kompetenzen & Lebensgrundlagen" },
        { icon: "HandHeart", label: "Katastrophenhilfe" },
      ],
      closing: "PureFlow Amanzi ist kein isoliertes Filterprojekt. Es ist Teil eines umfassenderen Systems der Fürsorge.",
    },

    partnership: {
      eyebrow: "Skalierbar",
      title: "Ein praktisches Modell für Partner und Förderer",
      body: [
        "PureFlow Amanzi ist darauf ausgelegt, durch Partnerschaften zu wachsen.",
        "Das Modell ist praktisch genug für ländliche Bedingungen, strukturiert genug für Verantwortlichkeit und flexibel genug, um in unterschiedlichen Gemeinden und Distrikten zu funktionieren.",
      ],
      items: [
        "Lokale Teams werden in Rollout, Montage und WASH-Begleitung geschult",
        "Gemeindestrukturen werden für Mobilisierung und Koordination eingebunden",
        "Haushaltsverteilung wird mit praktischen Schulungseinheiten verbunden",
        "Standardisierte Rollout-Schritte können in anderen Regionen wiederholt werden",
        "Feldbegleitung und einfache Dokumentation sind in die Umsetzung integriert",
        "Hausbesuche und Datenerfassung gehören zum Modell",
        "Berichte für Spender, Partner und Förderer werden unterstützt",
      ],
      closing:
        "Das ist Basisarbeit, die professionell umgesetzt wird: vertrauenswürdig, messbar, gemeindegeführt und bereit, mit den richtigen Partnern zu wachsen.",
    },

    donationSupport: {
      eyebrow: "Ihre Unterstützung",
      title: "Helfen Sie einem Haushalt, Zugang zu sichererem Wasser zu erhalten",
      intro:
        "Spenden helfen, PureFlow Amanzi von der Produktion bis zur Verteilung, Bildung, Nachbetreuung und langfristigen Verantwortlichkeit am Laufen zu halten.",
      groups: [
        {
          title: "Wassersysteme",
          icon: "Droplet",
          items: ["Haushalts-Wasserfiltersysteme", "Filterkomponenten und Montagematerial"],
        },
        {
          title: "Schulung & lokale Arbeit",
          icon: "Briefcase",
          items: ["Schulung für lokale Montage", "Wartungsschulung", "Feldkoordination"],
        },
        {
          title: "Nachbetreuung von Haushalten",
          icon: "HandHeart",
          items: ["WASH-Bildung", "Vorführungen in Haushalten", "Verteilung und Transport", "Hausbesuche zur Nachbetreuung"],
        },
        {
          title: "Schulen, ECD & Berichte",
          icon: "School",
          items: ["Unterstützung für Schulen und ECD-Zentren", "Datenerfassung und Berichterstattung", "Monitoring und Dokumentation"],
        },
      ],
      closing:
        "Eine Spende für PureFlow Amanzi hilft Familien, zu Hause Zugang zu sichererem Wasser zu erhalten, und unterstützt die lokalen Strukturen, die das Programm wirksam machen.",
    },

    monthly: {
      eyebrow: "Monatlich geben",
      title: "Sicheres Wasser jeden Monat unterstützen",
      body: [
        "Sicheres Wasser braucht Beständigkeit. Familien brauchen sichereres Wasser nicht nur einmal. Sie brauchen verlässliche Systeme, klare Anleitung und Nachbetreuung, damit das Programm stark bleibt.",
        "Monatliche Spenden helfen iThemba Kuluntu, vorausschauend zu planen, lokale Teams zu schulen, mehr Haushalte zu erreichen und Bildung, Wartung und Monitoring weiterzuführen.",
      ],
      cardHeading: "Einen Haushalt unterstützen",
      cardAmount: "30 € / Monat",
      cardText:
        "Hilft einem Haushalt, durch PureFlow Amanzi zu Hause Zugang zu sichererem Wasser zu erhalten, einschließlich Filtration, WASH-Bildung, lokaler Verteilung und Nachbetreuung.",
      cta1: "Sicheres Wasser monatlich unterstützen",
      cta2: "Einmalig für PureFlow Amanzi spenden",
      trust: [
        "Sichere Spende",
        "Monatliche Unterstützung",
        "Zugang zu sicherem Wasser",
        "WASH-Bildung",
        "Lokale Arbeitsplätze",
        "Klimaresilienz",
        "Transparente Berichterstattung",
      ],
    },

    closing: {
      eyebrow: "Sicheres Wasser",
      title: "Helfen Sie Familien, ihren Alltag zu stärken",
      body: [
        "PureFlow Amanzi gibt es, weil sicheres Wasser den Alltag verändert. Es schützt Kinder, unterstützt Betreuungspersonen, schafft lokale Arbeit, stärkt Schulen und ECD-Zentren und hilft ländlichen Familien, widerstandsfähiger zu werden.",
        "Ihre Unterstützung hilft, Safe-Water-Systeme, WASH-Bildung, geschulte lokale Teams, Hausbesuche und verantwortliche Umsetzung zu Gemeinden zu bringen, die sie brauchen.",
      ],
      monthly: "Monatlich für dieses Projekt spenden",
      once: "Einmalig spenden",
      all: "Alle Projekte entdecken",
    },
  },

  /* =============================================================== NL */
  nl: {
    back: "Alle projecten",
    onThisPage: "Op deze pagina",
    nav: [
      { id: "impact", label: "Impact" },
      { id: "sdgs", label: "SDG’s" },
      { id: "how-it-works", label: "Hoe het werkt" },
      { id: "local-jobs", label: "Lokale banen" },
      { id: "wash", label: "WASH" },
      { id: "climate", label: "Klimaat" },
      { id: "videos", label: "Video’s" },
      { id: "donate", label: "Doneer" },
    ],

    hero: {
      eyebrow: "Veilig water",
      title: "PureFlow Amanzi",
      text:
        "PureFlow Amanzi brengt veilig drinkwater, WASH-educatie, lokale werkgelegenheid en klimaatbestendige waterfiltratie naar families, scholen en ECD-centra in landelijke gebieden van Zuid-Afrika.",
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      small: "€30 per maand helpt één huishouden thuis toegang te krijgen tot veiliger water.",
      placeholder: "Hero-video placeholder · klaar voor echte PureFlow Amanzi-video",
      location: "Pondoland · Eastern Cape · Zuid-Afrika",
    },

    impact: {
      eyebrow: "Impact",
      title: "Veilig water dat het dagelijks leven verandert",
      body: [
        "PureFlow Amanzi is een van de belangrijkste programma’s van iThemba Kuluntu, omdat veilig water tegelijk invloed heeft op gezondheid, onderwijs, gezinsstabiliteit, lokale werkgelegenheid en klimaatbestendigheid.",
        "Dit project gaat niet alleen over het geven van een waterfilter aan families. Het bouwt een praktisch systeem rond het huishouden: veilig drinkwater, WASH-educatie, lokale assemblage, training in de gemeenschap, huisbezoeken, gegevensverzameling en langdurige verantwoording.",
      ],
      note:
        "Elk cijfer staat voor meer dan distributie. Het staat voor lokale teams, training, huishoudeducatie, opvolging en vertrouwen binnen de gemeenschap.",
      items: [
        { value: 3094, suffix: "", iconSrc: "/assets/icons/impact/impact-safe-water-systems.png", label: { en: "Households reached", de: "Haushalte erreicht", nl: "Huishoudens bereikt" } },
        { value: 14211, suffix: "", iconSrc: "/assets/icons/impact/impact-people-reached.png", label: { en: "People with clean water", de: "Menschen mit sauberem Wasser", nl: "Mensen met schoon water" } },
        { value: 30, suffix: "M+", label: { en: "Litres of clean water delivered", de: "Liter sauberes Wasser bereitgestellt", nl: "Liter schoon water geleverd" } },
        { value: 8000, suffix: "+", label: { en: "Tonnes of CO₂ reduced", de: "Tonnen CO₂ reduziert", nl: "Ton CO₂ verminderd" } },
        { value: 4, suffix: "M+", label: { en: "Kilograms of firewood saved", de: "Kilogramm Feuerholz eingespart", nl: "Kilogram brandhout bespaard" } },
        { value: 12000, suffix: "+", label: { en: "Trees saved", de: "Bäume geschützt", nl: "Bomen beschermd" } },
      ],
    },

    sdg: {
      eyebrow: "Werelddoelen",
      title: "Eén project, meerdere lagen van impact",
      intro:
        "PureFlow Amanzi draagt direct bij aan meerdere Duurzame Ontwikkelingsdoelen door veilig water, gezondheidsbescherming, onderwijs, lokale banen, klimaatactie en gemeenschapsgerichte uitvoering met elkaar te verbinden.",
      items: [
        { number: 1, title: "Geen armoede", connection: "Vermindert de druk op kwetsbare huishoudens door watergerelateerde gezondheidsrisico’s, medische kosten en acute huishoudelijke kwetsbaarheid te verlagen." },
        { number: 3, title: "Goede gezondheid en welzijn", connection: "Veiliger water en WASH-educatie helpen families beschermen tegen watergerelateerde ziekten en verminderen blootstelling aan rook door het koken van water." },
        { number: 4, title: "Kwaliteitsonderwijs", connection: "Kinderen leren beter wanneer zij gezond, gehydrateerd en beschermd zijn. WASH-educatie bouwt bovendien praktische kennis op in scholen en ECD-centra." },
        { number: 5, title: "Gendergelijkheid", connection: "Wateronzekerheid en het verzamelen van brandhout leggen vaak een zware last op vrouwen en meisjes. Veiliger water in huis kan dagelijkse druk verminderen en tijd vrijmaken voor zorg, leren, werk en leiderschap." },
        { number: 6, title: "Schoon water en sanitair", connection: "Dit is de kern van het project. PureFlow Amanzi biedt toegang tot veiliger drinkwater op huishoudniveau door filtratie, educatie en opvolging." },
        { number: 8, title: "Waardig werk en economische groei", connection: "Het project creëert lokaal werk door assemblage, distributie, training, onderhoud, WASH-begeleiding, huisbezoeken en gegevensverzameling, met nadruk op werkgelegenheid binnen de gemeenschap." },
        { number: 10, title: "Ongelijkheid verminderen", connection: "PureFlow Amanzi bereikt landelijke en onderbediende gemeenschappen die vaak beperkte toegang hebben tot infrastructuur, diensten en veilig drinkwater." },
        { number: 11, title: "Duurzame steden en gemeenschappen", connection: "Het programma versterkt de veerkracht van gemeenschappen door oplossingen op huishoudniveau, lokale betrokkenheid en praktische ondersteuning in gebieden met beperkte infrastructuur." },
        { number: 12, title: "Verantwoorde consumptie en productie", connection: "De filter vermindert afhankelijkheid van flessenwater, ondersteunt wateroplossingen met weinig afval en stimuleert verantwoord gebruik van natuurlijke hulpbronnen." },
        { number: 13, title: "Klimaatactie", connection: "Doordat water minder vaak gekookt hoeft te worden, vermindert PureFlow Amanzi het gebruik van brandhout, verlaagt het CO₂-uitstoot en helpt het bomen en lokale ecosystemen beschermen." },
        { number: 17, title: "Partnerschappen om doelstellingen te bereiken", connection: "Het programma is ontworpen om te groeien via samenwerking tussen gemeenschappen, donoren, partners, lokale leiders en de veldteams van iThemba Kuluntu." },
      ],
      outro:
        "De SDG’s laten de bredere betekenis van het project zien. Toch blijft de kern van PureFlow Amanzi lokaal: één huishouden, één school, één ECD-centrum en één gemeenschap tegelijk.",
    },

    snapshot: {
      eyebrow: "In één oogopslag",
      title: "Veilig water, lokale vaardigheden en betrouwbare uitvoering",
      body: [
        "PureFlow Amanzi is een gemeenschapsgericht safe-water-programma van iThemba Kuluntu. Het ondersteunt landelijke huishoudens, scholen, ECD-centra, klinieken en kwetsbare gemeenschapslocaties met zwaartekrachtgestuurde waterfiltratie, WASH-educatie, lokale assemblage, huishoudtraining en opvolging.",
        "Het systeem is ontwikkeld voor landelijke gebieden en plekken met beperkte infrastructuur. Het werkt zonder elektriciteit, zonder chemicaliën en zonder water te koken. Daardoor is het praktisch bruikbaar voor families die thuis een veilige wateroplossing nodig hebben.",
        "Het programma wordt in Zuid-Afrika ontwikkeld, geassembleerd en verspreid. Lokale gemeenschapsleden worden getraind in assemblage, onderhoud, uitrol, WASH-educatie en huisbezoeken. Zo ontstaan banen, technische vaardigheden en een uitvoering die stevig in de gemeenschap verankerd blijft.",
      ],
      facts: [
        { label: "Project", value: "PureFlow Amanzi" },
        { label: "Focus", value: "Veilig water, WASH-educatie, lokale werkgelegenheid en klimaatbestendigheid" },
        { label: "Waar", value: "Landelijke en onderbediende gemeenschappen in Zuid-Afrika, met een sterke focus op Pondoland en de Eastern Cape" },
        { label: "Kernondersteuning", value: "Waterfiltratie voor huishoudens, WASH-educatie, lokale assemblage, distributie, onderhoud, huisbezoeken en impactmeting" },
        { label: "Wie het steunt", value: "Huishoudens, scholen, ECD-centra, klinieken, ouderenvoorzieningen en nood- of rampenhulpcontexten" },
        { label: "Hoe het werkt", value: "Zwaartekrachtgestuurde filtratie zonder elektriciteit, zonder chemicaliën en zonder koken" },
        { label: "Donatiefocus", value: "€30 per maand helpt één huishouden thuis toegang te krijgen tot veiliger water" },
      ],
    },

    why: {
      eyebrow: "Waarom",
      title: "water alles verandert",
      body: [
        "Onveilig water gaat over veel meer dan dorst.",
        "Wanneer families afhankelijk zijn van vervuild water, worden kinderen kwetsbaarder voor ziekte, dragen verzorgers voortdurende zorgen, kan schoolbezoek onder druk komen te staan en geven huishoudens vaak geld uit aan vervoer, medicijnen of alternatieven.",
        "In veel landelijke gemeenschappen halen families water uit onveilige bronnen die onbehandeld zijn, met dieren worden gedeeld of gemakkelijk vervuild raken. De gevolgen kunnen onder meer diarree, buikpijn, huidproblemen, parasieten, uitdroging en herhaalde kliniekbezoeken zijn.",
        "Veilig water verandert deze dagelijkse werkelijkheid. Het ondersteunt gezondheid, waardigheid, leren, gezinsstabiliteit en veerkracht binnen de gemeenschap.",
      ],
    },

    boil: {
      eyebrow: "Meer dan koken",
      title: "Een veiligere oplossing zonder brandhout, rook of elektriciteit",
      body: [
        "Water koken lijkt misschien een eenvoudige oplossing, maar in veel landelijke huishoudens brengt het nieuwe zware lasten met zich mee.",
        "Koken vraagt vaak om brandhout, tijd en blootstelling aan rook. Vrouwen en meisjes besteden soms uren aan het verzamelen van hout. Rook binnenshuis kan ademhalingsproblemen veroorzaken, vooral bij kinderen. Het gebruik van brandhout draagt bij aan ontbossing, bodemerosie en klimaatdruk.",
        "PureFlow Amanzi biedt een praktische alternatief. Het systeem filtert water zonder elektriciteit, zonder chemicaliën en zonder koken.",
      ],
      reduces: [
        "Brandhout verzamelen",
        "Blootstelling aan rook binnenshuis",
        "Druk op vrouwen en meisjes",
        "CO₂-uitstoot",
        "Ontbossing",
        "Plastic afval door flessenwater",
        "Afhankelijkheid van dure of onbetrouwbare alternatieven",
      ],
      closing: "Veilig water mag families niet hun gezondheid, tijd, bomen of toekomst kosten.",
    },

    tech: {
      eyebrow: "De technologie",
      title: "Eenvoudige filtratie voor landelijk gebruik",
      body: [
        "PureFlow Amanzi gebruikt zwaartekrachtgestuurde ultrafiltratie.",
        "Het water stroomt door een membraan met ultrafijne poriën van ongeveer 0,1 micron. Schadelijke bacteriën en vuildeeltjes worden tegengehouden, terwijl gezuiverd water doorstroomt.",
      ],
      bullets: [
        "Zwaartekrachtgestuurd",
        "Zonder elektriciteit",
        "Zonder chemicaliën",
        "Draagbaar",
        "Eenvoudig te assembleren",
        "Eenvoudig schoon te maken",
        "Onderhoudsarm",
        "Geschikt voor huishoudelijk gebruik",
        "Praktisch in landelijke gebieden en omgevingen met beperkte infrastructuur",
      ],
      closing:
        "Het systeem verwijdert schadelijke bacteriën en levert direct veilig drinkwater, zonder elektriciteit, chemicaliën of koken.",
      techNote:
        "Onafhankelijke tests bevestigen een verwijdering van meer dan 99,9999% van E. coli en totale coliformen.",
      steps: [
        { label: "Vervuild water erin", text: "Water uit een onveilige bron wordt in de bovenste kamer gegoten." },
        { label: "Ultrafiltratiemembraan", text: "Een membraan van 0,1 micron houdt schadelijke bacteriën en vuil tegen." },
        { label: "Veiliger drinkwater eruit", text: "Gezuiverd water stroomt door — direct drinkbaar, zonder te koken." },
      ],
      detailsTitle: "Hoe de filter werkt",
      detailsLabel: "Technische details",
    },

    jobs: {
      eyebrow: "Lokale bestaanszekerheid",
      title: "Veilig water creëert ook werk",
      body: [
        "PureFlow Amanzi is zo opgezet dat het lokale waarde creëert, niet alleen een product levert.",
        "Mensen uit de gemeenschap worden getraind in filterassemblage, onderhoud, uitrol, WASH-begeleiding, huishoudtraining en opvolging. Dit bouwt praktische vaardigheden op en creëert werkgelegenheid binnen de gemeenschappen waar het project actief is.",
      ],
      items: [
        { icon: "Cog", label: "Filterassemblage" },
        { icon: "Truck", label: "Ondersteuning bij distributie en uitrol" },
        { icon: "BookOpen", label: "WASH-educatiesessies" },
        { icon: "Home", label: "Demonstraties bij huishoudens" },
        { icon: "Wrench", label: "Onderhoudsbegeleiding" },
        { icon: "HandHeart", label: "Opvolgbezoeken aan huishoudens" },
        { icon: "ClipboardCheck", label: "Verzamelen van feedback uit de gemeenschap" },
        { icon: "LineChart", label: "Gegevensverzameling en rapportage" },
        { icon: "MapPin", label: "Veldcoördinatie" },
        { icon: "Briefcase", label: "Ondersteuning voor rapportage aan donoren en partners" },
      ],
      closing: [
        "Dit is belangrijk omdat veilig water ook de lokale economie moet versterken. Wanneer getrainde gemeenschapsleden systemen assembleren, huishoudens bezoeken, gebruik en onderhoud uitleggen, feedback verzamelen en impact bijhouden, wordt het project betrouwbaarder, meer gedragen en duurzamer.",
        "PureFlow Amanzi is daarom niet alleen een safe-water-project. Het is ook een project voor vaardigheden, werkgelegenheid en lokaal eigenaarschap.",
      ],
    },

    model: {
      eyebrow: "Hoe het werkt",
      title: "Een volledig uitrolmodel, niet alleen een filter",
      intro: "PureFlow Amanzi combineert technologie, training, gemeenschapsmobilisatie en opvolging.",
      steps: [
        { title: "Gemeenschapsmobilisatie", body: "Lokale leiders en gemeenschapsstructuren helpen uitrolgebieden te identificeren en vertrouwen op te bouwen." },
        { title: "Training lokale teams", body: "Gemeenschapsleden worden getraind in assemblage, onderhoud, WASH-begeleiding en ondersteuning van huishoudens." },
        { title: "Systeemassemblage", body: "Filters worden door getrainde lokale teams volgens gestandaardiseerde processen geassembleerd." },
        { title: "Distributie aan huishoudens", body: "Safe-water-systemen worden verspreid naar huishoudens, scholen, ECD-centra en kwetsbare gemeenschapslocaties." },
        { title: "WASH-educatie", body: "Families krijgen praktische begeleiding over veilig water, hygiëne, filtergebruik, schoonmaak en opslag." },
        { title: "Opvolging huishoudens", body: "Getrainde lokale teams bezoeken huishoudens om gebruik, onderhoud, staat van het systeem en ervaringen van families te controleren." },
        { title: "Data en rapportage", body: "Teams verzamelen feedback en veldgegevens ter ondersteuning van verantwoording, donorrapportage en toekomstige verbetering." },
      ],
      outro:
        "Daarom is PureFlow Amanzi gebouwd om te kunnen opschalen. Het is praktisch, meetbaar, gemeenschapsgeleid en klaar voor sterke partnerschappen.",
    },

    wash: {
      eyebrow: "WASH",
      title: "Kennis maakt veilig water sterker",
      body: [
        "WASH staat voor water, sanitatie en hygiëne. Binnen PureFlow Amanzi is WASH-educatie essentieel.",
        "Families ontvangen niet alleen een filter. Zij krijgen ook begeleiding over waarom veilig water belangrijk is, hoe het systeem correct wordt gebruikt, hoe het wordt schoongemaakt, hoe water veilig wordt bewaard en hoe herbesmetting na filtratie kan worden voorkomen.",
      ],
      supports: [
        "Veilig omgaan met water",
        "Correct filtergebruik",
        "Reiniging en onderhoud",
        "Schone wateropslag",
        "Hygiënebewustzijn",
        "Vermindering van besmettingsrisico",
        "Gezondere routines thuis",
        "Veiligere leeromgevingen in scholen en ECD-centra",
      ],
      closing:
        "De filter is het hulpmiddel. Educatie zorgt ervoor dat families het goed gebruiken, erop vertrouwen en het werkend houden.",
    },

    children: {
      eyebrow: "Kinderen eerst",
      title: "Veilig water waar kinderen leren",
      body: [
        "PureFlow Amanzi ondersteunt ook plekken waar kinderen leren, spelen en groeien.",
        "Scholen en ECD-centra hebben veiliger water nodig omdat kinderen bijzonder kwetsbaar zijn voor watergerelateerde ziekten. Veilig water ondersteunt leren, voeding, hygiëne en dagelijkse zorg.",
        "Bij het iThemba Kuluntu No.1 ECD Centre maakt PureFlow Amanzi deel uit van een breder systeem voor het welzijn van kinderen. Kinderen hebben veilig water, voedsel, hygiëne, routine, spel, rust en vroege educatie nodig om zich goed te kunnen ontwikkelen.",
        "Het systeem geeft kinderen ook een praktische manier om waterveiligheid te begrijpen. Wanneer kinderen schoon water leren begrijpen, nemen zij die kennis mee naar huis en helpen zij gezondere gewoonten binnen hun families op te bouwen.",
      ],
    },

    climate: {
      eyebrow: "Klimaatbestendigheid",
      title: "Veilig water zonder koken",
      body: [
        "PureFlow Amanzi is ook een programma voor klimaatbestendigheid.",
        "Omdat het systeem zonder koken werkt, helpt het de behoefte aan brandhout te verminderen. Dit verlaagt blootstelling aan rook, vermindert druk op bossen en beperkt uitstoot die ontstaat door waterzuivering boven open vuur.",
      ],
      benefits: [
        "Minder CO₂-uitstoot",
        "Minder gebruik van brandhout",
        "Minder druk op bossen",
        "Minder rookblootstelling binnenshuis",
        "Minder plastic afval door flessenwater",
        "Betere luchtkwaliteit",
        "Bescherming van habitats en ecosystemen",
        "Sterkere veerkracht in off-grid en rampgevoelige gebieden",
      ],
      closing:
        "Een huishoudelijke waterfilter kan niet elk waterprobleem oplossen. Maar het geeft families een praktisch hulpmiddel om dagelijks water veiliger te maken in een veranderend klimaat.",
    },

    monitor: {
      eyebrow: "Verantwoording",
      title: "Opvolging maakt de impact sterker",
      body: [
        "PureFlow Amanzi omvat monitoring en impactmeting omdat langdurig succes meer vraagt dan distributie.",
        "Getrainde lokale teams bezoeken een selectie van huishoudens om te controleren of filters correct worden gebruikt, of onderhoud wordt begrepen, in welke staat het systeem verkeert en hoe families het water ervaren.",
      ],
      items: [
        "Regelmatige steekproefbezoeken aan huishoudens",
        "Beoordeling van filtergebruik, zorg en staat",
        "Ondersteuning bij onderhoud",
        "Verzameling van feedback van huishoudens",
        "Feedback over waterkwaliteit en gezondheidsuitkomsten",
        "Datagedreven rapportage voor donoren en partners",
        "Voortdurend leren om toekomstige uitrollen te verbeteren",
      ],
      closing: [
        "Deze opvolging creëert verantwoording. Het helpt het team begrijpen wat werkt, waar ondersteuning nodig is en hoe het programma kan groeien zonder kwaliteit te verliezen.",
        "Het creëert bovendien lokale werkgelegenheid en versterkt het vertrouwen van donoren, omdat het project echte veldgegevens kan tonen, niet alleen distributiecijfers.",
      ],
    },

    results: {
      eyebrow: "In het dagelijks leven",
      title: "Wat families teruggeven",
      intro:
        "Families die PureFlow Amanzi-systemen hebben ontvangen, melden concrete veranderingen in hun dagelijks leven.",
      groups: [
        {
          title: "Gezondheid",
          icon: "HeartPulse",
          items: [
            "Minder diarree en buikpijn",
            "Minder huiduitslag en haarproblemen",
            "Minder kliniekbezoeken door maag- en darmklachten",
            "Minder uitgaven aan medicijnen",
          ],
        },
        {
          title: "Kinderen & school",
          icon: "School",
          items: [
            "Betere gezondheid, stemming en energie bij kinderen",
            "Minder schoolverzuim",
            "Schonere en beter smakende voeding en dranken",
          ],
        },
        {
          title: "Tijd & huishoudelijke last",
          icon: "Home",
          items: [
            "Minder tijd besteed aan brandhout verzamelen en water koken",
            "Meer tijd voor kinderzorg, rust, schoolwerk of studie",
          ],
        },
        {
          title: "Waardigheid & zelfredzaamheid",
          icon: "Sparkle",
          items: ["Meer waardigheid, comfort en zelfredzaamheid"],
        },
        {
          title: "Klimaat & rookvermindering",
          icon: "Wind",
          items: ["Minder rookblootstelling in huis"],
        },
      ],
      closing:
        "Deze ervaringen zijn belangrijk omdat ze laten zien wat veilig water op huishoudniveau betekent. De impact is niet abstract. Ze is zichtbaar bij het koken, op school, in gezondheid, in beschikbare tijd, in vertrouwen en in dagelijks welzijn.",
    },

    videos: {
      eyebrow: "Bekijk",
      title: "PureFlow Amanzi in het veld",
      intro:
        "Video laat zien wat achter de cijfers schuilgaat: de gemeenschappen, huishoudelijke uitrollen, WASH-educatie, lokale teams, partnerschappen en kinderen die veilige watergewoonten leren.",
      mainHeading: "Hoofdvideo’s",
      guidesHeading: "Stap-voor-stap handleidingen",
      mainVideos: [
        { id: "IoRHLU5Cm7o", title: "PureFlow Amanzi overzicht", description: "Een introductie tot PureFlow Amanzi en het safe-water-werk in landelijke gemeenschappen." },
        { id: "ZsCUcyV9MTg", title: "Kleine ECD-waterambassadeurs", description: "Kinderen in het ECD-centrum leren over veilig water en nemen WASH-kennis mee naar hun families." },
        { id: "MJAD9N-oW3M", title: "Partnerschapsmodel in de praktijk", description: "Een praktijkvoorbeeld dat veilige waterlevering, lokaal eigenaarschap en partnerschapsgerichte uitrol laat zien." },
      ],
      guides: [
        { id: "z4AekP8-Luc", title: "Hoe te gebruiken" },
        { id: "kz8EPC6FWUc", title: "Hoe schoon te maken" },
        { id: "Ad3enwiOVI0", title: "Hoe te assembleren" },
      ],
    },

    focus: {
      eyebrow: "Verbonden zorg",
      title: "Veilig water versterkt de hele gemeenschap",
      body: [
        "PureFlow Amanzi sluit aan bij verschillende focusgebieden van iThemba Kuluntu.",
        "Het project ondersteunt veilig water via filtratie op huishoudniveau. Het versterkt gemeenschapsgezondheid omdat water invloed heeft op ziekte, hygiëne en gezinswelzijn. Het ondersteunt educatie omdat kinderen beter leren wanneer zij gezond en beschermd zijn. Het sluit aan bij voedselzekerheid omdat veilig water belangrijk is voor koken, maaltijden en kindervoeding. Het ondersteunt klimaatbestendigheid door brandhoutgebruik te verminderen en families te helpen omgaan met waterrisico’s. Het versterkt vaardigheden en bestaansmogelijkheden via lokale assemblage, onderhoud, training, opvolging en datawerk. Het ondersteunt ook noodhulp, omdat het systeem in crisissituaties snel toegang tot veiliger water mogelijk kan maken.",
      ],
      items: [
        { icon: "Droplet", label: "Veilig water" },
        { icon: "HeartPulse", label: "Gemeenschapsgezondheid" },
        { icon: "GraduationCap", label: "Educatie" },
        { icon: "Utensils", label: "Voedselzekerheid" },
        { icon: "CloudSun", label: "Klimaatbestendigheid" },
        { icon: "Wrench", label: "Vaardigheden & bestaansmogelijkheden" },
        { icon: "HandHeart", label: "Noodhulp" },
      ],
      closing: "PureFlow Amanzi is geen losstaand filterproject. Het is onderdeel van een breder zorgsysteem.",
    },

    partnership: {
      eyebrow: "Klaar om op te schalen",
      title: "Een praktisch model voor partners en financiers",
      body: [
        "PureFlow Amanzi is ontworpen om via partnerschappen te groeien.",
        "Het model is praktisch genoeg voor landelijke omstandigheden, gestructureerd genoeg voor verantwoording en flexibel genoeg om in verschillende gemeenschappen en districten te werken.",
      ],
      items: [
        "Lokale teams worden getraind in uitrol, assemblage en WASH-begeleiding",
        "Gemeenschapsstructuren worden betrokken bij mobilisatie en coördinatie",
        "Distributie aan huishoudens wordt gekoppeld aan praktische educatiesessies",
        "Gestandaardiseerde uitrolstappen kunnen in andere regio’s worden herhaald",
        "Veldbegeleiding en eenvoudige documentatie zijn onderdeel van de uitvoering",
        "Huisbezoeken en gegevensverzameling horen bij het model",
        "Rapportage voor donoren en partners wordt ondersteund",
      ],
      closing:
        "Dit is grassroots-implementatie op een professionele manier: vertrouwd, meetbaar, gemeenschapsgeleid en klaar om met de juiste partners te groeien.",
    },

    donationSupport: {
      eyebrow: "Uw steun",
      title: "Help één huishouden toegang te krijgen tot veiliger water",
      intro:
        "Donaties helpen PureFlow Amanzi draaiende te houden, van productie tot distributie, educatie, opvolging en langdurige verantwoording.",
      groups: [
        {
          title: "Watersystemen",
          icon: "Droplet",
          items: ["Waterfiltersystemen voor huishoudens", "Filteronderdelen en assemblagemateriaal"],
        },
        {
          title: "Training & lokale banen",
          icon: "Briefcase",
          items: ["Training voor lokale assemblage", "Onderhoudstraining", "Veldcoördinatie"],
        },
        {
          title: "Opvolging huishoudens",
          icon: "HandHeart",
          items: ["WASH-educatie", "Demonstraties bij huishoudens", "Distributie en transport", "Opvolgbezoeken aan huishoudens"],
        },
        {
          title: "Scholen, ECD & rapportage",
          icon: "School",
          items: ["Ondersteuning voor scholen en ECD-centra", "Gegevensverzameling en rapportage", "Monitoring en documentatie"],
        },
      ],
      closing:
        "Een donatie aan PureFlow Amanzi helpt families thuis toegang te krijgen tot veiliger water en ondersteunt de lokale systemen die het programma effectief maken.",
    },

    monthly: {
      eyebrow: "Geef maandelijks",
      title: "Steun veilig water elke maand",
      body: [
        "Veilig water vraagt om continuïteit. Families hebben veiliger water niet maar één keer nodig. Zij hebben betrouwbare systemen, duidelijke begeleiding en opvolging nodig om het programma sterk te houden.",
        "Maandelijkse donaties helpen iThemba Kuluntu vooruit te plannen, lokale teams te trainen, meer huishoudens te bereiken en educatie, onderhoud en monitoring voort te zetten.",
      ],
      cardHeading: "Steun een huishouden",
      cardAmount: "€30 / maand",
      cardText:
        "Helpt één huishouden thuis toegang te krijgen tot veiliger water via PureFlow Amanzi, inclusief filtratie, WASH-educatie, lokale distributie en opvolging.",
      cta1: "Steun veilig water maandelijks",
      cta2: "Doneer eenmalig aan PureFlow Amanzi",
      trust: [
        "Veilig doneren",
        "Maandelijkse steun",
        "Toegang tot veilig water",
        "WASH-educatie",
        "Lokale banen",
        "Klimaatbestendigheid",
        "Transparante rapportage",
      ],
    },

    closing: {
      eyebrow: "Veilig water",
      title: "Help families hun dagelijks leven versterken",
      body: [
        "PureFlow Amanzi bestaat omdat veilig water het dagelijks leven verandert. Het beschermt kinderen, ondersteunt verzorgers, creëert lokaal werk, versterkt scholen en ECD-centra en helpt landelijke families veerkrachtiger te worden.",
        "Uw steun helpt safe-water-systemen, WASH-educatie, getrainde lokale teams, huisbezoeken en verantwoordelijke uitvoering naar gemeenschappen te brengen die dit nodig hebben.",
      ],
      monthly: "Maandelijks doneren voor dit project",
      once: "Eenmalig doneren",
      all: "Alle projecten bekijken",
    },
  },
};

/* ============================== ICON REGISTRY ============================== */
const ICONS: Record<string, LucideIcon> = {
  Heart, Sparkles, Sun, Users, MapPin, Building2, Truck, HandHeart, Package, Flame,
  Home, Droplets, Droplet, Stethoscope, GraduationCap, Sprout, Leaf, TreePine, Wind,
  Recycle, Wrench, Cog, ClipboardCheck, LineChart, School, Baby, ShieldCheck, Handshake,
  Globe2, Briefcase, HeartPulse, Utensils, CloudSun, BookOpen, Sparkle, CheckCircle2,
};

/* ============================== SMALL HELPERS ============================== */
function SectionHeading({
  eyebrow,
  title,
  center = false,
  onLight = true,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
  onLight?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <div
        className="hand-eyebrow-lg"
        style={{ color: onLight ? "var(--ithemba-blue)" : "var(--ithemba-yellow)" }}
      >
        {eyebrow}
      </div>
      <h2
        className={`-mt-1 font-display text-4xl font-bold md:text-5xl ${
          onLight ? "text-[var(--ithemba-blue-dark)]" : "text-white"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

function Wave({
  from = "var(--ithemba-cream)",
  to = "var(--background)",
}: {
  from?: string;
  to?: string;
}) {
  return (
    <div style={{ background: from }}>
      <svg className="block w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}

function SunDoodle({ className = "h-10 w-10 text-[var(--ithemba-yellow)]/60" }) {
  return <Sun className={className} aria-hidden />;
}

/* ============================== HERO ============================== */
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
            label="PureFlow Amanzi — safe water in rural Pondoland"
            className="h-full w-full"
            rounded="rounded-none"
            tone="ocean"
            showMissingBadge={false}
          />
        )}
        {!showVideo && (
          <img
            src={FALLBACK_POSTER}
            alt=""
            aria-hidden
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/90 via-[var(--ithemba-blue-dark)]/72 to-[var(--ithemba-blue)]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>

      {/* video placeholder badge */}
      <div className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 ring-1 ring-white/15 backdrop-blur">
        <PlayCircle className="h-3.5 w-3.5 text-[var(--ithemba-yellow)]" />
        {c.hero.placeholder}
      </div>

      {/* water decorative accents */}
      <div className="pointer-events-none absolute left-10 top-24 text-[var(--ithemba-yellow)]/40">
        <Droplets className="h-7 w-7" />
      </div>
      <div className="pointer-events-none absolute right-20 bottom-32 text-[var(--ithemba-yellow)]/40">
        <Droplet className="h-6 w-6" />
      </div>
      <svg
        className="pointer-events-none absolute bottom-24 left-1/3 w-72 opacity-30"
        viewBox="0 0 300 30"
        aria-hidden
      >
        <path
          d="M0,15 C50,5 100,25 150,15 C200,5 250,25 300,15"
          stroke="var(--ithemba-yellow)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 md:pb-32 md:pt-28 lg:px-8">
        {/* top row: back + logo */}
        <div className="flex items-start justify-between gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-white/85 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> {c.back}
          </Link>
          <SmartLogo
            src={LOGO_PUREFLOW}
            alt="PureFlow Amanzi logo"
            className="h-16 w-auto max-w-[10rem] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] md:h-24 md:max-w-[13rem]"
            showMissingBadge={false}
            fallback={<span className="sr-only">PureFlow Amanzi</span>}
          />
        </div>

        <div className="mt-8 max-w-3xl text-white">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm flex items-center gap-2">
            <Droplet className="h-5 w-5" /> {c.hero.eyebrow}
          </div>
          <h1 className="mt-2 font-display text-[clamp(2.25rem,5.5vw,4.25rem)] font-extrabold leading-[1.02] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            {c.hero.title}
          </h1>
          <svg className="mt-4 block w-48 md:w-72" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
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
            <Star className="h-3.5 w-3.5 fill-current text-[var(--ithemba-yellow)]" />
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

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--ithemba-yellow)]/15 px-4 py-1.5 text-xs font-medium text-[var(--ithemba-yellow)] ring-1 ring-[var(--ithemba-yellow)]/40">
            <Droplet className="h-3.5 w-3.5" />
            {c.hero.small}
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

/* ============================== STICKY ON-THIS-PAGE NAV ============================== */
function PageNav({ c }: { c: Copy }) {
  return (
    <nav
      aria-label={c.onThisPage}
      className="sticky top-16 z-30 -mt-1 border-y border-sky-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 lg:px-8">
        <span className="hidden shrink-0 pr-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ithemba-blue-dark)]/70 md:inline">
          {c.onThisPage}
        </span>
        {c.nav.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="shrink-0 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ithemba-blue-dark)] transition hover:border-[var(--ithemba-blue)] hover:bg-[var(--ithemba-blue)]/10"
          >
            {n.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ============================== IMPACT FIRST ============================== */
function Impact({ c }: { c: Copy }) {
  return (
    <section id="impact" className="scroll-mt-32">
      <div className="bg-[var(--ithemba-cream)] pt-16 pb-2">
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
          <SectionHeading eyebrow={c.impact.eyebrow} title={c.impact.title} center />
          <div className="mx-auto mt-5 max-w-3xl space-y-4 text-lg leading-relaxed text-foreground/85">
            {c.impact.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
      <ImpactCounters items={c.impact.items} title="" />
      <div className="bg-[var(--ithemba-cream)] pb-16">
        <p className="mx-auto max-w-3xl px-4 text-center text-base italic leading-relaxed text-foreground/70 lg:px-8">
          {c.impact.note}
        </p>
      </div>
    </section>
  );
}

/* ============================== SDG ALIGNMENT ============================== */
const SDG_COLORS: Record<number, string> = {
  1: "#E5243B",
  3: "#4C9F38",
  4: "#C5192D",
  5: "#FF3A21",
  6: "#26BDE2",
  8: "#A21942",
  10: "#DD1367",
  11: "#FD9D24",
  12: "#BF8B2E",
  13: "#3F7E44",
  17: "#19486A",
};

function Sdg({ c }: { c: Copy }) {
  return (
    <section
      id="sdgs"
      className="scroll-mt-32 relative overflow-hidden bg-white py-20"
    >
      <div className="pointer-events-none absolute -right-16 top-20 h-56 w-56 blob-2 bg-sky-300/15" />
      <div className="pointer-events-none absolute -left-16 bottom-20 h-44 w-44 blob bg-[var(--ithemba-yellow)]/15" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.sdg.eyebrow} title={c.sdg.title} />
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">{c.sdg.intro}</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {c.sdg.items.map((sdg) => (
            <div
              key={sdg.number}
              className="group relative flex flex-col items-center rounded-2xl border border-black/5 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl font-display text-2xl font-extrabold text-white shadow-md"
                style={{ background: SDG_COLORS[sdg.number] }}
                aria-hidden
              >
                {sdg.number}
              </div>
              <div className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-foreground/60">
                SDG {sdg.number}
              </div>
              <div className="mt-1 text-sm font-semibold leading-snug text-[var(--ithemba-blue-dark)]">
                {sdg.title}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Accordion type="single" collapsible className="mx-auto max-w-4xl">
            {c.sdg.items.map((sdg) => (
              <AccordionItem key={sdg.number} value={`sdg-${sdg.number}`}>
                <AccordionTrigger>
                  <span className="flex items-center gap-3 text-left">
                    <span
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                      style={{ background: SDG_COLORS[sdg.number] }}
                      aria-hidden
                    >
                      {sdg.number}
                    </span>
                    <span className="font-semibold text-[var(--ithemba-blue-dark)]">
                      SDG {sdg.number} — {sdg.title}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pl-10 text-sm leading-relaxed text-foreground/80">
                    {sdg.connection}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-base italic leading-relaxed text-foreground/70">
          {c.sdg.outro}
        </p>
      </div>
    </section>
  );
}

/* ============================== SNAPSHOT ============================== */
const SNAPSHOT_ICONS = [Droplet, Sparkles, MapPin, Package, Users, Cog, Heart];

function Snapshot({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -left-10 top-10 h-44 w-44 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-52 w-52 blob-2 bg-sky-300/20" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
          <div className="relative">
            <SmartImage
              src={PHOTO_BUCKET}
              label="PureFlow Amanzi gravity-fed filtration system in use"
              className="aspect-[4/5] w-full"
              tone="ocean"
              rounded="rounded-3xl"
              showMissingBadge={false}
            />
            <div
              className="absolute -bottom-5 -right-5 hidden h-24 w-24 items-center justify-center rounded-full text-white shadow-xl md:flex"
              style={{ background: "var(--ithemba-blue-dark)" }}
              aria-hidden
            >
              <Droplets className="h-9 w-9" />
            </div>
          </div>

          <div>
            <SectionHeading eyebrow={c.snapshot.eyebrow} title={c.snapshot.title} />
            <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/85">
              {c.snapshot.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {c.snapshot.facts.map((f, i) => {
                const Icon = SNAPSHOT_ICONS[i] ?? Heart;
                return (
                  <div
                    key={f.label}
                    className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sky-100"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ithemba-blue-dark)]/10 ring-1 ring-[var(--ithemba-blue-dark)]/15">
                      <Icon className="h-5 w-5 text-[var(--ithemba-blue-dark)]" />
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-foreground/60">
                        {f.label}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold leading-snug text-[var(--ithemba-blue-dark)]">
                        {f.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== WHY (blue photo) ============================== */
function Why({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white md:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_DEMO}
          label="Why safe water matters"
          className="h-full w-full"
          rounded="rounded-none"
          tone="ocean"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>
      <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> {c.why.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.why.title}</h2>
        </div>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-white/90">
          {c.why.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== BEYOND BOILING ============================== */
function Boil({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 blob bg-orange-200/40" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-56 w-56 blob-2 bg-sky-300/30" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading eyebrow={c.boil.eyebrow} title={c.boil.title} />
            <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/85">
              {c.boil.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <div className="flex items-center gap-2 text-orange-700">
                <Flame className="h-5 w-5" />
                <Wind className="h-5 w-5" />
                <TreePine className="h-5 w-5" />
              </div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-orange-700">
                Helps reduce
              </div>
              <ul className="mt-2 space-y-1.5 text-sm text-foreground/85">
                {c.boil.reduces.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center font-display text-xl italic text-[var(--ithemba-blue-dark)] md:text-2xl">
          “{c.boil.closing}”
        </p>
      </div>
    </section>
  );
}

/* ============================== HOW THE FILTER WORKS ============================== */
function Tech({ c }: { c: Copy }) {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-32 relative overflow-hidden bg-[var(--ithemba-cream)] py-20"
    >
      <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 blob-2 bg-sky-300/25" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.tech.eyebrow} title={c.tech.title} />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/85">
            {c.tech.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* 3-step visual */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {c.tech.steps.map((s, i) => (
            <div
              key={i}
              className="relative rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ithemba-blue)] font-display text-lg font-bold text-white">
                  {i + 1}
                </div>
                <div className="text-[var(--ithemba-blue-dark)]">
                  {i === 0 ? (
                    <Droplets className="h-7 w-7" />
                  ) : i === 1 ? (
                    <Cog className="h-7 w-7" />
                  ) : (
                    <Droplet className="h-7 w-7" />
                  )}
                </div>
              </div>
              <div className="mt-3 font-display text-lg font-bold text-[var(--ithemba-blue-dark)]">
                {s.label}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{s.text}</p>
            </div>
          ))}
        </div>

        {/* features pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {c.tech.bullets.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ithemba-blue-dark)] shadow-sm ring-1 ring-sky-100"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--ithemba-blue)]" />
              {b}
            </span>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-base leading-relaxed text-foreground/85">
          {c.tech.closing}
        </p>

        {/* technical accordion */}
        <div className="mt-8">
          <Accordion type="single" collapsible className="mx-auto max-w-3xl rounded-2xl bg-white px-5 shadow-sm ring-1 ring-sky-100">
            <AccordionItem value="tech-details" className="border-0">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-[var(--ithemba-blue-dark)]">
                  <ShieldCheck className="h-4 w-4" /> {c.tech.detailsLabel}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-foreground/80">{c.tech.techNote}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

/* ============================== LOCAL JOBS ============================== */
function Jobs({ c }: { c: Copy }) {
  const pathway = [
    "Training",
    "Assembly",
    "Distribution",
    "Household demos",
    "Maintenance",
    "Follow-up",
    "Data",
    "Reporting",
  ];
  return (
    <section
      id="local-jobs"
      className="scroll-mt-32 relative isolate overflow-hidden py-20 text-white md:py-24"
    >
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_DEMO}
          label="Local team training, assembly and household follow-up"
          className="h-full w-full"
          rounded="rounded-none"
          tone="ocean"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-[var(--ithemba-blue)]/55" />
        <div className="absolute left-[-6rem] bottom-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
            <Briefcase className="h-5 w-5" /> {c.jobs.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.jobs.title}</h2>
        </div>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-white/90">
          {c.jobs.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {c.jobs.items.map((it, i) => {
            const Icon = ICONS[it.icon] ?? HandHeart;
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur"
              >
                <Icon className="h-5 w-5 shrink-0 text-[var(--ithemba-yellow)]" />
                <span className="text-sm font-medium leading-snug text-white">{it.label}</span>
              </div>
            );
          })}
        </div>

        {/* pathway flow */}
        <div className="mt-10 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ithemba-yellow)]">
            Jobs & skills pathway
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {pathway.map((p, i) => (
              <div key={p} className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--ithemba-yellow)]/15 px-3 py-1 text-xs font-semibold text-[var(--ithemba-yellow)] ring-1 ring-[var(--ithemba-yellow)]/35">
                  {p}
                </span>
                {i < pathway.length - 1 && (
                  <span aria-hidden className="text-[var(--ithemba-yellow)]/60">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-white/85">
          {c.jobs.closing.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== MODEL TIMELINE ============================== */
function Model({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 blob-2 bg-sky-300/20" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.model.eyebrow} title={c.model.title} />
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">{c.model.intro}</p>
        </div>

        <ol className="relative mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {c.model.steps.map((s, i) => (
            <li
              key={s.title}
              className="group relative rounded-2xl border border-sky-100 bg-[var(--ithemba-cream)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--ithemba-blue)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ithemba-blue)] font-display text-xs font-bold text-white">
                  {i + 1}
                </span>
                Step {i + 1}
              </div>
              <div className="mt-3 font-display text-base font-bold text-[var(--ithemba-blue-dark)]">
                {s.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{s.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-3xl text-base leading-relaxed text-foreground/85">{c.model.outro}</p>
      </div>
    </section>
  );
}

/* ============================== WASH ============================== */
function Wash({ c }: { c: Copy }) {
  return (
    <section
      id="wash"
      className="scroll-mt-32 relative overflow-hidden bg-[var(--ithemba-cream)] py-20"
    >
      <div className="pointer-events-none absolute -left-10 top-10 h-44 w-44 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <SectionHeading eyebrow={c.wash.eyebrow} title={c.wash.title} />
            <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/85">
              {c.wash.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-6 font-display text-lg italic text-[var(--ithemba-blue-dark)]">
              {c.wash.closing}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {c.wash.supports.map((s) => (
              <div
                key={s}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sky-100"
              >
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ithemba-blue)]" />
                <span className="text-sm font-medium leading-snug text-[var(--ithemba-blue-dark)]">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== CHILDREN ============================== */
function Children({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div className="relative">
            <SmartImage
              src={PHOTO_SCHOOL}
              label="Children at the ECD centre learning about safe water"
              className="aspect-[4/5] w-full"
              tone="sun"
              rounded="rounded-3xl"
              showMissingBadge={false}
            />
            <div className="absolute -bottom-5 -left-5 hidden h-24 w-24 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] shadow-xl md:flex">
              <Baby className="h-9 w-9" />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow={c.children.eyebrow} title={c.children.title} />
            <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/85">
              {c.children.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== CLIMATE ============================== */
function Climate({ c }: { c: Copy }) {
  return (
    <section
      id="climate"
      className="scroll-mt-32 relative isolate overflow-hidden py-20 text-white md:py-24"
    >
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_BEFORE_AFTER}
          label="Safe water and reduced firewood use"
          className="h-full w-full"
          rounded="rounded-none"
          tone="ocean"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/92 via-[var(--ithemba-blue-dark)]/82 to-emerald-900/55" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>
      <div className="pointer-events-none absolute right-10 top-16 text-emerald-300/50">
        <Leaf className="h-9 w-9" />
      </div>
      <div className="pointer-events-none absolute left-10 bottom-16 text-emerald-300/50">
        <TreePine className="h-10 w-10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] flex items-center gap-2">
            <CloudSun className="h-5 w-5" /> {c.climate.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.climate.title}</h2>
        </div>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-white/90">
          {c.climate.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {c.climate.benefits.map((b) => (
            <div
              key={b}
              className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur"
            >
              <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <span className="text-sm font-medium leading-snug text-white">{b}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-base italic leading-relaxed text-white/85">
          {c.climate.closing}
        </p>
      </div>
    </section>
  );
}

/* ============================== MONITORING ============================== */
function Monitor({ c }: { c: Copy }) {
  const loop = [
    "Household visit",
    "Usage check",
    "Maintenance support",
    "Feedback collection",
    "Data reporting",
    "Learning & improvement",
  ];
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 blob-2 bg-sky-300/25" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.monitor.eyebrow} title={c.monitor.title} />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/85">
            {c.monitor.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <ul className="space-y-2">
            {c.monitor.items.map((it) => (
              <li
                key={it}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sky-100"
              >
                <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ithemba-blue)]" />
                <span className="text-sm font-medium leading-snug text-[var(--ithemba-blue-dark)]">
                  {it}
                </span>
              </li>
            ))}
          </ul>

          <div className="rounded-3xl bg-[var(--ithemba-blue-dark)] p-6 text-white shadow-lg">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ithemba-yellow)]">
              Accountability loop
            </div>
            <ol className="mt-4 space-y-3">
              {loop.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] font-display text-xs font-bold text-[var(--ithemba-brown)]">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 max-w-3xl space-y-3 text-base leading-relaxed text-foreground/85">
          {c.monitor.closing.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== RESULTS ============================== */
function Results({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute -left-10 top-10 h-44 w-44 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.results.eyebrow} title={c.results.title} />
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">{c.results.intro}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.results.groups.map((g) => {
            const Icon = ICONS[g.icon] ?? Heart;
            return (
              <div
                key={g.title}
                className="rounded-3xl border border-sky-100 bg-[var(--ithemba-cream)] p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ithemba-blue-dark)]/10 ring-1 ring-[var(--ithemba-blue-dark)]/15">
                    <Icon className="h-6 w-6 text-[var(--ithemba-blue-dark)]" />
                  </div>
                  <div className="font-display text-lg font-bold text-[var(--ithemba-blue-dark)]">
                    {g.title}
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm leading-snug text-foreground/85">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ithemba-blue)]" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-base italic leading-relaxed text-foreground/70">
          {c.results.closing}
        </p>
      </div>
    </section>
  );
}

/* ============================== VIDEOS ============================== */
function VideoCard({ v, large = false }: { v: Video; large?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-sky-100">
      <div className={`relative ${large ? "aspect-video" : "aspect-video"}`}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1`}
          title={v.title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <figcaption className="p-4">
        <div className="font-display text-base font-bold text-[var(--ithemba-blue-dark)]">
          {v.title}
        </div>
        {v.description && (
          <p className="mt-1 text-sm leading-snug text-foreground/75">{v.description}</p>
        )}
      </figcaption>
    </figure>
  );
}

function Videos({ c }: { c: Copy }) {
  return (
    <section
      id="videos"
      className="scroll-mt-32 relative overflow-hidden bg-[var(--ithemba-cream)] py-20"
    >
      <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 blob-2 bg-sky-300/25" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.videos.eyebrow} title={c.videos.title} />
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">{c.videos.intro}</p>
        </div>

        <div className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ithemba-blue)]">
          {c.videos.mainHeading}
        </div>
        <div className="mt-3 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {c.videos.mainVideos.map((v) => (
            <VideoCard key={v.id} v={v} large />
          ))}
        </div>

        <div className="mt-12">
          <Accordion
            type="single"
            collapsible
            className="rounded-3xl bg-white px-5 shadow-sm ring-1 ring-sky-100"
          >
            <AccordionItem value="guides" className="border-0">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-[var(--ithemba-blue-dark)]">
                  <PlayCircle className="h-4 w-4" /> {c.videos.guidesHeading}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 pt-2 md:grid-cols-3">
                  {c.videos.guides.map((v) => (
                    <VideoCard key={v.id} v={v} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

/* ============================== FOCUS AREAS ============================== */
function Focus({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden py-20 text-white md:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_DEMO}
          label="PureFlow Amanzi connected focus areas"
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
            <Sparkles className="h-5 w-5" /> {c.focus.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold md:text-5xl">{c.focus.title}</h2>
        </div>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-white/90">
          {c.focus.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {c.focus.items.map((it) => {
            const Icon = ICONS[it.icon] ?? Heart;
            return (
              <div key={it.label} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur md:h-20 md:w-20">
                  <Icon className="h-8 w-8 text-[var(--ithemba-yellow)] md:h-10 md:w-10" />
                </div>
                <div className="mt-3 text-xs font-semibold leading-snug text-white md:text-sm">
                  {it.label}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 max-w-3xl text-base italic leading-relaxed text-white/85">
          {c.focus.closing}
        </p>
      </div>
    </section>
  );
}

/* ============================== PARTNERSHIP ============================== */
function Partnership({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute -left-10 top-10 h-44 w-44 blob bg-[var(--ithemba-yellow)]/15" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-start">
          <div>
            <SectionHeading eyebrow={c.partnership.eyebrow} title={c.partnership.title} />
            <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/85">
              {c.partnership.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-6 rounded-2xl border-l-4 border-[var(--ithemba-yellow)] bg-[var(--ithemba-cream)] p-4 text-base italic leading-relaxed text-[var(--ithemba-blue-dark)]">
              {c.partnership.closing}
            </p>
          </div>

          <ul className="grid gap-3">
            {c.partnership.items.map((it) => (
              <li
                key={it}
                className="flex items-start gap-3 rounded-2xl bg-[var(--ithemba-cream)] p-4 ring-1 ring-sky-100"
              >
                <Handshake className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ithemba-blue)]" />
                <span className="text-sm font-medium leading-snug text-[var(--ithemba-blue-dark)]">
                  {it}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============================== DONATION SUPPORT BUCKETS ============================== */
function DonationSupport({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 blob-2 bg-sky-300/25" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading eyebrow={c.donationSupport.eyebrow} title={c.donationSupport.title} />
          <p className="mt-5 text-lg leading-relaxed text-foreground/85">
            {c.donationSupport.intro}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.donationSupport.groups.map((g) => {
            const Icon = ICONS[g.icon] ?? Heart;
            return (
              <div
                key={g.title}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ithemba-blue-dark)]/10 ring-1 ring-[var(--ithemba-blue-dark)]/15">
                  <Icon className="h-6 w-6 text-[var(--ithemba-blue-dark)]" />
                </div>
                <div className="mt-3 font-display text-base font-bold text-[var(--ithemba-blue-dark)]">
                  {g.title}
                </div>
                <ul className="mt-3 space-y-2">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2 text-sm leading-snug text-foreground/85"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ithemba-blue)]" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-foreground/75">
          {c.donationSupport.closing}
        </p>
      </div>
    </section>
  );
}

/* ============================== MONTHLY (with widget) ============================== */
function Monthly({ c }: { c: Copy }) {
  return (
    <section
      id="donate"
      className="scroll-mt-32 relative isolate overflow-hidden py-20"
    >
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={PHOTO_BUCKET}
          label="Support PureFlow Amanzi monthly"
          className="h-full w-full"
          rounded="rounded-none"
          tone="ocean"
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
            <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
              {c.monthly.cardHeading}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <Droplet className="h-6 w-6" />
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

          <div className="mt-6 flex flex-wrap gap-2">
            {c.monthly.trust.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/85 ring-1 ring-white/15 backdrop-blur"
              >
                <ShieldCheck className="h-3 w-3 text-[var(--ithemba-yellow)]" /> {t}
              </span>
            ))}
          </div>
        </div>
        <DonationWidget defaultProject="Safe Water" />
      </div>
    </section>
  );
}

/* ============================== CLOSING ============================== */
function Closing({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ithemba-blue-deepest)] via-[var(--ithemba-blue-dark)] to-[var(--ithemba-blue)] py-20 text-white">
      <div className="pointer-events-none absolute right-[-6rem] top-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      <div className="pointer-events-none absolute left-10 top-10">
        <SunDoodle className="h-12 w-12 text-[var(--ithemba-yellow)]/60" />
      </div>
      <div className="pointer-events-none absolute right-10 bottom-10">
        <Droplet className="h-9 w-9 text-[var(--ithemba-yellow)]/70" />
      </div>
      <div className="pointer-events-none absolute left-16 bottom-16">
        <Heart className="h-7 w-7 text-[var(--ithemba-yellow)]/50" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-8">
        <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)]">{c.closing.eyebrow}</div>
        <h2 className="-mt-1 font-display text-4xl font-extrabold md:text-5xl">
          {c.closing.title}
        </h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-white/90">
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

/* ============================== PAGE ============================== */
function PureFlowPage() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.en;

  return (
    <>
      <Hero c={c} />
      <PageNav c={c} />
      <Impact c={c} />
      <Wave from="var(--ithemba-cream)" to="#ffffff" />
      <Sdg c={c} />
      <Snapshot c={c} />
      <Why c={c} />
      <Boil c={c} />
      <Tech c={c} />
      <Jobs c={c} />
      <Model c={c} />
      <Wash c={c} />
      <Children c={c} />
      <Climate c={c} />
      <Monitor c={c} />
      <Wave from="var(--ithemba-cream)" to="#ffffff" />
      <Results c={c} />
      <Videos c={c} />
      <Focus c={c} />
      <Partnership c={c} />
      <DonationSupport c={c} />
      <Monthly c={c} />
      <Closing c={c} />
    </>
  );
}
