import { toProxiedImage, toProxiedImages } from "@/lib/images/proxy";

/**
 * Minimal server-side product fetch, used for `generateMetadata` and for seeding the
 * product page's initial HTML.
 *
 * Deliberately separate from `/api/products/[handle]`, which expands ~10 metafields and
 * metaobjects for the interactive UI. Metadata only needs title/description/image/price,
 * and a small dedicated query keeps the server render fast and the blast radius small.
 */

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || "";
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export interface ProductSummary {
  name: string;
  handle: string;
  descriptionHtml: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  isSoldOut: boolean;
  brand: string;
  productId: string;
}

const storefrontQuery = `
query productSummary($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    handle
    vendor
    descriptionHtml
    seo { title description }
    images(first: 5) { edges { node { url } } }
    variants(first: 1) {
      edges { node { price { amount } compareAtPrice { amount } availableForSale } }
    }
  }
}
`;

const adminQuery = `
query productSummary($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    handle
    vendor
    status
    descriptionHtml
    seo { title description }
    images(first: 5) { edges { node { url } } }
    variants(first: 1) {
      edges { node { price compareAtPrice availableForSale } }
    }
  }
}
`;

async function runQuery(query: string, handle: string, isAdmin: boolean) {
  const url = isAdmin
    ? `https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`
    : `https://${SHOPIFY_STORE}/api/2024-10/graphql.json`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (isAdmin) headers["X-Shopify-Access-Token"] = ADMIN_API_TOKEN as string;
  else headers["X-Shopify-Storefront-Access-Token"] = STOREFRONT_TOKEN as string;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables: { handle } }),
    // Long enough to keep pages static between publishes, short enough that a price
    // change shows up the same day.
    next: { revalidate: 600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.productByHandle ?? null;
}

export async function getProductSummary(handle: string): Promise<ProductSummary | null> {
  if (!SHOPIFY_STORE || !handle) return null;

  let node: any = null;
  try {
    if (STOREFRONT_TOKEN) node = await runQuery(storefrontQuery, handle, false);
    if (!node && ADMIN_API_TOKEN) node = await runQuery(adminQuery, handle, true);
  } catch (error) {
    console.error("[product-summary] fetch failed:", error);
    return null;
  }

  if (!node) return null;
  // Never surface draft/archived products publicly (the Admin path can return them).
  if (node.status && String(node.status).toUpperCase() !== "ACTIVE") return null;

  const variant = node.variants?.edges?.[0]?.node;
  const rawPrice = typeof variant?.price === "object" ? variant?.price?.amount : variant?.price;
  const rawCompare =
    typeof variant?.compareAtPrice === "object" ? variant?.compareAtPrice?.amount : variant?.compareAtPrice;
  const price = parseFloat(rawPrice || "0");
  const compareAt = rawCompare ? parseFloat(rawCompare) : 0;

  const images = toProxiedImages(node.images?.edges?.map((edge: any) => edge?.node?.url) || []);

  return {
    name: String(node.title || "").replace(/^Buy\s+/i, "").trim(),
    handle: node.handle,
    descriptionHtml: node.descriptionHtml || "",
    seoTitle: node.seo?.title || "",
    seoDescription: node.seo?.description || "",
    image: images[0] || toProxiedImage(node.images?.edges?.[0]?.node?.url) || "/hero_vape.png",
    images,
    price,
    originalPrice: compareAt > price ? compareAt : undefined,
    isSoldOut: variant ? !variant.availableForSale : false,
    brand: node.vendor || "Vape Shop Dubai",
    productId: node.id || "",
  };
}
