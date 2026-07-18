"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, ShieldAlert, MessageCircle } from "lucide-react";

const USEFUL_LINKS = [
  { label: "Shop", href: "#products-section" },
  { label: "About Us", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Refund and Return Policy", href: "#" },
  { label: "Shipping Guidelines", href: "#" },
];

const CATEGORIES_LINKS = [
  { label: "JUUL Pods & Devices", href: "#products-section" },
  { label: "MYLE Vape", href: "#products-section" },
  { label: "Disposable Vape", href: "#products-section" },
  { label: "E-Juice / E-Liquids", href: "#products-section" },
  { label: "Pod Systems", href: "#products-section" },
  { label: "Brands", href: "#products-section" },
];

export const Footer: React.FC = () => {
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  return (
    <footer className="bg-card border-t border-border text-muted-foreground">

      {/* ── Main footer grid ─────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* About / Logo */}
          <div className="space-y-4 lg:col-span-1">
            <svg viewBox="0 0 220 48" className="h-9 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="36" fontFamily="var(--font-serif), Georgia, serif" fontWeight="900" fontSize="36" fill="var(--primary)">V</text>
              <text x="21" y="39" fontFamily="var(--font-serif), Georgia, serif" fontStyle="italic" fontWeight="400" fontSize="40" fill="var(--primary)">S</text>
              <text x="65" y="22" fontFamily="var(--font-sans), sans-serif" fontWeight="800" fontSize="13" letterSpacing="0.18em" fill="currentColor" className="text-foreground">VAPE SHOP</text>
              <text x="65" y="38" fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.38em" fill="var(--primary)">DUBAI</text>
            </svg>
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

              {/* Social Media Links */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-border/70 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 active:scale-95"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-border/70 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 active:scale-95"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-border/70 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 active:scale-95"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-border/70 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 active:scale-95"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.52 3.545 12 3.545 12 3.545s-7.52 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.868.508 9.388.508 9.388.508s7.52 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.trustpilot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-border/70 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 active:scale-95"
                  aria-label="Trustpilot"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.553 15.656l-3.329 2.453 1.258-3.921-3.313-2.45h4.108L12.545 8l1.267 3.738h4.109l-3.313 2.45 1.258 3.921-3.313-2.453zm9.447-6.332h-6.757L13.127.648l-2.116 6.504-6.757-.002 5.467 4.048-2.088 6.504 5.467-4.048 5.467 4.048-2.088-6.504L22 9.324z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Useful Links</h3>
            <ul className="space-y-2.5">
              {USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  {link.label === "Shop" ? (
                    <a href={link.href} className="text-xs hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => setIsDevModalOpen(true)}
                      className="text-xs hover:text-primary transition-colors text-left cursor-pointer bg-transparent border-none p-0 text-muted-foreground"
                    >
                      {link.label}
                    </button>
                  )}
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
                  <a href={link.href} className="text-xs hover:text-primary transition-colors">
                    {link.label}
                  </a>
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

        {/* ── Legal disclaimer ─────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border space-y-4">
          <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-3">
            <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 dark:text-amber-400 leading-relaxed">
              <strong>NOT FOR SALE TO MINORS:</strong> This product may be hazardous to health and is intended for use by adult smokers. Keep out of reach of children. MYLÉ products with nicotine e-liquid are not suitable for use by: persons under the age of 21, pregnant or breastfeeding women, or persons who are sensitive or allergic to nicotine, and should be used with caution by persons with or at a risk of an unstable heart condition or high blood pressure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[10px]">© {new Date().getFullYear()} Vape Shop Dubai — vapshopdubai.ae</p>
            <p className="text-[10px] text-center">
              www.vapshopdubai.ae have no affiliation with JUUL or other vape brands. This is not the official website of JUUL vape.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-[10px]">
            <button onClick={() => setIsDevModalOpen(true)} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 text-muted-foreground text-[10px]">Terms of Service</button>
            <button onClick={() => setIsDevModalOpen(true)} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 text-muted-foreground text-[10px]">Privacy Policy</button>
            <button onClick={() => setIsDevModalOpen(true)} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 text-muted-foreground text-[10px]">Refund Policy</button>
            <button onClick={() => setIsDevModalOpen(true)} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 text-muted-foreground text-[10px]">Shipping Guidelines</button>
          </div>
        </div>
      </div>

      {/* Custom Under Development Modal */}
      {isDevModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDevModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-card border border-border rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            
            <h3 className="text-lg font-serif font-bold text-foreground mb-2">Under Development</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              This page is currently under development. For any inquiries, please contact <strong className="text-foreground font-semibold">Shipon Talukdar</strong>.
            </p>
            
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/971582839787?text=Hi Shipon, I'm contacting you regarding the website."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-bold py-3 rounded-full hover:opacity-90 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Shipon Talukdar
              </a>
              <button
                onClick={() => setIsDevModalOpen(false)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground py-2 hover:underline cursor-pointer bg-transparent border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
