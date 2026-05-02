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
  email?: string;
  password?: string;
  displayName?: string;
  website?: string;
  productCategory?: ProductCategory;
  country?: CountryCode;
  referralSource?: string;
  notes?: string;
};

const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "Services";
const DEFAULT_COUNTRY: CountryCode = "LK";

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<SignupBody>;

  const role = body.role;
  const displayName = (body.displayName ?? "").trim();
  const fallbackEmailSlug = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "demo-user";
  const email =
    (body.email ?? `demo-${fallbackEmailSlug}-${randomUUID().slice(0, 8)}@lotuspay.demo`)
      .trim()
      .toLowerCase();
  const password = body.password ?? `demo-${randomUUID().slice(0, 12)}`;
  const website = (body.website ?? "").trim();
  const productCategory = body.productCategory ?? DEFAULT_PRODUCT_CATEGORY;
  const country = body.country ?? DEFAULT_COUNTRY;

  if (!role || (role !== "business" && role !== "individual")) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (!displayName || displayName.length < 2) {
    return NextResponse.json({ error: "Business name is required." }, { status: 400 });
  }
  if (!email.includes("@") || password.length < 6) {
    return NextResponse.json(
      { error: "Provide a valid email and password (min 6 chars)." },
      { status: 400 }
    );
  }
  if (
    productCategory !== "Software (SaaS)" &&
    productCategory !== "Services" &&
    productCategory !== "E-commerce" &&
    productCategory !== "Consulting" &&
    productCategory !== "Education" &&
    productCategory !== "Other"
  ) {
    return NextResponse.json({ error: "Invalid product category." }, { status: 400 });
  }
  if (
    country !== "US" &&
    country !== "GB" &&
    country !== "IN" &&
    country !== "LK" &&
    country !== "DE" &&
    country !== "FR"
  ) {
    return NextResponse.json({ error: "Invalid country." }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already in use." }, { status: 409 });
  }

  const currency = currencyForCountry(country);

  const user = {
    ...createDefaultUser({
      role,
      email,
      password,
      displayName,
      website: website || undefined,
      productCategory,
      country,
      currency,
    }),
    onboarded: true,
  };

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

  return NextResponse.json({ redirectTo: "/account" });
}

