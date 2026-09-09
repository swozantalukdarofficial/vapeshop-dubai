import { NextResponse, type NextRequest } from "next/server";

import { toProxiedImage } from "@/lib/images/proxy";

/**
 * Autocomplete search.
 *
 * Replaces the Navbar's old `fetch("/api/products")`, which pulled all ~210 products with
 * every field (~216 KB) on *every page load* just to filter them in the browser. That was
 * both the site's single worst scraping surface — one unauthenticated GET returned the
 * whole priced catalog including buyable variant IDs — and a large tax on every visitor.
 *
 * Deliberately narrow:
 *   - requires a real query, so it can't be used to enumerate the catalog
 *   - caps results, so paging through it is slow and obvious
 *   - returns display fields only. No `variantId`, no metafields, no collections.
 */

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 10;

interface SearchResult {
  name: string;
  handle: string;
  image: string;
  price: number;
  originalPrice?: number;
  brand: string;
  category: string;
  isSoldOut: boolean;
}

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || "";
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

/** Shopify does the filtering, so we never pull the whole catalog to search it. */
const storefrontSearchQuery = `
query searchProducts($query: String!, $first: Int!) {
  products(first: $first, query: $query) {
    edges {
      node {
        title
        handle
        vendor
        productType
        featuredImage { url }
        variants(first: 1) {
          edges { node { price { amount } compareAtPrice { amount } availableForSale } }
        }
      }
    }
  }
}
`;

const adminSearchQuery = `
query searchProducts($query: String!, $first: Int!) {
  products(first: $first, query: $query) {
    edges {
      node {
        title
        handle
        vendor
        productType
        status
        featuredImage { url }
        variants(first: 1) {
          edges { node { price compareAtPrice availableForSale } }
        }
      }
    }
  }
}
`;

function mapResults(edges: any[]): SearchResult[] {
  return edges
    .map((edge) => edge?.node)
    .filter((node) => node?.handle && (!node.status || String(node.status).toUpperCase() === "ACTIVE"))
    .map((node) => {
      const variant = node.variants?.edges?.[0]?.node;
      const rawPrice = typeof variant?.price === "object" ? variant?.price?.amount : variant?.price;
      const rawCompare =
        typeof variant?.compareAtPrice === "object" ? variant?.compareAtPrice?.amount : variant?.compareAtPrice;
      const price = parseFloat(rawPrice || "0");
      const compareAt = rawCompare ? parseFloat(rawCompare) : 0;
      return {
        name: String(node.title || "").replace(/^Buy\s+/i, "").trim(),
        handle: node.handle,
        image: toProxiedImage(node.featuredImage?.url) || "/hero_vape.png",
        price,
        originalPrice: compareAt > price ? compareAt : undefined,
        brand: node.vendor || "",
        category: node.productType || "",
        isSoldOut: variant ? !variant.availableForSale : false,
      };
    });
}

export async function GET(request: NextRequest) {
  const term = (request.nextUrl.searchParams.get("q") || "").trim();

  if (term.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ results: [] });
  }

  if (!SHOPIFY_STORE) {
    console.error("Search unavailable: SHOPIFY_STORE is not configured.");
    return NextResponse.json({ results: [] });
  }

  // Strip Shopify query-syntax characters so a caller can't craft their own filter
  // (e.g. `status:draft`) through this endpoint.
  const safeTerm = term.replace(/[:()"*~\\]/g, " ").slice(0, 80);
  const shopifyQuery = `title:*${safeTerm}* OR vendor:*${safeTerm}* OR tag:*${safeTerm}*`;

  try {
    if (STOREFRONT_TOKEN) {
      const res = await fetch(`https://${SHOPIFY_STORE}/api/2024-10/graphql.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: storefrontSearchQuery,
          variables: { query: shopifyQuery, first: MAX_RESULTS },
        }),
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const json = await res.json();
        const edges = json.data?.products?.edges;
        if (edges) {
          return NextResponse.json({ results: mapResults(edges).slice(0, MAX_RESULTS) });
        }
      }
    }

    if (ADMIN_API_TOKEN) {
      const res = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": ADMIN_API_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: adminSearchQuery,
          variables: { query: shopifyQuery, first: MAX_RESULTS },
        }),
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const json = await res.json();
        const edges = json.data?.products?.edges ?? [];
        return NextResponse.json({ results: mapResults(edges).slice(0, MAX_RESULTS) });
      }
    }

    return NextResponse.json({ results: [] });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
