"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Props = {
  initial: {
    storeName: string;
    logoDataUrl?: string;
    bannerDataUrl?: string;
  };
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StoreSettingsForm({ initial }: Props) {
  const [storeName, setStoreName] = React.useState(initial.storeName);
  const [logoDataUrl, setLogoDataUrl] = React.useState<string | undefined>(
    initial.logoDataUrl
  );
  const [bannerDataUrl, setBannerDataUrl] = React.useState<string | undefined>(
    initial.bannerDataUrl
  );

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setLogoDataUrl(dataUrl);
  }

  async function onBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setBannerDataUrl(dataUrl);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/store/update", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          storeName,
          logoDataUrl,
          bannerDataUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save store settings.");
      }
      setSuccess("Store updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save store settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store details</CardTitle>
        <CardDescription>
          Update your store name, logo, and banner. These appear on your public payment links.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Couldn&apos;t save</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {success ? (
          <Alert className="mb-4">
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        ) : null}

        <form className="grid gap-6" onSubmit={onSave}>
          <div className="grid gap-2">
            <Label htmlFor="storeName">Store name</Label>
            <Input
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Dodo Studio"
              autoComplete="organization"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-lg border border-border/60 bg-background/40">
                  {logoDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoDataUrl} alt="Logo preview" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={onLogoChange}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="banner">Banner</Label>
              <div className="overflow-hidden rounded-lg border border-border/60 bg-background/40">
                <div className="aspect-[16/5] w-full">
                  {bannerDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bannerDataUrl} alt="Banner preview" className="h-full w-full object-cover" />
                  ) : null}
                </div>
              </div>
              <input
                id="banner"
                type="file"
                accept="image/*"
                onChange={onBannerChange}
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Demo only: uploads are stored in local JSON (data URL).
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

