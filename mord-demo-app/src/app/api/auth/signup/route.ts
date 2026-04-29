import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import {
  createDefaultUser,
  updateDb,
  findUserByEmail,
  type ProductCategory,
  type UserRole,
} from "@/lib/demo-db";
import { currencyForCountry, type CountryCode } from "@/lib/currency";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

type SignupBody = {
  role: UserRole;
  email: string;
  password: string;
};

const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "Services";
const DEFAULT_COUNTRY: CountryCode = "US";

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<SignupBody>;

  const role = body.role;
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!role || (role !== "business" && role !== "individual")) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (!email.includes("@") || password.length < 6) {
    return NextResponse.json(
      { error: "Provide a valid email and password (min 6 chars)." },
      { status: 400 }
    );
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already in use." }, { status: 409 });
  }

  const displayName = role === "business" ? "New business" : "New individual";
  const currency = currencyForCountry(DEFAULT_COUNTRY);

  const user = createDefaultUser({
    role,
    email,
    password,
    displayName,
    productCategory: DEFAULT_PRODUCT_CATEGORY,
    country: DEFAULT_COUNTRY,
    currency,
  });

  const token = randomUUID();
  const createdAt = new Date().toISOString();

  await updateDb(async (db) => {
    db.usersById[user.id] = user;
    db.sessionsByToken[token] = { token, userId: user.id, createdAt };
  });

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return NextResponse.json({ redirectTo: "/auth/onboarding" });
}

