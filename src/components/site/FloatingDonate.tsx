import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useLang } from "./LanguageProvider";

export function FloatingDonate() {
  const { lang } = useLang();
  return (
    <Link
      to="/donate"
      className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[var(--ithemba-yellow)] px-5 py-3 font-semibold text-[var(--ithemba-brown)] shadow-xl shadow-amber-900/20 transition-transform hover:scale-105 hover:shadow-2xl"
      aria-label={lang === "en" ? "Donate Monthly" : "Monatlich spenden"}
    >
      <Heart className="h-4 w-4 fill-current" />
      <span className="hidden sm:inline">{lang === "en" ? "Donate Monthly" : "Monatlich spenden"}</span>
      <span className="sm:hidden">{lang === "en" ? "Donate" : "Spenden"}</span>
    </Link>
  );
}
