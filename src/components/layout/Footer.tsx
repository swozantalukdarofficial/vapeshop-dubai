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
  ChevronRight,
} from "lucide-react";

import { ThemeIcon } from "@/components/ui/theme-icon";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import {
  VisaIcon,
  MastercardIcon,
  ApplePayIcon,
  GooglePayIcon,
  CodPaymentIcon,
  UaeFlagIcon,
} from "@/components/ui/payment-icons";
import { useFooterSettings } from "@/context/ThemeSettingsContext";

export const Footer: React.FC = () => {
  const settings = useFooterSettings();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative mt-2 sm:mt-3 lg:mt-4 bg-card text-foreground font-sans border-t border-border/50">
      {/* ── 1. Top Trust Features (Realistic Handcrafted Luxury Cards) ──── */}
      <div className="border-b border-border/60 bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20 py-7 sm:py-9 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 sm:gap-5 lg:gap-6">
            {settings.trustItems.map((item, idx) => {
              const badges = [
                { label: "EXPRESS", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
                { label: "VERIFIED", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
                { label: "FLEXIBLE", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
                { label: "24/7 LIVE", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
              ];
              const badge = badges[idx % badges.length];

              return (
                <div
                  key={idx}
                  className="group relative flex items-center gap-4 p-4.5 sm:p-5 rounded-2xl bg-card border border-border/70 hover:border-primary/60 shadow-xs hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden"
                >
                  {/* Subtle Top Metallic Ambient Accent Line */}
                  <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary transition-all duration-500" />
                  
                  {/* Background Ambient Glow */}
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 text-primary border border-primary/25 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:from-primary group-hover:to-primary/90 group-hover:text-white shadow-xs group-hover:shadow-md group-hover:shadow-primary/20">
                    <ThemeIcon name={item.icon} className="h-6 w-6" />
                  </div>

                  {/* Text Content */}
                  <div className="min-w-0 flex-1 relative z-10">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {idx === 3 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        )}
                        {badge.label}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </h4>

                    <p className="text-xs font-medium text-muted-foreground mt-1 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 2. Main Footer Directory (Organized & Balanced) ──── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Column 1: Brand Info & Support Box (4 cols) */}
          <div className="lg:col-span-4 bg-muted/20 border border-border/50 rounded-3xl p-6 space-y-5 shadow-xs">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/Vape%20Shop%20Dubai%20logo%201.png"
                alt="Vape Shop Dubai"
                width={220}
                height={40}
                className="h-10 w-auto cursor-pointer"
              />
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-semibold">
              {settings.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border/40">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                <span>{settings.whatsappLabel}</span>
              </a>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-foreground">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-extrabold text-foreground">{settings.ratingText}</span>
              </div>
            </div>
          </div>

          {/* Link Columns (Merchant-defined) — Crisp Alignment */}
          {settings.columns.map((column, idx) => (
            <div
              key={idx}
              className={idx === 0 ? "lg:col-span-2 sm:col-span-1 space-y-4" : "lg:col-span-2 sm:col-span-1 space-y-4"}
            >
              <div className="pb-2 border-b-2 border-primary/30">
                <h4 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0 shadow-xs" />
                  {column.heading}
                </h4>
              </div>

              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-xs sm:text-sm font-extrabold text-foreground/80 hover:text-primary transition-all duration-200"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 shrink-0" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact & Dubai Hub (4 cols) — Clean Unified Box */}
          <div className="lg:col-span-4 bg-card border border-border/60 rounded-3xl p-5 lg:p-6 space-y-4 shadow-xs">
            <div className="pb-2 border-b-2 border-primary/30">
              <h4 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0 shadow-xs" />
                {settings.contactHeading}
              </h4>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-bold">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-muted/40 border border-border/40">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-muted-foreground leading-snug">
                  <strong className="text-foreground block font-black text-xs uppercase tracking-wide mb-0.5">
                    {settings.addressLabel}
                  </strong>
                  <span className="text-xs font-semibold">{settings.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/40 text-foreground hover:text-primary hover:border-primary/40 transition-colors truncate"
                >
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-black text-xs tracking-wider truncate">{settings.phone}</span>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/40 text-foreground hover:text-primary hover:border-primary/40 transition-colors truncate"
                >
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-bold text-xs truncate">{settings.email}</span>
                </a>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <Clock className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-xs font-extrabold uppercase tracking-wide">
                  {settings.hoursNote}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Regulatory & Payment Badges (Dual Balanced Cards) ── */}
        <div className="mt-12 pt-8 border-t border-border/60 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Health Warning Banner */}
          <div className="lg:col-span-6 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 text-amber-900 dark:text-amber-200 shadow-xs">
            <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-xs sm:text-sm font-extrabold leading-relaxed">{settings.healthWarning}</p>
          </div>

          {/* Real Payment Method & License Logos */}
          <div className="lg:col-span-6 bg-card border border-border/60 rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider px-1">
                Accepted:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <VisaIcon className="h-6 w-auto shadow-2xs hover:scale-105 transition-transform" />
                <MastercardIcon className="h-6 w-auto shadow-2xs hover:scale-105 transition-transform" />
                <ApplePayIcon className="h-6 w-auto shadow-2xs hover:scale-105 transition-transform" />
                <GooglePayIcon className="h-6 w-auto shadow-2xs hover:scale-105 transition-transform" />
                <CodPaymentIcon />
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black shrink-0">
              <UaeFlagIcon />
              <span>100% Licensed UAE Store</span>
            </div>
          </div>
        </div>

        {/* ── 4. Bottom Copyright & Back to Top ───────────── */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-muted-foreground text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <p suppressHydrationWarning className="font-extrabold text-foreground">{settings.copyright}</p>
            <span className="hidden sm:inline text-border">·</span>
            <p className="text-xs">
              Powered by{" "}
              <a
                href={settings.poweredByHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-primary hover:underline underline-offset-4"
              >
                {settings.poweredByLabel}
              </a>
            </p>
          </div>

          <div className="flex items-center gap-6 font-extrabold">
            {settings.bottomLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 font-black cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Back to top"
            >
              Top <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
