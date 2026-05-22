import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks/LegalPage";
import { SmartImage } from "@/components/site/Asset";
import { assets } from "@/data/assets";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { MissingInfoBadge, Placeholder } from "@/components/site/MissingInfo";

export const Route = createFileRoute("/about/team")({ component: AboutTeam });

/**
 * teamMembers — placeholder structure ready for future editing.
 * Replace each entry with real iThemba Kuluntu team member data when provided.
 * Do NOT auto-populate from the directors list unless explicitly approved.
 */
type TeamMember = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  role: { en: string; de: string } | null;
  description: { en: string; de: string } | null;
  photoSrc: string | null;
};

const teamMembers: TeamMember[] = [
  { id: "tm-1", firstName: null, lastName: null, role: null, description: null, photoSrc: null },
  { id: "tm-2", firstName: null, lastName: null, role: null, description: null, photoSrc: null },
  { id: "tm-3", firstName: null, lastName: null, role: null, description: null, photoSrc: null },
  { id: "tm-4", firstName: null, lastName: null, role: null, description: null, photoSrc: null },
  { id: "tm-5", firstName: null, lastName: null, role: null, description: null, photoSrc: null },
  { id: "tm-6", firstName: null, lastName: null, role: null, description: null, photoSrc: null },
];

function AboutTeam() {
  const { lang, t } = useLang();
  const lbl = (en: string, de: string) => (lang === "en" ? en : de);

  return (
    <>
      <PageHeader
        eyebrow={lbl("About", "Über")}
        title={lbl("Our Team", "Unser Team")}
        subtitle={lbl(
          "The people behind iThemba Kuluntu — full team coming soon.",
          "Die Menschen hinter iThemba Kuluntu — vollständiges Team folgt in Kürze."
        )}
        accent="var(--ithemba-blue-dark)"
      />

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <Link
          to="/about"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--ithemba-blue-dark)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> {lbl("Back to About", "Zurück zu Über")}
        </Link>

        <div className="mt-6 rounded-2xl bg-[var(--ithemba-cream)] p-5 text-sm text-foreground/80">
          {lbl(
            "Each team member will be shown here with first and last name, role, photo and a short description. The entries below are placeholders until real information is supplied.",
            "Jedes Teammitglied wird hier mit Vor- und Nachnamen, Rolle, Foto und einer kurzen Beschreibung vorgestellt. Die folgenden Einträge sind Platzhalter, bis echte Informationen vorliegen."
          )}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((m) => {
            const fullName =
              m.firstName && m.lastName ? `${m.firstName} ${m.lastName}` : null;
            return (
              <article
                key={m.id}
                className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative">
                  <SmartImage
                    src={assets.photos.about.team}
                    label={fullName ?? "team member photo"}
                    className="aspect-[4/5] w-full"
                    rounded="rounded-none"
                    tone="ocean"
                    showMissingBadge={false}
                  />
                  {!m.photoSrc && (
                    <div className="absolute left-3 top-3">
                      <MissingInfoBadge text="team member photo" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="font-display text-xl font-bold text-[var(--ithemba-blue-dark)]">
                    {fullName ?? (
                      <span className="font-sans text-base font-medium">
                        <MissingInfoBadge text="team member first and last name" />
                      </span>
                    )}
                  </h3>
                  <div className="text-sm font-medium text-[var(--ithemba-blue)]">
                    {m.role ? t(m.role) : <MissingInfoBadge text="team member role" />}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                    {m.description ? t(m.description) : (
                      <MissingInfoBadge text="short team member description" />
                    )}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8">
          <Placeholder text="final approved team list with first and last names, roles, photos and short descriptions" kind="verify" />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8">
        <h2 className="font-display text-2xl font-bold text-[var(--ithemba-blue-dark)] md:text-3xl">
          {lbl("Support the team's work", "Unterstützen Sie die Arbeit des Teams")}
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/donate">
            <Button size="lg" className="rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold">
              <Heart className="mr-2 h-4 w-4 fill-current" /> {lbl("Donate Monthly", "Monatlich spenden")}
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="rounded-full">
              {lbl("Get in touch", "Kontakt aufnehmen")}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
