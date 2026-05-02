"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";

import CheckoutOrderPanel from "@/components/checkout/CheckoutOrderPanel";
import { chkInputCls } from "@/components/checkout/checkout-ui";
import {
  demoProfileInitials,
  readDemoProfile,
  sidebarTitle,
  type DemoProfile,
} from "@/lib/demo-profile";
import { computeCheckoutTotals } from "@/lib/checkout-tax";
import { readDemoPaymentLinks, type DemoPaymentLink } from "@/lib/demo-payment-links";
import { readCheckoutDraft } from "@/lib/checkout-draft";
import { demoTransactionId, writeCheckoutReceipt } from "@/lib/checkout-receipt";
import { formatUsdAsLocal, isUsdBilling } from "@/lib/checkout-fx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const INITIAL_COUNTDOWN = 14 * 60 + 9;

/** ~2–2.75s processing delay before redirect */
function processingDelayMs() {
  return 2000 + Math.floor(Math.random() * 750);
}

export default function StandaloneCheckoutPayment({ linkId }: { linkId: string }) {
  const router = useRouter();
  const paymentTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [link, setLink] = React.useState<DemoPaymentLink | null | undefined>(undefined);
  const [profile, setProfile] = React.useState<DemoProfile | null>(null);
  const [countryCode, setCountryCode] = React.useState("US");
  const [customerCoversProcessing, setCustomerCoversProcessing] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);

  const [cardNumber, setCardNumber] = React.useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = React.useState("06 / 32");
  const [cvc, setCvc] = React.useState("123");
  const [cardName, setCardName] = React.useState("John Doe");

  const [secondsLeft, setSecondsLeft] = React.useState(INITIAL_COUNTDOWN);

  React.useEffect(() => {
    setProfile(readDemoProfile());
    const list = readDemoPaymentLinks();
    const found = list.find((l) => l.id === linkId) ?? null;
    setLink(found);

    const draft = readCheckoutDraft();
    if (draft && draft.linkId === linkId) {
      setCountryCode(draft.countryCode);
      setCustomerCoversProcessing(draft.customerCoversProcessing !== false);
    }
    return () => {
      if (paymentTimerRef.current) clearTimeout(paymentTimerRef.current);
    };
  }, [linkId]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const merchantName = sidebarTitle(profile);
  const merchantInitials =
    merchantName === "Demo explorer"
      ? "LP"
      : demoProfileInitials(profile).slice(0, 2).toUpperCase();

  const subtotal = link?.amount ?? 0;
  const totals =
    link != null
      ? computeCheckoutTotals(subtotal, countryCode, { customerCoversProcessing })
      : null;

  function onPayNow() {
    if (!link || !totals || processing) return;
    setProcessing(true);
    paymentTimerRef.current = setTimeout(() => {
      writeCheckoutReceipt({
        linkId,
        transactionId: demoTransactionId(),
        paidAt: new Date().toISOString(),
        merchantName,
        merchantInitials,
        productTitle: link.title,
        subtotal: totals.subtotal,
        processingFee: totals.processingFee,
        salesTax: totals.salesTax,
        total: totals.total,
        customerCoversProcessing: totals.customerCoversProcessing,
      });
      router.push(`/checkout/${linkId}/success`);
    }, processingDelayMs());
  }

  const mm = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const ss = (secondsLeft % 60).toString().padStart(2, "0");

  if (link === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-sm text-neutral-500">
        Loading payment…
      </div>
    );
  }

  if (link === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0f0f0f] px-4 text-neutral-400">
        <p className="text-center text-sm">This checkout link isn&apos;t available in this session.</p>
        <Button variant="outline" className="border-neutral-600 bg-transparent text-white hover:bg-white/10" asChild>
          <Link href="/dashboard/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  const t = totals!;
  const payLocalEstimate = !isUsdBilling(countryCode) ? formatUsdAsLocal(t.total, countryCode) : null;

  const purpleRing = "ring-2 ring-[hsl(262_83%_58%/0.45)] border-[hsl(262_83%_58%/0.55)]";

  return (
    <div className="min-h-screen bg-[#101010] text-neutral-50 lg:flex lg:h-[100dvh] lg:max-h-[100dvh] lg:flex-col lg:overflow-hidden">
      <div className="mx-auto flex w-full flex-1 min-h-0 flex-col lg:mx-0 lg:max-h-full lg:flex-row lg:overflow-hidden">
        <CheckoutOrderPanel
          merchantName={merchantName}
          merchantInitials={merchantInitials}
          linkTitle={link.title}
          subtotalDisplay={t.subtotal}
          totals={t}
          compact
          showBackHref={`/checkout/${linkId}`}
          showTestCardBox
          customerCoversProcessing={customerCoversProcessing}
          pricingType={link.pricingType}
        />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#0f1012] lg:h-full lg:min-h-0 lg:w-1/2 lg:min-w-0 lg:flex-1 lg:overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4 sm:px-6 lg:px-10 lg:py-8">
            <div className="mx-auto mb-3 flex w-full max-w-[400px] shrink-0 flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/45 bg-amber-500/[0.12] px-2.5 py-1 text-[11px] font-medium text-amber-100 sm:text-[12px]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                Test mode
              </div>
              <div className="rounded-full border border-amber-600/50 bg-amber-500/[0.12] px-3 py-1 text-[11px] font-medium tabular-nums text-amber-100">
                Payment link expires in {mm}:{ss}
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[400px] shrink-0 flex-col gap-2.5 lg:gap-3">
              <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={processing}
                  className="flex h-11 flex-1 items-center justify-center rounded-lg bg-white text-[14px] font-medium text-black opacity-95 transition hover:bg-neutral-200 disabled:opacity-50"
                >
                  Pay with Apple Pay
                </button>
                <button
                  type="button"
                  disabled={processing}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-600 bg-[#1a1a1a] text-[14px] font-medium text-white transition hover:bg-[#222] disabled:opacity-50"
                >
                  <CreditCard className="h-4 w-4 text-neutral-300" />
                  Google Pay
                </button>
              </div>

              <div className="relative flex flex-shrink-0 items-center py-1">
                <div className="grow border-t border-neutral-700" />
                <span className="shrink-0 px-3 text-[11px] font-medium uppercase tracking-wider text-neutral-600">
                  or
                </span>
                <div className="grow border-t border-neutral-700" />
              </div>

              <div className="flex-shrink-0 space-y-3">
                <p className="text-[15px] font-semibold text-white">Payment method</p>
                <div className={["rounded-lg border bg-[#18181b] p-4", purpleRing].join(" ")}>
                  <div className="mb-3 flex items-center gap-2 text-[13px] font-medium text-neutral-200">
                    <CreditCard className="h-4 w-4 text-[hsl(262_83%_65%)]" />
                    Card
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-neutral-400">Card information</Label>
                      <InputWithVisa disabled={processing} value={cardNumber} onChange={setCardNumber} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <Label className="sr-only">Expiry</Label>
                        <Input
                          disabled={processing}
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className={chkInputCls}
                          placeholder="MM / YY"
                          aria-label="Expiry"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="sr-only">CVC</Label>
                        <Input
                          disabled={processing}
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className={chkInputCls}
                          placeholder="CVC"
                          aria-label="CVC"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-card-name" className="text-[12px] text-neutral-400">
                        Cardholder name
                      </Label>
                      <Input
                        id="co-card-name"
                        disabled={processing}
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className={chkInputCls}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2 text-[12px] text-[hsl(262_90%_72%)]">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Secure · PCI DSS Compliant · Demo only</span>
              </div>

              <Button
                type="button"
                disabled={processing}
                className="h-auto min-h-10 w-full flex-shrink-0 flex-col gap-0.5 rounded-lg bg-neutral-100 px-4 py-2.5 text-[14px] font-medium text-neutral-900 hover:bg-white disabled:opacity-80 sm:flex-row sm:gap-2 sm:py-2"
                onClick={onPayNow}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                    Processing…
                  </>
                ) : (
                  <>
                    <span>Pay {formatUsd(t.total)}</span>
                    {payLocalEstimate ? (
                      <span className="text-center text-[11px] font-normal text-neutral-600 sm:inline sm:text-sm sm:text-neutral-800">
                        {payLocalEstimate} · estimate
                      </span>
                    ) : null}
                  </>
                )}
              </Button>

              <footer className="mt-auto flex flex-shrink-0 flex-col gap-2 border-t border-neutral-800/80 pt-3 pb-2 text-neutral-600 lg:pb-0">
                <p className="max-w-[52ch] text-[10px] leading-snug">
                  Checkout facilitated by Lotus Pay (demo Merchant of Record wording). Sandbox only — explore{" "}
                  <Link href="/" className="text-neutral-400 underline underline-offset-2 hover:text-neutral-200">
                    Lotus Pay
                  </Link>
                  .
                </p>
                <div className="flex flex-wrap items-center gap-2.5 text-[10px]">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <Image src="/logo.png" alt="Lotus Pay" width={18} height={18} className="rounded" />
                    <span className="font-medium text-neutral-400">Lotus Pay</span>
                  </div>
                  <Link href="#" className="text-neutral-500 underline underline-offset-2 hover:text-neutral-300">
                    Privacy
                  </Link>
                  <Link href="#" className="text-neutral-500 underline underline-offset-2 hover:text-neutral-300">
                    Terms
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function InputWithVisa({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <Input
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pr-14 font-mono text-[13px] tracking-wide ${chkInputCls}`}
        aria-label="Card number"
        autoComplete="cc-number"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-neutral-700 bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#1434CB]">
        VISA
      </span>
    </div>
  );
}
