export const PRODUCTION_ORIGIN = "https://ithembakuluntu.org";

export const DEFAULT_SOCIAL_IMAGE = `${PRODUCTION_ORIGIN}/assets/photos/home/hero-image.png`;
export const PUREFLOW_SOCIAL_IMAGE = `${PRODUCTION_ORIGIN}/assets/photos/projects/pureflow/pureflow-step-04-system-shifts.jpg`;

const DEFAULT_IMAGE_ALT = "iThemba Kuluntu community work in South Africa";

type Breadcrumb = { name: string; path: string };

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  breadcrumbs?: Breadcrumb[];
  jsonLd?: Record<string, unknown>[];
  robots?: string;
};

const absoluteUrl = (path: string) =>
  path === "/" ? `${PRODUCTION_ORIGIN}/` : `${PRODUCTION_ORIGIN}${path}`;

export function createSeoHead({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  breadcrumbs,
  jsonLd = [],
  robots,
}: SeoOptions) {
  const url = absoluteUrl(path);
  const structuredData = [...jsonLd];

  if (breadcrumbs) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    });
  }

  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(robots ? [{ name: "robots", content: robots }] : []),
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: structuredData.map((data) => ({
      type: "application/ld+json",
      children: JSON.stringify(data),
    })),
  };
}

export const HOME_STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "iThemba Kuluntu",
    alternateName: "ithembakuluntu.org",
    url: `${PRODUCTION_ORIGIN}/`,
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "iThemba Kuluntu",
    url: `${PRODUCTION_ORIGIN}/`,
    logo: `${PRODUCTION_ORIGIN}/assets/logos/ithemba-round-color.png`,
    sameAs: [
      "https://www.instagram.com/ithemba.kuluntu/",
      "https://web.facebook.com/people/IThemba-Kuluntu-e-V-NPO/61555304087486/",
      "https://www.tiktok.com/@ithemba.kuluntu",
      "https://www.youtube.com/@iThembaKuluntu",
    ],
  },
];
