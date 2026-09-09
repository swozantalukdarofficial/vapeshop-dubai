# Security Guidelines

## Credentials

- Secrets live in `.env` (gitignored). `.env.example` documents every key with no values.
- `SHOPIFY_ADMIN_API_TOKEN` and the AI provider keys are server-only and must never be
  referenced from a `"use client"` file. `NEXT_PUBLIC_FIREBASE_*` are browser-exposed by
  design — Firestore rules, not secrecy, are what protect that data.
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` must be set. Without it the code falls back to sending
  `SHOPIFY_API_KEY` in the Storefront header, Shopify rejects it, the error is swallowed,
  and the whole public storefront silently runs on the **Admin** API.
- `IMAGE_PROXY_SECRET` signs image-proxy tokens and must stay stable — rotating it changes
  every image URL, discarding the CDN cache and the URLs Google Images has indexed.

## Image proxy — hiding the Shopify CDN

Remote images are served from our own origin as `/i/<token>` so `cdn.shopify.com` never
appears as a resource host.

- Sealing happens **server-side at the data boundary** (`src/lib/images/proxy.ts`), so the
  CDN URL is absent from API responses too, not just the rendered HTML.
- Tokens are AES-256-GCM with an IV derived from the plaintext: opaque to clients, stable
  across deploys (required for caching and image indexing), and stateless.
- A tampered token fails the auth tag, which is what stops the route being an open proxy.
  Widths are restricted to a fixed list to bound the cache-key space.
- Client components can't seal (no secret in the browser), so static hardcoded imagery is
  referenced by alias via `src/lib/images/static-catalog.ts` → `/si/<alias>`. **Never
  import that catalog from a client component** — the URLs would ship in the bundle.
- Render images through `SmartImage`. A raw `<img>` bypasses the width-aware loader.

**Cost warning:** every image byte flows through a serverless function on a cache miss.
The `Cache-Control` / `CDN-Cache-Control` / `Vercel-CDN-Cache-Control` headers in
`src/lib/images/serve.ts` are what keep the CDN serving repeats without invoking it. Never
set a cookie on those responses (it disables CDN caching). After deploying, confirm a
second request returns `x-vercel-cache: HIT`.

## Access control on API routes

- Admin routes are guarded by the `src/proxy.ts` matcher **and** re-check `getSession()`
  in-handler, so narrowing the matcher can't silently expose them.
- Bulk data reads (`/api/products`, `/api/products/[handle]`, `/api/articles`,
  `/api/collections/images`) require a same-origin request. `robots.txt` already disallows
  `/api/`, so no crawler is affected; the effect is that `curl https://site/api/products`
  no longer returns the catalog.
- State-changing POSTs (`/api/chat`, `/api/checkout`, `/api/contact`, `/api/reviews`)
  require same-origin. This is a cheap filter on unsophisticated scripts, **not** a
  security boundary — any caller can set those headers, and a headless browser sends them
  for free. Real limits belong at the edge (Vercel Firewall), before a function runs.
- `/api/bust-cache` requires an admin session or `CACHE_BUST_SECRET`, and is POST-only.
- `/api/search` is intentionally public (autocomplete) but returns at most 10 slim
  results, requires a 2+ character query so it can't enumerate the catalog, and omits
  `variantId`.

## Checkout

- Prices are **never** read from the request body. The client sends variant IDs and
  quantities; those variants are verified against Shopify and Shopify prices them.
- There is deliberately no custom-line-item fallback. The previous one let the browser set
  `originalUnitPrice` and complete a real order at that price.
- If nothing reaches Shopify the route returns an error rather than a made-up order number.

## Uploads

- `/api/admin/upload` requires a session, sniffs the format from magic bytes (not the
  client-supplied `file.type`), and rejects SVG — same-origin SVG is a stored-XSS vector.
- Known gap: uploads write to `public/uploads`, which **does not persist on Vercel**. Move
  to Vercel Blob before relying on it.

## Headers

`next.config.ts` sets HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy` and `Cross-Origin-Opener-Policy` on all routes.

CSP currently ships as **`Content-Security-Policy-Report-Only`**. Collect violations before
switching to the enforcing header. Tightening `img-src` to `'self' data:` is what makes the
CDN hiding structural rather than best-effort. Removing `'unsafe-inline'` from `script-src`
requires per-request nonces generated in `src/proxy.ts`.

## What this does not do

Scraping cannot be prevented, only made expensive. A headless browser renders the page and
extracts the same data a user sees, defeating every client-side measure. The measures here
remove the cheap paths — a single unauthenticated GET returning the whole priced catalog,
and free reuse of the endpoints that cost money — and nothing more.
