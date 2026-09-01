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
    bannerImage: metafield(namespace: "custom", key: "banner_image") { value }
    eyebrowText: metafield(namespace: "custom", key: "eyebrow") { value }
    customHeading: metafield(namespace: "custom", key: "custom_heading") { value }
    flavorsWheelMeta: metafield(namespace: "custom", key: "flavors_wheel") { value }
    faqsMeta: metafield(namespace: "custom", key: "faqs") { value }
    seoGuideMeta: metafield(namespace: "custom", key: "seo_guide") { value }
    sectionSettingsMeta: metafield(namespace: "custom", key: "section_settings") { value }
    combinedDetailsMeta: metafield(namespace: "custom", key: "collection_details") { value }
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
    bannerImage: metafield(namespace: "custom", key: "banner_image") { value }
    eyebrowText: metafield(namespace: "custom", key: "eyebrow") { value }
    customHeading: metafield(namespace: "custom", key: "custom_heading") { value }
    flavorsWheelMeta: metafield(namespace: "custom", key: "flavors_wheel") { value }
    faqsMeta: metafield(namespace: "custom", key: "faqs") { value }
    seoGuideMeta: metafield(namespace: "custom", key: "seo_guide") { value }
    sectionSettingsMeta: metafield(namespace: "custom", key: "section_settings") { value }
    combinedDetailsMeta: metafield(namespace: "custom", key: "collection_details") { value }
  }
}
`;

interface CollectionMeta {
  title: string;
  description: string;
  descriptionHtml: string;
  image: { url: string; altText: string; width: number; height: number } | null;
  seo: { title: string; description: string } | null;
  bannerImage?: string | null;
  eyebrowText?: string | null;
  customHeading?: string | null;
  flavorsWheelJson?: any | null;
  faqsJson?: any | null;
  seoGuideHtml?: string | null;
  sectionSettingsJson?: any | null;
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
        cache: "no-store",
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
      cache: "no-store",
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

/**
 * Super-easy All-in-One Combined Parser:
 * Allows a non-coder merchant to put EVERYTHING into 1 single multi-line text field (`custom.collection_details`) or standard Description box!
 */
function parseCombinedBlock(text: string) {
  if (!text || !text.trim()) return null;

  let eyebrow: string | null = null;
  let heading: string | null = null;
  let flavors: any[] | null = null;
  let faqs: any[] | null = null;
  let guideHtml: string | null = null;

  // Sheet format: TAG = ... or EYEBROW = ... or Eyebrow: ...
  const tagMatch = text.match(/(?:TAG|EYEBROW)\s*[:=]\s*([^\n]+)/i);
  if (tagMatch) eyebrow = tagMatch[1].trim();

  // Sheet format: TITLE = ... or HEADING = ... or Title: ...
  const titleMatch = text.match(/(?:TITLE|HEADING)\s*[:=]\s*([^\n]+)/i);
  if (titleMatch) heading = titleMatch[1].trim();

  // Sheet format: FLAVORS = Mango, Strawberry, Mint or Flavors: ...
  const flavorsMatch = text.match(/(?:FLAVORS|FLAVOURS|FLAVOR_LIST)\s*[:=]\s*([^\n]+)/i);
  if (flavorsMatch) {
    flavors = parseFlavorsSimpleText(flavorsMatch[1].trim());
  }

  // Sheet format: GUIDE = ... or CONTENT = ...
  const guideMatch = text.match(/(?:GUIDE|CONTENT|DESCRIPTION)\s*[:=]\s*([\s\S]+?)(?=\n(?:Q:|TITLE=|TAG=|FLAVORS=)|$)/i);
  if (guideMatch) guideHtml = guideMatch[1].trim();

  // FAQs block if Q: & A: present
  if (text.includes("Q:") || text.includes("q:")) {
    faqs = parseFaqsSimpleText(text);
  }

  return { eyebrow, heading, flavors, faqs, guideHtml };
}

function parseFlavorsSimpleText(val: unknown) {
  if (!val) return null;
  let str = "";
  if (typeof val === "string") str = val;
  else if (typeof val === "object") return val;

  if (!str.trim()) return null;

  // Try JSON parse first
  if (str.trim().startsWith("[") || str.trim().startsWith("{")) {
    try {
      return JSON.parse(str);
    } catch {
      // Fall through to plain text parsing
    }
  }

  // Non-coder friendly: comma-separated or newline-separated list
  const names = str.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
  if (names.length === 0) return null;

  const defaultImages = [
    "https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1595855759920-86582396756a?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=200&h=200&fit=crop",
  ];
  const defaultColors = ["#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#06b6d4"];

  return names.map((name, idx) => ({
    name,
    query: name.split("&")[0].trim(),
    color: defaultColors[idx % defaultColors.length],
    img: defaultImages[idx % defaultImages.length],
  }));
}

function parseFaqsSimpleText(val: unknown) {
  if (!val) return null;
  let str = "";
  if (typeof val === "string") str = val;
  else if (typeof val === "object") return val;

  if (!str.trim()) return null;

  if (str.trim().startsWith("[") || str.trim().startsWith("{")) {
    try {
      return JSON.parse(str);
    } catch {
      // Fall through
    }
  }

  // Non-coder friendly: Q&A plain text format
  const blocks = str.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const faqs: { question: string; answer: string }[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim());
    let q = "";
    let a = "";
    for (const line of lines) {
      if (line.toLowerCase().startsWith("q:") || line.toLowerCase().startsWith("question:")) {
        q = line.replace(/^(q:|question:)/i, "").trim();
      } else if (line.toLowerCase().startsWith("a:") || line.toLowerCase().startsWith("answer:")) {
        a = line.replace(/^(a:|answer:)/i, "").trim();
      } else if (!q) {
        q = line;
      } else {
        a += (a ? " " : "") + line;
      }
    }
    if (q) {
      faqs.push({
        question: q,
        answer: a || "100% authentic products with 2-hour express delivery across Dubai & UAE.",
      });
    }
  }

  return faqs.length > 0 ? faqs : null;
}

function parseJsonSafe(val: unknown) {
  if (!val) return null;
  if (typeof val === "object") return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  }
  return null;
}

function mapCollection(col: Record<string, unknown>): CollectionMeta {
  const image = col.image as Record<string, unknown> | null;
  const seo = col.seo as Record<string, unknown> | null;

  const bannerImage = (col.bannerImage as { value?: string })?.value || null;
  const eyebrowText = (col.eyebrowText as { value?: string })?.value || null;
  const customHeading = (col.customHeading as { value?: string })?.value || null;
  const flavorsWheelMeta = (col.flavorsWheelMeta as { value?: string })?.value || null;
  const faqsMeta = (col.faqsMeta as { value?: string })?.value || null;
  const seoGuideMeta = (col.seoGuideMeta as { value?: string })?.value || null;
  const sectionSettingsMeta = (col.sectionSettingsMeta as { value?: string })?.value || null;
  const combinedDetailsMeta = (col.combinedDetailsMeta as { value?: string })?.value || null;

  // Smart combined block parsing for 1-field easy setup
  const combinedParsed = parseCombinedBlock(combinedDetailsMeta || (col.description as string) || "");

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
    bannerImage,
    eyebrowText: eyebrowText || combinedParsed?.eyebrow || null,
    customHeading: customHeading || combinedParsed?.heading || null,
    flavorsWheelJson: parseFlavorsSimpleText(flavorsWheelMeta) || combinedParsed?.flavors || null,
    faqsJson: parseFaqsSimpleText(faqsMeta) || combinedParsed?.faqs || null,
    seoGuideHtml: seoGuideMeta || combinedParsed?.guideHtml || null,
    sectionSettingsJson: parseJsonSafe(sectionSettingsMeta),
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
