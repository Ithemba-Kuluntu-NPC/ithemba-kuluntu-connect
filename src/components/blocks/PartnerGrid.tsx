import { partners, type Partner } from "@/data/projects";

function LogoStage({ p }: { p: Partner }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={p.name}
      title={p.name}
      className="group flex h-[110px] w-full items-center justify-center p-4"
    >
      <img
        src={p.logo}
        alt={`${p.name} logo`}
        loading="lazy"
        className="max-h-[80px] max-w-[200px] object-contain opacity-90 transition group-hover:opacity-100 group-hover:scale-[1.04]"
      />
    </a>
  );
}

export function PartnerGrid({ showPlaceholders: _showPlaceholders = true }: { showPlaceholders?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
      {partners.map((p) => (
        <LogoStage key={p.name} p={p} />
      ))}
    </div>
  );
}

export { LogoStage as PartnerLogoStage };
