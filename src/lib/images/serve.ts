import { NextResponse } from "next/server";

import { isAllowedImageHost } from "./hosts";
import { unsealImageUrl } from "./token";

/**
 * Shared implementation for the image proxy routes.
 *
 * COST NOTE — read before changing the headers. Every image byte flows through this on
 * a cache miss, so the `Cache-Control` / `CDN-Cache-Control` pair is what keeps the
 * function from being invoked per image per visitor. Two rules follow:
 *   1. Never set a cookie on these responses — a `Set-Cookie` disables CDN caching.
 *   2. Never vary on a request header, which is why the format is pinned rather than
 *      negotiated through `Accept`.
 *
 * Next's router attaches `Vary: rsc, next-router-*` to every route-handler response and
 * that cannot be overridden from here (setting `Vary` appends a second header rather
 * than replacing it). It is harmless for this route: a browser loading an `<img>` sends
 * none of those headers, so every real image request resolves to the same cache variant.
 * Worth re-checking with `x-vercel-cache` on the real deployment all the same.
 */

// Mirrors `deviceSizes` + `imageSizes` in next.config.ts. Bounding the widths keeps the
// cache-key space to ~15 variants per image and stops anyone minting unlimited URLs.
export const ALLOWED_WIDTHS = new Set([
  16, 32, 48, 64, 96, 128, 256, 360, 480, 640, 750, 828, 1080, 1200,
]);

/** Used when a consumer requests `/i/<token>` with no width (e.g. a raw <img> tag). */
export const DEFAULT_WIDTH = 828;

const IMMUTABLE_CACHE = "public, max-age=31536000, s-maxage=31536000, immutable";
const UPSTREAM_TIMEOUT_MS = 10_000;

/** Shopify and Unsplash both resize for free via query params, so we don't pay to. */
function buildUpstreamUrl(sourceUrl: string, width: number): string {
  const url = new URL(sourceUrl);
  if (url.hostname.endsWith("shopify.com")) {
    url.searchParams.set("width", String(width));
  } else if (url.hostname === "images.unsplash.com") {
    url.searchParams.set("w", String(width));
    url.searchParams.set("fm", "webp");
  }
  return url.toString();
}

function upstreamError() {
  // Short cache on failures so a transient blip isn't pinned for a year.
  return new NextResponse("Upstream error", {
    status: 502,
    headers: { "Cache-Control": "public, max-age=60" },
  });
}

/** Token-addressed entry point, used by the `next/image` loader. */
export async function serveProxiedImage(token: string, width: number): Promise<NextResponse> {
  // A tampered token fails the GCM auth tag here. This is what keeps the route from
  // becoming an open proxy for arbitrary URLs.
  const sourceUrl = unsealImageUrl(token);
  if (!sourceUrl) {
    return new NextResponse("Not found", { status: 404 });
  }
  return serveProxiedImageUrl(sourceUrl, width);
}

/**
 * Alias-addressed entry point, for URLs resolved from the static catalog rather than
 * from a sealed token. The caller is responsible for having resolved `sourceUrl` from a
 * fixed allowlist — the host check below is still applied either way.
 */
export async function serveProxiedImageUrl(sourceUrl: string, width: number): Promise<NextResponse> {
  if (!ALLOWED_WIDTHS.has(width)) {
    return new NextResponse("Invalid width", { status: 400 });
  }

  // Defence in depth: re-check the host in case the allowlist has since been narrowed.
  let parsed: URL;
  try {
    parsed = new URL(sourceUrl);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  if (parsed.protocol !== "https:" || !isAllowedImageHost(parsed.hostname)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const upstream = await fetch(buildUpstreamUrl(sourceUrl, width), {
      headers: { Accept: "image/webp,image/avif,image/*,*/*;q=0.8" },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) return upstreamError();

    // Streamed, not buffered: flat memory and lower TTFB on a cache miss.
    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/webp",
        "Cache-Control": IMMUTABLE_CACHE,
        "CDN-Cache-Control": IMMUTABLE_CACHE,
        "Vercel-CDN-Cache-Control": IMMUTABLE_CACHE,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[image-proxy] fetch failed:", error);
    return upstreamError();
  }
}

/** Strips the cosmetic extension off the width segment: `640.webp` -> 640. */
export function parseWidth(raw: string): number {
  return parseInt(raw.replace(/\.(webp|jpg|jpeg|png|avif)$/i, ""), 10);
}
