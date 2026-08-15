"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AgeGate } from "@/components/sections/AgeGate";
import { useThemeSettings } from "@/context/ThemeSettingsContext";
import { getFAQSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";
import type { SectionId } from "@/lib/theme/types";

/* ── Below-fold lazy-loaded sections (code-split into separate chunks) ── */
const Categories = dynamic(
  () => import("@/components/sections/Categories").then((m) => ({ default: m.Categories })),
  { ssr: false }
);
const ProductFeed = dynamic(
  () => import("@/components/sections/ProductFeed").then((m) => ({ default: m.ProductFeed })),
  { ssr: false }
);
const AuthorizedDealers = dynamic(
  () => import("@/components/sections/AuthorizedDealers").then((m) => ({ default: m.AuthorizedDealers })),
  { ssr: false }
);
const WhatsAppContactSection = dynamic(
  () => import("@/components/sections/WhatsAppContactSection").then((m) => ({ default: m.WhatsAppContactSection })),
  { ssr: false }
);
const WhyShopWithUs = dynamic(
  () => import("@/components/sections/WhyShopWithUs").then((m) => ({ default: m.WhyShopWithUs })),
  { ssr: false }
);
const FAQSection = dynamic(
  () => import("@/components/sections/FAQSection").then((m) => ({ default: m.FAQSection })),
  { ssr: false }
);
const BlogSection = dynamic(
  () => import("@/components/sections/BlogSection").then((m) => ({ default: m.BlogSection })),
  { ssr: false }
);

/** Standard page gutter shared by every section below the hero. */
const CONTAINER = "max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 cv-auto";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const settings = useThemeSettings();

  // The FAQ rich-results schema is generated from the same content the FAQ
  // section renders, so editing a question in the admin keeps the structured
  // data Google reads in sync automatically.
  const faqSchema = getFAQSchema(
    settings.sections.faq.items.map(({ question, answer }) => ({ question, answer }))
  );
  const breadcrumbSchema = getBreadcrumbSchema([{ name: "Home", item: "/" }]);

  /* Order and visibility both come from the theme customizer. */
  const renderSection = (id: SectionId): React.ReactNode => {
    switch (id) {
      case "hero":
        return <HeroSection />;

      case "categories":
        return (
          <div className={CONTAINER}>
            <Categories onCategorySelect={setActiveCategory} activeCategory={activeCategory} />
          </div>
        );

      case "products":
        return (
          <div id="products-section" className={CONTAINER}>
            <ProductFeed
              searchQuery={searchQuery}
              activeCategory={activeCategory}
              onCategorySelect={setActiveCategory}
            />
          </div>
        );

      case "brands":
        return (
          <div className={CONTAINER}>
            <AuthorizedDealers />
          </div>
        );

      case "whyShop":
        return (
          <div className={CONTAINER}>
            <WhyShopWithUs />
          </div>
        );

      case "faq":
        return (
          <div className={CONTAINER}>
            <FAQSection />
          </div>
        );

      case "whatsapp":
        return (
          <div className={CONTAINER}>
            <WhatsAppContactSection />
          </div>
        );

      case "blog":
        return (
          <div className={CONTAINER}>
            <BlogSection />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      {/* Home JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Age Gate */}
      <AgeGate />

      {/* Navbar */}
      <Navbar
        onCategorySelect={setActiveCategory}
        activeCategory={activeCategory}
      />

      {/* Main content */}
      <main className="flex-grow space-y-4 sm:space-y-6 pb-0">
        {settings.sectionOrder
          .filter((id) => settings.sections[id]?.enabled)
          .map((id) => (
            // data-section-id lets the customizer scroll the preview to the
            // section the merchant is editing.
            <div key={id} data-section-id={id} className="scroll-mt-24">
              {renderSection(id)}
            </div>
          ))}
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
}
