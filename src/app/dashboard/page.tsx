import { getUserFromSession } from "@/lib/auth";
import { loadDb } from "@/lib/demo-db";
import { formatMoney } from "@/lib/currency";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardOverviewPage() {
  const user = await getUserFromSession();
  if (!user) return null;

  const db = await loadDb();

  const links = Object.values(db.paymentLinksById).filter(
    (l) => l.ownerId === user.id && l.status === "active"
  );

  const payments = Object.values(db.paymentsById).filter(
    (p) => p.ownerId === user.id && p.status === "succeeded"
  );

  const paymentsReceivedTotal = payments.reduce((acc, p) => acc + p.amount, 0);

  const lastPayment = payments
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your store, connect payouts, and generate shareable payment links.
          </p>
        </div>
        <Badge variant="secondary">{user.profile.country}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Store</CardTitle>
            <CardDescription>Your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{user.store.storeName}</div>
            <div className="mt-2 text-sm text-muted-foreground">{user.profile.productCategory}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payouts</CardTitle>
            <CardDescription>Connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold">
                {user.payouts.connected ? "Connected" : "Not connected"}
              </div>
              <Badge variant={user.payouts.connected ? "default" : "secondary"}>
                {user.payouts.connected ? "Ready" : "Setup"}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Receive payouts in {user.currency}.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment links</CardTitle>
            <CardDescription>Active URLs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{links.length}</div>
            <div className="mt-1 text-sm text-muted-foreground">Share with clients</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Received</CardTitle>
            <CardDescription>Successful payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {formatMoney(paymentsReceivedTotal, user.currency)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {lastPayment ? `Last payment: ${new Date(lastPayment.createdAt).toLocaleDateString()}` : "No payments yet"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

