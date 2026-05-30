import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { partners } from "@/data/projects";
import { PartnerLogoStage } from "./PartnerGrid";

export function PartnerCarousel() {
  const autoplay = useRef(
    Autoplay({ delay: 2800, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false, containScroll: "trimSnaps" },
    [autoplay.current],
  );

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi]);

  return (
    <div className="embla overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {partners.map((p) => (
          <div
            key={p.name}
            className="min-w-0 shrink-0 grow-0 basis-1/2 px-2 sm:basis-1/3 lg:basis-1/3"
          >
            <PartnerLogoStage p={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
