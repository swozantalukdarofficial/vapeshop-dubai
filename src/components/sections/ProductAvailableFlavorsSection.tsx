"use client";

import React, { useState } from "react";
import { CheckCircle2, Flame, Check, Table, HelpCircle, ChevronDown } from "lucide-react";

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
  productFlavorNotes?: FlavorNote[];
  onSelectVariant?: (variant: any) => void;
  className?: string;
  settings?: ProductFlavorsSettings;
  hideIfEmpty?: boolean;
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

function getFlavorDescription(
  flavorTitle: string,
  productName: string,
  notes: FlavorNote[] = []
): string {
  const cleanTitle = flavorTitle.toLowerCase().trim();
  // Strip pack size suffix for matching ("Grape Ice / 1Pc/1Device" -> "grape ice")
  const baseFlavor = cleanTitle.replace(/\s*\/\s*(1pc|10pc|5pc|3pc|20pc|50pc|100pc)\/[^\s].*$/i, "").trim();

  // A note typed in the customizer or from metafield always wins over the built-in dictionary.
  const authored = notes.find((note) => {
    const noteKey = note.flavor?.toLowerCase().trim();
    return noteKey && note.description && (noteKey === cleanTitle || noteKey === baseFlavor || baseFlavor.includes(noteKey) || noteKey.includes(baseFlavor));
  });
  if (authored) return authored.description;

  // Exact match in known dictionary
  if (KNOWN_FLAVOR_DESCRIPTIONS[baseFlavor]) {
    return KNOWN_FLAVOR_DESCRIPTIONS[baseFlavor];
  }

  // Partial match search
  for (const [key, desc] of Object.entries(KNOWN_FLAVOR_DESCRIPTIONS)) {
    if (baseFlavor.includes(key) || key.includes(baseFlavor)) {
      return desc;
    }
  }

  // Generate clean fallback description
  return `Authentic ${flavorTitle} blend with rich flavor profile, smooth throat hit, and refreshing finish.`;
}

export interface FlavorNote {
  /** Variant name this note belongs to. Matched case-insensitively. */
  flavor: string;
  description: string;
}

export interface ProductFlavorsSettings {
  heading: string;
  /** `{product}` is replaced with the product name. */
  subheadingTemplate: string;
  /** `{count}` is replaced with the number of flavours. Blank hides the badge. */
  countBadgeTemplate: string;
  nameColumnLabel: string;
  profileColumnLabel: string;
  availabilityColumnLabel: string;
  inStockLabel: string;
  outOfStockLabel: string;
  selectedLabel: string;
  /** Show the variant price in place of the in-stock label. */
  showPrices: boolean;
  /** Merchant overrides for individual flavours. */
  flavorNotes: FlavorNote[];
  footnote: string;
}

export function ProductAvailableFlavorsSection({
  settings,
  variants = [],
  productName,
  productCategory,
  selectedVariantId,
  productFlavorNotes,
  onSelectVariant,
  className = "",
  hideIfEmpty = false,
}: ProductAvailableFlavorsSectionProps) {
  
  const notes = [...(productFlavorNotes || []), ...(settings?.flavorNotes ?? [])];

  // Filter valid variants (ignore single default variant if titled "Default Title")
  const validVariants = variants.filter((v) => v.title && v.title.toLowerCase() !== "default title" && v.title.toLowerCase() !== "default");

  const hasFlavorData = validVariants.length > 1 || (productFlavorNotes && productFlavorNotes.length > 0);

  if (hideIfEmpty && !hasFlavorData) {
    return null;
  }

  // Group variants by base flavor name (strip pack size suffixes)
  // Handles: "/ 1Pc/1Device", "/ 10Pc/1Box", "/ SINGLE/1PC", "/ 1BOX/10PCS", "/ Single Pack", "/ 10Pack/1Box"
  function extractBaseFlavor(title: string): string {
    return title
      .replace(/\s*\/\s*(SINGLE|1PC|1Pc|10Pc|5Pc|3Pc|20Pc|50Pc|100Pc|1BOX|10PCS|Single Pack|10Pack)[\s/]?.*/i, "")
      .trim();
  }

  interface FlavorGroup {
    baseName: string;
    variants: typeof validVariants;
    desc: string;
    anyAvailable: boolean;
  }

  const groupedFlavors: FlavorGroup[] = [];
  const seenFlavors = new Map<string, FlavorGroup>();

  for (const v of validVariants) {
    const baseName = extractBaseFlavor(v.title);
    const key = baseName.toLowerCase();

    if (seenFlavors.has(key)) {
      seenFlavors.get(key)!.variants.push(v);
      if (v.availableForSale) seenFlavors.get(key)!.anyAvailable = true;
    } else {
      const group: FlavorGroup = {
        baseName,
        variants: [v],
        desc: getFlavorDescription(baseName, productName, notes),
        anyAvailable: v.availableForSale,
      };
      seenFlavors.set(key, group);
      groupedFlavors.push(group);
    }
  }

function extractFlavorFromProductName(name: string): string {
  let cleaned = name
    .replace(/juul\s*\d*\s*(pods|device|kit|starter kit)?/gi, "")
    .replace(/myle\s*(meta|v5|v4|micro|drip)?\s*(pods|device|kit)?/gi, "")
    .replace(/disposable\s*(vape|device|pod)?/gi, "")
    .replace(/\d+\s*(mg|puffs|puff|k|ml|pack|pcs|pc)/gi, "")
    .replace(/\|?\s*made in [a-z]+/gi, "")
    .replace(/\b(in uae|dubai|uae|vape|pods|pod|kit|device)\b/gi, "")
    .trim();

  return cleaned || name;
}

  // Determine flavor list to display
  const singleFlavorTitle = extractFlavorFromProductName(productName);
  const flavorsList = groupedFlavors.length > 0
    ? groupedFlavors.map((group, i) => ({
        id: group.variants[0].id,
        variantObj: group.variants[0],
        allVariants: group.variants,
        title: group.baseName,
        desc: group.desc,
        available: group.anyAvailable,
        price: group.variants[0].price,
      }))
    : [
        {
          id: variants[0]?.id || "single-flavor",
          variantObj: variants[0] || null,
          allVariants: variants,
          title: singleFlavorTitle,
          desc: getFlavorDescription(singleFlavorTitle, productName, notes),
          available: variants[0]?.availableForSale ?? true,
          price: variants[0]?.price ?? null,
        },
      ];

  const subheading = (
    settings?.subheadingTemplate ?? "Complete flavor profile spreadsheet table for {product}"
  )
    .split("{product}")
    .join(productName);
  const countBadge = (settings?.countBadgeTemplate ?? "{count} Signature Options")
    .split("{count}")
    .join(String(flavorsList.length));
  const inStockLabel = settings?.inStockLabel || "IN STOCK";
  const outOfStockLabel = settings?.outOfStockLabel || "OUT OF STOCK";
  const selectedLabel = settings?.selectedLabel || "SELECTED";
  const showPrices = settings?.showPrices !== false;
  const footnote = settings?.footnote ?? "";

  const [showAllFlavors, setShowAllFlavors] = useState(false);
  const visibleFlavors = showAllFlavors ? flavorsList : flavorsList.slice(0, 5);

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
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans font-body font-extrabold text-foreground tracking-tight flex items-center gap-2">
                <span>{settings?.heading || "Available Flavours"}</span>
                <Table className="w-5 h-5 sm:w-6 sm:h-6 text-primary opacity-80" />
              </h3>
              {subheading && (
                <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-0.5">{subheading}</p>
              )}
            </div>
          </div>

          {countBadge && (
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full self-start sm:self-auto">
              <Flame className="w-3.5 h-3.5 text-primary" />
              <span>{countBadge}</span>
            </div>
          )}
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
                  {settings?.nameColumnLabel || "Flavour Name"}
                </th>
                <th scope="col" className="py-3.5 px-5 border-r border-white/20">
                  {settings?.profileColumnLabel || "Flavour Profile & Tasting Notes"}
                </th>
                <th scope="col" className="py-3.5 px-5 text-center w-36">
                  {settings?.availabilityColumnLabel || "Availability"}
                </th>
              </tr>
            </thead>

            {/* Excel Rows */}
            <tbody className="divide-y divide-border/50 text-xs font-medium text-foreground">
              {visibleFlavors.map((flavor, index) => {
                const isSelected = flavor.allVariants?.some((v: any) => selectedVariantId === v.id) || selectedVariantId === flavor.id;

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

                    {/* Availability / Pack Options Cell */}
                    <td className="py-3.5 px-5 text-center">
                      {flavor.available ? (
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {flavor.allVariants && flavor.allVariants.length > 1 ? (
                            flavor.allVariants.map((v: any, vi: number) => {
                              // Extract pack label from variant title suffix
                              let packLabel = "1Pc";
                              const t = v.title || "";
                              if (/1BOX|10PCS|10Pc|10Pack/i.test(t)) packLabel = "Box";
                              else if (/SINGLE|1PC|1Pc|Single Pack/i.test(t)) packLabel = "1Pc";
                              else if (/5Pc|5Pack/i.test(t)) packLabel = "5Pc";
                              else if (/3Pc|3Pack/i.test(t)) packLabel = "3Pc";
                              else if (/20Pc/i.test(t)) packLabel = "20Pc";
                              const isThisSelected = selectedVariantId === v.id;
                              return (
                                <button
                                  key={v.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (v.availableForSale && onSelectVariant) onSelectVariant(v);
                                  }}
                                  disabled={!v.availableForSale}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors whitespace-nowrap ${
                                    isThisSelected
                                      ? "bg-primary text-white shadow-xs"
                                      : v.availableForSale
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-primary hover:text-white hover:border-primary"
                                      : "bg-muted text-muted-foreground line-through opacity-50 cursor-not-allowed"
                                  }`}
                                >
                                  {isThisSelected ? `✓ ${packLabel}` : showPrices && v.price ? `${packLabel}: Dhs. ${v.price}` : `${packLabel}: ${inStockLabel}`}
                                </button>
                              );
                            })
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isSelected
                                ? "bg-primary text-white shadow-xs"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors"
                            }`}>
                              {isSelected
                                ? selectedLabel
                                : showPrices && flavor.price
                                ? `Dhs. ${flavor.price}`
                                : inStockLabel}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider line-through">
                          {outOfStockLabel}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* See More Flavors Button */}
        {flavorsList.length > 5 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllFlavors((prev) => !prev)}
              className="inline-flex items-center gap-2 bg-primary hover:bg-gold-shimmer text-white px-8 py-3.5 rounded-full text-xs font-sans font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-white" />
              <span>
                {showAllFlavors
                  ? "Show Less Flavors"
                  : `See More Flavors (${flavorsList.length - 5} More)`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAllFlavors ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}

        {/* Section Footer Note */}
        {footnote && (
          <div className="mt-6 pt-5 border-t border-border/40 flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>{footnote}</span>
          </div>
        )}

      </div>
    </section>
  );
}
