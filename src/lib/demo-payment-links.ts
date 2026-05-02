export const DEMO_PAYMENT_LINKS_KEY = "lotus-pay-demo-payment-links";

export type PricingType = "one_time" | "recurring";

/** Product / sharable checkout link stored in session for the demo dashboard. */
export type DemoPaymentLink = {
  /** Internal id used in `/checkout/[linkId]` */
  id: string;
  /** Public product id shown in the products table (`pdt_…`). */
  productId: string;
  title: string;
  amount: number;
  currency: "USD";
  createdAt: string;
  pricingType: PricingType;
};

function derivedProductId(linkId: string, existing: unknown): string {
  if (typeof existing === "string" && existing.startsWith("pdt_")) {
    return existing;
  }
  const hex = linkId.replace(/-/g, "");
  const body = `${hex}${hex}`.slice(0, 22);
  return `pdt_${body}`;
}

function normalizePricingType(v: unknown): PricingType {
  return v === "recurring" ? "recurring" : "one_time";
}

/** Accepts legacy items saved before product ids / pricing types existed. */
export function normalizeDemoPaymentLink(raw: unknown): DemoPaymentLink | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.title !== "string" ||
    typeof o.amount !== "number" ||
    typeof o.createdAt !== "string"
  ) {
    return null;
  }
  const currency = o.currency === "USD" ? "USD" : "USD";
  return {
    id: o.id,
    productId: derivedProductId(o.id, o.productId),
    title: o.title,
    amount: o.amount,
    currency,
    createdAt: o.createdAt,
    pricingType: normalizePricingType(o.pricingType),
  };
}

export function newDemoProductId(): string {
  const u = crypto.randomUUID().replace(/-/g, "");
  return `pdt_${u.slice(0, 22)}`;
}

export function readDemoPaymentLinks(): DemoPaymentLink[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(DEMO_PAYMENT_LINKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeDemoPaymentLink).filter((x): x is DemoPaymentLink => x !== null);
  } catch {
    return [];
  }
}

export function writeDemoPaymentLinks(links: DemoPaymentLink[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DEMO_PAYMENT_LINKS_KEY, JSON.stringify(links));
  } catch {
    /* ignore */
  }
}
