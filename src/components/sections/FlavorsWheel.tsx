"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FlavorItem {
  name: string;
  img: string;
  color: string;
  query: string;
}

interface FlavorsWheelProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  flavors?: FlavorItem[];
  onFlavorSelect?: (flavorLabel: string) => void;
}

const DEFAULT_FLAVORS: FlavorItem[] = [
  {
    name: "Mango & Tropical",
    color: "#f59e0b",
    img: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop",
    query: "Mango",
  },
  {
    name: "Strawberry & Kiwi",
    color: "#ef4444",
    img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop",
    query: "Strawberry",
  },
  {
    name: "Blue Razz & Ice",
    color: "#3b82f6",
    img: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=200&h=200&fit=crop",
    query: "Blueberry",
  },
  {
    name: "Watermelon Blast",
    color: "#ec4899",
    img: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=200&h=200&fit=crop",
    query: "Watermelon",
  },
  {
    name: "Mint & Menthol",
    color: "#06b6d4",
    img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200&h=200&fit=crop",
    query: "Mint",
  },
  {
    name: "Double Apple",
    color: "#10b981",
    img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop",
    query: "Apple",
  },
  {
    name: "Peach & Nectarine",
    color: "#f97316",
    img: "https://images.unsplash.com/photo-1629828874514-c1e5103f2150?w=200&h=200&fit=crop",
    query: "Peach",
  },
  {
    name: "Grape Ice",
    color: "#8b5cf6",
    img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&h=200&fit=crop",
    query: "Grape",
  },
  {
    name: "Cherry & Cola",
    color: "#dc2626",
    img: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=200&h=200&fit=crop",
    query: "Cherry",
  },
  {
    name: "Citrus & Lemonade",
    color: "#eab308",
    img: "https://images.unsplash.com/photo-1534706936160-d5ee67737249?w=200&h=200&fit=crop",
    query: "Citrus",
  },
  {
    name: "Pineapple & Coconut",
    color: "#ca8a04",
    img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&h=200&fit=crop",
    query: "Pineapple",
  },
  {
    name: "Berry Mix & Acai",
    color: "#d946ef",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop",
    query: "Berry",
  },
  {
    name: "Cigarette & Tobacco",
    color: "#b45309",
    img: "https://images.unsplash.com/photo-1527016016493-4dece38a17a6?w=200&h=200&fit=crop",
    query: "Tobacco",
  },
  {
    name: "Sweet Candy & Soda",
    color: "#38bdf8",
    img: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=200&h=200&fit=crop",
    query: "Candy",
  },
];

export function FlavorsWheel({ 
  eyebrow = "Taste the Difference",
  heading = "Best Flavours",
  description = "From fruity bursts to icy hits, Best Flavours bring your vibe to life with every puff.",
  buttonText = "Shop Now",
  buttonHref = "/collections/disposable-vape",
  flavors: customFlavors,
  onFlavorSelect 
}: FlavorsWheelProps) {
  const flavors = React.useMemo(() => {
    let list = Array.isArray(customFlavors) && customFlavors.length > 0 ? [...customFlavors] : [...DEFAULT_FLAVORS];
    list = list.map((item, idx) => {
      const fallback = DEFAULT_FLAVORS[idx % DEFAULT_FLAVORS.length];
      return {
        name: item.name || fallback.name,
        color: item.color || fallback.color,
        img: item.img && item.img.trim() ? item.img : fallback.img,
        query: item.query || item.name || fallback.query,
      };
    });
    while (list.length < 10) {
      const fallback = DEFAULT_FLAVORS[list.length % DEFAULT_FLAVORS.length];
      list.push(fallback);
    }
    return list;
  }, [customFlavors]);

  const [activeFlavor, setActiveFlavor] = useState(flavors[0]);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  const handleFlavorClick = (flavor: FlavorItem) => {
    setActiveFlavor(flavor);
    if (onFlavorSelect) {
      onFlavorSelect(flavor.name);
    } else {
      const url = new URL(buttonHref || "/collections/disposable-vape", "http://localhost");
      if (flavor.query) {
        url.searchParams.set("search", flavor.query);
      }
      router.push(url.pathname + url.search);
    }
  };

  return (
    <div className="py-2 sm:py-6 md:py-10 relative overflow-hidden">
      {/* CSS for wheel spin animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes wheel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-wheel-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-wheel-spin {
          animation: wheel-spin 42s linear infinite;
        }
        .animate-reverse-wheel-spin {
          animation: reverse-wheel-spin 42s linear infinite;
        }
      `,
        }}
      />

      <div className="max-w-[1400px] mx-auto px-2 sm:px-8 md:px-16 lg:px-24 relative flex items-center justify-center min-h-[300px] sm:min-h-[460px] md:min-h-[580px]">
        {/* Center Text Block (Matching reference design) */}
        <div className="absolute z-10 text-center max-w-[150px] sm:max-w-xs md:max-w-md flex flex-col items-center justify-center pointer-events-none select-none">
          {eyebrow && (
            <span className="text-[8px] sm:text-xs md:text-sm font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-primary uppercase mb-0.5 sm:mb-1.5">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h3 className="text-lg sm:text-3xl md:text-5xl lg:text-6xl font-serif font-black text-foreground tracking-tight leading-tight mb-1 sm:mb-2">
              {heading}
            </h3>
          )}
          {description && (
            <p className="hidden md:block text-muted-foreground text-xs sm:text-sm mb-3 px-4 leading-relaxed font-medium whitespace-pre-line">
              {description}
            </p>
          )}

          <div className="h-5 sm:h-7 md:h-8 mb-1.5 sm:mb-3 flex items-center justify-center">
            <p
              className="text-xs sm:text-base md:text-xl lg:text-2xl font-bold transition-all duration-300 ease-in-out truncate max-w-[140px] sm:max-w-none"
              style={{ color: activeFlavor.color }}
            >
              {activeFlavor.name}
            </p>
          </div>

          {buttonText && (
            <button
              onClick={() => handleFlavorClick(activeFlavor)}
              className="pointer-events-auto rounded-full border border-foreground/30 sm:border-2 px-3.5 sm:px-7 md:px-9 py-1 sm:py-2 md:py-3 text-[8px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all hover:bg-foreground hover:text-background active:scale-95 cursor-pointer shadow-md bg-card/70 backdrop-blur-xs"
            >
              {buttonText}
            </button>
          )}
        </div>

        {/* Dense Rotating Wheel with 14 Fruit Badges */}
        <div
          className="relative w-[230px] sm:w-[380px] md:w-[500px] lg:w-[580px] aspect-square rounded-full border border-foreground/10 pointer-events-none shrink-0 my-5 sm:my-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="absolute inset-0 rounded-full animate-wheel-spin"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {flavors.map((flavor, index) => {
              const angle = (index / flavors.length) * 360;
              return (
                <div
                  key={`${flavor.name}-${index}`}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                    <div
                      className="animate-reverse-wheel-spin"
                      style={{ animationPlayState: isPaused ? "paused" : "running" }}
                    >
                      <div
                        className={`w-9 h-9 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 sm:border-4 bg-background shadow-lg hover:scale-125 transition-all cursor-pointer relative z-20 ${activeFlavor.name === flavor.name
                          ? "ring-2 sm:ring-4 ring-offset-1 sm:ring-offset-2 ring-primary scale-115 sm:scale-125 border-primary shadow-primary/30"
                          : "border-background hover:border-primary/50"
                          }`}
                        style={{ transform: `rotate(-${angle}deg)` }}
                        onClick={() => handleFlavorClick(flavor)}
                        onMouseEnter={() => setActiveFlavor(flavor)}
                      >
                        <img
                          src={flavor.img}
                          alt={flavor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
