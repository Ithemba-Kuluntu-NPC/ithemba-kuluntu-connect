import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function MissingInfoBadge({ text, kind = "missing" }: { text: string; kind?: "missing" | "verify" }) {
  const styles =
    kind === "missing"
      ? "bg-amber-100 text-amber-900 border-amber-300"
      : "bg-sky-100 text-sky-900 border-sky-300";
  const label = kind === "missing" ? "Missing info" : "Verify before launch";
  const Icon = kind === "missing" ? AlertTriangle : CheckCircle2;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}
      title={text}
    >
      <Icon className="h-3 w-3" aria-hidden />
      <span className="font-semibold">{label}:</span>
      <span className="font-normal">{text}</span>
    </span>
  );
}

export function Placeholder({ text, kind = "missing" }: { text: string; kind?: "missing" | "verify" }) {
  return (
    <div className="my-2">
      <MissingInfoBadge text={text} kind={kind} />
    </div>
  );
}
