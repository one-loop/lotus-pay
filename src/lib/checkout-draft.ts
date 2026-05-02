export const CHECKOUT_DRAFT_KEY = "lotus-pay-checkout-draft";

export type CheckoutDraft = {
  linkId: string;
  countryCode: string;
  /** Customer pays processing fee; default true. */
  customerCoversProcessing?: boolean;
};

export function writeCheckoutDraft(draft: CheckoutDraft): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

export function readCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const linkId = (o as CheckoutDraft).linkId;
    const countryCode = (o as CheckoutDraft).countryCode;
    const ccp = (o as CheckoutDraft).customerCoversProcessing;
    if (typeof linkId !== "string" || typeof countryCode !== "string") return null;
    return {
      linkId,
      countryCode,
      customerCoversProcessing:
        typeof ccp === "boolean" ? ccp : true,
    };
  } catch {
    return null;
  }
}
