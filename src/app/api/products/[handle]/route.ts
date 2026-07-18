import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE!;
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN!;

const query = `
query getProductByHandle($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    handle
    vendor
    descriptionHtml
    productType
    tags
    status
    puffs: metafield(namespace: "custom", key: "puffs") { value }
    nicotine: metafield(namespace: "custom", key: "nicotine") { value }
    badge: metafield(namespace: "custom", key: "badge_text") { value }
    rating: metafield(namespace: "custom", key: "rating_value") { value }
    reviews: metafield(namespace: "custom", key: "reviews_count") { value }
    battery: metafield(namespace: "custom", key: "spec_battery") { value }
    shortDescription: metafield(namespace: "custom", key: "short_description") { value }
    specsTable: metafield(namespace: "custom", key: "specifications_table") { value }
    faqAccordion: metafield(namespace: "custom", key: "faq_accordion") { value }
    images(first: 10) {
      edges {
        node {
          url
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          price
          compareAtPrice
          availableForSale
          inventoryQuantity
        }
      }
    }
  }
}
`;

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ handle: string }> }
) {
  const { handle } = await props.params;

  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ADMIN_API_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { handle },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Shopify request failed: ${response.statusText}` },
        { status: 500 }
      );
    }

    const json = await response.json();
    const node = json?.data?.productByHandle;

    if (!node) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Determine category based on tags or productType
    let category = "vape";
    const tagsLower = node.tags.map((t: string) => t.toLowerCase());
    if (tagsLower.includes("juul")) {
      category = "juul";
    } else if (tagsLower.includes("disposable") || tagsLower.includes("disposables")) {
      category = "disposables";
    } else if (tagsLower.includes("e-juice") || tagsLower.includes("liquid") || tagsLower.includes("liquids") || tagsLower.includes("e-liquids")) {
      category = "e-liquids";
    } else if (tagsLower.includes("accessory") || tagsLower.includes("accessories") || tagsLower.includes("pod-system") || tagsLower.includes("pod system")) {
      category = "accessories";
    } else {
      const typeLower = node.productType?.toLowerCase();
      if (typeLower?.includes("juul")) category = "juul";
      else if (typeLower?.includes("disposable")) category = "disposables";
      else if (typeLower?.includes("liquid") || typeLower?.includes("juice")) category = "e-liquids";
      else if (typeLower?.includes("accessory") || typeLower?.includes("pod")) category = "accessories";
    }

    // Pricing & Availability
    const variants = node.variants?.edges?.map((edge: any) => edge.node) || [];
    const firstVariant = variants[0];
    const price = firstVariant ? parseFloat(firstVariant.price) : 0;
    const comparePrice = firstVariant && firstVariant.compareAtPrice ? parseFloat(firstVariant.compareAtPrice) : 0;
    const isSoldOut = variants.every((v: any) => !v.availableForSale || v.inventoryQuantity <= 0);

    // Section grouping
    let section = undefined;
    if (node.tags.includes("JUUL 2 Series") || node.tags.includes("juul2")) {
      section = "JUUL 2 Series";
    } else if (node.tags.includes("Disposables") || category === "disposables") {
      section = "Disposables";
    } else if (node.tags.includes("E-Liquids") || category === "e-liquids") {
      section = "E-Liquids";
    } else if (node.tags.includes("Pod Systems") || node.tags.includes("Pod System")) {
      section = "Pod Systems";
    } else if (node.tags.includes("Flash Sale") || node.tags.includes("sale")) {
      section = "Flash Sale";
    }

    // Image assets
    const images = node.images?.edges?.map((edge: any) => edge.node.url) || [];
    const image = images[0] || "/hero_vape.png";

    // Metafields parsing
    let specsTable = null;
    if (node.specsTable?.value) {
      try {
        specsTable = JSON.parse(node.specsTable.value);
      } catch (e) {
        specsTable = node.specsTable.value;
      }
    }

    let faqAccordion = null;
    if (node.faqAccordion?.value) {
      try {
        faqAccordion = JSON.parse(node.faqAccordion.value);
      } catch (e) {
        faqAccordion = node.faqAccordion.value;
      }
    }

function detectBrand(title: string, vendor: string): string {
  const titleLower = title.toLowerCase();
  
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
    { name: "Voopoo", keywords: ["voopoo"] },
    { name: "Uwell", keywords: ["uwell"] },
    { name: "Smok", keywords: ["smok"] },
    { name: "Tokyo", keywords: ["tokyo"] },
    { name: "Ruthless", keywords: ["ruthless"] },
    { name: "Vapetasia", keywords: ["vapetasia"] },
    { name: "Grand Vapes", keywords: ["grand vapes", "grand e-liquids"] },
  ];

  for (const b of brands) {
    if (b.keywords.some(kw => titleLower.includes(kw))) {
      return b.name;
    }
  }

  if (vendor && vendor.toLowerCase() !== "vapshop" && vendor.toLowerCase() !== "vape shop") {
    return vendor;
  }

  const firstWord = title.trim().split(/\s+/)[0];
  if (firstWord && firstWord.length > 2) {
    const cleaned = firstWord.replace(/[^a-zA-Z0-9]/g, "");
    if (cleaned) return cleaned;
  }

  return "Vape Shop";
}

function cleanProductTitle(title: string): string {
  let cleaned = title;
  if (cleaned.startsWith("Buy ") || cleaned.startsWith("buy ")) {
    cleaned = cleaned.substring(4);
  }
  cleaned = cleaned.replace(/Get\s+(.+?)\s+Free/gi, "+ $1 Bundle");
  cleaned = cleaned.replace(/Get\s+(.+?)\s+FREE/gi, "+ $1 Bundle");
  cleaned = cleaned.replace(/\s+Free\s*/gi, " ");
  return cleaned.trim();
}

    return NextResponse.json({
      id: node.id,
      name: cleanProductTitle(node.title),
      handle: node.handle,
      descriptionHtml: node.descriptionHtml,
      category,
      price,
      originalPrice: comparePrice > price ? comparePrice : undefined,
      rating: parseFloat(node.rating?.value || "4.8"),
      reviews: parseInt(node.reviews?.value || "125"),
      image,
      images,
      tag: node.badge?.value || (isSoldOut ? "Sold Out" : comparePrice > price ? "Sale" : undefined),
      tagColor: comparePrice > price ? "sale" : undefined,
      isPopular: node.tags.includes("Popular") || node.tags.includes("popular"),
      isSoldOut,
      puffs: node.puffs?.value || undefined,
      nicotine: node.nicotine?.value || undefined,
      battery: node.battery?.value || undefined,
      shortDescription: node.shortDescription?.value || undefined,
      specsTable,
      faqAccordion,
      variants: variants.map((v: any) => ({
        id: v.id,
        title: v.title,
        price: parseFloat(v.price),
        compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : undefined,
        availableForSale: v.availableForSale,
        inventoryQuantity: v.inventoryQuantity,
      })),
      section,
      brand: detectBrand(node.title, node.vendor),
    });
  } catch (error: any) {
    console.error("Error in GET product by handle:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
