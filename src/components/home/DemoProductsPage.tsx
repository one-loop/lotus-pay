"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Filter, LayoutGrid, MoreHorizontal, Share2, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import {
  DEMO_PAYMENT_LINKS_KEY,
  newDemoProductId,
  normalizeDemoPaymentLink,
  readDemoPaymentLinks,
  writeDemoPaymentLinks,
  type DemoPaymentLink,
  type PricingType,
} from "@/lib/demo-payment-links";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SAMPLE_LINK_ID = "demo-consult-session";

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatCreatedUtc(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(d);
}

function checkoutPath(linkId: string) {
  return `/checkout/${linkId}`;
}

function checkoutAbsoluteUrl(linkId: string) {
  if (typeof window === "undefined") return checkoutPath(linkId);
  return `${window.location.origin}${checkoutPath(linkId)}`;
}

export default function DemoProductsPage() {
  const [links, setLinks] = React.useState<DemoPaymentLink[]>([]);
  const [copiedFor, setCopiedFor] = React.useState<string | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [amountRaw, setAmountRaw] = React.useState("20.90");
  const [pricingType, setPricingType] = React.useState<PricingType>("one_time");

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    let list = readDemoPaymentLinks();
    if (list.length === 0) {
      const seed: DemoPaymentLink = normalizeDemoPaymentLink({
        id: SAMPLE_LINK_ID,
        productId: newDemoProductId(),
        title: "Starter consult (30 min)",
        amount: 75,
        currency: "USD",
        createdAt: new Date().toISOString(),
        pricingType: "one_time",
      })!;
      writeDemoPaymentLinks([seed]);
      list = [seed];
    }
    setLinks(list);
    setPage(1);
  }, []);

  React.useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(links.length / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [links.length, rowsPerPage, page]);

  function persist(next: DemoPaymentLink[]) {
    setLinks(next);
    writeDemoPaymentLinks(next);
  }

  async function copyShareLink(linkId: string) {
    const url = checkoutAbsoluteUrl(linkId);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedFor(linkId);
      window.setTimeout(() => setCopiedFor((x) => (x === linkId ? null : x)), 1800);
    } catch {
      setCopiedFor(null);
    }
  }

  function onCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number.parseFloat(amountRaw);
    const safeAmount =
      Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) / 100 : 0;
    const label =
      name.trim() || (safeAmount > 0 ? `Payment (${formatUsd(safeAmount)})` : "Untitled product");
    const next: DemoPaymentLink = {
      id: crypto.randomUUID(),
      productId: newDemoProductId(),
      title: label,
      amount: safeAmount > 0 ? safeAmount : 1,
      currency: "USD",
      createdAt: new Date().toISOString(),
      pricingType,
    };
    persist([next, ...readDemoPaymentLinks()]);
    setName("");
    setAmountRaw("20.90");
    setPricingType("one_time");
    setAddOpen(false);
    setPage(1);
  }

  function resetDemoProducts() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(DEMO_PAYMENT_LINKS_KEY);
    const seed: DemoPaymentLink = normalizeDemoPaymentLink({
      id: SAMPLE_LINK_ID,
      productId: newDemoProductId(),
      title: "Starter consult (30 min)",
      amount: 75,
      currency: "USD",
      createdAt: new Date().toISOString(),
      pricingType: "one_time",
    })!;
    writeDemoPaymentLinks([seed]);
    setLinks([seed]);
    setPage(1);
  }

  const start = (page - 1) * rowsPerPage;
  const pageRows = links.slice(start, start + rowsPerPage);
  const end = Math.min(start + pageRows.length, links.length || 0);

  return (
    <main className="flex-1 space-y-0 p-4 sm:p-6">
      {/* <div className="mb-6 rounded-lg border border-amber-500/35 bg-amber-500/[0.08] px-4 py-3 text-[13px] text-amber-100">
        <span className="font-semibold uppercase tracking-wide text-amber-200">
          Action required:&nbsp;
        </span>
        Product information demo — sandbox only. Metrics and alerts are illustrative;{" "}
        <button type="button" className="underline underline-offset-2 hover:text-white">
          no form to submit
        </button>
        .
      </div> */}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">
            Create products with fixed pricing (one-time or recurring for display). Each product gets a shareable
            checkout link. Data lives in <code className="rounded bg-muted px-1 text-xs">sessionStorage</code> for
            this tab.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" type="button" className="gap-2" disabled>
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button size="sm" type="button" className="gap-2 bg-foreground text-background hover:bg-foreground/90" onClick={() => setAddOpen(true)}>
            Add product
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <Button variant="outline" size="sm" type="button" className="gap-2" disabled>
          <LayoutGrid className="h-4 w-4" />
          Edit columns
        </Button>
        <Button variant="ghost" size="sm" type="button" className="text-muted-foreground" onClick={resetDemoProducts}>
          Reset demo products
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card mb-4">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product name</th>
              <th className="px-4 py-3 font-medium">Product id</th>
              <th className="px-4 py-3 font-medium">Created on (UTC)</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Pricing type</th>
              <th className="px-4 py-3 font-medium">Payment link</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No products yet. Click <span className="text-foreground">Add product</span> to create one.
                </td>
              </tr>
            ) : (
              pageRows.map((link) => (
                <tr key={link.id} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                  <td className="px-4 py-3.5 font-medium text-foreground">{link.title}</td>
                  <td className="max-w-[200px] px-4 py-3.5 font-mono text-[12px] text-muted-foreground">
                    <span className="truncate block" title={link.productId}>
                      {link.productId}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-muted-foreground">
                    {formatCreatedUtc(link.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 tabular-nums font-medium">{formatUsd(link.amount)}</td>
                  <td className="px-4 py-3.5">
                    {link.pricingType === "recurring" ? (
                      <Badge className="rounded-full border-emerald-500/40 bg-emerald-600/90 font-normal text-white hover:bg-emerald-600/90">
                        Recurring
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="rounded-full border-blue-500/50 bg-blue-500/15 font-normal text-blue-200 hover:bg-blue-500/15">
                        One-time
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-[12px]"
                        onClick={() => copyShareLink(link.id)}
                      >
                        {copiedFor === link.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Share2 className="h-3.5 w-3.5" />
                            Share
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" asChild title="Open checkout">
                        <Link href={checkoutPath(link.id)} aria-label="More actions · open checkout">
                          <MoreHorizontal className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 mt-[20px]">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <select
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="tabular-nums">
            Viewing ({links.length === 0 ? 0 : start + 1} – {end}) of {links.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={start + rowsPerPage >= links.length}
              onClick={() => setPage((p) => p + 1)}
            >
              ›
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="sm" type="button" className="text-muted-foreground" disabled>
          View archived products
        </Button>
      </div>

      {links.some((l) => l.id === SAMPLE_LINK_ID) ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Try the seed product:{" "}
          <Link href={checkoutPath(SAMPLE_LINK_ID)} className="text-primary underline underline-offset-2">
            open checkout ($75)
          </Link>
        </p>
      ) : null}

      <Dialog.Root open={addOpen} onOpenChange={setAddOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(calc(100vw-2rem),420px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-0 shadow-xl outline-none">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Dialog.Title className="text-base font-semibold">Add product</Dialog.Title>
              <Dialog.Close className="rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="Close">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Set product name, price in USD, and whether pricing is one-time or recurring. A checkout link is created
              when you save.
            </Dialog.Description>
            <form onSubmit={onCreateProduct} className="space-y-4 px-5 py-5">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product name</Label>
                <Input
                  id="product-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pro subscription"
                  className="bg-background"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-price">Price (USD)</Label>
                <Input
                  id="product-price"
                  type="number"
                  inputMode="decimal"
                  min={0.01}
                  step="0.01"
                  value={amountRaw}
                  onChange={(e) => setAmountRaw(e.target.value)}
                  className="bg-background"
                />
              </div>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Pricing</legend>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                    <input
                      type="radio"
                      name="pricing"
                      checked={pricingType === "one_time"}
                      onChange={() => setPricingType("one_time")}
                      className="accent-primary"
                    />
                    One-time payment
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                    <input
                      type="radio"
                      name="pricing"
                      checked={pricingType === "recurring"}
                      onChange={() => setPricingType("recurring")}
                      className="accent-primary"
                    />
                    Recurring payment
                  </label>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Recurring is for display in this demo; checkout still collects a single sandbox payment.
                </p>
              </fieldset>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create product</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
