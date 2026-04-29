import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import type { CurrencyCode, CountryCode } from "./currency";

export type UserRole = "business" | "individual";
export type ProductCategory =
  | "Software (SaaS)"
  | "Services"
  | "E-commerce"
  | "Consulting"
  | "Education"
  | "Other";

export type PaymentLinkStatus = "active" | "archived";

export type User = {
  id: string;
  role: UserRole;
  email: string;
  password: string; // demo-only: plaintext
  createdAt: string;
  onboarded: boolean;

  profile: {
    displayName: string; // name for individual, business name for business
    website?: string;
    productCategory: ProductCategory;
    country: CountryCode;
  };

  store: {
    storeName: string;
    logoDataUrl?: string;
    bannerDataUrl?: string;
  };

  currency: CurrencyCode;

  payouts: {
    connected: boolean;
    connectedAt?: string;
    bank?: {
      bankName: string;
      accountHolder: string;
      accountNumber: string;
      routingNumber?: string; // sort code / routing number
      country: CountryCode;
    };
  };
};

export type Session = {
  token: string;
  userId: string;
  createdAt: string;
};

export type PaymentLink = {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  category?: ProductCategory;
  slug: string;
  price: number;
  currency: CurrencyCode;
  status: PaymentLinkStatus;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: string;
  linkId: string;
  ownerId: string;
  payer: {
    name: string;
    email?: string;
  };
  amount: number;
  currency: CurrencyCode;
  status: "succeeded" | "failed";
  createdAt: string;
};

export type Db = {
  usersById: Record<string, User>;
  sessionsByToken: Record<string, Session>;
  paymentLinksById: Record<string, PaymentLink>;
  paymentsById: Record<string, Payment>;
};

const DB_PATH = path.join(process.cwd(), "data", "db.json");
type DbWriteQueue = Promise<void>;
const queueKey = "__mord_demo_db_write_queue__";

function nowIso() {
  return new Date().toISOString();
}

async function ensureDbFile() {
  try {
    await fs.access(DB_PATH);
    return;
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    const empty: Db = {
      usersById: {},
      sessionsByToken: {},
      paymentLinksById: {},
      paymentsById: {},
    };
    await fs.writeFile(DB_PATH, JSON.stringify(empty, null, 2), "utf-8");
  }
}

export async function loadDb(): Promise<Db> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as Db;
}

async function persistDb(db: Db) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export async function updateDb(
  mutator: (db: Db) => void | Promise<void>
): Promise<Db> {
  const g = globalThis as unknown as Record<string, unknown>;
  const existing = (g[queueKey] as DbWriteQueue | undefined) ?? Promise.resolve();

  let nextResolve: () => void;
  const nextPromise = new Promise<void>((resolve) => {
    nextResolve = resolve;
  });

  g[queueKey] = existing.then(async () => {
    const db = await loadDb();
    await mutator(db);
    await persistDb(db);
  });

  await g[queueKey];
  nextResolve!();

  // return updated DB for convenience
  return loadDb();
}

export function createSlug(input: string) {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "payment"}-${Math.random().toString(16).slice(2, 8)}`;
}

export function publicSafeUser(user: User) {
  return {
    id: user.id,
    role: user.role,
    email: user.email,
    createdAt: user.createdAt,
    onboarded: user.onboarded,
    profile: user.profile,
    store: user.store,
    currency: user.currency,
    payouts: user.payouts,
  };
}

export function paymentLinkPublic(link: PaymentLink) {
  return {
    id: link.id,
    ownerId: link.ownerId,
    title: link.title,
    description: link.description,
    category: link.category,
    slug: link.slug,
    price: link.price,
    currency: link.currency,
    status: link.status,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await loadDb();
  const users = Object.values(db.usersById);
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(userId: string): Promise<User | null> {
  const db = await loadDb();
  return db.usersById[userId] ?? null;
}

export function createDefaultUser(opts: {
  role: UserRole;
  email: string;
  password: string;
  displayName: string;
  website?: string;
  productCategory: ProductCategory;
  country: CountryCode;
  currency: CurrencyCode;
}) {
  const userId = randomUUID();
  const createdAt = nowIso();
  return {
    id: userId,
    role: opts.role,
    email: opts.email,
    password: opts.password,
    createdAt,
    onboarded: false,
    profile: {
      displayName: opts.displayName,
      website: opts.website,
      productCategory: opts.productCategory,
      country: opts.country,
    },
    store: {
      storeName: opts.displayName,
    },
    currency: opts.currency,
    payouts: {
      connected: false,
    },
  } satisfies User;
}

