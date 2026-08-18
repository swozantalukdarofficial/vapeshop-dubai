"use client";

import React from "react";
import { Sliders, Cpu, ShieldCheck } from "lucide-react";

export interface SpecRow {
  feature: string;
  details: string;
}

interface ProductKeySpecsSectionProps {
  productName: string;
  category?: string;
  brand?: string;
  puffs?: string;
  nicotine?: string;
  battery?: string;
  specsTable?: SpecRow[] | Record<string, string>;
  className?: string;
  settings?: ProductKeySpecsSettings;
}

export interface ProductKeySpecsSettings {
  heading: string;
}

export function ProductKeySpecsSection({
  settings,
  productName,
  category = "",
  brand = "",
  puffs = "",
  nicotine = "",
  battery = "",
  specsTable,
  className = "",
}: ProductKeySpecsSectionProps) {
  // Build dynamic specifications list
  let rows: SpecRow[] = [];

  if (Array.isArray(specsTable) && specsTable.length > 0) {
    rows = specsTable;
  } else if (specsTable && typeof specsTable === "object") {
    rows = Object.entries(specsTable).map(([feature, details]) => ({ feature, details }));
  } else {
    // Generate specs list tailored to product brand/type (MYLE, Disposables, Al Fakher, etc.)
    const isMyle = brand.toLowerCase().includes("myle") || productName.toLowerCase().includes("myle");
    const isDisposable = category.toLowerCase().includes("disposable") || productName.toLowerCase().includes("puffs") || puffs !== "";

    rows = [
      {
        feature: "Puff Count",
        details: puffs ? `${puffs} for extended longevity` : isDisposable ? "High capacity puffs for long-lasting performance" : "Pre-filled high efficiency pod system",
      },
      {
        feature: "Nicotine Strength",
        details: nicotine || (isMyle ? "5% (50mg) & 2% (20mg) Salt Nicotine" : "5% (50mg) Salt Nicotine"),
      },
      {
        feature: "E-Liquid Capacity",
        details: isMyle ? "2.0ml - 4.5ml Pre-filled Pods" : "High capacity pre-filled premium salt nic e-liquid",
      },
      {
        feature: "Battery Capacity",
        details: battery || "High-density rechargeable built-in battery",
      },
      {
        feature: "Charging System",
        details: "USB Type-C ultra-fast charging port",
      },
      {
        feature: "Display",
        details: "LED screen indicator for battery & e-liquid monitoring",
      },
      {
        feature: "Coil Type",
        details: "Advanced Dual Mesh Coil Technology for rich flavor",
      },
      {
        feature: "Coil Resistance",
        details: "Optimized 0.6 - 1.0 ohm sub-ohm coil",
      },
      {
        feature: "Air Intake System",
        details: "Adjustable airflow control slider for custom draw",
      },
      {
        feature: "Vaping Style",
        details: "True MTL (Mouth-to-Lung) & RDTL experience",
      },
      {
        feature: "Experience",
        details: "Bold shisha style flavour delivery, cooling sensation, smooth inhale/exhale, and rich vapor production",
      },
      {
        feature: "Convenience",
        details: `Premium authentic ${productName} with sleek ergonomic design and maximum portability`,
      },
    ];
  }

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
                <span>{settings?.heading || "Key Features & Specifications"}</span>
                <Cpu className="w-5 h-5 text-primary opacity-80" />
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Technical overview and hardware specs for {productName}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Authentic UAE Certified</span>
          </div>
        </div>

        {/* Specifications Table (Matches user mockup image structure with primary brand colors) */}
        <div className="overflow-x-auto rounded-2xl border border-primary/30 shadow-md bg-card scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[550px]">
            
            {/* Header Row (Matches site primary brand theme) */}
            <thead className="bg-primary text-white uppercase text-[11px] sm:text-xs font-black tracking-wider shadow-sm">
              <tr>
                <th scope="col" className="py-4 px-6 w-1/3 text-center border-r border-white/20">
                  Feature
                </th>
                <th scope="col" className="py-4 px-6 text-center">
                  Details
                </th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-border/50 text-xs sm:text-sm font-medium text-foreground">
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="even:bg-muted/15 odd:bg-card hover:bg-primary/5 transition-colors duration-150"
                >
                  {/* Feature Cell */}
                  <td className="py-3.5 px-6 font-bold text-foreground border-r border-border/40 text-center sm:text-center bg-muted/10 w-1/3">
                    {row.feature}
                  </td>

                  {/* Details Cell */}
                  <td className="py-3.5 px-6 text-foreground/90 font-semibold leading-relaxed text-center">
                    {row.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
