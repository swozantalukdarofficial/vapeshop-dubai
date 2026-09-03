"use client";

import React from "react";
import { Truck, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";

const POINTS = [
  {
    icon: Truck,
    title: "Same-Day Delivery",
    description: "Express 2-hour delivery across Dubai & UAE.",
    badge: "EXPRESS",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Official scratch-code verified products.",
    badge: "VERIFIED",
  },
  {
    icon: CreditCard,
    title: "Cash / Card on Delivery",
    description: "Pay at doorstep with cash or card.",
    badge: "FLEXIBLE",
  },
  {
    icon: RefreshCw,
    title: "24h Warranty",
    description: "Instant doorstep exchange guarantee.",
    badge: "GUARANTEE",
  },
];

export const Highlights: React.FC = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {POINTS.map((point, i) => {
          const Icon = point.icon;
          return (
            <div
              key={i}
              className="group relative flex items-center gap-3.5 p-3.5 rounded-2xl bg-card border border-border/70 hover:border-primary/60 shadow-xs hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-2xs">
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="text-xs font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors truncate">
                    {point.title}
                  </h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug truncate">
                  {point.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
