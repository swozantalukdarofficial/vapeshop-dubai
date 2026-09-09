import { toProxiedImage } from "@/lib/images/proxy";

/**
 * Minimal server-side article fetch for `generateMetadata` and JSON-LD.
 *
 * Mirrors `getProductSummary`: the client route expands more, this returns only what
 * metadata needs so the server render stays cheap.
 */

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || "";
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const BLOG_HANDLE = "news";

export interface ArticleSummary {
  title: string;
  handle: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  author: string;
}

const storefrontQuery = `
query articleSummary($blogHandle: String!, $articleHandle: String!) {
  blogByHandle(handle: $blogHandle) {
    articleByHandle(handle: $articleHandle) {
      title
      handle
      excerpt
      excerptHtml
      contentHtml
      publishedAt
      authorV2 { name }
      image { url }
    }
  }
}
`;

/**
 * Admin fallback. The Admin API has no `blogByHandle(...).articleByHandle(...)`, so it
 * lists articles and matches on handle — the same approach `/api/articles` uses. Needed
 * because without a Storefront token the Storefront query above returns nothing.
 */
const adminQuery = `
query adminArticles {
  articles(first: 250, reverse: true) {
    nodes {
      title
      handle
      summary
      body
      publishedAt
      author { name }
      image { url }
    }
  }
}
`;

function firstParagraph(html: string, limit = 300): string {
  return html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, limit);
}

export async function getArticleSummary(handle: string): Promise<ArticleSummary | null> {
  if (!SHOPIFY_STORE || !handle) return null;
  if (!STOREFRONT_TOKEN) return fetchViaAdmin(handle);

  try {
    const res = await fetch(`https://${SHOPIFY_STORE}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: storefrontQuery,
        variables: { blogHandle: BLOG_HANDLE, articleHandle: handle },
      }),
      next: { revalidate: 600 },
    });
    if (!res.ok) return fetchViaAdmin(handle);

    const json = await res.json();
    const node = json?.data?.blogByHandle?.articleByHandle;
    if (!node?.title) return fetchViaAdmin(handle);

    return toSummary(node, handle);
  } catch (error) {
    console.error("[article-summary] fetch failed:", error);
    return null;
  }
}

function toSummary(node: any, fallbackHandle: string): ArticleSummary {
  return {
    title: node.title,
    handle: node.handle || fallbackHandle,
    excerpt:
      node.excerpt ||
      node.summary ||
      firstParagraph(node.excerptHtml || "") ||
      firstParagraph(node.contentHtml || node.body || ""),
    image: toProxiedImage(node.image?.url) || "/hero_vape.png",
    publishedAt: node.publishedAt || "",
    author: node.authorV2?.name || node.author?.name || "Vape Shop Dubai Editorial",
  };
}

async function fetchViaAdmin(handle: string): Promise<ArticleSummary | null> {
  if (!ADMIN_API_TOKEN) return null;
  try {
    const res = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ADMIN_API_TOKEN,
      },
      body: JSON.stringify({ query: adminQuery }),
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const nodes: any[] = json?.data?.articles?.nodes ?? [];
    const match = nodes.find((node) => node?.handle === handle);
    return match?.title ? toSummary(match, handle) : null;
  } catch (error) {
    console.error("[article-summary] admin fallback failed:", error);
    return null;
  }
}
