"use client";

import React from "react";
import { MessageCircle, Clock, ShieldCheck, Zap, PhoneCall } from "lucide-react";

export const WhatsAppContactSection: React.FC = () => {
  const whatsappUrl =
    "https://wa.me/971582839787?text=Hello%20Vape%20Shop%20Dubai%2C%20I%20need%20assistance%20or%20would%20like%20to%20place%20an%20order!";

  return (
    <section className="relative overflow-hidden bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 lg:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        
        {/* Left Column: Info & Copy */}
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live WhatsApp Support
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Avg Response &lt; 2 Mins
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-foreground tracking-tight leading-tight">
            Need Help Choosing or Prefer Direct WhatsApp Ordering?
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Connect directly with our Dubai vape specialists. Get instant flavor recommendations, custom bundle discounts, or place your order directly via WhatsApp for 2-hour express delivery.
          </p>

          {/* Feature Badges */}
          <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 text-xs font-bold text-foreground/90">
            <div className="flex items-center gap-2 bg-muted/60 border border-border/40 px-3.5 py-2 rounded-xl">
              <Zap className="w-4 h-4 text-primary" />
              <span>2-Hour Express Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/60 border border-border/40 px-3.5 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>100% Authentic Products</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/60 border border-border/40 px-3.5 py-2 rounded-xl">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Cash / Card on Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Big CTA Card */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col items-center gap-4 bg-card border border-border/60 p-6 sm:p-8 rounded-3xl text-center shadow-sm min-w-[260px]">
          <div className="space-y-1 text-center">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
              Official Contact
            </span>
            <div className="text-base font-extrabold text-foreground tracking-wide flex items-center justify-center gap-2">
              <PhoneCall className="w-4 h-4 text-primary" />
              <span>+971 58 283 9787</span>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-3 bg-primary hover:bg-gold-shimmer text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
