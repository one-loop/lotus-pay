import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { updateDb } from "@/lib/demo-db";

export const runtime = "nodejs";

export async function POST() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  cookies().delete(SESSION_COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ ok: true });
  }

  await updateDb(async (db) => {
    delete db.sessionsByToken[token];
  });

  return NextResponse.json({ ok: true });
}

