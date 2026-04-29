import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { updateDb, type ProductCategory } from "@/lib/demo-db";
import {
  currencyForCountry,
  isCountryCode,
  type CountryCode,
} from "@/lib/currency";

export const runtime = "nodejs";

type OnboardingBody = {
  displayName: string;
  website?: string;
  productCategory: ProductCategory;
  country: CountryCode;
};

const ALLOWED_CATEGORIES: ProductCategory[] = [
  "Software (SaaS)",
  "Services",
  "E-commerce",
  "Consulting",
  "Education",
  "Other",
];

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<OnboardingBody>;
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const displayName = (body.displayName ?? "").trim();
  const website = (body.website ?? "").trim();
  const productCategory = body.productCategory;
  const country = body.country;

  if (displayName.length < 2) {
    return NextResponse.json({ error: "Display name is required." }, { status: 400 });
  }
  if (!productCategory || !ALLOWED_CATEGORIES.includes(productCategory)) {
    return NextResponse.json({ error: "Pick a product category." }, { status: 400 });
  }
  if (!country || !isCountryCode(country)) {
    return NextResponse.json({ error: "Pick a country." }, { status: 400 });
  }

  await updateDb(async (db) => {
    const session = db.sessionsByToken[token];
    if (!session) return;
    const user = db.usersById[session.userId];
    if (!user) return;

    user.profile.displayName = displayName;
    user.profile.website = website.length > 0 ? website : undefined;
    user.profile.productCategory = productCategory;
    user.profile.country = country;

    user.store.storeName = displayName;
    user.currency = currencyForCountry(country);

    user.onboarded = true;
  });

  return NextResponse.json({ ok: true, redirectTo: "/dashboard" });
}

