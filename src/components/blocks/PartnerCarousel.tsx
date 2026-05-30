import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { partners, type Partner } from "@/data/projects";
import { cn } from "@/lib/utils";

function LogoItem({ p }: { p: Partner }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={p.name}
      title={p.name}
      className="group flex h-[150px] w-full items-center justify-center px-6"
    >
      <img
        src={p.logo}
        alt={`${p.name} logo`}
        loading="lazy"
        className={cn(
          "object-contain opacity-90 transition group-hover:opacity-100 group-hover:scale-[1.04]",
          p.sizeClass ?? "max-h-[120px] max-w-[260px]",
        )}
      />
    </a>
  );
}

export function PartnerCarousel() {
  const autoplay = useRef(
    Autoplay({ delay: 2400, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false, containScroll: false },
    [autoplay.current],
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    autoplay.current.play();
    const onSel = () => setTick((t) => t + 1);
    emblaApi.on("select", onSel);
    emblaApi.on("reInit", onSel);
    return () => {
      emblaApi.off("select", onSel);
      emblaApi.off("reInit", onSel);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    autoplay.current.reset();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    autoplay.current.reset();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div
        className="relative"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {partners.map((p) => (
              <div
                key={p.name}
                className="min-w-0 shrink-0 grow-0 basis-1/2 sm:basis-1/3 lg:basis-1/3"
              >
                <LogoItem p={p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous partners"
        className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] shadow-md transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ithemba-brown)] focus-visible:ring-offset-2 md:left-2"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next partners"
        className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--ithemba-yellow)] text-[var(--ithemba-brown)] shadow-md transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ithemba-brown)] focus-visible:ring-offset-2 md:right-2"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
