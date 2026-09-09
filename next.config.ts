import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Shipped in report-only mode first: this app has inline JSON-LD, GSAP, three.js and a
 * theme customizer that renders merchant-supplied URLs, so an enforcing policy written
 * blind would break the storefront. Watch the violation reports, then switch the header
 * name to `Content-Security-Policy`.
 *
 * `'unsafe-inline'` in script-src is a placeholder. Removing it needs per-request nonces
 * generated in `src/proxy.ts`, which is a larger change — see the plan.
 *
 * Once the image proxy lands, tighten `img-src` to `'self' data:`; that is what makes the
 * CDN hiding structural instead of best-effort.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://cdn.shopify.com https://*.shopify.com https://images.unsplash.com https://*.shipon.tech",
  // Firebase Auth + Firestore, which the admin and the reviews widget both talk to.
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  {
    key: "Content-Security-Policy-Report-Only",
    value: CSP_DIRECTIVES,
  },
  {
    // Only meaningful over HTTPS; harmless locally.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Belt-and-braces alongside `frame-ancestors` for older browsers.
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  images: {
    // All remote images are served through `/i/<token>` by the custom loader below,
    // so Next's own optimizer (and its remote-host allowlist) is bypassed entirely.
    // The host allowlist that actually matters now lives in `src/lib/images/hosts.ts`.
    loader: "custom",
    loaderFile: "./src/lib/images/loader.ts",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.shopify.com" },
      { protocol: "https", hostname: "*.shipon.tech" },
      { protocol: "https", hostname: "vapshopdubai.ae" },
    ],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {},
  transpilePackages: ["firebase-admin", "jwks-rsa", "jose"],
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
