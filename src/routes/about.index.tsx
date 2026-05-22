import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks/LegalPage";
import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, MapPin, ArrowRight } from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { Placeholder } from "@/components/site/MissingInfo";
import { SmartImage } from "@/components/site/Asset";
import { assets } from "@/data/assets";

export const Route = createFileRoute("/about/")({ component: About });

function About() {
  const { lang } = useLang();
  const lbl = (en: string, de: string) => (lang === "en" ? en : de);

  return (
    <>
      <PageHeader
        eyebrow={lbl("About", "Über")}
        title="iThemba Kuluntu"
        subtitle={lbl(
          "Hope for communities. Built from the ground up in Pondoland.",
          "Hoffnung für Gemeinschaften. Von Grund auf in Pondoland aufgebaut."
        )}
        accent="var(--ithemba-blue-dark)"
      />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 lg:px-8">
        <SmartImage
          src={assets.photos.about.hero}
          label="iThemba Kuluntu team — community photo"
          className="aspect-[4/3]"
          showMissingBadge={false}
        />
        <div>
          <h2 className="font-display text-3xl font-bold">{lbl("Who we are", "Wer wir sind")}</h2>
          <p className="mt-3 text-foreground/85">
            {lbl(
              "We are a women-led, community-rooted nonprofit working with rural communities in the Eastern Cape. Our work is shaped by listening, local leadership and consistent practical care.",
              "Wir sind eine von Frauen geführte, in der Gemeinschaft verwurzelte Nonprofit-Organisation in den ländlichen Regionen des Eastern Cape. Unsere Arbeit gründet auf Zuhören, lokaler Führung und kontinuierlicher praktischer Fürsorge."
            )}
          </p>
        </div>
      </section>

      <section className="bg-[var(--ithemba-cream)] py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3 lg:px-8">
          {[
            { i: MapPin, t: lbl("Where we work", "Wo wir arbeiten"), b: lbl("Cwebeni, Port St Johns — along the Wild Coast in Pondoland, Eastern Cape.", "Cwebeni, Port St Johns — an der Wild Coast in Pondoland, Eastern Cape.") },
            { i: Heart, t: lbl("What we believe", "Woran wir glauben"), b: lbl("Lasting change begins with dignity, local leadership and practical solutions communities can own.", "Nachhaltiger Wandel beginnt mit Würde, lokaler Führung und praktischen Lösungen, die Gemeinschaften tragen können.") },
            { i: Users, t: lbl("How we work", "Wie wir arbeiten"), b: lbl("With communities, not above them. Trust, transparency and follow-through guide every project.", "Mit den Gemeinschaften, nicht über ihnen. Vertrauen, Transparenz und Verlässlichkeit leiten jedes Projekt.") },
          ].map((c, i) => (
            <div key={i} className="rounded-3xl bg-white p-6 shadow-sm">
              <c.i className="h-7 w-7 text-[var(--ithemba-blue)]" />
              <h3 className="mt-3 font-display text-xl font-bold">{c.t}</h3>
              <p className="mt-2 text-sm text-foreground/80">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-[var(--ithemba-blue-dark)]">{lbl("Governance and trust", "Governance und Vertrauen")}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "Registered NPC under SA Companies Act",
            "Public Benefit Organisation (PBO) registered",
            "NPO registered",
            "VAT registered",
            "Board governance and accountability",
            "Locally-led leadership",
            "Transparent reporting",
            "Monitoring and evaluation",
          ].map((s) => (
            <div key={s} className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ithemba-blue)]" />
              <span className="text-sm font-medium">{s}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-[var(--ithemba-cream)] p-6 md:p-8">
          <h3 className="font-display text-xl font-bold">Organisation details</h3>
          <dl className="mt-4 grid gap-y-2 text-sm sm:grid-cols-2">
            <div><dt className="font-semibold inline">Registered name: </dt><dd className="inline">iThemba Kuluntu NPC</dd></div>
            <div><dt className="font-semibold inline">Registration: </dt><dd className="inline">2023/199348/08</dd></div>
            <div><dt className="font-semibold inline">PBO Reference: </dt><dd className="inline">930081177</dd></div>
            <div><dt className="font-semibold inline">NPO: </dt><dd className="inline">300-700</dd></div>
            <div><dt className="font-semibold inline">VAT: </dt><dd className="inline">4430318792</dd></div>
            <div><dt className="font-semibold inline">Year established: </dt><dd className="inline">2023</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold inline">Registered address: </dt><dd className="inline">Flat Rock Cottage, Cwebeni Beach, Port St Johns, Eastern Cape, South Africa, 5090</dd></div>
          </dl>
          <div className="mt-3 space-y-1">
            <Placeholder text="downloadable certificates" />
            <Placeholder text="annual report download" />
            <Placeholder text="financial statement download" />
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-[var(--ithemba-blue)]/10 md:p-8">
          <h3 className="font-display text-xl font-bold">German support structure</h3>
          <p className="mt-2 text-sm text-foreground/80">iThemba Kuluntu NPC is supported by iThemba Kuluntu e.V. in Germany.</p>
          <div className="mt-3 space-y-1">
            <Placeholder text="German registered address" />
            <Placeholder text="German Vereinsregister number" />
            <Placeholder text="German register court" />
            <Placeholder text="German tax number" />
            <Placeholder text="German charitable status confirmation" />
            <Placeholder text="German board details, if public" />
            <Placeholder text="German donation account details" />
          </div>
        </div>
      </section>

      {/* Our Team teaser — links to dedicated subpage */}
      <section className="bg-[var(--ithemba-cream)] py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-2xl"
              style={{ background: "var(--ithemba-yellow)" }}
              aria-hidden
            />
            <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="hand-eyebrow">{lbl("Meet", "Lernen Sie")}</div>
                <h2 className="-mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
                  {lbl("Our Team", "unser Team")}
                </h2>
                <p className="mt-3 max-w-lg text-foreground/80">
                  {lbl(
                    "The people behind iThemba Kuluntu — community leaders, educators, organisers and volunteers.",
                    "Die Menschen hinter iThemba Kuluntu — Gemeindeleiterinnen, Pädagoginnen, Organisatorinnen und Freiwillige."
                  )}
                </p>
                <Link to="/about/team">
                  <Button className="mt-5 rounded-full bg-[var(--ithemba-blue)] hover:bg-[var(--ithemba-blue-dark)]">
                    {lbl("Meet our team", "Unser Team kennenlernen")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <SmartImage
                src={assets.photos.home.aboutTeam}
                label="iThemba Kuluntu team"
                className="aspect-[4/3] w-full"
                rounded="rounded-2xl"
                showMissingBadge={false}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8">
        <h2 className="font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
          {lbl("Help build stronger rural communities", "Helfen Sie, stärkere ländliche Gemeinschaften aufzubauen")}
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/donate">
            <Button size="lg" className="rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold">
              <Heart className="mr-2 h-4 w-4 fill-current" /> {lbl("Donate Monthly", "Monatlich spenden")}
            </Button>
          </Link>
          <Link to="/partners">
            <Button size="lg" variant="outline" className="rounded-full">{lbl("Partner With Us", "Werden Sie Partner")}</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
