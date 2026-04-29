import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { findUserByEmail, updateDb } from "@/lib/demo-db";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

type LoginBody = {
  email: string;
  password: string;
};

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<LoginBody>;
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email.includes("@") || password.length < 1) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = randomUUID();
  const createdAt = new Date().toISOString();

  await updateDb(async (db) => {
    db.sessionsByToken[token] = { token, userId: user.id, createdAt };
  });

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return NextResponse.json({
    redirectTo: user.onboarded ? "/dashboard" : "/auth/onboarding",
  });
}

