"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Clock, ShieldCheck, Star, X } from "lucide-react";

const DEMO_STATS = {
  rating: 4.8,
  reviewCount: 127,
  completedSales: "2.4k+",
  responseTime: "Usually within 12 hours",
};

const DEMO_REVIEWS = [
  {
    name: "Priya M.",
    title: "Smooth checkout",
    body: "Paid in seconds and got my receipt right away. Would use this seller again.",
    stars: 5,
  },
  {
    name: "James L.",
    title: "Clear communication",
    body: "Had a question before paying — they replied the same day. Professional.",
    stars: 5,
  },
  {
    name: "Elena R.",
    title: "As described",
    body: "Everything matched what was listed. No surprises on the total.",
    stars: 4,
  },
];

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.floor(value);
        const half = !filled && i < value;
        return (
          <Star
            key={i}
            className={[
              "h-4 w-4",
              filled || half ? "fill-amber-400 text-amber-400" : "fill-transparent text-neutral-600",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

export default function CheckoutMerchantInfoDialog({
  merchantName,
  merchantInitials,
  children,
}: {
  merchantName: string;
  merchantInitials: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-[2px]" />
        <Dialog.Content
          className={[
            "fixed left-1/2 top-1/2 z-[101] max-h-[min(90dvh,640px)] w-[min(calc(100vw-2rem),420px)] -translate-x-1/2 -translate-y-1/2",
            "overflow-y-auto rounded-2xl border border-neutral-700 bg-[#1a1a1d] p-0 shadow-2xl outline-none",
          ].join(" ")}
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-neutral-800 bg-[#1a1a1d]/95 px-5 py-4 backdrop-blur">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase text-white"
                style={{ backgroundColor: "hsl(262 83% 48%)" }}
              >
                {merchantInitials}
              </div>
              <div className="min-w-0">
                <Dialog.Title className="truncate text-base font-semibold text-white">{merchantName}</Dialog.Title>
                <Dialog.Description className="mt-0.5 text-[13px] text-neutral-500">
                  Demo seller profile · Lotus Pay checkout
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close
              className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="space-y-5 px-5 py-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <StarRow value={DEMO_STATS.rating} />
                <span className="text-sm font-medium tabular-nums text-white">{DEMO_STATS.rating}</span>
                <span className="text-sm text-neutral-500">({DEMO_STATS.reviewCount} reviews)</span>
              </div>
            </div>

            <p className="text-[13px] leading-relaxed text-neutral-400">
              <span className="font-medium text-neutral-200">{merchantName}</span> is a verified demo merchant on
              Lotus Pay. Ratings and reviews below are sample data to show how buyer trust signals could appear at
              checkout—replace with your real seller profile in production.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified business
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-600 bg-black/30 px-3 py-1 text-[11px] text-neutral-300">
                <Clock className="h-3.5 w-3.5 text-neutral-500" />
                {DEMO_STATS.responseTime}
              </span>
              <span className="inline-flex rounded-full border border-neutral-600 bg-black/30 px-3 py-1 text-[11px] text-neutral-400">
                {DEMO_STATS.completedSales} completed checkouts · demo metric
              </span>
            </div>

            <div>
              <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
                Recent ratings
              </h3>
              <ul className="space-y-3">
                {DEMO_REVIEWS.map((r) => (
                  <li key={r.name + r.title} className="rounded-xl border border-neutral-800 bg-black/25 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-neutral-200">{r.name}</span>
                      <StarRow value={r.stars} />
                    </div>
                    <p className="mt-1 text-[13px] font-medium text-white/90">{r.title}</p>
                    <p className="mt-1 text-[12px] leading-snug text-neutral-500">{r.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[10px] leading-relaxed text-neutral-600">
              You’re still in sandbox mode—no charges are processed. Closing this sheet returns you to checkout.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
