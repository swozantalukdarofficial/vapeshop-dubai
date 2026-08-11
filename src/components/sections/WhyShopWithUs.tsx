"use client";

import React from "react";
import {
  ShieldCheck,
  CreditCard,
  Headphones,
  Tag,
  RefreshCw,
  Award,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
} from "lucide-react";

export interface ValuePillar {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  iconBg: string;
}

const PILLARS: ValuePillar[] = [
  {
    icon: Truck,
    title: "2-Hour Express Dubai Delivery",
    subtitle: "Order before 10:00 PM for guaranteed 2-hour express delivery anywhere in Dubai. Same-day delivery across Abu Dhabi & all UAE Emirates.",
    badge: "Express Speed",
    color: "",
    iconBg: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: ShieldCheck,
    title: "100% Guaranteed Authentic",
    subtitle: "Directly imported from official certified factory distributors. Every device and pod box includes QR scratch codes for instant genuine verification.",
    badge: "Certified Original",
    color: "",
    iconBg: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: CreditCard,
    title: "Cash & Card on Delivery",
    subtitle: "Pay conveniently at your door. Our delivery drivers carry mobile wireless POS terminals accepting Visa, Mastercard, Apple Pay, and cash.",
    badge: "Flexible Payment",
    color: "",
    iconBg: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: Headphones,
    title: "24/7 Dedicated WhatsApp Support",
    subtitle: "Need product advice or instant order tracking? Our Dubai vape specialists are available 24/7 on WhatsApp to assist you immediately.",
    badge: "Always Available",
    color: "",
    iconBg: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: Tag,
    title: "Direct Wholesale Pricing",
    subtitle: "Enjoy direct distributor wholesale prices, multi-pack bundle savings on JUUL & disposables, and exclusive seasonal promotions in Dubai.",
    badge: "Best Value",
    color: "",
    iconBg: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: RefreshCw,
    title: "Zero-Hassle Free Replacements",
    subtitle: "If any factory unit is defective upon unboxing, our express driver will replace it immediately with a brand new sealed box at no cost.",
    badge: "Buyer Protection",
    color: "",
    iconBg: "bg-primary/10 text-primary border-primary/20",
  },
];

export function WhyShopWithUs() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
      <div className="bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 lg:p-8 relative overflow-hidden shadow-md transition-all duration-300">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-border/40 mb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] px-3.5 py-1 rounded-full">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span>The Dubai Vape Standard</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-black text-foreground tracking-tight leading-tight">
              Why Shop With <span className="text-primary">Vape Shop Dubai?</span>
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
              We are Dubai&apos;s most trusted online vape store delivering 100% authentic devices, Disposable Vapes, Pod Systems, JUUL, MYLE, and E-Liquids directly to your doorstep.
            </p>
          </div>

          {/* UAE Guarantee Pill */}
          <div className="flex items-center gap-2.5 bg-card border border-border/80 px-4 py-2.5 rounded-xl shadow-xs self-start lg:self-auto">
            <Building2 className="w-5 h-5 text-primary shrink-0" />
            <div>
              <div className="text-xs font-black text-foreground uppercase tracking-wider">
                Licensed UAE Importer
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">
                Serving Dubai, Abu Dhabi, Sharjah &amp; All Emirates
              </div>
            </div>
          </div>
        </div>

        {/* 6 Value Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;

            return (
              <div
                key={idx}
                className="group relative bg-card border border-border/70 hover:border-primary/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl border p-2 flex items-center justify-center ${pillar.iconBg} shadow-xs group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="inline-flex items-center gap-1 bg-muted/60 border border-border/60 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-colors">
                      <ShieldCheck className="w-3 h-3 text-primary" />
                      {pillar.badge}
                    </span>
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
                <div className="relative z-10 mt-4 pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified Service Commitment</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
