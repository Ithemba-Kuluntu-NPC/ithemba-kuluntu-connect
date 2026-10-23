import { z } from "zod";

export const DONATION_CAUSES = [
  "Where needed most",
  "Education",
  "Safe Water",
  "Food Security",
  "Animal Welfare",
  "Disaster Relief",
] as const;
const COUNTRIES = new Set(
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " ",
  ),
);

export const donationSchema = z
  .object({
    requestId: z.string().uuid(),
    amount: z.number().int().min(100).max(1000000), // EUR cents; €1–€10,000
    frequency: z.enum(["once", "monthly"]),
    cause: z.enum(DONATION_CAUSES),
    lang: z.enum(["en", "de", "nl"]),
    name: z.string().trim().min(1).max(150),
    email: z.string().trim().email().max(254),
    country: z
      .string()
      .trim()
      .refine((country) => COUNTRIES.has(country)),
    receiptRequested: z.boolean(),
  })
  .strict();
export type DonationInput = z.infer<typeof donationSchema>;
export type DonationStatus = "open" | "pending" | "succeeded" | "failed" | "cancelled";

// Checkout completion alone is not proof of payment (SEPA and transfers are asynchronous).
export function paymentStatus(session: Record<string, unknown>): DonationStatus {
  const subscription = session.subscription as Record<string, unknown> | null;
  const invoice = subscription?.latest_invoice as Record<string, unknown> | null;
  const intent = (invoice?.payment_intent ?? session.payment_intent) as Record<
    string,
    unknown
  > | null;
  if (subscription?.status === "canceled" || subscription?.status === "incomplete_expired")
    return "cancelled";
  if (session.status === "expired" && !subscription) return "cancelled";
  if (intent?.status === "processing" || intent?.status === "requires_capture") return "pending";
  if (intent?.status === "canceled") return "cancelled";
  if (subscription) {
    if (intent?.status === "requires_action") return "failed";
    if (invoice?.status === "paid") return "succeeded";
    if (
      invoice?.status === "uncollectible" ||
      subscription.status === "unpaid" ||
      subscription.status === "past_due"
    )
      return "failed";
  } else if (session.payment_status === "paid") return "succeeded";
  if (intent?.status === "requires_payment_method" && intent.last_payment_error) return "failed";
  if (session.status === "complete") return "pending";
  return "open";
}

export function checkoutParameters(
  input: DonationInput,
  customer: string,
  origin: string,
  options: {
    paypal: boolean;
    paypalRecurring: boolean;
    bankTransfer: boolean;
  },
): URLSearchParams {
  const monthly = input.frequency === "monthly";
  const data = new URLSearchParams({
    ui_mode: "embedded",
    mode: monthly ? "subscription" : "payment",
    // Keep donor presentment in EUR as well as the price's integration currency.
    // Local-currency conversion can otherwise hide EUR-only methods such as SEPA.
    "adaptive_pricing[enabled]": "false",
    customer,
    locale: input.lang,
    client_reference_id: input.requestId,
    return_url: `${origin}/donate?donation=${input.requestId}`,
    redirect_on_completion: "always",
    billing_address_collection: input.receiptRequested ? "required" : "auto",
    "customer_update[address]": "auto",
    "customer_update[name]": "auto",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(input.amount),
    "line_items[0][price_data][product_data][name]": `iThemba Kuluntu e.V. — ${input.cause}`,
    "payment_method_types[0]": "card",
    "payment_method_types[1]": "sepa_debit",
  });
  let index = 2;
  if (options.paypal && (!monthly || options.paypalRecurring))
    data.set(`payment_method_types[${index++}]`, "paypal");
  if (!monthly && options.bankTransfer) {
    data.set(`payment_method_types[${index}]`, "customer_balance");
    data.set("payment_method_options[customer_balance][funding_type]", "bank_transfer");
    data.set("payment_method_options[customer_balance][bank_transfer][type]", "eu_bank_transfer");
    data.set(
      "payment_method_options[customer_balance][bank_transfer][eu_bank_transfer][country]",
      "DE",
    );
  }
  if (monthly) data.set("line_items[0][price_data][recurring][interval]", "month");
  else {
    data.set("submit_type", "donate");
    data.set("payment_intent_data[receipt_email]", input.email);
  }
  const metadata = {
    donation_id: input.requestId,
    cause: input.cause,
    frequency: input.frequency,
    donor_name: input.name,
    donor_country: input.country,
    language: input.lang,
    receipt_requested: String(input.receiptRequested),
    beneficiary: "iThemba Kuluntu e.V.",
  };
  for (const [key, value] of Object.entries(metadata)) {
    data.set(`metadata[${key}]`, value);
    data.set(`${monthly ? "subscription_data" : "payment_intent_data"}[metadata][${key}]`, value);
  }
  return data;
}
