import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PHOTO = "/assets/photos/home/hero-image.png";
const ALT = "Children in Pondoland sharing a joyful high-five with bubbles in the sunlight";

export const Route = createFileRoute("/newsletter-confirmed")({
  head: () => ({
    meta: [
      { title: "Newsletter confirmed | iThemba Kuluntu" },
      { name: "description", content: "Your iThemba Kuluntu newsletter subscription is confirmed." },
      { property: "og:title", content: "Newsletter confirmed | iThemba Kuluntu" },
      { property: "og:description", content: "Your iThemba Kuluntu newsletter subscription is confirmed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NewsletterConfirmed,
});

function NewsletterConfirmed() {
  return (
    <section id="newsletter-confirmed" className="relative isolate overflow-hidden">
      <style>{`main:has(#newsletter-confirmed) + footer { margin-top: 0; }`}</style>

      {/* mobile/tablet: photo first */}
      <div className="relative h-[40vh] min-h-[260px] w-full sm:h-[44vh] lg:hidden">
        <img src={PHOTO} alt={ALT} className="h-full w-full object-cover object-[92%_30%] sm:object-[70%_30%]" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ithemba-blue)]/35 via-transparent to-transparent" />
      </div>

      {/* desktop: full-bleed photo */}
      <div className="absolute inset-0 -z-10 hidden lg:block">
        <img src={PHOTO} alt={ALT} className="h-full w-full object-cover object-right" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ithemba-blue-deepest)]/70 via-[var(--ithemba-blue-dark)]/30 to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>

      <div className="relative -mt-10 bg-[var(--ithemba-blue)] lg:mt-0 lg:bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center px-4 pb-16 pt-10 md:pb-20 lg:min-h-[72vh] lg:px-8 lg:py-24">
          <div className="relative max-w-xl">
            <div className="absolute -inset-x-6 -inset-y-8 -z-10 hidden blob bg-[var(--ithemba-blue)]/90 backdrop-blur-sm shadow-[0_30px_80px_-30px_rgb(8_26_96/0.7)] lg:block lg:-inset-x-12 lg:-inset-y-14" aria-hidden />
            <div className="relative p-2 text-white sm:p-4">
              <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm">Newsletter</div>
              <h1 className="mt-2 font-display text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[0.95] tracking-tight">
                You're subscribed.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/90 md:text-lg">
                Thank you for joining the iThemba Kuluntu community. You'll now receive occasional updates about our programmes and impact.
              </p>
              <Link to="/" className="mt-7 inline-block w-full sm:w-auto">
                <Button size="lg" className="w-full justify-center rounded-full bg-[var(--ithemba-yellow)] px-6 py-6 text-base font-bold text-[var(--ithemba-brown)] shadow-xl shadow-amber-900/30 transition hover:scale-[1.02] hover:bg-[var(--ithemba-yellow)]/95 sm:w-auto">
                  Back to main website <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
