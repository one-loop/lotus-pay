"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatMoney, type CurrencyCode } from "@/lib/currency";

type Props = {
  slug: string;
  title: string;
  description?: string;
  amount: number;
  currency: CurrencyCode;
  storeName: string;
};

export default function PaymentCheckoutForm({
  slug,
  title,
  description,
  amount,
  currency,
  storeName,
}: Props) {
  const [payerName, setPayerName] = React.useState("");
  const [payerEmail, setPayerEmail] = React.useState("");

  // Demo-only card fields (ignored by the backend)
  const [cardNumber, setCardNumber] = React.useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = React.useState("12/34");
  const [cardCvc, setCardCvc] = React.useState("123");

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [paid, setPaid] = React.useState<{ paymentId: string } | null>(null);

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setPaid(null);
    try {
      const res = await fetch("/api/public/payments/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug,
          payerName,
          payerEmail,
          cardNumber,
          cardExpiry,
          cardCvc,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Payment failed.");
      }
      setPaid({ paymentId: data.paymentId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (paid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment successful</CardTitle>
          <CardDescription>Thanks for your payment.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTitle>Received</AlertTitle>
            <AlertDescription>
              {formatMoney(amount, currency)} sent to {storeName}. (Demo)
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground">
            Transaction ID: <span className="font-mono">{paid.paymentId}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay {title}</CardTitle>
        <CardDescription>{storeName}</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Couldn&apos;t process payment</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-4 rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="text-xs text-muted-foreground">Amount due</div>
          <div className="text-2xl font-semibold">{formatMoney(amount, currency)}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            You&apos;ll be charged in your local currency equivalent (demo).
          </div>
        </div>

        {description ? (
          <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        ) : null}

        <form className="grid gap-4" onSubmit={onPay}>
          <div className="grid gap-2">
            <Label htmlFor="payerName">Your name</Label>
            <Input
              id="payerName"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              required
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="payerEmail">Email (optional)</Label>
            <Input
              id="payerEmail"
              type="email"
              value={payerEmail}
              onChange={(e) => setPayerEmail(e.target.value)}
              placeholder="jane@example.com"
              autoComplete="email"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cardNumber">Card number (demo)</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="cardExpiry">Expiry</Label>
              <Input id="cardExpiry" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cardCvc">CVC</Label>
              <Input id="cardCvc" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} />
            </div>
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Processing..." : `Pay ${formatMoney(amount, currency)}`}
          </Button>

          <p className="text-xs text-muted-foreground">
            This is a demo checkout—no real card processing occurs.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

