import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/components/site/LanguageProvider";
import { Placeholder } from "@/components/site/MissingInfo";
import { CheckCircle2 } from "lucide-react";

export function ContactForm({ partnership = false }: { partnership?: boolean }) {
  const { lang } = useLang();
  const [sent, setSent] = useState(false);
  const lbl = (en: string, de: string) => (lang === "en" ? en : de);

  if (sent) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-md ring-1 ring-[var(--ithemba-blue)]/15">
        <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--ithemba-teal)]" />
        <h3 className="mt-3 font-display text-xl font-bold">{lbl("Message sent. Thank you.", "Nachricht gesendet. Danke.")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {lbl("This is a prototype confirmation. In the live version your message will be delivered to our team.", "Dies ist eine Prototyp-Bestätigung. In der Live-Version wird Ihre Nachricht an unser Team gesendet.")}
        </p>
        <Placeholder text={partnership ? "partnership form recipient email" : "contact form recipient email"} />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      className="space-y-4 rounded-3xl bg-white p-6 shadow-md ring-1 ring-[var(--ithemba-blue)]/15 md:p-8"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="c-name">{lbl("Name", "Name")}</Label>
          <Input id="c-name" required />
        </div>
        <div>
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" required />
        </div>
        {partnership && (
          <div className="md:col-span-2">
            <Label htmlFor="c-org">{lbl("Organisation", "Organisation")}</Label>
            <Input id="c-org" />
          </div>
        )}
        <div>
          <Label htmlFor="c-country">{lbl("Country", "Land")}</Label>
          <Input id="c-country" />
        </div>
        <div>
          <Label htmlFor="c-subject">{partnership ? lbl("Partnership interest", "Partnerschaftsinteresse") : lbl("Subject", "Betreff")}</Label>
          <Input id="c-subject" />
        </div>
      </div>
      <div>
        <Label htmlFor="c-msg">{lbl("Message", "Nachricht")}</Label>
        <Textarea id="c-msg" rows={5} required />
      </div>
      <Button type="submit" size="lg" className="w-full rounded-full bg-[var(--ithemba-blue)] hover:bg-[var(--ithemba-blue-dark)]">
        {partnership ? lbl("Start a Partnership Conversation", "Partnergespräch starten") : lbl("Send Message", "Nachricht senden")}
      </Button>
      <Placeholder text={partnership ? "partnership form recipient email" : "contact form recipient email"} />
    </form>
  );
}
