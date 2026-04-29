import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { updateDb } from "@/lib/demo-db";
import type { CountryCode } from "@/lib/currency";

export const runtime = "nodejs";

type ConnectPayoutsBody = {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  routingNumber?: string;
  country?: CountryCode;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<ConnectPayoutsBody>;
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bankName = (body.bankName ?? "").trim();
  const accountHolder = (body.accountHolder ?? "").trim();
  const accountNumber = (body.accountNumber ?? "").trim();
  const routingNumber = (body.routingNumber ?? "").trim();

  if (bankName.length < 2) {
    return NextResponse.json({ error: "Bank name is required." }, { status: 400 });
  }
  if (accountHolder.length < 2) {
    return NextResponse.json({ error: "Account holder is required." }, { status: 400 });
  }
  if (accountNumber.length < 4) {
    return NextResponse.json(
      { error: "Account number is required." },
      { status: 400 }
    );
  }

  await updateDb(async (db) => {
    const session = db.sessionsByToken[token];
    if (!session) return;
    const user = db.usersById[session.userId];
    if (!user) return;

    user.payouts.connected = true;
    user.payouts.connectedAt = new Date().toISOString();
    user.payouts.bank = {
      bankName,
      accountHolder,
      accountNumber,
      routingNumber: routingNumber.length > 0 ? routingNumber : undefined,
      country: body.country ?? user.profile.country,
    };
  });

  return NextResponse.json({ ok: true });
}

