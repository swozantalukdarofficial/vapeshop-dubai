"use client";

import React from "react";
import { Check } from "lucide-react";

export interface WhyChooseItem {
  title: string;
  description: string;
}

interface WhyChooseProductSectionProps {
  productName: string;
  puffs?: string;
  className?: string;
  settings?: WhyChooseProductSettings;
}

export interface WhyChooseProductSettings {
  /** `{product}` is replaced with the product name. */
  headingTemplate: string;
  /** `{product}` and `{puffs}` are both substituted. */
  introTemplate: string;
  items: WhyChooseItem[];
  /** `{product}` is substituted. Blank hides the footnote. */
  footnoteTemplate: string;
}

const FALLBACK_HEADING = "Why Choose the {product}?";

export function WhyChooseProductSection({
  settings,
  productName,
  puffs = "",
  className = "",
}: WhyChooseProductSectionProps) {
  // Puff count is read off the product, falling back to whatever the title
  // advertises ("8000 puffs") so merchant copy using {puffs} still reads well
  // on products that never filled the field in.
  const puffCount =
    puffs ||
    productName.match(/\d+[\d,]*(?:\s*puffs|\s*puff|\s*k)/i)?.[0] ||
    "8,000 puffs";

  const fill = (template: string) =>
    template.split("{product}").join(productName).split("{puffs}").join(puffCount);

  const heading = fill(settings?.headingTemplate || FALLBACK_HEADING);
  const intro = settings?.introTemplate ? fill(settings.introTemplate) : "";
  const items = settings?.items ?? [];
  const footnote = settings?.footnoteTemplate ? fill(settings.footnoteTemplate) : "";

  return (
    <section className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 ${className}`}>
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden transition-all duration-300">

        {/* Top subtle brand accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        {/* Section Header with Left Vertical Accent Bar */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 mb-3.5 sm:mb-4">
          <span className="w-1.5 h-7 sm:h-8 bg-primary rounded-full inline-block shrink-0 shadow-xs mt-0.5 sm:mt-0" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-foreground tracking-tight">
            {heading}
          </h2>
        </div>

        {/* Subtitle / Intro Paragraph */}
        {intro && (
          <p className="text-xs sm:text-sm md:text-[15px] text-muted-foreground font-medium leading-relaxed max-w-5xl mb-6 sm:mb-8 pl-0.5">
            {intro}
          </p>
        )}

        {/* Feature Cards Stack */}
        {items.length > 0 && (
          <div className="space-y-3 sm:space-y-3.5">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start sm:items-center gap-3 sm:gap-3.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-background/80 hover:bg-card border border-border/70 hover:border-primary/40 transition-all duration-200 shadow-2xs hover:shadow-xs group"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors duration-200 shadow-2xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  <strong className="font-extrabold text-foreground">{item.title}: </strong>
                  <span className="text-muted-foreground font-medium">{fill(item.description)}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer Keyword & Value Note */}
        {footnote && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-border/40 pl-0.5">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
              {footnote}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
