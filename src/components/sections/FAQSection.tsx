"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Search, ShieldCheck, Zap, CreditCard, CheckCircle2 } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
  category: "delivery" | "authenticity" | "payment" | "products";
}

export const MAIN_FAQS: FAQItem[] = [
  {
    question: "How fast is vape delivery in Dubai and across the UAE?",
    answer: "We offer 2-Hour Express Delivery in Dubai for all orders placed before 10:00 PM. For Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, and UAQ, we provide guaranteed same-day or next-day express delivery.",
    category: "delivery",
  },
  {
    question: "Are all vapes, pods, and devices 100% authentic?",
    answer: "Yes, 100%! All devices, disposable vapes, pods, and e-liquids sold at Vape Shop Dubai are directly imported from certified manufacturers and authorized regional distributors. Every product features a security seal and scannable QR verification code.",
    category: "authenticity",
  },
  {
    question: "Can I pay by card when the delivery driver arrives?",
    answer: "Yes! We support Cash on Delivery (COD) as well as Card Machine on Delivery. Our delivery riders carry mobile wireless card terminals accepting Visa, Mastercard, Apple Pay, and contactless payments.",
    category: "payment",
  },
  {
    question: "What is the difference between JUUL 1 and JUUL 2?",
    answer: "JUUL 2 is the next-generation pod system featuring enhanced airflow, smart LED battery level indicators, anti-counterfeit pod detection, and 18mg nicotine salt pods. JUUL 1 is the classic minimal device available in 3% and 5% USA nicotine strengths.",
    category: "products",
  },
  {
    question: "What is the difference between Nicotine Salt and Freebase E-Liquids?",
    answer: "Nicotine Salt e-liquids provide a smoother throat hit at higher nicotine concentrations (20mg to 50mg), making them ideal for pod systems like Caliburn, XROS, and MYLE. Freebase e-liquids have higher VG ratios designed for sub-ohm mod kits to produce thick vapor clouds.",
    category: "products",
  },
  {
    question: "What is the legal age to buy vape products in Dubai?",
    answer: "In accordance with UAE federal regulations, you must be at least 18 years of age or older to purchase electronic cigarettes, nicotine pods, or vaping accessories.",
    category: "authenticity",
  },
  {
    question: "What should I do if a disposable vape or device is defective?",
    answer: "All products are backed by our 100% Satisfaction Guarantee. If you receive a defective unit or damaged item, contact our customer support team via WhatsApp within 24 hours for an immediate free replacement.",
    category: "delivery",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFaqs = MAIN_FAQS.filter((faq) => {
    const matchCat = selectedCategory === "all" || faq.category === selectedCategory;
    const matchSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-md transition-all duration-300">
        {/* Glowing Ambient Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-border/40 mb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>Customer Help &amp; FAQs</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
              Find instant answers regarding 2-hour express delivery in Dubai, product authenticity, card payments on delivery, and vape device selection.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-background border border-border/60 px-4 py-2 rounded-2xl shadow-sm text-xs font-bold text-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>2-Hour Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-background border border-border/60 px-4 py-2 rounded-2xl shadow-sm text-xs font-bold text-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Authentic</span>
            </div>
            <div className="flex items-center gap-2 bg-background border border-border/60 px-4 py-2 rounded-2xl shadow-sm text-xs font-bold text-foreground">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Card on Delivery</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search FAQs (e.g. delivery, JUUL, card)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-background border border-border/80 rounded-2xl text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
            {[
              { label: "All Questions", id: "all" },
              { label: "Delivery", id: "delivery" },
              { label: "Authenticity", id: "authenticity" },
              { label: "Payment", id: "payment" },
              { label: "Products", id: "products" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                    : "bg-background border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ List */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-background border border-border/60 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-bold text-foreground">No questions found matching your search.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="text-xs font-extrabold text-primary uppercase underline"
            >
              Show All Questions
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className={`bg-background border rounded-3xl overflow-hidden transition-all duration-300 ${
                    isOpen ? "border-primary shadow-lg shadow-primary/5" : "border-border/80 hover:border-border"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full px-6 py-5 sm:px-8 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-serif font-bold text-foreground leading-snug">
                      {faq.question}
                    </span>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? "bg-primary text-white rotate-180" : "bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 sm:px-8 sm:pb-7 pt-0 border-t border-border/30">
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-4 font-medium">
                        {faq.answer}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Verified Answer for Dubai &amp; UAE Customers</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
