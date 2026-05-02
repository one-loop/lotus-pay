"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import CheckoutOrderPanel from "@/components/checkout/CheckoutOrderPanel";
import { chkInputCls, chkPhonePrefixCls, chkSelectCls } from "@/components/checkout/checkout-ui";
import {
  demoProfileInitials,
  readDemoProfile,
  sidebarTitle,
  type DemoProfile,
} from "@/lib/demo-profile";
import { CHECKOUT_COUNTRIES, computeCheckoutTotals } from "@/lib/checkout-tax";
import { readDemoPaymentLinks, type DemoPaymentLink } from "@/lib/demo-payment-links";
import { writeCheckoutDraft } from "@/lib/checkout-draft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StandaloneCheckout({ linkId }: { linkId: string }) {
  const router = useRouter();
  const [link, setLink] = React.useState<DemoPaymentLink | null | undefined>(undefined);
  const [profile, setProfile] = React.useState<DemoProfile | null>(null);
  const [countryCode, setCountryCode] = React.useState("US");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [addressLine, setAddressLine] = React.useState("");
  const [businessPurchasing, setBusinessPurchasing] = React.useState(false);
  /** When false, processing fee is waived (not added to total). Default: customer pays. */
  const [customerCoversProcessing, setCustomerCoversProcessing] = React.useState(true);

  React.useEffect(() => {
    setProfile(readDemoProfile());
    const list = readDemoPaymentLinks();
    setLink(list.find((l) => l.id === linkId) ?? null);
  }, [linkId]);

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

  function onContinue() {
    writeCheckoutDraft({ linkId, countryCode, customerCoversProcessing });
    router.push(`/checkout/${linkId}/payment`);
  }

  if (link === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-sm text-neutral-500">
        Loading checkout…
      </div>
    );
  }

  if (link === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0f0f0f] px-4 text-neutral-400">
        <p className="text-center text-sm">This checkout link isn&apos;t available in this session.</p>
        <p className="max-w-sm text-center text-xs text-neutral-500">
          Open the checkout from Products in the dashboard, or create a new product — links are saved in session
          storage for this tab only.
        </p>
        <Button variant="outline" className="border-neutral-600 bg-transparent text-white hover:bg-white/10" asChild>
          <Link href="/dashboard/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  const t = totals!;

  return (
    <div className="min-h-screen bg-[#101010] text-neutral-50 lg:flex lg:h-[100dvh] lg:max-h-[100dvh] lg:flex-col lg:overflow-hidden">
      <div className="mx-auto flex min-h-[100dvh] w-full min-h-0 flex-1 flex-col lg:mx-0 lg:max-h-full lg:flex-row lg:overflow-hidden">
        <CheckoutOrderPanel
          merchantName={merchantName}
          merchantInitials={merchantInitials}
          linkTitle={link.title}
          subtotalDisplay={t.subtotal}
          totals={t}
          compact
          showTestCardBox={false}
          customerCoversProcessing={customerCoversProcessing}
          onCustomerCoversProcessingChange={setCustomerCoversProcessing}
          pricingType={link.pricingType}
        />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#0f1012] lg:h-full lg:min-h-0 lg:w-1/2 lg:min-w-0 lg:flex-1 lg:overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4 sm:px-6 lg:items-start lg:overflow-y-auto lg:px-10 lg:py-8">
            <div className="mx-auto mb-4 inline-flex w-full max-w-[400px] flex-shrink-0 items-center gap-2 rounded-full border border-amber-500/45 bg-amber-500/[0.12] px-2.5 py-1 text-[11px] font-medium text-amber-100 sm:text-[12px]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              Test mode — use{" "}
              <span className="font-semibold text-amber-50">Continue</span>, then <span className="font-semibold text-amber-50">Pay</span>{" "}
              on the next page
            </div>

            <div className="mx-auto flex w-full max-w-[400px] flex-1 shrink-0 flex-col gap-4">
              <section className="space-y-3">
                <h2 className="text-[15px] font-semibold text-white">Contact Information</h2>
                <div className="space-y-1.5">
                  <Label htmlFor="co-name" className="text-[12px] text-neutral-400">
                    Full name <span className="text-amber-400/90">*</span>
                  </Label>
                  <Input
                    id="co-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="eg. John Doe"
                    className={chkInputCls}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="co-email" className="text-[12px] text-neutral-400">
                      Email <span className="text-amber-400/90">*</span>
                    </Label>
                    <Input
                      id="co-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eg. john.doe@example.com"
                      className={chkInputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="co-phone" className="text-[12px] text-neutral-400">
                      Phone <span className="text-neutral-500">(optional)</span>
                    </Label>
                    <div className="flex gap-2">
                      <span className={chkPhonePrefixCls}>
                        <span aria-hidden className="text-sm leading-none">
                          🇺🇸
                        </span>
                        +1
                      </span>
                      <Input
                        id="co-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="555 019 9821"
                        className={`min-w-0 flex-1 ${chkInputCls}`}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-3 border-t border-neutral-700/70 pt-4">
                <h2 className="text-[15px] font-semibold text-white">
                  Billing address <span className="text-amber-400/90">*</span>
                </h2>
                <div className="space-y-1.5">
                  <Label htmlFor="co-country" className="text-[12px] text-neutral-400">
                    Country
                  </Label>
                  <div className="relative">
                    <select
                      id="co-country"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className={chkSelectCls}
                    >
                      {CHECKOUT_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-neutral-950">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-600" />
                  </div>
                  <p className="text-[10px] text-neutral-600">Tax updates when you change country (demo rates).</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="co-address" className="text-[12px] text-neutral-400">
                    Address line
                  </Label>
                  <Input
                    id="co-address"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Street, city, state, postal code…"
                    className={chkInputCls}
                  />
                </div>
                <button type="button" className="text-left text-[12px] text-neutral-500 underline underline-offset-4 hover:text-neutral-300">
                  Enter address manually
                </button>

                <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-[13px] text-neutral-300">
                  <input
                    type="checkbox"
                    checked={businessPurchasing}
                    onChange={(e) => setBusinessPurchasing(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-neutral-600 bg-[#202020] text-[hsl(262_83%_58%)] focus:ring-2 focus:ring-[hsl(262_83%_58%)/0.35]"
                  />
                  <span>Purchasing as a business</span>
                </label>
              </section>

              <div className="pt-2">
                <Button
                  type="button"
                  className="h-10 w-full rounded-lg bg-neutral-100 text-[14px] font-medium text-neutral-900 hover:bg-white"
                  onClick={onContinue}
                >
                  Continue to Payment
                </Button>
              </div>

              <footer className="mt-4 flex flex-col gap-2 border-t border-neutral-800/80 pt-4 pb-4 text-neutral-600 lg:mt-8">
                <p className="max-w-[40ch] text-[10px] leading-snug">
                  This checkout is a Lotus Pay demo only. No funds move. Process is simulated (demo wording,
                  not legal advice).
                </p>
                <div className="flex flex-wrap items-center gap-2.5 text-[10px]">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <Image src="/logo.png" alt="Lotus Pay" width={18} height={18} className="rounded" />
                    <span className="font-medium text-neutral-400">Lotus Pay demo</span>
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
