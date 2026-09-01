import { NextResponse } from "next/server";

const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_API_KEY;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;

export async function GET() {
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
      next: { revalidate: 0 } // No cache to allow instant updates
    });

    const json = await res.json();
    
    if (json.errors) {
      console.error("Storefront API error:", json.errors);
      return NextResponse.json({ error: "Storefront API error" }, { status: 500 });
    }

    const imageMap: Record<string, string> = {};
    const collections = json.data?.collections?.edges || [];
    
    collections.forEach(({ node }: any) => {
      const imgUrl = node.image?.url || node.products?.nodes?.[0]?.featuredImage?.url;
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
