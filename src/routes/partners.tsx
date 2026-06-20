import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Heart,
  HandHeart,
  Handshake,
  Sparkles,
  Users,
  ShieldCheck,
  Network,
  Activity,
  Anchor,
  Repeat,
  Building2,
  PackageOpen,
  Wrench,
  Siren,
  Megaphone,
  UserCheck,
  Target,
  MapPin,
  Camera,
  MessageCircle,
  HeartHandshake,
  Compass,
} from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { Button } from "@/components/ui/button";
import { partners, focusAreaBadgeMeta, type FocusAreaBadge } from "@/data/projects";
import { assets } from "@/data/assets";

export const Route = createFileRoute("/partners")({ component: PartnersPage });

/* ---------- assets ---------- */
const HERO_VIDEO = "/assets/videos/partners/partners-hero.mp4";
const HERO_POSTER = "/assets/photos/partners/partners-hero-poster.jpg";
const HERO_FALLBACK = assets.photos.home.hero;
const CTA_BG = assets.photos.home.impact;

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

/* ---------- content (verbatim from /public/content/partners) ---------- */
type Copy = {
  hero: { eyebrow: string; title: string; text: string; ctaPartner: string; ctaProjects: string };
  why: {
    eyebrow: string; title: string; body: string[]; points: { icon: keyof typeof WHY_ICONS; label: string }[];
  };
  opportunities: {
    eyebrow: string; title: string; intro: string; outro: string;
    items: { badge: FocusAreaBadge | "none"; label: string; icon?: keyof typeof OPP_FALLBACK_ICONS }[];
  };
  partners: { eyebrow: string; title: string; intro: string; outro: string; placeholderSuffix: string };
  how: {
    eyebrow: string; title: string; intro: string; outro: string;
    items: { icon: keyof typeof HOW_ICONS; label: string }[];
  };
  expect: {
    eyebrow: string; title: string; intro: string;
    items: { icon: keyof typeof EXPECT_ICONS; label: string }[];
  };
  cta: {
    eyebrow: string; title: string; body: string[];
    ctaPartner: string; ctaContact: string; ctaProjects: string;
  };
};

const WHY_ICONS = { Anchor, Users, ShieldCheck, Network, Activity, MapPin } as const;
const OPP_FALLBACK_ICONS = { Heart, Sparkles } as const;
const HOW_ICONS = {
  Handshake, Repeat, Building2, PackageOpen, Wrench, Siren, Megaphone, UserCheck,
} as const;
const EXPECT_ICONS = {
  Target, Users, MapPin, Camera, MessageCircle, ShieldHeart, Compass,
} as const;

const COPY: Record<"en" | "de" | "nl", Copy> = {
  en: {
    hero: {
      eyebrow: "Partnerships",
      title: "Partner with iThemba Kuluntu",
      text: "We work with partners who want to support practical, community-rooted change in Pondoland and beyond. Together, we can strengthen safe water, early childhood development, food security, animal welfare, disaster relief and local livelihoods.",
      ctaPartner: "Become a Partner",
      ctaProjects: "Explore Our Projects",
    },
    why: {
      eyebrow: "Together",
      title: "Practical impact, carried by local trust",
      body: [
        "iThemba Kuluntu is rooted in the communities we serve. Our work is practical, relationship-based and built around real needs on the ground.",
        "Partnerships help us move faster, reach more families and build long-term solutions that communities can trust.",
      ],
      points: [
        { icon: "Anchor", label: "Local trust and grounded delivery" },
        { icon: "Users", label: "Women-led and community-rooted leadership" },
        { icon: "ShieldCheck", label: "Transparent reporting and accountability" },
        { icon: "Network", label: "Connected programmes across water, food, learning, care and livelihoods" },
        { icon: "Activity", label: "Proven response capacity" },
        { icon: "MapPin", label: "Long-term presence in Pondoland" },
      ],
    },
    opportunities: {
      eyebrow: "Where partners help",
      title: "Support a project area that matches your mission",
      intro: "Partners can support one project area or help strengthen the wider work of iThemba Kuluntu.",
      outro: "Each partnership is shaped around practical needs, clear goals and responsible implementation.",
      items: [
        { badge: "education", label: "Early childhood development" },
        { badge: "safe-water", label: "Safe water and WASH education" },
        { badge: "food-security", label: "Food security" },
        { badge: "none", label: "Greenhouse and local nutrition", icon: "Sparkles" },
        { badge: "animal-welfare", label: "Animal welfare" },
        { badge: "disaster-relief", label: "Disaster relief" },
        { badge: "community-health", label: "Community health" },
        { badge: "skills-livelihoods", label: "Skills and livelihoods" },
      ],
    },
    partners: {
      eyebrow: "Our partners",
      title: "Organisations walking with us",
      intro: "We are grateful for the partners who help make this work possible through funding, food support, technical expertise, training, emergency response, animal welfare support and long-term collaboration.",
      outro: "These partnerships help turn care into action: meals served, water systems delivered, children supported, animals treated, families reached and communities strengthened.",
      placeholderSuffix: "logo pending",
    },
    how: {
      eyebrow: "How it works",
      title: "Simple, clear and accountable",
      intro: "A partnership can begin with one project, one campaign, one donation, one technical contribution or one shared rollout.",
      outro: "We value partnerships that are practical, respectful and focused on real outcomes for communities.",
      items: [
        { icon: "Handshake", label: "Project sponsorship" },
        { icon: "Repeat", label: "Monthly or annual support" },
        { icon: "Building2", label: "Corporate social investment" },
        { icon: "PackageOpen", label: "Food, materials or equipment support" },
        { icon: "Wrench", label: "Technical expertise and training" },
        { icon: "Siren", label: "Emergency response support" },
        { icon: "Megaphone", label: "Awareness and media collaboration" },
        { icon: "UserCheck", label: "Volunteer or skills-based support" },
      ],
    },
    expect: {
      eyebrow: "Trust",
      title: "Clear communication and responsible follow-up",
      intro: "Partners should know where their support goes and what it helps make possible.",
      items: [
        { icon: "Target", label: "A clear project focus" },
        { icon: "Users", label: "Practical implementation through local teams" },
        { icon: "MapPin", label: "Updates from the field" },
        { icon: "Camera", label: "Photos, stories or reports where appropriate" },
        { icon: "MessageCircle", label: "Honest communication about needs and challenges" },
        { icon: "ShieldHeart", label: "Respect for communities and beneficiaries" },
        { icon: "Compass", label: "A relationship built on trust and shared purpose" },
      ],
    },
    cta: {
      eyebrow: "Let’s build together",
      title: "Your partnership can help care reach further",
      body: [
        "Whether you are a foundation, company, church, school, organisation or individual supporter, your partnership can help strengthen practical work that communities rely on.",
        "Together, we can support children, families, animals and local teams with care that is direct, dignified and rooted in trust.",
      ],
      ctaPartner: "Become a Partner",
      ctaContact: "Contact Us",
      ctaProjects: "Explore Our Projects",
    },
  },
  de: {
    hero: {
      eyebrow: "Partnerschaften",
      title: "Partner von iThemba Kuluntu werden",
      text: "Wir arbeiten mit Partnern zusammen, die praktische, gemeindenahe Veränderung in Pondoland und darüber hinaus unterstützen möchten. Gemeinsam können wir sicheres Wasser, frühkindliche Bildung, Ernährungssicherheit, Tierschutz, Katastrophenhilfe und lokale Lebensgrundlagen stärken.",
      ctaPartner: "Partner werden",
      ctaProjects: "Unsere Projekte entdecken",
    },
    why: {
      eyebrow: "Gemeinsam",
      title: "Praktische Wirkung, getragen von lokalem Vertrauen",
      body: [
        "iThemba Kuluntu ist tief in den Gemeinschaften verwurzelt, mit denen wir arbeiten. Unsere Arbeit ist praktisch, beziehungsorientiert und an den realen Bedürfnissen vor Ort ausgerichtet.",
        "Partnerschaften helfen uns, schneller zu handeln, mehr Familien zu erreichen und langfristige Lösungen aufzubauen, denen Gemeinschaften vertrauen können.",
      ],
      points: [
        { icon: "Anchor", label: "Lokales Vertrauen und verlässliche Umsetzung vor Ort" },
        { icon: "Users", label: "Von Frauen mitgetragene, gemeindenahe Leitung" },
        { icon: "ShieldCheck", label: "Transparente Berichterstattung und Verantwortlichkeit" },
        { icon: "Network", label: "Verbundene Programme in den Bereichen Wasser, Ernährung, Bildung, Fürsorge und Lebensgrundlagen" },
        { icon: "Activity", label: "Nachgewiesene Fähigkeit, auf akute Bedarfe zu reagieren" },
        { icon: "MapPin", label: "Langfristige Präsenz in Pondoland" },
      ],
    },
    opportunities: {
      eyebrow: "Wo Partner helfen",
      title: "Unterstützen Sie einen Projektbereich, der zu Ihrer Mission passt",
      intro: "Partner können einen einzelnen Projektbereich unterstützen oder dazu beitragen, die Arbeit von iThemba Kuluntu insgesamt zu stärken.",
      outro: "Jede Partnerschaft wird entlang praktischer Bedarfe, klarer Ziele und verantwortlicher Umsetzung gestaltet.",
      items: [
        { badge: "education", label: "Frühkindliche Bildung" },
        { badge: "safe-water", label: "Sicheres Wasser und WASH-Bildung" },
        { badge: "food-security", label: "Ernährungssicherheit" },
        { badge: "none", label: "Gewächshaus und lokale Ernährung", icon: "Sparkles" },
        { badge: "animal-welfare", label: "Tierschutz" },
        { badge: "disaster-relief", label: "Katastrophenhilfe" },
        { badge: "community-health", label: "Gemeindegesundheit" },
        { badge: "skills-livelihoods", label: "Kompetenzen und Lebensgrundlagen" },
      ],
    },
    partners: {
      eyebrow: "Unsere Partner",
      title: "Organisationen, die mit uns gehen",
      intro: "Wir sind dankbar für die Partner, die diese Arbeit möglich machen, durch Finanzierung, Lebensmittelhilfe, technische Expertise, Schulungen, Notfallhilfe, Unterstützung im Tierschutz und langfristige Zusammenarbeit.",
      outro: "Diese Partnerschaften helfen, Fürsorge in konkrete Wirkung zu übersetzen: Mahlzeiten werden ausgegeben, Wassersysteme geliefert, Kinder unterstützt, Tiere behandelt, Familien erreicht und Gemeinschaften gestärkt.",
      placeholderSuffix: "Logo folgt",
    },
    how: {
      eyebrow: "So kann Zusammenarbeit aussehen",
      title: "Einfach, klar und verantwortungsvoll",
      intro: "Eine Partnerschaft kann mit einem Projekt, einer Kampagne, einer Spende, einem technischen Beitrag oder einem gemeinsamen Rollout beginnen.",
      outro: "Wir schätzen Partnerschaften, die praktisch, respektvoll und auf echte Ergebnisse für die Gemeinschaften ausgerichtet sind.",
      items: [
        { icon: "Handshake", label: "Projektförderung" },
        { icon: "Repeat", label: "Monatliche oder jährliche Unterstützung" },
        { icon: "Building2", label: "Corporate Social Investment" },
        { icon: "PackageOpen", label: "Lebensmittel-, Material- oder Ausstattungsspenden" },
        { icon: "Wrench", label: "Technische Expertise und Schulungen" },
        { icon: "Siren", label: "Unterstützung in Not- und Krisensituationen" },
        { icon: "Megaphone", label: "Öffentlichkeitsarbeit und Medienkooperation" },
        { icon: "UserCheck", label: "Ehrenamtliche oder kompetenzbasierte Unterstützung" },
      ],
    },
    expect: {
      eyebrow: "Vertrauen",
      title: "Klare Kommunikation und verantwortliche Nachverfolgung",
      intro: "Partner sollen wissen, wohin ihre Unterstützung geht und was sie konkret möglich macht.",
      items: [
        { icon: "Target", label: "Einen klaren Projektfokus" },
        { icon: "Users", label: "Praktische Umsetzung durch lokale Teams" },
        { icon: "MapPin", label: "Updates aus dem Feld" },
        { icon: "Camera", label: "Fotos, Geschichten oder Berichte, wo passend" },
        { icon: "MessageCircle", label: "Ehrliche Kommunikation über Bedarfe und Herausforderungen" },
        { icon: "ShieldHeart", label: "Respekt gegenüber Gemeinschaften und Begünstigten" },
        { icon: "Compass", label: "Eine Zusammenarbeit, die auf Vertrauen und gemeinsamer Zielsetzung beruht" },
      ],
    },
    cta: {
      eyebrow: "Lassen Sie uns gemeinsam aufbauen",
      title: "Ihre Partnerschaft kann Fürsorge weitertragen",
      body: [
        "Ob Stiftung, Unternehmen, Kirche, Schule, Organisation oder private Unterstützerin oder privater Unterstützer: Ihre Partnerschaft kann praktische Arbeit stärken, auf die Gemeinschaften angewiesen sind.",
        "Gemeinsam können wir Kinder, Familien, Tiere und lokale Teams mit direkter, würdevoller und vertrauensvoller Unterstützung begleiten.",
      ],
      ctaPartner: "Partner werden",
      ctaContact: "Kontakt aufnehmen",
      ctaProjects: "Unsere Projekte entdecken",
    },
  },
  nl: {
    hero: {
      eyebrow: "Partnerschappen",
      title: "Word partner van iThemba Kuluntu",
      text: "Wij werken samen met partners die praktische, gemeenschapsgerichte verandering in Pondoland en daarbuiten willen versterken. Samen kunnen we veilig water, vroege kinderontwikkeling, voedselzekerheid, dierenwelzijn, noodhulp en lokale bestaansmogelijkheden ondersteunen.",
      ctaPartner: "Word partner",
      ctaProjects: "Ontdek onze projecten",
    },
    why: {
      eyebrow: "Samen",
      title: "Praktische impact, gedragen door lokaal vertrouwen",
      body: [
        "iThemba Kuluntu is diep geworteld in de gemeenschappen waarmee we werken. Onze aanpak is praktisch, relationeel en gebaseerd op echte behoeften ter plaatse.",
        "Partnerschappen helpen ons sneller te handelen, meer families te bereiken en duurzame oplossingen op te bouwen die door gemeenschappen worden vertrouwd.",
      ],
      points: [
        { icon: "Anchor", label: "Lokaal vertrouwen en betrouwbare uitvoering op de grond" },
        { icon: "Users", label: "Door vrouwen gedragen, gemeenschapsgerichte leiding" },
        { icon: "ShieldCheck", label: "Transparante rapportage en verantwoording" },
        { icon: "Network", label: "Verbonden programma’s rond water, voeding, educatie, zorg en bestaansmogelijkheden" },
        { icon: "Activity", label: "Bewezen vermogen om op urgente behoeften te reageren" },
        { icon: "MapPin", label: "Langdurige aanwezigheid in Pondoland" },
      ],
    },
    opportunities: {
      eyebrow: "Waar partners helpen",
      title: "Steun een projectgebied dat past bij uw missie",
      intro: "Partners kunnen één specifiek projectgebied ondersteunen of bijdragen aan de bredere werking van iThemba Kuluntu.",
      outro: "Elke samenwerking wordt opgebouwd rond praktische behoeften, duidelijke doelen en verantwoordelijke uitvoering.",
      items: [
        { badge: "education", label: "Vroege kinderontwikkeling" },
        { badge: "safe-water", label: "Veilig water en WASH-educatie" },
        { badge: "food-security", label: "Voedselzekerheid" },
        { badge: "none", label: "Greenhouse en lokale voeding", icon: "Sparkles" },
        { badge: "animal-welfare", label: "Dierenwelzijn" },
        { badge: "disaster-relief", label: "Noodhulp" },
        { badge: "community-health", label: "Gemeenschapsgezondheid" },
        { badge: "skills-livelihoods", label: "Vaardigheden en bestaansmogelijkheden" },
      ],
    },
    partners: {
      eyebrow: "Onze partners",
      title: "Organisaties die met ons meelopen",
      intro: "Wij zijn dankbaar voor de partners die dit werk mogelijk maken via financiering, voedselsteun, technische expertise, training, noodhulp, ondersteuning voor dierenwelzijn en langdurige samenwerking.",
      outro: "Deze partnerschappen helpen zorg om te zetten in concrete actie: maaltijden worden verstrekt, watersystemen geleverd, kinderen ondersteund, dieren behandeld, families bereikt en gemeenschappen versterkt.",
      placeholderSuffix: "logo volgt",
    },
    how: {
      eyebrow: "Hoe samenwerking eruit kan zien",
      title: "Eenvoudig, helder en verantwoord",
      intro: "Een partnerschap kan beginnen met één project, één campagne, één donatie, één technische bijdrage of één gezamenlijke uitrol.",
      outro: "Wij waarderen partnerschappen die praktisch, respectvol en gericht zijn op echte resultaten voor gemeenschappen.",
      items: [
        { icon: "Handshake", label: "Projectsponsoring" },
        { icon: "Repeat", label: "Maandelijkse of jaarlijkse steun" },
        { icon: "Building2", label: "Corporate social investment" },
        { icon: "PackageOpen", label: "Steun in de vorm van voedsel, materialen of uitrusting" },
        { icon: "Wrench", label: "Technische expertise en training" },
        { icon: "Siren", label: "Ondersteuning bij noodsituaties en crisisrespons" },
        { icon: "Megaphone", label: "Bewustwording en mediasamenwerking" },
        { icon: "UserCheck", label: "Vrijwillige of vaardigheidsgerichte ondersteuning" },
      ],
    },
    expect: {
      eyebrow: "Vertrouwen",
      title: "Heldere communicatie en zorgvuldige opvolging",
      intro: "Partners moeten weten waar hun steun naartoe gaat en wat die concreet mogelijk maakt.",
      items: [
        { icon: "Target", label: "Een duidelijke projectfocus" },
        { icon: "Users", label: "Praktische uitvoering door lokale teams" },
        { icon: "MapPin", label: "Updates uit het veld" },
        { icon: "Camera", label: "Foto’s, verhalen of rapportages waar passend" },
        { icon: "MessageCircle", label: "Eerlijke communicatie over behoeften en uitdagingen" },
        { icon: "ShieldHeart", label: "Respect voor gemeenschappen en begunstigden" },
        { icon: "Compass", label: "Een samenwerking gebouwd op vertrouwen en gedeelde doelgerichtheid" },
      ],
    },
    cta: {
      eyebrow: "Laten we samen bouwen",
      title: "Uw partnerschap kan zorg verder laten reiken",
      body: [
        "Of u nu een stichting, bedrijf, kerk, school, organisatie of individuele ondersteuner bent: uw partnerschap kan praktisch werk versterken waarop gemeenschappen vertrouwen.",
        "Samen kunnen we kinderen, families, dieren en lokale teams ondersteunen met zorg die direct, waardig en geworteld is in vertrouwen.",
      ],
      ctaPartner: "Word partner",
      ctaContact: "Neem contact op",
      ctaProjects: "Ontdek onze projecten",
    },
  },
};

/* ---------- wave divider ---------- */
function Wave({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  return (
    <div className="relative" style={{ background: from, lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-[60px] w-full md:h-[90px]"
        style={{ transform: flip ? "scaleY(-1)" : undefined }}
        aria-hidden
      >
        <path d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,50 L1440,90 L0,90 Z" fill={to} />
      </svg>
    </div>
  );
}

/* ---------- hero video ---------- */
function HeroVideo() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced || failed) return;
    v.play().catch(() => {/* ignore */});
  }, [reduced, failed]);

  if (reduced || failed) {
    return (
      <img
        src={HERO_POSTER}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = HERO_FALLBACK; }}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={HERO_POSTER}
      onError={() => setFailed(true)}
      aria-hidden
    >
      <source src={HERO_VIDEO} type="video/mp4" />
    </video>
  );
}

/* ---------- page ---------- */
function PartnersPage() {
  const { lang } = useLang();
  const c = COPY[lang];

  const blueDeep = "var(--ithemba-blue-deepest, #0b2545)";
  const cream = "var(--ithemba-cream, #fdf7ed)";

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[78vh] min-h-[520px] w-full">
          <HeroVideo />
          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(60% 80% at 20% 30%, rgba(11,37,69,0.45), transparent 70%)" }}
          />
          {/* content */}
          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-16 pt-24 md:px-8 md:pb-24">
            <p
              className="text-2xl text-[var(--ithemba-yellow,#f5c64a)] md:text-3xl"
              style={{ fontFamily: '"Caveat", "Kalam", cursive' }}
            >
              {c.hero.eyebrow}
            </p>
            <h1 className="mt-1 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl">
              {c.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/90 md:text-lg">{c.hero.text}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[var(--ithemba-yellow,#f5c64a)] text-[#0b2545] hover:bg-[var(--ithemba-yellow,#f5c64a)]/90">
                <Link to="/contact">
                  <HandHeart className="mr-2 h-5 w-5" />
                  {c.hero.ctaPartner}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                <Link to="/projects">
                  {c.hero.ctaProjects}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Wave from="rgba(0,0,0,0)" to={cream} />
      </section>

      {/* ============ WHY ============ */}
      <section style={{ background: cream }} className="relative">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p
            className="text-3xl text-[color:var(--ithemba-blue,#1d4e89)]"
            style={{ fontFamily: '"Caveat", "Kalam", cursive' }}
          >
            {c.why.eyebrow}
          </p>
          <h2 className="mt-1 max-w-3xl font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
            {c.why.title}
          </h2>
          <div className="mt-5 grid max-w-3xl gap-4 text-[15px] leading-relaxed text-foreground/85 md:text-base">
            {c.why.body.map((p, i) => (<p key={i}>{p}</p>))}
          </div>

          <ul className="mt-10 grid gap-x-8 gap-y-6 md:grid-cols-2">
            {c.why.points.map((pt) => {
              const Icon = WHY_ICONS[pt.icon];
              return (
                <li key={pt.label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[color:var(--ithemba-blue,#1d4e89)]/10 text-[color:var(--ithemba-blue,#1d4e89)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="pt-1.5 text-[15px] font-medium text-foreground md:text-base">{pt.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============ OPPORTUNITIES ============ */}
      <section style={{ background: cream }} className="relative">
        <div className="mx-auto max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
          <div className="border-t border-[color:var(--ithemba-blue-deepest,#0b2545)]/10 pt-16">
            <p
              className="text-3xl text-[color:var(--ithemba-blue,#1d4e89)]"
              style={{ fontFamily: '"Caveat", "Kalam", cursive' }}
            >
              {c.opportunities.eyebrow}
            </p>
            <h2 className="mt-1 max-w-3xl font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
              {c.opportunities.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] text-foreground/80 md:text-base">{c.opportunities.intro}</p>

            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {c.opportunities.items.map((it) => {
                const meta = it.badge !== "none" ? focusAreaBadgeMeta[it.badge] : null;
                const Fallback = it.icon ? OPP_FALLBACK_ICONS[it.icon] : Sparkles;
                return (
                  <li key={it.label} className="flex flex-col items-center text-center">
                    {meta ? (
                      <img
                        src={meta.src}
                        alt=""
                        aria-hidden
                        className="h-16 w-16 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)] md:h-20 md:w-20"
                        loading="lazy"
                      />
                    ) : (
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md md:h-20 md:w-20">
                        <Fallback className="h-8 w-8" />
                      </span>
                    )}
                    <span className="mt-3 text-sm font-medium text-foreground md:text-[15px]">{it.label}</span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-10 max-w-2xl text-[15px] text-foreground/80 md:text-base">{c.opportunities.outro}</p>
          </div>
        </div>
      </section>

      <Wave from={cream} to="#ffffff" />

      {/* ============ CURRENT PARTNERS ============ */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p
            className="text-3xl text-[color:var(--ithemba-blue,#1d4e89)]"
            style={{ fontFamily: '"Caveat", "Kalam", cursive' }}
          >
            {c.partners.eyebrow}
          </p>
          <h2 className="mt-1 max-w-3xl font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
            {c.partners.title}
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] text-foreground/80 md:text-base">{c.partners.intro}</p>

          <div className="mt-12 grid grid-cols-2 items-center gap-x-10 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.name}
                title={p.name}
                className="group flex h-28 items-center justify-center md:h-36"
              >
                <img
                  src={p.logo}
                  alt={`${p.name} logo`}
                  loading="lazy"
                  className={`object-contain opacity-90 transition group-hover:opacity-100 group-hover:scale-[1.04] ${p.sizeClass ?? "max-h-[120px] max-w-[240px]"}`}
                />
              </a>
            ))}
            {/* Küstenhund e.V. — logo pending placeholder, no fake logo */}
            <div className="flex h-28 flex-col items-center justify-center text-center md:h-36">
              <span className="font-display text-lg font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)]">
                Küstenhund e.V.
              </span>
              <span className="mt-1 text-xs uppercase tracking-wide text-foreground/55">
                {c.partners.placeholderSuffix}
              </span>
            </div>
          </div>

          <p className="mt-14 max-w-3xl text-[15px] text-foreground/80 md:text-base">{c.partners.outro}</p>
        </div>
      </section>

      <Wave from="#ffffff" to={blueDeep} />

      {/* ============ HOW IT WORKS ============ */}
      <section style={{ background: blueDeep }} className="text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p
            className="text-3xl text-[var(--ithemba-yellow,#f5c64a)]"
            style={{ fontFamily: '"Caveat", "Kalam", cursive' }}
          >
            {c.how.eyebrow}
          </p>
          <h2 className="mt-1 max-w-3xl font-display text-3xl font-bold md:text-4xl">{c.how.title}</h2>
          <p className="mt-4 max-w-3xl text-[15px] text-white/85 md:text-base">{c.how.intro}</p>

          <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-2">
            {c.how.items.map((it) => {
              const Icon = HOW_ICONS[it.icon];
              return (
                <li key={it.label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[var(--ithemba-yellow,#f5c64a)]/40 text-[var(--ithemba-yellow,#f5c64a)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="pt-2 text-[15px] font-medium text-white md:text-base">{it.label}</span>
                </li>
              );
            })}
          </ul>

          <p className="mt-12 max-w-3xl text-[15px] text-white/80 md:text-base">{c.how.outro}</p>
        </div>
      </section>

      <Wave from={blueDeep} to={cream} />

      {/* ============ WHAT PARTNERS CAN EXPECT ============ */}
      <section style={{ background: cream }}>
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p
            className="text-3xl text-[color:var(--ithemba-blue,#1d4e89)]"
            style={{ fontFamily: '"Caveat", "Kalam", cursive' }}
          >
            {c.expect.eyebrow}
          </p>
          <h2 className="mt-1 max-w-3xl font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
            {c.expect.title}
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] text-foreground/80 md:text-base">{c.expect.intro}</p>

          <ul className="mt-10 grid gap-x-10 gap-y-5 md:grid-cols-2">
            {c.expect.items.map((it) => {
              const Icon = EXPECT_ICONS[it.icon];
              return (
                <li key={it.label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[color:var(--ithemba-blue,#1d4e89)] text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="pt-1.5 text-[15px] font-medium text-foreground md:text-base">{it.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Wave from={cream} to={blueDeep} />

      {/* ============ CLOSING CTA ============ */}
      <section className="relative isolate overflow-hidden text-white" style={{ background: blueDeep }}>
        <img
          src={CTA_BG}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b2545]/85 via-[#0b2545]/80 to-[#0b2545]/95" />
        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center md:px-8 md:py-32">
          <p
            className="text-3xl text-[var(--ithemba-yellow,#f5c64a)] md:text-4xl"
            style={{ fontFamily: '"Caveat", "Kalam", cursive' }}
          >
            {c.cta.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-5xl">{c.cta.title}</h2>
          <div className="mx-auto mt-6 max-w-2xl space-y-4 text-[15px] text-white/85 md:text-base">
            {c.cta.body.map((p, i) => (<p key={i}>{p}</p>))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-[var(--ithemba-yellow,#f5c64a)] text-[#0b2545] hover:bg-[var(--ithemba-yellow,#f5c64a)]/90">
              <Link to="/contact">
                <Handshake className="mr-2 h-5 w-5" />
                {c.cta.ctaPartner}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white/20">
              <Link to="/contact">{c.cta.ctaContact}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white/20">
              <Link to="/projects">
                {c.cta.ctaProjects}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
