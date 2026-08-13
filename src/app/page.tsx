"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AgeGate } from "@/components/sections/AgeGate";
import { getFAQSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";

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

const HOME_FAQS = [
  {
    question: "Do you offer same-day vape delivery in Dubai?",
    answer: "Yes! We offer express 2-hour delivery across all Dubai areas including Marina, Downtown, Deira, and JLT, as well as same-day delivery across Abu Dhabi, Sharjah, Ajman, and UAE."
  },
  {
    question: "Are your vape devices and pods 100% authentic?",
    answer: "Yes, 100% authentic. All products come directly from authorized regional distributors with genuine verification codes on the packaging."
  },
  {
    question: "What payment methods are available?",
    answer: "We support Cash on Delivery (COD) and Card on Delivery for maximum convenience."
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const faqSchema = getFAQSchema(HOME_FAQS);
  const breadcrumbSchema = getBreadcrumbSchema([{ name: "Home", item: "/" }]);

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
        <HeroSection />
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 cv-auto">
          <Categories onCategorySelect={setActiveCategory} activeCategory={activeCategory} />
        </div>

        <div id="products-section" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 cv-auto">
          <ProductFeed
            searchQuery={searchQuery}
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
          />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 cv-auto">
          <AuthorizedDealers />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 cv-auto">
          <WhyShopWithUs />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 cv-auto">
          <FAQSection />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 cv-auto">
          <WhatsAppContactSection />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 cv-auto">
          <BlogSection />
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
}
