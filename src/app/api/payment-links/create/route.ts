import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { createSlug, updateDb, type ProductCategory } from "@/lib/demo-db";
import { type CurrencyCode } from "@/lib/currency";
import { loadDb } from "@/lib/demo-db";

export const runtime = "nodejs";

type CreatePaymentLinkBody = {
  title: string;
  description?: string;
  category?: ProductCategory;
  price: number;
  country?: string;
};

export async function POST(req: Request) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<CreatePaymentLinkBody>;
  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();
  const category = body.category;
  const price = Number(body.price ?? 0);

  if (title.length < 2) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { error: "Price must be a positive number." },
      { status: 400 }
    );
  }
  const normalizedDescription = description.length > 0 ? description : undefined;

  const db = await loadDb();
  const session = db.sessionsByToken[token];
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = db.usersById[session.userId];
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = createSlug(title);
  const currency: CurrencyCode = user.currency;

  let createdId = "";
  await updateDb(async (db2) => {
    const session2 = db2.sessionsByToken[token];
    if (!session2) return;
    const owner = db2.usersById[session2.userId];
    if (!owner) return;

    const linkId = randomUUID();
    createdId = linkId;
    const now = new Date().toISOString();
    db2.paymentLinksById[linkId] = {
      id: linkId,
      ownerId: owner.id,
      title,
      description: normalizedDescription,
      category,
      slug,
      price,
      currency,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
  });

  if (!createdId) {
    return NextResponse.json({ error: "Could not create link." }, { status: 500 });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_ORIGIN ||
    `http://localhost:${process.env.PORT ?? "3000"}`;

  return NextResponse.json({
    ok: true,
    link: {
      id: createdId,
      slug,
      title,
      description: normalizedDescription,
      category,
      price,
      currency,
      shareUrl: `${origin}/p/${slug}`,
    },
  });
}

