import { type ReactNode } from "react";
import { Camera } from "lucide-react";

/**
 * PhotoPlaceholder — stands in for real photography. Visually feels like
 * a real image area (layered warm gradient, soft texture, vignette) with
 * a subtle corner label naming the photo that will eventually live here.
 */
export function PhotoPlaceholder({
  label,
  className = "",
  tone = "warm",
  rounded = "rounded-[2rem]",
  showLabel = true,
  children,
  gradient,
}: {
  label: string;
  className?: string;
  tone?: "warm" | "blue" | "earth" | "sun" | "ocean" | "green";
  rounded?: string;
  showLabel?: boolean;
  children?: ReactNode;
  /** legacy override */
  gradient?: string;
}) {
  const tones: Record<string, string> = {
    warm: "from-[#7C3A12] via-[#C26A2A] to-[#F0B870]",
    blue: "from-[#0B1F66] via-[#1E40C8] to-[#3F8CCF]",
    earth: "from-[#3F2A14] via-[#7A4A24] to-[#D9A86C]",
    sun: "from-[#7C3A12] via-[#E0902C] to-[#FBBF24]",
    ocean: "from-[#062E5A] via-[#0EA5E9] to-[#7DD3FC]",
    green: "from-[#14401E] via-[#16A34A] to-[#A7E3B5]",
  };
  const grad = gradient ?? tones[tone] ?? tones.warm;

  return (
    <div
      className={`relative isolate overflow-hidden ${rounded} bg-gradient-to-br ${grad} shadow-[0_20px_60px_-25px_rgb(15_42_140/0.45)] ring-1 ring-black/5 ${className}`}
    >
      {/* warm vignette + light wash to suggest depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_25%_15%,rgba(255,240,200,0.45),transparent_55%),radial-gradient(120%_80%_at_85%_90%,rgba(0,0,0,0.45),transparent_55%)]" />
      {/* film grain */}
      <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* faint horizon shape to read as landscape photo */}
      <svg className="absolute inset-x-0 bottom-0 h-1/3 w-full opacity-30" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
        <path d="M0,18 C20,10 40,22 60,14 C80,8 90,18 100,12 L100,30 L0,30 Z" fill="rgba(0,0,0,0.35)" />
      </svg>

      {showLabel && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
          <Camera className="h-3 w-3 shrink-0 text-white/90" />
          <span className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-white/90">
            Photo · {label}
          </span>
        </div>
      )}

      {children}
    </div>
  );
}
