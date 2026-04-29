import { cookies } from "next/headers";

import { loadDb, type User } from "./demo-db";

export const SESSION_COOKIE_NAME = "mord_demo_session";

export function getSessionTokenFromCookies(): string | null {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  return token ?? null;
}

export async function getUserFromSession(): Promise<User | null> {
  const token = getSessionTokenFromCookies();
  if (!token) return null;

  const db = await loadDb();
  const session = db.sessionsByToken[token];
  if (!session) return null;

  return db.usersById[session.userId] ?? null;
}

