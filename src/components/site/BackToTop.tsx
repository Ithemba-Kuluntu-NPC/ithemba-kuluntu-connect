import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLang } from "./LanguageProvider";

export function BackToTop() {
  const { lang } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const on = () => setShow(window.scrollY > 480);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const label = lang === "de" ? "Nach oben" : lang === "nl" ? "Terug naar boven" : "Back to top";

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={label}
      title={label}
      className={`fixed right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[var(--ithemba-blue-dark)] shadow-lg backdrop-blur transition-all hover:bg-white sm:right-6 sm:h-11 sm:w-11 ${
        show ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
      }`}
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 4.75rem)" }}
    >
      <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
}
