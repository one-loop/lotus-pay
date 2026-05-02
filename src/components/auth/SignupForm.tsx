"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ProductCategory } from "@/lib/demo-db";
import { COUNTRY_OPTIONS, type CountryCode } from "@/lib/currency";

type Props = {
  defaultRole?: "business" | "individual";
};

const CATEGORY_OPTIONS: ProductCategory[] = [
  "Software (SaaS)",
  "Services",
  "E-commerce",
  "Consulting",
  "Education",
  "Other",
];

export default function SignupForm({ defaultRole = "business" }: Props) {
  const router = useRouter();

  const [role, setRole] = React.useState<"business" | "individual">(defaultRole);
  const [displayName, setDisplayName] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [productCategory, setProductCategory] =
    React.useState<ProductCategory>("Services");
  const [country, setCountry] = React.useState<CountryCode>("LK");
  const [referralSource, setReferralSource] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          role: role === "individual" ? "individual" : "business",
          displayName,
          website,
          productCategory,
          country,
          referralSource,
          notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Could not sign up.");
      }
      router.push(data.redirectTo ?? "/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign up.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-black/55 p-5 shadow-2xl backdrop-blur-sm">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-white">Let&apos;s create your account</h1>
        <p className="mt-2 text-sm text-white/65">
          Sign up as a business or individual.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive" className="mb-4 border-red-500/50 bg-red-950/40 text-red-100">
          <AlertTitle>Couldn&apos;t create account</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label className="text-white/90">Sign up as</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={[
                "rounded-md border px-3 py-2 text-sm transition",
                role === "business"
                  ? "border-blue-400/80 bg-blue-400/15 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
              ].join(" ")}
              onClick={() => setRole("business")}
            >
              Business
            </button>
            <button
              type="button"
              className={[
                "rounded-md border px-3 py-2 text-sm transition",
                role === "individual"
                  ? "border-blue-400/80 bg-blue-400/15 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
              ].join(" ")}
              onClick={() => setRole("individual")}
            >
              Individual
            </button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="displayName" className="text-white/90">{role === "business" ? "Business name" : "Name"}</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Acme"
            required
            className="border-white/10 bg-black/40 text-white placeholder:text-white/35"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="website" className="text-white/90">Website URL</Label>
          <Input
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className="border-white/10 bg-black/40 text-white placeholder:text-white/35"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="productCategory" className="text-white/90">Product category</Label>
          <select
            id="productCategory"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value as ProductCategory)}
            className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category} className="bg-[#131313] text-white">
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="country" className="text-white/90">Where are you located?</Label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value as CountryCode)}
            className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#131313] text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="referralSource" className="text-white/90">Where did you hear about us?</Label>
          <Input
            id="referralSource"
            value={referralSource}
            onChange={(e) => setReferralSource(e.target.value)}
            placeholder="Select referral source"
            className="border-white/10 bg-black/40 text-white placeholder:text-white/35"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes" className="text-white/90">How can we make monetization simpler for you?</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="min-h-[72px] w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-white/30"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 bg-white text-black hover:bg-white/90"
        >
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}

