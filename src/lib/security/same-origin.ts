import { NextResponse } from "next/server";

/**
 * Rejects cross-origin and non-browser POSTs to our own endpoints.
 *
 * What this buys: a `curl` or `requests` script that doesn't bother setting headers is
 * turned away, which removes most casual abuse of the endpoints that cost money
 * (`/api/chat`) or create records (`/api/contact`, `/api/reviews`, `/api/checkout`).
 *
 * What it does NOT buy: any determined caller can set `Origin` and `Sec-Fetch-Site`
 * themselves, and a headless browser sends the right ones for free. This is a cheap
 * filter on the easy 90%, not a security boundary — the real limits belong at the edge
 * (Vercel Firewall) where they apply before a function is invoked.
 *
 * Deliberately GET-safe: crawlers only issue GETs, so applying this to POST alone means
 * it can never affect SEO.
 */
export function isSameOriginRequest(request: Request): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site");

  // Modern browsers send this and it can't be set by page JS.
  if (secFetchSite) {
    return secFetchSite === "same-origin" || secFetchSite === "none";
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) {
    // No Origin at all: an older browser or a bare script. Treat as untrusted.
    return false;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Returns a 403 when the request didn't come from our own pages, else null. */
export function rejectCrossOrigin(request: Request): NextResponse | null {
  if (isSameOriginRequest(request)) return null;
  return NextResponse.json(
    { error: "This endpoint is only available from the site itself." },
    { status: 403 }
  );
}

/**
 * Same-origin check for GET data endpoints, which need to be more forgiving than the
 * POST one: browsers don't send `Origin` on a same-origin GET, so `Referer` is accepted
 * as a third signal.
 *
 * Safe for SEO because `robots.txt` already disallows `/api/`, so no crawler fetches
 * these — only our own pages do. The effect is that `curl https://site/api/products`
 * stops returning the catalog while the site itself is unaffected.
 */
export function isSameOriginRead(request: Request): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite) {
    return secFetchSite === "same-origin" || secFetchSite === "none";
  }

  const host = request.headers.get("host");
  if (!host) return false;

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host === host) return true;
    } catch {
      return false;
    }
  }

  // Older browsers: no Sec-Fetch-Site and no Origin on a same-origin GET.
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  return false;
}

/** Returns a 403 for a data GET that didn't originate from our own pages, else null. */
export function rejectExternalRead(request: Request): NextResponse | null {
  if (isSameOriginRead(request)) return null;
  return NextResponse.json(
    { error: "This endpoint is only available from the site itself." },
    { status: 403 }
  );
}
