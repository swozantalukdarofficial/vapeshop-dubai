"use client";

import React from "react";
import { Check } from "lucide-react";

export function JuulCrispMentholSections({ productName = "JUUL 2 Pods" }: { productName?: string }) {
  // Try to extract just the flavor part if it's a long name, or use the whole name.
  const displayName = productName.replace(/JUUL\s*2/i, "").trim() || "JUUL 2 Pods";

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-12 sm:space-y-16">
      {/* Section 1: Why Choose */}
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-12 shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-foreground leading-none">
              Why Choose <br />
              <span className="text-primary">{productName}</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              If you're choosing a premium pod in the UAE, there are plenty of options to choose from. Not every pod delivers the flavor promise and not every brand meets standards. {productName} breaks that pattern entirely. It is a precision developed blend that performs like a premium product should. Paired with the reliability of the JUUL 2 closed pod system, there is no match for it in the market. For adult smokers who relied on traditional cigarettes, or vapers who have cycled through disappointing pods without finding one worth sticking to, this is the one. Sharp, clean, and consistent in every single draw.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "Sharp and natural authentic flavor that holds from first puff to last without drifting",
                "18mg salt nicotine for smooth, efficient, and genuinely satisfying nicotine delivery",
                "Integrated microchip in every pod for automatic authenticity verification and app tracking",
                "Consistent draw performance maintained right across the full 300 to 400 puff capacity",
                "Leak resistant sealed pod construction — stays clean in a pocket, bag, or car console",
                "No refilling, no coil changes, and absolutely no maintenance required at any stage",
                "Fully compliant with UAE vape regulations and ESMA standards across every unit"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1 rounded-full mt-0.5 shrink-0 border border-primary/20">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Diagram Card */}
          <div className="bg-white border-2 border-zinc-100 rounded-[2rem] p-6 sm:p-8 shadow-xl relative min-h-[500px] flex flex-col justify-center">
            <h3 className="text-center text-sm font-black tracking-widest uppercase mb-12 text-zinc-800">
              WHY CHOOSE {productName}
            </h3>
            <div className="relative flex justify-center items-center h-[350px]">
              {/* Center Image */}
              <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 group">
                 <img src="/juul_menthol_pack.png" alt={productName} className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" />
              </div>
              
              {/* Floating Diagram Labels */}
              <div className="absolute top-0 left-0 bg-white/95 p-2.5 rounded-xl text-[10px] w-36 border border-zinc-200 shadow-sm leading-snug z-20 transition-all hover:border-primary/50">
                <strong className="text-primary">Sharp and natural</strong> authentic flavor that holds from first puff to last without drifting
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white/95 p-2.5 rounded-xl text-[10px] w-36 border border-zinc-200 shadow-sm leading-snug z-20 transition-all hover:border-primary/50">
                <strong className="text-primary">18mg salt nicotine</strong> for smooth, efficient, and genuinely satisfying nicotine delivery
              </div>
              <div className="absolute bottom-0 left-0 bg-white/95 p-2.5 rounded-xl text-[10px] w-36 border border-zinc-200 shadow-sm leading-snug z-20 transition-all hover:border-primary/50">
                <strong className="text-primary">Integrated microchip</strong> in every pod for automatic authenticity verification and app tracking
              </div>
              
              <div className="absolute top-0 right-0 bg-white/95 p-2.5 rounded-xl text-[10px] w-36 border border-zinc-200 shadow-sm leading-snug text-right z-20 transition-all hover:border-primary/50">
                <strong className="text-primary">Leak resistant sealed pod</strong> construction — stays clean in a pocket, bag, or car console
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white/95 p-2.5 rounded-xl text-[10px] w-36 border border-zinc-200 shadow-sm leading-snug text-right z-20 transition-all hover:border-primary/50">
                <strong className="text-primary">No refilling, no coil changes</strong>, and absolutely no maintenance required at any stage
              </div>
              <div className="absolute bottom-0 right-0 bg-white/95 p-2.5 rounded-xl text-[10px] w-36 border border-zinc-200 shadow-sm leading-snug text-right z-20 transition-all hover:border-primary/50">
                <strong className="text-primary">Fully compliant</strong> with UAE vape regulations and ESMA standards across every unit
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Ingredients */}
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-12 shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-foreground leading-none">
              {productName} <br />
              <span className="text-primary">Ingredients</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              The highly regulated {productName} e-liquid is exclusively formulated in the USA using a patented mix of ingredients designed specifically for this exact pod and coil. Here is what is inside every genuinely sourced pod in your 2-pack kit:
            </p>
            <ul className="space-y-4 pt-2">
              {[
                { title: "Propylene Glycol & Vegetable Glycerin", desc: "The base liquids that retain flavor, dictate throat hit, and deliver a smooth and consistent cloud volume from start to finish." },
                { title: "Benzoic Acid", desc: "The crucial component used to provide the signature JUUL satisfaction. It reacts with the nicotine to optimize it. This creates the salt nicotine compound, ensuring it hits smoothly and quickly." },
                { title: "Flavorings", desc: "Proprietary artificial and natural flavorings are formulated to deliver a crisp, clean, and satisfying experience without leaving an artificial aftertaste." },
                { title: "Nicotine", desc: "18mg/mL of pharmaceutical-grade, pure liquid nicotine. Specifically designed for adult smokers." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full mt-0.5 shrink-0 border border-primary/20">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                     <strong className="text-sm text-foreground block font-black">{item.title}</strong>
                     <span className="text-[13px] font-medium text-muted-foreground mt-0.5 block leading-relaxed">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Diagram Card */}
          <div className="bg-white border-2 border-zinc-100 rounded-[2rem] p-6 sm:p-8 shadow-xl relative min-h-[500px] flex flex-col justify-center">
            <h3 className="text-center text-sm font-black tracking-widest uppercase mb-12 text-zinc-800">
              {productName} <br /> INGREDIENTS BREAKDOWN
            </h3>
            <div className="relative flex justify-center items-center h-[350px]">
              {/* Center Image */}
              <div className="relative z-10 w-32 h-48 sm:w-40 sm:h-56 group">
                 <img src="/juul_menthol_pod.png" alt={productName} className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" />
              </div>
              
              <div className="absolute top-10 left-0 bg-white/95 p-3 rounded-xl text-[10px] sm:text-xs w-40 border border-zinc-200 shadow-sm leading-snug z-20 transition-all hover:border-primary/50">
                <strong className="text-primary block mb-1">PROPYLENE GLYCOL / VEGETABLE GLYCERIN</strong>
                <span className="text-[9px] sm:text-[10px] text-zinc-600 font-medium">The base liquids that retain flavor, dictate throat hit, and deliver a smooth cloud from start to finish.</span>
              </div>
              <div className="absolute bottom-10 left-0 bg-white/95 p-3 rounded-xl text-[10px] sm:text-xs w-40 border border-zinc-200 shadow-sm leading-snug z-20 transition-all hover:border-primary/50">
                <strong className="text-primary block mb-1">BENZOIC ACID</strong>
                <span className="text-[9px] sm:text-[10px] text-zinc-600 font-medium">The crucial component used to provide the signature JUUL satisfaction. It reacts with the nicotine to optimize it.</span>
              </div>
              
              <div className="absolute top-10 right-0 bg-white/95 p-3 rounded-xl text-[10px] sm:text-xs w-40 border border-zinc-200 shadow-sm leading-snug text-right z-20 transition-all hover:border-primary/50">
                <strong className="text-primary block mb-1">FLAVORINGS</strong>
                <span className="text-[9px] sm:text-[10px] text-zinc-600 font-medium">Proprietary artificial and natural flavorings formulated to deliver a crisp, clean and authentic taste.</span>
              </div>
              <div className="absolute bottom-10 right-0 bg-white/95 p-3 rounded-xl text-[10px] sm:text-xs w-40 border border-zinc-200 shadow-sm leading-snug text-right z-20 transition-all hover:border-primary/50">
                <strong className="text-primary block mb-1">NICOTINE</strong>
                <span className="text-[9px] sm:text-[10px] text-zinc-600 font-medium">18mg/mL of pharmaceutical-grade, pure liquid nicotine. Specifically designed for adult smokers.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
