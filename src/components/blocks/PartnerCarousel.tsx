import { useEffect, useRef, type FocusEvent } from "react";
import { partners, type Partner } from "@/data/projects";
import styles from "./PartnerCarousel.module.css";

// Compensate for whitespace inside the existing artwork without changing the files.
const logoSizes: Record<string, string> = {
  "Fresh Life Produce": styles.paddedWide,
  "SA Harvest": styles.paddedWide,
  "Tzu Chi Foundation": styles.insetArtwork,
  "Nando’s": styles.padded,
  "Rise Against Hunger Africa": styles.padded,
  "Küstenhunde e.V.": styles.padded,
  "Lingham Foundation": styles.padded,
};

function LogoItem({ p, duplicate }: { p: Partner; duplicate: boolean }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={p.name}
      title={p.name}
      tabIndex={duplicate ? -1 : undefined}
      className={styles.logoLink}
    >
      <img
        src={p.logo}
        alt={`${p.name} logo`}
        loading="lazy"
        className={`${styles.logo} ${logoSizes[p.name] ?? ""}`}
      />
    </a>
  );
}

export function PartnerCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sequence = sequenceRef.current;
    const track = trackRef.current;
    if (!sequence || !track) return;

    // Keep the same calm 60px/second pace as responsive logo boxes change width.
    const observer = new ResizeObserver(() => {
      track.style.setProperty("--partner-marquee-duration", `${sequence.offsetWidth / 60}s`);
    });
    observer.observe(sequence);
    return () => observer.disconnect();
  }, []);

  function revealFocusedLogo(event: FocusEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const sequence = sequenceRef.current;
    const link = (event.target as HTMLElement).closest("a");
    const animation = track?.getAnimations()[0];
    if (
      !viewport ||
      !track ||
      !sequence ||
      !link ||
      !animation ||
      !sequence.contains(link) ||
      !link.matches(":focus-visible")
    )
      return;

    const bounds = viewport.getBoundingClientRect();
    const logo = link.getBoundingClientRect();
    const inset = bounds.width * 0.06;
    if (logo.left >= bounds.left + inset && logo.right <= bounds.right - inset) return;

    // Offscreen primary links stay reachable by keyboard. Move the paused timeline
    // to the focused logo, then resume from that position when focus leaves.
    const offset = logo.left - track.getBoundingClientRect().left;
    const duration = Number(animation.effect?.getComputedTiming().duration);
    animation.currentTime = (Math.max(0, offset - inset) / sequence.offsetWidth) * duration;
  }

  return (
    <div
      ref={viewportRef}
      className={styles.viewport}
      onFocusCapture={revealFocusedLogo}
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <div ref={trackRef} className={styles.track}>
        {[false, true].map((duplicate) => (
          <ul
            key={String(duplicate)}
            ref={duplicate ? undefined : sequenceRef}
            className={styles.sequence}
            aria-hidden={duplicate ? true : undefined}
          >
            {partners.map((p) => (
              <li key={p.name} className={styles.item}>
                <LogoItem p={p} duplicate={duplicate} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
