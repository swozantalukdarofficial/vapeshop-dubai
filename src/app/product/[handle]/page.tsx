import type { Metadata } from "next";

import { getProductSchema } from "@/lib/seo-schemas";
import { getProductSummary } from "@/lib/shopify/product-summary";
import { SITE_URL } from "@/lib/seo-schemas";

import ProductDetailClient from "./ProductDetailClient";

/**
 * Server shell for the product page.
 *
 * The interactive UI stays a client component, but title/description/OG/canonical and
 * the Product JSON-LD are now produced on the server. They used to be set from
 * `useEffect` via `document.title`, which meant crawlers were served an empty shell —
 * this is the difference between a product page Google can rank and one it can't.
 */

export const revalidate = 600;

function plainText(html: string, limit: number): string {
  return html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, limit);
}

/**
 * The root layout applies `title.template = "%s | Vape Shop Dubai"`, and Shopify's own
 * `seo.title` often already ends with the same suffix. Strip it here so the rendered
 * title isn't "... | Vape Shop Dubai | Vape Shop Dubai".
 */
function stripBrandSuffix(title: string): string {
  return title.replace(/\s*\|\s*vape\s*shop\s*dubai\s*$/i, "").trim();
}

export async function generateMetadata(
  { params }: { params: Promise<{ handle: string }> }
): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductSummary(handle);

  if (!product) {
    return { title: "Product Not Found", robots: { index: false, follow: true } };
  }

  const title = stripBrandSuffix(product.seoTitle || product.name);
  const description =
    product.seoDescription ||
    plainText(product.descriptionHtml, 300) ||
    `Buy ${product.name} in Dubai with 2-hour express delivery across the UAE.`;
  const canonical = `${SITE_URL}/product/${product.handle}`;
  // OG consumers need absolute URLs; images are same-origin proxy paths.
  const ogImage = product.image.startsWith("/") ? `${SITE_URL}${product.image}` : product.image;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | Vape Shop Dubai`,
      description,
      url: canonical,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 1200, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Vape Shop Dubai`,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProductPage(
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const product = await getProductSummary(handle);

  const schema = product
    ? getProductSchema({
        id: product.productId,
        name: product.name,
        handle: product.handle,
        descriptionHtml: product.descriptionHtml,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        images: product.images,
        brand: product.brand,
        isSoldOut: product.isSoldOut,
      })
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          // Server-rendered so it's present in the initial HTML for rich results.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ProductDetailClient />
    </>
  );
}
