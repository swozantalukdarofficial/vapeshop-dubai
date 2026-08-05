import { NextResponse } from "next/server";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || "vap-shop-dubai.myshopify.com";
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

const storefrontArticlesQuery = `
query getArticles {
  articles(first: 50, sortKey: PUBLISHED_AT, reverse: true) {
    nodes {
      id
      title
      handle
      excerpt
      excerptHtml
      contentHtml
      publishedAt
      authorV2 {
        name
      }
      image {
        url
        altText
        width
        height
      }
      blog {
        handle
        title
      }
      seo {
        title
        description
      }
    }
  }
}
`;

const adminArticlesQuery = `
query getArticles {
  articles(first: 50, reverse: true) {
    nodes {
      id
      title
      handle
      excerpt
      excerptHtml
      contentHtml
      publishedAt
      author {
        name
      }
      image {
        url
        altText
        width
        height
      }
      blog {
        handle
        title
      }
      seo {
        title
        description
      }
    }
  }
}
`;

export interface ShopifyArticle {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  excerptHtml: string;
  contentHtml: string;
  publishedAt: string;
  author: string;
  image: string;
  blogHandle: string;
  blogTitle: string;
  seoTitle?: string;
  seoDescription?: string;
}

export async function GET() {
  try {
    let articles: ShopifyArticle[] = [];

    // Try Storefront API first
    if (STOREFRONT_TOKEN) {
      try {
        const url = `https://${SHOPIFY_STORE}/api/2024-10/graphql.json`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
          },
          body: JSON.stringify({ query: storefrontArticlesQuery }),
          next: { revalidate: 300 },
        });

        if (res.ok) {
          const json = await res.json();
          const nodes = json.data?.articles?.nodes || [];
          if (nodes.length > 0) {
            articles = nodes.map((node: any) => ({
              id: node.id,
              title: node.title,
              handle: node.handle,
              excerpt: node.excerpt || node.excerptHtml?.replace(/<[^>]+>/g, "").slice(0, 160) || "",
              excerptHtml: node.excerptHtml || "",
              contentHtml: node.contentHtml || "",
              publishedAt: node.publishedAt,
              author: node.authorV2?.name || "Vape Shop Dubai Editorial",
              image: node.image?.url || "/hero_vape.png",
              blogHandle: node.blog?.handle || "news",
              blogTitle: node.blog?.title || "News & Vaping Guides",
              seoTitle: node.seo?.title || node.title,
              seoDescription: node.seo?.description || node.excerpt,
            }));
          }
        }
      } catch (e) {
        console.warn("Storefront articles fetch error:", e);
      }
    }

    // Try Admin API if storefront returned empty
    if (articles.length === 0 && ADMIN_TOKEN) {
      try {
        const url = `https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": ADMIN_TOKEN,
          },
          body: JSON.stringify({ query: adminArticlesQuery }),
          next: { revalidate: 300 },
        });

        if (res.ok) {
          const json = await res.json();
          const nodes = json.data?.articles?.nodes || [];
          if (nodes.length > 0) {
            articles = nodes.map((node: any) => ({
              id: node.id,
              title: node.title,
              handle: node.handle,
              excerpt: node.excerpt || node.excerptHtml?.replace(/<[^>]+>/g, "").slice(0, 160) || "",
              excerptHtml: node.excerptHtml || "",
              contentHtml: node.contentHtml || "",
              publishedAt: node.publishedAt,
              author: node.author?.name || "Vape Shop Dubai Editorial",
              image: node.image?.url || "/hero_vape.png",
              blogHandle: node.blog?.handle || "news",
              blogTitle: node.blog?.title || "News & Vaping Guides",
              seoTitle: node.seo?.title || node.title,
              seoDescription: node.seo?.description || node.excerpt,
            }));
          }
        }
      } catch (e) {
        console.warn("Admin articles fetch error:", e);
      }
    }

    return NextResponse.json({ articles });
  } catch (error: any) {
    console.error("Articles API error:", error?.message || error);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}
