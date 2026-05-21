/**
 * Central asset manifest.
 *
 * Defines the planned paths for every logo, photo and custom icon used on the
 * site. Files live under `/public/assets/...` so they resolve at the URL
 * `/assets/...`. Many of these files are NOT uploaded yet — components should
 * use the `<SmartImage>` / `<SmartIcon>` / `<SmartLogo>` helpers, which fall
 * back to a visible placeholder + a [[MISSING: upload asset file at ...]] note.
 *
 * IMPORTANT: do not invent files. Add a path here only when the file is
 * planned, even if it does not yet exist on disk.
 */

const base = "/assets";

export const assets = {
  logos: {
    ithembaRoundColor: `${base}/logos/ithemba-round-color.png`,
    ithembaTextWhite: `${base}/logos/ithemba-text-white.png`,
    pureflowAmanzi: `${base}/logos/pureflow-amanzi-logo.png`,
    no1Ecd: `${base}/logos/no1-ecd-logo.png`,
    pondoDogs: `${base}/logos/pondo-dogs-logo.png`,
  },
  focusAreaIcons: {
    education: `${base}/icons/focus-areas/education.png`,
    "safe-water": `${base}/icons/focus-areas/safe-water.png`,
    "food-security": `${base}/icons/focus-areas/food-security.png`,
    "skills-livelihoods": `${base}/icons/focus-areas/skills-livelihoods.png`,
    "community-health": `${base}/icons/focus-areas/community-health.png`,
    "animal-welfare": `${base}/icons/focus-areas/animal-welfare.png`,
    "disaster-relief": `${base}/icons/focus-areas/disaster-relief.png`,
  },
  photos: {
    home: {
      hero: `${base}/photos/home/home-hero-community.jpg`,
      aboutTeam: `${base}/photos/home/home-about-team.jpg`,
      impact: `${base}/photos/home/home-impact-community.jpg`,
      donation: `${base}/photos/home/home-donation.jpg`,
      beliefBubble1: `${base}/photos/home/home-belief-bubble-01.jpg`,
      beliefBubble2: `${base}/photos/home/home-belief-bubble-02.jpg`,
      beliefBubble3: `${base}/photos/home/home-belief-bubble-03.jpg`,
      donationBubble1: `${base}/photos/home/home-donation-bubble-01.jpg`,
      donationBubble2: `${base}/photos/home/home-donation-bubble-02.jpg`,
      donationBackground: `${base}/photos/home/home-donation-background.jpg`,
    },
    about: {
      hero: `${base}/photos/about/about-hero-community.jpg`,
      team: `${base}/photos/about/about-team.jpg`,
      cwebeni: `${base}/photos/about/about-cwebeni.jpg`,
    },
    projects: {
      ecdHero: `${base}/photos/projects/ecd-hero.jpg`,
      pureflowHero: `${base}/photos/projects/pureflow-hero.jpg`,
      greenhouseHero: `${base}/photos/projects/greenhouse-hero.jpg`,
      foodSecurityHero: `${base}/photos/projects/food-security-hero.jpg`,
      pondoDogsHero: `${base}/photos/projects/pondo-dogs-hero.jpg`,
      disasterReliefHero: `${base}/photos/projects/disaster-relief-hero.jpg`,
    },
    ecd: {
      childPlaying: `${base}/photos/ecd/ecd-child-playing.jpg`,
      classroom: `${base}/photos/ecd/ecd-classroom.jpg`,
      meal: `${base}/photos/ecd/ecd-meal.jpg`,
    },
    pureflow: {
      bucketFilter: `${base}/photos/pureflow/pureflow-bucket-filter.jpg`,
      communityDemo: `${base}/photos/pureflow/pureflow-community-demo.jpg`,
      beforeAfter: `${base}/photos/pureflow/pureflow-before-after-water.jpg`,
      schoolOrEcd: `${base}/photos/pureflow/pureflow-school-or-ecd.jpg`,
    },
    greenhouse: {
      main: `${base}/photos/greenhouse/greenhouse-main.jpg`,
      womenTraining: `${base}/photos/greenhouse/greenhouse-women-training.jpg`,
      foodGrowing: `${base}/photos/greenhouse/greenhouse-food-growing.jpg`,
    },
    foodSecurity: {
      meals: `${base}/photos/food-security/food-security-meals.jpg`,
      parcels: `${base}/photos/food-security/food-security-parcels.jpg`,
      communityKitchen: `${base}/photos/food-security/food-security-community-kitchen.jpg`,
    },
    pondoDogs: {
      hero: `${base}/photos/pondo-dogs/pondo-dogs-hero.jpg`,
      care: `${base}/photos/pondo-dogs/pondo-dogs-care.jpg`,
      community: `${base}/photos/pondo-dogs/pondo-dogs-community.jpg`,
    },
    disasterRelief: {
      support: `${base}/photos/disaster-relief/disaster-relief-support.jpg`,
      supplies: `${base}/photos/disaster-relief/disaster-relief-supplies.jpg`,
    },
    media: {
      placeholder: `${base}/photos/media/media-placeholder.jpg`,
    },
    partners: {
      hero: `${base}/photos/partners/partners-hero.jpg`,
    },
  },
} as const;

/** Helper — format the standard "missing asset" message for a planned path. */
export const missingAssetMessage = (path: string) =>
  `upload asset file at /public${path}`;
