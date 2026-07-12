import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/components/site/LanguageProvider";
import type { Lang } from "@/data/content";

type Section = { heading: string; paragraphs: string[] };
type DonationTermsCopy = {
  script: string;
  main: string;
  intro: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  sections: Section[];
  contact: { heading: string; text: string; emailLabel: string };
  related: { heading: string; links: { label: string; to: string }[] };
};

const EMAIL = "info@ithembakuluntu.org";

const COPY: Record<Lang, DonationTermsCopy> = {
  en: {
    script: "Legal",
    main: "Donation Terms",
    intro:
      "These Donation Terms explain how donations to iThemba Kuluntu are received, allocated, receipted and managed.",
    lastUpdatedLabel: "Last updated",
    lastUpdated: "July 2026",
    sections: [
      { heading: "About these Donation Terms", paragraphs: [
        "These Donation Terms apply to donations made through or in connection with the iThemba Kuluntu website, including monthly donations, one-time donations, bank transfers and other donation methods made available from time to time.",
        "By making a donation, you agree that your donation will be used to support the charitable and community-rooted work of iThemba Kuluntu, subject to these Donation Terms and any applicable legal, tax and payment-processing requirements.",
      ]},
      { heading: "Organisations receiving and using donations", paragraphs: [
        "Donations may be received by iThemba Kuluntu e.V. in Germany and/or iThemba Kuluntu NPC in South Africa, depending on the donation method, donor location, payment channel and intended use of funds.",
        "iThemba Kuluntu e.V. supports the work of iThemba Kuluntu in South Africa through donations, partnerships, communication and fundraising. The operational project work in South Africa is carried out by iThemba Kuluntu NPC.",
        "Legal provider details are available in the Impressum.",
      ]},
      { heading: "Nature of donations", paragraphs: [
        "Donations are voluntary contributions made to support the charitable, community-development and public-benefit work of iThemba Kuluntu.",
        "A donation does not create ownership, control, voting rights, delivery rights or a right to receive goods or services in return. Donations are not payments for a product or service.",
        "Where a donor receives general updates, newsletters, project reports or thank-you communication, these are provided for transparency and relationship-building and do not constitute a commercial benefit.",
      ]},
      { heading: "Monthly donations", paragraphs: [
        "Monthly donations are recurring donations that help iThemba Kuluntu plan and sustain ongoing work with more stability.",
        "The selected donation amount will be charged according to the recurring payment method chosen by the donor, where recurring payments are available.",
        "A donor may cancel a monthly donation by using the cancellation tools provided by the relevant payment provider, where available, or by contacting iThemba Kuluntu directly.",
        "Cancellation requests should be made before the next scheduled payment date. Depending on the payment provider or banking process, a cancellation may take a reasonable processing time before it becomes effective.",
      ]},
      { heading: "One-time donations", paragraphs: [
        "One-time donations are processed once for the amount selected by the donor.",
        "One-time donations may be directed to a project area where this option is available, or may be given where support is needed most.",
      ]},
      { heading: "Donation allocation", paragraphs: [
        "Donors may be able to indicate a preferred project area, such as early childhood development, safe water, food security, animal welfare, disaster relief or general support.",
        "We make reasonable efforts to respect donor preferences. However, unless a separate written agreement applies, iThemba Kuluntu may allocate donations where they are most needed within its charitable and public-benefit purposes.",
        "This flexibility helps us respond responsibly to changing community needs, emergencies, project timing, implementation costs, field realities and funding gaps.",
        "If a selected project is fully funded, delayed, completed, changed or no longer able to receive funds in the expected way, the donation may be used for a closely related project area or for the wider charitable work of iThemba Kuluntu.",
      ]},
      { heading: "Donation receipts and tax certificates", paragraphs: [
        "Donation receipts, tax certificates and donation confirmations are issued where applicable and where the relevant legal, tax and organisational requirements are met.",
        "Donors are responsible for providing accurate information needed to issue a donation receipt or tax certificate, including name, address, email address and any additional information required by law or by the relevant tax authority.",
        "iThemba Kuluntu cannot guarantee that every donation will be tax-deductible for every donor. Tax treatment depends on the donor’s country, tax residence, personal or organisational circumstances, donation method and applicable law.",
        "Donors should seek their own tax advice where needed.",
      ]},
      { heading: "Donations through iThemba Kuluntu e.V. in Germany", paragraphs: [
        "iThemba Kuluntu e.V. is registered in Germany and can issue Zuwendungsbescheinigungen for eligible donations where the legal requirements are met.",
        "Zuwendungsbescheinigungen are issued based on the applicable German nonprofit and tax requirements, the donor information provided and the donation records available to iThemba Kuluntu e.V.",
        "Donors who require a Zuwendungsbescheinigung should ensure that their full name, address and contact details are provided correctly.",
        "For bank transfers, the donor should use a clear payment reference where possible, such as the donor name and intended donation purpose.",
      ]},
      { heading: "Donations through iThemba Kuluntu NPC in South Africa", paragraphs: [
        "iThemba Kuluntu NPC has Public Benefit Organisation status in South Africa and can issue Section 18A certificates for eligible donations where the legal requirements are met.",
        "Section 18A certificates are issued based on the applicable South African tax requirements, the donor information provided and the donation records available to iThemba Kuluntu NPC.",
        "Donors who require a Section 18A certificate should provide the information required for certificate issuing, including their correct legal name, address, contact details and any other information required by applicable law.",
        "Not every payment, sponsorship, grant, in-kind contribution or project support arrangement automatically qualifies for a Section 18A certificate. Eligibility depends on the nature of the contribution and applicable requirements.",
      ]},
      { heading: "International donors", paragraphs: [
        "Donors outside Germany and South Africa are responsible for checking whether their donation is tax-deductible in their own country.",
        "iThemba Kuluntu may provide donation confirmations where appropriate, but cannot guarantee recognition by foreign tax authorities.",
      ]},
      { heading: "Payment providers and bank transfers", paragraphs: [
        "Donations may be processed through external payment providers, banking platforms, PayPal, card providers, bank transfer or other donation systems made available on the website.",
        "External payment providers may apply their own terms, fees, processing times, refund rules, security measures and privacy practices.",
        "iThemba Kuluntu is not responsible for technical failures, delays, declined payments, provider fees or service interruptions caused by third-party payment systems.",
        "Bank transfer donations are recorded once received and identified in the relevant account.",
      ]},
      { heading: "Refunds and payment errors", paragraphs: [
        "Donations are generally final once processed.",
        "If a donation was made in error, duplicated, processed incorrectly or appears to be unauthorised, the donor should contact iThemba Kuluntu as soon as possible.",
        "Refund requests will be reviewed case by case. Where a refund is approved, processing times and any payment provider limitations may apply.",
        "iThemba Kuluntu may be unable to refund donations that have already been allocated, spent, receipted for tax purposes or transferred to project implementation, unless required by law.",
      ]},
      { heading: "Corporate, foundation and restricted funding", paragraphs: [
        "Corporate donations, foundation grants, project sponsorships and restricted funding arrangements may be governed by separate written agreements, grant letters, partnership terms or reporting requirements.",
        "Where a separate written agreement exists, that agreement will apply in addition to these Donation Terms. If there is a conflict, the written agreement will usually take priority for that specific funding arrangement.",
      ]},
      { heading: "In-kind donations", paragraphs: [
        "In-kind donations, such as goods, materials, equipment or services, are accepted only where they are suitable for the work and can be received, stored, used or distributed responsibly.",
        "iThemba Kuluntu may decline in-kind donations that are unsuitable, unsafe, impractical, expired, damaged, too costly to transport or not aligned with current needs.",
        "Tax treatment of in-kind donations depends on applicable law and the documentation available.",
      ]},
      { heading: "Project updates and reporting", paragraphs: [
        "iThemba Kuluntu aims to communicate openly about its work through updates, stories, photos, reports, newsletters or direct donor communication where appropriate.",
        "General donors may receive public or general updates. Detailed reporting may be provided for larger donations, project sponsorships, grants or formal partnerships where agreed.",
        "Project updates may depend on field access, connectivity, consent, staff capacity, reporting timelines and the safety and dignity of community members.",
      ]},
      { heading: "No guarantee of specific outcomes", paragraphs: [
        "Donations support practical community work, but iThemba Kuluntu cannot guarantee a specific individual outcome, project result, timeline or beneficiary allocation unless this is agreed in writing.",
        "Field conditions, emergencies, weather, access, supply chains, community needs, funding levels and other practical realities can affect implementation.",
      ]},
      { heading: "Donor communication", paragraphs: [
        "Donors may receive communication related to their donation, receipts, reporting, project updates or future support opportunities.",
        "Donors can contact iThemba Kuluntu if they need their details updated, want to change their communication preferences or wish to ask a question about their donation.",
      ]},
      { heading: "Data protection", paragraphs: [
        "Personal information provided in connection with donations is used to process donations, issue receipts or certificates, communicate with donors and meet legal, tax, accounting and reporting obligations.",
        "Further information about data processing will be provided in the Privacy Policy.",
      ]},
      { heading: "Changes to these Donation Terms", paragraphs: [
        "iThemba Kuluntu may update these Donation Terms from time to time.",
        "The latest version will be published on this page with the most recent update date.",
      ]},
    ],
    contact: { heading: "Contact", text: "For questions about donations, receipts, certificates, monthly giving or these Donation Terms, please contact us.", emailLabel: "E-mail" },
    related: { heading: "Related legal pages", links: [
      { label: "Impressum", to: "/impressum" },
      { label: "Terms of Use", to: "/terms" },
      { label: "Privacy Policy", to: "/datenschutz" },
    ]},
  },
  de: {
    script: "Rechtliches",
    main: "Spendenbedingungen",
    intro:
      "Diese Spendenbedingungen erklären, wie Spenden an iThemba Kuluntu entgegengenommen, zugeordnet, bestätigt und verwaltet werden.",
    lastUpdatedLabel: "Zuletzt aktualisiert",
    lastUpdated: "Juli 2026",
    sections: [
      { heading: "Über diese Spendenbedingungen", paragraphs: [
        "Diese Spendenbedingungen gelten für Spenden, die über die Website von iThemba Kuluntu oder im Zusammenhang mit ihr geleistet werden. Dazu gehören monatliche Spenden, einmalige Spenden, Banküberweisungen und weitere Spendenwege, die von Zeit zu Zeit angeboten werden.",
        "Mit einer Spende erklären Sie sich damit einverstanden, dass Ihre Spende zur Unterstützung der gemeinnützigen und gemeinschaftsverwurzelten Arbeit von iThemba Kuluntu verwendet wird, vorbehaltlich dieser Spendenbedingungen sowie der jeweils geltenden rechtlichen, steuerlichen und zahlungsbezogenen Anforderungen.",
      ]},
      { heading: "Organisationen, die Spenden entgegennehmen und verwenden", paragraphs: [
        "Spenden können je nach Spendenweg, Standort der Spenderin oder des Spenders, Zahlungskanal und vorgesehenem Verwendungszweck von iThemba Kuluntu e.V. in Deutschland und/oder iThemba Kuluntu NPC in Südafrika entgegengenommen werden.",
        "iThemba Kuluntu e.V. unterstützt die Arbeit von iThemba Kuluntu in Südafrika durch Spenden, Partnerschaften, Kommunikation und Fördermittelarbeit. Die operative Projektarbeit in Südafrika wird von iThemba Kuluntu NPC durchgeführt.",
        "Die rechtlichen Anbieterangaben finden Sie im Impressum.",
      ]},
      { heading: "Art der Spende", paragraphs: [
        "Spenden sind freiwillige Zuwendungen zur Unterstützung der gemeinnützigen, gemeinschaftsorientierten und dem öffentlichen Wohl dienenden Arbeit von iThemba Kuluntu.",
        "Eine Spende begründet kein Eigentum, keine Kontrolle, keine Stimmrechte, keinen Anspruch auf Lieferung und keinen Anspruch auf Waren oder Dienstleistungen als Gegenleistung. Spenden sind keine Zahlungen für ein Produkt oder eine Dienstleistung.",
        "Wenn Spenderinnen und Spender allgemeine Updates, Newsletter, Projektberichte oder Dankesnachrichten erhalten, dienen diese der Transparenz und Beziehungspflege und stellen keinen kommerziellen Vorteil dar.",
      ]},
      { heading: "Monatliche Spenden", paragraphs: [
        "Monatliche Spenden sind wiederkehrende Spenden, die iThemba Kuluntu helfen, laufende Arbeit stabiler zu planen und verlässlich fortzuführen.",
        "Der gewählte Spendenbetrag wird entsprechend der von der Spenderin oder dem Spender ausgewählten wiederkehrenden Zahlungsmethode abgebucht, sofern wiederkehrende Zahlungen verfügbar sind.",
        "Eine monatliche Spende kann über die vom jeweiligen Zahlungsanbieter bereitgestellten Kündigungsfunktionen beendet werden, sofern diese verfügbar sind, oder durch direkte Kontaktaufnahme mit iThemba Kuluntu.",
        "Kündigungswünsche sollten vor dem nächsten geplanten Abbuchungstermin mitgeteilt werden. Je nach Zahlungsanbieter oder Bankprozess kann eine Kündigung eine angemessene Bearbeitungszeit benötigen, bevor sie wirksam wird.",
      ]},
      { heading: "Einmalige Spenden", paragraphs: [
        "Einmalige Spenden werden einmalig in der von der Spenderin oder dem Spender ausgewählten Höhe verarbeitet.",
        "Einmalige Spenden können einem Projektbereich zugeordnet werden, sofern diese Option verfügbar ist, oder dort eingesetzt werden, wo Unterstützung am dringendsten gebraucht wird.",
      ]},
      { heading: "Zuordnung von Spenden", paragraphs: [
        "Spenderinnen und Spender können gegebenenfalls einen bevorzugten Projektbereich angeben, zum Beispiel frühe Kindheit, sicheres Wasser, Ernährungssicherheit, Tierschutz, Nothilfe oder allgemeine Unterstützung.",
        "Wir bemühen uns, solche Wünsche nach Möglichkeit zu berücksichtigen. Sofern keine gesonderte schriftliche Vereinbarung besteht, kann iThemba Kuluntu Spenden jedoch innerhalb der gemeinnützigen und dem öffentlichen Wohl dienenden Zwecke dort einsetzen, wo sie am dringendsten gebraucht werden.",
        "Diese Flexibilität hilft uns, verantwortungsvoll auf veränderte Bedarfe in den Gemeinschaften, Notfälle, Projektzeiträume, Umsetzungskosten, Feldrealitäten und Finanzierungslücken zu reagieren.",
        "Wenn ein ausgewähltes Projekt vollständig finanziert, verzögert, abgeschlossen, verändert oder nicht mehr wie erwartet finanzierbar ist, kann die Spende für einen eng verwandten Projektbereich oder für die weitere gemeinnützige Arbeit von iThemba Kuluntu verwendet werden.",
      ]},
      { heading: "Spendenbestätigungen und Steuerbescheinigungen", paragraphs: [
        "Spendenbestätigungen, Steuerbescheinigungen und Zuwendungsbescheinigungen werden ausgestellt, soweit dies anwendbar ist und die jeweiligen rechtlichen, steuerlichen und organisatorischen Voraussetzungen erfüllt sind.",
        "Spenderinnen und Spender sind dafür verantwortlich, die für eine Spendenbestätigung oder Steuerbescheinigung erforderlichen Angaben korrekt bereitzustellen, einschließlich Name, Anschrift, E-Mail-Adresse und weiterer gesetzlich oder steuerlich erforderlicher Informationen.",
        "iThemba Kuluntu kann nicht garantieren, dass jede Spende für jede Spenderin oder jeden Spender steuerlich abzugsfähig ist. Die steuerliche Behandlung hängt vom Land, steuerlichen Wohnsitz, persönlichen oder organisatorischen Umständen, Spendenweg und geltendem Recht ab.",
        "Spenderinnen und Spender sollten bei Bedarf eigene steuerliche Beratung einholen.",
      ]},
      { heading: "Spenden über iThemba Kuluntu e.V. in Deutschland", paragraphs: [
        "iThemba Kuluntu e.V. ist in Deutschland registriert und kann für abzugsfähige Spenden Zuwendungsbescheinigungen ausstellen, soweit die gesetzlichen Voraussetzungen erfüllt sind.",
        "Zuwendungsbescheinigungen werden auf Grundlage der geltenden deutschen gemeinnützigkeits- und steuerrechtlichen Anforderungen, der von der Spenderin oder dem Spender bereitgestellten Angaben und der bei iThemba Kuluntu e.V. vorhandenen Spendennachweise ausgestellt.",
        "Spenderinnen und Spender, die eine Zuwendungsbescheinigung benötigen, sollten sicherstellen, dass ihr vollständiger Name, ihre Anschrift und ihre Kontaktdaten korrekt angegeben sind.",
        "Bei Banküberweisungen sollte nach Möglichkeit ein klarer Verwendungszweck angegeben werden, zum Beispiel der Name der Spenderin oder des Spenders und der gewünschte Spendenzweck.",
      ]},
      { heading: "Spenden über iThemba Kuluntu NPC in Südafrika", paragraphs: [
        "iThemba Kuluntu NPC verfügt in Südafrika über den Status einer Public Benefit Organisation und kann für abzugsfähige Spenden Section 18A Certificates ausstellen, soweit die gesetzlichen Voraussetzungen erfüllt sind.",
        "Section 18A Certificates werden auf Grundlage der geltenden südafrikanischen steuerrechtlichen Anforderungen, der von der Spenderin oder dem Spender bereitgestellten Angaben und der bei iThemba Kuluntu NPC vorhandenen Spendennachweise ausgestellt.",
        "Spenderinnen und Spender, die ein Section 18A Certificate benötigen, sollten die für die Ausstellung erforderlichen Angaben bereitstellen, einschließlich korrektem rechtlichen Namen, Anschrift, Kontaktdaten und weiteren gesetzlich erforderlichen Informationen.",
        "Nicht jede Zahlung, Förderung, Sachleistung, Projektunterstützung oder Partnerschaftsleistung qualifiziert automatisch für ein Section 18A Certificate. Die Berechtigung hängt von der Art der Zuwendung und den geltenden Anforderungen ab.",
      ]},
      { heading: "Internationale Spenderinnen und Spender", paragraphs: [
        "Spenderinnen und Spender außerhalb Deutschlands und Südafrikas sind selbst dafür verantwortlich zu prüfen, ob ihre Spende in ihrem Land steuerlich abzugsfähig ist.",
        "iThemba Kuluntu kann gegebenenfalls Spendenbestätigungen bereitstellen, kann jedoch keine Anerkennung durch ausländische Steuerbehörden garantieren.",
      ]},
      { heading: "Zahlungsanbieter und Banküberweisungen", paragraphs: [
        "Spenden können über externe Zahlungsanbieter, Bankplattformen, PayPal, Kartenanbieter, Banküberweisung oder andere auf der Website angebotene Spendensysteme abgewickelt werden.",
        "Externe Zahlungsanbieter können eigene Bedingungen, Gebühren, Bearbeitungszeiten, Erstattungsregeln, Sicherheitsmaßnahmen und Datenschutzpraktiken anwenden.",
        "iThemba Kuluntu ist nicht verantwortlich für technische Ausfälle, Verzögerungen, abgelehnte Zahlungen, Anbietergebühren oder Unterbrechungen, die durch Zahlungssysteme Dritter verursacht werden.",
        "Spenden per Banküberweisung werden erfasst, sobald sie eingegangen und dem jeweiligen Konto zugeordnet werden konnten.",
      ]},
      { heading: "Rückerstattungen und Zahlungsfehler", paragraphs: [
        "Spenden sind nach der Verarbeitung grundsätzlich endgültig.",
        "Wenn eine Spende versehentlich, doppelt, fehlerhaft oder offenbar unautorisiert erfolgt ist, sollte die Spenderin oder der Spender iThemba Kuluntu so schnell wie möglich kontaktieren.",
        "Rückerstattungsanfragen werden im Einzelfall geprüft. Wenn eine Rückerstattung genehmigt wird, können Bearbeitungszeiten und Einschränkungen des Zahlungsanbieters gelten.",
        "iThemba Kuluntu kann möglicherweise keine Spenden zurückerstatten, die bereits zugeordnet, verwendet, steuerlich bescheinigt oder in die Projektumsetzung weitergeleitet wurden, sofern keine gesetzliche Pflicht zur Rückerstattung besteht.",
      ]},
      { heading: "Unternehmensspenden, Stiftungen und zweckgebundene Förderung", paragraphs: [
        "Unternehmensspenden, Stiftungsförderungen, Projektsponsorings und zweckgebundene Fördervereinbarungen können durch gesonderte schriftliche Vereinbarungen, Förderzusagen, Partnerschaftsbedingungen oder Berichtspflichten geregelt werden.",
        "Wenn eine gesonderte schriftliche Vereinbarung besteht, gilt diese zusätzlich zu diesen Spendenbedingungen. Bei Widersprüchen hat die schriftliche Vereinbarung für die jeweilige Förderung in der Regel Vorrang.",
      ]},
      { heading: "Sachspenden", paragraphs: [
        "Sachspenden, zum Beispiel Waren, Materialien, Ausrüstung oder Dienstleistungen, werden nur angenommen, wenn sie für die Arbeit geeignet sind und verantwortungsvoll entgegengenommen, gelagert, genutzt oder weitergegeben werden können.",
        "iThemba Kuluntu kann Sachspenden ablehnen, wenn sie ungeeignet, unsicher, unpraktisch, abgelaufen, beschädigt, zu teuer im Transport oder nicht mit aktuellen Bedarfen vereinbar sind.",
        "Die steuerliche Behandlung von Sachspenden hängt vom geltenden Recht und den verfügbaren Nachweisen ab.",
      ]},
      { heading: "Projektupdates und Berichterstattung", paragraphs: [
        "iThemba Kuluntu bemüht sich, offen über die Arbeit zu berichten, etwa durch Updates, Geschichten, Fotos, Berichte, Newsletter oder direkte Spenderkommunikation, sofern dies angemessen ist.",
        "Allgemeine Spenderinnen und Spender können öffentliche oder allgemeine Updates erhalten. Detailliertere Berichte können bei größeren Spenden, Projektsponsorings, Förderungen oder formellen Partnerschaften bereitgestellt werden, sofern dies vereinbart wurde.",
        "Projektupdates können von Feldzugang, Konnektivität, Einwilligungen, Personalkapazitäten, Berichtszeiträumen sowie der Sicherheit und Würde der Gemeindemitglieder abhängen.",
      ]},
      { heading: "Keine Garantie für bestimmte Ergebnisse", paragraphs: [
        "Spenden unterstützen praktische Arbeit in Gemeinschaften. iThemba Kuluntu kann jedoch kein bestimmtes individuelles Ergebnis, Projektergebnis, keinen bestimmten Zeitplan und keine bestimmte Zuordnung zu einzelnen Begünstigten garantieren, sofern dies nicht schriftlich vereinbart wurde.",
        "Feldbedingungen, Notfälle, Wetter, Zugang, Lieferketten, Bedarfe in den Gemeinschaften, Finanzierungshöhe und weitere praktische Realitäten können die Umsetzung beeinflussen.",
      ]},
      { heading: "Spenderkommunikation", paragraphs: [
        "Spenderinnen und Spender können Kommunikation im Zusammenhang mit ihrer Spende, Spendenbestätigungen, Bescheinigungen, Berichten, Projektupdates oder künftigen Unterstützungsmöglichkeiten erhalten.",
        "Spenderinnen und Spender können iThemba Kuluntu kontaktieren, wenn sie ihre Daten aktualisieren möchten, ihre Kommunikationseinstellungen ändern wollen oder Fragen zu ihrer Spende haben.",
      ]},
      { heading: "Datenschutz", paragraphs: [
        "Personenbezogene Daten, die im Zusammenhang mit Spenden bereitgestellt werden, werden verwendet, um Spenden zu verarbeiten, Spendenbestätigungen oder Bescheinigungen auszustellen, mit Spenderinnen und Spendern zu kommunizieren und rechtliche, steuerliche, buchhalterische und berichtsbezogene Pflichten zu erfüllen.",
        "Weitere Informationen zur Verarbeitung personenbezogener Daten werden in der Datenschutzerklärung bereitgestellt.",
      ]},
      { heading: "Änderungen dieser Spendenbedingungen", paragraphs: [
        "iThemba Kuluntu kann diese Spendenbedingungen von Zeit zu Zeit aktualisieren.",
        "Die jeweils aktuelle Fassung wird auf dieser Seite mit dem Datum der letzten Aktualisierung veröffentlicht.",
      ]},
    ],
    contact: { heading: "Kontakt", text: "Bei Fragen zu Spenden, Spendenbestätigungen, Bescheinigungen, monatlichen Spenden oder diesen Spendenbedingungen kontaktieren Sie uns bitte.", emailLabel: "E-Mail" },
    related: { heading: "Weitere rechtliche Seiten", links: [
      { label: "Impressum", to: "/impressum" },
      { label: "Nutzungsbedingungen", to: "/terms" },
      { label: "Datenschutzerklärung", to: "/datenschutz" },
    ]},
  },
  nl: {
    script: "Juridisch",
    main: "Donatievoorwaarden",
    intro:
      "Deze donatievoorwaarden leggen uit hoe donaties aan iThemba Kuluntu worden ontvangen, toegewezen, bevestigd en beheerd.",
    lastUpdatedLabel: "Laatst bijgewerkt",
    lastUpdated: "juli 2026",
    sections: [
      { heading: "Over deze donatievoorwaarden", paragraphs: [
        "Deze donatievoorwaarden gelden voor donaties die via de website van iThemba Kuluntu of in verband daarmee worden gedaan. Dit omvat maandelijkse donaties, eenmalige donaties, bankoverschrijvingen en andere donatiemethoden die van tijd tot tijd beschikbaar worden gesteld.",
        "Door een donatie te doen, gaat u ermee akkoord dat uw donatie wordt gebruikt ter ondersteuning van het liefdadige en gemeenschapsgerichte werk van iThemba Kuluntu, met inachtneming van deze donatievoorwaarden en de toepasselijke wettelijke, fiscale en betalingsverwerkingsvereisten.",
      ]},
      { heading: "Organisaties die donaties ontvangen en gebruiken", paragraphs: [
        "Donaties kunnen worden ontvangen door iThemba Kuluntu e.V. in Duitsland en/of iThemba Kuluntu NPC in Zuid-Afrika, afhankelijk van de donatiemethode, de locatie van de donateur, het betaalkanaal en het beoogde gebruik van de middelen.",
        "iThemba Kuluntu e.V. ondersteunt het werk van iThemba Kuluntu in Zuid-Afrika via donaties, partnerschappen, communicatie en fondsenwerving. De operationele projectuitvoering in Zuid-Afrika wordt verzorgd door iThemba Kuluntu NPC.",
        "Juridische gegevens van de aanbieder vindt u in het Impressum.",
      ]},
      { heading: "Aard van donaties", paragraphs: [
        "Donaties zijn vrijwillige bijdragen ter ondersteuning van het liefdadige, gemeenschapsgerichte en algemeen nuttige werk van iThemba Kuluntu.",
        "Een donatie geeft geen eigendom, zeggenschap, stemrecht, recht op levering of recht op goederen of diensten in ruil voor de donatie. Donaties zijn geen betalingen voor een product of dienst.",
        "Wanneer donateurs algemene updates, nieuwsbrieven, projectverslagen of bedankberichten ontvangen, dienen deze voor transparantie en relatiebeheer en vormen zij geen commerciële tegenprestatie.",
      ]},
      { heading: "Maandelijkse donaties", paragraphs: [
        "Maandelijkse donaties zijn terugkerende bijdragen die iThemba Kuluntu helpen om lopend werk stabieler te plannen en duurzaam voort te zetten.",
        "Het gekozen donatiebedrag wordt afgeschreven volgens de terugkerende betaalmethode die de donateur heeft gekozen, voor zover terugkerende betalingen beschikbaar zijn.",
        "Een donateur kan een maandelijkse donatie stopzetten via de annuleringsmogelijkheden van de betreffende betaalprovider, indien beschikbaar, of door rechtstreeks contact op te nemen met iThemba Kuluntu.",
        "Annuleringsverzoeken moeten bij voorkeur vóór de volgende geplande betaaldatum worden doorgegeven. Afhankelijk van de betaalprovider of bankprocedure kan het enige verwerkingstijd kosten voordat de annulering ingaat.",
      ]},
      { heading: "Eenmalige donaties", paragraphs: [
        "Eenmalige donaties worden één keer verwerkt voor het bedrag dat de donateur heeft gekozen.",
        "Eenmalige donaties kunnen aan een projectgebied worden toegewezen wanneer die optie beschikbaar is, of worden gegeven voor waar steun het hardst nodig is.",
      ]},
      { heading: "Toewijzing van donaties", paragraphs: [
        "Donateurs kunnen, waar beschikbaar, een voorkeur aangeven voor een projectgebied, zoals vroege kinderontwikkeling, veilig water, voedselzekerheid, dierenwelzijn, noodhulp of algemene ondersteuning.",
        "Wij doen redelijke inspanningen om voorkeuren van donateurs te respecteren. Tenzij er een aparte schriftelijke overeenkomst bestaat, mag iThemba Kuluntu donaties echter inzetten waar zij het hardst nodig zijn binnen haar liefdadige en algemeen nuttige doelen.",
        "Deze flexibiliteit helpt ons verantwoord te reageren op veranderende behoeften in gemeenschappen, noodsituaties, projecttiming, uitvoeringskosten, veldrealiteiten en financieringstekorten.",
        "Als een gekozen project volledig gefinancierd, vertraagd, afgerond, gewijzigd of niet langer op de verwachte manier uitvoerbaar is, kan de donatie worden gebruikt voor een nauw verwant projectgebied of voor het bredere liefdadige werk van iThemba Kuluntu.",
      ]},
      { heading: "Donatiebewijzen en fiscale certificaten", paragraphs: [
        "Donatiebewijzen, fiscale certificaten en donatiebevestigingen worden verstrekt waar van toepassing en waar aan de relevante wettelijke, fiscale en organisatorische voorwaarden is voldaan.",
        "Donateurs zijn verantwoordelijk voor het correct verstrekken van de gegevens die nodig zijn om een donatiebewijs of fiscaal certificaat uit te geven, waaronder naam, adres, e-mailadres en eventuele aanvullende gegevens die wettelijk of door de betreffende belastingdienst worden vereist.",
        "iThemba Kuluntu kan niet garanderen dat elke donatie voor elke donateur fiscaal aftrekbaar is. De fiscale behandeling hangt af van het land, de fiscale woonplaats, persoonlijke of organisatorische omstandigheden, de donatiemethode en het toepasselijke recht.",
        "Donateurs dienen waar nodig zelf fiscaal advies in te winnen.",
      ]},
      { heading: "Donaties via iThemba Kuluntu e.V. in Duitsland", paragraphs: [
        "iThemba Kuluntu e.V. is geregistreerd in Duitsland en kan Zuwendungsbescheinigungen uitgeven voor daarvoor in aanmerking komende donaties, wanneer aan de wettelijke voorwaarden is voldaan.",
        "Zuwendungsbescheinigungen worden uitgegeven op basis van de toepasselijke Duitse non-profit- en belastingregels, de gegevens die door de donateur zijn verstrekt en de donatieadministratie die beschikbaar is bij iThemba Kuluntu e.V.",
        "Donateurs die een Zuwendungsbescheinigung nodig hebben, moeten ervoor zorgen dat hun volledige naam, adres en contactgegevens correct zijn opgegeven.",
        "Bij bankoverschrijvingen moet de donateur waar mogelijk een duidelijke betalingsomschrijving gebruiken, zoals de naam van de donateur en het beoogde donatiedoel.",
      ]},
      { heading: "Donaties via iThemba Kuluntu NPC in Zuid-Afrika", paragraphs: [
        "iThemba Kuluntu NPC heeft in Zuid-Afrika de status van Public Benefit Organisation en kan Section 18A-certificaten uitgeven voor daarvoor in aanmerking komende donaties, wanneer aan de wettelijke voorwaarden is voldaan.",
        "Section 18A-certificaten worden uitgegeven op basis van de toepasselijke Zuid-Afrikaanse belastingregels, de gegevens die door de donateur zijn verstrekt en de donatieadministratie die beschikbaar is bij iThemba Kuluntu NPC.",
        "Donateurs die een Section 18A-certificaat nodig hebben, moeten de gegevens verstrekken die nodig zijn voor de uitgifte van het certificaat, waaronder hun correcte wettelijke naam, adres, contactgegevens en eventuele andere gegevens die volgens het toepasselijke recht vereist zijn.",
        "Niet elke betaling, sponsoring, subsidie, bijdrage in natura of projectondersteuning komt automatisch in aanmerking voor een Section 18A-certificaat. De geschiktheid hangt af van de aard van de bijdrage en de toepasselijke vereisten.",
      ]},
      { heading: "Internationale donateurs", paragraphs: [
        "Donateurs buiten Duitsland en Zuid-Afrika zijn zelf verantwoordelijk om na te gaan of hun donatie in hun eigen land fiscaal aftrekbaar is.",
        "iThemba Kuluntu kan waar passend donatiebevestigingen verstrekken, maar kan niet garanderen dat deze door buitenlandse belastingdiensten worden erkend.",
      ]},
      { heading: "Betaalproviders en bankoverschrijvingen", paragraphs: [
        "Donaties kunnen worden verwerkt via externe betaalproviders, bankplatforms, PayPal, kaartaanbieders, bankoverschrijving of andere donatiesystemen die op de website beschikbaar worden gesteld.",
        "Externe betaalproviders kunnen hun eigen voorwaarden, kosten, verwerkingstijden, terugbetalingsregels, beveiligingsmaatregelen en privacypraktijken hanteren.",
        "iThemba Kuluntu is niet verantwoordelijk voor technische storingen, vertragingen, geweigerde betalingen, providerkosten of dienstonderbrekingen die worden veroorzaakt door betalingssystemen van derden.",
        "Donaties via bankoverschrijving worden geregistreerd zodra zij zijn ontvangen en aan de juiste rekening of donatie kunnen worden gekoppeld.",
      ]},
      { heading: "Terugbetalingen en betalingsfouten", paragraphs: [
        "Donaties zijn in beginsel definitief zodra zij zijn verwerkt.",
        "Als een donatie per ongeluk is gedaan, dubbel is verwerkt, onjuist is verwerkt of ongeautoriseerd lijkt te zijn, moet de donateur zo snel mogelijk contact opnemen met iThemba Kuluntu.",
        "Verzoeken om terugbetaling worden per geval beoordeeld. Wanneer een terugbetaling wordt goedgekeurd, kunnen verwerkingstijden en beperkingen van de betaalprovider van toepassing zijn.",
        "iThemba Kuluntu kan mogelijk geen donaties terugbetalen die al zijn toegewezen, besteed, fiscaal bevestigd of overgedragen aan projectuitvoering, tenzij dit wettelijk verplicht is.",
      ]},
      { heading: "Bedrijven, fondsen en bestemde financiering", paragraphs: [
        "Bedrijfsdonaties, subsidies van fondsen, projectsponsoring en bestemde financieringsafspraken kunnen worden geregeld via aparte schriftelijke overeenkomsten, subsidiebeschikkingen, partnerschapsvoorwaarden of rapportageverplichtingen.",
        "Wanneer er een aparte schriftelijke overeenkomst bestaat, geldt die naast deze donatievoorwaarden. Bij tegenstrijdigheid heeft de schriftelijke overeenkomst meestal voorrang voor die specifieke financieringsafspraak.",
      ]},
      { heading: "Donaties in natura", paragraphs: [
        "Donaties in natura, zoals goederen, materialen, apparatuur of diensten, worden alleen geaccepteerd wanneer zij geschikt zijn voor het werk en verantwoord kunnen worden ontvangen, opgeslagen, gebruikt of verdeeld.",
        "iThemba Kuluntu kan donaties in natura weigeren wanneer zij ongeschikt, onveilig, onpraktisch, verlopen, beschadigd, te duur om te vervoeren of niet in lijn met de actuele behoeften zijn.",
        "De fiscale behandeling van donaties in natura hangt af van het toepasselijke recht en de beschikbare documentatie.",
      ]},
      { heading: "Projectupdates en rapportage", paragraphs: [
        "iThemba Kuluntu streeft ernaar open te communiceren over haar werk via updates, verhalen, foto’s, rapporten, nieuwsbrieven of directe communicatie met donateurs waar dat passend is.",
        "Algemene donateurs kunnen openbare of algemene updates ontvangen. Gedetailleerdere rapportage kan worden verstrekt bij grotere donaties, projectsponsoring, subsidies of formele partnerschappen wanneer dit is afgesproken.",
        "Projectupdates kunnen afhankelijk zijn van toegang tot het veld, verbinding, toestemming, personele capaciteit, rapportagetermijnen en de veiligheid en waardigheid van leden van de gemeenschap.",
      ]},
      { heading: "Geen garantie op specifieke resultaten", paragraphs: [
        "Donaties ondersteunen praktisch gemeenschapswerk, maar iThemba Kuluntu kan geen specifiek individueel resultaat, projectresultaat, tijdspad of toewijzing aan een specifieke begunstigde garanderen, tenzij dit schriftelijk is overeengekomen.",
        "Veldomstandigheden, noodsituaties, weer, toegang, toeleveringsketens, behoeften in gemeenschappen, financieringsniveaus en andere praktische realiteiten kunnen de uitvoering beïnvloeden.",
      ]},
      { heading: "Communicatie met donateurs", paragraphs: [
        "Donateurs kunnen communicatie ontvangen over hun donatie, donatiebewijzen, certificaten, rapportage, projectupdates of toekomstige mogelijkheden om te steunen.",
        "Donateurs kunnen contact opnemen met iThemba Kuluntu als zij hun gegevens willen bijwerken, hun communicatievoorkeuren willen wijzigen of een vraag hebben over hun donatie.",
      ]},
      { heading: "Gegevensbescherming", paragraphs: [
        "Persoonsgegevens die in verband met donaties worden verstrekt, worden gebruikt om donaties te verwerken, donatiebewijzen of certificaten uit te geven, met donateurs te communiceren en te voldoen aan wettelijke, fiscale, boekhoudkundige en rapportageverplichtingen.",
        "Meer informatie over de verwerking van persoonsgegevens wordt opgenomen in de Privacyverklaring.",
      ]},
      { heading: "Wijzigingen van deze donatievoorwaarden", paragraphs: [
        "iThemba Kuluntu kan deze donatievoorwaarden van tijd tot tijd bijwerken.",
        "De meest recente versie wordt op deze pagina gepubliceerd met de datum van de laatste update.",
      ]},
    ],
    contact: { heading: "Contact", text: "Neem contact met ons op als u vragen heeft over donaties, donatiebewijzen, certificaten, maandelijks geven of deze donatievoorwaarden.", emailLabel: "E-mail" },
    related: { heading: "Gerelateerde juridische pagina’s", links: [
      { label: "Impressum", to: "/impressum" },
      { label: "Gebruiksvoorwaarden", to: "/terms" },
      { label: "Privacyverklaring", to: "/datenschutz" },
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

function DonationTermsPage() {
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
                {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
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

export const Route = createFileRoute("/donation-terms")({ component: DonationTermsPage });
