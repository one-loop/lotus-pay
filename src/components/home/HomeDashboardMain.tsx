"use client";

import * as React from "react";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  CreditCard,
  ExternalLink,
  LayoutGrid,
  RotateCcw,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const scale = (n: number) => Math.round(n / 10);

const CHART_DATA_TOTAL = [
  { label: "Apr 4", revenue: scale(1200) },
  { label: "Apr 6", revenue: scale(1850) },
  { label: "Apr 8", revenue: scale(2100) },
  { label: "Apr 10", revenue: scale(1980) },
  { label: "Apr 12", revenue: scale(2650) },
  { label: "Apr 14", revenue: scale(2420) },
  { label: "Apr 16", revenue: scale(3100) },
  { label: "Apr 18", revenue: scale(2890) },
  { label: "Apr 20", revenue: scale(3550) },
  { label: "Apr 22", revenue: scale(3320) },
  { label: "Apr 24", revenue: scale(4100) },
  { label: "Apr 26", revenue: scale(3880) },
  { label: "Apr 28", revenue: scale(4520) },
  { label: "Apr 30", revenue: scale(4980) },
  { label: "May 2", revenue: scale(5240) },
];

const CHART_DATA_NET = CHART_DATA_TOTAL.map((d) => ({
  ...d,
  revenue: Math.round(d.revenue * 0.88),
}));

const MOCK_METRICS = {
  paymentsCount: Math.max(1, 14),
  totalRefunds: 52,
  payoutsReceived: 4430,
};

const USD_TO_LKR = 300;

function formatCurrency(n: number, currency: "USD" | "LKR") {
  const converted = currency === "LKR" ? n * USD_TO_LKR : n;
  return new Intl.NumberFormat(currency === "LKR" ? "en-LK" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(converted);
}

type CountryRow = { name: string; flag: string; revenue: number };

const TOP_COUNTRIES_RAW: CountryRow[] = [
  { name: "United States", flag: "🇺🇸", revenue: scale(42_000) },
  { name: "United Kingdom", flag: "🇬🇧", revenue: scale(28_000) },
  { name: "France", flag: "🇫🇷", revenue: scale(19_000) },
  { name: "India", flag: "🇮🇳", revenue: scale(14_000) },
  { name: "Germany", flag: "🇩🇪", revenue: scale(9000) },
];

const TOP_COUNTRIES = TOP_COUNTRIES_RAW.map((c) => ({
  ...c,
  display: formatCurrency(c.revenue, "USD"),
}));

const maxCountryRevenue = Math.max(...TOP_COUNTRIES.map((c) => c.revenue), 1);

function DottedWorldPanel() {
  return (
    <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-lg border border-border/80 bg-muted/20">
      <div
        className="absolute inset-0 opacity-[0.45] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, hsl(var(--muted-foreground) / 0.5) 1px, transparent 1.5px)",
          backgroundSize: "6px 6px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/30" />
      <div className="absolute bottom-3 left-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Demo map
      </div>
    </div>
  );
}

export default function HomeDashboardMain() {
  const [revenueView, setRevenueView] = React.useState<"total" | "net">("total");
  const [displayCurrency, setDisplayCurrency] = React.useState<"USD" | "LKR">("USD");

  const chartData = revenueView === "total" ? CHART_DATA_TOTAL : CHART_DATA_NET;
  const chartMax = Math.max(...chartData.map((d) => d.revenue), 50);
  const yRound = chartMax <= 800 ? 100 : 500;
  const yUpper = Math.ceil(chartMax / yRound) * yRound + yRound;

  const totalRevenueSum = CHART_DATA_TOTAL.reduce((acc, d) => acc + d.revenue, 0);
  const netRevenueSum = CHART_DATA_NET.reduce((acc, d) => acc + d.revenue, 0);
  const headlineRevenue = revenueView === "total" ? totalRevenueSum : netRevenueSum;

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6">
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b border-border bg-transparent p-0">
          {[
            ["revenue", "Revenue"],
            ["customers", "Customers"],
            ["breakdown", "Revenue Breakdown"],
            ["retention", "Retention"],
            ["success", "Success Rate"],
            ["recovery", "Recovery"],
          ].map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="revenue" className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <Calendar className="h-4 w-4" />
              All time
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              All products
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base font-medium">Total Revenue</CardTitle>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
                    <button
                      type="button"
                      onClick={() => setRevenueView("total")}
                      className={[
                        "rounded-md px-2 py-1 text-xs font-medium",
                        revenueView === "total"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      Total Revenue
                    </button>
                    <button
                      type="button"
                      onClick={() => setRevenueView("net")}
                      className={[
                        "rounded-md px-2 py-1 text-xs font-medium",
                        revenueView === "net"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      Net Revenue
                    </button>
                  </div>
                  <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
                    <button
                      type="button"
                      onClick={() => setDisplayCurrency("USD")}
                      className={[
                        "rounded-md px-2 py-1 text-xs font-medium",
                        displayCurrency === "USD"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      USD
                    </button>
                    <button
                      type="button"
                      onClick={() => setDisplayCurrency("LKR")}
                      className={[
                        "rounded-md px-2 py-1 text-xs font-medium",
                        displayCurrency === "LKR"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      LKR
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold tracking-tight">
                  {formatCurrency(headlineRevenue, displayCurrency)}
                </p>
                <Badge variant="secondary" className="mt-3">
                  Demo data
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm lg:col-span-1">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-4">
                <CardTitle className="text-base font-medium">Revenue (Last 30 days)</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    Show daily
                  </Button>
                  <Button variant="ghost" size="icon">
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[260px] pl-0 pt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(v) => formatCurrency(Number(v), displayCurrency)}
                      domain={[0, yUpper]}
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value ?? 0), displayCurrency),
                        revenueView === "total" ? "Total" : "Net",
                      ]}
                      contentStyle={{
                        borderRadius: "var(--radius)",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--card))",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <Card className="border-dashed">
            <CardContent className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
              Customer insights — demo placeholder
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="breakdown" className="mt-6">
          <Card className="border-dashed">
            <CardContent className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
              Revenue breakdown — demo placeholder
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="retention" className="mt-6">
          <Card className="border-dashed">
            <CardContent className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
              Retention — demo placeholder
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="success" className="mt-6">
          <Card className="border-dashed">
            <CardContent className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
              Success rate — demo placeholder
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recovery" className="mt-6">
          <Card className="border-dashed">
            <CardContent className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
              Recovery — demo placeholder
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payments Count</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {MOCK_METRICS.paymentsCount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Refunds</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {formatCurrency(MOCK_METRICS.totalRefunds, displayCurrency)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payouts Received</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {formatCurrency(MOCK_METRICS.payoutsReceived, displayCurrency)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Top 5 Revenue Generating Countries</CardTitle>
          <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Open details">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:flex-row">
          <div className="min-h-[200px] md:w-[45%]">
            <DottedWorldPanel />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {TOP_COUNTRIES.map((country) => {
              const pct = Math.round((country.revenue / maxCountryRevenue) * 100);
              return (
                <div key={country.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <span className="text-lg leading-none">{country.flag}</span>
                  <div className="min-w-0 space-y-1.5">
                    <p className="truncate text-sm font-medium">{country.name}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {formatCurrency(country.revenue, displayCurrency)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
