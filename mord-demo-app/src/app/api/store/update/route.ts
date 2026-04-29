import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { updateDb } from "@/lib/demo-db";

export const runtime = "nodejs";

type StoreUpdateBody = {
  storeName: string;
  logoDataUrl?: string;
  bannerDataUrl?: string;
};

export async function PUT(req: Request) {
  const body = (await req.json()) as Partial<StoreUpdateBody>;
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storeName = (body.storeName ?? "").trim();
  const logoDataUrl = body.logoDataUrl;
  const bannerDataUrl = body.bannerDataUrl;

  if (storeName.length < 2) {
    return NextResponse.json({ error: "Store name is required." }, { status: 400 });
  }

  await updateDb(async (db) => {
    const session = db.sessionsByToken[token];
    if (!session) return;
    const user = db.usersById[session.userId];
    if (!user) return;

    user.store.storeName = storeName;
    // keep profile displayName in sync with store name for demo simplicity
    user.profile.displayName = storeName;

    if (typeof logoDataUrl === "string" && logoDataUrl.startsWith("data:image/")) {
      user.store.logoDataUrl = logoDataUrl;
    }
    if (typeof bannerDataUrl === "string" && bannerDataUrl.startsWith("data:image/")) {
      user.store.bannerDataUrl = bannerDataUrl;
    }
  });

  return NextResponse.json({ ok: true });
}

