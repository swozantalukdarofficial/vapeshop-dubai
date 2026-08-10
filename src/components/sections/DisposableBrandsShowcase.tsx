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

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-primary tracking-tight leading-tight">
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
          <Link
            key={brand.id}
            href={`/collections/disposable-vape?sub=${encodeURIComponent(brand.name)}`}
            className="group relative bg-card border-2 border-primary/20 hover:border-primary/80 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
          >
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/15 opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Top Section: Avatar & Title layout like product card */}
            <div className="relative z-10 flex items-start gap-4 sm:gap-5">
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-white dark:bg-background border-2 border-primary/10 group-hover:border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl text-3xl sm:text-4xl font-serif font-black text-primary">
                {brand.name.charAt(0)}
              </div>

              <div className="space-y-1.5 flex-1">
                <h3 className="text-xl sm:text-2xl font-serif font-black text-primary transition-colors tracking-tight leading-snug">
                  {brand.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-foreground/80 font-bold uppercase tracking-widest leading-relaxed">
                  {brand.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-2 hidden sm:flex">
                  {brand.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Action Like Product Card */}
            <div className="relative z-10 mt-6 pt-5 border-t border-border/40 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors mb-0.5">
                  Top Models
                </span>
                <span className="text-xs text-foreground/90 font-bold truncate max-w-[130px] sm:max-w-[180px]">
                  {brand.popularModel}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 bg-primary text-white hover:bg-gold-shimmer px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md group-hover:scale-105 shrink-0">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
