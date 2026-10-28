import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CONSENT_KEY, createConsent, parseConsent, type Consent } from "@/lib/cookie-consent";

type Preferences = {
  consent: Consent | null;
  ready: boolean;
  storageFailed: boolean;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  restoreFocus: () => void;
  savePreferences: (externalMedia: boolean) => void;
};
const Context = createContext<Preferences | null>(null);

export function CookiePreferencesProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      const saved = parseConsent(raw);
      setConsent(saved);
      if (raw === "rejected" && saved) localStorage.setItem(CONSENT_KEY, JSON.stringify(saved));
    } catch {
      setStorageFailed(true);
    }
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) setConsent(parseConsent(event.newValue));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const savePreferences = (externalMedia: boolean) => {
    const next = createConsent(externalMedia);
    setConsent(next);
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
      setStorageFailed(false);
    } catch {
      setStorageFailed(true);
    }
    setSettingsOpen(false);
  };
  return (
    <Context.Provider
      value={{
        consent,
        ready,
        storageFailed,
        settingsOpen,
        savePreferences,
        openSettings: () => {
          opener.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
          setSettingsOpen(true);
        },
        closeSettings: () => setSettingsOpen(false),
        restoreFocus: () => {
          if (opener.current?.isConnected) opener.current.focus();
          else {
            const target =
              document.querySelector<HTMLElement>("[data-cookie-manage]") ??
              document.querySelector<HTMLElement>("[data-cookie-settings]");
            target?.focus();
          }
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCookiePreferences() {
  const context = useContext(Context);
  if (!context) throw new Error("Cookie preferences require CookiePreferencesProvider");
  return context;
}
