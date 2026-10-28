import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "./LanguageProvider";
import { useCookiePreferences } from "./CookiePreferencesProvider";
import { cookieCopy } from "./cookie-copy";

/** Mount the player only after both a play request and explicit external-media consent. */
export function YouTubeEmbed({
  videoId,
  title,
  thumbnail,
  playIconClassName = "h-16 w-16",
}: {
  videoId: string;
  title: string;
  thumbnail?: string;
  playIconClassName?: string;
}) {
  const { lang } = useLang();
  const c = cookieCopy[lang];
  const { consent, savePreferences } = useCookiePreferences();
  const allowed = consent?.externalMedia === true;
  const [playing, setPlaying] = useState(false);
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    if (!allowed) setPlaying(false);
  }, [allowed]);
  if (allowed && playing)
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  return (
    <>
      <button
        type="button"
        className="group absolute inset-0 h-full w-full bg-gradient-to-br from-[#081A60] to-[#1E40C8]"
        aria-label={title}
        onClick={() => {
          if (allowed) setPlaying(true);
          else setRequested(true);
        }}
      >
        {thumbnail && (
          <img src={thumbnail} alt={title} loading="lazy" className="h-full w-full object-cover" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
          <PlayCircle className={playIconClassName} style={{ color: "var(--ithemba-yellow)" }} />
        </span>
      </button>
      {requested && !allowed && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-y-auto bg-black/85 p-3 text-center text-white"
          role="group"
          aria-label={c.media}
        >
          <p className="max-w-md text-xs leading-relaxed sm:text-sm">{c.playExplanation}</p>
          <Button
            variant="outline"
            className="h-auto min-h-10 max-w-full whitespace-normal bg-white px-3 py-2 text-xs text-[var(--ithemba-blue-dark)] sm:text-sm"
            onClick={() => {
              savePreferences(true);
              setRequested(false);
              setPlaying(true);
            }}
          >
            {c.allowPlay}
          </Button>
        </div>
      )}
    </>
  );
}
