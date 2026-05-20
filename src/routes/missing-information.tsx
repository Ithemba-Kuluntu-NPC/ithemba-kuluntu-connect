import { createFileRoute } from "@tanstack/react-router";
import { missingInformation } from "@/data/missing";
import { AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";

export const Route = createFileRoute("/missing-information")({ component: MissingInfoPage });

function MissingInfoPage() {
  const totalMissing = missingInformation.reduce((n, c) => n + c.items.filter(i => i.status === "missing").length, 0);
  const totalVerify = missingInformation.reduce((n, c) => n + c.items.filter(i => i.status === "verify").length, 0);
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
      <div className="rounded-3xl border-2 border-dashed border-amber-300 bg-amber-50 p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
          <AlertTriangle className="h-3.5 w-3.5" /> Internal prototype checklist
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold">Missing & Verification Checklist</h1>
        <p className="mt-2 text-sm text-foreground/80">
          This internal prototype checklist shows which content, legal details, assets and integrations still need to be supplied before launch.
          Not linked from public navigation.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900"><AlertTriangle className="h-3.5 w-3.5" /> {totalMissing} missing</div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 font-semibold text-sky-900"><CheckCircle2 className="h-3.5 w-3.5" /> {totalVerify} verify</div>
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {missingInformation.map((cat) => (
          <section key={cat.category}>
            <h2 className="font-display text-xl font-bold text-[var(--ithemba-blue-dark)]">{cat.category}</h2>
            <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white">
              {cat.items.map((it) => {
                const cfg = it.status === "missing"
                  ? { Icon: AlertTriangle, cls: "text-amber-900 bg-amber-100", lbl: "Missing" }
                  : it.status === "verify"
                  ? { Icon: CheckCircle2, cls: "text-sky-900 bg-sky-100", lbl: "Verify" }
                  : { Icon: CircleDashed, cls: "text-emerald-900 bg-emerald-100", lbl: "Supplied" };
                return (
                  <li key={it.label} className="flex items-start gap-3 px-4 py-3 text-sm">
                    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${cfg.cls}`}>
                      <cfg.Icon className="h-3 w-3" /> {cfg.lbl}
                    </span>
                    <span>{it.label}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
