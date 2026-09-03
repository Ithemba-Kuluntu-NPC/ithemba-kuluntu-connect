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

/* ---------- media (final Food Security library) ---------- */
const FS = "/assets/photos/projects/foodsecurity";

/** Build a path + human alt text from the descriptive filename. */
function fsPhoto(file: string, alt: string) {
  return { src: `${FS}/${file}`, alt };
}

const HERO_VIDEO = `${FS}/food-security-hero-video.mp4`;
const HERO_POSTER = `${FS}/food-security-community-meals-team-serving-meals-to-children-27.jpg`;
const FALLBACK_POSTER = assets.photos.projects.foodSecurityHero;

/* A. Community meals */
const MEALS = {
  serving: fsPhoto("food-security-community-meals-outdoor-meal-serving-from-large-pots-01.jpg", "Outdoor meal serving from large pots"),
  childrenEating: fsPhoto("food-security-community-meals-children-eating-together-02.jpg", "Children eating together at a community meal"),
  womenCooking: fsPhoto("food-security-community-meals-women-cooking-large-pot-03.jpg", "Women cooking in a large pot for the community"),
  openFire: fsPhoto("food-security-community-meals-large-pot-cooking-over-open-fire-04.jpg", "Large pot cooking over an open fire"),
  outdoorCooking: fsPhoto("food-security-community-meals-outdoor-community-cooking-with-large-pot-05.jpg", "Outdoor community cooking with a large pot"),
  workerServing: fsPhoto("food-security-community-meals-worker-serving-meal-to-community-member-06.jpg", "Worker serving a meal to a community member"),
  gathered: fsPhoto("food-security-community-meals-children-gathered-for-meal-07.jpg", "Children gathered for a meal"),
  seatedAfter: fsPhoto("food-security-community-meals-children-seated-after-meal-support-08.jpg", "Children seated after receiving meal support"),
  plates: fsPhoto("food-security-community-meals-plates-prepared-for-serving-09.jpg", "Plates prepared for serving"),
  linedUp: fsPhoto("food-security-community-meals-children-lined-up-for-meal-10.jpg", "Children lined up for a meal"),
  atService: fsPhoto("food-security-community-meals-children-gathered-at-meal-service-11.jpg", "Children gathered at a meal service"),
  rowsPlated: fsPhoto("food-security-community-meals-rows-of-plated-meals-12.jpg", "Rows of plated meals ready to serve"),
  servedOutdoors: fsPhoto("food-security-community-meals-children-being-served-outdoors-13.jpg", "Children being served outdoors"),
  childAndWorker: fsPhoto("food-security-community-meals-children-and-worker-at-meal-service-14.jpg", "Children and a worker at a meal service"),
  waterTank: fsPhoto("food-security-community-meals-children-gathered-around-water-tank-15.jpg", "Children gathered around a water tank"),
  seatedTogether: fsPhoto("food-security-community-meals-children-seated-together-16.jpg", "Children seated together"),
  handingMeal: fsPhoto("food-security-community-meals-worker-handing-meal-to-child-17.jpg", "Worker handing a meal to a child"),
  childEating: fsPhoto("food-security-community-meals-child-eating-from-plate-18.jpg", "Child eating from a plate"),
  eatingOutdoors: fsPhoto("food-security-community-meals-children-eating-outdoors-19.jpg", "Children eating outdoors"),
  youngChild: fsPhoto("food-security-community-meals-young-child-eating-meal-20.jpg", "Young child eating a meal"),
  rowsPrepared: fsPhoto("food-security-community-meals-rows-of-prepared-meals-21.jpg", "Rows of prepared meals"),
  indoorPrep: fsPhoto("food-security-community-meals-indoor-meal-preparation-team-22.jpg", "Indoor meal preparation team"),
  riceAndStew: fsPhoto("food-security-community-meals-many-plated-rice-and-stew-meals-23.jpg", "Many plated rice and stew meals"),
  servingRice: fsPhoto("food-security-community-meals-serving-rice-from-large-pot-24.jpg", "Serving rice from a large pot"),
  servingFromPots: fsPhoto("food-security-community-meals-worker-serving-meals-from-pots-25.jpg", "Worker serving meals from pots"),
  freshlyServed: fsPhoto("food-security-community-meals-worker-holding-freshly-served-meal-26.jpg", "Worker holding a freshly served meal"),
  teamServing: fsPhoto("food-security-community-meals-team-serving-meals-to-children-27.jpg", "Team serving meals to children"),
  cookingFire: fsPhoto("food-security-community-meals-outdoor-cooking-over-fire-28.jpg", "Outdoor cooking over a fire"),
  besideVehicle: fsPhoto("food-security-community-meals-children-eating-beside-project-vehicle-29.jpg", "Children eating beside the project vehicle"),
  motherAndChild: fsPhoto("food-security-community-meals-mother-and-child-eating-community-meal-30.jpg", "Mother and child eating a community meal"),
  teamCooking: fsPhoto("food-security-community-meals-team-cooking-large-pots-outdoors-31.jpg", "Team cooking large pots outdoors"),
  eatingOnGround: fsPhoto("food-security-community-meals-children-eating-together-on-ground-32.jpg", "Children eating together on the ground"),
};

/* B. ECD nutrition */
const ECD = {
  eatingOutdoors: fsPhoto("food-security-ecd-nutrition-ecd-children-eating-outdoors-01.jpg", "ECD children eating outdoors"),
  seated: fsPhoto("food-security-ecd-nutrition-ecd-children-seated-for-meal-02.jpg", "ECD children seated for a meal"),
  inRow: fsPhoto("food-security-ecd-nutrition-ecd-children-eating-in-row-03.jpg", "ECD children eating in a row"),
  outsideCentre: fsPhoto("food-security-ecd-nutrition-ecd-mealtime-outside-centre-04.jpg", "Mealtime outside the ECD centre"),
  bowls: fsPhoto("food-security-ecd-nutrition-bowls-of-rice-stew-and-vegetables-05.jpg", "Bowls of rice, stew and vegetables"),
  blueTables: fsPhoto("food-security-ecd-nutrition-ecd-children-eating-at-blue-tables-06.jpg", "ECD children eating at blue tables"),
  groupMeal: fsPhoto("food-security-ecd-nutrition-ecd-group-mealtime-07.jpg", "ECD group mealtime"),
};

/* C. Food distribution */
const DIST = {
  groupWithParcels: fsPhoto("food-security-food-distribution-community-group-with-food-parcels-01.jpg", "Community group with food parcels"),
  womenReceiving: fsPhoto("food-security-food-distribution-women-receiving-food-parcels-02.jpg", "Women receiving food parcels"),
  groupAtEvent: fsPhoto("food-security-food-distribution-community-group-at-distribution-event-03.jpg", "Community group at a distribution event"),
  stationTent: fsPhoto("food-security-food-distribution-distribution-station-under-tent-04.jpg", "Distribution station under a tent"),
  largeEvent: fsPhoto("food-security-food-distribution-large-community-distribution-event-05.jpg", "Large community distribution event"),
  packing: fsPhoto("food-security-food-distribution-team-packing-food-parcels-06.jpg", "Team packing food parcels"),
  hillside: fsPhoto("food-security-food-distribution-community-with-food-parcels-on-hillside-07.jpg", "Community with food parcels on a hillside"),
  banner: fsPhoto("food-security-food-distribution-distribution-event-with-ithembakuluntu-banner-08.jpg", "Distribution event with the iThemba Kuluntu banner"),
  outdoorParcels: fsPhoto("food-security-food-distribution-large-outdoor-food-parcel-distribution-09.jpg", "Large outdoor food parcel distribution"),
  teamSupplies: fsPhoto("food-security-food-distribution-ithembakuluntu-team-with-food-supplies-10.jpg", "iThemba Kuluntu team with food supplies"),
  tentSupplies: fsPhoto("food-security-food-distribution-distribution-event-with-tent-and-supplies-11.jpg", "Distribution event with tent and supplies"),
  cabbages: fsPhoto("food-security-food-distribution-fresh-cabbages-at-distribution-event-12.jpg", "Fresh cabbages at a distribution event"),
  carryingHome: fsPhoto("food-security-food-distribution-community-members-carrying-food-parcels-home-13.jpg", "Community members carrying food parcels home"),
  womanReceiving: fsPhoto("food-security-food-distribution-woman-receiving-food-parcel-14.jpg", "Woman receiving a food parcel"),
  chakalaka: fsPhoto("food-security-food-distribution-woman-holding-chakalaka-soup-packets-15.jpg", "Woman holding chakalaka soup packets"),
  balancing: fsPhoto("food-security-food-distribution-woman-balancing-food-parcel-on-head-16.jpg", "Woman balancing a food parcel on her head"),
  arranged: fsPhoto("food-security-food-distribution-food-parcels-arranged-for-distribution-17.jpg", "Food parcels arranged for distribution"),
  withSupplies: fsPhoto("food-security-food-distribution-community-distribution-with-food-supplies-18.jpg", "Community distribution with food supplies"),
  parcelDisplay: fsPhoto("food-security-food-distribution-ithembakuluntu-team-with-large-food-parcel-display-19.jpg", "iThemba Kuluntu team with a large food parcel display"),
  rowsHousehold: fsPhoto("food-security-food-distribution-large-rows-of-household-food-parcels-20.jpg", "Large rows of household food parcels"),
  movingRows: fsPhoto("food-security-food-distribution-team-moving-through-food-parcel-rows-21.jpg", "Team moving through food parcel rows"),
  closeRows: fsPhoto("food-security-food-distribution-close-view-of-food-parcel-rows-22.jpg", "Close view of food parcel rows"),
  membersReceiving: fsPhoto("food-security-food-distribution-community-members-receiving-food-parcels-23.jpg", "Community members receiving food parcels"),
  familyParcels: fsPhoto("food-security-food-distribution-family-with-food-parcels-24.jpg", "Family with food parcels"),
  householdParcels: fsPhoto("food-security-food-distribution-community-group-with-household-food-parcels-25.jpg", "Community group with household food parcels"),
  familySupport: fsPhoto("food-security-food-distribution-family-receiving-food-support-26.jpg", "Family receiving food support"),
  fromVehicle: fsPhoto("food-security-food-distribution-children-collecting-food-support-from-vehicle-27.jpg", "Children collecting food support from a vehicle"),
  preparingParcel: fsPhoto("food-security-food-distribution-woman-preparing-food-parcel-for-recipient-28.jpg", "Woman preparing a food parcel for a recipient"),
  supportEvent: fsPhoto("food-security-food-distribution-community-food-support-event-29.jpg", "Community food support event"),
  motherChildren: fsPhoto("food-security-food-distribution-mother-and-children-at-food-support-event-30.jpg", "Mother and children at a food support event"),
  workerPacking: fsPhoto("food-security-food-distribution-worker-packing-household-food-parcel-31.jpg", "Worker packing a household food parcel"),
  withProduce: fsPhoto("food-security-food-distribution-large-community-food-distribution-with-produce-32.jpg", "Large community food distribution with fresh produce"),
  produceStock: fsPhoto("food-security-food-distribution-large-stock-of-fresh-produce-for-distribution-33.jpg", "Large stock of fresh produce for distribution"),
};

/* D. Greenhouse growing */
const GROW = {
  verticalGarden: fsPhoto("food-security-greenhouse-growing-vertical-garden-with-leafy-vegetables-01.jpg", "Vertical garden with leafy vegetables"),
  workerTending: fsPhoto("food-security-greenhouse-growing-worker-tending-vertical-garden-02.jpg", "Worker tending the vertical garden"),
  childrenSmiling: fsPhoto("food-security-greenhouse-growing-children-smiling-in-greenhouse-03.jpg", "Children smiling in the greenhouse"),
  childrenVeg: fsPhoto("food-security-greenhouse-growing-children-in-greenhouse-with-vegetables-04.jpg", "Children in the greenhouse with vegetables"),
  childWorker: fsPhoto("food-security-greenhouse-growing-child-and-worker-tending-plants-05.jpg", "Child and worker tending plants"),
  guidingChild: fsPhoto("food-security-greenhouse-growing-worker-guiding-child-with-plants-06.jpg", "Worker guiding a child with plants"),
  beetrootContainer: fsPhoto("food-security-greenhouse-growing-beetroot-growing-in-container-07.jpg", "Beetroot growing in a container"),
  teamPlants: fsPhoto("food-security-greenhouse-growing-team-working-among-vertical-garden-plants-08.jpg", "Team working among vertical garden plants"),
  teamInside: fsPhoto("food-security-greenhouse-growing-team-inside-greenhouse-09.jpg", "Team inside the greenhouse"),
  hangingVeg: fsPhoto("food-security-greenhouse-growing-hanging-leafy-vegetables-10.jpg", "Hanging leafy vegetables"),
  wideView: fsPhoto("food-security-greenhouse-growing-wide-view-of-hanging-vegetable-garden-11.jpg", "Wide view of the hanging vegetable garden"),
};

/* E. Greenhouse harvest */
const HARVEST = [
  fsPhoto("food-security-greenhouse-harvest-close-up-of-spinach-leaves-01.jpg", "Close-up of spinach leaves"),
  fsPhoto("food-security-greenhouse-harvest-freshly-harvested-beetroot-02.jpg", "Freshly harvested beetroot"),
  fsPhoto("food-security-greenhouse-harvest-healthy-spinach-close-up-03.jpg", "Healthy spinach close-up"),
];

/* F. Household support */
const HOUSE = {
  childrenStaple: fsPhoto("food-security-household-support-children-with-staple-food-parcel-01.jpg", "Children with a staple food parcel"),
  wheelbarrow: fsPhoto("food-security-household-support-family-carrying-food-home-by-wheelbarrow-and-head-02.jpg", "Family carrying food home by wheelbarrow and on head"),
  walkingHome: fsPhoto("food-security-household-support-family-walking-home-with-food-parcels-03.jpg", "Family walking home with food parcels"),
  atHome: fsPhoto("food-security-household-support-family-with-staple-food-parcel-at-home-04.jpg", "Family with a staple food parcel at home"),
  receivingOutdoors: fsPhoto("food-security-household-support-family-receiving-food-parcel-outdoors-05.jpg", "Family receiving a food parcel outdoors"),
  ruralHome: fsPhoto("food-security-household-support-family-with-food-parcel-at-rural-home-06.jpg", "Family with a food parcel at their rural home"),
  womanAndChild: fsPhoto("food-security-household-support-woman-and-child-with-food-support-at-home-07.jpg", "Woman and child with food support at home"),
};

/* G. Partner support */
const PARTNER = {
  womanBox: fsPhoto("food-security-partner-support-woman-holding-rise-against-hunger-box-01.jpg", "Woman holding a Rise Against Hunger box"),
  table: fsPhoto("food-security-partner-support-distribution-table-with-rise-against-hunger-boxes-02.jpg", "Distribution table with Rise Against Hunger boxes"),
  olderWoman: fsPhoto("food-security-partner-support-older-woman-receiving-rise-against-hunger-box-03.jpg", "Older woman receiving a Rise Against Hunger box"),
  youngRecipient: fsPhoto("food-security-partner-support-young-recipient-holding-rise-against-hunger-box-04.jpg", "Young recipient holding a Rise Against Hunger box"),
  seated: fsPhoto("food-security-partner-support-woman-seated-with-rise-against-hunger-box-05.jpg", "Woman seated with a Rise Against Hunger box"),
  carrying: fsPhoto("food-security-partner-support-team-carrying-stacked-food-relief-boxes-06.jpg", "Team carrying stacked food relief boxes"),
  childrenBoxes: fsPhoto("food-security-partner-support-children-in-front-of-rise-against-hunger-boxes-07.jpg", "Children in front of Rise Against Hunger boxes"),
  workerFamily: fsPhoto("food-security-partner-support-ithembakuluntu-worker-with-family-and-rise-box-08.jpg", "iThemba Kuluntu worker with a family and a relief box"),
};

/* H. School feeding */
const SCHOOL = {
  gathered: fsPhoto("food-security-school-feeding-school-children-gathered-for-meal-01.jpg", "School children gathered for a meal"),
  serving: fsPhoto("food-security-school-feeding-worker-serving-school-child-02.jpg", "Worker serving a school child"),
  cooking: fsPhoto("food-security-school-feeding-worker-cooking-for-school-children-03.jpg", "Worker cooking for school children"),
  linedOutside: fsPhoto("food-security-school-feeding-school-children-lined-up-outside-04.jpg", "School children lined up outside"),
  withTeam: fsPhoto("food-security-school-feeding-school-children-with-ithembakuluntu-team-05.jpg", "School children with the iThemba Kuluntu team"),
  linedForMeals: fsPhoto("food-security-school-feeding-school-children-lined-up-for-meals-06.jpg", "School children lined up for meals"),
  waiting: fsPhoto("food-security-school-feeding-school-children-waiting-outside-07.jpg", "School children waiting outside"),
  handingPlate: fsPhoto("food-security-school-feeding-worker-handing-plate-to-child-08.jpg", "Worker handing a plate to a child"),
  servingYoung: fsPhoto("food-security-school-feeding-worker-serving-young-child-09.jpg", "Worker serving a young child"),
};

/* ---------- per-section media assignment (every filename used ONCE) ---------- */
const BG_WHY = DIST.rowsHousehold.src;                       // distribution-20
const BG_FOCUS = DIST.groupAtEvent.src;                      // distribution-03
const BG_IMPACT = DIST.withProduce.src;                      // distribution-32
const BG_MONTHLY = DIST.hillside.src;                        // distribution-07
const BG_CLOSING = MEALS.motherAndChild.src;                 // community-meals-30

const HAMPERS_COLLAGE = {
  main: { ...HOUSE.wheelbarrow, pos: "center 45%" },
  side: [
    { ...DIST.womanReceiving, pos: "center 35%" },
    { ...PARTNER.womanBox, pos: "center 30%" },
  ] as [Shot, Shot],
};

const KITCHEN_COLLAGE = {
  main: { ...MEALS.womenCooking, pos: "center 40%" },
  side: [
    { ...MEALS.servingFromPots, pos: "center 35%" },
    { ...MEALS.eatingOutdoors, pos: "center 45%" },
  ] as [Shot, Shot],
};

const ECD_COLLAGE = {
  main: { ...ECD.blueTables, pos: "center 40%" },
  side: [
    { ...ECD.groupMeal, pos: "center 35%" },
    { ...SCHOOL.handingPlate, pos: "center 35%" },
  ] as [Shot, Shot],
};

const GROW_COLLAGE = {
  main: { ...GROW.wideView, pos: "center 50%" },
  side: [
    { ...GROW.childrenVeg, pos: "center 35%" },
    { ...HARVEST[1], pos: "center 50%" },
  ] as [Shot, Shot],
};


/* I. Team / logistics */
const LOGISTICS = [
  fsPhoto("food-security-team-logistics-ithembakuluntu-vehicle-at-food-distribution-01.jpg", "iThemba Kuluntu vehicle at a food distribution"),
  fsPhoto("food-security-team-logistics-team-and-partners-beside-distribution-vehicle-02.jpg", "Team and partners beside the distribution vehicle"),
];


/* ---------- photo collage primitives (shared visual language with other project pages) ---------- */
type Shot = { src: string; alt: string; pos?: string };

function Frame({ children, frame, className = "" }: { children: React.ReactNode; frame: "light" | "dark"; className?: string }) {
  return (
    <div
      className={`rounded-[2rem] p-2 shadow-xl ring-1 ${
        frame === "dark" ? "bg-white/10 ring-white/15 backdrop-blur" : "bg-white ring-black/5"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function ShotImg({ shot, className = "" }: { shot: Shot; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <img
        src={shot.src}
        alt={shot.alt}
        loading="lazy"
        className="h-full w-full object-cover"
        style={shot.pos ? { objectPosition: shot.pos } : undefined}
      />
    </div>
  );
}

/** One dominant image with two supporting images beside it. Stacks cleanly on mobile. */
function CollageSide({ main, side, frame = "light", className = "" }: { main: Shot; side: [Shot, Shot]; frame?: "light" | "dark"; className?: string }) {
  return (
    <Frame frame={frame} className={className}>
      <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-[16/12] sm:aspect-[16/11]">
        <ShotImg shot={main} className="col-span-3 row-span-1 sm:col-span-2 sm:row-span-2" />
        <ShotImg shot={side[0]} className="col-span-1" />
        <ShotImg shot={side[1]} className="col-span-2 sm:col-span-1" />
      </div>
    </Frame>
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

/* ---------- custom icon paths ---------- */
const FS_ICON_BASE = "/assets/icons/projects/food-security";

/* snapshot fact icons (index-aligned with snapshot.facts) */
const SNAPSHOT_ICON_PATHS = [
  `${FS_ICON_BASE}/food-security-project.png`,
  `${FS_ICON_BASE}/food-security-focus.png`,
  `${FS_ICON_BASE}/food-security-location.png`,
  `${FS_ICON_BASE}/food-security-core-support.png`,
  `${FS_ICON_BASE}/food-security-community-role.png`,
  `${FS_ICON_BASE}/food-security-connected-projects.png`,
  `${FS_ICON_BASE}/food-security-donation-focus.png`,
];

/* donation icons (keyed by the icon label used in copy) */
const DONATION_ICON_PATHS: Record<string, string> = {
  PackageOpen: `${FS_ICON_BASE}/food-security-core-support.png`,
  Soup: `${FS_ICON_BASE}/food-security-donation-focus.png`,
  Utensils: `${FS_ICON_BASE}/food-security-project.png`,
  Sprout: `${FS_ICON_BASE}/food-security-greenhouse-growing.png`,
  Flame: `${FS_ICON_BASE}/food-security-cooking-supplies.png`,
  Truck: `${FS_ICON_BASE}/food-security-transport-distribution.png`,
  Users: `${FS_ICON_BASE}/food-security-community-role.png`,
  ShieldAlert: `${FS_ICON_BASE}/food-security-emergency-food-support.png`,
};

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
          <img
            src={HERO_POSTER}
            alt="Food Security — community food support in Cwebeni"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_POSTER;
            }}
          />
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

      <svg className="block w-full -mb-px" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
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
            const iconSrc = SNAPSHOT_ICON_PATHS[i];
            return (
              <div key={f.label} className="flex flex-col items-center text-center">
                <img src={iconSrc} alt="" aria-hidden className="h-16 w-16 object-contain md:h-20 md:w-20" />
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
          src={BG_WHY}
          objectPosition="center 45%"
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
      <div className="relative order-1 md:order-2 flex items-center">
        <div className="absolute -right-8 -top-8 h-28 w-28 blob bg-[var(--ithemba-yellow)]/40 -z-10" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 blob-2 bg-orange-300/30 -z-10" />
        <CollageSide main={HAMPERS_COLLAGE.main} side={HAMPERS_COLLAGE.side} frame="light" className="w-full" />
      </div>
    </section>
  );
}

/* ---------- KITCHEN — cream, text + photo collage ---------- */
function Kitchen({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-[var(--ithemba-cream)] py-20">
      <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 blob bg-[var(--ithemba-yellow)]/25" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-48 w-48 blob-2 bg-orange-300/25" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="hand-eyebrow-lg flex items-center gap-2 text-orange-600">
            <Soup className="h-5 w-5" /> {c.kitchen.eyebrow}
          </div>
          <h2 className="-mt-1 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">{c.kitchen.title}</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
            {c.kitchen.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--ithemba-brown)] shadow-sm ring-1 ring-black/5">
            <HandHeart className="h-4 w-4 text-orange-600" /> {c.kitchen.eyebrow}
          </div>
        </div>
        <CollageSide main={KITCHEN_COLLAGE.main} side={KITCHEN_COLLAGE.side} frame="light" className="w-full" />
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
          src={BG_FOCUS}
          objectPosition="center 40%"
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
            const iconSrc = DONATION_ICON_PATHS[it.icon] ?? `${FS_ICON_BASE}/food-security-project.png`;
            return (
              <div key={it.label} className="flex flex-col items-center text-center">
                <img src={iconSrc} alt="" aria-hidden className="h-16 w-16 object-contain md:h-20 md:w-20" />
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
          src={BG_MONTHLY}
          objectPosition="center 45%"
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ithemba-blue-deepest)] via-[var(--ithemba-blue-dark)] to-[var(--ithemba-blue)] pt-28 pb-20 text-white md:pt-32">
      {/* soft wave transition from the donation section above */}
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
