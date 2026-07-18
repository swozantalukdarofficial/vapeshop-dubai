"use client";

import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { ProductCard, type Product, FlashSaleTimer } from "./ProductFeed";

interface ProductSectionCarouselProps {
  sectionName: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewAll: (sectionName: string, products: Product[]) => void;
}

export const ProductSectionCarousel: React.FC<ProductSectionCarouselProps> = ({
  sectionName,
  products,
  onAddToCart,
  onBuyNow,
  onViewAll,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;

    let intervalId: NodeJS.Timeout;
    let isHovered = false;

    const startAutoScroll = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (isHovered) return;
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, 4000); // 4 seconds interval is perfect for visibility and readability
    };

    startAutoScroll();

    const handlePointerDown = () => {
      if (intervalId) clearInterval(intervalId);
    };
    
    const handlePointerUp = () => {
      startAutoScroll();
    };

    api.on("pointerDown", handlePointerDown);
    api.on("pointerUp", handlePointerUp);

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
      clearInterval(intervalId);
      api.off("pointerDown", handlePointerDown);
      api.off("pointerUp", handlePointerUp);
      emblaRoot.removeEventListener("mouseenter", onMouseEnter);
      emblaRoot.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [api]);

  return (
    <div className="bg-transparent sm:bg-card/70 backdrop-blur-none sm:backdrop-blur-md border-none sm:border sm:border-border/40 rounded-none sm:rounded-[2.2rem] p-0 sm:p-8 shadow-none sm:shadow-[var(--shadow-card)] hover:shadow-none sm:hover:shadow-[var(--shadow-hover)] transition-all duration-300 relative overflow-visible sm:overflow-hidden">
      {/* Subtle top decoration */}
      <div className="hidden sm:block absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />

      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: false,
          dragFree: true,
          containScroll: "trimSnaps",
          breakpoints: {
            "(min-width: 640px)": { align: "start" }
          }
        }}
        className="w-full"
      >
        {/* Section header */}
        <div className="px-4 sm:px-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border/5 relative">
          {/* Spacer for desktop to keep title perfectly centered */}
          <div className="hidden sm:block w-32" />

          {/* Centered Title */}
          <div className="text-center flex flex-col items-center flex-1">
            <span className="text-[9px] font-bold tracking-[0.25em] text-primary uppercase mb-1 flex items-center gap-1.5 justify-center">
              {sectionName === "Flash Sale" && (
                <span className="relative flex h-1.5 w-1.5 mr-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
              )}
              {sectionName === "Flash Sale" ? "Limited Offers" : "Curated Selection"}
            </span>
            
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground tracking-wide">
              {sectionName}
            </h3>

            {/* Premium Divider */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-primary/65" />
              <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
              <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-primary/65" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center sm:justify-end gap-2.5 w-full sm:w-32">
            <button
              onClick={() => onViewAll(sectionName, products)}
              className="text-[11px] font-bold text-primary hover:underline cursor-pointer mr-1 uppercase tracking-wider"
            >
              View All
            </button>
            <CarouselPrevious className="relative left-auto right-auto top-auto bottom-auto translate-x-0 translate-y-0 w-8 h-8 border border-border/60 bg-background/50 hover:bg-background text-muted-foreground hover:text-primary active:scale-95 flex items-center justify-center rounded-full" />
            <CarouselNext className="relative left-auto right-auto top-auto bottom-auto translate-x-0 translate-y-0 w-8 h-8 border border-border/60 bg-background/50 hover:bg-background text-muted-foreground hover:text-primary active:scale-95 flex items-center justify-center rounded-full" />
          </div>
        </div>

        {/* Flash sale extra banner */}
        {sectionName === "Flash Sale" && (
          <div className="px-4 sm:px-0">
            <FlashSaleTimer />
          </div>
        )}

        <div className="-mx-4 sm:mx-0">
          <CarouselContent className="px-4 sm:px-0">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-[92%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex">
                <ProductCard product={product} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        {/* Pagination Dots (Mobile Only) */}
        {scrollSnaps.length > 1 && (
          <div className="flex sm:hidden justify-center gap-1.5 mt-4 pb-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
};
