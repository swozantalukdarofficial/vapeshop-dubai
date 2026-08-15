"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  Clock,
  ArrowUp,
  Star,
  ShieldAlert,
  Award,
  Link2,
} from "lucide-react";

const TRUST_FEATURES = [
  { icon: Truck, title: "1-2 Hr Express Delivery", subtitle: "Dubai, Sharjah & Ajman" },
  { icon: ShieldCheck, title: "100% Authentic UAE", subtitle: "Scratch-code verified" },
  { icon: CreditCard, title: "Cash & Card on Delivery", subtitle: "Pay at your doorstep" },
  { icon: Clock, title: "24/7 Instant Dispatch", subtitle: "365 days non-stop service" },
];

const SHOP_CATEGORIES = [
  { label: "Disposable Vapes", href: "/collections/disposables" },
  { label: "JUUL 2 & JUUL Pods", href: "/collections/juul" },
  { label: "MYLE V5 & Pod Kits", href: "/collections/myle" },
  { label: "E-Liquids & Nic Salts", href: "/collections/e-liquids" },
  { label: "Pod Systems & Coils", href: "/collections/accessories" },
];

const POPULAR_BRANDS = [
  { label: "Tugboat Vape Dubai", href: "/collections/disposables?brand=Tugboat" },
  { label: "Elf Bar & Lost Mary", href: "/collections/disposables?brand=Elf+Bar" },
  { label: "Al Fakher Crown Bar", href: "/collections/disposables?brand=Al+Fakher" },
  { label: "JUUL Dubai UAE", href: "/collections/juul" },
  { label: "MYLE Dubai Official", href: "/collections/myle" },
];

const CUSTOMER_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact & Showroom", href: "/contact" },
  { label: "Blog & Vaping Guides", href: "/blog" },
  { label: "Shipping & Delivery Policy", href: "/shipping-delivery" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card border-t border-border/80 text-foreground font-sans">
      {/* ── 1. Top Trust Features (Symmetrical 4 Columns) ──── */}
      <div className="border-b border-primary/60 bg-muted/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-border/60">
            {TRUST_FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 py-2 lg:py-1 lg:px-6 first:pl-0 last:pr-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Column 1: Brand & Contact CTA (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <svg viewBox="0 0 220 48" className="h-9 w-auto cursor-pointer" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="2" y="36" fontFamily="var(--font-serif), Georgia, serif" fontWeight="900" fontSize="36" fill="var(--primary)">V</text>
                <text x="21" y="39" fontFamily="var(--font-serif), Georgia, serif" fontStyle="italic" fontWeight="400" fontSize="40" fill="var(--primary)">S</text>
                <text x="65" y="22" fontFamily="var(--font-sans), sans-serif" fontWeight="800" fontSize="13" letterSpacing="0.18em" fill="currentColor" className="text-foreground">VAPE SHOP</text>
                <text x="65" y="38" fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.38em" fill="var(--primary)">DUBAI</text>
              </svg>
            </Link>

            <p className="text-[13px] leading-relaxed text-muted-foreground max-w-sm">
              Dubai&apos;s leading online vape store. Authorized retailer of 100% authentic JUUL pods, MYLE devices, high-puff disposable vapes, and premium nicotine salts with 1–2 hour delivery across UAE.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://wa.me/971582839787?text=Hello%20Vape%20Shop%20Dubai!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Order</span>
              </a>

              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/60 border border-border/80 text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-foreground">4.9 / 5.0</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Categories (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-widest pb-1 border-b border-border/60">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              {SHOP_CATEGORIES.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Brands (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-widest pb-1 border-b border-border/60">
              Top Brands
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              {POPULAR_BRANDS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Dubai Hub (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-widest pb-1 border-b border-border/60">
              Store & Support
            </h4>
            <ul className="space-y-3 text-[13px]">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-tight">
                  <strong className="text-foreground block font-semibold text-xs">Dubai Dispatch Center</strong>
                  International City, Dubai, UAE
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="tel:+971582839787"
                  className="text-muted-foreground hover:text-primary font-medium transition-colors"
                >
                  +971 58 283 9787
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="mailto:vapshopdubai@gmail.com"
                  className="text-muted-foreground hover:text-primary font-medium transition-colors truncate"
                >
                  vapshopdubai@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-muted-foreground text-xs font-medium">
                  24/7 Delivery & Support across Dubai
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── 3. Regulatory & Payment Badges (Clean Dual Box) ── */}
        <div className="mt-10 pt-6 border-t border-border/60 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Health Warning Banner */}
          <div className="lg:col-span-8 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3 text-amber-800 dark:text-amber-200">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs leading-snug">
              <strong className="font-bold">UAE 21+ ONLY:</strong> Products contain nicotine, an addictive chemical. For adult smokers (21+) in the UAE. Keep out of reach of children and pets.
            </p>
          </div>

          {/* Payment & Licensed Retailer Chips */}
          <div className="lg:col-span-4 flex flex-wrap items-center justify-start lg:justify-end gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-muted text-[11px] font-semibold text-foreground border border-border/60 flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              Cash / Card on Delivery
            </span>
            <span className="px-2.5 py-1 rounded-md bg-muted text-[11px] font-semibold text-foreground border border-border/60 flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-primary" />
              Link Pay Accepted
            </span>
            <span className="px-2.5 py-1 rounded-md bg-muted text-[11px] font-semibold text-foreground border border-border/60 flex items-center gap-1">
              <Award className="h-3 w-3 text-primary" />
              Licensed UAE
            </span>
          </div>
        </div>

        {/* ── 4. Bottom Copyright & Quick Links ───────────── */}
        <div className="mt-6 pt-5 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <p suppressHydrationWarning>
              © 2026 <strong className="text-foreground font-semibold">Vape Shop Dubai</strong>. All rights reserved.
            </p>
            <span className="hidden sm:inline text-border">·</span>
            <p className="text-[11px] sm:text-xs">
              Powered by{" "}
              <a
                href="https://webestone.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:text-primary transition-colors underline decoration-primary/40 underline-offset-2"
              >
                Webestone
              </a>
            </p>
          </div>

          <div className="flex items-center gap-5 font-medium">
            <Link href="/terms-conditions" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/shipping-delivery" className="hover:text-primary transition-colors">Shipping</Link>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-bold cursor-pointer transition-colors"
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



