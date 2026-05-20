import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function CookieConsent() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("cookie-consent")) setShown(true);
  }, []);
  if (!shown) return null;

  const close = (val: string) => {
    localStorage.setItem("cookie-consent", val);
    setShown(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-white p-4 shadow-2xl md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1 text-sm">
          <div className="font-display font-bold text-base text-[var(--ithemba-blue-dark)]">We value your privacy</div>
          <p className="mt-1 text-muted-foreground">
            We use essential cookies and, with your consent, analytics and embedded media. You can manage your choice at any time. See our{" "}
            <Link to="/cookie-policy" className="underline">Cookie Policy</Link>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => close("rejected")}>Reject non-essential</Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/cookie-policy">Manage settings</Link>
          </Button>
          <Button size="sm" className="bg-[var(--ithemba-blue)] hover:bg-[var(--ithemba-blue-dark)]" onClick={() => close("accepted")}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
