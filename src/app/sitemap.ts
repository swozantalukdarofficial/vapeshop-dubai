import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo-schemas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/collections/juul`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/collections/myle`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/collections/disposables`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/collections/e-liquids`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/collections/accessories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/shipping-delivery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const shopifyDomain = process.env.SHOPIFY_STORE || "vap-shop-dubai.myshopify.com";
    const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

    const res = await fetch(`https://${shopifyDomain}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({
        query: `
          query getSitemapProducts {
            products(first: 250) {
              nodes {
                handle
                updatedAt
              }
            }
          }
        `,
      }),
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const nodes = data?.data?.products?.nodes || [];

      productRoutes = nodes.map((p: any) => ({
        url: `${SITE_URL}/product/${p.handle}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Error generating dynamic sitemap from Shopify:", err);
  }

  return [...staticRoutes, ...productRoutes];
}
