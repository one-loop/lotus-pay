"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DemoMockDashboardPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
          <div>
            <CardTitle className="text-base">Overview</CardTitle>
            <CardDescription className="mt-1">
              Placeholder content for this demo. Nothing here persists or connects to real services.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            Demo
          </Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Explore live flows via <span className="text-foreground">Products</span>,{" "}
          <span className="text-foreground">Payouts</span>, and the standalone checkout from a payment link.
        </CardContent>
      </Card>
    </main>
  );
}
