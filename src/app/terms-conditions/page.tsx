"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ShieldAlert, ChevronRight, FileText, Scale, CheckCircle2 } from "lucide-react";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-16 sm:pt-20 lg:pt-24 pb-12">
        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Terms &amp; Conditions</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="text-center flex flex-col items-center justify-center max-w-3xl mx-auto">
            <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-2 flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Legal Agreements
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">
              Terms &amp; Conditions
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/65" />
              <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/65" />
            </div>
            <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
              Last updated: August 2026. Please read these terms carefully before making purchases on Vape Shop Dubai.
            </p>
          </div>
        </div>

        {/* Document Body Container */}
        <div className="max-w-[950px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 sm:p-12 shadow-[var(--shadow-card)] space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                1. 18+ Age Restriction &amp; Verification
              </h2>
              <p>
                In strict compliance with Federal Laws of the United Arab Emirates regarding tobacco and nicotine products, you must be at least <strong className="text-foreground">18 years of age</strong> to purchase any vaping device, e-liquid, pod system, or accessory from Vape Shop Dubai.
              </p>
              <p>
                Our couriers reserve the right to request valid Emirates ID or passport verification upon delivery. If age cannot be verified, the order will be canceled.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-border/20">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                2. Order Acceptance &amp; Pricing
              </h2>
              <p>
                All prices listed on the website are displayed in United Arab Emirates Dirhams (AED / Dhs.). Prices include VAT where applicable. We reserve the right to update product prices or correct typographical errors at any time without prior notice.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-border/20">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                3. 24-Hour Return &amp; Exchange Policy
              </h2>
              <p>
                Due to health and hygiene standards, unsealed or used liquid pods cannot be returned. However, if you receive a manufacturer defective device or dead-on-arrival (DOA) pod system, we offer a <strong className="text-foreground">24-hour door-to-door replacement guarantee</strong>.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-border/20">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                4. Contact Information
              </h2>
              <p>For questions regarding terms of service, please contact us at support@vapeshopdubai.com or WhatsApp +971 58 283 9787.</p>
            </section>

          </div>
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
