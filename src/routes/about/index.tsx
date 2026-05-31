import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ArrowRight,
  MapPin,
  Users,
  HandHeart,
  Sparkles,
  ShieldCheck,
  Handshake,
  Briefcase,
  Network,
  Globe2,
  Building2,
  CheckCircle2,
  Download,
  GraduationCap,
  Droplets,
  Utensils,
  Sprout,
  PawPrint,
  LifeBuoy,
} from "lucide-react";
import { useLang } from "@/components/site/LanguageProvider";
import { Placeholder } from "@/components/site/MissingInfo";
import { SmartImage, SmartLogo } from "@/components/site/Asset";
import { assets } from "@/data/assets";
import type { Lang } from "@/data/content";

export const Route = createFileRoute("/about/")({ component: About });

/* ---------- Per-language content (verbatim from /public/content/about) ---------- */

type Card = { title: string; text: string };
type Project = { title: string; text: string; to: string; icon: typeof GraduationCap };

type AboutContent = {
  eyebrows: {
    who: string;
    where: string;
    structures: string;
    different: string;
    guides: string;
    governance: string;
    work: string;
    cta: string;
  };
  hero: { eyebrow: string; title: string; subtitle: string; intro: string };
  who: { heading: string; paragraphs: string[] };
  where: { heading: string; paragraphs: string[] };
  structures: {
    heading: string;
    paragraphs: string[];
    npcLabel: string;
    evLabel: string;
  };
  different: { heading: string; intro: string; lead: string; cards: Card[] };
  guides: { heading: string; cards: Card[] };
  governance: {
    heading: string;
    intro: string;
    saHeading: string;
    saText: string;
    deHeading: string;
    deText: string;
    trustHeading: string;
    trustPoints: string[];
    saDetailsHeading: string;
    deDetailsHeading: string;
  };
  work: { heading: string; lead: string; projects: Project[] };
  cta: { heading: string; blueHeading: string; paragraphs: string[]; buttons: { team: string; projects: string; donate: string } };
};

const EN: AboutContent = {
  eyebrows: {
    who: "Our story",
    where: "Place",
    structures: "Together",
    different: "Our approach",
    guides: "Our values",
    governance: "Trust",
    work: "In action",
    cta: "Walk with us",
  },
  hero: {
    eyebrow: "About",
    title: "iThemba Kuluntu",
    subtitle:
      "Practical, community-rooted support for rural families in South Africa — strengthened by local leadership, international solidarity and long-term care.",
    intro:
      "iThemba Kuluntu connects direct community work in Cwebeni, Port St Johns, South Africa, with support, partnerships and awareness-building from Germany and beyond.",
  },
  who: {
    heading: "Who we are",
    paragraphs: [
      "iThemba Kuluntu is a community-rooted nonprofit structure working to strengthen rural families in South Africa. The practical work is led by iThemba Kuluntu NPC in Cwebeni, Port St Johns, in the Eastern Cape. In Germany, iThemba Kuluntu e.V. supports this work through awareness-raising, fundraising, partnerships and long-term organisational support.",
      "We work alongside communities facing connected challenges: unsafe water, food insecurity, limited early learning opportunities, poverty, emergency hardship and lack of access to basic animal welfare services. Our response is connected too — combining early childhood education, safe water access, food security, local livelihoods, community care, animal welfare and disaster relief.",
      "The heart of iThemba Kuluntu is local trust. We do not believe in short-term outside solutions that disappear. We believe in practical work that communities understand, use, trust and help carry forward.",
    ],
  },
  where: {
    heading: "Where we work",
    paragraphs: [
      "Our work is rooted in Cwebeni, Port St Johns, along the Wild Coast in Pondoland, Eastern Cape, South Africa. This is a rural region of deep community strength, cultural richness and natural beauty — but also a place where many families face daily barriers to water, food, transport, education, healthcare and emergency support.",
      "For many households, basic needs are closely connected. Unsafe water affects health, school attendance and family costs. Hunger affects learning and wellbeing. Poverty limits access to transport, medical care, animal care and opportunities. A crisis such as a flood, fire or illness can quickly become overwhelming.",
      "That is why our work is practical and place-based. We respond to what communities actually face, with people who know the area, understand the families and are present before, during and after support is delivered.",
    ],
  },
  structures: {
    heading: "One mission, two legal structures",
    paragraphs: [
      "iThemba Kuluntu NPC is the registered South African nonprofit company that carries out and coordinates the practical project work on the ground. This includes programmes such as the No.1 ECD Centre, PureFlow Amanzi, food security work, Pondo Dogs and emergency response.",
      "iThemba Kuluntu e.V. is the German nonprofit association based in Kirchhundem. The e.V. supports the South African work by building awareness, mobilising donations, developing partnerships, supporting communication and helping create long-term international backing for the projects.",
      "The two organisations share the same mission: strengthening rural communities through practical, dignified and locally grounded support. This structure allows people in Germany and Europe to contribute directly to community-led work in South Africa while keeping the operational work close to the communities it serves.",
    ],
    npcLabel: "South Africa · Project delivery",
    evLabel: "Germany · Awareness & support",
  },
  different: {
    heading: "What makes iThemba Kuluntu different",
    intro:
      "We work with communities, not above them. Our work begins with listening, local relationships and practical needs that are visible in daily life.",
    lead: "What makes our approach different",
    cards: [
      { title: "Local leadership", text: "Projects are shaped and carried by people who know the community and understand local realities." },
      { title: "Practical delivery", text: "We focus on tangible support — meals, water systems, early learning, emergency supplies, animal care, training, delivery and follow-up." },
      { title: "Connected response", text: "We do not treat water, food, education, livelihoods, animal welfare and emergency support as separate problems. In rural family life, they are connected — so our response must be connected too." },
      { title: "Long-term care", text: "We aim to build systems that last, not one-off interventions that disappear after a photo opportunity." },
      { title: "Local employment", text: "Wherever possible, our projects create paid roles and practical work opportunities for local people, especially women." },
      { title: "Trust and accountability", text: "We combine community trust with registration, governance, documentation, monitoring and partnerships." },
    ],
  },
  guides: {
    heading: "What guides us",
    cards: [
      { title: "Dignity", text: "Support should never take away people’s dignity. We believe in practical help that respects families, communities and local knowledge." },
      { title: "Local ownership", text: "Lasting change grows when communities can understand, use and help carry the solutions that affect their lives." },
      { title: "Practical solutions", text: "We focus on what can be delivered, used and maintained — from safe water systems to meals, learning spaces, emergency supplies and animal care." },
      { title: "Long-term trust", text: "Trust is built through presence, consistency and follow-through. Our work depends on being there beyond the first intervention." },
    ],
  },
  governance: {
    heading: "Governance and trust",
    intro:
      "Trust matters — especially when people donate, partner or place confidence in nonprofit work. iThemba Kuluntu is built with formal registration, clear accountability and practical reporting.",
    saHeading: "South Africa",
    saText:
      "iThemba Kuluntu NPC is registered in South Africa as a nonprofit company and recognised as a Public Benefit Organisation. The organisation is also NPO registered and VAT registered.",
    deHeading: "Germany",
    deText:
      "iThemba Kuluntu e.V. is registered in Germany and supports the South African work through fundraising, awareness-building, partnerships and organisational support.",
    trustHeading: "Trust points",
    trustPoints: [
      "Registered nonprofit structures in South Africa and Germany",
      "Public Benefit Organisation status in South Africa",
      "Local leadership and community-based delivery",
      "Transparent project communication",
      "Monitoring and follow-up where programmes require it",
      "Partnerships with trusted organisations and supporters",
    ],
    saDetailsHeading: "iThemba Kuluntu NPC — South Africa",
    deDetailsHeading: "iThemba Kuluntu e.V. — Germany",
  },
  work: {
    heading: "Our work today",
    lead: "Today, iThemba Kuluntu works across several connected programmes:",
    projects: [
      { title: "No.1 ECD Centre", text: "A safe, joyful and free-to-attend early learning centre for young children.", to: "/projects/ecd", icon: GraduationCap },
      { title: "PureFlow Amanzi", text: "A safe water programme combining filtration, WASH education, local delivery and follow-up.", to: "/projects/pureflow", icon: Droplets },
      { title: "Food Security", text: "Meals, food parcels, community kitchens and food rescue partnerships for families facing hunger.", to: "/projects/food-security", icon: Utensils },
      { title: "Greenhouse with SA Harvest", text: "Food growing, nutrition and practical skills linked to community resilience.", to: "/projects/greenhouse", icon: Sprout },
      { title: "Pondo Dogs", text: "Animal welfare support for dogs and other domestic or working animals, including sterilisation, food, medical care and humane education.", to: "/projects/pondo-dogs", icon: PawPrint },
      { title: "Disaster Relief", text: "Practical support for families facing floods, fires, medical crises or sudden hardship.", to: "/projects/disaster-relief", icon: LifeBuoy },
    ],
  },
  cta: {
    heading: "Walk with us",
    blueHeading: "Be part of the journey",
    paragraphs: [
      "iThemba Kuluntu exists because practical care can change daily life — one child, one household, one family and one community at a time.",
      "Whether you give monthly, partner with us, share our work or help connect us with new supporters, you become part of a growing circle of people helping rural communities in South Africa build safer, stronger and more dignified futures.",
    ],
    buttons: { team: "Meet Our Team", projects: "Explore Our Projects", donate: "Donate Monthly" },
  },
};

const DE: AboutContent = {
  eyebrows: {
    who: "Unsere Geschichte",
    where: "Ort",
    structures: "Gemeinsam",
    different: "Unser Ansatz",
    guides: "Unsere Werte",
    governance: "Vertrauen",
    work: "In Aktion",
    cta: "Gehen Sie mit uns",
  },
  hero: {
    eyebrow: "Über uns",
    title: "iThemba Kuluntu",
    subtitle:
      "Praktische, gemeindenahe Unterstützung für ländliche Familien in Südafrika — getragen von lokaler Verantwortung, internationaler Solidarität und langfristiger Begleitung.",
    intro:
      "iThemba Kuluntu verbindet direkte Gemeindearbeit in Cwebeni, Port St Johns, Südafrika, mit Unterstützung, Partnerschaften und Aufklärungsarbeit aus Deutschland und darüber hinaus.",
  },
  who: {
    heading: "Wer wir sind",
    paragraphs: [
      "iThemba Kuluntu ist eine gemeindenahe gemeinnützige Struktur, die ländliche Familien in Südafrika stärkt. Die praktische Arbeit vor Ort wird von iThemba Kuluntu NPC in Cwebeni, Port St Johns, im Eastern Cape umgesetzt und koordiniert. In Deutschland unterstützt iThemba Kuluntu e.V. diese Arbeit durch Aufklärungsarbeit, Fundraising, Partnerschaften und langfristige organisatorische Begleitung.",
      "Wir arbeiten an der Seite von Gemeinschaften, die mit miteinander verbundenen Herausforderungen leben: unsicherem Wasser, Ernährungsunsicherheit, begrenztem Zugang zu frühkindlicher Bildung, Armut, akuten Notlagen und fehlendem Zugang zu grundlegender tiermedizinischer Versorgung. Unsere Antwort ist ebenfalls verbunden — durch frühkindliche Bildung, sicheres Wasser, Ernährungssicherheit, lokale Arbeitsmöglichkeiten, Gemeindefürsorge, Tierschutz und Katastrophenhilfe.",
      "Das Herz von iThemba Kuluntu ist lokales Vertrauen. Wir glauben nicht an kurzfristige Lösungen von außen, die wieder verschwinden. Wir glauben an praktische Arbeit, die Gemeinschaften verstehen, nutzen, vertrauen und selbst mittragen können.",
    ],
  },
  where: {
    heading: "Wo wir arbeiten",
    paragraphs: [
      "Unsere Arbeit ist in Cwebeni, Port St Johns, an der Wild Coast in Pondoland, Eastern Cape, Südafrika, verwurzelt. Es ist eine ländliche Region mit starker Gemeinschaft, kulturellem Reichtum und großer natürlicher Schönheit — aber auch ein Ort, an dem viele Familien täglich mit Hindernissen beim Zugang zu Wasser, Nahrung, Transport, Bildung, Gesundheitsversorgung und Nothilfe konfrontiert sind.",
      "Für viele Haushalte hängen grundlegende Bedürfnisse eng zusammen. Unsicheres Wasser beeinflusst Gesundheit, Schulbesuch und Familienkosten. Hunger beeinträchtigt Lernen und Wohlbefinden. Armut begrenzt den Zugang zu Transport, medizinischer Versorgung, Tierhilfe und Zukunftschancen. Eine Krise wie eine Überschwemmung, ein Brand oder eine Krankheit kann schnell existenziell werden.",
      "Darum ist unsere Arbeit praktisch und ortsbezogen. Wir reagieren auf das, was Gemeinschaften tatsächlich erleben — mit Menschen, die die Region kennen, Familien verstehen und vor, während und nach der Unterstützung präsent sind.",
    ],
  },
  structures: {
    heading: "Eine Mission, zwei rechtliche Strukturen",
    paragraphs: [
      "iThemba Kuluntu NPC ist die in Südafrika registrierte gemeinnützige Gesellschaft, die die praktische Projektarbeit vor Ort umsetzt und koordiniert. Dazu gehören Programme wie das No.1 ECD Centre, PureFlow Amanzi, Ernährungssicherheit, Pondo Dogs und Nothilfe.",
      "iThemba Kuluntu e.V. ist der gemeinnützige Verein mit Sitz in Kirchhundem, Deutschland. Der e.V. unterstützt die Arbeit in Südafrika durch Aufklärungsarbeit, Spendenmobilisierung, Partnerschaftsaufbau, Kommunikation und langfristige internationale Unterstützung für die Projekte.",
      "Beide Organisationen teilen dieselbe Mission: ländliche Gemeinschaften durch praktische, würdevolle und lokal verankerte Unterstützung zu stärken. Diese Struktur ermöglicht es Menschen in Deutschland und Europa, direkt zu gemeindegeführter Arbeit in Südafrika beizutragen, während die operative Arbeit nah bei den Gemeinschaften bleibt, denen sie dient.",
    ],
    npcLabel: "Südafrika · Projektumsetzung",
    evLabel: "Deutschland · Aufklärung & Unterstützung",
  },
  different: {
    heading: "Was iThemba Kuluntu besonders macht",
    intro:
      "Wir arbeiten mit Gemeinschaften, nicht über sie hinweg. Unsere Arbeit beginnt mit Zuhören, lokalen Beziehungen und praktischen Bedürfnissen, die im Alltag sichtbar sind.",
    lead: "Was unseren Ansatz auszeichnet",
    cards: [
      { title: "Lokale Verantwortung", text: "Projekte werden von Menschen mitgestaltet und getragen, die die Gemeinschaft kennen und lokale Realitäten verstehen." },
      { title: "Praktische Umsetzung", text: "Wir konzentrieren uns auf konkrete Unterstützung — Mahlzeiten, Wassersysteme, frühes Lernen, Notfallversorgung, Tierhilfe, Schulungen, Verteilung und Nachbetreuung." },
      { title: "Verbundene Hilfe", text: "Wir behandeln Wasser, Nahrung, Bildung, Einkommen, Tierschutz und Nothilfe nicht als getrennte Probleme. Im Alltag ländlicher Familien hängt all das zusammen — deshalb muss auch unsere Antwort zusammenhängend sein." },
      { title: "Langfristige Begleitung", text: "Unser Ziel sind Strukturen, die bleiben, nicht einmalige Interventionen, die nach einem Fototermin verschwinden." },
      { title: "Lokale Arbeitsmöglichkeiten", text: "Wo immer möglich, schaffen unsere Projekte bezahlte Rollen und praktische Arbeitsmöglichkeiten für Menschen vor Ort, insbesondere für Frauen." },
      { title: "Vertrauen und Verantwortung", text: "Wir verbinden Vertrauen in der Gemeinschaft mit Registrierung, Governance, Dokumentation, Monitoring und Partnerschaften." },
    ],
  },
  guides: {
    heading: "Was uns leitet",
    cards: [
      { title: "Würde", text: "Unterstützung darf Menschen niemals ihre Würde nehmen. Wir glauben an praktische Hilfe, die Familien, Gemeinschaften und lokales Wissen respektiert." },
      { title: "Lokale Mitverantwortung", text: "Nachhaltige Veränderung entsteht, wenn Gemeinschaften Lösungen verstehen, nutzen und mittragen können, die ihr eigenes Leben betreffen." },
      { title: "Praktische Lösungen", text: "Wir konzentrieren uns auf das, was tatsächlich umgesetzt, genutzt und erhalten werden kann — von sicheren Wassersystemen über Mahlzeiten und Lernräume bis hin zu Nothilfe und Tierfürsorge." },
      { title: "Langfristiges Vertrauen", text: "Vertrauen entsteht durch Präsenz, Verlässlichkeit und konsequentes Dranbleiben. Unsere Arbeit hängt davon ab, auch nach der ersten Unterstützung weiter da zu sein." },
    ],
  },
  governance: {
    heading: "Governance und Vertrauen",
    intro:
      "Vertrauen ist entscheidend — besonders dann, wenn Menschen spenden, Partnerschaften eingehen oder gemeinnütziger Arbeit Verantwortung übertragen. iThemba Kuluntu ist auf formaler Registrierung, klarer Verantwortlichkeit und praktischer Berichterstattung aufgebaut.",
    saHeading: "Südafrika",
    saText:
      "iThemba Kuluntu NPC ist in Südafrika als gemeinnützige Gesellschaft registriert und als Public Benefit Organisation anerkannt. Die Organisation ist außerdem NPO-registriert und VAT-registriert.",
    deHeading: "Deutschland",
    deText:
      "iThemba Kuluntu e.V. ist in Deutschland registriert und unterstützt die Arbeit in Südafrika durch Fundraising, Aufklärungsarbeit, Partnerschaften und organisatorische Begleitung.",
    trustHeading: "Vertrauenspunkte",
    trustPoints: [
      "Registrierte gemeinnützige Strukturen in Südafrika und Deutschland",
      "Public Benefit Organisation Status in Südafrika",
      "Lokale Führung und gemeindenahe Umsetzung",
      "Transparente Projektkommunikation",
      "Monitoring und Nachbetreuung, wo Programme dies erfordern",
      "Partnerschaften mit vertrauenswürdigen Organisationen und Unterstützern",
    ],
    saDetailsHeading: "iThemba Kuluntu NPC — Südafrika",
    deDetailsHeading: "iThemba Kuluntu e.V. — Deutschland",
  },
  work: {
    heading: "Unsere Arbeit heute",
    lead: "Heute arbeitet iThemba Kuluntu in mehreren miteinander verbundenen Programmen:",
    projects: [
      { title: "No.1 ECD Centre", text: "Ein sicherer, fröhlicher und kostenfrei zugänglicher Ort für frühkindliche Bildung für kleine Kinder.", to: "/projects/ecd", icon: GraduationCap },
      { title: "PureFlow Amanzi", text: "Ein Programm für sicheres Wasser, das Filtration, WASH-Bildung, lokale Verteilung und Nachbetreuung verbindet.", to: "/projects/pureflow", icon: Droplets },
      { title: "Ernährungssicherheit", text: "Mahlzeiten, Lebensmittelpakete, Gemeinschaftsküchen und Partnerschaften zur Lebensmittelrettung für Familien, die von Hunger betroffen sind.", to: "/projects/food-security", icon: Utensils },
      { title: "Greenhouse mit SA Harvest", text: "Lebensmittelanbau, Ernährung und praktische Fähigkeiten als Beitrag zur Widerstandskraft der Gemeinschaft.", to: "/projects/greenhouse", icon: Sprout },
      { title: "Pondo Dogs", text: "Tierschutz für Hunde und andere Haus- und Nutztiere, einschließlich Sterilisation, Futter, medizinischer Versorgung und humaner Aufklärung.", to: "/projects/pondo-dogs", icon: PawPrint },
      { title: "Nothilfe & Katastrophenhilfe", text: "Praktische Unterstützung für Familien, die von Überschwemmungen, Bränden, medizinischen Notfällen oder plötzlicher Not betroffen sind.", to: "/projects/disaster-relief", icon: LifeBuoy },
    ],
  },
  cta: {
    heading: "Gehen Sie diesen Weg mit uns",
    blueHeading: "Werden Sie Teil dieses Weges",
    paragraphs: [
      "iThemba Kuluntu gibt es, weil praktische Fürsorge den Alltag verändern kann — für ein Kind, einen Haushalt, eine Familie und eine Gemeinschaft nach der anderen.",
      "Ob Sie monatlich spenden, Partner werden, unsere Arbeit teilen oder uns mit neuen Unterstützerinnen und Unterstützern verbinden: Sie werden Teil eines wachsenden Kreises von Menschen, die ländlichen Gemeinschaften in Südafrika helfen, sicherere, stärkere und würdevollere Zukunftsperspektiven aufzubauen.",
    ],
    buttons: { team: "Unser Team kennenlernen", projects: "Unsere Projekte entdecken", donate: "Monatlich spenden" },
  },
};

const NL: AboutContent = {
  eyebrows: {
    who: "Ons verhaal",
    where: "Plek",
    structures: "Samen",
    different: "Onze aanpak",
    guides: "Onze waarden",
    governance: "Vertrouwen",
    work: "In actie",
    cta: "Loop met ons mee",
  },
  hero: {
    eyebrow: "Over ons",
    title: "iThemba Kuluntu",
    subtitle:
      "Praktische, gemeenschapsgerichte steun voor landelijke gezinnen in Zuid-Afrika — versterkt door lokaal leiderschap, internationale solidariteit en langdurige betrokkenheid.",
    intro:
      "iThemba Kuluntu verbindt direct gemeenschapswerk in Cwebeni, Port St Johns, Zuid-Afrika, met steun, partnerschappen en bewustwording vanuit Duitsland en daarbuiten.",
  },
  who: {
    heading: "Wie wij zijn",
    paragraphs: [
      "iThemba Kuluntu is een gemeenschapsgerichte non-profitstructuur die landelijke gezinnen in Zuid-Afrika versterkt. Het praktische werk wordt geleid en gecoördineerd door iThemba Kuluntu NPC in Cwebeni, Port St Johns, in de Eastern Cape. In Duitsland ondersteunt iThemba Kuluntu e.V. dit werk door bewustwording, fondsenwerving, partnerschappen en langdurige organisatorische ondersteuning.",
      "Wij werken naast gemeenschappen die te maken hebben met onderling verbonden uitdagingen: onveilig water, voedselonzekerheid, beperkte kansen op vroegschoolse educatie, armoede, noodsituaties en beperkte toegang tot basiszorg voor dierenwelzijn. Ook onze aanpak is verbonden — met vroegschoolse educatie, toegang tot veilig water, voedselzekerheid, lokale bestaansmogelijkheden, gemeenschapszorg, dierenwelzijn en rampenhulp.",
      "Het hart van iThemba Kuluntu is lokaal vertrouwen. Wij geloven niet in kortetermijnoplossingen van buitenaf die weer verdwijnen. Wij geloven in praktisch werk dat gemeenschappen begrijpen, gebruiken, vertrouwen en zelf helpen dragen.",
    ],
  },
  where: {
    heading: "Waar wij werken",
    paragraphs: [
      "Ons werk is geworteld in Cwebeni, Port St Johns, aan de Wild Coast in Pondoland, Eastern Cape, Zuid-Afrika. Dit is een landelijke regio met sterke gemeenschappen, culturele rijkdom en grote natuurlijke schoonheid — maar ook een plek waar veel gezinnen dagelijks drempels ervaren rond water, voedsel, vervoer, onderwijs, gezondheidszorg en noodhulp.",
      "Voor veel huishoudens zijn basisbehoeften nauw met elkaar verbonden. Onveilig water beïnvloedt gezondheid, schoolbezoek en gezinskosten. Honger beïnvloedt leren en welzijn. Armoede beperkt toegang tot vervoer, medische zorg, dierenzorg en kansen. Een crisis zoals een overstroming, brand of ziekte kan snel overweldigend worden.",
      "Daarom is ons werk praktisch en plaatsgebonden. We reageren op wat gemeenschappen werkelijk meemaken, met mensen die het gebied kennen, gezinnen begrijpen en aanwezig zijn vóór, tijdens en na de geboden ondersteuning.",
    ],
  },
  structures: {
    heading: "Eén missie, twee juridische structuren",
    paragraphs: [
      "iThemba Kuluntu NPC is de in Zuid-Afrika geregistreerde non-profit company die het praktische projectwerk ter plaatse uitvoert en coördineert. Dit omvat programma’s zoals het No.1 ECD Centre, PureFlow Amanzi, voedselzekerheidswerk, Pondo Dogs en noodhulp.",
      "iThemba Kuluntu e.V. is de Duitse non-profitvereniging gevestigd in Kirchhundem. De e.V. ondersteunt het Zuid-Afrikaanse werk door bewustwording op te bouwen, donaties te mobiliseren, partnerschappen te ontwikkelen, communicatie te ondersteunen en langdurige internationale steun voor de projecten mogelijk te maken.",
      "De twee organisaties delen dezelfde missie: landelijke gemeenschappen versterken door praktische, waardige en lokaal verankerde ondersteuning. Deze structuur maakt het mogelijk dat mensen in Duitsland en Europa direct bijdragen aan gemeenschapsgeleid werk in Zuid-Afrika, terwijl de uitvoering dicht bij de gemeenschappen blijft waarvoor het werk bedoeld is.",
    ],
    npcLabel: "Zuid-Afrika · Projectuitvoering",
    evLabel: "Duitsland · Bewustwording & steun",
  },
  different: {
    heading: "Wat iThemba Kuluntu anders maakt",
    intro:
      "Wij werken met gemeenschappen, niet boven hen. Ons werk begint met luisteren, lokale relaties en praktische behoeften die in het dagelijks leven zichtbaar zijn.",
    lead: "Wat onze aanpak onderscheidt",
    cards: [
      { title: "Lokaal leiderschap", text: "Projecten worden gevormd en gedragen door mensen die de gemeenschap kennen en lokale realiteiten begrijpen." },
      { title: "Praktische uitvoering", text: "Wij richten ons op tastbare ondersteuning — maaltijden, watersystemen, vroeg leren, noodhulpgoederen, dierenzorg, training, distributie en opvolging." },
      { title: "Verbonden aanpak", text: "Wij behandelen water, voedsel, onderwijs, inkomen, dierenwelzijn en noodhulp niet als losse problemen. In het dagelijks leven van landelijke gezinnen hangen ze samen — daarom moet ook onze aanpak samenhangend zijn." },
      { title: "Langdurige zorg", text: "Wij willen systemen opbouwen die blijven, geen eenmalige interventies die verdwijnen na een fotomoment." },
      { title: "Lokale werkgelegenheid", text: "Waar mogelijk creëren onze projecten betaalde rollen en praktische werkmogelijkheden voor mensen ter plaatse, in het bijzonder voor vrouwen." },
      { title: "Vertrouwen en verantwoording", text: "Wij combineren vertrouwen in de gemeenschap met registratie, governance, documentatie, monitoring en partnerschappen." },
    ],
  },
  guides: {
    heading: "Wat ons leidt",
    cards: [
      { title: "Waardigheid", text: "Ondersteuning mag mensen nooit hun waardigheid ontnemen. Wij geloven in praktische hulp die gezinnen, gemeenschappen en lokale kennis respecteert." },
      { title: "Lokaal eigenaarschap", text: "Blijvende verandering groeit wanneer gemeenschappen de oplossingen die hun leven beïnvloeden kunnen begrijpen, gebruiken en helpen dragen." },
      { title: "Praktische oplossingen", text: "Wij richten ons op wat daadwerkelijk kan worden geleverd, gebruikt en onderhouden — van veilige watersystemen tot maaltijden, leerplekken, noodhulpgoederen en dierenzorg." },
      { title: "Langdurig vertrouwen", text: "Vertrouwen wordt opgebouwd door aanwezigheid, consistentie en opvolging. Ons werk hangt ervan af dat we er ook na de eerste interventie blijven zijn." },
    ],
  },
  governance: {
    heading: "Governance en vertrouwen",
    intro:
      "Vertrouwen is essentieel — vooral wanneer mensen doneren, samenwerken of vertrouwen stellen in non-profitwerk. iThemba Kuluntu is opgebouwd rond formele registratie, duidelijke verantwoordelijkheid en praktische rapportage.",
    saHeading: "Zuid-Afrika",
    saText:
      "iThemba Kuluntu NPC is in Zuid-Afrika geregistreerd als non-profit company en erkend als Public Benefit Organisation. De organisatie is ook NPO-geregistreerd en VAT-geregistreerd.",
    deHeading: "Duitsland",
    deText:
      "iThemba Kuluntu e.V. is geregistreerd in Duitsland en ondersteunt het Zuid-Afrikaanse werk door fondsenwerving, bewustwording, partnerschappen en organisatorische ondersteuning.",
    trustHeading: "Vertrouwenspunten",
    trustPoints: [
      "Geregistreerde non-profitstructuren in Zuid-Afrika en Duitsland",
      "Public Benefit Organisation-status in Zuid-Afrika",
      "Lokaal leiderschap en gemeenschapsgerichte uitvoering",
      "Transparante projectcommunicatie",
      "Monitoring en opvolging waar programma’s dit vereisen",
      "Partnerschappen met betrouwbare organisaties en supporters",
    ],
    saDetailsHeading: "iThemba Kuluntu NPC — Zuid-Afrika",
    deDetailsHeading: "iThemba Kuluntu e.V. — Duitsland",
  },
  work: {
    heading: "Ons werk vandaag",
    lead: "Vandaag werkt iThemba Kuluntu via meerdere verbonden programma’s:",
    projects: [
      { title: "No.1 ECD Centre", text: "Een veilige, vrolijke en kosteloos toegankelijke plek voor vroegschoolse educatie voor jonge kinderen.", to: "/projects/ecd", icon: GraduationCap },
      { title: "PureFlow Amanzi", text: "Een veilig-waterprogramma dat filtratie, WASH-educatie, lokale distributie en opvolging combineert.", to: "/projects/pureflow", icon: Droplets },
      { title: "Voedselzekerheid", text: "Maaltijden, voedselpakketten, gemeenschapskeukens en voedselreddingspartnerschappen voor gezinnen die met honger te maken hebben.", to: "/projects/food-security", icon: Utensils },
      { title: "Greenhouse met SA Harvest", text: "Voedsel verbouwen, voeding versterken en praktische vaardigheden ontwikkelen als onderdeel van gemeenschapsveerkracht.", to: "/projects/greenhouse", icon: Sprout },
      { title: "Pondo Dogs", text: "Dierenwelzijn voor honden en andere huis- en werkdieren, inclusief sterilisatie, voeding, medische zorg en humane educatie.", to: "/projects/pondo-dogs", icon: PawPrint },
      { title: "Noodhulp & rampenhulp", text: "Praktische ondersteuning voor gezinnen die worden getroffen door overstromingen, branden, medische crisissen of plotselinge nood.", to: "/projects/disaster-relief", icon: LifeBuoy },
    ],
  },
  cta: {
    heading: "Loop met ons mee",
    blueHeading: "Word deel van deze reis",
    paragraphs: [
      "iThemba Kuluntu bestaat omdat praktische zorg het dagelijks leven kan veranderen — één kind, één huishouden, één gezin en één gemeenschap tegelijk.",
      "Of u nu maandelijks doneert, partner wordt, ons werk deelt of ons helpt nieuwe supporters te bereiken: u wordt onderdeel van een groeiende kring van mensen die landelijke gemeenschappen in Zuid-Afrika helpen bouwen aan een veiligere, sterkere en waardigere toekomst.",
    ],
    buttons: { team: "Maak kennis met ons team", projects: "Ontdek onze projecten", donate: "Maandelijks doneren" },
  },
};

function pick(lang: Lang): AboutContent {
  return lang === "de" ? DE : lang === "nl" ? NL : EN;
}

/* ---------- Helpers ---------- */

const HERO_VIDEO = "/assets/videos/about/about-hero-team.mp4";
const HERO_POSTER = "/assets/photos/about/about-hero-poster.jpg";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/* ---------- Page ---------- */

function About() {
  const { lang } = useLang();
  const c = pick(lang);

  return (
    <>
      <HeroVideo c={c} />
      <WhoWeAre c={c} />
      <WhereWeWork c={c} />
      <Structures c={c} />
      <WhatMakesDifferent c={c} />
      <WhatGuidesUs c={c} />
      <Governance c={c} />
      <OurWorkToday c={c} />
      <ClosingCTA c={c} />
    </>
  );
}

/* ---------- Sections ---------- */

function HeroVideo({ c }: { c: AboutContent }) {
  const reduced = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const showVideo = !reduced && !videoFailed;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {showVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_POSTER}
            onError={() => setVideoFailed(true)}
            aria-hidden
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <SmartImage
            src={HERO_POSTER}
            label="iThemba Kuluntu team — community hero"
            className="h-full w-full"
            rounded="rounded-none"
            tone="earth"
            showMissingBadge={false}
          />
        )}
        {/* Deep-blue overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/85 via-[var(--ithemba-blue-dark)]/70 to-[var(--ithemba-blue)]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[28rem] w-[28rem] sun-glow" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 md:pb-28 md:pt-28 lg:min-h-[78vh] lg:px-8">
        <div className="relative max-w-3xl text-white">
          <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] drop-shadow-sm flex items-center gap-2">
            <Sparkles className="h-5 w-5" aria-hidden /> {c.hero.eyebrow}
          </div>
          <h1 className="mt-4">
            <span className="sr-only">{c.hero.title}</span>
            <SmartLogo
              src={assets.logos.ithembaTextWhite}
              alt={c.hero.title}
              className="h-16 w-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] md:h-24 lg:h-28"
              fallback={
                <span
                  aria-hidden
                  className="block font-display text-[clamp(2.5rem,7vw,4.75rem)] font-extrabold leading-[0.95] tracking-tight text-white"
                >
                  {c.hero.title}
                </span>
              }
            />
            <svg className="mt-3 block w-48 md:w-72" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
              <path d="M2,8 C50,2 120,14 198,6" stroke="var(--ithemba-yellow)" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/95 md:text-xl">{c.hero.subtitle}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">{c.hero.intro}</p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur ring-1 ring-white/20">
            <MapPin className="h-3.5 w-3.5 text-[var(--ithemba-yellow)]" />
            Cwebeni · Port St Johns · Eastern Cape
          </div>
        </div>
      </div>

      {/* wave divider */}
      <svg className="block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--background)" />
      </svg>
    </section>
  );
}

function WhoWeAre({ c }: { c: AboutContent }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20 lg:px-8">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative">
          <div className="absolute -inset-4 -z-10 blob bg-[var(--ithemba-yellow)]/20" aria-hidden />
          <SmartImage
            src={assets.photos.about.hero}
            label="iThemba Kuluntu community — listening, learning, building together"
            className="aspect-[4/5] w-full"
            rounded="rounded-[2rem]"
            tone="warm"
            showMissingBadge={false}
          />
        </div>
        <div>
          <div className="hand-eyebrow">{c.eyebrows.who}</div>
          <h2 className="mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
            {c.who.heading}
          </h2>
          <div className="mt-5 space-y-4 text-foreground/85 leading-relaxed">
            {c.who.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhereWeWork({ c }: { c: AboutContent }) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--ithemba-cream)] py-16 md:py-20">
      <div className="absolute inset-x-0 top-0 -z-10">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full" aria-hidden>
          <path d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,0 L0,0 Z" fill="var(--background)" />
        </svg>
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-[1.1fr_1fr] lg:px-8">
        <div>
          <div className="hand-eyebrow">{c.where.heading}</div>
          <h2 className="mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
            {c.where.heading}
          </h2>
          <div className="mt-5 space-y-4 text-foreground/85 leading-relaxed">
            {c.where.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--ithemba-blue-dark)] ring-1 ring-[var(--ithemba-blue)]/15">
            <MapPin className="h-4 w-4 text-[var(--ithemba-blue)]" />
            Cwebeni · Port St Johns · Wild Coast · Pondoland · Eastern Cape · South Africa
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 blob-2 bg-[var(--ithemba-blue)]/15" aria-hidden />
          <SmartImage
            src={assets.photos.about.cwebeni}
            label="Wild Coast landscape — Cwebeni, Pondoland"
            className="aspect-[4/3] w-full"
            rounded="rounded-[2rem]"
            tone="earth"
            showMissingBadge={false}
          />
        </div>
      </div>
    </section>
  );
}

function Structures({ c }: { c: AboutContent }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="hand-eyebrow inline-flex items-center justify-center gap-2">
          <Handshake className="h-4 w-4" /> {c.structures.heading}
        </div>
        <h2 className="mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
          {c.structures.heading}
        </h2>
        <p className="mt-5 text-foreground/85 leading-relaxed">{c.structures.paragraphs[2]}</p>
      </div>

      <div className="relative mt-10">
        {/* connector line on desktop */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[2px] w-24 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[var(--ithemba-blue)]/40 via-[var(--ithemba-yellow)] to-[var(--ithemba-blue)]/40 md:block" aria-hidden />
        <div className="grid items-stretch gap-6 md:grid-cols-2">
          <article className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[var(--ithemba-blue)]/10">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--ithemba-blue)]/10 blur-2xl" aria-hidden />
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]">
                <Globe2 className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--ithemba-blue)]">
                  {c.structures.npcLabel}
                </div>
                <h3 className="font-display text-xl font-bold">iThemba Kuluntu NPC</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/85">{c.structures.paragraphs[0]}</p>
          </article>

          <article className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[var(--ithemba-blue)]/10">
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-[var(--ithemba-yellow)]/30 blur-2xl" aria-hidden />
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ithemba-yellow)]/25 text-[var(--ithemba-blue-dark)]">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--ithemba-yellow-warm)]">
                  {c.structures.evLabel}
                </div>
                <h3 className="font-display text-xl font-bold">iThemba Kuluntu e.V.</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/85">{c.structures.paragraphs[1]}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

const DIFFERENT_ICONS = [Users, HandHeart, Network, Heart, Briefcase, ShieldCheck];

function WhatMakesDifferent({ c }: { c: AboutContent }) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--ithemba-blue-deepest)] py-16 text-white md:py-20">
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[var(--ithemba-blue)]/40 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[var(--ithemba-yellow)]/15 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hand-eyebrow !text-[var(--ithemba-yellow)]">{c.different.heading}</div>
          <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">{c.different.heading}</h2>
          <p className="mt-4 text-white/85 leading-relaxed">{c.different.intro}</p>
          <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[var(--ithemba-yellow)]">
            {c.different.lead}
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.different.cards.map((card, i) => {
            const Icon = DIFFERENT_ICONS[i] ?? Heart;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/[0.1] hover:ring-[var(--ithemba-yellow)]/40"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ithemba-yellow)]/20 text-[var(--ithemba-yellow)]">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{card.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhatGuidesUs({ c }: { c: AboutContent }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="hand-eyebrow">{c.guides.heading}</div>
        <h2 className="mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
          {c.guides.heading}
        </h2>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {c.guides.cards.map((card, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-3xl border border-[var(--ithemba-blue)]/10 bg-[var(--ithemba-cream)] p-6 shadow-sm"
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--ithemba-yellow)]/30 blur-xl" aria-hidden />
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--ithemba-blue-dark)] ring-1 ring-[var(--ithemba-blue)]/15">
              <Heart className="h-5 w-5 fill-[var(--ithemba-yellow)] text-[var(--ithemba-yellow-warm)]" />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-[var(--ithemba-blue-dark)]">
              <span className="relative inline-block">
                {card.title}
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden>
                  <path d="M1,3 C25,1 60,5 99,2" stroke="var(--ithemba-yellow)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Governance({ c }: { c: AboutContent }) {
  const g = c.governance;
  return (
    <section className="bg-[var(--ithemba-cream)] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="hand-eyebrow inline-flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4" /> {g.heading}
          </div>
          <h2 className="mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
            {g.heading}
          </h2>
          <p className="mt-4 text-foreground/85 leading-relaxed">{g.intro}</p>
        </div>

        {/* Two countries */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[var(--ithemba-blue)]/10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ithemba-blue)]/10 text-[var(--ithemba-blue-dark)]">
                <Globe2 className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl font-bold">{g.saHeading}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{g.saText}</p>
            <div className="mt-5 border-t border-border pt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ithemba-blue)]">
                {g.saDetailsHeading}
              </h4>
              <dl className="mt-3 grid gap-y-1.5 text-sm">
                <Row label="Registration" value="2023/199348/08" />
                <Row label="PBO" value="930081177" />
                <Row label="NPO" value="300-700" />
                <Row label="VAT" value="4430318792" />
                <Row
                  label="Address"
                  value="Flat Rock Cottage, Cwebeni Beach, Port St Johns, Eastern Cape, South Africa, 5090"
                />
              </dl>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[var(--ithemba-blue)]/10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ithemba-yellow)]/25 text-[var(--ithemba-blue-dark)]">
                <Building2 className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl font-bold">{g.deHeading}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{g.deText}</p>
            <div className="mt-5 border-t border-border pt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ithemba-yellow-warm)]">
                {g.deDetailsHeading}
              </h4>
              <dl className="mt-3 grid gap-y-1.5 text-sm">
                <Row label="Address" value="Am Emberg 20, 57399 Kirchhundem, Germany" />
                <Row label="Court" value="Amtsgericht Siegen" />
                <Row label="Vereinsregister" value="6845" />
                <Row label="Steuernummer" value="338/5953/0753" />
              </dl>
            </div>
          </div>
        </div>

        {/* Trust pills */}
        <div className="mt-10">
          <h3 className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ithemba-blue)]">
            {g.trustHeading}
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.trustPoints.map((p) => (
              <div
                key={p}
                className="flex items-start gap-3 rounded-2xl border border-[var(--ithemba-blue)]/10 bg-white px-4 py-3 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ithemba-blue)]" />
                <span className="text-sm font-medium text-foreground/90">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Downloads — placeholders for missing assets */}
        <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-[var(--ithemba-blue)]/10 md:p-8">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-[var(--ithemba-blue)]" />
            <h3 className="font-display text-lg font-bold text-[var(--ithemba-blue-dark)]">Documents</h3>
          </div>
          <div className="mt-3 space-y-1">
            <Placeholder text="downloadable certificates" />
            <Placeholder text="annual report download" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt className="font-semibold text-foreground/80">{label}:</dt>
      <dd className="text-foreground/85">{value}</dd>
    </div>
  );
}

function OurWorkToday({ c }: { c: AboutContent }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20 lg:px-8">
      <div className="max-w-2xl">
        <div className="hand-eyebrow">{c.work.heading}</div>
        <h2 className="mt-1 font-display text-3xl font-bold text-[var(--ithemba-blue-dark)] md:text-4xl">
          {c.work.heading}
        </h2>
        <p className="mt-4 text-foreground/85 leading-relaxed">{c.work.lead}</p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {c.work.projects.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.title}
              to={p.to}
              className="group flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[var(--ithemba-blue)]/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--ithemba-blue)]/30"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--ithemba-yellow)]/20 text-[var(--ithemba-blue-dark)]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-[var(--ithemba-blue-dark)]">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/80">{p.text}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--ithemba-blue)] group-hover:text-[var(--ithemba-blue-dark)]">
                {p.title} <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ClosingCTA({ c }: { c: AboutContent }) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--ithemba-blue-deepest)] py-20 text-white">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={assets.photos.home.donationBackground}
          label="iThemba Kuluntu community — walk with us"
          className="h-full w-full opacity-30"
          rounded="rounded-none"
          tone="earth"
          showMissingBadge={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ithemba-blue-deepest)]/95 via-[var(--ithemba-blue-dark)]/90 to-[var(--ithemba-blue)]/80" />
        <div className="absolute right-[-6rem] top-[-6rem] h-[24rem] w-[24rem] sun-glow" />
      </div>
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <div className="hand-eyebrow-lg !text-[var(--ithemba-yellow)] inline-flex items-center gap-2 justify-center">
          <Heart className="h-5 w-5 fill-[var(--ithemba-yellow)]" /> {c.cta.heading}
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold md:text-5xl">{c.cta.heading}</h2>
        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-white/90 leading-relaxed">
          {c.cta.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/about/team">
            <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white">
              <Users className="mr-2 h-4 w-4" /> {c.cta.buttons.team}
            </Button>
          </Link>
          <Link to="/projects">
            <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white">
              {c.cta.buttons.projects} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/donate">
            <Button size="lg" className="rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold shadow-xl shadow-amber-900/30">
              <Heart className="mr-2 h-4 w-4 fill-current" /> {c.cta.buttons.donate}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
