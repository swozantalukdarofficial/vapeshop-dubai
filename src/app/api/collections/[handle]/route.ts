import { NextResponse } from "next/server";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE!;
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const STOREFRONT_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_API_KEY;

/* ── Storefront API query ─────────────────────────── */
const storefrontCollectionQuery = `
query CollectionByHandle($handle: String!) {
  collectionByHandle(handle: $handle) {
    id
    title
    description
    descriptionHtml
    image {
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
  }
}
`;

/* ── Admin API query (fallback) ───────────────────── */
const adminCollectionQuery = `
query CollectionByHandle($handle: String!) {
  collectionByHandle(handle: $handle) {
    id
    title
    description
    descriptionHtml
    image {
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
  }
}
`;

interface CollectionMeta {
  title: string;
  description: string;
  descriptionHtml: string;
  image: { url: string; altText: string; width: number; height: number } | null;
  seo: { title: string; description: string } | null;
}

async function fetchCollection(handle: string): Promise<CollectionMeta | null> {
  if (!SHOPIFY_STORE) {
    throw new Error("SHOPIFY_STORE is not configured");
  }

  // Try Storefront API first
  if (STOREFRONT_TOKEN) {
    try {
      const url = `https://${SHOPIFY_STORE}/api/2024-10/graphql.json`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: storefrontCollectionQuery,
          variables: { handle },
        }),
        next: { revalidate: 60 },
      });

      if (response.ok) {
        const json = await response.json();
        const col = json.data?.collectionByHandle;
        if (col) return mapCollection(col);
      }
    } catch (err) {
      console.warn("Storefront collection fetch failed, trying Admin:", err);
    }
  }

  // Fallback: Admin API
  if (ADMIN_API_TOKEN) {
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": ADMIN_API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: adminCollectionQuery,
        variables: { handle },
      }),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Shopify Admin API error: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.errors) {
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    const col = json.data?.collectionByHandle;
    if (col) return mapCollection(col);
  }

  return null;
}

function mapCollection(col: Record<string, unknown>): CollectionMeta {
  const image = col.image as Record<string, unknown> | null;
  const seo = col.seo as Record<string, unknown> | null;

  return {
    title: (col.title as string) || "",
    description: (col.description as string) || "",
    descriptionHtml: (col.descriptionHtml as string) || "",
    image: image
      ? {
          url: (image.url as string) || "",
          altText: (image.altText as string) || "",
          width: (image.width as number) || 0,
          height: (image.height as number) || 0,
        }
      : null,
    seo: seo
      ? {
          title: (seo.title as string) || "",
          description: (seo.description as string) || "",
        }
      : null,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;

    if (!handle) {
      return NextResponse.json(
        { error: "Collection handle is required" },
        { status: 400 }
      );
    }

    const collection = await fetchCollection(handle);

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Collection API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
