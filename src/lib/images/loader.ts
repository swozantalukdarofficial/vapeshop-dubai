/**
 * Custom `next/image` loader (wired up via `images.loaderFile` in next.config.ts).
 *
 * This file is bundled into the browser, so it deliberately holds no secret and does
 * no crypto. Sealing happens on the server — see `src/lib/images/proxy.ts` — so by the
 * time a URL reaches the client it is already an opaque `/i/<token>` path. All this
 * loader does is append the width the layout asked for.
 *
 * Configuring `loaderFile` replaces Next's built-in optimizer for *every* `next/image`
 * in the app, which is intentional twice over: it means bare `next/image` callers are
 * covered without editing them, and it avoids Vercel's per-source-image transform
 * billing (the proxy route asks Shopify's CDN to do the resize instead, for free).
 */

interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function shopifyProxyLoader({ src, width }: ImageLoaderParams): string {
  // Already sealed server-side: /i/<token> -> /i/<token>/<width>.webp
  if (src.startsWith("/i/")) {
    return `${src}/${width}.webp`;
  }

  // Local /public assets and any host we don't proxy are served unchanged. Without the
  // built-in optimizer there is nothing to resize them with, so this is a pass-through.
  return src;
}
