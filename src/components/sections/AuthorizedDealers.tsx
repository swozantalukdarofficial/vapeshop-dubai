"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { FlavorsWheel } from "./FlavorsWheel";

interface AuthorizedDealersProps {
  onBrandSelect?: (brand: string) => void;
  onFlavorSelect?: (flavor: string) => void;
}

const BRANDS_DATA = [
  { name: "JUUL", image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/juul_2_device_result.webp?v=1786633076", path: "/collections/juul-vape-dubai" },
  { name: "MYLE", image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/myle_result_result.webp?v=1786633741", path: "/collections/myle-vape-dubai" },
  { name: "GeekVape", image: "/vape_kit.png", path: "/collections/geek-vape" },
  { name: "Uwell", image: "/vape_kit.png", path: "/collections/uwell-vape" },
  { name: "Vaporesso", image: "/vape_kit.png", path: "/collections/vaporesso-vape" },
  { name: "VooPoo", image: "/vape_kit.png", path: "/collections/voopoo-vape" },
  { name: "Smok", image: "/vape_kit.png", path: "/collections/smok-vape" },
  { name: "Oxva", image: "/vape_kit.png", path: "/collections/oxva-vape" },
  { name: "Elf Bar", image: "/lost_mary.png", path: "/collections/elf-bar-vape" },
  { name: "Lost Mary", image: "/lost_mary.png", path: "/collections/lost-mary-disposable" },
  { name: "Tugboat", image: "/lost_mary.png", path: "/collections/tugboat-vape" },
  { name: "SKE Crystal", image: "/lost_mary.png", path: "/collections/disposable-vape" },
  { name: "Pod Salt", image: "/premium_liquid.png", path: "/collections/pod-salt-vape" },
  { name: "Nasty Juice", image: "/premium_liquid.png", path: "/collections/salt-nicotine" },
  { name: "IVG", image: "/premium_liquid.png", path: "/collections/salt-nicotine" },
  { name: "Al Fakher", image: "/premium_liquid.png", path: "/collections/al-fakher-vape" },
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

export const AuthorizedDealers: React.FC<AuthorizedDealersProps> = ({
  onBrandSelect,
  onFlavorSelect,
}) => {
  const router = useRouter();
  const params = useParams();
  const handle = (params?.handle as string) || "";
  const isJuul1Or2 = handle.toLowerCase().includes("juul-1") || handle.toLowerCase().includes("juul-2") || handle.toLowerCase().includes("juul1") || handle.toLowerCase().includes("juul2");

  const handleBrandClick = (brand: typeof BRANDS_DATA[number]) => {
    if (onBrandSelect) {
      onBrandSelect(brand.name);
    } else {
      router.push(brand.path);
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
      
      router.push(`/collections/disposable-vape?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Shop by Brands — Beautiful Grid ── */}
      <div className="bg-card border border-border/40 rounded-[2rem] p-5 sm:p-7 lg:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 relative overflow-hidden">
        {/* Decorative gold shimmer strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border/5 relative">
          {/* Spacer for desktop to keep title perfectly centered */}
          <div className="hidden sm:block w-32" />

          {/* Centered Title */}
          <div className="text-center flex flex-col items-center flex-1">
            <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-1.5">
              Trusted Brands
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">
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
              onClick={() => handleBrandClick(brand)}
              className="bg-background hover:bg-muted/40 border border-border/45 rounded-xl p-2.5 sm:p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-sm"
            >
              {/* Image Container */}
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-muted/10 rounded-lg p-1.5 mb-2 overflow-hidden shrink-0">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-w-full max-h-full w-auto h-auto object-contain pointer-events-none"
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

      {/* ── Shop by Flavor — Interactive Rotating Wheel (Hidden on JUUL 1 & 2) ── */}
      {!isJuul1Or2 && (
        <div className="bg-card border border-border/40 rounded-[2.5rem] p-4 sm:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />
          <FlavorsWheel onFlavorSelect={onFlavorSelect} />
        </div>
      )}
    </div>
  );
};
