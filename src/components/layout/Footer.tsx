"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const USEFUL_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blog & Vaping Guides", href: "/blog" },
  { label: "Shipping & Delivery", href: "/shipping-delivery" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

const CATEGORIES_LINKS = [
  { label: "JUUL Pods & Devices", href: "/collections/juul" },
  { label: "MYLE Vape", href: "/collections/myle" },
  { label: "Disposable Vape", href: "/collections/disposables" },
  { label: "E-Juice / E-Liquids", href: "/collections/e-liquids" },
  { label: "Pod Systems", href: "/collections/accessories" },
  { label: "Brands", href: "/shop" },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border text-muted-foreground">

      {/* ── Main footer grid ─────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* About / Logo */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/">
              <svg viewBox="0 0 220 48" className="h-9 w-auto cursor-pointer" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="2" y="36" fontFamily="var(--font-serif), Georgia, serif" fontWeight="900" fontSize="36" fill="var(--primary)">V</text>
                <text x="21" y="39" fontFamily="var(--font-serif), Georgia, serif" fontStyle="italic" fontWeight="400" fontSize="40" fill="var(--primary)">S</text>
                <text x="65" y="22" fontFamily="var(--font-sans), sans-serif" fontWeight="800" fontSize="13" letterSpacing="0.18em" fill="currentColor" className="text-foreground">VAPE SHOP</text>
                <text x="65" y="38" fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.38em" fill="var(--primary)">DUBAI</text>
              </svg>
            </Link>
            <p className="text-xs leading-relaxed">
              Vape Shop Dubai provides a variety of vaping products to customers throughout Dubai and the UAE. Our inventory includes brands like JUUL and MYLE, along with disposable options, pod kits, and a range of e-liquids for different experience levels.
            </p>
            <div className="flex flex-col gap-3.5">
              <a
                href="https://wa.me/971582839787?text=Hello!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-4 py-2.5 rounded-full hover:opacity-90 transition-all cursor-pointer w-fit"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Useful Links</h3>
            <ul className="space-y-2.5">
              {USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {CATEGORIES_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Contact Info</h3>
            <ul className="space-y-3 text-xs">
              <li className="font-semibold text-foreground">Vape Shop Dubai</li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span>International City Dubai UAE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <a href="mailto:vapshopdubai@gmail.com" className="hover:text-primary transition-colors">
                  vapshopdubai@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5 text-[#25D366] flex-shrink-0" />
                <a href="https://wa.me/971582839787" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  +971 58 283 9787
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice Banner */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-amber-600 dark:text-amber-400">
            <span className="text-[10px] sm:text-xs leading-relaxed">
              <strong className="font-bold">NOT FOR SALE TO MINORS:</strong> This product may be hazardous to health and is intended for use by adult smokers. Keep out of reach of children. MYLÉ products with nicotine e-liquid are not suitable for use by: persons under the age of 21, pregnant or breastfeeding women, or persons who are sensitive or allergic to nicotine, and should be used with caution by persons with or at risk of an unstable heart condition or high blood pressure.
            </span>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-8 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4 text-center sm:text-left">
          <p>© 2026 Vape Shop Dubai — vapshopdubai.ae</p>
          <div className="flex items-center gap-4 text-[10px]">
            <Link href="/terms-conditions" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/shipping-delivery" className="hover:text-primary transition-colors">Shipping Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
