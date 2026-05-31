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
  title: { en: string; de: string; nl?: string };
  tagline: { en: string; de: string; nl?: string };
  description: { en: string; de: string; nl?: string };
  accent: string;
  bg: string;
  icon: string;
  focusAreaBadges: FocusAreaBadge[];
};

export const projects: Project[] = [
  {
    slug: "ecd",
    path: "/projects/ecd",
    title: { en: "No.1 ECD Centre", de: "No.1 ECD Centre", nl: "No.1 ECD Centre" },
    tagline: {
      en: "One child. One month. A stronger start.",
      de: "Ein Kind. Ein Monat. Ein stärkerer Start.",
      nl: "Eén kind. Eén maand. Een sterkere start.",
    },
    description: {
      en: "A safe, joyful and free-to-attend early learning centre where young children eat, play, learn and prepare for school — while creating paid roles for local women as teachers, cooks and carers.",
      de: "Ein sicherer, fröhlicher und kostenfrei zugänglicher Ort für frühkindliche Bildung in Südafrika, an dem kleine Kinder essen, spielen, lernen und sich auf die Schule vorbereiten — während zugleich bezahlte Arbeitsplätze für Frauen vor Ort als Lehrerinnen, Köchinnen und Betreuungspersonen entstehen.",
      nl: "Een veilige, vrolijke en kosteloos toegankelijke plek voor vroegschoolse educatie in Zuid-Afrika, waar jonge kinderen eten, spelen, leren en zich voorbereiden op school — terwijl er tegelijk betaalde banen ontstaan voor vrouwen ter plaatse als leerkrachten, koks en verzorgers.",
    },
    accent: "#F59E0B",
    bg: "#FEF3C7",
    icon: "GraduationCap",
    focusAreaBadges: ["education", "food-security", "safe-water", "skills-livelihoods", "community-health"],
  },
  {
    slug: "pureflow",
    path: "/projects/pureflow",
    title: { en: "PureFlow Amanzi", de: "PureFlow Amanzi", nl: "PureFlow Amanzi" },
    tagline: {
      en: "One family. Safer water. Stronger daily life.",
      de: "Eine Familie. Sichereres Wasser. Ein stärkerer Alltag.",
      nl: "Eén gezin. Veiliger water. Een sterker dagelijks leven.",
    },
    description: {
      en: "A community-based safe water programme bringing household filtration, WASH education, local delivery and follow-up support to rural families, schools and ECD centres.",
      de: "Ein gemeindebasiertes Programm für sicheres Wasser in Südafrika, das Haushaltsfiltration, WASH-Bildung, lokale Verteilung und Nachbetreuung zu Familien, Schulen und ECD-Zentren in ländlichen Gemeinden bringt.",
      nl: "Een gemeenschapsgericht programma voor veilig water in Zuid-Afrika, dat huishoudfiltratie, WASH-educatie, lokale distributie en opvolging brengt naar gezinnen, scholen en ECD-centra in landelijke gemeenschappen.",
    },
    accent: "#0EA5E9",
    bg: "#E0F2FE",
    icon: "Droplet",
    focusAreaBadges: ["safe-water", "education", "skills-livelihoods", "community-health", "disaster-relief"],
  },
  {
    slug: "greenhouse",
    path: "/projects/greenhouse",
    title: { en: "Greenhouse with SA Harvest", de: "Greenhouse mit SA Harvest", nl: "Greenhouse met SA Harvest" },
    tagline: {
      en: "Food, skills and nutrition close to home.",
      de: "Nahrung, Fähigkeiten und Ernährung nah an der Gemeinschaft.",
      nl: "Voedsel, vaardigheden en voeding dicht bij de gemeenschap.",
    },
    description: {
      en: "A greenhouse partnership that grows food, strengthens nutrition and creates practical learning and work opportunities for local women and the wider community.",
      de: "Eine Gewächshaus-Partnerschaft, die Lebensmittel anbaut, Ernährung stärkt und praktische Lern- und Arbeitsmöglichkeiten für Frauen vor Ort und die weitere Gemeinschaft schafft.",
      nl: "Een kaspartnerschap dat voedsel verbouwt, voeding versterkt en praktische leer- en werkmogelijkheden creëert voor vrouwen ter plaatse en de bredere gemeenschap.",
    },
    accent: "#16A34A",
    bg: "#DCFCE7",
    icon: "Sprout",
    focusAreaBadges: ["food-security", "skills-livelihoods", "community-health"],
  },
  {
    slug: "food-security",
    path: "/projects/food-security",
    title: { en: "Food Security", de: "Ernährungssicherheit", nl: "Voedselzekerheid" },
    tagline: {
      en: "Meals that protect families from hunger.",
      de: "Mahlzeiten, die Familien vor Hunger schützen.",
      nl: "Maaltijden die gezinnen beschermen tegen honger.",
    },
    description: {
      en: "Through meals, food parcels, community kitchens and food rescue partnerships, we help families through times when food is not guaranteed.",
      de: "Durch Mahlzeiten, Lebensmittelpakete, Gemeinschaftsküchen und Partnerschaften zur Rettung von Lebensmitteln helfen wir Familien in Südafrika in Zeiten, in denen Nahrung nicht gesichert ist.",
      nl: "Met maaltijden, voedselpakketten, gemeenschapskeukens en partnerschappen rond voedselredding helpen we gezinnen in Zuid-Afrika in periodes waarin voedsel niet vanzelfsprekend is.",
    },
    accent: "#EA580C",
    bg: "#FFEDD5",
    icon: "UtensilsCrossed",
    focusAreaBadges: ["food-security", "community-health"],
  },
  {
    slug: "pondo-dogs",
    path: "/projects/pondo-dogs",
    title: { en: "Pondo Dogs", de: "Pondo Dogs", nl: "Pondo Dogs" },
    tagline: {
      en: "Healthier animals. Kinder communities.",
      de: "Gesündere Tiere. Freundlichere Gemeinschaften.",
      nl: "Gezondere dieren. Vriendelijkere gemeenschappen.",
    },
    description: {
      en: "Animal welfare is part of community wellbeing. Through Pondo Dogs, we support dogs and other domestic or working animals with sterilisation, food, medical care, emergency help and humane education — helping animals and families live safer, healthier lives.",
      de: "Tierschutz ist Teil des Wohlergehens einer Gemeinschaft. Durch Pondo Dogs werden Hunde und andere Haus- und Nutztiere mit Sterilisation, Futter, medizinischer Versorgung, Nothilfe und humaner Aufklärung unterstützt — damit Tiere und Familien sicherer und gesünder leben können.",
      nl: "Dierenwelzijn is onderdeel van het welzijn van een gemeenschap. Via Pondo Dogs worden honden en andere huis- en werkdieren ondersteund met sterilisatie, voeding, medische zorg, noodhulp en humane educatie — zodat dieren en gezinnen veiliger en gezonder kunnen leven.",
    },
    accent: "#D97706",
    bg: "#FEF3C7",
    icon: "PawPrint",
    focusAreaBadges: ["animal-welfare", "education", "skills-livelihoods", "community-health"],
  },
  {
    slug: "disaster-relief",
    path: "/projects/disaster-relief",
    title: { en: "Disaster Relief", de: "Nothilfe & Katastrophenhilfe", nl: "Noodhulp & rampenhulp" },
    tagline: {
      en: "Practical help when crisis hits.",
      de: "Praktische Hilfe, wenn eine Krise eintritt.",
      nl: "Praktische hulp wanneer een crisis toeslaat.",
    },
    description: {
      en: "When families face floods, fires, medical crises or sudden hardship, we respond with practical support rooted in local knowledge and community trust.",
      de: "Wenn Familien von Überschwemmungen, Bränden, medizinischen Notfällen oder plötzlicher Not betroffen sind, unterstützt iThemba Kuluntu mit praktischer Hilfe, die auf lokaler Kenntnis und Vertrauen in der Gemeinschaft beruht.",
      nl: "Wanneer gezinnen worden getroffen door overstromingen, branden, medische noodsituaties of plotselinge tegenslag, ondersteunt iThemba Kuluntu met praktische hulp die is gebaseerd op lokale kennis en vertrouwen binnen de gemeenschap.",
    },
    accent: "#1E40AF",
    bg: "#DBEAFE",
    icon: "ShieldAlert",
    focusAreaBadges: ["disaster-relief", "safe-water", "education", "skills-livelihoods", "community-health"],
  },
];

export const impactCounters = [
  { value: 3094, suffix: "", icon: "Droplets", iconSrc: "/assets/icons/impact/impact-safe-water-systems.png", label: { en: "Safe water systems distributed", de: "Wassersysteme verteilt", nl: "Watersystemen verdeeld" } },
  { value: 15000, suffix: "+", icon: "Users", iconSrc: "/assets/icons/impact/impact-people-reached.png", label: { en: "People reached through PureFlow Amanzi", de: "Menschen durch PureFlow Amanzi erreicht", nl: "Mensen bereikt via PureFlow Amanzi" } },
  { value: 120, suffix: "", icon: "Baby", iconSrc: "/assets/icons/impact/impact-ecd-children.png", label: { en: "Children attending ECD daily", de: "Kinder täglich im ECD Centre betreut", nl: "Kinderen dagelijks in het ECD Centre begeleid" } },
  { value: 300000, suffix: "+", icon: "Utensils", iconSrc: "/assets/icons/impact/impact-meals-served.png", label: { en: "Meals served", de: "Mahlzeiten ausgegeben", nl: "Maaltijden verstrekt" } },
  { value: 2863, suffix: "", icon: "Package", iconSrc: "/assets/icons/impact/impact-food-hampers.png", label: { en: "Food hampers distributed", de: "Lebensmittelpakete verteilt", nl: "Voedselpakketten verdeeld" } },
  { value: 600, suffix: "+", icon: "Bed", iconSrc: "/assets/icons/impact/impact-mattresses.png", label: { en: "Mattresses distributed", de: "Matratzen verteilt", nl: "Matrassen verdeeld" } },
  { value: 2100, suffix: "+", icon: "Bed", iconSrc: "/assets/icons/impact/impact-blankets.png", label: { en: "Blankets distributed", de: "Decken verteilt", nl: "Dekens verdeeld" } },
  { value: 114, suffix: "", icon: "Accessibility", iconSrc: "/assets/icons/impact/impact-wheelchairs.png", label: { en: "Wheelchairs distributed", de: "Rollstühle verteilt", nl: "Rolstoelen verdeeld" } },
  { value: 1300, suffix: "+", icon: "Footprints", iconSrc: "/assets/icons/impact/impact-school-shoes.png", label: { en: "School shoes distributed", de: "Schulschuhe verteilt", nl: "Schoolschoenen verdeeld" } },
  { value: 3000, suffix: "+", icon: "Home", iconSrc: "/assets/icons/impact/impact-families-supported.png", label: { en: "Families supported", de: "Familien unterstützt", nl: "Gezinnen ondersteund" } },
  { value: 20, suffix: "+", icon: "MapPin", iconSrc: "/assets/icons/impact/impact-villages-reached.png", label: { en: "Villages reached", de: "Dörfer erreicht", nl: "Dorpen bereikt" } },
];

export const fullImpactCounters = impactCounters;

export const focusAreas = [
  { icon: "BookOpen", label: { en: "Education", de: "Bildung", nl: "Onderwijs" } },
  { icon: "Droplet", label: { en: "Safe water", de: "Sicheres Wasser", nl: "Veilig water" } },
  { icon: "UtensilsCrossed", label: { en: "Food security", de: "Ernährungssicherheit", nl: "Voedselzekerheid" } },
  { icon: "Wrench", label: { en: "Skills & livelihoods", de: "Qualifizierung & Einkommen", nl: "Vaardigheden & inkomen" } },
  { icon: "HeartPulse", label: { en: "Community health", de: "Gesundheit der Gemeinschaft", nl: "Gemeenschapsgezondheid" } },
  { icon: "PawPrint", label: { en: "Animal welfare", de: "Tierschutz", nl: "Dierenwelzijn" } },
  { icon: "ShieldAlert", label: { en: "Disaster relief", de: "Nothilfe", nl: "Noodhulp" } },
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
