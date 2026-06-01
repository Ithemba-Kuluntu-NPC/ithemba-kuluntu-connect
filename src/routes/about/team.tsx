import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MapPin, Sparkles, Users } from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { SmartImage } from "@/components/site/Asset";
import type { Lang } from "@/data/content";


export const Route = createFileRoute("/about/team")({ component: AboutTeam });

/* ---------- Per-language hero copy ---------- */

type HeroCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  location: string;
  back: string;
  sectionEyebrow: string;
  sectionHeading: string;
  sectionLead: string;
  ctaHeading: string;
  ctaDonate: string;
  ctaContact: string;
  photoPending: string;
};

const HERO: Record<Lang, HeroCopy> = {
  en: {
    eyebrow: "About",
    title: "Our Team",
    subtitle:
      "The people behind iThemba Kuluntu — community leaders, teachers, carers and builders working side by side in Cwebeni.",
    intro:
      "Local leadership grounds every project. International volunteers walk alongside the team in Germany, the Netherlands and Switzerland.",
    location: "Cwebeni · Port St Johns · Eastern Cape",
    back: "Back to About",
    sectionEyebrow: "Our people",
    sectionHeading: "Meet the team",
    sectionLead:
      "From early childhood teachers to water technicians, builders and community carers — these are the people doing the day-to-day work.",
    ctaHeading: "Support the team's work",
    ctaDonate: "Donate Monthly",
    ctaContact: "Get in touch",
    photoPending: "Photo coming soon",
  },
  de: {
    eyebrow: "Über",
    title: "Unser Team",
    subtitle:
      "Die Menschen hinter iThemba Kuluntu — Gemeindeleitende, Lehrkräfte, Betreuende und Handwerker:innen, Seite an Seite in Cwebeni.",
    intro:
      "Lokale Leitung trägt jedes Projekt. Ehrenamtliche aus Deutschland, den Niederlanden und der Schweiz begleiten das Team.",
    location: "Cwebeni · Port St Johns · Eastern Cape",
    back: "Zurück zu Über",
    sectionEyebrow: "Unsere Menschen",
    sectionHeading: "Lernen Sie das Team kennen",
    sectionLead:
      "Von ECD-Lehrkräften über Wassertechniker:innen bis hin zu Bau- und Pflegeteams — sie machen die tägliche Arbeit möglich.",
    ctaHeading: "Unterstützen Sie die Arbeit des Teams",
    ctaDonate: "Monatlich spenden",
    ctaContact: "Kontakt aufnehmen",
    photoPending: "Foto folgt in Kürze",
  },
  nl: {
    eyebrow: "Over",
    title: "Ons Team",
    subtitle:
      "De mensen achter iThemba Kuluntu — gemeenschapsleiders, leerkrachten, zorgverleners en bouwers, zij aan zij in Cwebeni.",
    intro:
      "Lokale leiding draagt elk project. Vrijwilligers uit Duitsland, Nederland en Zwitserland werken mee aan het team.",
    location: "Cwebeni · Port St Johns · Eastern Cape",
    back: "Terug naar Over",
    sectionEyebrow: "Onze mensen",
    sectionHeading: "Maak kennis met het team",
    sectionLead:
      "Van ECD-leerkrachten tot watertechnici, bouwers en gemeenschapszorgers — zij doen het dagelijkse werk.",
    ctaHeading: "Steun het werk van het team",
    ctaDonate: "Maandelijks doneren",
    ctaContact: "Neem contact op",
    photoPending: "Foto volgt binnenkort",
  },
};

/* ---------- Team roster (source of truth: /public/content/team) ---------- */

type Role = { en: string; de: string; nl: string };
type Member = {
  id: number;
  firstName: string;
  role: Role;
  photo: string | null;
};

const PHOTO_BASE = "/assets/photos/team";

const TEAM: Member[] = [
  {
    id: 1,
    firstName: "Lathi",
    role: {
      en: "Director — Community Leadership & Project Development",
      de: "Direktorin — Gemeindeleitung & Projektentwicklung",
      nl: "Directeur — Gemeenschapsleiding & projectontwikkeling",
    },
    photo: `${PHOTO_BASE}/team-lathi-01.jpg`,
  },
  {
    id: 2,
    firstName: "Anke",
    role: {
      en: "Director — Project Planning, Communications & International Relations",
      de: "Direktorin — Projektplanung, Kommunikation & internationale Beziehungen (Ehrenamt)",
      nl: "Directeur — Projectplanning, communicatie & internationale relaties",
    },
    photo: `${PHOTO_BASE}/team-anke-02.jpg`,
  },
  {
    id: 3,
    firstName: "Linda",
    role: {
      en: "Community Liaison — ECD Centre & PureFlow Amanzi",
      de: "Community Liaison — ECD Centre & PureFlow Amanzi",
      nl: "Contactpersoon gemeenschap — ECD Centre & PureFlow Amanzi",
    },
    photo: `${PHOTO_BASE}/team-linda-03.jpg`,
  },
  {
    id: 4,
    firstName: "Sasa",
    role: {
      en: "ECD Teacher & PureFlow Amanzi Team Member",
      de: "ECD-Lehrerin & Teammitglied PureFlow Amanzi",
      nl: "ECD-leerkracht & teamlid PureFlow Amanzi",
    },
    photo: `${PHOTO_BASE}/team-sasa-04.jpg`,
  },
  {
    id: 5,
    firstName: "TJ",
    role: {
      en: "Programme Lead — Safe Water & Climate Resilience",
      de: "Programmleitung — Sicheres Wasser & Klimaresilienz",
      nl: "Programmacoördinator — Veilig water & klimaatbestendigheid",
    },
    photo: null,
  },
  {
    id: 6,
    firstName: "Nosi",
    role: { en: "ECD Teacher", de: "ECD-Lehrerin", nl: "ECD-leerkracht" },
    photo: `${PHOTO_BASE}/team-nosi-06.jpg`,
  },
  {
    id: 7,
    firstName: "Fikiswa",
    role: {
      en: "Social Worker & ECD Teacher",
      de: "Sozialarbeiterin & ECD-Lehrerin",
      nl: "Maatschappelijk werker & ECD-leerkracht",
    },
    photo: `${PHOTO_BASE}/team-fikiswa-07.jpg`,
  },
  {
    id: 8,
    firstName: "Veliswa",
    role: { en: "ECD Practitioner", de: "ECD-Fachkraft", nl: "ECD-medewerker" },
    photo: null,
  },
  {
    id: 9,
    firstName: "Nokulunga",
    role: {
      en: "Food Security Team & ECD Centre Cook",
      de: "Team Ernährungssicherheit & Köchin im ECD Centre",
      nl: "Team voedselzekerheid & kok bij het ECD Centre",
    },
    photo: `${PHOTO_BASE}/team-nokulunga-09.jpg`,
  },
  {
    id: 10,
    firstName: "Nomsa",
    role: {
      en: "Food Security Team & ECD Centre Cook",
      de: "Team Ernährungssicherheit & Köchin im ECD Centre",
      nl: "Team voedselzekerheid & kok bij het ECD Centre",
    },
    photo: `${PHOTO_BASE}/team-nomsa-10.jpg`,
  },
  {
    id: 11,
    firstName: "Lindiwe",
    role: {
      en: "Community Care & Pondo Dogs Team Member",
      de: "Gemeindefürsorge & Teammitglied Pondo Dogs",
      nl: "Gemeenschapszorg & teamlid Pondo Dogs",
    },
    photo: `${PHOTO_BASE}/team-lindiwe-11.jpg`,
  },
  {
    id: 12,
    firstName: "Nomvelo",
    role: {
      en: "Community Care & Pondo Dogs Team Member",
      de: "Gemeindefürsorge & Teammitglied Pondo Dogs",
      nl: "Gemeenschapszorg & teamlid Pondo Dogs",
    },
    photo: null,
  },
  {
    id: 13,
    firstName: "John",
    role: {
      en: "Infrastructure & Building Team",
      de: "Infrastruktur- & Bauteam",
      nl: "Infrastructuur- & bouwteam",
    },
    photo: `${PHOTO_BASE}/team-john-13.jpg`,
  },
  {
    id: 14,
    firstName: "Mvikele",
    role: {
      en: "Community & Traditional Leadership Liaison",
      de: "Verbindung zu Gemeinschaft & traditionellen Führungspersonen",
      nl: "Verbinding met gemeenschap & traditionele leiders",
    },
    photo: `${PHOTO_BASE}/team-mvikele-14.jpg`,
  },
  {
    id: 15,
    firstName: "Mandisi",
    role: {
      en: "Pondo Dogs Team & Food Rollout Coordination",
      de: "Teammitglied Pondo Dogs & Koordination von Lebensmittelverteilungen",
      nl: "Teamlid Pondo Dogs & coördinatie voedseluitdelingen",
    },
    photo: `${PHOTO_BASE}/team-mandisi-15.jpg`,
  },
  {
    id: 16,
    firstName: "Skiddy",
    role: {
      en: "Infrastructure Maintenance & Building Team",
      de: "Instandhaltung & Bauteam",
      nl: "Onderhoud & bouwteam",
    },
    photo: `${PHOTO_BASE}/team-skiddy-16.jpg`,
  },
  {
    id: 17,
    firstName: "Sizonke",
    role: {
      en: "Infrastructure Maintenance & Building Lead",
      de: "Leitung Instandhaltung & Bauteam",
      nl: "Leiding onderhoud & bouwteam",
    },
    photo: null,
  },
  {
    id: 18,
    firstName: "Adam",
    role: {
      en: "Infrastructure & Building Team",
      de: "Infrastruktur- & Bauteam",
      nl: "Infrastructuur- & bouwteam",
    },
    photo: null,
  },
  {
    id: 19,
    firstName: "Ernest",
    role: {
      en: "Infrastructure & Building Team",
      de: "Infrastruktur- & Bauteam",
      nl: "Infrastructuur- & bouwteam",
    },
    photo: null,
  },
  {
    id: 20,
    firstName: "Simon",
    role: {
      en: "Infrastructure & Building Team",
      de: "Infrastruktur- & Bauteam",
      nl: "Infrastructuur- & bouwteam",
    },
    photo: null,
  },
  {
    id: 21,
    firstName: "Hannah",
    role: {
      en: "Volunteer — Education, Social Work & Switzerland Outreach",
      de: "Ehrenamt — Bildung, Sozialarbeit & Netzwerk Schweiz",
      nl: "Vrijwilliger — onderwijs, maatschappelijk werk & netwerk Zwitserland",
    },
    photo: `${PHOTO_BASE}/team-hannah-21.jpg`,
  },
  {
    id: 22,
    firstName: "Mehret",
    role: {
      en: "Volunteer — Community Support & Netherlands Outreach",
      de: "Ehrenamt — Unterstützung vor Ort & Netzwerk Niederlande",
      nl: "Vrijwilliger — ondersteuning ter plaatse & netwerk Nederland",
    },
    photo: `${PHOTO_BASE}/team-mehret-22.jpg`,
  },
];

/* ---------- Helpers ---------- */

const HERO_VIDEO = "/assets/videos/team/team-hero.mp4";
const HERO_POSTER = "/assets/photos/team/team-hero-poster.jpg";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function pickHero(lang: Lang): HeroCopy {
  return HERO[lang] ?? HERO.en;
}

/* ---------- Page ---------- */

function AboutTeam() {
  const { lang } = useLang();
  const c = pickHero(lang);

  return (
    <>
      <TeamHero c={c} />
      <TeamGrid c={c} lang={lang} />
      <ClosingCTA c={c} />
    </>
  );
}

/* ---------- Hero ---------- */

function TeamHero({ c }: { c: HeroCopy }) {
  const reduced = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
            label="iThemba Kuluntu team — community hero"
            className="h-full w-full"
            rounded="rounded-none"
            tone="earth"
            showMissingBadge={false}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/85 via-[var(--ithemba-blue-dark)]/70 to-[var(--ithemba-blue)]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>

      {!showVideo && (
        <div className="pointer-events-none absolute right-4 top-4 z-10 hidden items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 ring-1 ring-white/15 backdrop-blur md:inline-flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ithemba-yellow)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ithemba-yellow)]" />
          </span>
          Hero video placeholder · ready for real team video
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 md:pb-28 md:pt-28 lg:min-h-[68vh] lg:px-8">
        <div className="relative max-w-3xl text-white">
          <Link
            to="/about"
            className="inline-flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {c.back}
          </Link>
          <div className="mt-8 hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm flex items-center gap-2">
            <Sparkles className="h-5 w-5" aria-hidden /> {c.eyebrow}
          </div>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            {c.title}
          </h1>
          <svg className="mt-4 block w-48 md:w-72" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
            <path d="M2,8 C50,2 120,14 198,6" stroke="var(--ithemba-yellow)" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/95 md:text-xl">{c.subtitle}</p>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">{c.intro}</p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur ring-1 ring-white/20">
            <MapPin className="h-3.5 w-3.5 text-[var(--ithemba-yellow)]" />
            {c.location}
          </div>
        </div>
      </div>

      <svg className="block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--background)" />
      </svg>
    </section>
  );
}

/* ---------- Team Grid ---------- */

function TeamGrid({ c, lang }: { c: HeroCopy; lang: Lang }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 lg:px-8">
      {/* decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[var(--ithemba-yellow)]/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-[var(--ithemba-blue)]/15 blur-3xl" />

      <div className="relative max-w-2xl">
        <div className="hand-eyebrow flex items-center gap-2">
          <Users className="h-4 w-4" /> {c.sectionEyebrow}
        </div>
        <h2 className="mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
          {c.sectionHeading}
        </h2>
        <p className="mt-4 text-foreground/80 leading-relaxed">{c.sectionLead}</p>
      </div>

      <div className="relative mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:gap-y-16 lg:grid-cols-3 xl:grid-cols-4">
        {TEAM.map((m, i) => (
          <TeamCard key={m.id} member={m} lang={lang} index={i} photoPending={c.photoPending} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Card ---------- */

function TeamCard({
  member,
  lang,
  index,
  photoPending,
}: {
  member: Member;
  lang: Lang;
  index: number;
  photoPending: string;
}) {
  // alternate subtle backdrop tones
  const palette = [
    "bg-[var(--ithemba-yellow)]/30",
    "bg-[var(--ithemba-blue)]/20",
    "bg-[var(--ithemba-cream)]",
    "bg-[var(--ithemba-yellow)]/20",
  ];
  const blobColor = palette[index % palette.length];
  const offset = index % 2 === 0 ? "md:-translate-y-2" : "md:translate-y-3";

  const initial = member.firstName.charAt(0);
  const role = member.role[lang] ?? member.role.en;

  return (
    <article className={`group relative flex flex-col items-center text-center ${offset} transition-transform`}>
      {/* Portrait with organic backdrop */}
      <div className="relative h-44 w-44 sm:h-48 sm:w-48">
        {/* organic blob behind */}
        <span
          aria-hidden
          className={`absolute inset-0 -z-10 ${blobColor} blob-${index % 3 + 1}`}
          style={{
            transform: `rotate(${(index * 23) % 360}deg)`,
            borderRadius:
              index % 3 === 0
                ? "62% 38% 55% 45% / 50% 60% 40% 50%"
                : index % 3 === 1
                ? "45% 55% 65% 35% / 55% 45% 55% 45%"
                : "50% 50% 40% 60% / 60% 40% 60% 40%",
          }}
        />
        {/* small accent dot */}
        <span
          aria-hidden
          className="absolute -right-2 -top-1 h-3 w-3 rounded-full bg-[var(--ithemba-yellow)] shadow-sm"
        />
        <span
          aria-hidden
          className="absolute -left-3 bottom-4 h-2 w-2 rounded-full bg-[var(--ithemba-blue)]/60"
        />

        <div className="relative h-full w-full overflow-hidden rounded-full shadow-[0_18px_40px_-18px_rgba(11,31,102,0.35)] ring-4 ring-white">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.firstName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PhotoPending initial={initial} label={photoPending} />
          )}
        </div>
      </div>

      <h3 className="mt-5 font-display text-xl font-bold text-[var(--ithemba-blue-dark)]">
        {member.firstName}
      </h3>
      <p className="mt-1.5 max-w-[18rem] text-sm leading-snug text-foreground/75">{role}</p>
    </article>
  );
}

function PhotoPending({ initial, label }: { initial: string; label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[var(--ithemba-cream)] via-white to-[var(--ithemba-yellow)]/20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ithemba-blue-dark)]/90 font-display text-2xl font-bold text-white">
        {initial}
      </div>
      <span className="mt-3 px-2 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--ithemba-blue-dark)]/70">
        {label}
      </span>
    </div>
  );
}

/* ---------- Closing CTA ---------- */

function ClosingCTA({ c }: { c: HeroCopy }) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--ithemba-blue-deepest)] text-white">
      <div className="absolute right-[-8rem] top-[-8rem] h-[28rem] w-[28rem] sun-glow" aria-hidden />
      <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20 lg:px-8">
        <h2 className="font-display text-2xl font-bold md:text-3xl">{c.ctaHeading}</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/donate">
            <Button
              size="lg"
              className="rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold"
            >
              <Heart className="mr-2 h-4 w-4 fill-current" /> {c.ctaDonate}
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-white/0 text-white hover:bg-white/10"
            >
              {c.ctaContact}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
