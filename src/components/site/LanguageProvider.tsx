import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang, TString } from "@/data/content";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TString) => string };
const LanguageContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k.en });

function translate(k: TString, lang: Lang): string {
  if (lang === "en") return k.en;
  if (lang === "de") return k.de ?? k.en;
  // nl: prefer Dutch when supplied; otherwise fall back to English so the
  // UI stays readable. Final Dutch copy will be added later — see the
  // content audit at /missing-information.
  return k.nl ?? k.en;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "de" || saved === "nl") setLangState(saved);
    } catch {
      // Keep localization and privacy controls usable when browser storage is blocked.
    }
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      // The selected language still applies for this visit.
    }
  };
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: (k) => translate(k, lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
