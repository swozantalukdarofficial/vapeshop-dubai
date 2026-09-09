import { NextResponse } from "next/server";

import { toProxiedImage } from "@/lib/images/proxy";
import { rejectExternalRead } from "@/lib/security/same-origin";

const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_API_KEY;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;

export async function GET(request: Request) {
  const blocked = rejectExternalRead(request);
  if (blocked) return blocked;

  if (!SHOPIFY_STORE || !STOREFRONT_TOKEN) {
    return NextResponse.json({ error: "Missing Shopify credentials" }, { status: 500 });
  }

  const query = `
    query {
      collections(first: 250) {
        edges {
          node {
            handle
            image {
              url
            }
            products(first: 1) {
              nodes {
                featuredImage {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(`https://${SHOPIFY_STORE}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query }),
      // Was `revalidate: 0`, which meant every collection grid render hit the Shopify
      // Admin API and burned rate limit. Collection artwork changes rarely; a publish
      // calls `revalidatePath` anyway, so updates still appear promptly.
      next: { revalidate: 300 }
    });

    const json = await res.json();
    
    if (json.errors) {
      console.error("Storefront API error:", json.errors);
      return NextResponse.json({ error: "Storefront API error" }, { status: 500 });
    }

    const imageMap: Record<string, string> = {};
    const collections = json.data?.collections?.edges || [];
    
    collections.forEach(({ node }: any) => {
      const imgUrl = toProxiedImage(node.image?.url || node.products?.nodes?.[0]?.featuredImage?.url);
      if (node.handle && imgUrl) {
        imageMap[node.handle] = imgUrl;
      }
    });

    return NextResponse.json(imageMap);
  } catch (error) {
    console.error("Failed to fetch collection images:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
