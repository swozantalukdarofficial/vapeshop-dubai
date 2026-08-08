"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ShieldCheck, Truck, Award, Users, ChevronRight, Clock, CheckCircle2, Sparkles, MessageCircle } from "lucide-react";

export default function AboutUsPage() {
  const [shopifyPage, setShopifyPage] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadPage() {
      try {
        const res = await fetch("/api/pages/about-us");
        if (res.ok) {
          const data = await res.json();
          if (data && data.title) {
            setShopifyPage(data);
          }
        }
      } catch (err) {
        console.warn("About Us page API fetch failed:", err);
      }
    }
    loadPage();
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-12 sm:pt-16 lg:pt-20 pb-12">
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">About Us</span>
          </nav>
        </div>

        {/* Hero Banner */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 sm:p-16 shadow-[var(--shadow-card)] relative overflow-hidden text-center flex flex-col items-center">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/10 via-primary to-primary/10" />
            
            <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Dubai's #1 Luxury Vape Store
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-foreground tracking-tight leading-tight max-w-4xl">
              Elevating the UAE Vaping Experience Since 2020
            </h1>

            <div className="flex items-center justify-center gap-2 mt-4 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/65" />
              <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/65" />
            </div>

            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Vape Shop Dubai was founded with a singular mission: to provide authentic, premium vape devices, pods, and e-liquids with unmatched 2-hour express delivery across Dubai.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full max-w-4xl">
              <div className="bg-background/80 border border-border/40 rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-serif font-black text-primary">50,000+</p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Happy Customers</p>
              </div>
              <div className="bg-background/80 border border-border/40 rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-serif font-black text-primary">100%</p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Genuine Authentic</p>
              </div>
              <div className="bg-background/80 border border-border/40 rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-serif font-black text-primary">2 Hours</p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Express Dubai Delivery</p>
              </div>
              <div className="bg-background/80 border border-border/40 rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-serif font-black text-primary">24/7</p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">WhatsApp Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase">Our Core Promise</span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-foreground tracking-tight mt-1">
              Why Vapers Trust Vape Shop Dubai
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border/40 rounded-3xl p-8 space-y-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">100% Authentic Guarantee</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We source directly from factory authorized distributors. Every pod, kit, and disposable contains official verification QR codes for instant authentication.
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-3xl p-8 space-y-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">2-Hour Express Delivery</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Need your vape fast? Our dedicated fleet of drivers delivers anywhere in Dubai within 120 minutes. Same-day delivery available across Abu Dhabi, Sharjah &amp; Ajman.
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-3xl p-8 space-y-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">VIP Customer First Service</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Our support team is available via live WhatsApp to assist with flavor recommendations, device troubleshooting, and instant order tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action banner */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
          <div className="bg-gradient-to-r from-card via-card to-card border border-primary/30 rounded-[2.5rem] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Have Questions or Need Recommendations?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Chat directly with our Dubai vape specialists on WhatsApp for instant assistance.</p>
            </div>
            <a
              href="https://wa.me/971582839787?text=Hello%20Vape%20Shop%20Dubai,%20I%20have%20a%20question!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full hover:opacity-90 transition-all shadow-md active:scale-95 shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp Now
            </a>
          </div>
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
