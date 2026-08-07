"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Award, Flame, ChevronRight } from "lucide-react";

interface BrandInfo {
  id: string;
  name: string;
  tagline: string;
  tags: string[];
  description: string;
  popularModel: string;
  gradient: string;
}

const DISPOSABLE_BRANDS: BrandInfo[] = [
  {
    id: "al-fakher",
    name: "Al Fakher",
    tagline: "Authentic Shisha Flavors & Massive Puffs",
    tags: ["Shisha Flavors", "Up to 60,000 Puffs", "Crown Bar Series"],
    description: "Al Fakher Crown Bar and E-Hose disposable vape devices bring traditional shisha-inspired flavors into a modern portable vape device format. Known for bold taste profiles, rechargeable batteries, and high puff counts.",
    popularModel: "Crown Bar 8000 / E-Hose X 60000",
    gradient: "from-amber-500/10 via-primary/5 to-transparent",
  },
  {
    id: "vozol",
    name: "Vozol",
    tagline: "Smart Display & Advanced Vapor Technology",
    tags: ["Smart LED Screen", "Dual Mesh Coil", "Extended Battery"],
    description: "Vozol disposable vapes combine sleek futuristic styling with robust battery life and advanced dual mesh coil technology. Many models feature smart digital displays and adjustable airflow for extended daily vaping.",
    popularModel: "Vozol Vista 20000 / Gear Power 20000",
    gradient: "from-blue-500/10 via-primary/5 to-transparent",
  },
  {
    id: "tugboat",
    name: "Tugboat",
    tagline: "Dependable Performance & Everyday Comfort",
    tags: ["Mesh Coil", "Type-C Charging", "Lightweight Build"],
    description: "Tugboat disposable vape devices are engineered for practical performance and simple operation. Offering reliable flavor consistency, mesh coil systems, and lightweight designs for comfortable everyday carrying.",
    popularModel: "Tugboat T12000 / EVO 4500",
    gradient: "from-red-500/10 via-primary/5 to-transparent",
  },
  {
    id: "lost-mary",
    name: "Lost Mary",
    tagline: "Compact Ergonomics & Rich Fruit Profiles",
    tags: ["Compact Design", "Smooth Salt Nic", "Style Gradient"],
    description: "Lost Mary disposable vapes are celebrated for their compact ergonomic feel, stylish color gradient looks, and unique salt nicotine flavor blends. Delivers steady vapor output with precision mesh coils.",
    popularModel: "Lost Mary BC10000 / OS5000",
    gradient: "from-purple-500/10 via-primary/5 to-transparent",
  },
  {
    id: "hqd",
    name: "HQD",
    tagline: "Ultra-Reliable Daily Vaping & Zero Upkeep",
    tags: ["Zero Maintenance", "Fruit & Mint", "Long Battery"],
    description: "HQD provides reliable disposable e-cigarettes popular across Dubai for daily vaping. Small, easy to use, and available in crisp fruit, tobacco, and icy mint formulations that require zero upkeep.",
    popularModel: "HQD Cuvie Slick 6000 / HBAR",
    gradient: "from-emerald-500/10 via-primary/5 to-transparent",
  },
  {
    id: "geek-bar",
    name: "Geek Bar",
    tagline: "Pulse Boost Mode & Full Screen Displays",
    tags: ["Pulse Boost Mode", "Full Curved Screen", "Instant Vapor"],
    description: "Geek Bar disposable vape products are designed for flavor-focused vapers seeking smooth airflow and modern device styling. Featuring dual-core processing and high puff counts with rich fruit and icy blends.",
    popularModel: "Geek Bar Pulse 15000 / Skyview",
    gradient: "from-orange-500/10 via-primary/5 to-transparent",
  },
  {
    id: "elf-bar",
    name: "Elf Bar",
    tagline: "World-Renowned Flavor Consistency & Quality",
    tags: ["Global Favorite", "Smart Battery Screen", "Quaq Tech"],
    description: "Elf Bar disposables set industry standards for flavor delivery and draw smoothness. Built with advanced Quaq mesh coil tech and smart e-liquid/battery digital indicators for a premium hassle-free experience.",
    popularModel: "Elf Bar BC10000 / Ice King 40000",
    gradient: "from-teal-500/10 via-primary/5 to-transparent",
  },
  {
    id: "maskking",
    name: "Maskking",
    tagline: "Premium Metallic Finish & Intense Flavor Output",
    tags: ["Metallic Shell", "Draw Activated", "Super Smooth"],
    description: "Maskking disposable vapes feature premium alloy construction and instant draw-activated heating. Beloved in Dubai for high-octane flavor density and sleek pocketable form factors.",
    popularModel: "Maskking Aroma 6000 / High Pro",
    gradient: "from-rose-500/10 via-primary/5 to-transparent",
  },
];

export function DisposableBrandsShowcase() {
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <div className="my-16 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full inline-block" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              BRAND GUIDE &amp; OVERVIEW
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-foreground tracking-tight">
            Popular Disposable Vape Brands in Dubai
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl font-medium leading-relaxed">
            Explore leading disposable vape manufacturers, their flagship technologies, puff capacities, and signature flavor profiles.
          </p>
        </div>
      </div>

      {/* Grid of Luxury Brand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DISPOSABLE_BRANDS.map((brand) => (
          <div
            key={brand.id}
            className={`bg-gradient-to-br ${brand.gradient} bg-card border border-border/50 hover:border-primary/50 rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-5 transition-all duration-300 shadow-2xs hover:shadow-md group`}
          >
            {/* Top row: Brand Title & Badges */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif font-black text-lg group-hover:scale-105 transition-transform">
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-black text-foreground group-hover:text-primary transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      {brand.tagline}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/collections/disposable-vape?sub=${encodeURIComponent(brand.name)}`}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-black text-primary hover:underline"
                >
                  <span>Shop</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {brand.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-extrabold uppercase tracking-wider bg-background/80 border border-border/40 text-foreground/80 px-2.5 py-1 rounded-full shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed pt-1">
                {brand.description}
              </p>
            </div>

            {/* Bottom Row: Popular Model & Action Link */}
            <div className="pt-4 border-t border-border/30 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-muted-foreground">
                <span className="font-bold text-foreground">Top Models: </span>
                <span>{brand.popularModel}</span>
              </div>

              <Link
                href={`/collections/disposable-vape?sub=${encodeURIComponent(brand.name)}`}
                className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:text-primary/80 transition-colors"
              >
                <span>Explore {brand.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
