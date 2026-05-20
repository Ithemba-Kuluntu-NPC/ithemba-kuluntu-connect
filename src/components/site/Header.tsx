import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Heart, Globe } from "lucide-react";
import { useState } from "react";
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
  const { lang, setLang, t: tr } = useLang();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ithemba-blue)] text-white font-display font-bold text-lg shadow-sm">
            iK
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-[var(--ithemba-blue-dark)]">iThemba Kuluntu</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Pondoland, Eastern Cape</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = path === item.to || (item.to !== "/" && path.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
              >
                {tr(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "de" : "en")}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-muted"
            aria-label="Switch language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className={lang === "en" ? "text-[var(--ithemba-blue-dark)]" : "text-muted-foreground"}>EN</span>
            <span className="text-muted-foreground">|</span>
            <span className={lang === "de" ? "text-[var(--ithemba-blue-dark)]" : "text-muted-foreground"}>DE</span>
          </button>

          <Link to="/donate" className="hidden md:block">
            <Button className="rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold shadow-sm">
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
        <div className="border-t border-border bg-background lg:hidden">
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
              <Button className="w-full rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold">
                <Heart className="mr-1.5 h-4 w-4 fill-current" /> {tr(t.cta.donateMonthly)}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
