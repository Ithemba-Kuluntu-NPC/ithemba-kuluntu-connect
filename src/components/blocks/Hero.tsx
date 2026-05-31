import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, MapPin } from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { t } from "@/data/content";
import { SmartLogo } from "@/components/site/Asset";
import { assets } from "@/data/assets";
import heroPhoto from "@/assets/home-hero.jpg";

export function Hero() {
  const { t: tr, lang } = useLang();
  return (
    <section className="relative isolate overflow-hidden">
      {/* full-bleed photo background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroPhoto}
          alt="Children in Pondoland sharing a joyful high-five with bubbles in the sunlight"
          className="h-full w-full object-cover object-[80%_center] md:object-[78%_center]"
          loading="eager"
          decoding="async"
        />
        {/* readable overlays: deep blue from left, warm gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ithemba-blue-deepest)]/85 via-[var(--ithemba-blue-dark)]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* sun glow */}
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-16 md:pb-28 md:pt-24 lg:min-h-[88vh] lg:px-8">
        <div className="relative max-w-2xl">
          {/* organic blue bubble holding the headline */}
          <div className="relative">
            <div className="absolute -inset-x-6 -inset-y-8 -z-10 blob bg-[var(--ithemba-blue)]/85 backdrop-blur-sm shadow-[0_30px_80px_-30px_rgb(8_26_96/0.7)]" aria-hidden />
            <div className="relative p-2 pr-4 text-white sm:p-4">
              <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm">
                {tr(t.home.welcome)}
              </div>
              <h1 className="mt-2 font-display text-[clamp(2.5rem,7vw,4.75rem)] font-extrabold leading-[0.95] tracking-tight">
                {/* White text-only logo on dark photo background */}
                <SmartLogo
                  src={assets.logos.ithembaTextWhite}
                  alt="iThemba Kuluntu"
                  className="block h-auto w-full max-w-md drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
                  showMissingBadge={false}
                  fallback={
                    <>
                      iThemba<br />
                      <span className="relative inline-block">
                        Kuluntu
                        <svg className="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
                          <path d="M2,8 C50,2 120,14 198,6" stroke="var(--ithemba-yellow)" strokeWidth="4" strokeLinecap="round" fill="none" />
                        </svg>
                      </span>
                    </>
                  }
                />
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/95 md:text-xl">
                {tr(t.home.heroTitle)}
              </p>
              <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">
                {tr(t.home.heroIntro)}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/donate">
                  <Button size="lg" className="rounded-full bg-[var(--ithemba-yellow)] px-6 py-6 text-base font-bold text-[var(--ithemba-brown)] shadow-xl shadow-amber-900/30 hover:bg-[var(--ithemba-yellow)]/95 hover:scale-[1.02] transition">
                    <Heart className="mr-2 h-4 w-4 fill-current" /> {tr(t.cta.donateMonthly)}
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 px-6 py-6 text-base text-white backdrop-blur hover:bg-white/20 hover:text-white">
                    {tr(t.cta.learnMoreAbout)} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur ring-1 ring-white/20">
                <MapPin className="h-3.5 w-3.5 text-[var(--ithemba-yellow)]" />
                {lang === "en"
                  ? "Pondoland · Eastern Cape · South Africa"
                  : lang === "de"
                  ? "Pondoland · Eastern Cape · Südafrika"
                  : "Pondoland · Eastern Cape · Zuid-Afrika"}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* soft wave divider into next section */}
      <svg className="block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--background)" />
      </svg>
    </section>
  );
}
