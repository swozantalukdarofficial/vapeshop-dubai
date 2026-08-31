"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  Star,
  ShieldAlert,
} from "lucide-react";

import { ThemeIcon } from "@/components/ui/theme-icon";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useFooterSettings } from "@/context/ThemeSettingsContext";

export const Footer: React.FC = () => {
  const settings = useFooterSettings();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative mt-4 sm:mt-6 lg:mt-8 bg-card text-foreground font-sans">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />
      {/* ── 1. Top Trust Features (Symmetrical 4 Columns) ──── */}
      <div className="border-b border-border/60 bg-muted/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-border/60">
            {settings.trustItems.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="group flex items-center gap-3.5 py-2 lg:py-1 lg:px-6 first:pl-0 last:pr-0 cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#009966]/10 text-[#009966] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#009966] group-hover:text-white">
                    <ThemeIcon name={item.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-foreground leading-tight truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 2. Main Footer Directory (4 Balanced Columns) ──── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Column 1: Brand & Contact CTA (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/Vape%20Shop%20Dubai%20logo%201.png"
                alt="Vape Shop Dubai"
                width={197}
                height={36}
                className="h-9 w-auto cursor-pointer"
              />
            </Link>

            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              {settings.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>{settings.whatsappLabel}</span>
              </a>

              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/60 border border-border/80 text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-foreground">{settings.ratingText}</span>
              </div>
            </div>
          </div>

          {/* Link columns — merchant-defined in the customizer */}
          {settings.columns.map((column, idx) => (
            <div
              key={idx}
              className={idx === 0 ? "lg:col-span-3 space-y-4" : "lg:col-span-2 space-y-4"}
            >
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest pb-3 border-b border-border/50">
                {column.heading}
              </h4>
              <ul className="space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary hover:translate-x-0.5 transition-all duration-200 block font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact & Dubai Hub (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest pb-3 border-b border-border/50">
              {settings.contactHeading}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-tight">
                  <strong className="text-foreground block font-bold text-xs">{settings.addressLabel}</strong>
                  {settings.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                  className="text-muted-foreground hover:text-primary font-medium transition-colors"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-muted-foreground hover:text-primary font-medium transition-colors truncate"
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-muted-foreground text-xs font-medium">
                  {settings.hoursNote}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── 3. Regulatory & Payment Badges (Clean Dual Box) ── */}
        <div className="mt-12 pt-8 border-t border-border/60 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Health Warning Banner */}
          <div className="lg:col-span-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 text-amber-800 dark:text-amber-200">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs leading-snug">{settings.healthWarning}</p>
          </div>

          {/* Payment & Licensed Retailer Chips */}
          <div className="lg:col-span-4 flex flex-wrap items-center justify-start lg:justify-end gap-2 text-xs">
            {settings.paymentBadges.map((badge, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full bg-muted/70 text-[11px] font-medium text-foreground border border-border/60 flex items-center gap-1.5"
              >
                <ThemeIcon name={badge.icon} className="h-3.5 w-3.5 text-primary" />
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── 4. Bottom Copyright & Quick Links ───────────── */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <p suppressHydrationWarning>{settings.copyright}</p>
            <span className="hidden sm:inline text-border">·</span>
            <p className="text-[11px] sm:text-xs">
              Powered by{" "}
              <a
                href={settings.poweredByHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:text-primary transition-colors underline decoration-primary/40 underline-offset-2"
              >
                {settings.poweredByLabel}
              </a>
            </p>
          </div>

          <div className="flex items-center gap-5 font-medium">
            {settings.bottomLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 text-primary hover:border-primary/40 hover:bg-primary/5 font-bold cursor-pointer transition-all"
              aria-label="Back to top"
            >
              Top <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};



