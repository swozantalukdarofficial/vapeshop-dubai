const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_API_KEY;

const storefrontQuery = `
query {
  products(first: 250) {
    edges {
      node {
        id
        title
        handle
        productType
        vendor
        tags
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
              }
              compareAtPrice {
                amount
              }
              availableForSale
            }
          }
        }
      }
    }
  }
}
`;

const adminQuery = `
query {
  products(first: 250) {
    edges {
      node {
        id
        title
        handle
        productType
        vendor
        tags
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
              compareAtPrice
              availableForSale
            }
          }
        }
      }
    }
  }
}
`;

function detectBrand(title: string, vendor: string): string {
  const titleLower = (title || "").toLowerCase();
  const brands = [
    { name: "Al Fakher", keywords: ["al fakher", "alfakher", "crown bar"] },
    { name: "JUUL", keywords: ["juul"] },
    { name: "BECO", keywords: ["beco"] },
    { name: "MYLE", keywords: ["myle"] },
    { name: "Pod Salt", keywords: ["pod salt", "podsalt"] },
    { name: "Vaporesso", keywords: ["vaporesso"] },
    { name: "Tugboat", keywords: ["tugboat"] },
    { name: "Yuoto", keywords: ["yuoto"] },
    { name: "Nasty", keywords: ["nasty"] },
    { name: "Waka", keywords: ["waka"] },
    { name: "Elf Bar", keywords: ["elf bar", "elfbar"] },
    { name: "Lost Mary", keywords: ["lost mary"] },
    { name: "ISGO", keywords: ["isgo"] },
    { name: "Terea", keywords: ["terea"] },
    { name: "Heets", keywords: ["heets"] },
    { name: "Dr Vapes", keywords: ["dr vapes", "dr. vapes", "dr.vapes"] },
    { name: "Vozol", keywords: ["vozol"] },
    { name: "Oxva", keywords: ["oxva"] },
    { name: "Geekvape", keywords: ["geekvape", "geek vape"] },
    { name: "HQD", keywords: ["hqd"] },
    { name: "Maskking", keywords: ["maskking"] },
    { name: "Geek Bar", keywords: ["geek bar", "geekbar"] }
  ];

  for (const b of brands) {
    if (b.keywords.some((k) => titleLower.includes(k))) return b.name;
  }
  return vendor || "Vape Shop";
}

export interface LiveProductItem {
  id: string;
  name: string;
  handle: string;
  category: string;
  price: number;
  brand: string;
  isAvailable: boolean;
}

export async function fetchLiveWebsiteProducts(): Promise<LiveProductItem[]> {
  try {
    if (!SHOPIFY_STORE) return [];

    let nodes: any[] = [];

    if (STOREFRONT_TOKEN) {
      try {
        const url = `https://${SHOPIFY_STORE}/api/2024-10/graphql.json`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: storefrontQuery }),
          next: { revalidate: 60 },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.products?.edges) {
            nodes = json.data.products.edges.map((e: any) => e.node);
          }
        }
      } catch (err) {
        console.warn("Storefront fetch failed in helper:", err);
      }
    }

    if (nodes.length === 0 && ADMIN_API_TOKEN) {
      const url = `https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": ADMIN_API_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: adminQuery }),
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.products?.edges) {
          nodes = json.data.products.edges.map((e: any) => e.node);
        }
      }
    }

    return nodes.map((node) => {
      const firstVar = node.variants?.edges?.[0]?.node;
      const priceVal = typeof firstVar?.price === "object" ? firstVar?.price?.amount : firstVar?.price;
      const price = parseFloat(priceVal || "0");
      const isAvailable = node.variants?.edges?.some((v: any) => v.node?.availableForSale) ?? true;

      const typeLower = (node.productType || "").toLowerCase();
      const titleLower = (node.title || "").toLowerCase();

      let category = "accessories";
      if (typeLower.includes("juul") || titleLower.includes("juul")) category = "juul";
      else if (typeLower.includes("disposable") || titleLower.includes("disposable")) category = "disposables";
      else if (typeLower.includes("liquid") || typeLower.includes("juice") || titleLower.includes("salt")) category = "e-liquids";

      return {
        id: node.id,
        name: node.title,
        handle: node.handle,
        category,
        price,
        brand: detectBrand(node.title, node.vendor),
        isAvailable,
      };
    });
  } catch (err) {
    console.error("fetchLiveWebsiteProducts error:", err);
    return [];
  }
}
