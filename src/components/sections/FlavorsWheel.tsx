"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FlavorsWheelProps {
  onFlavorSelect?: (flavorLabel: string) => void;
}

const flavors = [
  {
    id: 1,
    name: "Mango & Tropical",
    color: "#f59e0b",
    img: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop",
    query: "Mango",
  },
  {
    id: 2,
    name: "Strawberry & Kiwi",
    color: "#ef4444",
    img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop",
    query: "Strawberry",
  },
  {
    id: 3,
    name: "Blue Razz & Ice",
    color: "#3b82f6",
    img: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=200&h=200&fit=crop",
    query: "Blueberry",
  },
  {
    id: 4,
    name: "Watermelon Blast",
    color: "#ec4899",
    img: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=200&h=200&fit=crop",
    query: "Watermelon",
  },
  {
    id: 5,
    name: "Mint & Menthol",
    color: "#06b6d4",
    img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=200&h=200&fit=crop",
    query: "Mint",
  },
  {
    id: 6,
    name: "Double Apple",
    color: "#10b981",
    img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop",
    query: "Apple",
  },
  {
    id: 7,
    name: "Peach & Nectarine",
    color: "#f97316",
    img: "https://images.unsplash.com/photo-1629828874514-c1e5103f2150?w=200&h=200&fit=crop",
    query: "Peach",
  },
  {
    id: 8,
    name: "Grape Ice",
    color: "#8b5cf6",
    img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&h=200&fit=crop",
    query: "Grape",
  },
  {
    id: 9,
    name: "Cherry & Cola",
    color: "#dc2626",
    img: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=200&h=200&fit=crop",
    query: "Cherry",
  },
  {
    id: 10,
    name: "Citrus & Lemonade",
    color: "#eab308",
    img: "https://images.unsplash.com/photo-1590502593747-422e1a3bcbe8?w=200&h=200&fit=crop",
    query: "Citrus",
  },
  {
    id: 11,
    name: "Pineapple & Coconut",
    color: "#ca8a04",
    img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&h=200&fit=crop",
    query: "Pineapple",
  },
  {
    id: 12,
    name: "Berry Mix & Acai",
    color: "#d946ef",
    img: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=200&h=200&fit=crop",
    query: "Berry",
  },
  {
    id: 13,
    name: "Cigarette & Tobacco",
    color: "#b45309",
    img: "https://images.unsplash.com/photo-1527016016493-4dece38a17a6?w=200&h=200&fit=crop",
    query: "Tobacco",
  },
  {
    id: 14,
    name: "Sweet Candy & Soda",
    color: "#38bdf8",
    img: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=200&h=200&fit=crop",
    query: "Candy",
  },
];

export function FlavorsWheel({ onFlavorSelect }: FlavorsWheelProps) {
  const [activeFlavor, setActiveFlavor] = useState(flavors[0]);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  const handleFlavorClick = (flavor: (typeof flavors)[number]) => {
    setActiveFlavor(flavor);
    if (onFlavorSelect) {
      onFlavorSelect(flavor.name);
    } else {
      router.push(`/collections/disposable-vape?search=${encodeURIComponent(flavor.query)}`);
    }
  };

  return (
    <div className="py-6 sm:py-10 relative">
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

      <div className="max-w-[1400px] mx-auto px-10 sm:px-16 md:px-24 relative flex items-center justify-center">
        {/* Center Text Block (Matching reference design) */}
        <div className="absolute z-10 text-center max-w-[200px] sm:max-w-md flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[9px] sm:text-sm font-extrabold tracking-[0.25em] text-primary uppercase mb-1.5">
            Taste the Difference
          </span>
          <h2 className="text-2xl sm:text-6xl font-serif font-black text-foreground tracking-tight leading-tight mb-2">
            Bash Flavours
          </h2>
          <p className="hidden sm:block text-muted-foreground text-xs sm:text-sm mb-4 px-4 leading-relaxed font-medium">
            From fruity bursts to icy hits, Bash Flavours bring your vibe to life with every puff.
          </p>

          <div className="h-8 mb-4">
            <p
              className="text-lg sm:text-2xl font-bold transition-all duration-300 ease-in-out"
              style={{ color: activeFlavor.color }}
            >
              {activeFlavor.name}
            </p>
          </div>

          <button
            onClick={() => handleFlavorClick(activeFlavor)}
            className="pointer-events-auto rounded-full border-2 border-foreground/30 px-5 sm:px-9 py-2 sm:py-3.5 text-[10px] sm:text-sm font-bold uppercase tracking-wider transition-all hover:bg-foreground hover:text-background active:scale-95 cursor-pointer shadow-md"
          >
            Shop Now
          </button>
        </div>

        {/* Dense Rotating Wheel with 14 Fruit Badges */}
        <div
          className="relative w-full max-w-[340px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[680px] aspect-square rounded-full border border-foreground/10 pointer-events-none shrink-0"
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
                  key={flavor.id}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                    <div
                      className="animate-reverse-wheel-spin"
                      style={{ animationPlayState: isPaused ? "paused" : "running" }}
                    >
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-22 lg:h-22 rounded-full overflow-hidden border-4 bg-background shadow-xl hover:scale-125 transition-all cursor-pointer relative z-20 ${
                          activeFlavor.id === flavor.id
                            ? "ring-4 ring-offset-2 ring-primary scale-125 border-primary"
                            : "border-background hover:border-primary/50"
                        }`}
                        style={{ transform: `rotate(-${angle}deg)` }}
                        onClick={() => handleFlavorClick(flavor)}
                        onMouseEnter={() => setActiveFlavor(flavor)}
                      >
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${flavor.img})` }}
                          title={flavor.name}
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
