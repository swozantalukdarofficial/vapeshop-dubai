"use client";

import React from "react";
import { Check } from "lucide-react";

export interface WhyChooseItem {
  title: string;
  description: string;
}

interface WhyChooseProductSectionProps {
  productName: string;
  brand?: string;
  category?: string;
  puffs?: string;
  introDescription?: string;
  items?: WhyChooseItem[];
  footerNote?: string;
  className?: string;
}

export function WhyChooseProductSection({
  productName,
  brand = "",
  category = "",
  puffs = "",
  introDescription,
  items,
  footerNote,
  className = "",
}: WhyChooseProductSectionProps) {
  // Determine puff count representation
  const puffCount = puffs || (productName.match(/\d+[\d,]*(?:\s*puffs|\s*puff|\s*k)/i)?.[0] || "8,000 puffs");

  // Default intro text matching reference design
  const defaultIntro =
    introDescription ||
    `The ${productName} is a strong choice if you want an affordable disposable vape that still feels premium in everyday use. It's compact, easy to carry, rechargeable, and designed for a smooth draw with consistent taste—making it a great best vape for beginner and best vape for new user option.`;

  // Default 5 feature cards matching reference mockup
  const defaultItems: WhyChooseItem[] = items && items.length > 0 ? items : [
    {
      title: "Affordable vape",
      description: `Great value for users who want ${puffCount} in a compact disposable vape.`,
    },
    {
      title: "Rechargeable disposable vape",
      description: "Type C charging helps you finish the e-liquid instead of losing puffs to a dead battery.",
    },
    {
      title: "Best disposable vape for flavor output",
      description: "Mesh coil design supports richer taste and better flavour consistency.",
    },
    {
      title: "Best disposable vape for vapor cloud",
      description: "Balanced vapour production with smooth inhale feel.",
    },
    {
      title: "Best portable vape",
      description: "Pocket-size vape build that's easy to hold (palm fit vape feel) and easy to travel with around Dubai.",
    },
  ];

  // Default SEO keyword bottom note
  const defaultFooter =
    footerNote ||
    `If you want a cheap one search for ${productName.toLowerCase()} best deal or ${productName.toLowerCase()} offer in Dubai and ${productName.toLowerCase()} cheap pricing during stock sale.`;

  return (
    <section className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 ${className}`}>
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden transition-all duration-300">
        
        {/* Top subtle brand accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        {/* Section Header with Left Vertical Accent Bar */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 mb-3.5 sm:mb-4">
          <span className="w-1.5 h-7 sm:h-8 bg-primary rounded-full inline-block shrink-0 shadow-xs mt-0.5 sm:mt-0" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-foreground tracking-tight">
            Why Choose the <span className="text-primary">{productName}</span>?
          </h2>
        </div>

        {/* Subtitle / Intro Paragraph */}
        <p className="text-xs sm:text-sm md:text-[15px] text-muted-foreground font-medium leading-relaxed max-w-5xl mb-6 sm:mb-8 pl-0.5">
          {defaultIntro}
        </p>

        {/* Feature Cards Stack */}
        <div className="space-y-3 sm:space-y-3.5">
          {defaultItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start sm:items-center gap-3 sm:gap-3.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-background/80 hover:bg-card border border-border/70 hover:border-primary/40 transition-all duration-200 shadow-2xs hover:shadow-xs group"
            >
              <div className="w-5 h-5 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors duration-200 shadow-2xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <strong className="font-extrabold text-foreground">{item.title}: </strong>
                <span className="text-muted-foreground font-medium">{item.description}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Footer Keyword & Value Note */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-border/40 pl-0.5">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
            {defaultFooter}
          </p>
        </div>

      </div>
    </section>
  );
}
