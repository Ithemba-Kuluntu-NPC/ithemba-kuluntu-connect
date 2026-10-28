import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLang } from "./LanguageProvider";
import { useCookiePreferences } from "./CookiePreferencesProvider";
import { cookieCopy } from "./cookie-copy";

export function CookieConsent() {
  const { lang } = useLang();
  const c = cookieCopy[lang];
  const preferences = useCookiePreferences();
  const {
    consent,
    ready,
    settingsOpen,
    openSettings,
    closeSettings,
    savePreferences,
    restoreFocus,
    storageFailed,
  } = preferences;
  return (
    <>
      {ready && !consent && !settingsOpen && (
        <section
          aria-label={c.title}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-h-[85dvh] max-w-3xl overflow-y-auto rounded-2xl border border-border bg-white p-4 shadow-2xl md:p-5"
        >
          <h2 className="font-display text-base font-bold text-[var(--ithemba-blue-dark)]">
            {c.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {c.banner}{" "}
            <Link to="/cookie-policy" className="underline">
              {c.policy}
            </Link>
            .
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto min-h-10 whitespace-normal"
              onClick={() => savePreferences(false)}
            >
              {c.reject}
            </Button>
            <Button
              variant="outline"
              className="h-auto min-h-10 whitespace-normal"
              data-cookie-manage
              onClick={openSettings}
            >
              {c.manage}
            </Button>
            <Button
              variant="outline"
              className="h-auto min-h-10 whitespace-normal"
              onClick={() => savePreferences(true)}
            >
              {c.accept}
            </Button>
          </div>
        </section>
      )}
      {storageFailed && consent && !settingsOpen && (
        <p
          role="status"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border bg-white p-3 text-sm shadow-lg"
        >
          {c.storageFailed}
        </p>
      )}
      <Dialog.Root
        open={settingsOpen}
        onOpenChange={(open) => {
          if (!open) closeSettings();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/60" />
          <Dialog.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              restoreFocus();
            }}
            className="fixed left-1/2 top-1/2 z-[60] max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-[var(--ithemba-cream)] p-5 shadow-2xl sm:p-6"
          >
            <Dialog.Title className="font-display text-xl font-bold text-[var(--ithemba-blue-dark)]">
              {c.title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">
              {c.banner}
            </Dialog.Description>
            <PreferenceForm key={String(settingsOpen)} initial={consent?.externalMedia ?? false} />
            <Dialog.Close className="mt-4 text-sm text-[var(--ithemba-blue)] underline">
              {c.close}
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function PreferenceForm({ initial }: { initial: boolean }) {
  const { lang } = useLang();
  const c = cookieCopy[lang];
  const { savePreferences, storageFailed } = useCookiePreferences();
  const [externalMedia, setExternalMedia] = useState(initial);
  return (
    <>
      <div className="mt-5 space-y-4">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="essential-cookies" className="font-semibold">
              {c.essential}
            </label>
            <input
              id="essential-cookies"
              type="checkbox"
              checked
              disabled
              aria-describedby="essential-description"
            />
          </div>
          <p className="mt-1 text-xs font-semibold">{c.locked}</p>
          <p id="essential-description" className="mt-2 text-sm text-muted-foreground">
            {c.essentialDescription}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="external-media-cookies" className="font-semibold">
              {c.media}
            </label>
            <Switch
              id="external-media-cookies"
              checked={externalMedia}
              onCheckedChange={setExternalMedia}
              aria-describedby="external-media-description"
            />
          </div>
          <p id="external-media-description" className="mt-2 text-sm text-muted-foreground">
            {c.mediaDescription}
          </p>
        </div>
      </div>
      {storageFailed && (
        <p role="status" className="mt-3 text-sm">
          {c.storageFailed}
        </p>
      )}
      <div className="mt-5 grid gap-2">
        <Button variant="outline" onClick={() => savePreferences(externalMedia)}>
          {c.save}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-auto min-h-10 whitespace-normal"
            onClick={() => savePreferences(false)}
          >
            {c.reject}
          </Button>
          <Button
            variant="outline"
            className="h-auto min-h-10 whitespace-normal"
            onClick={() => savePreferences(true)}
          >
            {c.accept}
          </Button>
        </div>
      </div>
    </>
  );
}
