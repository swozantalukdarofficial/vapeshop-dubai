import { NextResponse } from "next/server";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || "vap-shop-dubai.myshopify.com";
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

const storefrontPageQuery = `
query getPage($handle: String!) {
  pageByHandle(handle: $handle) {
    id
    title
    handle
    body
    bodySummary
    seo {
      title
      description
    }
  }
}
`;

const adminPageQuery = `
query getPage($handle: String!) {
  pageByHandle(handle: $handle) {
    id
    title
    handle
    body
    bodySummary
    seo {
      title
      description
    }
  }
}
`;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    if (!handle) {
      return NextResponse.json({ error: "Page handle is required" }, { status: 400 });
    }

    // Handles to try (e.g., about-us, about, contact-us, contact, privacy-policy, terms-conditions, terms-of-service)
    const handlesToTry = [handle];
    if (handle === "about-us") handlesToTry.push("about");
    if (handle === "contact") handlesToTry.push("contact-us");
    if (handle === "contact-us") handlesToTry.push("contact");
    if (handle === "terms-conditions") handlesToTry.push("terms-of-service", "terms-and-conditions", "terms");
    if (handle === "shipping-delivery") handlesToTry.push("shipping-policy", "shipping", "delivery");

    // Try Storefront API first
    if (STOREFRONT_TOKEN) {
      for (const h of handlesToTry) {
        try {
          const url = `https://${SHOPIFY_STORE}/api/2024-10/graphql.json`;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
            },
            body: JSON.stringify({
              query: storefrontPageQuery,
              variables: { handle: h },
            }),
            next: { revalidate: 300 },
          });

          if (res.ok) {
            const json = await res.json();
            const node = json.data?.pageByHandle;
            if (node) {
              return NextResponse.json({
                id: node.id,
                title: node.title,
                handle: node.handle,
                bodyHtml: node.body || "",
                bodySummary: node.bodySummary || "",
                seoTitle: node.seo?.title || node.title,
                seoDescription: node.seo?.description || node.bodySummary,
              });
            }
          }
        } catch (e) {
          console.warn(`Storefront page fetch failed for handle ${h}:`, e);
        }
      }
    }

    // Fallback: Admin API
    if (ADMIN_TOKEN) {
      for (const h of handlesToTry) {
        try {
          const url = `https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": ADMIN_TOKEN,
            },
            body: JSON.stringify({
              query: adminPageQuery,
              variables: { handle: h },
            }),
            next: { revalidate: 300 },
          });

          if (res.ok) {
            const json = await res.json();
            const node = json.data?.pageByHandle;
            if (node) {
              return NextResponse.json({
                id: node.id,
                title: node.title,
                handle: node.handle,
                bodyHtml: node.body || "",
                bodySummary: node.bodySummary || "",
                seoTitle: node.seo?.title || node.title,
                seoDescription: node.seo?.description || node.bodySummary,
              });
            }
          }
        } catch (e) {
          console.warn(`Admin page fetch failed for handle ${h}:`, e);
        }
      }
    }

    return NextResponse.json({ error: "Page not found in Shopify" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 });
  }
}
