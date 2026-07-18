"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Package, Zap, Tag } from "lucide-react";
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
  tag?: string;
  tagColor?: string;
  isPopular?: boolean;
  isSoldOut?: boolean;
  puffs?: string;
  nicotine?: string;
  battery?: string;
  section?: string;
  brand?: string;
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
  const isSale = product.tagColor === "sale";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-card border border-border rounded-[1.5rem] overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1.5 flex flex-col w-full"
    >
      {/* Image area */}
      <div className="relative bg-muted/30 mx-3 mt-3 rounded-[1.1rem] h-44 sm:h-56 flex items-center justify-center overflow-hidden">
        <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-primary/5 filter blur-2xl pointer-events-none" />
        <Link href={`/product/${product.handle}`} className="block relative z-10 w-full h-full flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="h-32 sm:h-44 w-auto object-contain drop-shadow-md transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
          />
        </Link>

        {/* Tag badge */}
        {product.tag && (
          <div className={`absolute top-2.5 left-2.5 text-[8px] sm:text-[9px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full pointer-events-none z-20 ${
            product.isSoldOut
              ? "bg-foreground/80 text-background"
              : isSale
              ? "bg-primary text-white"
              : "bg-white/90 dark:bg-card/90 text-primary border border-primary/20"
          }`}>
            {product.isSoldOut ? "Sold Out" : product.tag}
          </div>
        )}

        {/* Hover quick-add */}
        {!product.isSoldOut && (
          <button
            onClick={() => onAddToCart(product)}
            className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer hover:bg-gold-shimmer z-20 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            aria-label="Quick add"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-grow">
        {/* Category label */}
        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-primary uppercase">
          {product.section || product.category}
        </span>

        {/* Name */}
        <Link href={`/product/${product.handle}`} className="hover:text-primary transition-colors block">
          <h3 className="text-[13px] sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[40px]">{product.name}</h3>
        </Link>

        {/* Specs */}
        <div className="flex flex-wrap gap-1">
          {product.puffs && product.puffs !== "Refillable" && (
            <span className="text-[8px] sm:text-[9px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium">{product.puffs}</span>
          )}
          {product.nicotine && product.nicotine !== "Universal" && (
            <span className="text-[8px] sm:text-[9px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium">{product.nicotine}</span>
          )}
        </div>

        {/* Rating + Price */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-foreground">{product.rating}</span>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground">({product.reviews})</span>
          </div>
          <div className="text-right">
            {product.originalPrice && (
              <p className="text-[10px] sm:text-[11px] text-muted-foreground line-through">Dhs. {product.originalPrice.toLocaleString()}</p>
            )}
            <p className="text-sm sm:text-base font-serif font-bold text-foreground">Dhs. {product.price.toLocaleString()}</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-0.5">
          <button
            onClick={() => !product.isSoldOut && onAddToCart(product)}
            disabled={product.isSoldOut}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-bold tracking-wide transition-all duration-200 cursor-pointer ${
              product.isSoldOut
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-card hover:bg-muted/40 border border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {product.isSoldOut ? (
              "Sold Out"
            ) : (
              <><ShoppingCart className="h-3.5 w-3.5" /> Cart</>
            )}
          </button>
          {!product.isSoldOut && (
            <button
              onClick={() => onBuyNow(product)}
              className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-bold tracking-wide bg-gradient-to-r from-primary to-orange-500 text-white hover:brightness-110 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm"
            >
              <Zap className="h-3.5 w-3.5" /> Buy Now
            </button>
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

  // Group products by section for "all" view
  const sections = useMemo(() => {
    if (activeCategory !== "all" || searchQuery) return null;
    const groups: Record<string, Product[]> = {};
    activeProductsList.forEach((p) => {
      const key = p.section || p.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
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
        <span className="text-[9px] font-bold tracking-[0.25em] text-primary uppercase mb-1 flex items-center gap-1.5 justify-center">
          <span className="relative flex h-1.5 w-1.5 mr-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          Live Catalog
        </span>
        
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground tracking-wide">
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
              products={products}
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
        <div className="bg-card/70 backdrop-blur-md border border-border/40 rounded-[2.2rem] p-6 sm:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
