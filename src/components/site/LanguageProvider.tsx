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
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (saved === "en" || saved === "de" || saved === "nl") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: (k) => translate(k, lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
