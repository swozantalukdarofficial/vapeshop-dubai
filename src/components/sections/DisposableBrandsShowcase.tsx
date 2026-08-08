"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Layers } from "lucide-react";

interface BrandInfo {
  id: string;
  name: string;
  tagline: string;
  tags: string[];
  description: string;
  popularModel: string;
}

const DISPOSABLE_BRANDS: BrandInfo[] = [
  {
    id: "al-fakher",
    name: "Al Fakher",
    tagline: "Authentic Shisha Flavors & Massive Puffs",
    tags: ["Shisha Flavors", "Up to 60,000 Puffs", "Crown Bar Series"],
    description: "Al Fakher Crown Bar and E-Hose disposable vape devices bring traditional shisha-inspired flavors into a modern portable vape format. Known for bold taste profiles, rechargeable batteries, and massive puff counts.",
    popularModel: "Crown Bar 8000 / E-Hose X 60000",
  },
  {
    id: "vozol",
    name: "Vozol",
    tagline: "Smart Display & Advanced Vapor Tech",
    tags: ["Smart LED Screen", "Dual Mesh Coil", "Extended Battery"],
    description: "Vozol disposable vapes combine sleek futuristic styling with robust battery life and advanced dual mesh coil technology. Models feature smart digital displays and adjustable airflow for extended daily vaping.",
    popularModel: "Vozol Vista 20000 / Gear Power 20000",
  },
  {
    id: "tugboat",
    name: "Tugboat",
    tagline: "Dependable Performance & Everyday Comfort",
    tags: ["Mesh Coil", "Type-C Charging", "Lightweight Build"],
    description: "Tugboat disposable vape devices are engineered for practical performance and simple operation. Offering reliable flavor consistency, mesh coil systems, and lightweight designs for comfortable everyday carrying.",
    popularModel: "Tugboat T12000 / EVO 4500",
  },
  {
    id: "lost-mary",
    name: "Lost Mary",
    tagline: "Compact Ergonomics & Rich Fruit Profiles",
    tags: ["Compact Design", "Smooth Salt Nic", "Style Gradient"],
    description: "Lost Mary disposable vapes are celebrated for their compact ergonomic feel, stylish color gradient looks, and unique salt nicotine flavor blends. Delivers steady vapor output with precision mesh coils.",
    popularModel: "Lost Mary BC10000 / OS5000",
  },
  {
    id: "hqd",
    name: "HQD",
    tagline: "Ultra-Reliable Daily Vaping & Zero Upkeep",
    tags: ["Zero Maintenance", "Fruit & Mint", "Long Battery"],
    description: "HQD provides reliable disposable e-cigarettes popular across Dubai for daily vaping. Small, easy to use, and available in crisp fruit, tobacco, and icy mint formulations that require zero upkeep.",
    popularModel: "HQD Cuvie Slick 6000 / HBAR",
  },
  {
    id: "geek-bar",
    name: "Geek Bar",
    tagline: "Pulse Boost Mode & Full Screen Displays",
    tags: ["Pulse Boost Mode", "Full Curved Screen", "Instant Vapor"],
    description: "Geek Bar disposable vape products are designed for flavor-focused vapers seeking smooth airflow and modern device styling. Featuring dual-core processing and high puff counts with rich fruit and icy blends.",
    popularModel: "Geek Bar Pulse 15000 / Skyview",
  },
  {
    id: "elf-bar",
    name: "Elf Bar",
    tagline: "World-Renowned Flavor Consistency & Quality",
    tags: ["Global Favorite", "Smart Battery Screen", "Quaq Tech"],
    description: "Elf Bar disposables set industry standards for flavor delivery and draw smoothness. Built with advanced Quaq mesh coil tech and smart e-liquid/battery digital indicators for a premium hassle-free experience.",
    popularModel: "Elf Bar BC10000 / Ice King 40000",
  },
  {
    id: "maskking",
    name: "Maskking",
    tagline: "Premium Metallic Finish & Intense Flavor Output",
    tags: ["Metallic Shell", "Draw Activated", "Super Smooth"],
    description: "Maskking disposable vapes feature premium alloy construction and instant draw-activated heating. Beloved in Dubai for high-octane flavor density and sleek pocketable form factors.",
    popularModel: "Maskking Aroma 6000 / High Pro",
  },
];

export function DisposableBrandsShowcase() {
  return (
    <div className="my-12 space-y-8">
      
      {/* Section Header */}
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary to-primary/10" />
        
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Disposable Brand Guide &amp; Overview</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-foreground tracking-tight leading-tight">
            Popular Disposable Vape Brands in Dubai
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-3xl">
            Explore leading disposable vape manufacturers in the UAE. Compare flagship models, puff capacities, smart screen features, and signature nicotine salt flavor profiles.
          </p>
        </div>
      </div>

      {/* Grid of Balanced, Elegant Brand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DISPOSABLE_BRANDS.map((brand) => (
          <div
            key={brand.id}
            className="bg-card border border-border/70 hover:border-primary/50 rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between gap-5 transition-all duration-300 shadow-2xs hover:shadow-md group relative overflow-hidden"
          >
            {/* Top Section: Avatar, Brand Title & Tagline */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Brand Avatar Circle */}
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-serif font-black text-lg flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                    {brand.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {brand.name}
                    </h3>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-wider mt-0.5">
                      {brand.tagline}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/collections/disposable-vape?sub=${encodeURIComponent(brand.name)}`}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors shrink-0"
                >
                  <span>Shop</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tag Badges - Clean & Soft Pill Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {brand.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold uppercase tracking-wider bg-secondary/80 border border-border/50 text-secondary-foreground px-2.5 py-1 rounded-full shadow-2xs group-hover:border-primary/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description Paragraph - Clean, Readable, Soft Contrast */}
              <p className="text-xs sm:text-sm text-foreground/80 font-normal leading-relaxed pt-1">
                {brand.description}
              </p>
            </div>

            {/* Bottom Row: Top Models & Elegant Action Link */}
            <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-3">
              <div className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate">
                <span className="font-bold text-foreground">Top Models: </span>
                <span className="text-foreground/90 font-semibold">{brand.popularModel}</span>
              </div>

              <Link
                href={`/collections/disposable-vape?sub=${encodeURIComponent(brand.name)}`}
                className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all duration-300 shrink-0 shadow-2xs"
              >
                <span>Explore {brand.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
