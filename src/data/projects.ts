export type FocusAreaBadge =
  | "education"
  | "safe-water"
  | "food-security"
  | "skills-livelihoods"
  | "community-health"
  | "animal-welfare"
  | "disaster-relief";

export const focusAreaBadgeMeta: Record<FocusAreaBadge, { src: string; label: string }> = {
  education: { src: "/assets/icons/focus-areas/education-badge.png", label: "Education" },
  "safe-water": { src: "/assets/icons/focus-areas/safe-water-badge.png", label: "Safe water" },
  "food-security": { src: "/assets/icons/focus-areas/food-security-badge.png", label: "Food security" },
  "skills-livelihoods": { src: "/assets/icons/focus-areas/skills-livelihoods-badge.png", label: "Skills and livelihoods" },
  "community-health": { src: "/assets/icons/focus-areas/community-health-badge.png", label: "Community health" },
  "animal-welfare": { src: "/assets/icons/focus-areas/animal-welfare-badge.png", label: "Animal welfare" },
  "disaster-relief": { src: "/assets/icons/focus-areas/disaster-relief-badge.png", label: "Disaster relief" },
};

export type Project = {
  slug: string;
  path: string;
  title: { en: string; de: string };
  tagline: { en: string; de: string };
  description: { en: string; de: string };
  accent: string;
  bg: string;
  icon: string;
  focusAreaBadges: FocusAreaBadge[];
};

export const projects: Project[] = [
  {
    slug: "ecd",
    path: "/projects/ecd",
    title: { en: "No.1 ECD Centre", de: "No.1 ECD-Zentrum" },
    tagline: {
      en: "Early learning, joyfully delivered.",
      de: "Frühkindliche Bildung — mit Freude vermittelt.",
    },
    description: {
      en: "A safe, joyful place where young children learn, play, eat and prepare for Grade R.",
      de: "Ein sicherer, fröhlicher Ort, an dem kleine Kinder lernen, spielen, essen und sich auf die Grade R vorbereiten.",
    },
    accent: "#F59E0B",
    bg: "#FEF3C7",
    icon: "GraduationCap",
    focusAreaBadges: ["education", "food-security", "safe-water", "skills-livelihoods", "community-health"],
  },
  {
    slug: "pureflow",
    path: "/projects/pureflow",
    title: { en: "PureFlow Amanzi", de: "PureFlow Amanzi" },
    tagline: { en: "Safe water. Stronger communities.", de: "Sauberes Wasser. Stärkere Gemeinschaften." },
    description: {
      en: "Practical safe water access for households, schools and ECD centres.",
      de: "Praktischer Zugang zu sauberem Wasser für Haushalte, Schulen und ECD-Zentren.",
    },
    accent: "#0EA5E9",
    bg: "#E0F2FE",
    icon: "Droplet",
    focusAreaBadges: ["safe-water", "education", "skills-livelihoods", "community-health", "disaster-relief"],
  },
  {
    slug: "greenhouse",
    path: "/projects/greenhouse",
    title: { en: "Greenhouse with SA Harvest", de: "Gewächshaus mit SA Harvest" },
    tagline: { en: "Food, skills and nutrition close to home.", de: "Nahrung, Fähigkeiten und Ernährung vor Ort." },
    description: {
      en: "Growing food, training local women and linking nutrition to early learning.",
      de: "Nahrungsmittel anbauen, lokale Frauen ausbilden und Ernährung mit frühkindlicher Bildung verbinden.",
    },
    accent: "#16A34A",
    bg: "#DCFCE7",
    icon: "Sprout",
    focusAreaBadges: ["food-security", "skills-livelihoods", "community-health"],
  },
  {
    slug: "food-security",
    path: "/projects/food-security",
    title: { en: "Food Security", de: "Ernährungssicherheit" },
    tagline: { en: "Meals that protect families from hunger.", de: "Mahlzeiten, die Familien vor Hunger schützen." },
    description: {
      en: "Meals, food parcels, community kitchens and rescued food partnerships.",
      de: "Mahlzeiten, Lebensmittelpakete, Gemeinschaftsküchen und Partnerschaften zur Lebensmittelrettung.",
    },
    accent: "#EA580C",
    bg: "#FFEDD5",
    icon: "UtensilsCrossed",
    focusAreaBadges: ["food-security", "community-health"],
  },
  {
    slug: "pondo-dogs",
    path: "/projects/pondo-dogs",
    title: { en: "Pondo Dogs", de: "Pondo Dogs" },
    tagline: { en: "Animal welfare for community wellbeing.", de: "Tierwohl für das Wohl der Gemeinschaft." },
    description: {
      en: "Care for animals as part of community wellbeing — safer, healthier lives for dogs and families.",
      de: "Tiere als Teil des Gemeinschaftswohls — sichereres, gesünderes Leben für Hunde und Familien.",
    },
    accent: "#D97706",
    bg: "#FEF3C7",
    icon: "PawPrint",
    focusAreaBadges: ["animal-welfare", "education", "skills-livelihoods", "community-health"],
  },
  {
    slug: "disaster-relief",
    path: "/projects/disaster-relief",
    title: { en: "Disaster Relief", de: "Katastrophenhilfe" },
    tagline: { en: "Practical help when crisis hits.", de: "Praktische Hilfe in der Krise." },
    description: {
      en: "Practical support when families face floods, fires, medical crises or sudden hardship.",
      de: "Praktische Unterstützung bei Überschwemmungen, Bränden, medizinischen Notfällen oder plötzlicher Not.",
    },
    accent: "#1E40AF",
    bg: "#DBEAFE",
    icon: "ShieldAlert",
    focusAreaBadges: ["disaster-relief", "safe-water", "education", "skills-livelihoods", "community-health"],
  },
];

export const impactCounters = [
  { value: 3000, suffix: "+", icon: "Droplets", label: { en: "Safe water systems distributed", de: "Sauberes-Wasser-Systeme verteilt" } },
  { value: 14000, suffix: "+", icon: "Users", label: { en: "People reached through PureFlow Amanzi", de: "Menschen erreicht durch PureFlow Amanzi" } },
  { value: 300000, suffix: "+", icon: "Utensils", label: { en: "Meals served", de: "Mahlzeiten serviert" } },
  { value: 2800, suffix: "+", icon: "Package", label: { en: "Food hampers distributed", de: "Lebensmittelpakete verteilt" } },
  { value: 500, suffix: "", icon: "Baby", label: { en: "Children fed daily", de: "Kinder täglich versorgt" } },
  { value: 600, suffix: "+", icon: "Home", label: { en: "Families supported", de: "Familien unterstützt" } },
  { value: 13, suffix: "", icon: "MapPin", label: { en: "Villages reached", de: "Dörfer erreicht" } },
];

export const fullImpactCounters = [
  ...impactCounters,
  { value: 250000, suffix: "+ kg", icon: "Truck", label: { en: "Food supplies delivered", de: "Lebensmittellieferungen" } },
  { value: 2119, suffix: "", icon: "Bed", label: { en: "Blankets provided", de: "Decken bereitgestellt" } },
  { value: 571, suffix: "", icon: "Bed", label: { en: "Mattresses provided", de: "Matratzen bereitgestellt" } },
  { value: 114, suffix: "", icon: "Accessibility", label: { en: "Wheelchairs distributed", de: "Rollstühle verteilt" } },
  { value: 1337, suffix: "", icon: "Footprints", label: { en: "Pairs of school shoes", de: "Paar Schulschuhe" } },
  { value: 1, suffix: "", icon: "Droplet", label: { en: "Borehole installed", de: "Brunnen installiert" } },
];

export const focusAreas = [
  { icon: "BookOpen", label: { en: "Education", de: "Bildung" } },
  { icon: "Droplet", label: { en: "Safe water", de: "Sauberes Wasser" } },
  { icon: "UtensilsCrossed", label: { en: "Food security", de: "Ernährungssicherheit" } },
  { icon: "Wrench", label: { en: "Skills & livelihoods", de: "Fähigkeiten & Lebensgrundlagen" } },
  { icon: "HeartPulse", label: { en: "Community health", de: "Gesundheit" } },
  { icon: "PawPrint", label: { en: "Animal welfare", de: "Tierwohl" } },
  { icon: "ShieldAlert", label: { en: "Disaster relief", de: "Katastrophenhilfe" } },
];

export type Partner = {
  name: string;
  logo: string;
  url: string;
  note?: string;
  /** Tailwind classes controlling per-logo max-height/max-width for visual balance. */
  sizeClass?: string;
};

export const partners: Partner[] = [
  { name: "FNB", logo: "/assets/logos/partners/fnb-logo.png", url: "https://www.fnb.co.za/", sizeClass: "max-h-[110px] max-w-[240px]" },
  { name: "Fresh Life Produce", logo: "/assets/logos/partners/fresh-life-produce-transparent-logo.png", url: "https://freshlifeproduce.com/", sizeClass: "max-h-[130px] max-w-[260px]" },
  { name: "Gift of the Givers", logo: "/assets/logos/partners/gift-of-the-givers-logo.png", url: "https://giftofthegivers.org/", sizeClass: "max-h-[140px] max-w-[260px]" },
  { name: "Nando’s", logo: "/assets/logos/partners/nandos-logo.png", url: "https://www.nandos.co.za/", sizeClass: "max-h-[110px] max-w-[220px]" },
  { name: "Rise Against Hunger Africa", logo: "/assets/logos/partners/rise-against-hunger-logo.png", url: "https://www.riseagainsthunger.org/", sizeClass: "max-h-[110px] max-w-[300px]", note: "[[VERIFY BEFORE LAUNCH: confirm if a South Africa / Africa-specific Rise Against Hunger URL should be used instead]]" },
  { name: "Star Foundation", logo: "/assets/logos/partners/star-foundation-logo.png", url: "https://thestarfoundation.co.za/", sizeClass: "max-h-[120px] max-w-[240px]" },
  { name: "Tzu Chi Foundation", logo: "/assets/logos/partners/tzu-chi-transparent-logo.png", url: "https://global.tzuchi.org/", sizeClass: "max-h-[130px] max-w-[260px]", note: "[[VERIFY BEFORE LAUNCH: confirm if a South Africa-specific Tzu Chi URL should be used instead]]" },
  { name: "SA Harvest", logo: "/assets/logos/partners/sa-harvest-logo.png", url: "https://saharvest.org/", sizeClass: "max-h-[110px] max-w-[300px]" },
];

export const mediaItems = [
  { name: "SABC News", kind: "Article" },
  { name: "Sky News", kind: "Article" },
  { name: "UNICEF South Africa", kind: "Feature" },
  { name: "News24", kind: "Article" },
  { name: "eNCA", kind: "Broadcast" },
  { name: "Algoa FM", kind: "Radio" },
  { name: "The Star Foundation", kind: "Recognition" },
  { name: "Defender Awards 2025", kind: "Award" },
  { name: "Eco-Logic Awards 2025", kind: "Award" },
];

export const social = {
  instagram: { url: "https://www.instagram.com/ithemba.kuluntu/", verify: true },
  tiktok: { url: null },
  facebook: { url: null },
  youtube: { url: null },
};
