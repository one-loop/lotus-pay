"use client";

import * as React from "react";
import { Plus, ReceiptText, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import type { ProductCategory } from "@/lib/demo-db";
import { type CurrencyCode, formatMoney } from "@/lib/currency";

type PaymentLinkItem = {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  category?: ProductCategory;
  slug: string;
  price: number;
  currency: CurrencyCode;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  paymentsCount: number;
};

const CATEGORY_OPTIONS: ProductCategory[] = [
  "Software (SaaS)",
  "Services",
  "E-commerce",
  "Consulting",
  "Education",
  "Other",
];

export default function PaymentLinksManager() {
  const [loading, setLoading] = React.useState(true);
  const [links, setLinks] = React.useState<PaymentLinkItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<ProductCategory>("Services");
  const [price, setPrice] = React.useState<number>(49);
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/payment-links/list");
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error ?? "Could not load payment links.");
        }
        if (!isMounted) return;
        setLinks(data.paymentLinks ?? []);
      } catch (e) {
        if (!isMounted) return;
        setError(e instanceof Error ? e.message : "Could not load payment links.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  async function refresh() {
    const res = await fetch("/api/payment-links/list");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Could not refresh.");
    setLinks(data.paymentLinks ?? []);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/payment-links/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          price,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Could not create payment link.");
      }

      // clear form
      setTitle("");
      setDescription("");
      setCategory("Services");
      setPrice(49);

      await refresh();
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Could not create payment link.");
    } finally {
      setCreating(false);
    }
  }

  async function copyShareUrl(slug: string) {
    const url = `${origin}/p/${slug}`;
    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Create a payment link</CardTitle>
          <CardDescription>
            Add a product/service and generate a shareable checkout URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <form className="grid gap-4" onSubmit={onCreate}>
            <div className="grid gap-2">
              <Label htmlFor="pl-title">Product/payment name</Label>
              <Input
                id="pl-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Website redesign"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pl-desc">Description (optional)</Label>
              <Textarea
                id="pl-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you selling?"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pl-category">Category</Label>
              <select
                id="pl-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pl-price">Price</Label>
              <Input
                id="pl-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={1}
                step={0.01}
                required
              />
            </div>

            <Button type="submit" disabled={creating || !title.trim()}>
              {creating ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create link
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground">
              Customers pay in your store&apos;s local currency (based on onboarding country).
            </p>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Your payment links</CardTitle>
            <CardDescription>
              Share each URL with clients. Payments are recorded in this demo.
            </CardDescription>
          </div>
          <Badge variant="secondary">{links.length} links</Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : links.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No links yet. Create your first payment link.
            </div>
          ) : (
            <div className="grid gap-4">
              {links.map((l) => {
                const shareUrl = `${origin}/p/${l.slug}`;
                return (
                  <div
                    key={l.id}
                    className="rounded-lg border border-border/60 bg-background p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <ReceiptText className="h-4 w-4 text-muted-foreground" />
                          <div className="truncate font-medium">{l.title}</div>
                          {l.status === "active" ? (
                            <Badge className="ml-1">Active</Badge>
                          ) : null}
                        </div>
                        {l.description ? (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {l.description}
                          </p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-medium">
                            {formatMoney(l.price, l.currency)}
                          </span>
                          {l.category ? <span className="text-muted-foreground">• {l.category}</span> : null}
                        </div>
                      </div>
                      <div className="shrink-0 text-right text-sm">
                        <div className="font-medium">{l.paymentsCount} payments</div>
                        <div className="text-muted-foreground">
                          Share link for checkout
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <a href={shareUrl} target="_blank" rel="noreferrer">
                          Preview
                        </a>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={async () => {
                          await copyShareUrl(l.slug);
                        }}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Copy share URL
                      </Button>
                    </div>

                    <div className="mt-3 break-all rounded-md bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                      {shareUrl}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

