"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Package, Zap, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ProductSectionCarousel } from "./ProductSectionCarousel";

export interface Product {
  id: string;
  name: string;
  handle: string;
  variantId: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  hoverImage?: string;
  images?: string[];
  tag?: string;
  tagColor?: string;
  isPopular?: boolean;
  isSoldOut?: boolean;
  puffs?: string;
  nicotine?: string;
  battery?: string;
  section?: string;
  brand?: string;
  collections?: string[];
}



const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "juul", label: "JUUL" },
  { id: "disposables", label: "Disposable" },
  { id: "e-liquids", label: "E-Juice" },
  { id: "accessories", label: "Pod System" },
];

export const FlashSaleTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 59, 59, 999);
      
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const format = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="relative bg-zinc-950/85 backdrop-blur-md border border-white/5 rounded-2xl py-6 px-4 mb-6 flex flex-col items-center justify-center overflow-hidden shadow-[var(--shadow-card)] w-full">
      {/* Subtle radial golden glow behind timer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-16 bg-primary/10 rounded-full filter blur-[35px] pointer-events-none" />

      {/* Pulsing red/gold label */}
      <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase mb-4 relative z-10 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        Flash Sale Ends In
      </span>

      {/* Timer digits */}
      <div className="flex items-center gap-3 sm:gap-4 relative z-10">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="bg-[#121214] border border-white/5 rounded-xl px-4 py-2 min-w-[56px] text-center shadow-inner">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              {!isMounted ? "00" : format(timeLeft.hours)}
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-2">Hours</span>
        </div>

        <span className="text-2xl font-bold text-zinc-500/50 -mt-6">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="bg-[#121214] border border-white/5 rounded-xl px-4 py-2 min-w-[56px] text-center shadow-inner">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              {!isMounted ? "00" : format(timeLeft.minutes)}
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-2">Minutes</span>
        </div>

        <span className="text-2xl font-bold text-zinc-500/50 -mt-6">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="bg-[#121214] border border-white/5 rounded-xl px-4 py-2 min-w-[56px] text-center shadow-inner">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-primary tracking-tight">
              {!isMounted ? "00" : format(timeLeft.seconds)}
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-2">Seconds</span>
        </div>
      </div>
    </div>
  );
};

interface ProductFeedProps {
  searchQuery: string;
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

export function ProductCard({ product, onAddToCart, onBuyNow }: { product: Product; onAddToCart: (p: Product) => void; onBuyNow: (p: Product) => void }) {
  const [hovered, setHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isSale = product.tagColor === "sale";

  const allImagesList = useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    if (product.hoverImage) return [product.image, product.hoverImage];
    return [product.image];
  }, [product]);

  const displayedImage = allImagesList[activeImageIndex] || product.image;

  // Preload all variant images for instant 0ms switching
  useEffect(() => {
    if (typeof window !== "undefined" && allImagesList.length > 0) {
      allImagesList.forEach((url) => {
        const img = new globalThis.Image();
        img.src = url;
      });
    }
  }, [allImagesList]);

  return (
    <div
      onMouseEnter={() => {
        setHovered(true);
        if (activeImageIndex === 0 && allImagesList.length > 1) {
          setActiveImageIndex(1);
        }
      }}
      onMouseLeave={() => {
        setHovered(false);
        setActiveImageIndex(0);
      }}
      className="group relative bg-card border-2 border-primary/20 hover:border-primary rounded-[1.8rem] sm:rounded-[2.2rem] p-3 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col w-full h-full overflow-hidden"
    >
      {/* Large Image Area */}
      <div className="relative bg-muted/20 rounded-[1.3rem] sm:rounded-[1.8rem] h-52 sm:h-72 lg:h-80 p-3 sm:p-5 flex items-center justify-center overflow-hidden border border-primary/15 group-hover:border-primary/40 transition-all duration-300">
        <div className="absolute w-56 h-56 rounded-full bg-primary/5 filter blur-2xl pointer-events-none" />
        
        {/* Loading Skeleton Shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-muted/40 animate-pulse p-4">
            <div className="w-24 h-36 bg-primary/10 rounded-2xl animate-pulse mb-2 border border-primary/10 flex items-center justify-center shadow-inner">
              <Package className="w-8 h-8 text-primary/40 animate-bounce" />
            </div>
            <div className="w-20 h-2 bg-primary/20 rounded-full animate-pulse" />
          </div>
        )}

        <Link href={`/product/${product.handle}`} className="block relative z-10 w-full h-full flex items-center justify-center">
          <Image
            key={displayedImage}
            src={displayedImage}
            alt={product.name}
            width={260}
            height={260}
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 230px, 260px"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/hero_vape.png";
              setImageLoaded(true);
            }}
            className={`h-[160px] sm:h-[230px] lg:h-[260px] max-h-full w-auto object-contain filter drop-shadow-md transition-all duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${hovered ? "scale-105" : "scale-100"}`}
          />
        </Link>

        {/* Multi-Variant Image Swatch Dots Bar */}
        {allImagesList.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full z-20 border border-white/20 shadow-md transition-all duration-300 opacity-80 group-hover:opacity-100">
            {allImagesList.slice(0, 6).map((_, idx) => (
              <button
                key={idx}
                onMouseEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? "bg-primary scale-125 ring-2 ring-primary/40 shadow-sm"
                    : "bg-white/60 hover:bg-white hover:scale-110"
                }`}
                aria-label={`View variant image ${idx + 1}`}
              />
            ))}
            {allImagesList.length > 6 && (
              <span className="text-[9px] font-extrabold text-white/90 pl-1">
                +{allImagesList.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Top-Left Tag / Sold Out Badge */}
        {(product.isSoldOut || product.tag) && (
          <div className={`absolute top-3 left-3 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full pointer-events-none z-20 shadow-xs ${
            product.isSoldOut
              ? "bg-[#2D2A26] text-white"
              : isSale
              ? "bg-primary text-white"
              : "bg-card/95 text-primary border border-primary/20"
          }`}>
            {product.isSoldOut ? "SOLD OUT" : product.tag}
          </div>
        )}

        {/* Hover Quick Add Icon */}
        {!product.isSoldOut && (
          <button
            onClick={() => onAddToCart(product)}
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer hover:bg-gold-shimmer z-20 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            aria-label="Quick add"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-2.5 flex-grow pt-4 px-1">
        {/* Section / Category tag */}
        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
          {product.section || product.category}
        </span>

        {/* Product Title */}
        <Link href={`/product/${product.handle}`} className="hover:text-primary transition-colors block">
          <h3 className="text-sm sm:text-base font-serif font-black text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 min-h-[44px]">
            {product.name}
          </h3>
        </Link>

        {/* Specs Badges */}
        {(product.puffs || product.nicotine) && (
          <div className="flex flex-wrap gap-1.5 my-0.5">
            {product.puffs && product.puffs !== "Refillable" && (
              <span className="text-[9px] bg-muted/70 text-muted-foreground px-2.5 py-0.5 rounded-full font-semibold">{product.puffs}</span>
            )}
            {product.nicotine && product.nicotine !== "Universal" && (
              <span className="text-[9px] bg-muted/70 text-muted-foreground px-2.5 py-0.5 rounded-full font-semibold">{product.nicotine}</span>
            )}
          </div>
        )}

        {/* Rating & Price Row */}
        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400 flex-shrink-0" />
            <span className="text-xs font-bold text-foreground">{product.rating}</span>
            <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="text-right">
            {product.originalPrice && (
              <p className="text-[11px] text-muted-foreground line-through">Dhs. {product.originalPrice.toFixed(2)}</p>
            )}
            <p className="text-base sm:text-lg font-serif font-black text-primary">
              Dhs. {product.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Full-width Action Pill Button (Matches Screenshot) */}
        <div className="pt-3 mt-1">
          {product.isSoldOut ? (
            <div className="w-full py-3 rounded-full bg-[#E5DFD5] dark:bg-[#2A241E] text-muted-foreground text-xs font-bold uppercase tracking-wider text-center cursor-not-allowed border border-border/30">
              Sold out
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAddToCart(product)}
                className="py-3 rounded-full bg-card hover:bg-muted/40 border border-border/80 text-foreground text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-98"
              >
                <ShoppingCart className="h-3.5 w-3.5" /> Cart
              </button>
              <button
                onClick={() => onBuyNow(product)}
                className="py-3 rounded-full bg-gradient-to-r from-primary to-orange-500 hover:brightness-105 text-white text-xs font-bold uppercase tracking-wider text-center shadow cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Zap className="h-3.5 w-3.5" /> Buy Now
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export const ProductFeed: React.FC<ProductFeedProps> = ({
  searchQuery,
  activeCategory,
  onCategorySelect,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const activeProductsList = products;

  const filteredProducts = useMemo(() => {
    return activeProductsList.filter((p) => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const matchSearch = searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeProductsList, activeCategory, searchQuery]);

  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Group products by section in exact user-requested order
  const sections = useMemo(() => {
    if (activeCategory !== "all" || searchQuery) return null;
    const groups: Record<string, Product[]> = {};

    // 1. Flash Sale (Discounted items)
    const flashSaleProds = activeProductsList.filter((p) => p.originalPrice && p.originalPrice > p.price);
    if (flashSaleProds.length > 0) groups["Flash Sale"] = flashSaleProds;

    // 2. JUUL 1 Series
    const juul1Prods = activeProductsList.filter((p) => {
      const nameL = p.name.toLowerCase();
      const brandL = (p.brand || "").toLowerCase();
      return (brandL.includes("juul") || nameL.includes("juul")) &&
        !nameL.includes("juul 2") && !nameL.includes("juul2") && !nameL.includes(" 2");
    });
    if (juul1Prods.length > 0) groups["JUUL 1 Series"] = juul1Prods;

    // 3. JUUL 2 Series
    const juul2Prods = activeProductsList.filter((p) => {
      const nameL = p.name.toLowerCase();
      const brandL = (p.brand || "").toLowerCase();
      return (brandL.includes("juul") || nameL.includes("juul")) &&
        (nameL.includes("juul 2") || nameL.includes("juul2") || nameL.includes(" 2"));
    });
    if (juul2Prods.length > 0) groups["JUUL 2 Series"] = juul2Prods;

    // 4. DISPOSABLE VAPE
    const disposableProds = activeProductsList.filter((p) => {
      const catL = (p.category || "").toLowerCase();
      const secL = (p.section || "").toLowerCase();
      const nameL = p.name.toLowerCase();
      return catL.includes("disposable") || secL.includes("disposable") || nameL.includes("disposable") || nameL.includes("puffs") || nameL.includes("bar");
    });
    if (disposableProds.length > 0) groups["DISPOSABLE VAPE"] = disposableProds;

    // 5. Best Sellers
    const bestSellerProds = activeProductsList.filter((p) => p.isPopular || p.reviews > 40);
    if (bestSellerProds.length > 0) groups["Best Sellers"] = bestSellerProds;

    return groups;
  }, [activeProductsList, activeCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      variantId: product.variantId,
      handle: product.handle,
    });
  };

  const router = useRouter();
  const handleBuyNow = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      variantId: product.variantId,
      handle: product.handle,
    });
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleViewAll = (sectionName: string, sectionProducts: Product[]) => {
    if (sectionName === "JUUL 1 Series") {
      router.push("/collections/juul?sub=JUUL%201%20Series");
    } else if (sectionName === "JUUL 2 Series") {
      router.push("/collections/juul?sub=JUUL%202%20Series");
    } else if (sectionName === "Flash Sale") {
      router.push("/collections/all");
    } else {
      const category = sectionProducts[0]?.category || "all";
      if (category === "all") {
        router.push("/collections/all");
      } else {
        router.push(`/collections/${category}`);
      }
    }
  };

  return (
<div className="space-y-8 sm:space-y-10 relative">
      {/* Section header - clean and standalone */}
      <div className="text-center flex flex-col items-center justify-center px-4 sm:px-6 mb-8">
        <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-1.5 flex items-center gap-2 justify-center">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Live Catalog
        </span>
        
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">
          Explore Our Collection
        </h2>

        {/* Premium Divider */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-primary/65" />
          <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
          <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-primary/65" />
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
          Premium vape products. Authentic brands. 2-hour Dubai delivery.
        </p>
      </div>

      {searchQuery && (
        <div className="px-4 sm:px-6">
          <p className="text-xs text-muted-foreground">
            Search results for <span className="font-semibold text-foreground">"{searchQuery}"</span> ({filteredProducts.length} items found)
          </p>
        </div>
      )}

      {/* ── Loading state or product displays ── */}
      {loading ? (
        <div className="bg-card/70 backdrop-blur-md border border-border/40 rounded-[2.2rem] p-6 sm:p-8 shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-card border border-border/40 rounded-[2rem] p-5 flex flex-col gap-4 min-h-[350px]">
                <div className="bg-muted rounded-[1.5rem] h-48 w-full animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
                <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-3.5 bg-muted rounded w-1/2 animate-pulse" />
                <div className="h-10 bg-muted rounded-full w-full mt-auto animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : sections ? (
        <div className="space-y-8 sm:space-y-10">
          {Object.entries(sections).map(([sectionName, products]) => (
            <ProductSectionCarousel
              key={sectionName}
              sectionName={sectionName}
              products={products.slice(0, 10)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onViewAll={handleViewAll}
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-card/70 backdrop-blur-md border border-border/40 rounded-[2.2rem] p-8 sm:p-12 shadow-[var(--shadow-card)] flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Package className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground mb-2">No products found</h3>
          <p className="text-sm text-muted-foreground mb-6">Try a different category or search term.</p>
          <button
            onClick={() => onCategorySelect("all")}
            className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold cursor-pointer hover:bg-gold-shimmer transition-all"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-card/70 backdrop-blur-md border border-border/40 rounded-[2.2rem] p-6 sm:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-6 pb-2">
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage((prev) => prev - 1);
                    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                disabled={currentPage === 1}
                className="p-2 sm:p-2.5 rounded-xl border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {(() => {
                const pages: (number | string)[] = [];
                if (totalPages <= 5) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else if (currentPage <= 3) {
                  pages.push(1, 2, 3, 4, "...", totalPages);
                } else if (currentPage >= totalPages - 2) {
                  pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                } else {
                  pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
                }

                return pages.map((item, idx) =>
                  typeof item === "number" ? (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentPage(item);
                        document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        item === currentPage
                          ? "bg-primary text-white shadow-md scale-105 font-black"
                          : "bg-card border border-border text-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-xs text-muted-foreground font-bold select-none">
                      ...
                    </span>
                  )
                );
              })()}

              <button
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage((prev) => prev + 1);
                    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                disabled={currentPage === totalPages}
                className="p-2 sm:p-2.5 rounded-xl border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
