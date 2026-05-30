import { partners, type Partner } from "@/data/projects";

function LogoStage({ p }: { p: Partner }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={p.name}
      title={p.name}
      className="group flex h-[110px] w-full items-center justify-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <img
        src={p.logo}
        alt={`${p.name} logo`}
        loading="lazy"
        className="max-h-[70px] max-w-[170px] object-contain transition group-hover:scale-[1.03]"
      />
    </a>
  );
}

export function PartnerGrid({ showPlaceholders: _showPlaceholders = true }: { showPlaceholders?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {partners.map((p) => (
        <LogoStage key={p.name} p={p} />
      ))}
    </div>
  );
}

export { LogoStage as PartnerLogoStage };
