import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { Placeholder } from "./MissingInfo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLang } from "./LanguageProvider";

export function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { lang } = useLang();

  return (
    <footer className="mt-24 border-t border-border bg-[var(--ithemba-blue-dark)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Org */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] font-display font-bold text-[var(--ithemba-brown)]">iK</div>
            <div className="font-display font-bold text-lg">iThemba Kuluntu</div>
          </div>
          <p className="mt-3 text-sm text-white/80">
            {lang === "en"
              ? "Hope for communities. Built from the ground up in Pondoland."
              : "Hoffnung für Gemeinschaften. Von Grund auf in Pondoland aufgebaut."}
          </p>
          <Placeholder text="Main iThemba Kuluntu logo (white version)" />
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
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Flat Rock Cottage, Cwebeni Beach, Port St Johns, Eastern Cape, South Africa, 5090
            </li>
            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span>info@ithembakuluntu.org</span></li>
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /><span>+27 71 977 8063</span></li>
          </ul>
          <Placeholder text="public phone number" kind="verify" />
        </div>

        {/* DE */}
        <div className="text-sm text-white/85">
          <h4 className="font-display text-base font-bold text-[var(--ithemba-yellow)]">iThemba Kuluntu e.V. — Germany</h4>
          <div className="mt-2 space-y-1">
            <Placeholder text="German registered address" />
            <Placeholder text="German registration details" />
            <Placeholder text="German donation account details" />
            <Placeholder text="German contact details" />
          </div>
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

          <div className="mt-4 flex gap-2">
            <a
              href="https://www.instagram.com/ithemba.kuluntu/"
              target="_blank" rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Instagram"
              title="Instagram — verify before launch"
            ><Instagram className="h-4 w-4" /></a>
            <button
              disabled
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/40 cursor-not-allowed"
              title="[[MISSING: final Facebook URL]]"
              aria-label="Facebook (URL missing)"
            ><Facebook className="h-4 w-4" /></button>
            <button
              disabled
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/40 cursor-not-allowed"
              title="[[MISSING: final YouTube URL]]"
              aria-label="YouTube (URL missing)"
            ><Youtube className="h-4 w-4" /></button>
            <button
              disabled
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/40 cursor-not-allowed text-xs font-bold"
              title="[[MISSING: final TikTok URL]]"
              aria-label="TikTok (URL missing)"
            >TT</button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 py-5 text-xs text-white/70 md:flex-row md:items-center md:justify-between lg:px-8">
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
