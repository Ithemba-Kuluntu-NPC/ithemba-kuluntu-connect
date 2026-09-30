import { useCallback, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type ContentPhoto = {
  src: string;
  lightboxSrc?: string;
  alt: string;
};

// This is intentionally explicit: every derivative here is backed by a job in
// scripts/generate-web-media.mjs. Never infer originals by rewriting a URL.
const GENERATED_ORIGINALS: Record<string, string> = {
  "/assets/generated-performance/ECD-close-up-boy-eating-breakfast-porrdige-web.jpg":
    "/assets/photos/projects/ECD/ECD-close-up-boy-eating-breakfast-porrdige.jpg",
  "/assets/generated-performance/ECD-children-playing-with-ring-web.jpg":
    "/assets/photos/projects/ECD/ECD-children-playing-with-ring.jpg",
  "/assets/generated-performance/ECD-group-photo-with-children-and-teacher-web.jpg":
    "/assets/photos/projects/ECD/ECD-group-photo-with-children-and-teacher.jpg",
  "/assets/generated-performance/pureflow-ecd-handout-event-smiling-mom-at-training-station-web.jpg":
    "/assets/photos/projects/pureflow/pureflow-ecd-handout-event-smiling-mom-at-training-station.jpg",
  "/assets/generated-performance/pureflow-home-visit-filter-installation-family-01-web.jpg":
    "/assets/photos/projects/pureflow/pureflow-home-visit-filter-installation-family-01.jpg",
  "/assets/generated-performance/pureflow-step-01-structural-problem-3-web.jpg":
    "/assets/photos/projects/pureflow/pureflow-step-01-structural-problem-3.jpg",
  "/assets/generated-performance/pureflow-community-engagement-sibonda-outdoor-meeting-team-and-filter-01-web.jpg":
    "/assets/photos/projects/pureflow/pureflow-community-engagement-sibonda-outdoor-meeting-team-and-filter-01.jpg",
  "/assets/generated-performance/pureflow-happy-dancing-recipients-of-filter-after-event-web.jpg":
    "/assets/photos/projects/pureflow/pureflow-happy-dancing-recipients-of-filter-after-event.jpg",
  "/assets/generated-performance/pureflow-handout-event-01-assembly-components-table-01-web.jpg":
    "/assets/photos/projects/pureflow/pureflow-handout-event-01-assembly-components-table-01.jpg",
  "/assets/generated-performance/pureflow-community-engagement-royal-house-large-community-meeting-01-web.jpg":
    "/assets/photos/projects/pureflow/pureflow-community-engagement-royal-house-large-community-meeting-01.jpg",
  "/assets/generated-performance/food-security-community-meals-mother-and-child-eating-community-meal-30-web.jpg":
    "/assets/photos/projects/foodsecurity/food-security-community-meals-mother-and-child-eating-community-meal-30.jpg",
  "/assets/generated-performance/food-security-greenhouse-harvest-close-up-of-spinach-leaves-01-web.jpg":
    "/assets/photos/projects/foodsecurity/food-security-greenhouse-harvest-close-up-of-spinach-leaves-01.jpg",
  "/assets/generated-performance/food-security-partner-support-woman-seated-with-rise-against-hunger-box-05-web.jpg":
    "/assets/photos/projects/foodsecurity/food-security-partner-support-woman-seated-with-rise-against-hunger-box-05.jpg",
  "/assets/generated-performance/Greenhouse-wide-angle-beautiful-light-web.jpg":
    "/assets/photos/projects/greenhouse/Greenhouse-wide-angle-beautiful-light.jpg",
  "/assets/generated-performance/20251009_155233(0)-web.jpg":
    "/assets/photos/projects/pondodogs/20251009_155233(0).jpg",
  "/assets/generated-performance/20251102_133018-web.jpg":
    "/assets/photos/projects/pondodogs/20251102_133018.jpg",
  "/assets/generated-performance/20260130_163511-web.jpg":
    "/assets/photos/projects/pondodogs/20260130_163511.jpg",
  "/assets/generated-performance/20260401_113020-web.jpg":
    "/assets/photos/projects/pondodogs/20260401_113020.jpg",
};

export function contentPhoto(src: string, alt: string, lightboxSrc?: string): ContentPhoto {
  return { src, alt, lightboxSrc: lightboxSrc ?? GENERATED_ORIGINALS[src] ?? src };
}

export function PhotoLightboxGallery({
  photos,
  children,
  label = "Photo gallery",
}: {
  photos: readonly ContentPhoto[];
  children: (openPhoto: (index: number) => void) => ReactNode;
  label?: string;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStart = useRef<number | null>(null);
  const count = photos.length;
  const change = useCallback(
    (direction: -1 | 1) => {
      if (count > 1) setIndex((current) => (current + direction + count) % count);
    },
    [count],
  );
  const openPhoto = (nextIndex: number) => {
    if (!photos[nextIndex]) return;
    setIndex(nextIndex);
    setOpen(true);
  };
  const photo = photos[index];

  return (
    <>
      {children(openPhoto)}
      <Dialog open={open && Boolean(photo)} onOpenChange={setOpen}>
        <DialogContent
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              change(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              change(1);
            }
          }}
          className="flex h-[100dvh] w-screen max-w-none items-center justify-center border-0 bg-transparent p-4 shadow-none sm:rounded-none sm:p-8 [&>button]:right-4 [&>button]:top-4 [&>button]:z-20 [&>button]:grid [&>button]:h-12 [&>button]:w-12 [&>button]:place-items-center [&>button]:rounded-full [&>button]:bg-black/60 [&>button]:text-white [&>button]:opacity-100 [&>button_svg]:h-7 [&>button_svg]:w-7"
        >
          <DialogTitle className="sr-only">{label}</DialogTitle>
          <div
            className="relative flex h-full w-full items-center justify-center"
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
            onTouchStart={(event) => {
              touchStart.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              const end = event.changedTouches[0]?.clientX;
              touchStart.current = null;
              if (start !== null && end !== undefined && Math.abs(end - start) >= 45)
                change(end < start ? 1 : -1);
            }}
          >
            {photo && (
              <img
                key={`${index}-${photo.lightboxSrc ?? photo.src}`}
                src={photo.lightboxSrc ?? photo.src}
                alt={photo.alt}
                className="max-h-[calc(100dvh-8rem)] max-w-[calc(100vw-2rem)] rounded-xl object-contain shadow-2xl sm:max-w-[calc(100vw-8rem)]"
                onPointerDown={(event) => event.stopPropagation()}
              />
            )}
            {count > 1 && (
              <>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  aria-label="Previous photo"
                  onClick={() => change(-1)}
                  className="absolute left-0 top-1/2 z-10 h-14 w-14 -translate-y-1/2 rounded-full bg-background/90 shadow-xl hover:bg-background sm:left-2 sm:h-16 sm:w-16"
                >
                  <ChevronLeft className="h-8 w-8" aria-hidden />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  aria-label="Next photo"
                  onClick={() => change(1)}
                  className="absolute right-0 top-1/2 z-10 h-14 w-14 -translate-y-1/2 rounded-full bg-background/90 shadow-xl hover:bg-background sm:right-2 sm:h-16 sm:w-16"
                >
                  <ChevronRight className="h-8 w-8" aria-hidden />
                </Button>
              </>
            )}
            <p
              aria-live="polite"
              className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-4 py-2 text-sm font-semibold text-white"
            >
              {index + 1} / {count}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
