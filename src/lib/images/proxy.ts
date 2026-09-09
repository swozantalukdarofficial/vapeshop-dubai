import { isProxyableUrl } from "./hosts";
import { isImageProxyConfigured, sealImageUrl } from "./token";

/**
 * Server-side: rewrites a remote image URL to an opaque same-origin path.
 *
 * Call this wherever image URLs cross from Shopify into anything the browser will see
 * — API responses, server-rendered props, JSON-LD. Doing it at the data boundary rather
 * than in the markup means the Shopify URL never appears in our JSON either, so reading
 * `/api/products` no longer hands over the CDN paths.
 *
 * Anything not on the host allowlist is returned untouched: the theme customizer accepts
 * arbitrary pasted URLs, and refusing to proxy them is what stops this being an open relay.
 */
export function toProxiedImage(src: string | null | undefined): string {
  if (!src) return "";
  if (!isProxyableUrl(src)) return src;
  // Without a secret we can't seal; fall back to the original URL so images still render.
  if (!isImageProxyConfigured()) return src;

  try {
    return `/i/${sealImageUrl(src)}`;
  } catch {
    return src;
  }
}

/** Convenience for the many places that map over an array of image URLs. */
export function toProxiedImages(sources: (string | null | undefined)[]): string[] {
  return sources.map((src) => toProxiedImage(src)).filter((src): src is string => Boolean(src));
}

/**
 * Recursively seals every proxyable image URL inside a settings object.
 *
 * The theme customizer stores merchant-pasted URLs at many different depths, so rather
 * than enumerate every field this walks the structure and rewrites any string that
 * parses as a URL on an allowlisted host. Non-image strings are left alone because
 * `toProxiedImage` only rewrites hosts from the allowlist.
 */
export function sealImageUrlsDeep<T>(value: T): T {
  if (typeof value === "string") {
    return toProxiedImage(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sealImageUrlsDeep(item)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, inner] of Object.entries(value as Record<string, unknown>)) {
      out[key] = sealImageUrlsDeep(inner);
    }
    return out as unknown as T;
  }
  return value;
}
