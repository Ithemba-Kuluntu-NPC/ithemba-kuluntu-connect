import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { Placeholder } from "./MissingInfo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLang } from "./LanguageProvider";

const socialBase =
  "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-[var(--ithemba-yellow)] hover:text-[var(--ithemba-brown)] hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ithemba-yellow)]";

export function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { lang } = useLang();

  return (
    <footer className="mt-24 border-t border-border bg-[var(--ithemba-blue-dark)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Org */}
        <div>
          <img
            src="/assets/logos/ithemba-text-white.png"
            alt="iThemba Kuluntu"
            className="h-20 w-auto max-w-[220px] object-contain"
          />
          <p className="mt-4 text-sm text-white/80">
            {lang === "en"
              ? "Hope for communities. Built from the ground up in Pondoland."
              : "Hoffnung für Gemeinschaften. Von Grund auf in Pondoland aufgebaut."}
          </p>
        </div>

        {/* SA org */}
        <div className="text-sm text-white/85">
          <h4 className="font-display text-base font-bold text-[var(--ithemba-yellow)]">iThemba Kuluntu NPC</h4>
          <ul className="mt-2 space-y-1.5">
            <li>Registration: 2023/199348/08</li>
            <li>PBO: 930081177</li>
            <li>NPO: 300-700</li>
            <li>VAT: 4430318792</li>
            <li className="flex items-start gap-2 pt-1.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>Flat Rock Cottage, Cwebeni Beach, Port St Johns, Eastern Cape, South Africa, 5090</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <a href="mailto:info@ithembakuluntu.org" className="hover:text-white">info@ithembakuluntu.org</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <a href="tel:+27719778063" className="hover:text-white">+27 71 977 8063</a>
            </li>
          </ul>
        </div>

        {/* DE */}
        <div className="text-sm text-white/85">
          <h4 className="font-display text-base font-bold text-[var(--ithemba-yellow)]">iThemba Kuluntu e.V. — Germany</h4>
          <ul className="mt-2 space-y-1.5">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>Am Emberg 20<br />57399 Kirchhundem<br />Germany</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <a href="mailto:info@ithembakuluntu.org" className="hover:text-white">info@ithembakuluntu.org</a>
            </li>
            <li className="pt-1.5">
              <div className="text-white/70">Eingetragen beim Amtsgericht Siegen</div>
              <div>Vereinsregister 6845</div>
            </li>
            <li>Steuernummer: 338/5953/0753</li>
            <li className="pt-1.5">
              <div className="font-semibold text-white">Bankverbindung</div>
              <div>iThemba Kuluntu e.V.</div>
              <div>IBAN: DE52 8306 5408 0005 4056 96</div>
              <div>BIC: GENODEF1SLR</div>
            </li>
          </ul>
        </div>

        {/* Newsletter + social */}
        <div>
          <h4 className="font-display text-base font-bold text-[var(--ithemba-yellow)]">
            {lang === "en" ? "Follow the journey" : "Begleiten Sie uns"}
          </h4>
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="mt-3 space-y-2"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lang === "en" ? "Your email" : "Ihre E-Mail"}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button type="submit" className="w-full rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] hover:bg-[var(--ithemba-yellow)]/90 font-semibold">
              {sent ? (lang === "en" ? "Thank you!" : "Danke!") : (lang === "en" ? "Subscribe" : "Abonnieren")}
            </Button>
          </form>
          <Placeholder text="newsletter platform" />

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/ithemba.kuluntu/"
              target="_blank" rel="noopener noreferrer"
              className={socialBase}
              aria-label="Follow iThemba Kuluntu on Instagram"
            ><Instagram className="h-5 w-5" /></a>
            <a
              href="https://web.facebook.com/people/IThemba-Kuluntu-e-V-NPO/61555304087486/"
              target="_blank" rel="noopener noreferrer"
              className={socialBase}
              aria-label="Follow iThemba Kuluntu on Facebook"
            ><Facebook className="h-5 w-5" /></a>
            <a
              href="https://www.tiktok.com/@ithemba.kuluntu"
              target="_blank" rel="noopener noreferrer"
              className={socialBase}
              aria-label="Follow iThemba Kuluntu on TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.83a8.16 8.16 0 0 0 4.77 1.52V6.9a4.85 4.85 0 0 1-1.84-.21z"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@iThembaKuluntu"
              target="_blank" rel="noopener noreferrer"
              className={socialBase}
              aria-label="Subscribe to iThemba Kuluntu on YouTube"
            ><Youtube className="h-5 w-5" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 py-5 pb-24 text-xs text-white/70 md:flex-row md:items-center md:justify-between md:pb-5 lg:px-8">
          <div>© {new Date().getFullYear()} iThemba Kuluntu NPC. All rights reserved.</div>
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/impressum" className="hover:text-white">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-white">Datenschutz</Link>
            <Link to="/cookie-policy" className="hover:text-white">Cookie Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Use</Link>
            <Link to="/donation-terms" className="hover:text-white">Donation Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
