"use client";

import React from "react";
import { CheckCircle2, Flame, Check, Table, HelpCircle } from "lucide-react";

export interface FlavorVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
  inventoryQuantity?: number;
  [key: string]: any;
}

interface ProductAvailableFlavorsSectionProps {
  variants?: any[];
  productName: string;
  productCategory?: string;
  selectedVariantId?: string | null;
  onSelectVariant?: (variant: any) => void;
  className?: string;
}

// Preset flavor descriptions dictionary to match popular vape & shisha flavors in UAE
const KNOWN_FLAVOR_DESCRIPTIONS: Record<string, string> = {
  "blue razz lemonade": "Fresh and tangy blend of blue raspberry with a citrus lemonade twist",
  "lemon mint": "Crisp lemon notes balanced with cooling mint freshness",
  "mango pineapple": "Tropical sweetness with balanced tang and icy finish",
  "peach ice": "Juicy peach layered with a refreshing icy finish",
  "mixed berry": "Sweet and tart medley of assorted forest berries",
  "cherry fiesta": "Bold cherry flavour with a smooth exhaling finish",
  "cool mango": "Chilled mango with cooling menthol sensation",
  "grape mint": "Traditional shisha favourite with grape sweetness and mint coolness",
  "gum mint": "Sweet spearmint gum base blended with mint freshness",
  "space dream": "Exotic fruity blend with a unique refreshing twist",
  "strawberry cherry": "Sweet strawberry paired with rich cherry notes",
  "strawberry punch": "Punchy strawberry flavour with a bold fruity kick",
  "watermelon kiwi": "Refreshing fusion of juicy watermelon and tangy kiwi for a balanced vape",
  "mint": "Classic invigorating mint with crisp icy exhales",
  "virginia tobacco": "Rich American tobacco leaves with subtle toasted caramel warmth",
  "menthol": "Pure cooling menthol blast for maximum icy throat hit",
  "mango": "Sun-ripened Alphonso mango nectar with tropical sweetness",
  "crisp menthol": "Ultra-clean menthol with intense cooling icy finish",
  "polar menthol": "Sub-zero Arctic menthol frost with deep cooling power",
  "ruby red grapefruit": "Zesty pink grapefruit with balanced tart and sweet notes",
  "summer menthol": "Refreshing blend of summer fruits with a cool icy breeze",
  "autumn tobacco": "Full-bodied toasted tobacco with subtle spice accents",
  "watermelon ice": "Sweet juicy watermelon slices served over crushed ice",
  "double apple": "Classic Arabic shisha sweet red and crisp green apple fusion",
  "lush ice": "Sweet watermelon candy blend layered with icy menthol",
  "blueberry ice": "Plump blueberries infused with a chilled menthol breeze",
  "strawberry ice cream": "Creamy vanilla gelato swirled with sweet ripe strawberries",
  "cubano": "Full-flavored Cuban cigar tobacco with vanilla cream finish",
  "sweet apple": "Crisp orchard red apples with natural juicy sweetness"
};

// Fallback flavor list when product does not have individual variant items
const DEFAULT_FALLBACK_FLAVORS = [
  { title: "Blue Razz Lemonade", desc: "Fresh and tangy blend of blue raspberry with a citrus lemonade twist" },
  { title: "Lemon Mint", desc: "Crisp lemon notes balanced with cooling mint freshness" },
  { title: "Mango Pineapple", desc: "Tropical sweetness with balanced tang" },
  { title: "Peach Ice", desc: "Juicy peach layered with a refreshing icy finish" },
  { title: "Mixed Berry", desc: "Sweet and tart medley of assorted berries" },
  { title: "Cherry Fiesta", desc: "Bold cherry flavour with a smooth exhale" },
  { title: "Cool Mango", desc: "Chilled mango with cooling sensation" },
  { title: "Grape Mint", desc: "Traditional shisha favourite with grape sweetness and mint coolness" },
  { title: "Gum Mint", desc: "Sweet gum base blended with mint freshness" },
  { title: "Space Dream", desc: "Exotic fruity blend with a unique twist" },
  { title: "Strawberry Cherry", desc: "Sweet strawberry paired with rich cherry notes" },
  { title: "Strawberry Punch", desc: "Punchy strawberry flavour with a bold kick" },
  { title: "Watermelon Kiwi", desc: "Refreshing fusion of juicy watermelon and tangy kiwi for a balanced sweet-and-sour vape" }
];

function getFlavorDescription(flavorTitle: string, productName: string): string {
  const cleanTitle = flavorTitle.toLowerCase().trim();
  
  // Exact match
  if (KNOWN_FLAVOR_DESCRIPTIONS[cleanTitle]) {
    return KNOWN_FLAVOR_DESCRIPTIONS[cleanTitle];
  }

  // Partial match search
  for (const [key, desc] of Object.entries(KNOWN_FLAVOR_DESCRIPTIONS)) {
    if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
      return desc;
    }
  }

  // Generate clean fallback description
  return `Authentic ${flavorTitle} blend with rich flavor profile, smooth throat hit, and refreshing finish.`;
}

export function ProductAvailableFlavorsSection({
  variants = [],
  productName,
  productCategory,
  selectedVariantId,
  onSelectVariant,
  className = "",
}: ProductAvailableFlavorsSectionProps) {
  
  // Filter valid variants (ignore single default variant if titled "Default Title")
  const validVariants = variants.filter((v) => v.title && v.title.toLowerCase() !== "default title" && v.title.toLowerCase() !== "default");

  // Determine flavor list to display
  const flavorsList = validVariants.length > 0
    ? validVariants.map((v) => ({
        id: v.id,
        variantObj: v,
        title: v.title,
        desc: getFlavorDescription(v.title, productName),
        available: v.availableForSale,
        price: v.price,
      }))
    : DEFAULT_FALLBACK_FLAVORS.map((f, i) => ({
        id: `fallback-${i}`,
        variantObj: null as any,
        title: f.title,
        desc: f.desc,
        available: true,
        price: null,
      }));

  return (
    <section className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 ${className}`}>
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden transition-all duration-300">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-primary rounded-full shrink-0 shadow-sm" />
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground tracking-tight flex items-center gap-2">
                <span>Available Flavours</span>
                <Table className="w-5 h-5 text-primary opacity-80" />
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Complete flavor profile spreadsheet table for {productName}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span>{flavorsList.length} Signature Options</span>
          </div>
        </div>

        {/* Excel Spreadsheet-Style Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-primary/30 shadow-md bg-card scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[640px]">
            {/* Excel Header Row */}
            <thead className="bg-primary text-white uppercase text-[11px] font-black tracking-wider shadow-sm">
              <tr>
                <th scope="col" className="py-3.5 px-4 text-center w-12 border-r border-white/20 font-mono">
                  #
                </th>
                <th scope="col" className="py-3.5 px-5 w-1/3 border-r border-white/20">
                  Flavour Name
                </th>
                <th scope="col" className="py-3.5 px-5 border-r border-white/20">
                  Flavour Profile &amp; Tasting Notes
                </th>
                <th scope="col" className="py-3.5 px-5 text-center w-36">
                  Availability
                </th>
              </tr>
            </thead>

            {/* Excel Rows */}
            <tbody className="divide-y divide-border/50 text-xs font-medium text-foreground">
              {flavorsList.map((flavor, index) => {
                const isSelected = selectedVariantId === flavor.id;

                return (
                  <tr
                    key={flavor.id}
                    onClick={() => {
                      if (flavor.variantObj && onSelectVariant && flavor.available) {
                        onSelectVariant(flavor.variantObj);
                      }
                    }}
                    className={`transition-colors duration-150 group cursor-pointer ${
                      !flavor.available
                        ? "opacity-40 bg-muted/30 cursor-not-allowed"
                        : isSelected
                        ? "bg-primary/15 font-bold text-foreground ring-1 ring-primary/40"
                        : "even:bg-muted/15 odd:bg-card hover:bg-primary/5"
                    }`}
                  >
                    {/* Index Cell */}
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-muted-foreground border-r border-border/40 group-hover:text-primary font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    {/* Flavour Name Cell */}
                    <td className="py-3.5 px-5 border-r border-border/40">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            isSelected ? "bg-primary ring-4 ring-primary/20" : "bg-primary/80 group-hover:scale-125 transition-transform"
                          }`}
                        />
                        <span className={`font-bold text-xs sm:text-sm ${isSelected ? "text-primary font-black" : "text-foreground group-hover:text-primary"}`}>
                          {flavor.title}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-auto" />}
                      </div>
                    </td>

                    {/* Description Cell */}
                    <td className="py-3.5 px-5 border-r border-border/40 text-muted-foreground leading-relaxed text-xs">
                      {flavor.desc}
                    </td>

                    {/* Availability / Select Cell */}
                    <td className="py-3.5 px-5 text-center">
                      {flavor.available ? (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isSelected
                            ? "bg-primary text-white shadow-xs"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors"
                        }`}>
                          {isSelected ? "SELECTED" : flavor.price ? `Dhs. ${flavor.price}` : "IN STOCK"}
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider line-through">
                          OUT OF STOCK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section Footer Note */}
        <div className="mt-6 pt-5 border-t border-border/40 flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>Each blend is crafted to replicate authentic shisha &amp; vape flavours with rich flavor profiles, cooling sensation, and sweet notes.</span>
        </div>

      </div>
    </section>
  );
}
