"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { COUNTRY_OPTIONS, type CountryCode } from "@/lib/currency";

type Props = {
  initial: {
    connected: boolean;
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
    routingNumber?: string;
    country?: CountryCode;
  };
};

export default function PayoutsConnectForm({ initial }: Props) {
  const [connected, setConnected] = React.useState(initial.connected);
  const [bankName, setBankName] = React.useState(initial.bankName ?? "");
  const [accountHolder, setAccountHolder] = React.useState(initial.accountHolder ?? "");
  const [accountNumber, setAccountNumber] = React.useState(initial.accountNumber ?? "");
  const [routingNumber, setRoutingNumber] = React.useState(initial.routingNumber ?? "");
  const [country, setCountry] = React.useState<CountryCode>(initial.country ?? "US");

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function onConnect(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/payouts/connect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          bankName,
          accountHolder,
          accountNumber,
          routingNumber,
          country,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Could not connect payouts.");
      }
      setConnected(true);
      setSuccess("Bank account connected (demo).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect payouts.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payouts</CardTitle>
        <CardDescription>
          Connect a local bank account to receive payouts in your store&apos;s currency (demo).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connected ? (
          <Alert className="mb-4">
            <AlertTitle>Connected</AlertTitle>
            <AlertDescription>
              Payouts will be credited to your linked bank account (mock).
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default" className="mb-4">
            <AlertTitle>Not connected yet</AlertTitle>
            <AlertDescription>Connect your bank details to receive payouts.</AlertDescription>
          </Alert>
        )}

        <form className="grid gap-5" onSubmit={onConnect}>
          <div className="grid gap-2">
            <Label htmlFor="bankName">Bank name</Label>
            <Input
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. Chase"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="accountHolder">Account holder name</Label>
            <Input
              id="accountHolder"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="Legal name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="accountNumber">Account number</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="12345678"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="routingNumber">Routing / sort code (optional)</Label>
            <Input
              id="routingNumber"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              placeholder="e.g. 01-2345-6789"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="country">Bank country</Label>
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

          {connected ? (
            <p className="text-sm text-muted-foreground">
              Demo note: this mock connection doesn&apos;t actually verify with a bank.
            </p>
          ) : null}

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Couldn&apos;t connect</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {success ? (
            <Alert className="border-primary/40 bg-primary/5">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Connecting..." : connected ? "Update connection" : "Connect bank"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

