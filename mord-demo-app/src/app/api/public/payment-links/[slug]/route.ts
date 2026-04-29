import { NextResponse } from "next/server";

import { loadDb, paymentLinkPublic } from "@/lib/demo-db";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const db = await loadDb();

  const link = Object.values(db.paymentLinksById).find((l) => l.slug === slug);
  if (!link) {
    return NextResponse.json({ error: "Payment link not found." }, { status: 404 });
  }

  if (link.status !== "active") {
    return NextResponse.json({ error: "This payment link is not active." }, { status: 404 });
  }

  return NextResponse.json({ link: paymentLinkPublic(link) });
}

