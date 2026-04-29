import { notFound } from "next/navigation";

import { loadDb } from "@/lib/demo-db";
import { formatMoney } from "@/lib/currency";
import PaymentCheckoutForm from "@/components/payment/PaymentCheckoutForm";

export default async function PaymentLinkPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const db = await loadDb();

  const link = Object.values(db.paymentLinksById).find((l) => l.slug === slug);
  if (!link || link.status !== "active") notFound();

  const owner = db.usersById[link.ownerId];
  if (!owner) notFound();

  const storeName = owner.store.storeName;
  const logoDataUrl = owner.store.logoDataUrl;
  const bannerDataUrl = owner.store.bannerDataUrl;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {bannerDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerDataUrl} alt={`${storeName} banner`} className="h-28 w-full object-cover" />
          ) : null}
          <div className="flex items-start gap-4 p-6">
            {logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoDataUrl} alt={`${storeName} logo`} className="h-14 w-14 rounded-xl object-cover border border-border/60" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-muted/20 font-semibold">
                {storeName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <div className="text-sm text-muted-foreground">Pay with card</div>
              <h1 className="truncate text-2xl font-semibold">{link.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                for {storeName}
              </p>
              <div className="mt-2 text-lg font-semibold">
                {formatMoney(link.price, link.currency)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Checkout</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your payment will be recorded in this demo and credited to the merchant&apos;s payouts in their local currency.
            </p>
            <div className="mt-4 rounded-xl bg-muted/20 p-4 text-sm">
              <div className="font-medium">{link.title}</div>
              {link.description ? (
                <div className="mt-1 text-muted-foreground">{link.description}</div>
              ) : null}
              <div className="mt-3 text-muted-foreground">
                Shareable payment link: <span className="font-mono">/p/{link.slug}</span>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8">
            <PaymentCheckoutForm
              slug={link.slug}
              title={link.title}
              description={link.description}
              amount={link.price}
              currency={link.currency}
              storeName={storeName}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

