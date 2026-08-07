"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { HeroSection } from "@/components/sections/HeroSection";
import { Highlights } from "@/components/sections/Highlights";
import { Categories } from "@/components/sections/Categories";
import { ProductFeed } from "@/components/sections/ProductFeed";
import { AuthorizedDealers } from "@/components/sections/AuthorizedDealers";
import { FAQSection } from "@/components/sections/FAQSection";
import { WhyShopWithUs } from "@/components/sections/WhyShopWithUs";
import { WhatsAppContactSection } from "@/components/sections/WhatsAppContactSection";
import { AgeGate } from "@/components/sections/AgeGate";
import { getFAQSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";

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
      <main className="flex-grow space-y-8 sm:space-y-12 pb-20">
        <HeroSection />
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <Categories onCategorySelect={setActiveCategory} activeCategory={activeCategory} />
        </div>

        <div id="products-section" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <ProductFeed
            searchQuery={searchQuery}
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
          />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <AuthorizedDealers />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <WhatsAppContactSection />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <WhyShopWithUs />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <Highlights />
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
}
