import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useLang } from "./LanguageProvider";

export function FloatingDonate() {
  const { lang } = useLang();
  return (
    <Link
      to="/donate"
      className="group fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-[var(--ithemba-yellow)] px-4 py-2.5 text-sm font-semibold text-[var(--ithemba-brown)] shadow-xl shadow-amber-900/25 ring-1 ring-amber-900/10 transition hover:scale-[1.04] hover:shadow-2xl sm:bottom-6 sm:right-6 sm:px-5 sm:py-3 sm:text-base"
      aria-label={lang === "en" ? "Donate Monthly" : "Monatlich spenden"}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-amber-300/60 opacity-60 group-hover:opacity-100" />
        <Heart className="relative h-4 w-4 fill-current" />
      </span>
      <span className="hidden sm:inline">{lang === "en" ? "Donate Monthly" : "Monatlich spenden"}</span>
      <span className="sm:hidden">{lang === "en" ? "Donate" : "Spenden"}</span>
    </Link>
  );
}
