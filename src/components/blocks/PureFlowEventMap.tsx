// PureFlow Amanzi — interactive impact map.
// Leaflet + OpenStreetMap. Verified event source: /content/projects/pureflow-events.json

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  GraduationCap,
  Home,
  MapPin,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BLUE = "#0F2A8C";
const BLUE_DEEP = "#081A60";
const YELLOW = "#FBBF24";
const GREEN = "#27845B";
const CREAM = "#FBF6E9";
const SERIF = '"Fraunces", "Georgia", serif';

type EventType =
  | "community-rollout"
  | "ecd-learning-site"
  | "implementation-partner-training";

type PureFlowEvent = {
  id: string;
  eventNumber: number;
  eventType: EventType;
  community?: string;
  ecdCentre?: string;
  partnerOrganisation?: string;
  location: string;
  householdsReached?: number;
  peopleReached?: number;
  childrenReached?: number;
  practitionersTrained?: number;
  safeWaterSystemsInstalled?: number;
  implementersTrained?: number;
  implementationPartner?: string;
  supportedBy: string | null;
  coreActivities: string[];
  coordinates: { lat: number; lng: number };
  photos: string[];
  note?: string;
  aggregationNote?: string;
};

type Filter = "all" | EventType;
type LocationGroup = {
  key: string;
  lat: number;
  lng: number;
  events: PureFlowEvent[];
};

const EVENT_TYPES: Record<
  EventType,
  { label: string; filterLabel: string; color: string }
> = {
  "community-rollout": {
    label: "Community Rollout",
    filterLabel: "Community Rollouts",
    color: YELLOW,
  },
  "ecd-learning-site": {
    label: "ECD & Learning Site",
    filterLabel: "ECD & Learning Sites",
    color: GREEN,
  },
  "implementation-partner-training": {
    label: "Implementation Partner Training",
    filterLabel: "Implementation Partner Training",
    color: BLUE,
  },
};

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All Events" },
  ...Object.entries(EVENT_TYPES).map(([value, item]) => ({
    value: value as EventType,
    label: item.filterLabel,
  })),
];

function eventTitle(event: PureFlowEvent) {
  return event.community ?? event.ecdCentre ?? event.partnerOrganisation ?? event.location;
}

function isEventType(value: unknown): value is EventType {
  return typeof value === "string" && value in EVENT_TYPES;
}

function isPureFlowEvent(value: unknown): value is PureFlowEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<PureFlowEvent>;
  return (
    typeof event.id === "string" &&
    typeof event.eventNumber === "number" &&
    isEventType(event.eventType) &&
    typeof event.location === "string" &&
    typeof event.coordinates?.lat === "number" &&
    typeof event.coordinates?.lng === "number" &&
    Array.isArray(event.coreActivities) &&
    event.coreActivities.every((item) => typeof item === "string") &&
    Array.isArray(event.photos) &&
    event.photos.every((item) => typeof item === "string")
  );
}

function groupEvents(events: PureFlowEvent[]): LocationGroup[] {
  const groups = new Map<string, LocationGroup>();
  for (const event of events) {
    const key = `${event.coordinates.lat},${event.coordinates.lng}`;
    const group = groups.get(key);
    if (group) group.events.push(event);
    else {
      groups.set(key, {
        key,
        lat: event.coordinates.lat,
        lng: event.coordinates.lng,
        events: [event],
      });
    }
  }
  return [...groups.values()];
}

function markerColor(group: LocationGroup, selectedId: string | null) {
  const selected = group.events.find((event) => event.id === selectedId);
  return EVENT_TYPES[(selected ?? group.events[0]).eventType].color;
}

function makeMarkerIcon(group: LocationGroup, selectedId: string | null): L.DivIcon {
  const selected = group.events.some((event) => event.id === selectedId);
  const fill = markerColor(group, selectedId);
  const stroke = selected ? "#FFFFFF" : BLUE_DEEP;
  const size = selected ? 42 : 36;
  const count = group.events.length;
  const title = group.events.map(eventTitle).join(", ").replace(/"/g, "&quot;");
  const badge = count > 1
    ? `<span aria-hidden="true" style="position:absolute;right:-7px;top:-7px;display:grid;place-items:center;width:20px;height:20px;border-radius:999px;background:${BLUE_DEEP};color:#fff;border:2px solid #fff;font:700 11px/1 Arial,sans-serif">${count}</span>`
    : "";
  const html = `<div role="img" aria-label="${title}" style="position:relative;width:${size}px;height:${size}px;border-radius:999px;background:${fill};border:3px solid ${stroke};box-shadow:0 5px 14px rgba(8,26,96,.35);display:grid;place-items:center;transform:${selected ? "scale(1.12)" : "none"}"><span aria-hidden="true" style="width:9px;height:9px;border-radius:999px;background:${fill === YELLOW ? BLUE_DEEP : "#fff"}"></span>${badge}</div>`;
  return L.divIcon({
    html,
    className: "pureflow-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function FitBounds({ groups }: { groups: LocationGroup[] }) {
  const map = useMap();
  const key = groups.map((group) => group.key).join("|");
  useEffect(() => {
    if (groups.length === 0) return;
    if (groups.length === 1) {
      map.setView([groups[0].lat, groups[0].lng], 12);
      return;
    }
    map.fitBounds(
      L.latLngBounds(groups.map((group) => [group.lat, group.lng] as [number, number])),
      { padding: [42, 42], maxZoom: 11 },
    );
  }, [groups, key, map]);
  return null;
}

function EventPhotoCarousel({ event }: { event: PureFlowEvent }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const count = event.photos.length;

  useEffect(() => setIndex(0), [event.id]);

  const change = (direction: -1 | 1) => {
    if (count < 2) return;
    setIndex((current) => (current + direction + count) % count);
  };

  const alt = `${eventTitle(event)} — PureFlow Amanzi ${EVENT_TYPES[event.eventType].label.toLowerCase()}`;

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-primary"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const end = event.changedTouches[0]?.clientX;
        touchStart.current = null;
        if (start === null || end === undefined || Math.abs(end - start) < 45) return;
        change(end < start ? 1 : -1);
      }}
    >
      <img
        key={event.photos[index]}
        src={event.photos[index]}
        alt={alt}
        loading={index === 0 ? "eager" : "lazy"}
        className="h-full w-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-primary/60 to-transparent" />

      {count > 1 && (
        <>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label={`Previous photo for ${eventTitle(event)}`}
            onClick={() => change(-1)}
            className="absolute left-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-background/90 text-foreground shadow-lg hover:bg-background"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label={`Next photo for ${eventTitle(event)}`}
            onClick={() => change(1)}
            className="absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-background/90 text-foreground shadow-lg hover:bg-background"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
          <p
            aria-live="polite"
            className="absolute bottom-3 right-3 rounded-full bg-primary/85 px-3 py-1 text-xs font-semibold text-primary-foreground"
          >
            {index + 1} / {count}
          </p>
          <div className="absolute bottom-4 left-1/2 flex max-w-[55%] -translate-x-1/2 gap-1" aria-hidden="true">
            {event.photos.map((photo, photoIndex) => (
              <span
                key={photo}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  photoIndex === index ? "w-5 bg-accent" : "w-1.5 bg-background/65",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="min-w-0 border-l-2 border-accent pl-3">
      <Icon className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
      <p className="text-2xl font-bold leading-none text-primary" style={{ fontFamily: SERIF }}>
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs font-semibold leading-snug text-muted-foreground">{label}</p>
    </div>
  );
}

function EventDetail({ event }: { event: PureFlowEvent }) {
  const category = EVENT_TYPES[event.eventType];
  const metrics = event.eventType === "community-rollout"
    ? [
        { icon: Home, label: "Households reached", value: event.householdsReached },
        { icon: Users, label: "People reached", value: event.peopleReached },
      ]
    : event.eventType === "ecd-learning-site"
      ? [
          { icon: Users, label: "Children reached", value: event.childrenReached },
          { icon: GraduationCap, label: "Practitioners trained", value: event.practitionersTrained },
          { icon: Droplets, label: "Safe-water systems installed", value: event.safeWaterSystemsInstalled },
        ]
      : [{ icon: Wrench, label: "Implementers trained", value: event.implementersTrained }];
  const validMetrics = metrics.filter((metric): metric is { icon: typeof Users; label: string; value: number } => typeof metric.value === "number");

  return (
    <article className="overflow-hidden rounded-3xl bg-card text-card-foreground shadow-2xl ring-1 ring-border">
      <div className="p-4 sm:p-5">
        <EventPhotoCarousel event={event} />
      </div>
      <div className="px-5 pb-6 sm:px-6 sm:pb-7">
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
          style={{
            backgroundColor: category.color,
            color: event.eventType === "community-rollout" ? BLUE_DEEP : "#FFFFFF",
          }}
        >
          {category.label}
        </span>
        <h3 className="mt-3 text-2xl font-bold leading-tight text-primary" style={{ fontFamily: SERIF }}>
          {eventTitle(event)}
        </h3>
        <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          {event.location}
        </p>

        <div className={cn("mt-6 grid gap-5", validMetrics.length === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2")}>
          {validMetrics.map((metric) => <Metric key={metric.label} {...metric} />)}
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Core activities</h4>
          <ul className="mt-3 space-y-2">
            {event.coreActivities.map((activity) => (
              <li key={activity} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {activity}
              </li>
            ))}
          </ul>
        </div>

        {(event.implementationPartner || event.supportedBy) && (
          <dl className="mt-5 border-t border-border pt-4 text-sm">
            {event.implementationPartner && (
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-1.5">
                <dt className="font-semibold text-muted-foreground">Implementation partner</dt>
                <dd className="font-bold text-primary">{event.implementationPartner}</dd>
              </div>
            )}
            {event.supportedBy && (
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-1.5">
                <dt className="font-semibold text-muted-foreground">Supported by</dt>
                <dd className="font-bold text-primary">{event.supportedBy}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-3xl bg-card text-sm text-primary" role="status">
      <span className="inline-flex items-center gap-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-accent" aria-hidden="true" />
        Loading verified events…
      </span>
    </div>
  );
}

export default function PureFlowEventMap() {
  const [events, setEvents] = useState<PureFlowEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/content/projects/pureflow-events.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Event data request failed (${response.status})`);
        return response.json() as Promise<unknown>;
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length !== 29 || !data.every(isPureFlowEvent)) {
          throw new Error("The verified event data could not be read.");
        }
        setEvents(data);
        setSelectedId(data[0].id);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(reason instanceof Error ? reason.message : "The verified event data could not be loaded.");
      });
    return () => controller.abort();
  }, []);

  const filteredEvents = useMemo(
    () => (events ?? []).filter((event) => filter === "all" || event.eventType === filter),
    [events, filter],
  );
  const groups = useMemo(() => groupEvents(filteredEvents), [filteredEvents]);
  const selected = useMemo(
    () => filteredEvents.find((event) => event.id === selectedId) ?? filteredEvents[0] ?? null,
    [filteredEvents, selectedId],
  );

  useEffect(() => {
    if (filteredEvents.length > 0 && !filteredEvents.some((event) => event.id === selectedId)) {
      setSelectedId(filteredEvents[0].id);
    }
  }, [filteredEvents, selectedId]);

  const selectEvent = (id: string, scrollOnMobile = false) => {
    setSelectedId(id);
    if (scrollOnMobile && typeof window !== "undefined" && window.innerWidth < 1024) {
      window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    }
  };

  if (error) {
    return (
      <div className="rounded-3xl border border-border bg-card px-6 py-12 text-center text-card-foreground" role="alert">
        <p className="font-bold text-primary" style={{ fontFamily: SERIF }}>The impact map is temporarily unavailable.</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }
  if (!events) return <LoadingState />;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 rounded-2xl bg-card/95 p-4 ring-1 ring-border sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Event category legend">
          {(Object.entries(EVENT_TYPES) as Array<[EventType, (typeof EVENT_TYPES)[EventType]]>).map(([type, item]) => (
            <span key={type} className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
              <span className="h-3 w-3 rounded-full border border-primary/25" style={{ backgroundColor: item.color }} aria-hidden="true" />
              {item.label}
            </span>
          ))}
        </div>
        <div className="flex max-w-full flex-wrap gap-2" aria-label="Filter map events">
          {FILTERS.map((item) => (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant={filter === item.value ? "default" : "outline"}
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={cn(
                "shrink-0 rounded-full",
                filter === item.value
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-primary/20 bg-background text-primary hover:bg-accent",
              )}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)] lg:items-start">
        <div className="min-w-0 overflow-hidden rounded-3xl bg-card shadow-2xl ring-1 ring-border">
          <div role="region" aria-label="PureFlow Amanzi impact map" className="h-[390px] w-full sm:h-[480px] lg:h-[620px]">
            <MapContainer
              center={[-30.3, 30.5]}
              zoom={7}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitBounds groups={groups} />
              {groups.map((group) => (
                <Marker
                  key={group.key}
                  position={[group.lat, group.lng]}
                  icon={makeMarkerIcon(group, selected?.id ?? null)}
                  eventHandlers={{
                    click: () => {
                      const current = group.events.find((event) => event.id === selected?.id);
                      selectEvent((current ?? group.events[0]).id);
                    },
                  }}
                  title={`${group.events.length > 1 ? `${group.events.length} events: ` : ""}${group.events.map(eventTitle).join(", ")}`}
                  keyboard
                >
                  {group.events.length > 1 && (
                    <Popup minWidth={250}>
                      <div className="space-y-2 py-1">
                        <p className="m-0 text-xs font-bold uppercase tracking-wider text-primary">
                          {group.events.length} events at this location
                        </p>
                        {group.events.map((event) => (
                          <Button
                            key={event.id}
                            type="button"
                            variant={event.id === selected?.id ? "default" : "outline"}
                            onClick={() => selectEvent(event.id, true)}
                            className="h-auto w-full justify-start whitespace-normal px-3 py-2 text-left text-xs"
                          >
                            {EVENT_TYPES[event.eventType].label}: {eventTitle(event)}
                          </Button>
                        ))}
                      </div>
                    </Popup>
                  )}
                </Marker>
              ))}
            </MapContainer>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>{filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}</span>
            <span>{groups.length} {groups.length === 1 ? "location" : "locations"}</span>
          </div>
        </div>

        <div ref={detailRef} className="min-w-0 scroll-mt-24">
          {selected && <EventDetail event={selected} />}
        </div>
      </div>
    </div>
  );
}
