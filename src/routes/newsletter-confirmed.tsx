import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

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
    <section className="mx-auto max-w-6xl px-4 py-14 md:py-20 lg:px-8">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-xl rounded-bl-xl shadow-lg ring-1 ring-black/10">
          <img
            src="/assets/photos/home/hero-image.png"
            alt="Children smiling in Pondoland"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ithemba-yellow)]">
            Newsletter
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold text-[var(--ithemba-blue)] md:text-4xl">
            You're subscribed.
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            Thank you for joining the iThemba Kuluntu community. You'll now receive occasional updates about our programmes and impact.
          </p>
          <Button asChild className="mt-7 h-11 rounded-full bg-[var(--ithemba-blue)] px-6 font-semibold text-white hover:bg-[var(--ithemba-blue)]/90">
            <Link to="/">Back to main website</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
