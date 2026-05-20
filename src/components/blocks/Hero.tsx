import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { t } from "@/data/content";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

export function Hero() {
  const { lang, t: tr } = useLang();
  return (
    <section className="relative overflow-hidden">
      {/* sun + dots decor */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[var(--ithemba-yellow)]/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-64 w-64 rounded-full bg-[var(--ithemba-teal)]/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:py-20 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="relative">
          {/* blob background */}
          <div className="absolute -inset-6 -z-10 blob bg-[var(--ithemba-blue)]" aria-hidden />
          <div className="relative p-8 md:p-10 text-white">
            <div className="font-hand text-3xl text-[var(--ithemba-yellow)]">{tr(t.home.welcome)}</div>
            <h1 className="mt-1 font-display text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl">
              iThemba<br />Kuluntu
            </h1>
            <div className="mt-3 h-1.5 w-32 rounded-full bg-[var(--ithemba-yellow)]" />
            <p className="mt-6 max-w-md text-lg text-white/90">
              {tr(t.home.heroTitle)}
            </p>
            <p className="mt-3 max-w-md text-sm text-white/80">{tr(t.home.heroIntro)}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/donate">
                <Button size="lg" className="rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold shadow-lg">
                  <Heart className="mr-2 h-4 w-4 fill-current" /> {tr(t.cta.donateMonthly)}
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  {tr(t.cta.learnMoreAbout)} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative">
          <PhotoPlaceholder
            label="Children of Pondoland — community joy photo"
            className="aspect-[4/5] w-full"
          />
          <div className="absolute -bottom-5 -left-5 hidden h-20 w-20 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] shadow-xl md:flex">
            <Heart className="h-8 w-8 fill-current" />
          </div>
        </div>
      </div>
    </section>
  );
}
