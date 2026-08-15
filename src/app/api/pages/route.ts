import { NextResponse } from "next/server";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || "vap-shop-dubai.myshopify.com";
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

const storefrontPagesQuery = `
query getPages {
  pages(first: 50) {
    nodes {
      id
      title
      handle
      body
      bodySummary
    }
  }
}
`;

export async function GET() {
  try {
    const url = `https://${SHOPIFY_STORE}/api/2024-10/graphql.json`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: storefrontPagesQuery }),
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const json = await res.json();
      const nodes = json.data?.pages?.nodes || [];
      return NextResponse.json({ pages: nodes });
    }

    return NextResponse.json({ pages: [] });
  } catch (err: any) {
    return NextResponse.json({ pages: [] }, { status: 500 });
  }
}
