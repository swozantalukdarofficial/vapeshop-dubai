/**
 * The single source of truth for which remote image hosts we will proxy.
 *
 * This used to be duplicated in `next.config.ts` (`images.remotePatterns`) and in
 * `smart-image.tsx` (`OPTIMIZED_HOSTS`), and the two had drifted — the component only
 * listed `cdn.shopify.com`, so images from the other configured hosts silently fell
 * back to an unoptimised `<img>`. Both now read from here.
 *
 * Anything not on this list is rendered as-is rather than proxied, which is what keeps
 * the proxy from becoming an open relay for arbitrary URLs (the theme customizer lets
 * merchants paste any URL they like).
 */
export const ALLOWED_IMAGE_HOSTS = [
  "cdn.shopify.com",
  "images.unsplash.com",
  "vapshopdubai.ae",
] as const;

/** Hosts allowed via a leading-wildcard match, e.g. `foo.shopify.com`. */
export const ALLOWED_IMAGE_HOST_SUFFIXES = [
  ".shopify.com",
  ".shipon.tech",
] as const;

export function isAllowedImageHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if ((ALLOWED_IMAGE_HOSTS as readonly string[]).includes(host)) return true;
  return (ALLOWED_IMAGE_HOST_SUFFIXES as readonly string[]).some((suffix) =>
    host.endsWith(suffix)
  );
}

/** True when `src` is a remote URL on an allowlisted host, so it can be proxied. */
export function isProxyableUrl(src: string): boolean {
  if (!src || src.startsWith("/") || src.startsWith("data:")) return false;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && isAllowedImageHost(url.hostname);
  } catch {
    return false;
  }
}
