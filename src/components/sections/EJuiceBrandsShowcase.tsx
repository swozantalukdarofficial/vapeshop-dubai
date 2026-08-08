"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Droplet, Layers, ShieldCheck, Award } from "lucide-react";

interface EJuiceBrand {
  id: string;
  name: string;
  tagline: string;
  tags: string[];
  description: string;
  popularLineup: string;
}

const EJUICE_BRANDS: EJuiceBrand[] = [
  {
    id: "pod-salt",
    name: "Pod Salt",
    tagline: "British Nicotine Salt Specialists & Hit Blends",
    tags: ["25mg / 50mg Salt Nic", "50/50 VG/PG Ratio", "Nexus Series"],
    description: "Pod Salt is an award-winning British e-liquid brand renowned for its smooth nicotine salt formulation. Delivers instant nicotine satisfaction with ultra-smooth throat hits.",
    popularLineup: "Pod Salt Core / Nexus / Fusion Series",
  },
  {
    id: "vgod",
    name: "VGOD",
    tagline: "USA Premium SaltNic & Signature Cubano Tobaccos",
    tags: ["Cubano Series", "LushIce Classic", "Made in USA"],
    description: "VGOD E-Liquids deliver high-potency flavor profiles and dense clouds. Famous for Cubano cigar tobacco, LushIce watermelon menthol, and Iced Mango Bomb salt formulations.",
    popularLineup: "VGOD SaltNic / TrickTank E-Liquids",
  },
  {
    id: "dr-vapes",
    name: "Dr Vapes",
    tagline: "Panther Series & Award-Winning Fruit Liquids",
    tags: ["Pink Panther", "Blue Panther", "30ml & 60ml Bottles"],
    description: "Dr Vapes UK creates iconic flavor blends like Pink Panther blackcurrant cotton candy and Blue Panther blue raspberry slush. Formulated for rich flavor saturation.",
    popularLineup: "Pink Panther / Black Panther / Gems Series",
  },
  {
    id: "nasty-juice",
    name: "Nasty Juice",
    tagline: "Low Mint Signature Aluminum Tin Liquids",
    tags: ["Asap Grape", "Slow Blow", "Low Mint Blast"],
    description: "Nasty Juice is globally celebrated for signature low-mint fruity e-liquids like Asap Grape, Slow Blow pineapple lemonade, and Bad Blood blackcurrant menthol.",
    popularLineup: "Nasty Salt / Nasty ModMate / 50ml Shortfills",
  },
  {
    id: "silvaper",
    name: "Silvaper",
    tagline: "Luxury Craft E-Liquids & Pure Flavor Extract",
    tags: ["Ultra Smooth", "Double Apple Shisha", "Premium Salt"],
    description: "Silvaper offers handcrafted e-liquids tailored for Middle Eastern vapers, featuring rich shisha double apple, icy grape mint, and sweet berry fruit infusions.",
    popularLineup: "Silvaper Salt Nic 30ml / Shisha Series",
  },
  {
    id: "vape-pink",
    name: "Vape Pink & Propaganda",
    tagline: "Gourmet Dessert & Candy Fruit E-Juice",
    tags: ["Swirl & Cookie", "Gourmet Blends", "Rich Vapor"],
    description: "Gourmet e-liquids crafted for flavor enthusiasts seeking sweet dessert pastries, fruit chews, and creamy vanilla ice cream vape juice.",
    popularLineup: "Vape Pink Cookie Butter / Sweet Surprise",
  },
];

export function EJuiceBrandsShowcase() {
  return (
    <div className="my-12 space-y-8">
      {/* Section Header */}
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary to-primary/10" />
        
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full">
            <Droplet className="w-3.5 h-3.5 text-primary" />
            <span>Premium E-Juice &amp; Nic Salt Directory</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-foreground tracking-tight leading-tight">
            Popular E-Juice &amp; Nicotine Salt Brands in Dubai
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-3xl">
            Explore authentic imported e-liquids across UAE. Compare nicotine strengths, VG/PG ratios, bottle capacities, and signature fruit, menthol &amp; tobacco flavors.
          </p>
        </div>
      </div>

      {/* Grid of E-Juice Brand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EJUICE_BRANDS.map((brand) => (
          <div
            key={brand.id}
            className="bg-card border border-border/70 hover:border-primary/50 rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between gap-5 transition-all duration-300 shadow-2xs hover:shadow-md group relative overflow-hidden"
          >
            {/* Top Row */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
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
                  href={`/collections/e-liquids?sub=${encodeURIComponent(brand.name)}`}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors shrink-0"
                >
                  <span>Shop</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tags */}
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

              {/* Description */}
              <p className="text-xs sm:text-sm text-foreground/80 font-normal leading-relaxed pt-1">
                {brand.description}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-3">
              <div className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate">
                <span className="font-bold text-foreground">Top Series: </span>
                <span className="text-foreground/90 font-semibold">{brand.popularLineup}</span>
              </div>

              <Link
                href={`/collections/e-liquids?sub=${encodeURIComponent(brand.name)}`}
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
