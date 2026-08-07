"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Layers, ShieldCheck, Sparkles } from "lucide-react";

export function JuulPackagingCompareSection() {
  const [activeTab, setActiveTab] = useState<"old" | "new">("old");

  const isNew = activeTab === "new";

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-md relative overflow-hidden transition-all duration-300">
        {/* Dynamic Top Ambient Bar (Primary Brand Color for Old, Green for New) */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500 ${
            isNew ? "bg-emerald-500" : "bg-primary"
          }`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Column: Header, Tabs & Specifications */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-xs transition-colors duration-300 ${
                    isNew ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-primary/10 border-primary/20 text-primary"
                  }`}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-foreground">
                  JUUL 1 Packaging: <span className="text-primary">Old</span> vs <span className="text-emerald-500">New</span>
                </h2>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-2xl">
                To make fake JUUL products harder to sell in the UAE, JUUL redesigned the box. Here is what changed and what to look for before you buy.
              </p>
            </div>

            {/* Toggle Pills (Site Primary for Old, Green for New) */}
            <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-2xl w-fit border border-border/50">
              <button
                onClick={() => setActiveTab("old")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === "old"
                    ? "bg-primary text-white shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                OLD PACKAGING
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === "new"
                    ? "bg-emerald-600 text-white shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                NEW PACKAGING
              </button>
            </div>

            {/* Dynamic Specifications Card (Site Primary for Old, Green for New) */}
            <div
              className={`rounded-3xl p-6 sm:p-8 border transition-all duration-500 space-y-4 shadow-sm ${
                isNew
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                  : "bg-primary/10 border-primary/30 text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5 font-serif font-black text-lg sm:text-xl">
                {isNew ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 animate-bounce" />
                    <span className="text-emerald-600 dark:text-emerald-400">New Packaging Specifications</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-primary">Old Packaging Specifications</span>
                  </>
                )}
              </div>

              {!isNew ? (
                <ul className="space-y-3.5 text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <strong className="font-bold text-foreground">Cardboard Sleeve:</strong> Plain white matte paper box. Wears, tears, and fades with light handling.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <strong className="font-bold text-foreground">Branding & Font:</strong> Basic minimalist type. No clear generation label. The box does not always say &quot;JUUL 1&quot; outright.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <strong className="font-bold text-foreground">Security Tracking:</strong> No 3D holographic sticker on the top flap. High risk of convincing clones.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <strong className="font-bold text-foreground">Batch Codes:</strong> Printed lightly and often smudged. Hard to read and easy to fake.
                    </div>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-3.5 text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className="font-bold text-foreground">Cardboard Sleeve:</strong> Premium glossy reinforced foil-laminated box. Scratch-resistant surface.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className="font-bold text-foreground">Branding & Font:</strong> Bold embossed JUUL logo with explicit generation badges and nicotine concentration callouts.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className="font-bold text-foreground">Security Tracking:</strong> High-security 3D holographic authentication sticker with QR code scan verification.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className="font-bold text-foreground">Batch Codes:</strong> Laser-etched high-density QR code and crisp batch numbers on top & bottom flaps.
                    </div>
                  </li>
                </ul>
              )}
            </div>

          </div>

          {/* Right Column: Visual Box Display Frame (Site Primary for Old, Green for New) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div
              className={`w-full max-w-md bg-background border-2 rounded-[2.5rem] p-6 sm:p-8 relative shadow-xl transition-all duration-500 flex flex-col items-center justify-center ${
                isNew ? "border-emerald-500/50 shadow-emerald-500/10" : "border-primary/40 shadow-primary/10"
              }`}
            >
              {/* Carousel Left / Right Arrows */}
              <button
                onClick={() => setActiveTab(isNew ? "old" : "new")}
                className={`absolute left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer hover:scale-110 z-20 ${
                  isNew ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-gold-shimmer"
                }`}
                aria-label="Previous design"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveTab(isNew ? "old" : "new")}
                className={`absolute right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer hover:scale-110 z-20 ${
                  isNew ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-gold-shimmer"
                }`}
                aria-label="Next design"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* JUUL Pod Packaging Product Visual */}
              <div className="relative w-48 sm:w-56 h-64 sm:h-72 my-4 flex flex-col items-center justify-center p-4 bg-muted/20 rounded-2xl border border-border/40 group">
                <img
                  src="/juul_device.png"
                  alt={isNew ? "JUUL 1 New Packaging" : "JUUL 1 Old Packaging"}
                  className="w-full h-full object-contain filter drop-shadow-xl transition-all duration-500 transform group-hover:scale-105"
                />
                
                {/* Reflection effect graphic */}
                <div className="w-36 h-4 bg-black/10 blur-md rounded-full mt-2" />
              </div>

              {/* Bottom Design Badge */}
              <div className="mt-2 text-center">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white shadow-sm inline-block transition-all duration-300 ${
                    isNew ? "bg-emerald-600" : "bg-primary"
                  }`}
                >
                  {isNew ? "NEW DESIGN" : "OLD DESIGN"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
