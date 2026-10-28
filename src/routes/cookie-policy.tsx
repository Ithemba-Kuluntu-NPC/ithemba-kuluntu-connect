import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/site/LanguageProvider";
import { useCookiePreferences } from "@/components/site/CookiePreferencesProvider";
import { cookieCopy } from "@/components/site/cookie-copy";
import en from "@/data/legal/cookie-policy-en-v1.json";
import de from "@/data/legal/cookie-policy-de-v1.json";
import nl from "@/data/legal/cookie-policy-nl-v1.json";

function CookiePolicyPage() {
  const { lang } = useLang();
  const { openSettings, ready } = useCookiePreferences();
  const c = { en, de, nl }[lang];
  return (
    <div className="bg-[var(--ithemba-cream)]">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <header className="mb-10">
          <div className="hand-eyebrow">{c.eyebrow}</div>
          <h1 className="mt-1 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">
            {c.title}
          </h1>
          <p className="mt-3 text-muted-foreground">{c.intro}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground/80">
            {c.updated}
          </p>
          <Button
            disabled={!ready}
            onClick={openSettings}
            className="mt-5 rounded-full bg-[var(--ithemba-blue)] hover:bg-[var(--ithemba-blue-dark)]"
          >
            {cookieCopy[lang].settings}
          </Button>
        </header>
        <div className="space-y-8">
          {c.sections.map((section) => (
            <section
              key={section.heading}
              className="border-t border-[var(--ithemba-blue)]/10 pt-6"
            >
              <h2 className="font-display text-xl font-bold text-[var(--ithemba-blue-dark)]">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
          <section className="border-t border-[var(--ithemba-blue)]/10 pt-6">
            <h2 className="font-display text-xl font-bold text-[var(--ithemba-blue-dark)]">
              {c.contactHeading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {c.contact}{" "}
              <a
                href="mailto:info@ithembakuluntu.org"
                className="text-[var(--ithemba-blue)] underline"
              >
                info@ithembakuluntu.org
              </a>
              .
            </p>
            <Link
              to="/datenschutz"
              className="mt-3 inline-block text-sm text-[var(--ithemba-blue)] underline"
            >
              {c.privacy}
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/cookie-policy")({ component: CookiePolicyPage });
