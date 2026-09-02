"use client";

import React from "react";

export interface DisposableComparisonSettings {
  puffHeading: string;
  deviceHeading: string;
}

export function DisposableComparisonSections({
  settings,
}: { settings?: DisposableComparisonSettings } = {}) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* ── SECTION 1: CHOOSING THE RIGHT PUFF COUNT ── */}
      <div className="space-y-4">
        {/* Header with orange vertical line */}
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block" />
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-foreground">
            {settings?.puffHeading || "CHOOSING THE RIGHT PUFF COUNT"}
          </h3>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm bg-card">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-primary text-white font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                <th className="py-3.5 px-5 w-1/3 border-r border-white/10">PUFF COUNT</th>
                <th className="py-3.5 px-5 w-1/3 border-r border-white/10">BEST FOR</th>
                <th className="py-3.5 px-5 w-1/3">APPROX. DURATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium text-foreground/90">
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">600–1,500 puffs</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Occasional or light users</td>
                <td className="py-3.5 px-5 text-muted-foreground">1–3 days</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors bg-muted/5">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">2,000–4,000 puffs</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Everyday moderate vaping</td>
                <td className="py-3.5 px-5 text-muted-foreground">4–7 days</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">5,000–8,000 puffs</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Regular daily users</td>
                <td className="py-3.5 px-5 text-muted-foreground">1–2 weeks</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors bg-muted/5">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">10,000–15,000 puffs</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Frequent vapers seeking longer use</td>
                <td className="py-3.5 px-5 text-muted-foreground">2–3 weeks</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">20,000–30,000+ puffs</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Heavy users and extended usage</td>
                <td className="py-3.5 px-5 text-muted-foreground">3–5 weeks</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted-foreground italic pl-1">
          *Puff counts are based on standard draw length. Longer draws will reduce actual count.
        </p>
      </div>

      {/* ── SECTION 2: SIDE-BY-SIDE COMPARISON ── */}
      <div className="space-y-4">
        {/* Header with orange vertical line */}
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block" />
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-foreground">
            {settings?.deviceHeading || "SIDE-BY-SIDE COMPARISON"}
          </h3>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm bg-card">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-primary text-white font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                <th className="py-3.5 px-5 w-1/4 border-r border-white/10">FEATURE</th>
                <th className="py-3.5 px-5 w-1/4 border-r border-white/10">ELF BAR ICE KING PRO 40000</th>
                <th className="py-3.5 px-5 w-1/4 border-r border-white/10">AL FAKHER E-HOSE X 60000</th>
                <th className="py-3.5 px-5 w-1/4">TUGBOAT T12000</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium text-foreground/90">
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">Puff Count</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Up to 40,000 Puffs</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Up to 60,000 Puffs</td>
                <td className="py-3.5 px-5 text-muted-foreground">Up to 12,000 Puffs</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors bg-muted/5">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">Nicotine</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">50mg (5%)</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">50mg (5%)</td>
                <td className="py-3.5 px-5 text-muted-foreground">50mg (5%)</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">E-Liquid Capacity</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Approx. 40ml</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Approx. 60ml</td>
                <td className="py-3.5 px-5 text-muted-foreground">Approx. 18ml</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors bg-muted/5">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">Battery Capacity</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Rechargeable 850mAh</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Rechargeable 900mAh</td>
                <td className="py-3.5 px-5 text-muted-foreground">Rechargeable 650mAh</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">Charging Port</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">USB Type-C</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">USB Type-C</td>
                <td className="py-3.5 px-5 text-muted-foreground">USB Type-C</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors bg-muted/5">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">Display Screen</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Smart LED Display</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Digital Display</td>
                <td className="py-3.5 px-5 text-muted-foreground">Battery Indicator</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">Coil Technology</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Dual Mesh Coil</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Advanced Mesh Coil</td>
                <td className="py-3.5 px-5 text-muted-foreground">Mesh Coil</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors bg-muted/5">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">Airflow Control</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Adjustable Airflow</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Adjustable Airflow</td>
                <td className="py-3.5 px-5 text-muted-foreground">Fixed Airflow</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">Flavor Style</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Ice &amp; Fruit Blends</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Shisha-Inspired Flavors</td>
                <td className="py-3.5 px-5 text-muted-foreground">Classic Fruit &amp; Mint Flavors</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors bg-muted/5">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">Best For</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Long-lasting premium vaping</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Maximum puff longevity</td>
                <td className="py-3.5 px-5 text-muted-foreground">Compact daily vaping</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-5 font-bold text-foreground border-r border-border/30">Device Type</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Rechargeable Disposable</td>
                <td className="py-3.5 px-5 border-r border-border/30 text-muted-foreground">Rechargeable Disposable</td>
                <td className="py-3.5 px-5 text-muted-foreground">Rechargeable Disposable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
