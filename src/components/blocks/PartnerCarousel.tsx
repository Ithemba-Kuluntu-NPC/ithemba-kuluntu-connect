import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { partners, type Partner } from "@/data/projects";

function LogoItem({ p }: { p: Partner }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={p.name}
      title={p.name}
      className="group flex h-[120px] w-full items-center justify-center px-6"
    >
      <img
        src={p.logo}
        alt={`${p.name} logo`}
        loading="lazy"
        className="max-h-[90px] max-w-[240px] object-contain opacity-90 transition group-hover:opacity-100 group-hover:scale-[1.04]"
      />
    </a>
  );
}

export function PartnerCarousel() {
  const autoplay = useRef(
    Autoplay({ delay: 2200, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false, containScroll: false },
    [autoplay.current],
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    autoplay.current.play();
  }, [emblaApi]);

  return (
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
  );
}
