import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const legacy = path.match(/^\/dashboard\/payment-links\/checkout\/([^/]+)\/?$/);
  if (legacy?.[1]) {
    return NextResponse.redirect(new URL(`/checkout/${decodeURIComponent(legacy[1])}`, request.url));
  }
  const products = path.match(/^\/dashboard\/products\/checkout\/([^/]+)\/?$/);
  if (products?.[1]) {
    return NextResponse.redirect(new URL(`/checkout/${decodeURIComponent(products[1])}`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/payment-links/checkout/:path*", "/dashboard/products/checkout/:path*"],
};
