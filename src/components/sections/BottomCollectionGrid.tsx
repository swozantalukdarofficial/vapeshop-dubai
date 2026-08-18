"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Layers, Truck, ChevronLeft, ChevronRight } from "lucide-react";

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

export interface BottomCollectionGridSettings {
  /** Leave blank to keep the automatic per-category wording. */
  badgeText: string;
  heading: string;
  description: string;
}

interface BottomCollectionGridProps {
  handle: string;
  settings?: BottomCollectionGridSettings;
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

// Helper slider card block
function SubCollectionSectionSlider({
  badge,
  title,
  subtitle,
  cards,
}: {
  badge: string;
  title: string;
  subtitle: string;
  cards: BottomCardItem[];
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeftPos, setScrollLeftPos] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Auto-scroll loop (pauses when user hovers or drags)
  React.useEffect(() => {
    if (isHovered || isDragging || cards.length <= 3) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
          setActiveIndex(0);
        } else {
          sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, isDragging, cards.length]);

  // Track active slide index on scroll
  const handleScrollTrack = () => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const index = Math.round(scrollLeft / (clientWidth > 0 ? clientWidth * 0.75 : 300));
      setActiveIndex(Math.min(cards.length - 1, Math.max(0, index)));
    }
  };

  const scrollToSlide = (index: number) => {
    if (sliderRef.current) {
      const cardWidth = 320;
      sliderRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  // Mouse Drag / Swipe Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftPos(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.6; // Scroll speed multiplier
    sliderRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleScroll = (dir: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = dir === "left" ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const isThreeOrLess = cards.length <= 3;

  return (
    <div className="bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 relative overflow-hidden shadow-md transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4 mb-5 relative">
        {/* Spacer for desktop optical centering */}
        <div className="hidden sm:block w-48" />

        {/* Centered Title & Badge */}
        <div className="text-center flex flex-col items-center flex-1">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-2">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>{badge}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-foreground tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-semibold max-w-xl">
            {subtitle}
          </p>

          {/* Premium Centered Line Divider */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-primary/65" />
            <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
            <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-primary/65" />
          </div>
        </div>

        {/* Right Slider Controls & Express Pill */}
        <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-48">
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-extrabold text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full shrink-0">
            <Truck className="w-3.5 h-3.5 text-primary" />
            <span>2-Hour Express</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted/60 hover:bg-primary border border-border/60 hover:border-primary text-foreground hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted/60 hover:bg-primary border border-border/60 hover:border-primary text-foreground hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Horizontal Cards Slider Track with Mouse Drag & Auto Scroll */}
      <div
        ref={sliderRef}
        onScroll={handleScrollTrack}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-3 px-1 select-none transform-gpu transition-all ${
          isDragging
            ? "cursor-grabbing scroll-auto"
            : "cursor-grab scroll-smooth snap-x snap-mandatory"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {cards.map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            draggable={false}
            className={`${
              isThreeOrLess
                ? "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0"
                : "w-[270px] sm:w-[310px] lg:w-[340px] flex-shrink-0"
            } snap-start group relative bg-card border-2 border-border/80 hover:border-primary/70 rounded-[1.75rem] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 shadow-md hover:shadow-2xl hover:shadow-primary/10 overflow-hidden`}
          >
            {/* Top Product Image Display Area - Clean Premium Studio Showcase */}
            <div className="w-full h-40 sm:h-48 rounded-2xl bg-gradient-to-b from-muted/30 via-muted/15 to-transparent border border-border/60 p-3 sm:p-4 flex items-center justify-center relative mb-3.5 overflow-hidden shrink-0 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300">
              <img
                src={card.image}
                alt={card.title}
                draggable={false}
                className="max-w-full max-h-full w-auto h-auto object-contain filter drop-shadow-xl group-hover:scale-108 transition-transform duration-500 pointer-events-none"
              />
            </div>

            {/* Title & Short Description */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-serif font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground font-normal leading-relaxed line-clamp-2">
                {card.subtitle}
              </p>
            </div>

            {/* Bottom CTA Bar: VIEW COLLECTION */}
            <div className="mt-4 pt-3.5 border-t border-border/50 flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                View Collection
              </span>

              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-110 group-hover:bg-gold-shimmer transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Dots Indicator */}
      {cards.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 pt-2">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex
                  ? "bg-primary w-6 h-2 shadow-xs"
                  : "bg-muted-foreground/30 hover:bg-primary/50 w-2 h-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function BottomCollectionGrid({ handle, settings }: BottomCollectionGridProps) {
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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {allSections.map((sec) => (
          <SubCollectionSectionSlider
            key={sec.id}
            badge={sec.badge}
            title={sec.title}
            subtitle={sec.subtitle}
            cards={sec.cards}
          />
        ))}
      </div>
    );
  }

  // Single Category Page behavior (JUUL, MYLE, DISPOSABLE, E-JUICE, POD SYSTEM).
  // The wording below adapts to the handle; a non-empty setting overrides it.
  let badgeText = "Sub-Categories";
  let sectionTitle = "Explore Related Collections";
  let sectionSub = "Browse complementary certified categories with 2-hour express delivery in Dubai.";
  let cards: BottomCardItem[] = DISPOSABLE_CARDS;

  if (h.includes("juul")) {
    badgeText = "JUUL SUB-CATEGORIES";
    sectionTitle = "Explore Other JUUL Collections";
    sectionSub = "Discover more JUUL series and bundle deals.";
    cards = JUUL_CARDS;
  } else if (h.includes("myle")) {
    badgeText = "MYLE SUB-CATEGORIES";
    sectionTitle = "Explore Other MYLE Collections";
    sectionSub = "Explore MYLE Meta V5 Pods, Rechargeable Devices, and Micro Disposables.";
    cards = MYLE_CARDS;
  } else if (h.includes("juice") || h.includes("liquid") || h.includes("salt")) {
    badgeText = "E-JUICE SUB-CATEGORIES";
    sectionTitle = "Explore Other E-Juice Collections";
    sectionSub = "Explore premium 30ml salt nics, high VG freebase liquids, and top brands.";
    cards = EJUICE_CARDS;
  } else if (h.includes("pod") || h.includes("kit") || h.includes("coil") || h.includes("cartridge") || h.includes("uwell") || h.includes("oxva") || h.includes("vaporesso")) {
    badgeText = "POD SYSTEM SUB-CATEGORIES";
    sectionTitle = "Explore Other Pod Systems";
    sectionSub = "Explore Uwell Caliburn, Vaporesso XROS, OXVA Xlim kits, and replacement pods.";
    cards = POD_SYSTEM_CARDS;
  } else {
    badgeText = "DISPOSABLE SUB-CATEGORIES";
    sectionTitle = "Explore Other Disposable Collections";
    sectionSub = "Explore long-lasting 10000+ puff rechargeable disposables in Dubai.";
    cards = DISPOSABLE_CARDS;
  }

  // A non-empty setting wins over the handle-derived wording above.
  if (settings?.badgeText) badgeText = settings.badgeText;
  if (settings?.heading) sectionTitle = settings.heading;
  if (settings?.description) sectionSub = settings.description;

  // Filter out the current collection to only show siblings
  cards = cards.filter((c) => {
    const cardHandle = c.href.split("/").pop()?.split("?")[0] || "";
    return cardHandle !== h;
  });

  if (cards.length === 0) {
    return null; // Don't show the grid if there are no other collections
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
      <SubCollectionSectionSlider
        badge={badgeText}
        title={sectionTitle}
        subtitle={sectionSub}
        cards={cards}
      />
    </div>
  );
}
