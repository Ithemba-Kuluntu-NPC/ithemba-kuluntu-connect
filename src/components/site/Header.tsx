import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Heart, ChevronDown, Instagram, Facebook, Youtube } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageProvider";
import { t } from "@/data/content";
import type { Lang } from "@/data/content";
import { Button } from "@/components/ui/button";
import { SmartLogo } from "./Asset";
import { assets } from "@/data/assets";
import { projects } from "@/data/projects";

type NavLeaf = { to: string; label: { en: string; de: string; nl?: string } };
type NavItem =
  | { kind: "link"; to: string; key: { en: string; de: string; nl?: string } }
  | { kind: "menu"; to: string; key: { en: string; de: string; nl?: string }; items: NavLeaf[] };

const aboutItems: NavLeaf[] = [
  { to: "/about", label: { en: "About Us", de: "Über uns", nl: "Over ons" } },
  { to: "/about/team", label: { en: "Our Team", de: "Unser Team", nl: "Ons team" } },
];

const projectItems: NavLeaf[] = [
  { to: "/projects", label: { en: "All Projects", de: "Alle Projekte", nl: "Alle projecten" } },
  ...projects.map((p) => ({ to: p.path, label: p.title })),
];

const navItems: NavItem[] = [
  { kind: "menu", to: "/about", key: t.nav.about, items: aboutItems },
  { kind: "menu", to: "/projects", key: t.nav.projects, items: projectItems },
  { kind: "link", to: "/media", key: t.nav.media },
  { kind: "link", to: "/partners", key: t.nav.partners },
  { kind: "link", to: "/donate", key: t.nav.donate },
  { kind: "link", to: "/contact", key: t.nav.contact },
];

const languages: Lang[] = ["en", "de", "nl"];

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.79a8.16 8.16 0 0 0 4.77 1.52V6.86a4.85 4.85 0 0 1-1.84-.17z" />
  </svg>
);

const socialLinks = [
  { href: "https://www.instagram.com/ithemba.kuluntu/", label: "Follow iThemba Kuluntu on Instagram", Icon: Instagram },
  { href: "https://web.facebook.com/people/IThemba-Kuluntu-e-V-NPO/61555304087486/", label: "Follow iThemba Kuluntu on Facebook", Icon: Facebook },
  { href: "https://www.tiktok.com/@ithemba.kuluntu", label: "Follow iThemba Kuluntu on TikTok", Icon: TikTokIcon },
  { href: "https://www.youtube.com/@iThembaKuluntu", label: "Follow iThemba Kuluntu on YouTube", Icon: Youtube },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const { lang, setLang, t: tr } = useLang();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Close dropdown on outside click / escape
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenMenu(null); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  // Close on route change
  useEffect(() => { setOpenMenu(null); setOpen(false); setOpenMobileMenu(null); }, [path]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all ${
        scrolled
          ? "border-b border-black/5 bg-white/85 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          : "bg-white/40 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 lg:px-8">
        {/* Logo as home link — full uncropped logo, larger */}
        <Link to="/" className="flex shrink-0 items-center" aria-label="iThemba Kuluntu — home">
          <SmartLogo
            src={assets.logos.ithembaRoundColor}
            alt="iThemba Kuluntu"
            className="h-14 w-auto object-contain md:h-16 lg:h-[72px]"
            fallback={
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ithemba-blue)] font-display text-lg font-bold text-white shadow-sm ring-2 ring-[var(--ithemba-yellow)]/40 md:h-16 md:w-16">
                iK
              </div>
            }
          />
        </Link>

        <nav ref={menuRef} className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const active = path === item.to || (item.to !== "/" && path.startsWith(item.to));
            if (item.kind === "link") {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-[var(--ithemba-blue-dark)]" : "text-foreground/75 hover:text-foreground"
                  }`}
                >
                  {tr(item.key)}
                  {active && <span className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-[var(--ithemba-yellow)]" />}
                </Link>
              );
            }

            const isOpen = openMenu === item.to;
            return (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.to)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu(isOpen ? null : item.to)}
                  className={`relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-[var(--ithemba-blue-dark)]" : "text-foreground/75 hover:text-foreground"
                  }`}
                >
                  {tr(item.key)}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  {active && <span className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-[var(--ithemba-yellow)]" />}
                </button>

                {isOpen && (
                  <div
                    role="menu"
                    className="absolute left-0 top-full z-50 mt-1 min-w-[14rem] overflow-hidden rounded-2xl border border-black/5 bg-white/95 p-2 shadow-xl ring-1 ring-black/5 backdrop-blur"
                  >
                    {item.items.map((leaf) => (
                      <Link
                        key={leaf.to}
                        to={leaf.to}
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-[var(--ithemba-cream)] hover:text-[var(--ithemba-blue-dark)]"
                      >
                        {tr(leaf.label)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-0.5 rounded-full border border-black/10 bg-white/70 p-0.5 text-[11px] font-semibold uppercase tracking-wide"
            role="group"
            aria-label="Language"
          >
            {languages.map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`rounded-full px-2 py-1 transition-colors ${
                  lang === code ? "bg-[var(--ithemba-blue)] text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <Link to="/donate" className="hidden md:block">
            <Button className="rounded-full bg-[var(--ithemba-yellow)] font-semibold text-[var(--ithemba-brown)] shadow-sm hover:bg-[var(--ithemba-yellow)]/95">
              <Heart className="mr-1.5 h-4 w-4 fill-current" />
              {tr(t.cta.donateMonthly)}
            </Button>
          </Link>

          <button
            className="rounded-md p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {navItems.map((item) => {
              if (item.kind === "link") {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-muted"
                  >
                    {tr(item.key)}
                  </Link>
                );
              }
              const isOpen = openMobileMenu === item.to;
              return (
                <div key={item.to} className="border-b border-black/5 last:border-0">
                  <button
                    type="button"
                    onClick={() => setOpenMobileMenu(isOpen ? null : item.to)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium hover:bg-muted"
                  >
                    <span>{tr(item.key)}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="ml-3 mb-2 flex flex-col border-l-2 border-[var(--ithemba-yellow)] pl-3">
                      {item.items.map((leaf) => (
                        <Link
                          key={leaf.to}
                          to={leaf.to}
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
                        >
                          {tr(leaf.label)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mt-3 flex items-center justify-center gap-1 rounded-full border border-black/10 bg-white p-1">
              {languages.map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                    lang === code ? "bg-[var(--ithemba-blue)] text-white" : "text-muted-foreground"
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <Link to="/donate" onClick={() => setOpen(false)} className="mt-2">
              <Button className="w-full rounded-full bg-[var(--ithemba-yellow)] font-semibold text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/95">
                <Heart className="mr-1.5 h-4 w-4 fill-current" /> {tr(t.cta.donateMonthly)}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
