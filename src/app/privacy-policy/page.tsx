"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ShieldCheck, ChevronRight, Lock, Eye, CreditCard, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-16 sm:pt-20 lg:pt-24 pb-12">
        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Privacy Policy</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="text-center flex flex-col items-center justify-center max-w-3xl mx-auto">
            <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Data Security &amp; Protection
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/65" />
              <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/65" />
            </div>
            <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
              Last updated: August 2026. Learn how Vape Shop Dubai collects, protects, and handles your personal information under UAE Data Laws.
            </p>
          </div>
        </div>

        {/* Legal Body Container */}
        <div className="max-w-[950px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 sm:p-12 shadow-[var(--shadow-card)] space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                1. Overview &amp; Commitment
              </h2>
              <p>
                Vape Shop Dubai ("we", "our", or "us") is committed to safeguarding your privacy online. This policy outlines how we collect, store, and process customer data when you visit our website, place an order for delivery across Dubai and the UAE, or interact with our customer support.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-border/20">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                2. Information We Collect
              </h2>
              <p>We only collect essential data required to process and deliver your orders safely:</p>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-2">
                <li><strong className="text-foreground">Contact Details:</strong> Full Name, Mobile / WhatsApp Number, Delivery Address, City, Emirates.</li>
                <li><strong className="text-foreground">Age Verification Data:</strong> Under UAE Federal Law, vaping products are restricted to adults aged 18+. Age confirmation is verified prior to dispatch.</li>
                <li><strong className="text-foreground">Order Information:</strong> Products purchased, quantities, invoice amounts, and delivery instructions.</li>
              </ul>
            </section>

            <section className="space-y-3 pt-6 border-t border-border/20">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                3. Payment Security Guarantee
              </h2>
              <p>
                We prioritize your financial safety. We do <strong className="text-foreground">NOT</strong> store your credit or debit card numbers on our servers.
              </p>
              <p>
                All electronic transactions on delivery are processed using PCI-DSS certified mobile POS card machines or encrypted payment links. Cash on Delivery (COD) transactions are collected directly by our trained courier team.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-border/20">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                4. Data Protection &amp; Confidentiality
              </h2>
              <p>
                Your personal details are strictly confidential. We never sell, rent, or trade customer information to third-party marketing companies. Data is shared exclusively with our internal fulfillment staff and delivery drivers to execute your 2-hour express delivery in Dubai.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-border/20">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                5. Your Rights &amp; Contact DPO
              </h2>
              <p>
                You have the right to request access to, update, or permanently delete your stored personal information at any time. For privacy inquiries or data requests, please contact our Data Protection Officer at:
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-xs font-semibold text-foreground space-y-1">
                <p>Email: privacy@vapeshopdubai.com</p>
                <p>WhatsApp Support: +971 58 283 9787</p>
                <p>Address: Business Bay, Dubai, United Arab Emirates</p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
