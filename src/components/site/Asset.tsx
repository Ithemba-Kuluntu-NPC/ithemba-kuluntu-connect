import { useState, type ReactNode } from "react";
import { PhotoPlaceholder } from "@/components/blocks/PhotoPlaceholder";
import { MissingInfoBadge } from "@/components/site/MissingInfo";
import { missingAssetMessage } from "@/data/assets";
import * as Icons from "lucide-react";

/**
 * SmartImage — renders a real <img> for a planned asset path. If the file is
 * missing (404 / load error), it falls back to the existing PhotoPlaceholder
 * and shows a clear missing-info badge so editors know what to upload.
 */
export function SmartImage({
  src,
  label,
  className = "",
  imgClassName = "",
  tone = "warm",
  rounded = "rounded-[2rem]",
  showMissingBadge = true,
  showLabel = false,
  children,
}: {
  src: string;
  label: string;
  className?: string;
  imgClassName?: string;
  tone?: "warm" | "blue" | "earth" | "sun" | "ocean" | "green";
  rounded?: string;
  showMissingBadge?: boolean;
  showLabel?: boolean;
  children?: ReactNode;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={`relative ${className}`}>
        <PhotoPlaceholder
          label={label}
          className="h-full w-full"
          tone={tone}
          rounded={rounded}
          showLabel={showLabel}
        >
          {children}
        </PhotoPlaceholder>
        {showMissingBadge && (
          <div className="absolute left-2 top-2 z-10 max-w-[calc(100%-1rem)]">
            <MissingInfoBadge text={missingAssetMessage(src)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`}>
      <img
        src={src}
        alt={label}
        className={`h-full w-full object-cover ${imgClassName}`}
        onError={() => setErrored(true)}
        loading="lazy"
      />
      {children}
    </div>
  );
}

/**
 * SmartIcon — renders a planned PNG icon (transparent background). Falls back
 * to a Lucide icon and shows a small missing-info badge underneath.
 */
export function SmartIcon({
  src,
  alt,
  fallbackLucideName,
  className = "h-8 w-8",
  color,
}: {
  src: string;
  alt: string;
  fallbackLucideName: string;
  className?: string;
  color?: string;
}) {
  const [errored, setErrored] = useState(false);
  const Fallback = ((Icons as unknown) as Record<string, Icons.LucideIcon>)[fallbackLucideName] ?? Icons.Heart;

  if (errored) {
    return (
      <>
        <Fallback className={className} style={color ? { color } : undefined} />
        <span className="sr-only">[[MISSING: {missingAssetMessage(src)}]]</span>
      </>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} object-contain p-1`}
      onError={() => setErrored(true)}
    />
  );
}

/**
 * SmartLogo — renders a planned logo PNG. Falls back to a child node
 * (the existing visual placeholder mark) plus a visible missing badge.
 */
export function SmartLogo({
  src,
  alt,
  className = "",
  fallback,
  showMissingBadge = true,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
  showMissingBadge?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <>
        {fallback}
        {showMissingBadge && (
          <span className="sr-only">[[MISSING: {missingAssetMessage(src)}]]</span>
        )}
      </>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
