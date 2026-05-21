import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Heart, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "./LanguageProvider";
import { t } from "@/data/content";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", key: t.nav.home },
  { to: "/about", key: t.nav.about },
  { to: "/projects", key: t.nav.projects },
  { to: "/impact", key: t.nav.impact },
  { to: "/media", key: t.nav.media },
  { to: "/partners", key: t.nav.partners },
  { to: "/donate", key: t.nav.donate },
  { to: "/contact", key: t.nav.contact },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t: tr } = useLang();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all ${
        scrolled
          ? "border-b border-black/5 bg-white/85 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          : "bg-white/40 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ithemba-blue)] font-display text-lg font-bold text-white shadow-sm ring-2 ring-[var(--ithemba-yellow)]/40">
            iK
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-[var(--ithemba-blue-dark)]">iThemba Kuluntu</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Pondoland · Eastern Cape</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const active = path === item.to || (item.to !== "/" && path.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-[var(--ithemba-blue-dark)]"
                    : "text-foreground/75 hover:text-foreground"
                }`}
              >
                {tr(item.key)}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-[var(--ithemba-yellow)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "de" : "en")}
            className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-white"
            aria-label="Switch language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className={lang === "en" ? "text-[var(--ithemba-blue-dark)]" : "text-muted-foreground"}>EN</span>
            <span className="text-muted-foreground">|</span>
            <span className={lang === "de" ? "text-[var(--ithemba-blue-dark)]" : "text-muted-foreground"}>DE</span>
          </button>

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
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-muted"
              >
                {tr(item.key)}
              </Link>
            ))}
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
