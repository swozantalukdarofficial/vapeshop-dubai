"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { AgeGate } from "@/components/sections/AgeGate";
import {
  SECTION_CONTAINER,
  TemplateSections,
} from "@/components/sections/SectionRenderer";
import { useResolvedTemplate } from "@/context/ThemeSettingsContext";
import { getFAQSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";
import type { FaqItem } from "@/components/sections/FAQSection";

const ProductFeed = dynamic(
  () => import("@/components/sections/ProductFeed").then((m) => ({ default: m.ProductFeed })),
  { ssr: false }
);
const CustomerReviewsSection = dynamic(
  () =>
    import("@/components/sections/CustomerReviewsSection").then((m) => ({
      default: m.CustomerReviewsSection,
    })),
  { ssr: false }
);

export default function Home() {
  const [searchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { instances, isOverride } = useResolvedTemplate("index");

  // Build the FAQ rich-results schema from whichever FAQ instances are on the
  // homepage, so editing a question keeps what Google indexes in sync.
  const faqSchema = useMemo(() => {
    const questions = instances
      .filter((i) => i.type === "faq" && i.enabled)
      .flatMap((i) => (i.settings.items as FaqItem[] | undefined) ?? [])
      .map(({ question, answer }) => ({ question, answer }));
    return getFAQSchema(questions);
  }, [instances]);

  const breadcrumbSchema = getBreadcrumbSchema([{ name: "Home", item: "/" }]);

  // Sections whose content is live commerce data rather than saved settings.
  const slots = {
    productFeed: (settings: Record<string, unknown>) => (
      <div id="products-section" className={SECTION_CONTAINER}>
        <ProductFeed
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
          settings={settings as never}
        />
      </div>
    ),
    customerReviews: (settings: Record<string, unknown>) => (
      <div className={SECTION_CONTAINER}>
        <CustomerReviewsSection
          collectionName="Vape Products"
          settings={settings as never}
        />
      </div>
    ),
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <AgeGate />

      <Navbar onCategorySelect={setActiveCategory} activeCategory={activeCategory} />

      <main className="flex-grow space-y-4 sm:space-y-6 pb-0">
        <TemplateSections
          instances={instances}
          isOverride={isOverride}
          context={{}}
          slots={slots}
          containerClassName={SECTION_CONTAINER}
        />
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
