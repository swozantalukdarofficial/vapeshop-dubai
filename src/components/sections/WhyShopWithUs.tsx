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
    color: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    icon: ShieldCheck,
    title: "100% Guaranteed Authentic",
    subtitle: "Directly imported from official certified factory distributors. Every device and pod box includes QR scratch codes for instant genuine verification.",
    badge: "Certified Original",
    color: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    icon: CreditCard,
    title: "Cash & Card on Delivery",
    subtitle: "Pay conveniently at your door. Our delivery drivers carry mobile wireless POS terminals accepting Visa, Mastercard, Apple Pay, and cash.",
    badge: "Flexible Payment",
    color: "from-blue-500/20 via-indigo-500/10 to-transparent",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    icon: Headphones,
    title: "24/7 Dedicated WhatsApp Support",
    subtitle: "Need product advice or instant order tracking? Our Dubai vape specialists are available 24/7 on WhatsApp to assist you immediately.",
    badge: "Always Available",
    color: "from-emerald-500/20 via-green-500/10 to-transparent",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    icon: Tag,
    title: "Direct Wholesale Pricing",
    subtitle: "Enjoy direct distributor wholesale prices, multi-pack bundle savings on JUUL & disposables, and exclusive seasonal promotions in Dubai.",
    badge: "Best Value",
    color: "from-purple-500/20 via-pink-500/10 to-transparent",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    icon: RefreshCw,
    title: "Zero-Hassle Free Replacements",
    subtitle: "If any factory unit is defective upon unboxing, our express driver will replace it immediately with a brand new sealed box at no cost.",
    badge: "Buyer Protection",
    color: "from-rose-500/20 via-orange-500/10 to-transparent",
    iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  },
];

export function WhyShopWithUs() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-md transition-all duration-300">
        {/* Subtle Ambient Glowing Gradients */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-border/40 mb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
              <Award className="w-4 h-4 text-primary" />
              <span>The Dubai Vape Standard</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">
              Why Shop With <span className="text-primary">Vape Shop Dubai?</span>
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
              We are Dubai&apos;s most trusted online vape store delivering 100% authentic devices, Disposable Vapes, Pod Systems, JUUL, MYLE, and E-Liquids directly to your doorstep.
            </p>
          </div>

          {/* UAE Guarantee Pill */}
          <div className="flex items-center gap-3 bg-background border border-border/80 px-5 py-3 rounded-2xl shadow-sm self-start lg:self-auto">
            <Building2 className="w-6 h-6 text-primary shrink-0" />
            <div>
              <div className="text-xs font-black text-foreground uppercase tracking-wider">
                Licensed UAE Importer
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">
                Serving Dubai, Abu Dhabi, Sharjah &amp; All Emirates
              </div>
            </div>
          </div>
        </div>

        {/* 6 Value Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;

            return (
              <div
                key={idx}
                className="group relative bg-background border border-border/80 hover:border-primary rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
              >
                {/* Background Accent Tint */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div>
                  {/* Top Badge & Icon */}
                  <div className="relative z-10 flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl border p-3 flex items-center justify-center ${pillar.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-primary" />
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-foreground/80 font-medium leading-relaxed">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>

                {/* Footer Checkmark Guarantee */}
                <div className="relative z-10 mt-6 pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
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
