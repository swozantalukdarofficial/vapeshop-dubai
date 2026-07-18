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
import { AgeGate } from "@/components/sections/AgeGate";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
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
