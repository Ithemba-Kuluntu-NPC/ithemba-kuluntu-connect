import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/data/content";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: { en: string; de: string }) => string };
const LanguageContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k.en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (saved === "en" || saved === "de") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: (k) => k[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
