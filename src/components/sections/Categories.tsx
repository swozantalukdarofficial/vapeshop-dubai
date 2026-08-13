"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CategoriesProps {
  onCategorySelect?: (id: string) => void;
  activeCategory?: string;
}

const DIRECTORY_SECTIONS = [
  {
    label: "JUUL 1 Series",
    image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/juul_1_device_result.webp?v=1786633077",
    path: "/collections/juul-1-series",
  },
  {
    label: "JUUL 2 Series",
    image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/juul_2_device_result.webp?v=1786633076",
    path: "/collections/juul-2-series",
  },
  {
    label: "JUUL Pods",
    image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/juul_2_device_result.webp?v=1786633076",
    path: "/collections/juul-pods-offers",
  },
  {
    label: "Myle v5 Pods",
    image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/myle_result_result.webp?v=1786633741",
    path: "/collections/myle-v5-pods",
  },
  {
    label: "Myle v5 Kits",
    image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/myle_result_result.webp?v=1786633741",
    path: "/collections/myle-v5-device",
  },
  {
    label: "Myle Disposables",
    image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/myle_result_result.webp?v=1786633741",
    path: "/collections/myle-disposable",
  },
  {
    label: "Disposables",
    image: "/lost_mary.png",
    path: "/collections/disposable-vape",
  },
  {
    label: "Salt Nicotine",
    image: "/premium_liquid.png",
    path: "/collections/salt-nicotine",
  },
  {
    label: "Freebase Nic",
    image: "/premium_liquid.png",
    path: "/collections/freebase-e-liquid",
  },
  {
    label: "Pod Kits",
    image: "/vape_kit.png",
    path: "/collections/pod-kit",
  },
  {
    label: "Cartridges",
    image: "/vape_kit.png",
    path: "/collections/pod-cartridge",
  },
  {
    label: "Vape Coils",
    image: "/vape_kit.png",
    path: "/collections/vape-coils",
  },
  {
    label: "Uwell",
    image: "/vape_kit.png",
    path: "/collections/uwell-vape",
  },
  {
    label: "Vaporesso",
    image: "/vape_kit.png",
    path: "/collections/vaporesso-vape",
  },
  {
    label: "Geekvape",
    image: "/vape_kit.png",
    path: "/collections/geek-vape",
  },
  {
    label: "OXVA",
    image: "/vape_kit.png",
    path: "/collections/oxva-vape",
  },
];

export const Categories: React.FC<CategoriesProps> = ({ onCategorySelect, activeCategory }) => {
  const router = useRouter();

  return (
    <div className="py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border/5 relative">
        {/* Spacer for desktop to keep title perfectly centered */}
        <div className="hidden sm:block w-32" />

        {/* Centered Title */}
        <div className="text-center flex flex-col items-center flex-1">
          <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-1.5">
            Browse Directory
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">
            Shop by Categories
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

      {/* Directory Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
        {DIRECTORY_SECTIONS.map((section) => (
          <div
            key={section.label}
            onClick={() => {
              router.push(section.path);
            }}
            className="bg-card hover:bg-muted/40 border border-border/45 rounded-xl p-2.5 sm:p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-sm"
          >
            {/* Image Container */}
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-muted/10 rounded-lg p-1.5 mb-2 overflow-hidden shrink-0">
              <img
                src={section.image}
                alt={section.label}
                className="max-w-full max-h-full w-auto h-auto object-contain pointer-events-none"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
              />
            </div>
            {/* Label */}
            <span className="text-[9px] sm:text-xs font-semibold text-foreground leading-tight line-clamp-2">
              {section.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
