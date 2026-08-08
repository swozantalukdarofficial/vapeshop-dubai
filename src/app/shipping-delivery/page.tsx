"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Truck, Clock, ShieldCheck, CreditCard, ChevronRight, MapPin, CheckCircle2, AlertTriangle, Calendar, Award } from "lucide-react";

export default function ShippingDeliveryPage() {
  const [shopifyPage, setShopifyPage] = useState<any>(null);

  useEffect(() => {
    async function loadPage() {
      try {
        const res = await fetch("/api/pages/shipping-guidelines");
        if (res.ok) {
          const data = await res.json();
          if (data && data.title) {
            setShopifyPage(data);
          }
        }
      } catch (err) {
        console.warn("Shipping guidelines page API fetch failed:", err);
      }
    }
    loadPage();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-16 sm:pt-20 lg:pt-24 pb-12">
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Shipping Guidelines</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-center">
          <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-2 flex items-center gap-2 justify-center">
            <Truck className="h-4 w-4" />
            Express UAE Shipping
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-foreground tracking-tight leading-tight">
            Shipping Guidelines
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground mt-2 max-w-xl mx-auto font-medium">
            Fast, reliable delivery across the UAE — same-day available in Dubai &amp; Sharjah.
          </p>
        </div>

        {/* Highlight Stats Ribbon */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-card border border-border/40 rounded-2xl p-4 text-center flex flex-col items-center justify-center">
              <Clock className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs font-black text-foreground uppercase tracking-wider">Same-Day Delivery</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">Order before 9 PM</span>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-4 text-center flex flex-col items-center justify-center">
              <Award className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs font-black text-foreground uppercase tracking-wider">Free on 300+ AED</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">Complementary Shipping</span>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-4 text-center flex flex-col items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs font-black text-foreground uppercase tracking-wider">Cash &amp; Card on Delivery</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">Pay at Doorstep</span>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-4 text-center flex flex-col items-center justify-center">
              <Calendar className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs font-black text-foreground uppercase tracking-wider">7 Days a Week</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">No Weekend Delays</span>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
          
          {shopifyPage?.bodyHtml ? (
            <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 sm:p-12 shadow-[var(--shadow-card)]">
              <div
                className="product-description-content text-muted-foreground leading-relaxed text-sm sm:text-base space-y-4"
                dangerouslySetInnerHTML={{ __html: shopifyPage.bodyHtml }}
              />
            </div>
          ) : (
            <>
              {/* Section 1: Free Delivery & Minimum Order */}
              <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 sm:p-10 shadow-xs space-y-6">
                <div className="border-b border-border/20 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    Free Delivery &amp; Minimum Order
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Delivery Country</strong>
                    <p className="text-muted-foreground">We deliver all over the UAE. International deliveries are unavailable due to customs restrictions.</p>
                  </div>
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Minimum Order</strong>
                    <p className="text-muted-foreground">A minimum of <strong className="text-foreground font-bold">85 AED</strong> is required to place an order.</p>
                  </div>
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Free Delivery</strong>
                    <p className="text-muted-foreground">Enjoy complimentary shipping on orders valued at <strong className="text-foreground font-bold">AED 300</strong> or more.</p>
                  </div>
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Delivery Charge</strong>
                    <p className="text-muted-foreground">A charge of <strong className="text-foreground font-bold">AED 30</strong> applies to orders below AED 300.</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Dubai & Sharjah Delivery */}
              <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 sm:p-10 shadow-xs space-y-6">
                <div className="border-b border-border/20 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    Dubai &amp; Sharjah Delivery
                  </h2>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <strong className="text-foreground font-bold">Same-Day Delivery:</strong> Order before 9 PM — delivered to your doorstep same day.
                  </div>
                  <div className="p-3 bg-background/80 border border-border/30 rounded-xl">
                    <strong className="text-foreground font-bold">Next-Day Delivery:</strong> Orders placed after 9 PM are delivered the next morning.
                  </div>
                  <div className="p-3 bg-background/80 border border-border/30 rounded-xl">
                    <strong className="text-foreground font-bold">Operational Days:</strong> Deliveries run 7 days a week.
                  </div>
                  <div className="p-3 bg-background/80 border border-border/30 rounded-xl">
                    <strong className="text-foreground font-bold">Prompt Dispatch:</strong> We dispatch by courier or private car. Occasional delays may occur due to severe weather or traffic.
                  </div>
                  <div className="p-3 bg-background/80 border border-border/30 rounded-xl">
                    <strong className="text-foreground font-bold">No Signature Required:</strong> Ensure someone is available to collect your parcel.
                  </div>
                  <div className="p-3 bg-background/80 border border-border/30 rounded-xl">
                    <strong className="text-foreground font-bold">Our Responsibility:</strong> We take full care of your shipment and ensure you are satisfied with the product.
                  </div>
                  <div className="p-3 bg-background/80 border border-border/30 rounded-xl">
                    <strong className="text-foreground font-bold">Pre-orders:</strong> Contact us via email or WhatsApp, or leave details in the order note.
                  </div>
                  <div className="p-3 bg-background/80 border border-border/30 rounded-xl">
                    <strong className="text-foreground font-bold">Address Finality:</strong> Orders ship to the address provided. To change location, notify us via WhatsApp or email before dispatch. Refunds exclude the initial shipping fee.
                  </div>
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <strong className="text-foreground font-bold">Payment &amp; ID:</strong> Delivery handed over upon presenting your Emirates ID/Passport and clearing payment by Cash or Card.
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400">
                    <strong className="font-bold">Age Restriction:</strong> Buyers must be 18 or older. Orders placed by minors will not be handed over or refunded.
                  </div>
                  <div className="p-3 bg-background/80 border border-border/30 rounded-xl">
                    <strong className="text-foreground font-bold">Delivery Update:</strong> Expect a confirmation email from <span className="text-primary font-bold">vapshopdubai@gmail.com</span> after placing your order.
                  </div>
                </div>
              </div>

              {/* Section 3: Outside Dubai & Sharjah */}
              <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 sm:p-10 shadow-xs space-y-6">
                <div className="border-b border-border/20 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    Outside Dubai &amp; Sharjah (Abu Dhabi, Ajman, RAK, UAQ, Fujairah)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Delivery Time</strong>
                    <p className="text-muted-foreground">Within 1–2 working days (Sunday closed).</p>
                  </div>
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Cut-off Time</strong>
                    <p className="text-muted-foreground">Orders placed before 2:00 PM delivered same day. After 2 PM delivered next day.</p>
                  </div>
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Weekend Orders</strong>
                    <p className="text-muted-foreground">Orders placed after 2 PM on Saturday will be delivered on Monday.</p>
                  </div>
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Payment Method</strong>
                    <p className="text-muted-foreground">Cash on delivery only — card payment not accepted outside city center.</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Outside City / Remote Areas */}
              <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 sm:p-10 shadow-xs space-y-6">
                <div className="border-b border-border/20 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    Outside City &amp; Remote Areas
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Delivery Time</strong>
                    <p className="text-muted-foreground">Within 2 working days (Sunday closed).</p>
                  </div>
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Remote Surcharge</strong>
                    <p className="text-muted-foreground">Areas far from city centres incur an additional charge of 35 AED.</p>
                  </div>
                  <div className="bg-background/80 border border-border/30 rounded-2xl p-4 space-y-1">
                    <strong className="text-foreground font-bold uppercase tracking-wider text-[11px]">Large Remote Orders</strong>
                    <p className="text-muted-foreground">Orders above 300 AED are charged 35 AED delivery only — no free delivery for remote areas.</p>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
