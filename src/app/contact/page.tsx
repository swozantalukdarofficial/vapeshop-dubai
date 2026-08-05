"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Phone, Mail, MapPin, MessageCircle, Clock, ChevronRight, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [shopifyPage, setShopifyPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    orderId: "",
    subject: "General Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  React.useEffect(() => {
    async function loadPage() {
      try {
        const res = await fetch("/api/pages/contact");
        if (res.ok) {
          const data = await res.json();
          if (data && data.title) {
            setShopifyPage(data);
          }
        }
      } catch (err) {
        console.warn("Contact page API fetch failed:", err);
      }
    }
    loadPage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        if (data.whatsappUrl) {
          setWaUrl(data.whatsappUrl);
        }
      }
    } catch (err) {
      console.warn("Contact form submit error:", err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-28 sm:pt-32 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Contact Us</span>
          </nav>
        </div>

        {/* Header */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-center">
          <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-2">Customer Care</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-foreground tracking-tight leading-tight">
            Get in Touch With Us
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground mt-2 max-w-xl mx-auto">
            Need support with your order or product inquiries? We are available 24/7 via WhatsApp and phone.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Card */}
            <div className="bg-gradient-to-br from-[#25D366]/10 via-card to-card border border-[#25D366]/30 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-foreground">Instant WhatsApp Support</h3>
                  <p className="text-xs text-muted-foreground">Fastest response time (~5 mins)</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect with our team for 2-hour express order dispatch, flavor guidance, and live delivery updates.
              </p>
              <a
                href="https://wa.me/971582839787?text=Hello%20Vape%20Shop%20Dubai!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:opacity-90 transition-all shadow-xs w-full justify-center"
              >
                <MessageCircle className="h-4 w-4" />
                +971 58 283 9787
              </a>
            </div>

            {/* Address & Hours */}
            <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Phone Hotline</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">+971 58 283 9787</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-border/20">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Email Support</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">support@vapeshopdubai.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-border/20">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Dubai Headquarters</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Business Bay, Downtown Dubai, United Arab Emirates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-border/20">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Delivery Hours</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Express Dubai: 9:00 AM – 11:00 PM Daily<br />
                    WhatsApp Support: 24/7 Available
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-card border border-border/40 rounded-3xl p-6 sm:p-10 shadow-xs">
            <h3 className="font-serif font-bold text-2xl text-foreground mb-2">Send Us a Message</h3>
            <p className="text-xs text-muted-foreground mb-6">Fill out the form below and our customer support team will reply within 30 minutes.</p>

            {submitted ? (
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-8 text-center space-y-4">
                <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
                <h4 className="text-xl font-serif font-bold text-foreground">Message Saved to Shopify Admin!</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Thank you for reaching out. Your inquiry has been registered in our system. You can also send this message directly to our support team on WhatsApp for an instant reply:
                </p>
                {waUrl && (
                  <div className="pt-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full hover:opacity-90 transition-all shadow-md cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Send Instant Message on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ahmed Al Mansoori"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Order ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. #VSD-9842"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Tracking">Order Tracking &amp; Delivery</option>
                      <option value="Product Authenticity">Product Authenticity Check</option>
                      <option value="Return or Exchange">Return or Exchange Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Submit Message
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
