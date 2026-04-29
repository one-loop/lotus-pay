"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { CountryCode } from "@/lib/currency";
import { COUNTRY_OPTIONS } from "@/lib/currency";
import type { ProductCategory } from "@/lib/demo-db";

type Props = {
  initial?: {
    displayName?: string;
    website?: string;
    productCategory?: ProductCategory;
    country?: CountryCode;
  };
};

const CATEGORY_OPTIONS: ProductCategory[] = [
  "Software (SaaS)",
  "Services",
  "E-commerce",
  "Consulting",
  "Education",
  "Other",
];

export default function OnboardingForm({ initial }: Props) {
  const router = useRouter();

  const [displayName, setDisplayName] = React.useState(initial?.displayName ?? "");
  const [website, setWebsite] = React.useState(initial?.website ?? "");
  const [productCategory, setProductCategory] = React.useState<ProductCategory>(
    initial?.productCategory ?? "Services"
  );
  const [country, setCountry] = React.useState<CountryCode>(initial?.country ?? "US");

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          displayName,
          website,
          productCategory,
          country,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Could not save onboarding.");
      }
      router.push(data.redirectTo ?? "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save onboarding.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Onboarding</CardTitle>
        <CardDescription>
          Tell us about your business (or yourself) so we can set up your store and payouts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Couldn&apos;t save onboarding</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form className="grid gap-6" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="displayName">Name / Business name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Dodo Studio"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Website (optional)</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="productCategory">Product category</Label>
              <select
                id="productCategory"
                value={productCategory}
                onChange={(e) =>
                  setProductCategory(e.target.value as ProductCategory)
                }
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
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryCode)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Continue"}
            </Button>
            <p className="text-sm text-muted-foreground">
              You can change this later in a real product—this demo keeps it simple.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

