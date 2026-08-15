"use client";

import React from "react";
import { Truck, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";

const POINTS = [
  {
    icon: Truck,
    title: "Same-Day Delivery",
    description: "Express 2-hour delivery across Dubai, and next-day across the UAE.",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Directly from official sources with scratch-code verification.",
  },
  {
    icon: CreditCard,
    title: "Cash / Card on Delivery",
    description: "No pre-payment required. Pay at your door with cash or card.",
  },
  {
    icon: RefreshCw,
    title: "24h Warranty",
    description: "Device issue? We exchange it at your door within 24 hours.",
  },
];

export const Highlights: React.FC = () => {
  return (
    <div className="bg-card/45 backdrop-blur-sm border border-border/30 rounded-2xl py-4 px-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x lg:divide-border/20">
        {POINTS.map((point, i) => {
          const Icon = point.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3.5 py-2 sm:py-3 lg:py-1.5 lg:px-6 first:pl-0 last:pr-0 border-t first:border-t-0 sm:border-t-0"
            >
              {/* Icon container */}
              <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4.5 w-4.5 text-primary" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-foreground tracking-wide leading-tight">{point.title}</h3>
                <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 line-clamp-1">{point.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
