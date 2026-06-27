import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  PlayCircle,
  Newspaper,
  Tv,
  Youtube,
  Mail,
  Handshake,
  Camera,
  Droplets,
} from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { Button } from "@/components/ui/button";
import { assets } from "@/data/assets";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media and Stories — iThemba Kuluntu" },
      {
        name: "description",
        content:
          "News coverage, broadcast features, articles and project videos from iThemba Kuluntu's work in rural South Africa.",
      },
      { property: "og:title", content: "Media and Stories — iThemba Kuluntu" },
      {
        property: "og:description",
        content:
          "News coverage, broadcast features, articles and project videos from iThemba Kuluntu's work in rural South Africa.",
      },
      { property: "og:image", content: assets.photos.home.impact },
    ],
  }),
  component: MediaPage,
});

/* ---------- design tokens ---------- */
const blueDeep = "var(--ithemba-blue-deepest, #0b2545)";
const blue = "var(--ithemba-blue, #1d4e89)";
const cream = "var(--ithemba-cream, #fdf7ed)";
const yellow = "var(--ithemba-yellow, #f5c64a)";
const script = '"Caveat", "Kalam", cursive';

/* ---------- helpers ---------- */
function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function ytThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/* ---------- wave divider ---------- */
function Wave({ from, to }: { from: string; to: string }) {
  return (
    <div aria-hidden className="relative -mt-px" style={{ background: from }}>
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-[44px] w-full md:h-[64px]"
      >
        <path d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,50 L1440,90 L0,90 Z" fill={to} />
      </svg>
    </div>
  );
}

/* ---------- data ---------- */
type ArticleItem = { date?: string; publisher: string; title: string; url: string };
type VideoItem = { date?: string; publisher: string; title?: string; url: string };

const FEATURED = [
  {
    kind: "article" as const,
    publisher: "News24",
    title:
      "Let it flow: Simple fix dissolves dirty water worries for 3,000 Eastern Cape homes",
    tag: "PureFlow Amanzi",
    url: "https://www.news24.com/southafrica/good-news/let-it-flow-simple-fix-dissolves-dirty-water-worries-for-3-000-eastern-cape-homes-20260317-0507",
  },
  {
    kind: "video" as const,
    publisher: "SABC News",
    title: "PureFlow Amanzi — Safe Water feature",
    tag: "PureFlow Amanzi",
    url: "https://www.youtube.com/watch?v=37fZKpgm37U",
  },
  {
    kind: "article" as const,
    publisher: "UNICEF South Africa",
    title:
      "23 per cent of children in South Africa live in severe child food poverty",
    tag: "Food security",
    url: "https://www.unicef.org/southafrica/press-releases/23-cent-children-south-africa-live-severe-child-food-poverty",
  },
  {
    kind: "article" as const,
    publisher: "GoodThingsGuy",
    title: "Soup kitchen serves Eastern Cape children the only meal they’ll eat that day",
    tag: "Food security",
    url: "https://www.goodthingsguy.com/people/soup-kitchen-serves-eastern-cape-children-the-only-meal-theyll-eat-that-day/",
  },
];

const BROADCAST: VideoItem[] = [
  { date: "30/08/2024", publisher: "SABC News", url: "https://youtu.be/RUL65vhRHcU?si=G78S_3N1ftWFduMu" },
  { date: "07/07/2024", publisher: "UNICEF", url: "https://youtu.be/7Dap-fN2bB4?si=qLCDW2Asa7_pFqag" },
  { date: "28/05/2024", publisher: "Sky News", url: "https://youtu.be/36M24FyKU3s?si=J8uJHBo_jhccW1Xt" },
  { date: "04/04/2024", publisher: "eNCA Checkpoint", url: "https://www.youtube.com/watch?v=FBawDRtC84c" },
  { date: "11/03/2024", publisher: "Eyewitness News", url: "https://youtu.be/EHyv_A8ZDBo?si=VGy8710c8T2pMN1p" },
  { date: "06/03/2024", publisher: "SABC News — Cutting Edge", url: "https://youtu.be/RsVHZMGVkjg?si=ottiig8DLgNJb2QX" },
  { date: "03/03/2024", publisher: "Newzroom Afrika", url: "https://youtu.be/N1wkCt7oOGA?si=6PtLv0VhJLwPnkfF" },
  { date: "15/01/2024", publisher: "eNCA / Gift of the Givers", url: "https://youtu.be/s4jjVOtPEE0?si=S3JEGukxDL3qHidT" },
  { date: "15/01/2024", publisher: "eNCA", url: "https://youtu.be/sYrwd8YME-g?si=ws8iz1fUP6_5uHE0" },
  { date: "26/12/2023", publisher: "SABC News", url: "https://youtu.be/730f8eQEHg8?si=Vc9N6Dwjrm0T3r9f" },
];

const ARTICLES: ArticleItem[] = [
  { date: "06/06/2024", publisher: "UNICEF South Africa", title: "23 per cent of children in South Africa live in severe child food poverty", url: "https://www.unicef.org/southafrica/press-releases/23-cent-children-south-africa-live-severe-child-food-poverty" },
  { date: "27/05/2024", publisher: "Daily Dispatch", title: "Living conditions grim for Eastern Cape residents", url: "https://www.dispatchlive.co.za/amp/news/2024-05-27-living-conditions-grim-for-eastern-cape-residents/" },
  { date: "17/05/2024", publisher: "GoodThingsGuy", title: "Soup kitchen serves Eastern Cape children the only meal they’ll eat that day", url: "https://www.goodthingsguy.com/people/soup-kitchen-serves-eastern-cape-children-the-only-meal-theyll-eat-that-day/" },
  { date: "19/03/2024", publisher: "Daily Maverick", title: "Shared gumboots, paint buckets and a long walk — how Eastern Cape women collect water", url: "https://www.dailymaverick.co.za/article/2024-03-19-shared-gumboots-paint-buckets-and-a-long-walk-how-eastern-cape-women-collect-water/" },
  { date: "11/03/2024", publisher: "South African Human Rights Commission", title: "Media Advisory: SAHRC Eastern Cape to conduct monitoring in the Joe Gcabi District Municipality and stakeholder engagement in Cwebeni", url: "https://www.sahrc.org.za/index.php/sahrc-media/news-2/item/3937-media-advisory-sahrc-eastern-cape-to-conduct-monitoring-in-the-joe-gcabi-district-municipality-and-stakeholder-engagement-in-cwebeni" },
  { date: "23/02/2024", publisher: "Daily Dispatch", title: "New NPO gives hope to struggling Cwebeni families", url: "https://www.dailydispatch.co.za/news/2024-02-23-new-npo-gives-hope-to-struggling-cwebeni-families/" },
  { date: "12/02/2024", publisher: "Daily Dispatch", title: "MEC lauds partnerships that help fight social ills in Eastern Cape", url: "https://www.dailydispatch.co.za/politics/2024-02-12-mec-lauds-partnerships-that-help-fight-social-ills-in-eastern-cape/" },
  { date: "09/02/2024", publisher: "Daily Maverick", title: "Poverty-stricken Port St Johns gogo dead at 91 after endless wait for housing, service delivery", url: "https://www.dailymaverick.co.za/article/2024-02-09-poverty-stricken-port-st-johns-gogo-dead-at-91-after-endless-wait-for-housing-service-delivery/" },
  { date: "07/02/2024", publisher: "Daily Dispatch", title: "Wait for RDP house proved too long for 92-year-old Cwebeni villager", url: "https://www.dailydispatch.co.za/news/2024-02-07-wait-for-rdp-house-proved-too-long-for-92-year-old-cwebeni-villager/" },
  { date: "06/02/2024", publisher: "Daily Dispatch", title: "Human rights body wants answers on dire state of roads", url: "https://www.dailydispatch.co.za/news/2024-02-06-human-rights-body-wants-answers-on-dire-state-of-roads/" },
  { publisher: "South African Human Rights Commission", title: "Human Rights Commission wants answers on dire state of roads", url: "https://www.sahrc.org.za/index.php/sahrc-media/news/item/3930-human-rights-commission-wants-answers-on-dire-state-of-roads" },
  { date: "25/01/2024", publisher: "Daily Dispatch", title: "Cry for help: Starving Eastern Cape families appeal to president", url: "https://www.dailydispatch.co.za/news/2024-01-25-cry-for-help-starving-eastern-cape-families-appeal-to-president/" },
  { date: "19/12/2023", publisher: "Daily Dispatch", title: "A happy Christmas Day for poor Port St Johns villagers thanks to concerned citizens", url: "https://www.dailydispatch.co.za/news/2023-12-19-a-happy-christmas-day-for-poor-port-st-johns-villagers-thanks-to-concerned-citizens/" },
  { date: "16/12/2023", publisher: "Daily Dispatch", title: "Rural villagers at Port St Johns facing a bleak Christmas", url: "https://www.dailydispatch.co.za/news/2023-12-16-rural-villagers-at-port-st-johns-facing-a-bleak-christmas/" },
  { date: "20/11/2023", publisher: "Daily Dispatch", title: "We are the definition of poor", url: "https://www.dailydispatch.co.za/news/2023-11-20-we-are-the-definition-of-poor/" },
];

const PUREFLOW_STORIES: VideoItem[] = [
  { publisher: "PureFlow Amanzi", title: "Proposal / programme video", url: "https://www.youtube.com/watch?v=fD-Yuy00SiE" },
  { publisher: "PureFlow Amanzi", title: "Overview", url: "https://www.youtube.com/watch?v=IoRHLU5Cm7o" },
  { publisher: "PureFlow Amanzi", title: "Teaching Water Safety in ECD", url: "https://www.youtube.com/watch?v=ZsCUcyV9MTg" },
  { publisher: "PureFlow Amanzi", title: "Little Water Champions", url: "https://www.youtube.com/watch?v=7Et-8e7q_uE" },
  { publisher: "PureFlow Amanzi", title: "Beyond the Classroom", url: "https://www.youtube.com/watch?v=0Y4YB7WniTw" },
  { publisher: "PureFlow Amanzi", title: "Partnership model in practice", url: "https://www.youtube.com/watch?v=MJAD9N-oW3M" },
];

const PUREFLOW_GUIDES: VideoItem[] = [
  { publisher: "PureFlow Amanzi", title: "How to use", url: "https://www.youtube.com/watch?v=z4AekP8-Luc" },
  { publisher: "PureFlow Amanzi", title: "How to clean", url: "https://www.youtube.com/watch?v=kz8EPC6FWUc" },
  { publisher: "PureFlow Amanzi", title: "How to assemble", url: "https://www.youtube.com/watch?v=Ad3enwiOVI0" },
];

/* ---------- copy ---------- */
type Lang = "en" | "de" | "nl";
type Copy = {
  hero: { eyebrow: string; title: string; text: string };
  filters: { all: string; featured: string; broadcast: string; articles: string; pureflow: string };
  featured: { eyebrow: string; title: string; read: string; watch: string };
  broadcast: { eyebrow: string; title: string; watch: string };
  articles: { eyebrow: string; title: string; read: string };
  pureflow: { eyebrow: string; title: string; guides: string; watch: string };
  channel: { eyebrow: string; title: string; text: string; button: string };
  press: { eyebrow: string; title: string; text: string; button: string };
  cta: { eyebrow: string; title: string; text: string; projects: string; partner: string };
  type: { article: string; video: string; broadcast: string; feature: string };
};

const COPY: Record<Lang, Copy> = {
  en: {
    hero: {
      eyebrow: "Media",
      title: "Media and Stories",
      text: "News coverage, video features and stories from iThemba Kuluntu’s work in rural South Africa.",
    },
    filters: { all: "All", featured: "Featured", broadcast: "Broadcast", articles: "Articles", pureflow: "PureFlow Amanzi" },
    featured: { eyebrow: "Featured", title: "Recent highlights", read: "Read article", watch: "Watch video" },
    broadcast: { eyebrow: "On screen", title: "Broadcast and video features", watch: "Watch video" },
    articles: { eyebrow: "In the news", title: "Newspaper and online articles", read: "Read article" },
    pureflow: { eyebrow: "Project videos", title: "PureFlow Amanzi in action", guides: "Guides", watch: "Watch video" },
    channel: {
      eyebrow: "Follow along",
      title: "Watch more from iThemba Kuluntu",
      text: "Our YouTube channel brings together project videos, field updates and stories from the communities we work with.",
      button: "Visit our YouTube channel",
    },
    press: {
      eyebrow: "Press contact",
      title: "Media enquiries",
      text: "For interviews, media enquiries or further information about iThemba Kuluntu’s work, please contact us.",
      button: "Contact us",
    },
    cta: {
      eyebrow: "Stories of change",
      title: "See the work behind the headlines",
      text: "Every article, video and interview points back to the same work: practical care, local trust and communities building stronger futures.",
      projects: "Explore Our Projects",
      partner: "Partner With Us",
    },
    type: { article: "Article", video: "Video", broadcast: "Broadcast", feature: "Feature" },
  },
  de: {
    hero: {
      eyebrow: "Medien",
      title: "Medien und Geschichten",
      text: "Berichte, Videobeiträge und Geschichten aus der Arbeit von iThemba Kuluntu im ländlichen Südafrika.",
    },
    filters: { all: "Alle", featured: "Im Fokus", broadcast: "TV", articles: "Artikel", pureflow: "PureFlow Amanzi" },
    featured: { eyebrow: "Im Fokus", title: "Aktuelle Highlights", read: "Artikel lesen", watch: "Video ansehen" },
    broadcast: { eyebrow: "Im Bild", title: "TV- und Videobeiträge", watch: "Video ansehen" },
    articles: { eyebrow: "In den Medien", title: "Zeitungs- und Onlineartikel", read: "Artikel lesen" },
    pureflow: { eyebrow: "Projektvideos", title: "PureFlow Amanzi im Einsatz", guides: "Anleitungen", watch: "Video ansehen" },
    channel: {
      eyebrow: "Dranbleiben",
      title: "Mehr von iThemba Kuluntu ansehen",
      text: "Unser YouTube-Kanal bündelt Projektvideos, Eindrücke aus dem Feld und Geschichten aus den Gemeinschaften, mit denen wir arbeiten.",
      button: "YouTube-Kanal besuchen",
    },
    press: {
      eyebrow: "Pressekontakt",
      title: "Medienanfragen",
      text: "Für Interviews, Medienanfragen oder weitere Informationen zur Arbeit von iThemba Kuluntu kontaktieren Sie uns gerne.",
      button: "Kontakt aufnehmen",
    },
    cta: {
      eyebrow: "Geschichten des Wandels",
      title: "Die Arbeit hinter den Schlagzeilen sehen",
      text: "Jeder Artikel, jedes Video und jedes Interview verweist auf dieselbe Arbeit: praktische Fürsorge, lokales Vertrauen und Gemeinschaften, die eine stärkere Zukunft aufbauen.",
      projects: "Unsere Projekte entdecken",
      partner: "Partner werden",
    },
    type: { article: "Artikel", video: "Video", broadcast: "TV", feature: "Bericht" },
  },
  nl: {
    hero: {
      eyebrow: "Media",
      title: "Media en verhalen",
      text: "Nieuwsberichten, videoreportages en verhalen uit het werk van iThemba Kuluntu in landelijk Zuid-Afrika.",
    },
    filters: { all: "Alles", featured: "Uitgelicht", broadcast: "Broadcast", articles: "Artikelen", pureflow: "PureFlow Amanzi" },
    featured: { eyebrow: "Uitgelicht", title: "Recente hoogtepunten", read: "Artikel lezen", watch: "Video bekijken" },
    broadcast: { eyebrow: "In beeld", title: "Broadcast- en videoreportages", watch: "Video bekijken" },
    articles: { eyebrow: "In het nieuws", title: "Kranten- en onlineartikelen", read: "Artikel lezen" },
    pureflow: { eyebrow: "Projectvideo’s", title: "PureFlow Amanzi in actie", guides: "Handleidingen", watch: "Video bekijken" },
    channel: {
      eyebrow: "Volg ons werk",
      title: "Bekijk meer van iThemba Kuluntu",
      text: "Ons YouTube-kanaal brengt projectvideo’s, updates uit het veld en verhalen uit de gemeenschappen waarmee we werken samen.",
      button: "Bezoek ons YouTube-kanaal",
    },
    press: {
      eyebrow: "Perscontact",
      title: "Media-aanvragen",
      text: "Voor interviews, media-aanvragen of meer informatie over het werk van iThemba Kuluntu kunt u contact met ons opnemen.",
      button: "Neem contact op",
    },
    cta: {
      eyebrow: "Verhalen van verandering",
      title: "Bekijk het werk achter de headlines",
      text: "Elk artikel, elke video en elk interview verwijst naar hetzelfde werk: praktische zorg, lokaal vertrouwen en gemeenschappen die bouwen aan een sterkere toekomst.",
      projects: "Ontdek onze projecten",
      partner: "Word partner",
    },
    type: { article: "Artikel", video: "Video", broadcast: "Broadcast", feature: "Reportage" },
  },
};

/* ---------- shared bits ---------- */
function TypeBadge({ label, tone = "blue" }: { label: string; tone?: "blue" | "yellow" }) {
  const styles =
    tone === "yellow"
      ? { background: yellow, color: "#0b2545" }
      : { background: blue, color: "#fff" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm"
      style={styles}
    >
      {label}
    </span>
  );
}

function ExternalA({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

/* ---------- cards ---------- */
function FeaturedCard({
  item,
  c,
}: {
  item: (typeof FEATURED)[number];
  c: Copy;
}) {
  const isVideo = item.kind === "video";
  const yt = isVideo ? getYouTubeId(item.url) : null;
  const thumb = yt ? ytThumb(yt) : assets.photos.media.placeholder;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_14px_50px_-18px_rgb(15_42_140/0.28)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-xl">
      <ExternalA href={item.url} ariaLabel={item.title} className="relative block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[color:var(--ithemba-blue-deepest,#0b2545)]/10">
          <img
            src={thumb}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = assets.photos.media.placeholder;
            }}
          />
          {isVideo && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-90 transition group-hover:opacity-100">
              <PlayCircle className="h-16 w-16 text-white drop-shadow-lg" />
            </span>
          )}
          <span className="absolute left-3 top-3">
            <TypeBadge
              label={isVideo ? c.type.video : c.type.article}
              tone={isVideo ? "yellow" : "blue"}
            />
          </span>
        </div>
      </ExternalA>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--ithemba-blue,#1d4e89)]">
          <span>{item.publisher}</span>
          <span className="h-1 w-1 rounded-full bg-[color:var(--ithemba-blue,#1d4e89)]/40" />
          <span className="text-foreground/60">{item.tag}</span>
        </div>
        <h3 className="font-display text-xl font-bold leading-snug text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-2xl">
          {item.title}
        </h3>
        <div className="mt-auto pt-2">
          <Button asChild size="sm" className="rounded-full">
            <ExternalA href={item.url}>
              {isVideo ? c.featured.watch : c.featured.read}
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </ExternalA>
          </Button>
        </div>
      </div>
    </article>
  );
}

function VideoCard({
  item,
  watchLabel,
  videoLabel,
  dark = false,
}: {
  item: VideoItem;
  watchLabel: string;
  videoLabel: string;
  dark?: boolean;
}) {
  const id = getYouTubeId(item.url);
  const thumb = id ? ytThumb(id) : assets.photos.media.placeholder;
  return (
    <article
      className={
        "group flex h-full flex-col overflow-hidden rounded-2xl ring-1 transition hover:-translate-y-0.5 " +
        (dark
          ? "bg-white/5 ring-white/15 hover:bg-white/10"
          : "bg-white ring-black/5 shadow-[0_10px_40px_-18px_rgb(15_42_140/0.25)] hover:shadow-lg")
      }
    >
      <ExternalA href={item.url} ariaLabel={item.title ?? item.publisher} className="relative block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/20">
          <img
            src={thumb}
            alt={item.title ?? `${item.publisher} video`}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = assets.photos.media.placeholder;
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
            <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" />
          </span>
          <span className="absolute left-3 top-3">
            <TypeBadge label={videoLabel} tone="yellow" />
          </span>
        </div>
      </ExternalA>
      <div className={"flex flex-1 flex-col gap-2 p-4 " + (dark ? "text-white" : "")}>
        <div
          className={
            "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider " +
            (dark ? "text-[color:var(--ithemba-yellow,#f5c64a)]" : "text-[color:var(--ithemba-blue,#1d4e89)]")
          }
        >
          {item.date && <span>{item.date}</span>}
          {item.date && <span className={"h-1 w-1 rounded-full " + (dark ? "bg-white/40" : "bg-foreground/30")} />}
          <span>{item.publisher}</span>
        </div>
        {item.title && (
          <h3
            className={
              "font-display text-base font-semibold leading-snug md:text-lg " +
              (dark ? "text-white" : "text-[color:var(--ithemba-blue-deepest,#0b2545)]")
            }
          >
            {item.title}
          </h3>
        )}
        <div className="mt-auto pt-2">
          <Button
            asChild
            size="sm"
            variant={dark ? "outline" : "default"}
            className={
              "rounded-full " +
              (dark
                ? "border-white/60 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                : "")
            }
          >
            <ExternalA href={item.url}>
              {watchLabel}
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </ExternalA>
          </Button>
        </div>
      </div>
    </article>
  );
}

function ArticleRow({ a, label }: { a: ArticleItem; label: string }) {
  return (
    <li className="group flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_6px_24px_-12px_rgb(15_42_140/0.18)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center md:gap-6">
      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--ithemba-blue,#1d4e89)] md:w-56 md:flex-none">
        {a.date && <span className="whitespace-nowrap">{a.date}</span>}
        {a.date && <span className="h-1 w-1 rounded-full bg-[color:var(--ithemba-blue,#1d4e89)]/40" />}
        <span className="truncate">{a.publisher}</span>
      </div>
      <h3 className="flex-1 font-display text-[15px] font-semibold leading-snug text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-base">
        {a.title}
      </h3>
      <div className="md:flex-none">
        <Button asChild size="sm" variant="outline" className="rounded-full">
          <ExternalA href={a.url}>
            {label}
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </ExternalA>
        </Button>
      </div>
    </li>
  );
}

/* ---------- page ---------- */
type Filter = "all" | "featured" | "broadcast" | "articles" | "pureflow";

function MediaPage() {
  const { lang } = useLang();
  const c = COPY[lang];
  const [filter, setFilter] = useState<Filter>("all");

  const show = useMemo(
    () => ({
      featured: filter === "all" || filter === "featured",
      broadcast: filter === "all" || filter === "broadcast",
      articles: filter === "all" || filter === "articles",
      pureflow: filter === "all" || filter === "pureflow",
    }),
    [filter],
  );

  const filters: { id: Filter; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: c.filters.all, icon: <Camera className="h-4 w-4" /> },
    { id: "featured", label: c.filters.featured, icon: <Newspaper className="h-4 w-4" /> },
    { id: "broadcast", label: c.filters.broadcast, icon: <Tv className="h-4 w-4" /> },
    { id: "articles", label: c.filters.articles, icon: <Newspaper className="h-4 w-4" /> },
    { id: "pureflow", label: c.filters.pureflow, icon: <Droplets className="h-4 w-4" /> },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[48vh] min-h-[360px] w-full">
          <img
            src={assets.photos.home.impact}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = assets.photos.about.cwebeni;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b2545]/80 via-[#0b2545]/55 to-[#0b2545]/85" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(60% 80% at 20% 30%, rgba(11,37,69,0.45), transparent 70%)" }}
          />
          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-10 pt-20 md:px-8 md:pb-14">
            <p className="text-2xl md:text-3xl" style={{ color: yellow, fontFamily: script }}>
              {c.hero.eyebrow}
            </p>
            <h1 className="mt-1 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl">
              {c.hero.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">{c.hero.text}</p>
          </div>
        </div>
        <Wave from="rgba(0,0,0,0)" to={cream} />
      </section>

      {/* FILTER BAR */}
      <section style={{ background: cream }}>
        <div className="mx-auto max-w-6xl px-5 pt-5 md:px-8 md:pt-8">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  className={
                    "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition " +
                    (active
                      ? "bg-[color:var(--ithemba-blue-deepest,#0b2545)] text-white shadow-md"
                      : "bg-white text-[color:var(--ithemba-blue-deepest,#0b2545)] ring-1 ring-black/5 hover:bg-white/80")
                  }
                >
                  {f.icon}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {show.featured && (
        <section style={{ background: cream }}>
          <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
            <p className="text-3xl" style={{ color: blue, fontFamily: script }}>
              {c.featured.eyebrow}
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
              {c.featured.title}
            </h2>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {FEATURED.map((item) => (
                <FeaturedCard key={item.url} item={item} c={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {show.featured && show.broadcast && <Wave from={cream} to="#ffffff" />}

      {/* BROADCAST */}
      {show.broadcast && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
            <p className="text-3xl" style={{ color: blue, fontFamily: script }}>
              {c.broadcast.eyebrow}
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
              {c.broadcast.title}
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {BROADCAST.map((v) => (
                <VideoCard key={v.url} item={v} watchLabel={c.broadcast.watch} videoLabel={c.type.broadcast} />
              ))}
            </div>
          </div>
        </section>
      )}

      {show.broadcast && show.articles && <Wave from="#ffffff" to={cream} />}

      {/* ARTICLES */}
      {show.articles && (
        <section style={{ background: cream }}>
          <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
            <p className="text-3xl" style={{ color: blue, fontFamily: script }}>
              {c.articles.eyebrow}
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
              {c.articles.title}
            </h2>
            <ul className="mt-7 flex flex-col gap-3">
              {ARTICLES.map((a) => (
                <ArticleRow key={a.url} a={a} label={c.articles.read} />
              ))}
            </ul>
          </div>
        </section>
      )}

      {show.articles && show.pureflow && <Wave from={cream} to={blueDeep} />}

      {/* PUREFLOW VIDEOS */}
      {show.pureflow && (
        <section style={{ background: blueDeep }} className="relative text-white">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 50% at 20% 20%, rgba(255,255,255,0.4), transparent 70%), radial-gradient(50% 40% at 80% 80%, rgba(245,198,74,0.35), transparent 70%)",
              }}
            />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-3xl md:text-4xl" style={{ color: yellow, fontFamily: script }}>
              {c.pureflow.eyebrow}
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">
              {c.pureflow.title}
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PUREFLOW_STORIES.map((v) => (
                <VideoCard key={v.url} item={v} watchLabel={c.pureflow.watch} videoLabel={c.type.feature} dark />
              ))}
            </div>

            <div className="mt-10">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/20" />
                <span
                  className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.18em]"
                  style={{ background: yellow, color: "#0b2545" }}
                >
                  {c.pureflow.guides}
                </span>
                <span className="h-px flex-1 bg-white/20" />
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {PUREFLOW_GUIDES.map((v) => (
                  <VideoCard key={v.url} item={v} watchLabel={c.pureflow.watch} videoLabel={c.pureflow.guides} dark />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Wave from={show.pureflow ? blueDeep : cream} to={cream} />

      {/* YOUTUBE CHANNEL */}
      <section style={{ background: cream }}>
        <div className="mx-auto max-w-5xl px-5 py-10 text-center md:px-8 md:py-14">
          <p className="text-3xl" style={{ color: blue, fontFamily: script }}>
            {c.channel.eyebrow}
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
            {c.channel.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] text-foreground/80 md:text-base">{c.channel.text}</p>
          <div className="mt-5 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#FF0033] text-white hover:bg-[#cc0029]"
            >
              <ExternalA href="https://www.youtube.com/@iThembaKuluntu">
                <Youtube className="mr-2 h-5 w-5" />
                {c.channel.button}
              </ExternalA>
            </Button>
          </div>
        </div>
      </section>

      <Wave from={cream} to="#ffffff" />

      {/* PRESS */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
          <div className="rounded-3xl bg-[color:var(--ithemba-cream,#fdf7ed)] p-6 ring-1 ring-black/5 md:p-10">
            <p className="text-3xl" style={{ color: blue, fontFamily: script }}>
              {c.press.eyebrow}
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-[color:var(--ithemba-blue-deepest,#0b2545)] md:text-4xl">
              {c.press.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] text-foreground/80 md:text-base">{c.press.text}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <a
                href="mailto:info@ithembakuluntu.org"
                className="inline-flex items-center gap-2 font-display text-lg font-semibold text-[color:var(--ithemba-blue-deepest,#0b2545)] underline-offset-4 hover:underline"
              >
                <Mail className="h-5 w-5" />
                info@ithembakuluntu.org
              </a>
              <Button asChild size="lg" className="rounded-full">
                <Link to="/contact">{c.press.button}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Wave from="#ffffff" to={blueDeep} />

      {/* CLOSING CTA */}
      <section className="relative isolate overflow-hidden text-white" style={{ background: blueDeep }}>
        <img
          src={assets.photos.home.impact}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b2545]/85 via-[#0b2545]/80 to-[#0b2545]/95" />
        <div className="relative mx-auto max-w-5xl px-5 py-16 text-center md:px-8 md:py-20">
          <p className="text-3xl md:text-4xl" style={{ color: yellow, fontFamily: script }}>
            {c.cta.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-5xl">{c.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] text-white/85 md:text-base">{c.cta.text}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-[var(--ithemba-yellow,#f5c64a)] text-[#0b2545] hover:bg-[var(--ithemba-yellow,#f5c64a)]/90">
              <Link to="/projects">
                {c.cta.projects}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white/20">
              <Link to="/partners">
                <Handshake className="mr-2 h-5 w-5" />
                {c.cta.partner}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
