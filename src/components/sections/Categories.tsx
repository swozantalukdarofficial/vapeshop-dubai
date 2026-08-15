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
    image: "/juul_device.png",
    path: "/collections/juul-1-series",
  },
  {
    label: "JUUL 2 Series",
    image: "/juul_device.png",
    path: "/collections/juul-2-series",
  },
  {
    label: "JUUL Pods",
    image: "/juul_device.png",
    path: "/collections/juul-pods-offers",
  },
  {
    label: "Myle v5 Pods",
    image: "/vape_kit.png",
    path: "/collections/myle-v5-pods",
  },
  {
    label: "Myle v5 Kits",
    image: "/vape_kit.png",
    path: "/collections/myle-v5-device",
  },
  {
    label: "Myle Disposables",
    image: "/vape_kit.png",
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3.5">
        {DIRECTORY_SECTIONS.map((section) => (
          <div
            key={section.label}
            onClick={() => {
              router.push(section.path);
            }}
            className="group bg-card hover:bg-primary/[0.04] border-2 border-primary/20 hover:border-primary rounded-2xl p-2.5 sm:p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-xs hover:shadow-md hover:shadow-primary/10"
          >
            {/* Image Container */}
            <div className="relative w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center bg-muted/20 border border-primary/15 group-hover:border-primary/40 rounded-xl p-1 sm:p-2 mb-2 transition-colors">
              <img
                src={section.image}
                alt={section.label}
                className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-300 group-hover:scale-110"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
              />
            </div>
            {/* Label */}
            <span className="text-[9px] sm:text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
              {section.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
