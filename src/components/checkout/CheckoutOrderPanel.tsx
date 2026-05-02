"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";

import CheckoutThemeBar from "@/components/checkout/CheckoutThemeBar";
import CheckoutMerchantInfoDialog from "@/components/checkout/CheckoutMerchantInfoDialog";
import { formatUsdAsLocal, getCheckoutFx, isUsdBilling } from "@/lib/checkout-fx";
import type { ComputedCheckoutTotals } from "@/lib/checkout-tax";
import { PROCESSING_FEE_RATE } from "@/lib/checkout-tax";

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function CheckoutOrderPanel({
  merchantName,
  merchantInitials,
  linkTitle,
  subtotalDisplay,
  totals,
  compact,
  showBackHref,
  showTestCardBox,
  customerCoversProcessing,
  onCustomerCoversProcessingChange,
  pricingType,
}: {
  merchantName: string;
  merchantInitials: string;
  linkTitle: string;
  subtotalDisplay: number;
  totals: ComputedCheckoutTotals;
  compact?: boolean;
  showBackHref?: string | null;
  showTestCardBox?: boolean;
  customerCoversProcessing: boolean;
  onCustomerCoversProcessingChange?: (value: boolean) => void;
  /** When set, shows one-time vs recurring next to the line item (demo). */
  pricingType?: "one_time" | "recurring";
}) {
  const t = totals;
  const billingCode = t.country.code;
  const fx = getCheckoutFx(billingCode);
  const isUsd = isUsdBilling(billingCode);

  return (
    <aside
      className={[
        "relative flex w-full shrink-0 flex-col border-b border-neutral-700/80 bg-[#141414]",
        compact ? "px-5 py-5 lg:border-b-0 lg:border-r lg:px-4" : "px-6 py-8",
        "lg:h-full lg:max-h-full lg:min-h-0 lg:w-1/2 lg:min-w-0 lg:flex-1 lg:items-center",
      ].join(" ")}
    >
      <div className="flex w-full flex-1 min-h-0 flex-col lg:items-center lg:justify-between lg:gap-4 lg:overflow-hidden">
      <div className="flex w-full max-w-[400px] flex-1 min-h-0 flex-col gap-3 overflow-y-auto lg:mx-auto lg:gap-3 mx-auto">
        {showBackHref ? (
          <Link
            href={showBackHref}
            className="inline-flex w-fit items-center gap-2 pb-1 text-[13px] text-neutral-500 transition-colors hover:text-neutral-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        ) : null}

        <div className="flex items-start justify-between gap-3">
          <CheckoutMerchantInfoDialog merchantName={merchantName} merchantInitials={merchantInitials}>
            <button
              type="button"
              className="flex min-w-0 max-w-full flex-1 items-center gap-2.5 rounded-lg text-left transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(262_83%_58%)]"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase text-white"
                style={{ backgroundColor: "hsl(262 83% 48%)" }}
              >
                {merchantInitials}
              </div>
              <span className="truncate text-[14px] font-medium text-neutral-100 underline-offset-2 hover:underline">
                {merchantName}
              </span>
            </button>
          </CheckoutMerchantInfoDialog>
          <button
            type="button"
            className="inline-flex max-w-[148px] shrink-0 flex-col items-end gap-0 rounded-full border border-neutral-600 bg-black/35 px-2.5 py-1 text-[11px] leading-snug text-neutral-200 sm:max-w-none sm:flex-row sm:items-center sm:gap-1 sm:py-1.5 sm:text-[12px]"
          >
            <span className="flex items-center gap-1 whitespace-nowrap">
              {isUsd ? "USD" : `USD · ${fx.currency}`}
              <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
            </span>
            {!isUsd ? (
              <span className="text-[10px] text-neutral-500 sm:hidden">Charges in USD · estimate in local</span>
            ) : null}
          </button>
        </div>

        <div className={compact ? "space-y-0.5" : "space-y-1"}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[12px] text-neutral-500">Checkout item</p>
            {pricingType === "recurring" ? (
              <span className="rounded-full border border-emerald-500/35 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-200">
                Recurring · demo
              </span>
            ) : pricingType === "one_time" ? (
              <span className="rounded-full border border-blue-500/35 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-200">
                One-time
              </span>
            ) : null}
          </div>
          <p className="truncate text-[15px] font-semibold text-white">{linkTitle}</p>
          <p
            className={[
              "font-semibold leading-none tracking-tight tabular-nums text-white",
              compact ? "pt-1 text-[28px]" : "pt-3 text-[36px]",
            ].join(" ")}
          >
            {formatUsd(subtotalDisplay)}
          </p>
          {!isUsd ? (
            <p className="text-[11px] font-normal tabular-nums text-neutral-500">
              ≈ {formatUsdAsLocal(subtotalDisplay, billingCode)} · list (demo FX)
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:gap-1.5">
          <span className="text-[12px] text-neutral-500">Have a discount code?</span>
          <button
            type="button"
            className="w-full rounded-full border border-dashed border-neutral-600 px-3 py-1.5 text-center text-[12px] text-neutral-500 transition-colors hover:border-neutral-500 hover:bg-white/[0.03] sm:w-auto sm:min-w-[180px]"
          >
            Apply discount code
          </button>
        </div>

        {onCustomerCoversProcessingChange ? (
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-700/70 bg-black/35 px-3 py-3 text-[12px] text-neutral-300">
            <input
              type="checkbox"
              checked={customerCoversProcessing}
              onChange={(e) => onCustomerCoversProcessingChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-600 bg-[#202020] text-[hsl(262_83%_58%)] focus:ring-2 focus:ring-[hsl(262_83%_58%)/0.35]"
            />
            <span>
              <span className="font-medium text-neutral-200">Cover processing fee ({PROCESSING_FEE_RATE * 100}%)</span>
              <span className="mt-0.5 block text-[11px] text-neutral-500">
                Checked: you pay the fee. Unchecked: fee is waived in this demo (merchant absorbs cost).
              </span>
            </span>
          </label>
        ) : null}

        <div
          className={[
            "space-y-2 border-t border-neutral-700/70 text-[13px]",
            compact ? "pt-3" : "pt-4 mt-2",
          ].join(" ")}
        >
          <div className="flex justify-between gap-4 text-neutral-500">
            <span>Subtotal</span>
            <span className="tabular-nums text-neutral-200">{formatUsd(t.subtotal)}</span>
          </div>
          <div className="flex justify-between gap-4 text-neutral-500">
            <span>Processing fee ({PROCESSING_FEE_RATE * 100}%)</span>
            <span className="tabular-nums text-neutral-200">
              {formatUsd(t.processingFee)}
              {t.processingFee === 0 ? (
                <span className="ml-1.5 align-middle text-[10px] font-normal uppercase tracking-wide text-neutral-600">
                  waived
                </span>
              ) : null}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-neutral-500">
            <span>Sales tax · {t.country.name}</span>
            <span className="tabular-nums text-neutral-200">{formatUsd(t.salesTax)}</span>
          </div>
          <div className="space-y-1.5 border-t border-neutral-700/70 pt-2">
            <div className="flex justify-between gap-4 text-neutral-500">
              <span>Total (USD)</span>
              <span className="tabular-nums">{formatUsd(t.total)}</span>
            </div>
            {!isUsd ? (
              <div className="flex justify-between gap-4 text-neutral-500">
                <span>Total ({fx.currency})</span>
                <span className="tabular-nums">{formatUsdAsLocal(t.total, billingCode)}</span>
              </div>
            ) : null}
            <div className="flex justify-between gap-4 border-t border-neutral-700/70 pt-2 text-[17px] font-semibold text-white">
              <span>{isUsd ? "Total due" : "Amount due"}</span>
              <span className="tabular-nums text-right leading-tight">
                {isUsd ? formatUsd(t.total) : formatUsdAsLocal(t.total, billingCode)}
              </span>
            </div>
            <p className="text-[10px] leading-snug text-neutral-600">
              {t.country.shortLabel}
              {isUsd
                ? " · Totals in USD."
                : ` · Demo FX: local estimate = USD × ${fx.multiplier} (${fx.currency}); not live rates.`}
            </p>
          </div>
        </div>

        {showTestCardBox ? (
          <div className="rounded-lg border border-neutral-600 bg-black/35 p-3 text-[11px] leading-relaxed text-neutral-400">
            <p className="font-medium text-neutral-300">Test card (sandbox)</p>
            <p className="mt-1">
              Card <span className="font-mono text-neutral-300">4242 4242 4242 4242</span>, any future
              expiry, any CVC. No charges are captured in this demo.
            </p>
          </div>
        ) : null}
      </div>

      <div
        className={[
          "w-full max-w-[400px] shrink-0 lg:mx-auto",
          compact ? "pt-3" : "pt-6",
        ].join(" ")}
      >
        <CheckoutThemeBar accentPurple />
      </div>
      </div>
    </aside>
  );
}
