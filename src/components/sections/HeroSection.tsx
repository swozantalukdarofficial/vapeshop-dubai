"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowUpRight, Truck, CreditCard, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const SLIDES = [
  {
    title: "MYLE Devices & Pods",
    accent: "Premium Pod Systems",
    desc: "Experience the ultimate in convenience and satisfaction. Official MYLE V5, V4, and Meta systems. Bold flavor profiles, smooth nicotine delivery, and long-lasting battery life.",
    image: "/vape_kit.png",
    tag: "🔥 Premium Pod Systems",
    buttonText: "Shop MYLE Collection",
    stat1: { value: "5%", label: "Nicotine Strength" },
    stat2: { value: "V5", label: "Latest Series" },
    ctaCategory: "all?brand=MYLE",
  },
  {
    title: "Disposable Vapes",
    accent: "Premium Disposables",
    desc: "Lost Mary, Al Fakher Crown Bar, Tugboat, BECO, and more. Up to 15,000 puffs. From 40 AED. Cash on delivery available with instant delivery across Dubai.",
    image: "/lost_mary.png",
    tag: "💰 From 40 AED Only",
    buttonText: "Shop Disposables",
    stat1: { value: "15K", label: "Max Puffs" },
    stat2: { value: "40", label: "AED Starting" },
    ctaCategory: "disposables",
  },
  {
    title: "Pod Systems & Kits",
    accent: "Vape Devices & Pods",
    desc: "Refillable and pre-filled pod kits from top brands like Uwell, Geekvape, Vaporesso, OXVA, Voopoo. Compact, powerful, and designed for daily use.",
    image: "/vape_kit.png",
    tag: "⚡ High Performance Kits",
    buttonText: "Shop Pod Systems",
    stat1: { value: "100%", label: "Authentic" },
    stat2: { value: "Top", label: "Global Brands" },
    ctaCategory: "accessories",
  },
  {
    title: "Premium E-Liquids & Salts",
    accent: "Nicotine Salts & Freebase",
    desc: "Nasty Juice, Pod Salt, Tokyo, RufPuf, and more. 0mg to 50mg nicotine options. Over 80 premium flavors in stock with same-day 2-hour delivery.",
    image: "/premium_liquid.png",
    tag: "⭐ 80+ Flavors Available",
    buttonText: "Shop E-Liquids",
    stat1: { value: "80+", label: "Flavors" },
    stat2: { value: "0-50mg", label: "Nicotine Range" },
    ctaCategory: "e-liquids",
  },
];

const TRUST_ITEMS = [
  "🚀 FREE DELIVERY ON ORDERS 300 AED+",
  "⚡ SAME DAY DELIVERY IN DUBAI",
  "💳 COD & CREDIT CARD ON DELIVERY",
  "✅ 100% AUTHENTIC PRODUCTS",
  "🔄 24H WARRANTY EXCHANGE",
  "📦 NEXT-DAY ABU DHABI & SHARJAH",
  "🚀 FREE DELIVERY ON ORDERS 300 AED+",
  "⚡ SAME DAY DELIVERY IN DUBAI",
  "💳 COD & CREDIT CARD ON DELIVERY",
  "✅ 100% AUTHENTIC PRODUCTS",
  "🔄 24H WARRANTY EXCHANGE",
  "📦 NEXT-DAY ABU DHABI & SHARJAH",
];

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  // Sync active slide state with Embla scroll snaps
  useEffect(() => {
    if (!api) return;
    const handleSelect = () => {
      setActiveSlide(api.selectedScrollSnap());
    };
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Synchronized Autoplay & Progress effect
  useEffect(() => {
    if (!api) return;

    setProgress(0);
    const total = 6000; // 6 seconds per slide
    const step = 50;
    let elapsed = 0;
    let isHovered = false;

    const interval = setInterval(() => {
      if (isHovered) return;
      elapsed += step;
      setProgress(Math.min((elapsed / total) * 100, 100));
      if (elapsed >= total) {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
        elapsed = 0;
        setProgress(0);
      }
    }, step);

    const onMouseEnter = () => {
      isHovered = true;
    };
    const onMouseLeave = () => {
      isHovered = false;
    };

    const emblaRoot = api.rootNode();
    emblaRoot.addEventListener("mouseenter", onMouseEnter);
    emblaRoot.addEventListener("mouseleave", onMouseLeave);

    return () => {
      clearInterval(interval);
      emblaRoot.removeEventListener("mouseenter", onMouseEnter);
      emblaRoot.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [api, activeSlide]);

  const handleDotClick = (idx: number) => {
    api?.scrollTo(idx);
    setActiveSlide(idx);
  };

  return (
    <section className="relative pt-28 sm:pt-32 lg:pt-40 pb-0 overflow-hidden bg-transparent">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main Hero Grid ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

          {/* ── Left: Main Slide Panel ──────────── col 1-8 */}
          <div className="lg:col-span-8 relative bg-card border border-border rounded-[2rem] overflow-hidden card-shadow min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] flex flex-col justify-between">
            {/* BG glow */}
            <div className="absolute top-[-10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-primary/5 filter blur-[80px] pointer-events-none" />

            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
                align: "start",
              }}
              className="w-full flex-grow flex flex-col"
            >
              <CarouselContent className="flex-grow flex m-0 cursor-grab active:cursor-grabbing select-none">
                {SLIDES.map((slide, idx) => (
                  <CarouselItem
                    key={idx}
                    className="basis-full p-6 sm:p-9 min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-between"
                  >
                    {/* Tag badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 text-primary text-[10px] font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary badge-live flex-shrink-0" />
                        {slide.tag}
                      </span>
                    </div>

                    {/* Center grid */}
                    <div className="flex flex-col-reverse md:flex-row md:items-center gap-6 flex-grow py-2">
                      {/* Text */}
                      <div className="md:w-[55%] space-y-4">
                        <div>
                          <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-2">
                            {slide.accent}
                          </p>
                          <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-serif font-bold text-foreground leading-[1.1] tracking-tight">
                            {slide.title.includes("&") ? (
                              <>
                                {slide.title.split("&")[0]}
                                <span className="text-primary">&</span>
                                {slide.title.split("&")[1]}
                              </>
                            ) : (
                              slide.title
                            )}
                          </h1>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed min-h-[48px] sm:min-h-[60px]">
                          {slide.desc}
                        </p>

                        {/* Stats */}
                        <div className="flex gap-6 pt-1">
                          <div>
                            <p className="text-2xl font-serif font-bold text-foreground">
                              {slide.stat1.value}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {slide.stat1.label}
                            </p>
                          </div>
                          <div className="w-px bg-border" />
                          <div>
                            <p className="text-2xl font-serif font-bold text-foreground">
                              {slide.stat2.value}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {slide.stat2.label}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => router.push(`/collections/${slide.ctaCategory}`)}
                          className="inline-flex items-center gap-2.5 bg-primary text-white px-7 py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-gold-shimmer transition-all duration-300 primary-glow hover:scale-[1.02] cursor-pointer"
                        >
                          {slide.buttonText} <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Product image */}
                      <div className="md:w-[45%] flex items-center justify-center relative min-h-[180px] py-4 select-none pointer-events-none">
                        <div className="absolute w-44 h-44 rounded-full bg-primary/7 filter blur-[50px] pointer-events-none" />
                        <img
                          src={slide.image}
                          alt={slide.title}
                          draggable="false"
                          className="animate-float relative z-10 h-[180px] sm:h-[220px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] pointer-events-none"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Progress dots */}
            <div className="relative z-20 px-6 sm:px-9 pb-6 sm:pb-9 border-t border-border/60 pt-4 bg-card rounded-b-[2rem]">
              <div className="flex items-center gap-3">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className="group flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className="relative h-[3px] rounded-full bg-border overflow-hidden transition-all duration-300"
                      style={{ width: idx === activeSlide ? "48px" : "16px" }}
                    >
                      {idx === activeSlide && (
                        <div
                          className="absolute inset-y-0 left-0 bg-primary rounded-full"
                          style={{ width: `${progress}%`, transition: "width 50ms linear" }}
                        />
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${idx === activeSlide ? "text-primary" : "text-muted-foreground"}`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Promo Cards ──────────── col 9-12 */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* JUUL 1 Series Promo */}
            <div
              className="flex-1 bg-card border border-border rounded-[2rem] p-4 flex gap-4 items-center justify-between relative overflow-hidden group card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push("/collections/juul?sub=JUUL%201%20Series")}
            >
              <div className="absolute bottom-0 right-0 w-36 h-36 rounded-full bg-orange-50 dark:bg-primary/5 filter blur-2xl pointer-events-none" />
              
              {/* Left content */}
              <div className="flex flex-col justify-center flex-grow min-w-0 z-10 gap-3 py-1">
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase block mb-1">JUUL 1 Series</span>
                  <h3 className="text-base font-serif font-bold text-foreground leading-snug">JUUL 1 Devices & Pods</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-normal">Original USA Stock · 3% & 5% Nic</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full group-hover:bg-gold-shimmer transition-all duration-300 primary-glow hover:scale-[1.03] active:scale-95 w-fit">
                  Shop JUUL 1 <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Right Product Image */}
              <div className="w-[90px] sm:w-[100px] flex-shrink-0 relative flex items-center justify-center z-10">
                <div className="absolute w-20 h-20 rounded-full bg-primary/5 filter blur-[25px]" />
                <img 
                  src="/juul_device.png" 
                  alt="JUUL 1" 
                  className="relative h-[120px] sm:h-[140px] w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:rotate-2 transition-all duration-500" 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
                />
              </div>
            </div>

            {/* JUUL 2 Series Promo */}
            <div
              className="flex-1 bg-primary border border-primary rounded-[2rem] p-4 flex gap-4 items-center justify-between relative overflow-hidden group card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push("/collections/juul?sub=JUUL%202%20Series")}
            >
              <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-white/10 filter blur-2xl pointer-events-none" />
              
              {/* Left content */}
              <div className="flex flex-col justify-center flex-grow min-w-0 z-10 gap-3 py-1">
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-white/70 uppercase block mb-1">JUUL 2 Series</span>
                  <h3 className="text-base font-serif font-bold text-white leading-snug">JUUL 2 Devices & Pods</h3>
                  <p className="text-[11px] text-white/80 mt-1 leading-normal">Authentic UK Stock · 18mg Nic</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white text-primary text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full group-hover:opacity-90 transition-all duration-300 shadow-sm hover:scale-[1.03] active:scale-95 w-fit">
                  Shop JUUL 2 <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Right Product Image */}
              <div className="w-[90px] sm:w-[100px] flex-shrink-0 relative flex items-center justify-center z-10">
                <div className="absolute w-20 h-20 rounded-full bg-white/10 filter blur-[25px]" />
                <img 
                  src="/juul_device.png" 
                  alt="JUUL 2" 
                  className="relative h-[120px] sm:h-[140px] w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:-rotate-2 transition-all duration-500" 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
