import { createFileRoute, Link } from "@tanstack/react-router";

function PageHeader() {
  return (
    <div className="mb-10">
      <div className="hand-eyebrow">Rechtliches</div>
      <h1 className="font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">
        Impressum
      </h1>
      <p className="mt-3 text-muted-foreground">
        Angaben gemäß den gesetzlichen Informationspflichten für digitale Dienste.
      </p>
    </div>
  );
}

function DetailSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[var(--ithemba-blue)]/10 pt-6">
      <h2 className="font-display text-xl font-bold text-[var(--ithemba-blue-dark)]">
        {heading}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function DetailGrid({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="grid gap-y-2 text-sm sm:grid-cols-[160px_1fr] sm:gap-x-4">
      {items.map((item, i) => (
        <div key={i} className="contents">
          <dt className="font-semibold text-foreground">{item.label}</dt>
          <dd className="text-muted-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function EmailLink() {
  return (
    <a
      href="mailto:info@ithembakuluntu.org"
      className="text-[var(--ithemba-blue)] hover:underline"
    >
      info@ithembakuluntu.org
    </a>
  );
}

export const Route = createFileRoute("/impressum")({
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <PageHeader />

      <div className="space-y-8">
        <DetailSection heading="Anbieter dieser Website">
          <DetailGrid
            items={[
              {
                label: "Name",
                value: "iThemba Kuluntu e.V.",
              },
              {
                label: "Adresse",
                value: (
                  <>
                    Am Emberg 20
                    <br />
                    57399 Kirchhundem
                    <br />
                    Deutschland
                  </>
                ),
              },
              {
                label: "E-Mail",
                value: <EmailLink />,
              },
            ]}
          />
        </DetailSection>

        <DetailSection heading="Vereinsangaben">
          <DetailGrid
            items={[
              {
                label: "Registergericht",
                value: "Amtsgericht Siegen",
              },
              {
                label: "Vereinsregister",
                value: "VR 6845",
              },
              {
                label: "Steuernummer",
                value: "338/5953/0753",
              },
              {
                label: "Vertreten durch",
                value: "Heltraut Hamers, 1. Vorsitzende",
              },
            ]}
          />
        </DetailSection>

        <DetailSection heading="Gemeinnützigkeit und Zuwendungsbescheinigungen">
          <p className="text-sm text-muted-foreground">
            iThemba Kuluntu e.V. unterstützt die gemeinnützige Arbeit von iThemba
            Kuluntu in Südafrika. Für steuerlich abzugsfähige Spenden können
            Zuwendungsbescheinigungen ausgestellt werden, soweit die gesetzlichen
            Voraussetzungen erfüllt sind.
          </p>
        </DetailSection>

        <DetailSection heading="Bankverbindung">
          <DetailGrid
            items={[
              {
                label: "Kontoinhaber",
                value: "iThemba Kuluntu e.V.",
              },
              {
                label: "IBAN",
                value: "DE52 8306 5408 0005 4056 96",
              },
              {
                label: "BIC",
                value: "GENODEF1SLR",
              },
            ]}
          />
        </DetailSection>

        <DetailSection heading="Südafrikanische Partnerorganisation">
          <div className="mb-3 text-sm font-semibold text-foreground">
            iThemba Kuluntu NPC
          </div>
          <DetailGrid
            items={[
              {
                label: "Registration",
                value: "2023/199348/08",
              },
              {
                label: "PBO",
                value: "930081177",
              },
              {
                label: "NPO",
                value: "300-700",
              },
              {
                label: "VAT",
                value: "4430318792",
              },
              {
                label: "Adresse",
                value: (
                  <>
                    Flat Rock Cottage, Cwebeni Beach
                    <br />
                    Port St Johns, Eastern Cape
                    <br />
                    South Africa, 5090
                  </>
                ),
              },
              {
                label: "E-Mail",
                value: <EmailLink />,
              },
            ]}
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Die operative Projektarbeit in Südafrika wird durch iThemba Kuluntu
            NPC durchgeführt. iThemba Kuluntu e.V. unterstützt diese Arbeit durch
            Spenden, Partnerschaften, Kommunikation und Fördermittelarbeit.
          </p>
        </DetailSection>

        <DetailSection heading="Verantwortlich für den Inhalt">
          <p className="text-sm text-muted-foreground">
            Verantwortlich für den Inhalt dieser Website ist iThemba Kuluntu e.V.,
            vertreten durch Heltraut Hamers, 1. Vorsitzende, Anschrift wie oben.
          </p>
        </DetailSection>

        <DetailSection heading="Haftung für Inhalte">
          <p className="text-sm text-muted-foreground">
            Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für
            die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen
            wir jedoch keine Gewähr. Als Diensteanbieter sind wir für eigene
            Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
          </p>
        </DetailSection>

        <DetailSection heading="Haftung für Links">
          <p className="text-sm text-muted-foreground">
            Diese Website kann Links zu externen Websites Dritter enthalten, auf
            deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte
            übernehmen wir keine Gewähr. Für die Inhalte der verlinkten Seiten ist
            stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </DetailSection>

        <DetailSection heading="Urheberrecht">
          <p className="text-sm text-muted-foreground">
            Die auf dieser Website veröffentlichten Inhalte, Texte, Bilder,
            Grafiken und sonstigen Materialien unterliegen dem Urheberrecht. Eine
            Vervielfältigung, Bearbeitung, Verbreitung oder sonstige Nutzung
            außerhalb der Grenzen des Urheberrechts bedarf der vorherigen
            schriftlichen Zustimmung, soweit keine gesetzliche Erlaubnis besteht.
          </p>
        </DetailSection>

        <DetailSection heading="Datenschutz">
          <p className="text-sm text-muted-foreground">
            Informationen zur Verarbeitung personenbezogener Daten finden Sie in
            unserer{" "}
            <Link
              to="/datenschutz"
              className="text-[var(--ithemba-blue)] hover:underline"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </DetailSection>
      </div>
    </div>
  ),
});
