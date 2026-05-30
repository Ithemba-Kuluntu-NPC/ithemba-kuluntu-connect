import { useState } from "react";
import { focusAreaBadgeMeta, type FocusAreaBadge } from "@/data/projects";

function BadgeImg({
  src,
  label,
  sizing,
}: {
  src: string;
  label: string;
  sizing: string;
}) {
  const [errored, setErrored] = useState(false);
  if (errored) return null;
  return (
    <img
      src={src}
      alt={label}
      title={label}
      className={`${sizing} object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]`}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

export function FocusAreaBadges({
  badges,
  size = "sm",
  className = "",
}: {
  badges: FocusAreaBadge[];
  size?: "sm" | "md";
  className?: string;
}) {
  if (!badges?.length) return null;
  const sizing =
    size === "md"
      ? "h-10 w-10 md:h-12 md:w-12"
      : "h-8 w-8 md:h-10 md:w-10";
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {badges.map((b) => {
        const meta = focusAreaBadgeMeta[b];
        if (!meta) return null;
        return <BadgeImg key={b} src={meta.src} label={meta.label} sizing={sizing} />;
      })}
    </div>
  );
}
