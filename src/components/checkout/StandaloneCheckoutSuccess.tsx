"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Download } from "lucide-react";

import { readCheckoutReceipt } from "@/lib/checkout-receipt";
import { Button } from "@/components/ui/button";

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatReceiptDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  } catch {
    return "—";
  }
}

/** Jagged receipt edge → black backdrop */
function ReceiptJaggedEdge() {
  return (
    <div aria-hidden className="w-full overflow-hidden bg-[#090909]">
      <div className="flex w-full flex-nowrap justify-center">
        {Array.from({ length: 36 }).map((_, i) => (
        <div
          key={i}
          className="h-0 w-0 shrink-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-[#1c1c1f]"
        />
        ))}
      </div>
    </div>
  );
}

function ReceiptConfetti() {
  const [pieces, setPieces] = React.useState<
    Array<{
      id: number;
      left: string;
      delay: string;
      duration: string;
      rotate: string;
      color: string;
    }>
  >([]);

  React.useEffect(() => {
    setPieces(
      Array.from({ length: 42 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.7}s`,
        duration: `${2.2 + Math.random() * 1.8}s`,
        rotate: `${Math.floor(Math.random() * 360)}deg`,
        color: ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444"][i % 5],
      }))
    );
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-[-10%] inline-block h-2.5 w-1.5 rounded-[2px] opacity-0"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotate})`,
            animation: `receipt-confetti-fall ${piece.duration} ease-out ${piece.delay} forwards`,
          }}
        />
      ))}
    </div>
  );
}

export default function StandaloneCheckoutSuccess({ linkId }: { linkId: string }) {
  const [receipt, setReceipt] = React.useState(readCheckoutReceipt);
  const [downloadHint, setDownloadHint] = React.useState(false);

  React.useEffect(() => {
    setReceipt(readCheckoutReceipt());
  }, [linkId]);

  const mismatch = receipt && receipt.linkId !== linkId;

  if (!receipt || mismatch) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-4 text-neutral-400">
        <p className="text-center text-sm text-neutral-500">
          {mismatch ? "Receipt does not match this link." : "No receipt found for this session."}
        </p>
        <Button variant="outline" className="border-neutral-700 text-neutral-200 hover:bg-white/10" asChild>
          <Link href={`/checkout/${linkId}`}>Back to checkout</Link>
        </Button>
      </div>
    );
  }

  function onDemoDownload() {
    const paidAtDate = new Date(r.paidAt);
    const paidAt = Number.isNaN(paidAtDate.getTime()) ? r.paidAt : paidAtDate.toLocaleString();
    const invoiceTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const invoiceFileName = `invoice-${r.transactionId.slice(-8)}-${invoiceTimestamp}.txt`;

    const invoiceContent = [
      "LOTUS PAY - INVOICE",
      "===================",
      "",
      `Merchant: ${r.merchantName}`,
      `Product: ${r.productTitle}`,
      `Payment ID: ${r.transactionId}`,
      `Paid at: ${paidAt}`,
      "",
      "Amount Breakdown (USD)",
      "----------------------",
      `Subtotal: ${formatUsd(r.subtotal)}`,
      `Processing fee: ${r.processingFee > 0 ? formatUsd(r.processingFee) : "Waived ($0.00)"}`,
      `Sales tax: ${formatUsd(r.salesTax)}`,
      `Total: ${formatUsd(r.total)}`,
      "",
      `Generated at: ${new Date().toLocaleString()}`,
    ].join("\n");

    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = invoiceFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setDownloadHint(true);
    window.setTimeout(() => setDownloadHint(false), 2500);
  }

  const r = receipt;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-neutral-100">
      <ReceiptConfetti />
      <div className="relative z-10 mx-auto w-full max-w-[380px]">
        <article className="overflow-hidden rounded-2xl bg-[#1c1c1f] pt-8 shadow-2xl border-b-[0px]">
          <header className="space-y-4 px-6 text-center">
            <div className="flex justify-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: "hsl(262 83% 52%)" }}
              >
                {(r.merchantInitials || "LP").slice(0, 2)}
              </div>
              <div className="text-left leading-tight">
                <p className="font-medium text-neutral-100">{r.merchantName}</p>
                <p className="text-xs text-neutral-500">Order Summary</p>
              </div>
            </div>
            <p className="break-all font-mono text-[11px] tracking-tight text-neutral-600">{r.transactionId}</p>
          </header>

          <div className="mt-6 flex justify-between px-6 text-[13px]">
            <div className="flex items-center gap-2 text-neutral-400">
              <CheckCircle2 className="h-4 w-4 text-[hsl(262_83%_60%)]" aria-hidden />
              <span className="text-neutral-400">Successful</span>
            </div>
            <span className="tabular-nums text-neutral-400">{formatReceiptDate(r.paidAt)}</span>
          </div>

          <div className="mx-6 mt-5 rounded-xl border border-neutral-700/70 bg-black/35 p-3">
            <div className="flex gap-3">
              <div
                className="h-14 w-14 shrink-0 rounded-md bg-gradient-to-br from-[#3b82f6] via-[#22d3ee] to-[#4ade80]"
                aria-hidden
              />
              <div className="min-w-0 flex-1 pt-1">
                <p className="truncate text-sm font-medium text-white">{r.productTitle}</p>
                <p className="mt-1 text-sm tabular-nums text-neutral-300">{formatUsd(r.subtotal)}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-neutral-700/70 px-6 pt-4 text-[14px]">
            <Row label="Subtotal" value={formatUsd(r.subtotal)} muted />
            <Row label="Processing fee" value={r.processingFee > 0 ? formatUsd(r.processingFee) : "Waived"} muted />
            <Row label="Sales tax" value={formatUsd(r.salesTax)} muted />
            <div className="flex justify-between border-t border-neutral-700/70 pt-3 text-[15px] font-semibold text-white">
              <span>Total</span>
              <span className="tabular-nums">{formatUsd(r.total)}</span>
            </div>
          </div>

          <div className="mt-8 px-6 pb-8">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full gap-2 border-neutral-600 bg-transparent text-neutral-100 hover:bg-white/10 hover:text-white"
              onClick={onDemoDownload}
            >
              <Download className="h-4 w-4 shrink-0" />
              Download invoice
            </Button>
            {downloadHint ? (
              <p className="mt-2 text-center text-[11px] text-[hsl(262_83%_70%)]">Demo: invoice PDF would download here.</p>
            ) : null}
          </div>

          <ReceiptJaggedEdge />
        </article>

        <div className="mt-10 flex flex-col items-center gap-3 text-neutral-600">
          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            <span className="text-[hsl(262_83%_55%)]" aria-hidden>
              ●
            </span>
            <span className="font-medium text-neutral-400">Powered by</span>
            <div className="flex items-center gap-1">
              <Image src="/logo.png" alt="" width={16} height={16} className="rounded" />
              <span className="text-neutral-300">Lotus Pay</span>
            </div>
          </div>
          <div className="flex gap-5 text-[11px]">
            <Link href="/dashboard/products" className="text-neutral-500 underline underline-offset-2 hover:text-neutral-300">
              Products
            </Link>
            <Link href="/" className="text-neutral-500 underline underline-offset-2 hover:text-neutral-300">
              Home
            </Link>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes receipt-confetti-fall {
          0% {
            transform: translate3d(0, -8px, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 520px, 0) rotate(540deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: React.ReactNode; muted?: boolean }) {
  return (
    <div
      className={[
        "flex justify-between gap-4 tabular-nums",
        muted ? "text-neutral-500" : "text-neutral-200",
      ].join(" ")}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
