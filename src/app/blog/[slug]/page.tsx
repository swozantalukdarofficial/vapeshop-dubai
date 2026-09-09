import type { Metadata } from "next";

import { SITE_URL } from "@/lib/seo-schemas";
import { getArticleSummary } from "@/lib/shopify/article-summary";

import BlogPostClient from "./BlogPostClient";

/**
 * Server shell for a blog post — supplies the metadata and Article JSON-LD that the
 * client component could not, since metadata has to be produced on the server to reach
 * a crawler.
 */

export const revalidate = 600;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleSummary(slug);

  if (!article) {
    return { title: "Article Not Found", robots: { index: false, follow: true } };
  }

  // The root layout's title template appends "| Vape Shop Dubai" already.
  const title = article.title;
  const canonical = `${SITE_URL}/blog/${article.handle}`;
  const ogImage = article.image.startsWith("/") ? `${SITE_URL}${article.image}` : article.image;

  return {
    title,
    description: article.excerpt,
    alternates: { canonical },
    openGraph: {
      title: `${title} | Vape Shop Dubai`,
      description: article.excerpt,
      url: canonical,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      authors: article.author ? [article.author] : undefined,
      images: [{ url: ogImage, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Vape Shop Dubai`,
      description: article.excerpt,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await getArticleSummary(slug);

  const schema = article
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${article.handle}#article`,
        headline: article.title,
        description: article.excerpt,
        image: article.image.startsWith("/") ? `${SITE_URL}${article.image}` : article.image,
        datePublished: article.publishedAt || undefined,
        author: { "@type": "Person", name: article.author || "Vape Shop Dubai Editorial" },
        publisher: { "@type": "Organization", name: "Vape Shop Dubai", "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${article.handle}` },
      }
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <BlogPostClient />
    </>
  );
}
