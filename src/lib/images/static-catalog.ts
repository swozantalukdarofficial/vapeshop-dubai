/**
 * Server-only map of stable aliases to the remote URLs of static decorative imagery.
 *
 * Why this exists: some of these images are referenced from *client* components as
 * hardcoded constants (the flavour wheel). A client component can't seal a URL — the
 * proxy secret is server-side — and hardcoding the Shopify URL would leak the CDN into
 * the browser bundle. So the client refers to an opaque alias (`/si/mango`) and this
 * map is resolved server-side by `src/app/si/[key]`.
 *
 * IMPORTANT: never import this module from a `"use client"` file, or the URLs end up in
 * the client bundle and the whole exercise is pointless. Aliases are the public contract.
 *
 * Keys are a fixed allowlist, so this route can't be pointed at an arbitrary host.
 */
const SHOPIFY_FILES = "https://cdn.shopify.com/s/files/1/0684/3488/6727/files";

export const STATIC_IMAGE_CATALOG: Record<string, string> = {
  mango: `${SHOPIFY_FILES}/Mango_Vape_shop_dubai_result.jpg?v=1788119690`,
  strawberry: `${SHOPIFY_FILES}/Strawberry_vape_flavor.jpg?v=1788120037`,
  cheesecake: `${SHOPIFY_FILES}/cheesecake_vape_shop_dubai.jpg?v=1788119897`,
  watermelon: `${SHOPIFY_FILES}/Watermelon-_vape_shop_dubai_result.jpg?v=1788120706`,
  mint: `${SHOPIFY_FILES}/mint_-_vape_shop_dubai_result.jpg?v=1788120314`,
  peach: `${SHOPIFY_FILES}/Peach_flavour_showcase_image_2K_202608302024_result.jpg?v=1788120619`,
  grape: `${SHOPIFY_FILES}/Grape_flavor_vape_shop_dubai.jpg?v=1788119965`,
  "blue-razz": `${SHOPIFY_FILES}/Blue_Razz__vape_shop_dubai_result.jpg?v=1788120799`,
  pineapple: `${SHOPIFY_FILES}/Pineapple_vape_flavor_thumbnail___202608310229_result.jpg?v=1788121829`,
  lychee: `${SHOPIFY_FILES}/lychee_vape_flavor_2K_202608310233_result.jpg?v=1788122094`,
  berry: `${SHOPIFY_FILES}/berry_vape_flavor_image_202608310237.jpg?v=1788122292`,
  vanilla: `${SHOPIFY_FILES}/Vanilla_vape_flavor_thumbnail_sh__202608310241_result.jpg?v=1788122579`,

  // Category slider artwork, referenced from `src/lib/theme/sections.ts`, whose defaults
  // end up in the public client bundle.
  "slider-myle": `${SHOPIFY_FILES}/myle_slider.webp?v=1786640992`,
  "slider-disposable": `${SHOPIFY_FILES}/disposable_slider.webp?v=1786640994`,
  "slider-pod-kits": `${SHOPIFY_FILES}/pod_kits_slider.webp?v=1786640996`,
  "slider-e-liquid": `${SHOPIFY_FILES}/e_liquid_slider.webp?v=1786640998`,
  "slider-juul-1": `${SHOPIFY_FILES}/juul_1_slider.webp?v=1786641000`,
  "slider-juul-2": `${SHOPIFY_FILES}/juul_2_slider.webp?v=1786641001`,
};

export function resolveStaticImage(key: string): string | null {
  return STATIC_IMAGE_CATALOG[key] ?? null;
}
