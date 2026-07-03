// PureFlow Amanzi — interactive rollout events map.
//
// Uses Leaflet + OpenStreetMap (no API key, no Google Maps).
// Data source: /content/projects/pureflow-events.json
// NOTE: initial dataset contains PLACEHOLDER / DEMO events for design preview
// only. Replace with verified PureFlow Amanzi event data before public launch.

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BLUE = "#0F2A8C";
const BLUE_DEEP = "#081A60";
const YELLOW = "#FBBF24";
const SERIF = '"Fraunces", "Georgia", serif';

type PureFlowEvent = {
  id: string;
  community: string;
  date: string;
  eventType: string;
  householdsReached: number;
  peopleReached: number;
  partnerSupporter: string;
  description: string;
  coordinates: { lat: number; lng: number };
  photos: string[];
};

function makeMarkerIcon(selected: boolean, label: string): L.DivIcon {
  const fill = selected ? BLUE : YELLOW;
  const stroke = selected ? YELLOW : BLUE_DEEP;
  const scale = selected ? 1.15 : 1;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${34 * scale}" height="${44 * scale}" viewBox="0 0 34 44" aria-hidden="true">
  <path d="M17 1c8.837 0 16 7.163 16 16 0 11-16 26-16 26S1 28 1 17C1 8.163 8.163 1 17 1z"
        fill="${fill}" stroke="${stroke}" stroke-width="2.5" />
  <circle cx="17" cy="17" r="5.5" fill="${stroke}" />
</svg>`;
  return L.divIcon({
    html: `<div role="img" aria-label="${label.replace(/"/g, "&quot;")}" style="filter:drop-shadow(0 4px 6px rgba(8,26,96,0.35));">${svg}</div>`,
    className: "pureflow-marker",
    iconSize: [34 * scale, 44 * scale],
    iconAnchor: [17 * scale, 42 * scale],
  });
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 10), { duration: 0.75 });
  }, [lat, lng, map]);
  return null;
}

function EventPhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  const [errored, setErrored] = useState<Record<number, boolean>>({});
  useEffect(() => setIdx(0), [photos]);

  const has = photos.length > 0;
  const current = has ? photos[idx] : null;
  const isBroken = current ? errored[idx] : true;

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-black/5"
      style={{ background: `linear-gradient(135deg, ${BLUE_DEEP}, ${BLUE})` }}
    >
      {current && !isBroken ? (
        <img
          src={current}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setErrored((e) => ({ ...e, [idx]: true }))}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-center">
          <div className="px-6">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: YELLOW, color: BLUE_DEEP, fontFamily: SERIF }}
            >
              <span className="text-xl font-bold">PA</span>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/85">
              PureFlow Amanzi · photo coming soon
            </p>
          </div>
        </div>
      )}

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => setIdx((i) => (i - 1 + photos.length) % photos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-slate-800 shadow-md ring-1 ring-black/10 backdrop-blur hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => setIdx((i) => (i + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-slate-800 shadow-md ring-1 ring-black/10 backdrop-blur hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/45"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function DetailPanel({ event }: { event: PureFlowEvent | null }) {
  if (!event) {
    return (
      <div
        className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center"
        style={{ borderColor: `${YELLOW}66`, background: "#ffffff" }}
      >
        <div className="mb-3 h-2 w-16 rounded-full" style={{ background: YELLOW }} />
        <p className="text-sm font-semibold" style={{ color: BLUE_DEEP, fontFamily: SERIF }}>
          Select a location
        </p>
        <p className="mt-1 max-w-xs text-xs text-slate-600">
          Tap any pin on the map to see details from that PureFlow Amanzi rollout event.
        </p>
      </div>
    );
  }

  const rows: Array<[string, string]> = [
    ["Community", event.community],
    ["Date", formatDate(event.date)],
    ["Households reached", event.householdsReached.toLocaleString()],
    ["People reached", event.peopleReached.toLocaleString()],
    ["Partner / supporter", event.partnerSupporter],
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.55)] ring-1 ring-black/5">
      <div className="p-4 md:p-5">
        <EventPhotoCarousel photos={event.photos} alt={event.community} />
      </div>
      <div className="px-5 pb-6">
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{ background: YELLOW, color: BLUE_DEEP }}
        >
          {event.eventType}
        </span>
        <h3
          className="mt-2 text-xl font-bold leading-tight md:text-2xl"
          style={{ color: BLUE_DEEP, fontFamily: SERIF }}
        >
          {event.community}
        </h3>
        <dl className="mt-4 divide-y divide-slate-100">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 py-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {k}
              </dt>
              <dd className="text-right text-sm font-medium" style={{ color: BLUE_DEEP }}>
                {v}
              </dd>
            </div>
          ))}
        </dl>
        {event.description && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Description
            </p>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: BLUE_DEEP }}>
              {event.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PureFlowEventMap() {
  const [events, setEvents] = useState<PureFlowEvent[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/content/projects/pureflow-events.json")
      .then((r) => r.json())
      .then((data: PureFlowEvent[]) => {
        if (!cancelled) {
          const cleaned = Array.isArray(data)
            ? data.filter((e) => e && e.coordinates && typeof e.coordinates.lat === "number")
            : [];
          setEvents(cleaned);
        }
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = events ?? [];
  const selected = useMemo(
    () => items.find((e) => e.id === selectedId) ?? null,
    [items, selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const defaultCenter: [number, number] = [-31.62, 29.55];
  const defaultZoom = 8;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
        <div
          role="region"
          aria-label="PureFlow Amanzi rollout events map"
          className="h-[360px] w-full sm:h-[440px] md:h-[500px] lg:h-[540px]"
        >
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {items.map((e) => (
              <Marker
                key={e.id}
                position={[e.coordinates.lat, e.coordinates.lng]}
                icon={makeMarkerIcon(e.id === selectedId, e.community)}
                eventHandlers={{
                  click: () => handleSelect(e.id),
                  keydown: (ev) => {
                    const key = (ev.originalEvent as KeyboardEvent).key;
                    if (key === "Enter" || key === " ") handleSelect(e.id);
                  },
                }}
                title={e.community}
                alt={e.community}
                keyboard
              />
            ))}
            {selected && <FlyTo lat={selected.coordinates.lat} lng={selected.coordinates.lng} />}
          </MapContainer>
        </div>
        <div
          className="border-t px-4 py-2 text-[11px]"
          style={{ borderColor: `${BLUE}22`, color: BLUE_DEEP }}
        >
          {items.length} event{items.length === 1 ? "" : "s"} shown ·{" "}
          <span className="italic text-slate-500">
            Demo data · replace with verified events before launch.
          </span>
        </div>
      </div>

      <div ref={detailRef}>
        <DetailPanel event={selected} />
      </div>
    </div>
  );
}
