"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, Award, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthorizedDealersProps {
  onBrandSelect?: (brand: string) => void;
  onFlavorSelect?: (flavor: string) => void;
}

const BRANDS_DATA = [
  { name: "JUUL", image: "/juul_device.png" },
  { name: "MYLE", image: "/vape_kit.png" },
  { name: "GeekVape", image: "/vape_kit.png" },
  { name: "Uwell", image: "/vape_kit.png" },
  { name: "Vaporesso", image: "/vape_kit.png" },
  { name: "VooPoo", image: "/vape_kit.png" },
  { name: "Smok", image: "/vape_kit.png" },
  { name: "Oxva", image: "/vape_kit.png" },
  { name: "Elf Bar", image: "/lost_mary.png" },
  { name: "Lost Mary", image: "/lost_mary.png" },
  { name: "Tugboat", image: "/lost_mary.png" },
  { name: "SKE Crystal", image: "/lost_mary.png" },
  { name: "Pod Salt", image: "/premium_liquid.png" },
  { name: "Nasty Juice", image: "/premium_liquid.png" },
  { name: "IVG", image: "/premium_liquid.png" },
  { name: "Al Fakher", image: "/premium_liquid.png" },
];

const FLAVORS = [
  { 
    label: "Cigarette & Tobacco", 
    emoji: "🚬", 
    color: "from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10", 
    shadow: "hover:shadow-amber-500/10 dark:hover:shadow-amber-500/5", 
    border: "hover:border-amber-500/30" 
  },
  { 
    label: "Sweet & Candy", 
    emoji: "🍬", 
    color: "from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/10", 
    shadow: "hover:shadow-pink-500/10 dark:hover:shadow-pink-500/5", 
    border: "hover:border-pink-500/30" 
  },
  { 
    label: "Mint & Menthol", 
    emoji: "❄️", 
    color: "from-cyan-50/50 to-teal-50/50 dark:from-cyan-950/20 dark:to-cyan-950/10", 
    shadow: "hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5", 
    border: "hover:border-cyan-500/30" 
  },
  { 
    label: "Fruity & Berry", 
    emoji: "🍓", 
    color: "from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/10", 
    shadow: "hover:shadow-red-500/10 dark:hover:shadow-red-500/5", 
    border: "hover:border-red-500/30" 
  },
  { 
    label: "Citrus & Sour", 
    emoji: "🍋", 
    color: "from-yellow-50/50 to-lime-50/50 dark:from-yellow-950/20 dark:to-lime-950/10", 
    shadow: "hover:shadow-yellow-500/10 dark:hover:shadow-yellow-500/5", 
    border: "hover:border-yellow-500/30" 
  },
  { 
    label: "Beverages & Soda", 
    emoji: "🥤", 
    color: "from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/10", 
    shadow: "hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5", 
    border: "hover:border-blue-500/30" 
  },
  { 
    label: "Bakery & Dessert", 
    emoji: "🍰", 
    color: "from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/10", 
    shadow: "hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5", 
    border: "hover:border-orange-500/30" 
  },
  { 
    label: "Energy Drinks", 
    emoji: "⚡", 
    color: "from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/10", 
    shadow: "hover:shadow-green-500/10 dark:hover:shadow-green-500/5", 
    border: "hover:border-green-500/30" 
  },
];

const BADGES = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    desc: "Every product ships with official manufacturer holograms and QR scratch-code verification.",
  },
  {
    icon: CheckCircle2,
    title: "Verified UAE Importer",
    desc: "We are an authorized direct importer — no third-party re-sellers, no counterfeit risk.",
  },
  {
    icon: Award,
    title: "Warranty Guaranteed",
    desc: "Dead-on-arrival exchange within 24 hours. Our commitment to your satisfaction.",
  },
  {
    icon: Zap,
    title: "3-Hour Express",
    desc: "Order before 6 PM for same-day delivery in Dubai. 7 days a week, no minimum order.",
  },
];

export const AuthorizedDealers: React.FC<AuthorizedDealersProps> = ({
  onBrandSelect,
  onFlavorSelect,
}) => {
  const router = useRouter();

  const handleBrandClick = (brand: string) => {
    if (onBrandSelect) {
      onBrandSelect(brand);
    } else {
      router.push(`/collections/all?brand=${encodeURIComponent(brand)}`);
    }
  };

  const handleFlavorClick = (flavorLabel: string) => {
    if (onFlavorSelect) {
      onFlavorSelect(flavorLabel);
    } else {
      let query = flavorLabel;
      if (flavorLabel.includes("Cigarette")) query = "Tobacco";
      else if (flavorLabel.includes("Sweet")) query = "Candy";
      else if (flavorLabel.includes("Mint")) query = "Mint";
      else if (flavorLabel.includes("Fruity")) query = "Fruit";
      else if (flavorLabel.includes("Citrus")) query = "Citrus";
      else if (flavorLabel.includes("Beverages")) query = "Soda";
      else if (flavorLabel.includes("Bakery")) query = "Dessert";
      else if (flavorLabel.includes("Energy")) query = "Energy";
      
      router.push(`/collections/all?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* ── Shop by Brands — Beautiful Grid ── */}
      <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 sm:p-12 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 relative overflow-hidden">
        {/* Decorative gold shimmer strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border/5 relative">
          {/* Spacer for desktop to keep title perfectly centered */}
          <div className="hidden sm:block w-32" />

          {/* Centered Title */}
          <div className="text-center flex flex-col items-center flex-1">
            <span className="text-[9px] font-bold tracking-[0.25em] text-primary uppercase mb-1">
              Trusted Brands
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground tracking-wide">
              Shop by Brands
            </h2>
            {/* Premium Divider */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-primary/65" />
              <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
              <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-primary/65" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center sm:justify-end gap-2.5 w-full sm:w-32">
            <button 
              onClick={() => router.push("/shop")}
              className="text-[10px] sm:text-xs font-bold text-muted-foreground hover:text-primary border border-border px-3 py-1.5 rounded-md hover:border-primary/30 transition-all cursor-pointer uppercase tracking-wider"
            >
              SEE ALL
            </button>
          </div>
        </div>

        {/* Grid matching category style */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {BRANDS_DATA.map((brand) => (
            <div
              key={brand.name}
              onClick={() => handleBrandClick(brand.name)}
              className="bg-background hover:bg-muted/40 border border-border/45 rounded-xl p-2.5 sm:p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-sm"
            >
              {/* Image Container */}
              <div className="relative w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center bg-muted/10 rounded-lg p-1 sm:p-2 mb-2">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
                />
              </div>
              {/* Label */}
              <span className="text-[9px] sm:text-xs font-semibold text-foreground leading-tight line-clamp-2">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Shop by Flavor — Beautiful Floating Card with Infinite Scroll ── */}
      <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 sm:p-12 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border/5 relative">
          {/* Spacer for desktop to keep title perfectly centered */}
          <div className="hidden sm:block w-32" />

          {/* Centered Title */}
          <div className="text-center flex flex-col items-center flex-1">
            <span className="text-[9px] font-bold tracking-[0.25em] text-primary uppercase mb-1">
              Browse by Flavour
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground tracking-wide">
              Shop by Flavor
            </h2>
            {/* Premium Divider */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-primary/65" />
              <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
              <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-primary/65" />
            </div>
          </div>

          {/* Spacer for desktop balance */}
          <div className="hidden sm:block w-32" />
        </div>

        {/* Infinite Scrolling track */}
        <div className="relative overflow-hidden py-2">
          {/* Gradient overlays for fade effects */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-card to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-card to-transparent" />

          <div className="flex gap-4 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] w-max">
            {/* Duplicate flavors to ensure seamless loop */}
            {[...FLAVORS, ...FLAVORS, ...FLAVORS, ...FLAVORS].map((flavor, i) => (
              <button
                key={i}
                onClick={() => handleFlavorClick(flavor.label)}
                className={`group inline-flex flex-col items-center justify-center flex-shrink-0 w-[140px] sm:w-[160px] bg-gradient-to-br ${flavor.color} border border-border/30 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.03] ${flavor.border} ${flavor.shadow} cursor-pointer min-h-[115px]`}
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 select-none mb-2">
                  {flavor.emoji}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-foreground leading-tight group-hover:text-primary transition-colors tracking-wide whitespace-normal line-clamp-2">
                  {flavor.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Trust Us — Elegant Floating Card ── */}
      <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 sm:p-12 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 space-y-4">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Why Trust Us</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground leading-tight">
              Trusted JUUL<br/>Seller in UAE
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In the ever-evolving world of vaping, finding a reliable JUUL seller is essential. Vape Shop Dubai provides authentic products sourced directly from official distributors — no grey-market stock, no compromised build quality.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 text-primary text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary badge-live" />
              UAE Licensed Retailer Since 2020
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BADGES.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="group bg-background/50 border border-border/30 rounded-[1.25rem] p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/14 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{badge.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
