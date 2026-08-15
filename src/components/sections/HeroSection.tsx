"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
    image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/myle_slider.webp?v=1786640992",
    fallbackImage: "/Slider/myle_slider.webp",
    tag: "🔥 Premium Pod Systems",
    buttonText: "Shop MYLE Collection",
    stat1: { value: "5%", label: "Nicotine Strength" },
    stat2: { value: "V5", label: "Latest Series" },
    ctaCategory: "myle-vape-dubai",
  },
  {
    title: "Disposable Vapes",
    accent: "Premium Disposables",
    desc: "Lost Mary, Al Fakher Crown Bar, Tugboat, BECO, and more. Up to 15,000 puffs. From 40 AED. Cash on delivery available with instant delivery across Dubai.",
    image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/disposable_slider.webp?v=1786640994",
    fallbackImage: "/Slider/disposable_slider.webp",
    tag: "💰 From 40 AED Only",
    buttonText: "Shop Disposables",
    stat1: { value: "15K", label: "Max Puffs" },
    stat2: { value: "40", label: "AED Starting" },
    ctaCategory: "disposable-vape",
  },
  {
    title: "Pod Systems & Kits",
    accent: "Vape Devices & Pods",
    desc: "Refillable and pre-filled pod kits from top brands like Uwell, Geekvape, Vaporesso, OXVA, Voopoo. Compact, powerful, and designed for daily use.",
    image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/pod_kits_slider.webp?v=1786640996",
    fallbackImage: "/Slider/pod_kits_slider.webp",
    tag: "⚡ High Performance Kits",
    buttonText: "Shop Pod Systems",
    stat1: { value: "100%", label: "Authentic" },
    stat2: { value: "Top", label: "Global Brands" },
    ctaCategory: "pod-system",
  },
  {
    title: "Premium E-Liquids & Salts",
    accent: "Nicotine Salts & Freebase",
    desc: "Nasty Juice, Pod Salt, Tokyo, RufPuf, and more. 0mg to 50mg nicotine options. Over 80 premium flavors in stock with same-day 2-hour delivery.",
    image: "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/e_liquid_slider.webp?v=1786640998",
    fallbackImage: "/Slider/e_liquid_slider.webp",
    tag: "⭐ 80+ Flavors Available",
    buttonText: "Shop E-Liquids",
    stat1: { value: "80+", label: "Flavors" },
    stat2: { value: "0-50mg", label: "Nicotine Range" },
    ctaCategory: "vape-e-juice",
  },
];

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    if (!api) return;

    setProgress(0);
    const total = 6000;
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
    <section className="relative pt-16 sm:pt-20 lg:pt-28 pb-4 overflow-hidden bg-transparent">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main Hero Grid ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

          {/* ── Left: Main Slide Panel ──────────── col 1-8 */}
          <div className="lg:col-span-8 relative bg-card border border-border/60 rounded-[2.5rem] overflow-hidden card-shadow min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-between">
            {/* BG glow */}
            <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-primary/8 filter blur-[100px] pointer-events-none" />

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
                    className="basis-full p-6 sm:p-10 lg:p-12 min-h-[440px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-between"
                  >
                    {/* Tag badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-primary badge-live flex-shrink-0" />
                        {slide.tag}
                      </span>
                    </div>

                    {/* Center grid */}
                    <div className="flex flex-col md:flex-row md:items-center gap-6 sm:gap-8 flex-grow py-2">
                      {/* Product image (Placed TOP on mobile, RIGHT on desktop) */}
                      <div className="md:w-[45%] md:order-2 flex items-center justify-center relative min-h-[200px] sm:min-h-[320px] py-2 sm:py-4 select-none pointer-events-none">
                        <div className="absolute w-44 sm:w-56 h-44 sm:h-56 rounded-full bg-primary/8 filter blur-[60px] pointer-events-none" />
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          width={420}
                          height={420}
                          draggable={false}
                          priority={idx === 0}
                          fetchPriority={idx === 0 ? "high" : "auto"}
                          sizes="(max-width: 640px) 200px, (max-width: 1024px) 360px, 420px"
                          className="animate-float relative z-10 max-h-[220px] sm:max-h-[340px] lg:max-h-[390px] w-auto max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] pointer-events-none"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = slide.fallbackImage || "/vape_kit.png";
                          }}
                        />
                      </div>

                      {/* Text content (Placed BELOW image on mobile, LEFT on desktop) */}
                      <div className="md:w-[55%] md:order-1 space-y-4 sm:space-y-5">
                        <div>
                          <p className="text-[10px] sm:text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-1.5 sm:mb-2">
                            {slide.accent}
                          </p>
                          {idx === 0 ? (
                            <h1 className="text-3xl sm:text-5xl lg:text-[3.3rem] font-serif font-black text-foreground leading-[1.08] tracking-tight">
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
                          ) : (
                            <h2 className="text-3xl sm:text-5xl lg:text-[3.3rem] font-serif font-black text-foreground leading-[1.08] tracking-tight">
                              {slide.title.includes("&") ? (
                                <>
                                  {slide.title.split("&")[0]}
                                  <span className="text-primary">&</span>
                                  {slide.title.split("&")[1]}
                                </>
                              ) : (
                                slide.title
                              )}
                            </h2>
                          )}
                        </div>
                        <p className="text-xs sm:text-base text-muted-foreground leading-relaxed font-normal min-h-[40px] sm:min-h-[64px]">
                          {slide.desc}
                        </p>

                        {/* Stats */}
                        <div className="flex gap-6 sm:gap-8 pt-1 sm:pt-2">
                          <div>
                            <p className="text-2xl sm:text-4xl font-serif font-extrabold text-foreground">
                              {slide.stat1.value}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-0.5 sm:mt-1">
                              {slide.stat1.label}
                            </p>
                          </div>
                          <div className="w-px bg-border/60" />
                          <div>
                            <p className="text-2xl sm:text-4xl font-serif font-extrabold text-foreground">
                              {slide.stat2.value}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-0.5 sm:mt-1">
                              {slide.stat2.label}
                            </p>
                          </div>
                        </div>

                        {/* Button */}
                        <div className="pt-2">
                          <button
                            onClick={() => router.push(`/collections/${slide.ctaCategory}`)}
                            className="inline-flex items-center gap-2.5 bg-primary text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-base font-extrabold tracking-wide hover:bg-gold-shimmer transition-all duration-300 primary-glow hover:scale-[1.03] active:scale-95 cursor-pointer shadow-md"
                          >
                            {slide.buttonText} <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Progress dots */}
            <div className="relative z-20 px-8 sm:px-12 pb-6 sm:pb-8 border-t border-border/60 pt-4 bg-card rounded-b-[2.5rem]">
              <div className="flex items-center gap-4">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className="group flex items-center gap-2 cursor-pointer py-1"
                  >
                    <div
                      className="relative h-[4px] rounded-full bg-border/80 overflow-hidden transition-all duration-300"
                      style={{ width: idx === activeSlide ? "56px" : "20px" }}
                    >
                      {idx === activeSlide && (
                        <div
                          className="absolute inset-y-0 left-0 bg-primary rounded-full"
                          style={{ width: `${progress}%`, transition: "width 50ms linear" }}
                        />
                      )}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${idx === activeSlide ? "text-primary font-black" : "text-muted-foreground"}`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Promo Cards ──────────── col 9-12 */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* JUUL 1 Series Promo */}
            <div
              className="flex-1 bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-8 flex gap-5 items-center justify-between relative overflow-hidden group card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1.5 cursor-pointer min-h-[260px] sm:min-h-[290px]"
              onClick={() => router.push("/collections/juul-1-series")}
            >
              <div className="absolute bottom-0 right-0 w-44 h-44 rounded-full bg-orange-50 dark:bg-primary/5 filter blur-3xl pointer-events-none" />

              {/* Left content */}
              <div className="flex flex-col justify-center flex-grow min-w-0 z-10 gap-4 py-1">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-1.5">JUUL 1 Series</span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-foreground leading-snug">JUUL 1 Devices & Pods</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">Original USA Stock · 3% & 5% Nic</p>
                </div>
                <div className="inline-flex items-center gap-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full group-hover:bg-gold-shimmer transition-all duration-300 primary-glow hover:scale-[1.04] active:scale-95 w-fit shadow-xs">
                  Shop JUUL 1 <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Right Product Image */}
              <div className="w-[120px] sm:w-[140px] h-[160px] sm:h-[190px] flex-shrink-0 relative flex items-center justify-center z-10 overflow-hidden">
                <div className="absolute w-24 h-24 rounded-full bg-primary/5 filter blur-[30px] pointer-events-none" />
                <Image
                  src="https://cdn.shopify.com/s/files/1/0684/3488/6727/files/juul_1_slider.webp?v=1786641000"
                  alt="JUUL 1"
                  width={140}
                  height={190}
                  sizes="140px"
                  className="relative max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)] group-hover:scale-108 group-hover:rotate-2 transition-all duration-500 pointer-events-none"
                />
              </div>
            </div>

            {/* JUUL 2 Series Promo */}
            <div
              className="flex-1 bg-primary border border-primary rounded-[2.5rem] p-6 sm:p-8 flex gap-5 items-center justify-between relative overflow-hidden group card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1.5 cursor-pointer min-h-[260px] sm:min-h-[290px]"
              onClick={() => router.push("/collections/juul-2-series")}
            >
              <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-white/10 filter blur-3xl pointer-events-none" />

              {/* Left content */}
              <div className="flex flex-col justify-center flex-grow min-w-0 z-10 gap-4 py-1">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase block mb-1.5">JUUL 2 Series</span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-snug">JUUL 2 Devices & Pods</h3>
                  <p className="text-xs sm:text-sm text-white/85 mt-1.5 leading-relaxed">Authentic UK Stock · 18mg Nic</p>
                </div>
                <div className="inline-flex items-center gap-2.5 bg-white text-primary text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full group-hover:opacity-95 transition-all duration-300 shadow-md hover:scale-[1.04] active:scale-95 w-fit">
                  Shop JUUL 2 <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Right Product Image */}
              <div className="w-[120px] sm:w-[140px] h-[160px] sm:h-[190px] flex-shrink-0 relative flex items-center justify-center z-10 overflow-hidden">
                <div className="absolute w-24 h-24 rounded-full bg-white/10 filter blur-[30px] pointer-events-none" />
                <Image
                  src="https://cdn.shopify.com/s/files/1/0684/3488/6727/files/juul_2_slider.webp?v=1786641001"
                  alt="JUUL 2"
                  width={140}
                  height={190}
                  sizes="140px"
                  className="relative max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)] group-hover:scale-108 group-hover:-rotate-2 transition-all duration-500 pointer-events-none"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
