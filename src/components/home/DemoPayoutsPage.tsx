"use client";

import * as React from "react";
import { ArrowRight, Building2, CalendarClock, Landmark, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PaymentRow = {
  id: string;
  customer: string;
  date: string;
  gross: number;
  fee: number;
  net: number;
  status: "succeeded" | "pending";
};

const PAYMENTS: PaymentRow[] = [
  { id: "pay_09j3ka1", customer: "Sarah T.", date: "2026-05-02T09:22:00.000Z", gross: 129, fee: 3.87, net: 125.13, status: "succeeded" },
  { id: "pay_09j2mf8", customer: "Devon M.", date: "2026-05-02T07:48:00.000Z", gross: 49, fee: 1.47, net: 47.53, status: "succeeded" },
  { id: "pay_09j1pd3", customer: "Acme Studio", date: "2026-05-01T18:01:00.000Z", gross: 399, fee: 11.97, net: 387.03, status: "pending" },
  { id: "pay_09hz4lc", customer: "Olivia K.", date: "2026-05-01T10:55:00.000Z", gross: 75, fee: 2.25, net: 72.75, status: "succeeded" },
  { id: "pay_09hy2na", customer: "Nexa Labs", date: "2026-04-30T16:12:00.000Z", gross: 249, fee: 7.47, net: 241.53, status: "succeeded" },
];

const MINIMUM_PAYOUT_THRESHOLD = 50;

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(n);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso)
  );
}

export default function DemoPayoutsPage() {
  const [connectedBank, setConnectedBank] = React.useState<string | null>(null);
  const [schedule, setSchedule] = React.useState<"daily" | "weekly" | "monthly">("weekly");
  const [bankName, setBankName] = React.useState("First National Bank");
  const [accountLast4, setAccountLast4] = React.useState("8294");
  const [routingLast4, setRoutingLast4] = React.useState("1100");
  const [withdrawHint, setWithdrawHint] = React.useState<string | null>(null);

  const eligibleAmount = React.useMemo(
    () =>
      PAYMENTS.filter((p) => p.status === "succeeded").reduce((sum, p) => {
        return sum + p.net;
      }, 0),
    []
  );
  const pendingAmount = React.useMemo(
    () =>
      PAYMENTS.filter((p) => p.status === "pending").reduce((sum, p) => {
        return sum + p.net;
      }, 0),
    []
  );

  const canWithdraw = Boolean(connectedBank) && eligibleAmount >= MINIMUM_PAYOUT_THRESHOLD;

  function connectBank(e: React.FormEvent) {
    e.preventDefault();
    const cleanBank = bankName.trim() || "Connected Bank";
    const cleanAccount = accountLast4.trim().slice(-4).padStart(4, "0");
    setConnectedBank(`${cleanBank} •••• ${cleanAccount}`);
  }

  function onWithdraw(amount: number) {
    if (!connectedBank) {
      setWithdrawHint("Connect a bank account first.");
      window.setTimeout(() => setWithdrawHint(null), 2000);
      return;
    }
    setWithdrawHint(`Withdrawal queued: ${formatUsd(amount)} to ${connectedBank}.`);
    window.setTimeout(() => setWithdrawHint(null), 2600);
  }

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Payouts</h2>
          <p className="text-sm text-muted-foreground">
            Connect a bank account, configure an automatic payout schedule, and withdraw available funds.
          </p>
        </div>
        <div className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
          Next automatic payout: <span className="font-medium text-foreground">Every {schedule}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Amount eligible for payout
            </CardDescription>
            <CardTitle className="text-2xl">{formatUsd(eligibleAmount)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            Successful payments net of processing fees.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Minimum payout threshold
            </CardDescription>
            <CardTitle className="text-2xl">{formatUsd(MINIMUM_PAYOUT_THRESHOLD)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            Withdrawals are enabled once eligible balance reaches this value.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Bank connection
            </CardDescription>
            <CardTitle className="text-base sm:text-lg">
              {connectedBank ? connectedBank : "Not connected"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant={connectedBank ? "default" : "outline"}>
              {connectedBank ? "Connected" : "Action required"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bank" className="w-full">
        <TabsList>
          <TabsTrigger value="bank">Connect bank account</TabsTrigger>
          <TabsTrigger value="schedule">Payout schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bank account details</CardTitle>
              <CardDescription>
                Add payout destination details. This is a demo flow and does not verify real account ownership.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={connectBank}>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bank-name">Bank name</Label>
                  <Input
                    id="bank-name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. First National Bank"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routing">Routing number (last 4)</Label>
                  <Input
                    id="routing"
                    inputMode="numeric"
                    maxLength={4}
                    value={routingLast4}
                    onChange={(e) => setRoutingLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="1100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Account number (last 4)</Label>
                  <Input
                    id="account"
                    inputMode="numeric"
                    maxLength={4}
                    value={accountLast4}
                    onChange={(e) => setAccountLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="8294"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" className="gap-2">
                    <Landmark className="h-4 w-4" />
                    Connect bank account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Automatic payout cadence</CardTitle>
              <CardDescription>Choose how often available funds should be sent to your connected bank.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["daily", "weekly", "monthly"] as const).map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-border px-3 py-2.5"
                >
                  <span className="text-sm capitalize">{option}</span>
                  <input
                    type="radio"
                    name="schedule"
                    checked={schedule === option}
                    onChange={() => setSchedule(option)}
                    className="accent-primary"
                  />
                </label>
              ))}
              <p className="text-xs text-muted-foreground">
                Weekly payouts are recommended for most stores and are typically sent every Monday.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Recent payments</CardTitle>
            <CardDescription>
              Review incoming payments and withdraw available balance to your connected bank account.
            </CardDescription>
          </div>
          <Button
            type="button"
            onClick={() => onWithdraw(eligibleAmount)}
            disabled={!canWithdraw}
            className="gap-2"
          >
            Withdraw {formatUsd(eligibleAmount)}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {withdrawHint ? (
            <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
              {withdrawHint}
            </div>
          ) : null}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5 font-medium">Payment ID</th>
                  <th className="px-3 py-2.5 font-medium">Customer</th>
                  <th className="px-3 py-2.5 font-medium">Received at</th>
                  <th className="px-3 py-2.5 font-medium">Gross</th>
                  <th className="px-3 py-2.5 font-medium">Fee</th>
                  <th className="px-3 py-2.5 font-medium">Net</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {PAYMENTS.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-3 py-2.5 font-mono text-xs">{p.id}</td>
                    <td className="px-3 py-2.5">{p.customer}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{formatDate(p.date)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatUsd(p.gross)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-muted-foreground">-{formatUsd(p.fee)}</td>
                    <td className="px-3 py-2.5 tabular-nums font-medium">{formatUsd(p.net)}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant={p.status === "succeeded" ? "default" : "secondary"} className="capitalize">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={p.status !== "succeeded" || !connectedBank}
                        onClick={() => onWithdraw(p.net)}
                      >
                        Withdraw
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Pending balance: {formatUsd(pendingAmount)}</span>
            {!connectedBank ? <span>Connect a bank account to enable withdrawals.</span> : null}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
