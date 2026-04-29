import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { loadDb, updateDb } from "@/lib/demo-db";
import type { Payment } from "@/lib/demo-db";

export const runtime = "nodejs";

type CreatePaymentBody = {
  slug: string;
  payerName: string;
  payerEmail?: string;
  // demo-only fields (ignored)
  cardNumber?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<CreatePaymentBody>;
  const slug = (body.slug ?? "").trim();
  const payerName = (body.payerName ?? "").trim();
  const payerEmail = (body.payerEmail ?? "").trim();

  if (slug.length < 3) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }
  if (payerName.length < 2) {
    return NextResponse.json({ error: "Payer name is required." }, { status: 400 });
  }

  const db = await loadDb();
  const link = Object.values(db.paymentLinksById).find((l) => l.slug === slug);
  if (!link) {
    return NextResponse.json({ error: "Payment link not found." }, { status: 404 });
  }
  if (link.status !== "active") {
    return NextResponse.json({ error: "Payment link is not active." }, { status: 404 });
  }

  const payment: Omit<Payment, "id"> = {
    linkId: link.id,
    ownerId: link.ownerId,
    payer: { name: payerName, email: payerEmail.length > 0 ? payerEmail : undefined },
    amount: link.price,
    currency: link.currency,
    status: "succeeded",
    createdAt: new Date().toISOString(),
  };

  let createdPaymentId = "";
  await updateDb(async (db2) => {
    const id = randomUUID();
    createdPaymentId = id;
    db2.paymentsById[id] = { id, ...payment };
  });

  return NextResponse.json({
    ok: true,
    paymentId: createdPaymentId,
  });
}

