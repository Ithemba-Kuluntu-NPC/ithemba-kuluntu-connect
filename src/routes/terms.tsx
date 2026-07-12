import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/components/site/LanguageProvider";
import type { Lang } from "@/data/content";

type TermsCopy = {
  script: string;
  main: string;
  intro: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  sections: { heading: string; paragraphs?: string[]; list?: string[] }[];
  contact: { heading: string; text: string; emailLabel: string };
  related: {
    heading: string;
    links: { label: string; to: string }[];
  };
};

const EMAIL = "info@ithembakuluntu.org";

const COPY: Record<Lang, TermsCopy> = {
  en: {
    script: "Legal",
    main: "Terms of Use",
    intro: "These Terms of Use explain how visitors may use the iThemba Kuluntu website.",
    lastUpdatedLabel: "Last updated",
    lastUpdated: "July 2026",
    sections: [
      { heading: "About this website", paragraphs: [
        "This website provides information about iThemba Kuluntu, its community-rooted projects, partnerships, media coverage, donation options and related public-interest work in South Africa and Germany.",
        "By using this website, you agree to use it lawfully, respectfully and only for its intended purpose.",
      ]},
      { heading: "Website provider", paragraphs: [
        "This website is operated in connection with iThemba Kuluntu e.V. in Germany and iThemba Kuluntu NPC in South Africa. Legal provider details are available in the Impressum.",
      ]},
      { heading: "Use of website content", paragraphs: [
        "The content on this website is provided for general information, awareness, donor communication and partnership purposes.",
        "Visitors may read, share and link to publicly available pages in a respectful and accurate way. Website content must not be copied, modified, republished, misrepresented or used for commercial, fundraising or promotional purposes without written permission from iThemba Kuluntu.",
      ]},
      { heading: "Project information and impact data", paragraphs: [
        "We make reasonable efforts to keep project information, impact figures, partner information and programme updates accurate and current. However, project details may change as community needs, funding, field conditions, implementation timelines and reporting processes change.",
        "Impact figures, field data, climate-related estimates and programme information are shared in good faith and may be updated, verified or corrected over time.",
      ]},
      { heading: "Donations", paragraphs: [
        "Donations made through or in connection with this website support the charitable and community-rooted work of iThemba Kuluntu.",
        "Donation payments may be processed through external payment providers, banking platforms or other third-party services. The availability of specific payment methods may depend on the donor’s location, currency and the technical systems active on the website.",
        "Donation receipts, tax certificates and Zuwendungsbescheinigungen are issued where applicable and in accordance with the relevant legal, organisational and tax requirements.",
        "If a donation is made in error or if a donor has a question about a donation, the donor should contact us as soon as possible.",
      ]},
      { heading: "Third-party links and services", paragraphs: [
        "This website may contain links to external websites, media articles, YouTube videos, social media platforms, partner websites, donation platforms or payment providers.",
        "We are not responsible for the content, availability, security, privacy practices or terms of use of external websites or third-party services. Visitors should review the relevant terms and privacy information of those third parties before using them.",
      ]},
      { heading: "Acceptable use",
        paragraphs: ["Visitors must not misuse this website or attempt to interfere with its proper functioning."],
        list: [
          "Do not attempt to gain unauthorised access to the website or its systems.",
          "Do not upload or transmit harmful code, spam or abusive content.",
          "Do not use the website in a misleading, fraudulent or unlawful way.",
          "Do not copy or reuse website materials in a way that misrepresents iThemba Kuluntu, its work, partners, donors or communities.",
          "Do not use project stories, images or community information in a disrespectful or exploitative way.",
        ]},
      { heading: "Intellectual property", paragraphs: [
        "Unless otherwise stated, the text, photographs, videos, graphics, logos, project materials, design elements and other content on this website belong to iThemba Kuluntu or are used with permission.",
        "These materials may not be copied, reproduced, adapted, distributed or used for other purposes without prior written permission, except where permitted by law.",
      ]},
      { heading: "Community photos and stories", paragraphs: [
        "This website may include photographs, videos and stories from community-based work. These materials are shared to communicate the work of iThemba Kuluntu respectfully and transparently.",
        "Visitors must not download, reuse, edit or share community images, child images, beneficiary stories or field materials in a way that is misleading, harmful, exploitative or disconnected from their original context.",
      ]},
      { heading: "No professional advice", paragraphs: [
        "The information on this website is provided for general awareness and communication purposes. It does not constitute legal, medical, financial, tax, environmental, technical or professional advice.",
        "Visitors should seek appropriate professional advice before relying on website information for legal, financial, tax, compliance or technical decisions.",
      ]},
      { heading: "Website availability", paragraphs: [
        "We aim to keep the website accessible and functional, but we do not guarantee that it will always be available, uninterrupted, error-free or free from technical issues.",
        "We may update, change, suspend or remove parts of the website at any time.",
      ]},
      { heading: "Limitation of liability", paragraphs: [
        "We are not liable for losses or damages arising from the use of this website, reliance on website content, temporary unavailability of the website, external links or third-party services, except where liability cannot legally be excluded.",
        "Nothing in these Terms of Use excludes liability where exclusion is not permitted by applicable law.",
      ]},
      { heading: "Changes to these Terms", paragraphs: [
        "We may update these Terms of Use from time to time. The updated version will be published on this page with the latest update date.",
        "Continued use of the website after changes have been published means that visitors accept the updated Terms of Use.",
      ]},
    ],
    contact: { heading: "Contact", text: "For questions about these Terms of Use, please contact us.", emailLabel: "E-mail" },
    related: { heading: "Related legal pages", links: [
      { label: "Impressum", to: "/impressum" },
      { label: "Privacy Policy", to: "/datenschutz" },
      { label: "Cookie Policy", to: "/cookie-policy" },
    ]},
  },
  de: {
    script: "Rechtliches",
    main: "Nutzungsbedingungen",
    intro: "Diese Nutzungsbedingungen erklären, wie Besucherinnen und Besucher die Website von iThemba Kuluntu nutzen dürfen.",
    lastUpdatedLabel: "Zuletzt aktualisiert",
    lastUpdated: "Juli 2026",
    sections: [
      { heading: "Über diese Website", paragraphs: [
        "Diese Website informiert über iThemba Kuluntu, unsere gemeinschaftsverwurzelten Projekte, Partnerschaften, Medienberichte, Spendenmöglichkeiten und unsere gemeinnützige Arbeit in Südafrika und Deutschland.",
        "Mit der Nutzung dieser Website erklären Sie sich damit einverstanden, sie rechtmäßig, respektvoll und nur für den vorgesehenen Zweck zu nutzen.",
      ]},
      { heading: "Anbieter der Website", paragraphs: [
        "Diese Website wird im Zusammenhang mit iThemba Kuluntu e.V. in Deutschland und iThemba Kuluntu NPC in Südafrika betrieben. Die rechtlichen Anbieterangaben finden Sie im Impressum.",
      ]},
      { heading: "Nutzung der Website-Inhalte", paragraphs: [
        "Die Inhalte dieser Website dienen der allgemeinen Information, Öffentlichkeitsarbeit, Spenderkommunikation und Partnerschaftsanbahnung.",
        "Besucherinnen und Besucher dürfen öffentlich zugängliche Seiten respektvoll und sachlich korrekt lesen, teilen und verlinken. Inhalte dieser Website dürfen ohne vorherige schriftliche Zustimmung von iThemba Kuluntu nicht kopiert, verändert, erneut veröffentlicht, falsch dargestellt oder für kommerzielle Zwecke, Fundraising oder Werbung genutzt werden.",
      ]},
      { heading: "Projektinformationen und Wirkungsdaten", paragraphs: [
        "Wir bemühen uns, Projektinformationen, Wirkungszahlen, Partnerangaben und Programmupdates sorgfältig, korrekt und aktuell zu halten. Gleichzeitig können sich Projektdetails verändern, wenn sich Bedarfe in den Gemeinschaften, Finanzierungen, Feldbedingungen, Umsetzungszeiträume oder Berichtsprozesse ändern.",
        "Wirkungszahlen, Felddaten, klimabezogene Schätzungen und Programminformationen werden nach bestem Wissen und Gewissen veröffentlicht und können im Laufe der Zeit aktualisiert, überprüft oder korrigiert werden.",
      ]},
      { heading: "Spenden", paragraphs: [
        "Spenden, die über diese Website oder im Zusammenhang mit dieser Website geleistet werden, unterstützen die gemeinnützige und gemeinschaftsverwurzelte Arbeit von iThemba Kuluntu.",
        "Spendenzahlungen können über externe Zahlungsanbieter, Bankplattformen oder andere Drittanbieter abgewickelt werden. Welche Zahlungsarten verfügbar sind, kann vom Standort der Spenderin oder des Spenders, der Währung und den jeweils aktiven technischen Systemen der Website abhängen.",
        "Spendenbescheinigungen, Steuerbescheinigungen und Zuwendungsbescheinigungen werden ausgestellt, soweit dies anwendbar ist und den jeweiligen rechtlichen, organisatorischen und steuerlichen Anforderungen entspricht.",
        "Wenn eine Spende versehentlich erfolgt ist oder Fragen zu einer Spende bestehen, kontaktieren Sie uns bitte so schnell wie möglich.",
      ]},
      { heading: "Links und Dienste Dritter", paragraphs: [
        "Diese Website kann Links zu externen Websites, Medienartikeln, YouTube-Videos, Social-Media-Plattformen, Partnerwebsites, Spendenplattformen oder Zahlungsanbietern enthalten.",
        "Für Inhalte, Verfügbarkeit, Sicherheit, Datenschutzpraktiken oder Nutzungsbedingungen externer Websites und Drittanbieter übernehmen wir keine Verantwortung. Besucherinnen und Besucher sollten die jeweiligen Nutzungsbedingungen und Datenschutzhinweise dieser Anbieter prüfen, bevor sie deren Dienste nutzen.",
      ]},
      { heading: "Zulässige Nutzung",
        paragraphs: ["Besucherinnen und Besucher dürfen diese Website nicht missbräuchlich nutzen und nicht versuchen, ihre ordnungsgemäße Funktion zu beeinträchtigen."],
        list: [
          "Versuchen Sie nicht, unbefugten Zugriff auf die Website oder ihre Systeme zu erlangen.",
          "Laden Sie keinen schädlichen Code, Spam oder beleidigende Inhalte hoch und übertragen Sie solche Inhalte nicht.",
          "Nutzen Sie die Website nicht irreführend, betrügerisch oder rechtswidrig.",
          "Kopieren oder verwenden Sie Website-Materialien nicht in einer Weise, die iThemba Kuluntu, unsere Arbeit, Partner, Spenderinnen und Spender oder Gemeinschaften falsch darstellt.",
          "Verwenden Sie Projektgeschichten, Bilder oder Informationen aus der Gemeinschaft nicht respektlos, ausbeuterisch oder aus dem Zusammenhang gerissen.",
        ]},
      { heading: "Geistiges Eigentum", paragraphs: [
        "Soweit nicht anders angegeben, gehören Texte, Fotografien, Videos, Grafiken, Logos, Projektmaterialien, Designelemente und sonstige Inhalte dieser Website iThemba Kuluntu oder werden mit entsprechender Erlaubnis verwendet.",
        "Diese Materialien dürfen ohne vorherige schriftliche Zustimmung nicht kopiert, vervielfältigt, angepasst, verbreitet oder für andere Zwecke genutzt werden, außer soweit dies gesetzlich erlaubt ist.",
      ]},
      { heading: "Fotos und Geschichten aus der Gemeinschaft", paragraphs: [
        "Diese Website kann Fotografien, Videos und Geschichten aus der gemeinschaftsbasierten Arbeit enthalten. Diese Materialien werden veröffentlicht, um die Arbeit von iThemba Kuluntu respektvoll und transparent zu kommunizieren.",
        "Besucherinnen und Besucher dürfen Bilder aus der Gemeinschaft, Kinderbilder, Geschichten von Begünstigten oder Materialien aus der Feldarbeit nicht herunterladen, weiterverwenden, bearbeiten oder teilen, wenn dies irreführend, schädlich, ausbeuterisch oder vom ursprünglichen Zusammenhang gelöst geschieht.",
      ]},
      { heading: "Keine professionelle Beratung", paragraphs: [
        "Die Informationen auf dieser Website dienen der allgemeinen Information und Kommunikation. Sie stellen keine rechtliche, medizinische, finanzielle, steuerliche, ökologische, technische oder sonstige professionelle Beratung dar.",
        "Besucherinnen und Besucher sollten geeignete fachliche Beratung einholen, bevor sie Website-Informationen für rechtliche, finanzielle, steuerliche, Compliance-bezogene oder technische Entscheidungen nutzen.",
      ]},
      { heading: "Verfügbarkeit der Website", paragraphs: [
        "Wir bemühen uns, die Website zugänglich und funktionsfähig zu halten. Wir können jedoch nicht garantieren, dass sie jederzeit verfügbar, unterbrechungsfrei, fehlerfrei oder frei von technischen Problemen ist.",
        "Wir können Teile der Website jederzeit aktualisieren, ändern, vorübergehend aussetzen oder entfernen.",
      ]},
      { heading: "Haftungsbeschränkung", paragraphs: [
        "Wir haften nicht für Verluste oder Schäden, die durch die Nutzung dieser Website, das Vertrauen auf Website-Inhalte, eine vorübergehende Nichtverfügbarkeit der Website, externe Links oder Dienste Dritter entstehen, außer soweit eine Haftung gesetzlich nicht ausgeschlossen werden kann.",
        "Nichts in diesen Nutzungsbedingungen schließt eine Haftung aus, soweit ein solcher Ausschluss nach geltendem Recht nicht zulässig ist.",
      ]},
      { heading: "Änderungen dieser Nutzungsbedingungen", paragraphs: [
        "Wir können diese Nutzungsbedingungen von Zeit zu Zeit aktualisieren. Die jeweils aktuelle Fassung wird auf dieser Seite mit dem Datum der letzten Aktualisierung veröffentlicht.",
        "Wenn Besucherinnen und Besucher die Website nach Veröffentlichung von Änderungen weiter nutzen, gilt dies als Zustimmung zu den aktualisierten Nutzungsbedingungen.",
      ]},
    ],
    contact: { heading: "Kontakt", text: "Bei Fragen zu diesen Nutzungsbedingungen kontaktieren Sie uns bitte.", emailLabel: "E-Mail" },
    related: { heading: "Weitere rechtliche Seiten", links: [
      { label: "Impressum", to: "/impressum" },
      { label: "Datenschutzerklärung", to: "/datenschutz" },
      { label: "Cookie-Richtlinie", to: "/cookie-policy" },
    ]},
  },
  nl: {
    script: "Juridisch",
    main: "Gebruiksvoorwaarden",
    intro: "Deze gebruiksvoorwaarden leggen uit hoe bezoekers de website van iThemba Kuluntu mogen gebruiken.",
    lastUpdatedLabel: "Laatst bijgewerkt",
    lastUpdated: "juli 2026",
    sections: [
      { heading: "Over deze website", paragraphs: [
        "Deze website geeft informatie over iThemba Kuluntu, onze projecten die geworteld zijn in de gemeenschap, partnerschappen, media-aandacht, donatiemogelijkheden en ons werk van algemeen belang in Zuid-Afrika en Duitsland.",
        "Door deze website te gebruiken, gaat u ermee akkoord de website rechtmatig, respectvol en alleen voor het bedoelde doel te gebruiken.",
      ]},
      { heading: "Aanbieder van de website", paragraphs: [
        "Deze website wordt beheerd in verband met iThemba Kuluntu e.V. in Duitsland en iThemba Kuluntu NPC in Zuid-Afrika. De juridische gegevens van de aanbieder vindt u in het Impressum.",
      ]},
      { heading: "Gebruik van website-inhoud", paragraphs: [
        "De inhoud van deze website is bedoeld voor algemene informatie, bewustwording, communicatie met donateurs en het aangaan van partnerschappen.",
        "Bezoekers mogen openbaar toegankelijke pagina’s op een respectvolle en correcte manier lezen, delen en ernaar linken. Inhoud van deze website mag niet worden gekopieerd, gewijzigd, opnieuw gepubliceerd, verkeerd voorgesteld of gebruikt voor commerciële doeleinden, fondsenwerving of promotie zonder schriftelijke toestemming van iThemba Kuluntu.",
      ]},
      { heading: "Projectinformatie en impactgegevens", paragraphs: [
        "Wij doen redelijke inspanningen om projectinformatie, impactcijfers, partnerinformatie en programma-updates nauwkeurig en actueel te houden. Projectdetails kunnen echter veranderen wanneer behoeften in de gemeenschap, financiering, veldomstandigheden, uitvoeringstermijnen of rapportageprocessen veranderen.",
        "Impactcijfers, veldgegevens, klimaatgerelateerde schattingen en programma-informatie worden te goeder trouw gedeeld en kunnen in de loop van de tijd worden bijgewerkt, geverifieerd of gecorrigeerd.",
      ]},
      { heading: "Donaties", paragraphs: [
        "Donaties die via of in verband met deze website worden gedaan, ondersteunen het liefdadige en gemeenschapsgerichte werk van iThemba Kuluntu.",
        "Donatiebetalingen kunnen worden verwerkt via externe betaalproviders, bankplatforms of andere diensten van derden. De beschikbaarheid van specifieke betaalmethoden kan afhangen van de locatie van de donateur, de valuta en de technische systemen die op de website actief zijn.",
        "Donatiebewijzen, belastingcertificaten en Zuwendungsbescheinigungen worden afgegeven waar van toepassing en in overeenstemming met de relevante wettelijke, organisatorische en fiscale vereisten.",
        "Als een donatie per ongeluk is gedaan of als een donateur een vraag heeft over een donatie, neem dan zo snel mogelijk contact met ons op.",
      ]},
      { heading: "Links en diensten van derden", paragraphs: [
        "Deze website kan links bevatten naar externe websites, media-artikelen, YouTube-video’s, socialmediaplatforms, partnerwebsites, donatieplatforms of betaalproviders.",
        "Wij zijn niet verantwoordelijk voor de inhoud, beschikbaarheid, beveiliging, privacypraktijken of gebruiksvoorwaarden van externe websites of diensten van derden. Bezoekers dienen de betreffende voorwaarden en privacy-informatie van deze derden te bekijken voordat zij deze gebruiken.",
      ]},
      { heading: "Toegestaan gebruik",
        paragraphs: ["Bezoekers mogen deze website niet misbruiken of proberen de goede werking ervan te verstoren."],
        list: [
          "Probeer geen ongeautoriseerde toegang te krijgen tot de website of de systemen ervan.",
          "Upload of verzend geen schadelijke code, spam of beledigende inhoud.",
          "Gebruik de website niet op een misleidende, frauduleuze of onrechtmatige manier.",
          "Kopieer of hergebruik geen websitemateriaal op een manier die iThemba Kuluntu, ons werk, onze partners, donateurs of gemeenschappen verkeerd weergeeft.",
          "Gebruik projectverhalen, beelden of informatie uit gemeenschappen niet op een respectloze, uitbuitende of contextloze manier.",
        ]},
      { heading: "Intellectueel eigendom", paragraphs: [
        "Tenzij anders vermeld, behoren de teksten, foto’s, video’s, grafische elementen, logo’s, projectmaterialen, designelementen en andere inhoud op deze website toe aan iThemba Kuluntu of worden zij met toestemming gebruikt.",
        "Deze materialen mogen niet worden gekopieerd, gereproduceerd, aangepast, verspreid of voor andere doeleinden gebruikt zonder voorafgaande schriftelijke toestemming, behalve waar dit wettelijk is toegestaan.",
      ]},
      { heading: "Foto’s en verhalen uit de gemeenschap", paragraphs: [
        "Deze website kan foto’s, video’s en verhalen bevatten uit gemeenschapsgericht werk. Deze materialen worden gedeeld om het werk van iThemba Kuluntu respectvol en transparant te communiceren.",
        "Bezoekers mogen beelden uit gemeenschappen, foto’s van kinderen, verhalen van begunstigden of veldmaterialen niet downloaden, hergebruiken, bewerken of delen op een manier die misleidend, schadelijk, uitbuitend of losgekoppeld van de oorspronkelijke context is.",
      ]},
      { heading: "Geen professioneel advies", paragraphs: [
        "De informatie op deze website is bedoeld voor algemene bewustwording en communicatie. Zij vormt geen juridisch, medisch, financieel, fiscaal, milieu-, technisch of ander professioneel advies.",
        "Bezoekers dienen passend professioneel advies in te winnen voordat zij website-informatie gebruiken voor juridische, financiële, fiscale, compliancegerelateerde of technische beslissingen.",
      ]},
      { heading: "Beschikbaarheid van de website", paragraphs: [
        "Wij streven ernaar de website toegankelijk en goed werkend te houden, maar wij garanderen niet dat deze altijd beschikbaar, ononderbroken, foutloos of vrij van technische problemen zal zijn.",
        "Wij kunnen delen van de website op elk moment bijwerken, wijzigen, tijdelijk opschorten of verwijderen.",
      ]},
      { heading: "Beperking van aansprakelijkheid", paragraphs: [
        "Wij zijn niet aansprakelijk voor verliezen of schade die voortkomen uit het gebruik van deze website, het vertrouwen op website-inhoud, tijdelijke onbeschikbaarheid van de website, externe links of diensten van derden, behalve waar aansprakelijkheid wettelijk niet kan worden uitgesloten.",
        "Niets in deze gebruiksvoorwaarden sluit aansprakelijkheid uit waar uitsluiting volgens toepasselijk recht niet is toegestaan.",
      ]},
      { heading: "Wijzigingen van deze voorwaarden", paragraphs: [
        "Wij kunnen deze gebruiksvoorwaarden van tijd tot tijd bijwerken. De bijgewerkte versie wordt op deze pagina gepubliceerd met de laatste datum van wijziging.",
        "Als bezoekers de website blijven gebruiken nadat wijzigingen zijn gepubliceerd, betekent dit dat zij de bijgewerkte gebruiksvoorwaarden accepteren.",
      ]},
    ],
    contact: { heading: "Contact", text: "Neem contact met ons op als u vragen heeft over deze gebruiksvoorwaarden.", emailLabel: "E-mail" },
    related: { heading: "Gerelateerde juridische pagina’s", links: [
      { label: "Impressum", to: "/impressum" },
      { label: "Privacyverklaring", to: "/datenschutz" },
      { label: "Cookiebeleid", to: "/cookie-policy" },
    ]},
  },
};

function EmailLink() {
  return (
    <a href={`mailto:${EMAIL}`} className="text-[var(--ithemba-blue)] hover:underline">
      {EMAIL}
    </a>
  );
}

function TermsPage() {
  const { lang } = useLang();
  const c = COPY[lang];
  return (
    <div className="bg-[var(--ithemba-cream)]">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <header className="mb-10">
          <div className="hand-eyebrow">{c.script}</div>
          <h1 className="mt-1 font-display text-4xl font-bold text-[var(--ithemba-blue-dark)] md:text-5xl">
            {c.main}
          </h1>
          <p className="mt-3 text-muted-foreground">{c.intro}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground/80">
            {c.lastUpdatedLabel}: {c.lastUpdated}
          </p>
        </header>

        <div className="space-y-8">
          {c.sections.map((s) => (
            <section key={s.heading} className="border-t border-[var(--ithemba-blue)]/10 pt-6">
              <h2 className="font-display text-xl font-bold text-[var(--ithemba-blue-dark)]">
                {s.heading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {s.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                {s.list && (
                  <ul className="list-disc space-y-1.5 pl-5">
                    {s.list.map((li, i) => <li key={i}>{li}</li>)}
                  </ul>
                )}
              </div>
            </section>
          ))}

          <section className="border-t border-[var(--ithemba-blue)]/10 pt-6">
            <h2 className="font-display text-xl font-bold text-[var(--ithemba-blue-dark)]">
              {c.contact.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.contact.text}</p>
            <p className="mt-2 text-sm">
              <span className="font-semibold text-foreground">{c.contact.emailLabel}:</span>{" "}
              <EmailLink />
            </p>
          </section>

          <section className="border-t border-[var(--ithemba-blue)]/10 pt-6">
            <h2 className="font-display text-xl font-bold text-[var(--ithemba-blue-dark)]">
              {c.related.heading}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {c.related.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[var(--ithemba-blue)] hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/terms")({ component: TermsPage });
