export const CHECKOUT_RECEIPT_KEY = "lotus-pay-checkout-receipt";

export type CheckoutReceipt = {
  linkId: string;
  transactionId: string;
  paidAt: string;
  merchantName: string;
  merchantInitials: string;
  productTitle: string;
  subtotal: number;
  processingFee: number;
  salesTax: number;
  total: number;
  customerCoversProcessing: boolean;
};

export function writeCheckoutReceipt(receipt: CheckoutReceipt): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CHECKOUT_RECEIPT_KEY, JSON.stringify(receipt));
  } catch {
    /* ignore */
  }
}

export function readCheckoutReceipt(): CheckoutReceipt | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CHECKOUT_RECEIPT_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as CheckoutReceipt;
    if (!o || typeof o !== "object") return null;
    if (
      typeof o.linkId !== "string" ||
      typeof o.transactionId !== "string" ||
      typeof o.total !== "number"
    )
      return null;
    return o;
  } catch {
    return null;
  }
}

export function demoTransactionId() {
  const part =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return `pay_${part.slice(0, 24)}`;
}
