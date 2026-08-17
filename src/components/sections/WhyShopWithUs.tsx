"use client";

import React from "react";
import { Award, Building2, CheckCircle2, ShieldCheck } from "lucide-react";

import { ThemeIcon } from "@/components/ui/theme-icon";

export interface ValuePillarItem {
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
}

export interface WhyShopSettings {
  badgeText: string;
  headingLead: string;
  headingHighlight: string;
  description: string;
  pillTitle: string;
  pillSubtitle: string;
  footerNote: string;
  pillars: ValuePillarItem[];
}

export function WhyShopWithUs({ settings }: { settings: WhyShopSettings }) {

  return (
    <div className="w-full bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 lg:p-8 relative overflow-hidden shadow-md transition-all duration-300">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-border/40 mb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] px-3.5 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span>{settings.badgeText}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-foreground tracking-tight leading-tight">
            {settings.headingLead}{" "}
            <span className="text-primary">{settings.headingHighlight}</span>
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
            {settings.description}
          </p>
        </div>

        {/* UAE Guarantee Pill */}
        <div className="flex items-center gap-2.5 bg-card border border-border/80 px-4 py-2.5 rounded-xl shadow-xs self-start lg:self-auto">
          <Building2 className="w-5 h-5 text-primary shrink-0" />
          <div>
            <div className="text-xs font-black text-foreground uppercase tracking-wider">
              {settings.pillTitle}
            </div>
            <div className="text-[10px] text-muted-foreground font-medium">
              {settings.pillSubtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Value Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {settings.pillars.map((pillar, idx) => {
          return (
            <div
              key={idx}
              className="group relative bg-card border border-border/70 hover:border-primary/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl border p-2 flex items-center justify-center bg-primary/10 text-primary border-primary/20 shadow-xs group-hover:scale-105 transition-transform duration-300">
                    <ThemeIcon name={pillar.icon} className="w-5 h-5" />
                  </div>

                  {pillar.badge && (
                    <span className="inline-flex items-center gap-1 bg-muted/60 border border-border/60 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-colors">
                      <ShieldCheck className="w-3 h-3 text-primary" />
                      {pillar.badge}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div className="relative z-10 space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-serif font-black text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>

              {/* Footer Checkmark Guarantee */}
              {settings.footerNote && (
                <div className="relative z-10 mt-4 pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{settings.footerNote}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
