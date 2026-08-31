"use client";

import React from "react";
import { Clock, PhoneCall } from "lucide-react";

import { ThemeIcon } from "@/components/ui/theme-icon";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export interface WhatsAppSettings {
  badgeText: string;
  responseNote: string;
  heading: string;
  description: string;
  features: { icon: string; label: string }[];
  contactLabel: string;
  phoneNumber: string;
  phoneDisplay: string;
  prefilledMessage: string;
  buttonText: string;
}

export const WhatsAppContactSection: React.FC<{
  settings: WhatsAppSettings;
}> = ({ settings }) => {

  const digits = settings.phoneNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${digits}?text=${encodeURIComponent(
    settings.prefilledMessage
  )}`;

  return (
    <section className="relative overflow-hidden bg-card border border-primary/20 rounded-[2rem] p-5 sm:p-7 lg:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">

        {/* Left Column: Info & Copy */}
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {settings.badgeText}
            </span>
            {settings.responseNote && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {settings.responseNote}
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground tracking-tight leading-[0.95]">
            {settings.heading}
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {settings.description}
          </p>

          {/* Feature Badges */}
          {settings.features.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 text-xs font-bold text-foreground/90">
              {settings.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-muted/60 border border-border/40 px-3.5 py-2 rounded-xl"
                >
                  <ThemeIcon name={feature.icon} className="w-4 h-4 text-primary" />
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Big CTA Card */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col items-center gap-4 bg-card border border-border/60 p-6 sm:p-8 rounded-3xl text-center shadow-sm min-w-[260px]">
          <div className="space-y-1 text-center">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
              {settings.contactLabel}
            </span>
            <div className="text-base font-extrabold text-foreground tracking-wide flex items-center justify-center gap-2">
              <PhoneCall className="w-4 h-4 text-primary" />
              <span>{settings.phoneDisplay}</span>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-3 bg-primary hover:bg-gold-shimmer text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>{settings.buttonText}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
