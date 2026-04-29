import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { loadDb, paymentLinkPublic } from "@/lib/demo-db";

export const runtime = "nodejs";

export async function GET() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await loadDb();
  const session = db.sessionsByToken[token];
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = Object.values(db.paymentLinksById)
    .filter((l) => l.ownerId === session.userId)
    .filter((l) => l.status === "active")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const paymentsByLink: Record<string, number> = {};
  for (const p of Object.values(db.paymentsById)) {
    if (p.ownerId !== session.userId) continue;
    if (!paymentsByLink[p.linkId]) paymentsByLink[p.linkId] = 0;
    paymentsByLink[p.linkId]++;
  }

  const paymentsReceived = Object.values(db.paymentsById)
    .filter((p) => p.ownerId === session.userId && p.status === "succeeded")
    .reduce((acc, p) => acc + p.amount, 0);

  const responseLinks = links.map((l) => ({
    ...paymentLinkPublic(l),
    paymentsCount: paymentsByLink[l.id] ?? 0,
  }));

  return NextResponse.json({
    paymentLinks: responseLinks,
    paymentsReceivedTotal: paymentsReceived,
    currency: links[0]?.currency,
  });
}

