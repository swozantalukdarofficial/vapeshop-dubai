"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Search, Zap, CheckCircle2 } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
  category: "delivery" | "authenticity" | "payment" | "products";
}

export interface FaqSettings {
  badgeText: string;
  heading: string;
  description: string;
  deliveryBadge: string;
  searchPlaceholder: string;
  verifiedNote: string;
  items: FaqItem[];
}

const FILTER_TABS = [
  { label: "All Questions", id: "all" },
  { label: "Delivery", id: "delivery" },
  { label: "Authenticity", id: "authenticity" },
  { label: "Payment", id: "payment" },
  { label: "Products", id: "products" },
];

export function FAQSection({ settings }: { settings: FaqSettings }) {

  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFaqs = settings.items.filter((faq) => {
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
    <div className="w-full bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 lg:p-8 relative overflow-hidden shadow-md transition-all duration-300">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5 mb-6 relative">
        {/* Spacer for desktop optical centering */}
        <div className="hidden sm:block w-48" />

        {/* Centered Title & Badge */}
        <div className="text-center flex flex-col items-center flex-1">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span>{settings.badgeText}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-foreground tracking-tight leading-tight">
            {settings.heading}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-semibold max-w-xl">
            {settings.description}
          </p>

          {/* Premium Centered Line Divider */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-primary/65" />
            <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
            <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-primary/65" />
          </div>
        </div>

        {/* Right Delivery Badge */}
        <div className="flex items-center justify-center sm:justify-end gap-2.5 w-full sm:w-48">
          {settings.deliveryBadge && (
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-extrabold text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full shrink-0">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>{settings.deliveryBadge}</span>
            </div>
          )}
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={settings.searchPlaceholder}
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
          {FILTER_TABS.map((tab) => (
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
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-card border-primary/40 shadow-md shadow-primary/5"
                    : "bg-card/70 border-border/60 hover:border-border"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-foreground tracking-tight leading-snug">
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

                    {settings.verifiedNote && (
                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{settings.verifiedNote}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
