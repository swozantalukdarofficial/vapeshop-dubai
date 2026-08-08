"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Truck } from "lucide-react";

export interface BottomCardItem {
  title: string;
  subtitle: string;
  badge?: string;
  image: string;
  href: string;
  color: string;
}

interface CollectionCategorySection {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cards: BottomCardItem[];
}

interface BottomCollectionGridProps {
  handle: string;
}

// Data definitions for all major categories
const JUUL_CARDS: BottomCardItem[] = [
  {
    title: "JUUL 1 Series",
    subtitle: "Classic JUUL 1 Devices, Virginia Tobacco & Menthol Pods (3% & 5%)",
    image: "/juul_device.png",
    href: "/collections/juul-1-series",
    color: "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
  {
    title: "JUUL 2 Series",
    subtitle: "Next-Gen JUUL 2 Starter Kit, Ruby Scheme & Crisp Menthol Pods",
    image: "/juul_device.png",
    href: "/collections/juul-2-series",
    color: "from-sky-500/20 via-blue-500/10 to-transparent",
  },
  {
    title: "JUUL Pods Offers",
    subtitle: "Special Multi-Pack Bundle Deals on JUUL 1 & JUUL 2 Pods",
    image: "/vape_kit.png",
    href: "/collections/juul-pods-offers",
    color: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
];

const MYLE_CARDS: BottomCardItem[] = [
  {
    title: "MYLE Meta V5 Pods",
    subtitle: "Pre-filled Meta V5 Pods in Iced Mint, Peach & Tobacco Flavors",
    image: "/vape_kit.png",
    href: "/collections/myle-v5-pods",
    color: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    title: "MYLE Meta V5 Devices",
    subtitle: "Rechargeable Meta V5 Battery Devices in Jet Black & Rose Gold",
    image: "/vape_kit.png",
    href: "/collections/myle-v5-device",
    color: "from-orange-500/20 via-red-500/10 to-transparent",
  },
  {
    title: "MYLE Micro Disposables",
    subtitle: "Compact MYLE Micro & Drip 2500+ Puffs Disposable Pods",
    image: "/lost_mary.png",
    href: "/collections/myle-disposable",
    color: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
];

const DISPOSABLE_CARDS: BottomCardItem[] = [
  {
    title: "Geek Bar Pulse 15000",
    subtitle: "Geek Bar Pulse 15000 Puffs Dual Mesh & Full LED Screen",
    image: "/lost_mary.png",
    href: "/collections/geek-bar-disposable",
    color: "from-rose-500/20 via-pink-500/10 to-transparent",
  },
  {
    title: "Elf Bar Disposables",
    subtitle: "Elf Bar BC5000, Ultra & Lowit Pod Disposables",
    image: "/lost_mary.png",
    href: "/collections/elf-bar-vape",
    color: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    title: "Lost Mary BM6000",
    subtitle: "Lost Mary BM6000 & MO5000 Fruity Mesh Coil Vapes",
    image: "/lost_mary.png",
    href: "/collections/lost-mary-disposable",
    color: "from-pink-500/20 via-purple-500/10 to-transparent",
  },
  {
    title: "Tugboat Super 12000",
    subtitle: "Tugboat Super 12000 Puffs Rechargeable Mesh Vapes",
    image: "/lost_mary.png",
    href: "/collections/tugboat-vape",
    color: "from-teal-500/20 via-cyan-500/10 to-transparent",
  },
  {
    title: "Al Fakher Crown Bar",
    subtitle: "Al Fakher Crown Bar 8000 & 10000 Shisha Flavor Vapes",
    image: "/premium_liquid.png",
    href: "/collections/al-fakher-vape",
    color: "from-purple-500/20 via-pink-500/10 to-transparent",
  },
  {
    title: "Fummo & Vozol Vapes",
    subtitle: "Fummo Target 10000 & Vozol Gear 10000 Outdoor Vapes",
    image: "/lost_mary.png",
    href: "/collections/fummo-vape",
    color: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
];

const EJUICE_CARDS: BottomCardItem[] = [
  {
    title: "Salt Nicotine Liquids",
    subtitle: "Premium Nic Salt E-Liquids in 20mg, 30mg & 50mg Strengths",
    image: "/premium_liquid.png",
    href: "/collections/salt-nicotine",
    color: "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
  {
    title: "Freebase E-Liquids",
    subtitle: "High VG 60ml & 100ml Sub-Ohm E-Liquids in 3mg & 6mg",
    image: "/premium_liquid.png",
    href: "/collections/freebase-e-liquid",
    color: "from-purple-500/20 via-pink-500/10 to-transparent",
  },
  {
    title: "Pod Salt E-Juice",
    subtitle: "British Nicotine Salt Liquids in Nexus & Core Series",
    image: "/premium_liquid.png",
    href: "/collections/pod-salt-vape",
    color: "from-cyan-500/20 via-teal-500/10 to-transparent",
  },
  {
    title: "VGOD Stig E-Liquids",
    subtitle: "VGOD Cubano Tobacco & Mighty Mint Salt Liquids",
    image: "/premium_liquid.png",
    href: "/collections/vgod-stig",
    color: "from-red-500/20 via-amber-500/10 to-transparent",
  },
];

const POD_SYSTEM_CARDS: BottomCardItem[] = [
  {
    title: "Uwell Caliburn Series",
    subtitle: "Caliburn G3, AK3 & GK3 Refillable Pod Systems",
    image: "/vape_kit.png",
    href: "/collections/uwell-vape",
    color: "from-cyan-500/20 via-blue-500/10 to-transparent",
  },
  {
    title: "Vaporesso XROS Series",
    subtitle: "XROS 3, XROS Mini & Luxe Pod Kits with COREX Tech",
    image: "/vape_kit.png",
    href: "/collections/vaporesso-vape",
    color: "from-sky-500/20 via-indigo-500/10 to-transparent",
  },
  {
    title: "OXVA Xlim Pod Kits",
    subtitle: "Xlim Pro & SQ Pro Pod Systems with OLED Display",
    image: "/vape_kit.png",
    href: "/collections/oxva-vape",
    color: "from-purple-500/20 via-violet-500/10 to-transparent",
  },
  {
    title: "Pod Cartridges & Coils",
    subtitle: "Replacement Pod Cartridges & Mesh Coils for All Kits",
    image: "/vape_kit.png",
    href: "/collections/pod-cartridge",
    color: "from-amber-500/20 via-yellow-500/10 to-transparent",
  },
];

export function BottomCollectionGrid({ handle }: BottomCollectionGridProps) {
  const h = (handle || "").toLowerCase();
  const isShopPage = h === "all" || h === "shop" || h === "";

  // If on main Shop page (/shop or /collections/all), display ALL 5 categories sections
  if (isShopPage) {
    const allSections: CollectionCategorySection[] = [
      {
        id: "juul",
        badge: "JUUL SUB-CATEGORIES",
        title: "Top JUUL Vape Collections",
        subtitle: "Explore JUUL 1 Series, JUUL 2 Next-Gen Pods, and Bundle Deals.",
        cards: JUUL_CARDS,
      },
      {
        id: "myle",
        badge: "MYLE SUB-CATEGORIES",
        title: "Top MYLE Vape Collections",
        subtitle: "Explore MYLE Meta V5 Pods, Rechargeable Devices, and Micro Disposables.",
        cards: MYLE_CARDS,
      },
      {
        id: "disposable",
        badge: "DISPOSABLE SUB-CATEGORIES",
        title: "Top Disposable Vape Collections",
        subtitle: "Explore long-lasting 10000+ puff rechargeable disposables in Dubai.",
        cards: DISPOSABLE_CARDS,
      },
      {
        id: "e-juice",
        badge: "E-JUICE & SALTS SUB-CATEGORIES",
        title: "Top E-Juice & Nicotine Salt Collections",
        subtitle: "Explore premium 30ml salt nics, high VG freebase liquids, and top brands.",
        cards: EJUICE_CARDS,
      },
      {
        id: "pod-system",
        badge: "POD SYSTEM SUB-CATEGORIES",
        title: "Top Pod System & Kit Collections",
        subtitle: "Explore Uwell Caliburn, Vaporesso XROS, OXVA Xlim kits, and replacement pods.",
        cards: POD_SYSTEM_CARDS,
      },
    ];

    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-12 sm:space-y-16">
        {allSections.map((sec) => (
          <div key={sec.id} className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full mb-3">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>{sec.badge}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-serif font-black text-foreground tracking-tight">
                  {sec.title}
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-semibold">
                  {sec.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-4 py-2 rounded-full shrink-0 self-start sm:self-auto">
                <Truck className="w-4 h-4 text-primary" />
                <span>2-Hour Dubai Express</span>
              </div>
            </div>

            {/* Collection Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sec.cards.map((card, idx) => (
                <Link
                  key={idx}
                  href={card.href}
                  className="group relative bg-background border border-border/80 hover:border-primary rounded-3xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-card border border-border/60 p-3 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <img src={card.image} alt={card.title} className="w-full h-full object-contain" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-foreground/80 font-medium leading-relaxed line-clamp-2">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-5 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                      Explore Products
                    </span>

                    <div className="inline-flex items-center gap-2 bg-primary text-white hover:bg-gold-shimmer px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md group-hover:scale-105">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Single Category Page behavior (JUUL, MYLE, DISPOSABLE, E-JUICE, POD SYSTEM)
  let categoryType: "juul" | "juul-1" | "juul-2" | "myle" | "e-juice" | "pod-system" | "disposable" = "disposable";
  let sectionTitle = "Explore Related Collections";
  let sectionSub = "Browse complementary certified categories with 2-hour express delivery in Dubai.";
  let badgeText = "Sub-Categories";
  let cards: BottomCardItem[] = DISPOSABLE_CARDS;

  if (h === "juul-1-series") {
    categoryType = "juul-1";
    badgeText = "JUUL 1 SUB-CATEGORIES";
    sectionTitle = "JUUL 1 Sub-Collections & Accessories";
    sectionSub = "Select JUUL 1 pods, starter devices, or upgrade to JUUL 2 series.";
    cards = [
      {
        title: "JUUL 1 Pods Collection",
        subtitle: "Virginia Tobacco, Menthol, Mint & Mango Pods (3% & 5% Nicotine)",
        image: "/juul_device.png",
        href: "/collections/juul-1-series?sub=pods",
        color: "from-blue-500/20 via-indigo-500/10 to-transparent",
      },
      {
        title: "JUUL 1 Device Kits",
        subtitle: "Slate & Silver Rechargeable JUUL 1 Devices & USB Chargers",
        image: "/juul_device.png",
        href: "/collections/juul-1-series?sub=device",
        color: "from-slate-500/20 via-gray-500/10 to-transparent",
      },
      {
        title: "Upgrade to JUUL 2 Series",
        subtitle: "JUUL 2 Next-Gen Pod System with LED Indicator & 18mg Salts",
        image: "/juul_device.png",
        href: "/collections/juul-2-series",
        color: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
    ];
  } else if (h === "juul-2-series") {
    categoryType = "juul-2";
    badgeText = "JUUL 2 SUB-CATEGORIES";
    sectionTitle = "JUUL 2 Sub-Collections & Upgrades";
    sectionSub = "Select JUUL 2 starter kits, 18mg salt nic pods, or classic JUUL 1 series.";
    cards = [
      {
        title: "JUUL 2 Starter Kits",
        subtitle: "JUUL 2 Slate Device + USB Magnetic Charging Dock",
        image: "/juul_device.png",
        href: "/collections/juul-2-series?sub=device",
        color: "from-sky-500/20 via-blue-500/10 to-transparent",
      },
      {
        title: "JUUL 2 Pod Flavors",
        subtitle: "Virginia Tobacco 18mg, Crisp Menthol, Ruby Scheme & Polar",
        image: "/juul_device.png",
        href: "/collections/juul-2-series?sub=pods",
        color: "from-indigo-500/20 via-purple-500/10 to-transparent",
      },
      {
        title: "Classic JUUL 1 Series",
        subtitle: "Browse Original JUUL 1 USA Made Pods & Slate Devices",
        image: "/juul_device.png",
        href: "/collections/juul-1-series",
        color: "from-blue-500/20 via-indigo-500/10 to-transparent",
      },
    ];
  } else if (h.includes("juul")) {
    categoryType = "juul";
    badgeText = "JUUL SUB-CATEGORIES";
    sectionTitle = "JUUL Series Sub-Categories";
    sectionSub = "Explore JUUL 1 Series, JUUL 2 Next-Gen Pods, and Bundle Offers.";
    cards = JUUL_CARDS;
  } else if (h.includes("myle")) {
    categoryType = "myle";
    badgeText = "MYLE SUB-CATEGORIES";
    sectionTitle = "MYLE Series Sub-Categories";
    sectionSub = "Explore MYLE Meta V5 Pods, Rechargeable Devices, and Micro Disposables.";
    cards = MYLE_CARDS;
  } else if (h.includes("juice") || h.includes("liquid") || h.includes("salt")) {
    categoryType = "e-juice";
    badgeText = "E-JUICE SUB-CATEGORIES";
    sectionTitle = "Top E-Juice & Nicotine Salt Collections";
    sectionSub = "Explore premium 30ml salt nics, high VG freebase liquids, and top brands.";
    cards = EJUICE_CARDS;
  } else if (h.includes("pod") || h.includes("kit") || h.includes("coil") || h.includes("cartridge") || h.includes("uwell") || h.includes("oxva") || h.includes("vaporesso")) {
    categoryType = "pod-system";
    badgeText = "POD SYSTEM SUB-CATEGORIES";
    sectionTitle = "Top Pod System & Kit Collections";
    sectionSub = "Explore Uwell Caliburn, Vaporesso XROS, OXVA Xlim kits, and replacement pods.";
    cards = POD_SYSTEM_CARDS;
  } else {
    categoryType = "disposable";
    badgeText = "DISPOSABLE SUB-CATEGORIES";
    sectionTitle = "Top Disposable Vape Collections";
    sectionSub = "Explore long-lasting 10000+ puff rechargeable disposables in Dubai.";
    cards = DISPOSABLE_CARDS;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-md transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full mb-3">
              <Layers className="w-4 h-4 text-primary" />
              <span>{badgeText}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-black text-foreground tracking-tight">
              {sectionTitle}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-semibold">
              {sectionSub}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-4 py-2 rounded-full shrink-0 self-start sm:self-auto">
            <Truck className="w-4 h-4 text-primary" />
            <span>2-Hour Dubai Express</span>
          </div>
        </div>

        {/* High-Contrast Collection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              className="group relative bg-background border border-border/80 hover:border-primary rounded-3xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              <div className="relative z-10 flex items-start gap-4">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-card border border-border/60 p-3 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <img src={card.image} alt={card.title} className="w-full h-full object-contain" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/80 font-medium leading-relaxed line-clamp-2">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-5 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs font-black text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                  Explore Products
                </span>

                <div className="inline-flex items-center gap-2 bg-primary text-white hover:bg-gold-shimmer px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md group-hover:scale-105">
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
