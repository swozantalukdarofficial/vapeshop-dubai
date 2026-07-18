"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { useCart } from "@/context/CartContext";
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Sparkles
} from "lucide-react";

interface Variant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
  inventoryQuantity: number;
}

interface ProductDetails {
  id: string;
  name: string;
  handle: string;
  descriptionHtml: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  tag?: string;
  tagColor?: string;
  isPopular: boolean;
  isSoldOut: boolean;
  puffs?: string;
  nicotine?: string;
  battery?: string;
  shortDescription?: string;
  specsTable?: any;
  faqAccordion?: any;
  variants: Variant[];
  section?: string;
}

export default function ProductPage() {
  const params = useParams();
  const handle = params?.handle as string;
  const router = useRouter();
  
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "faq">("description");
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  // For Navbar states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (!handle) return;

    async function fetchProduct() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/products/${handle}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
        setProduct(data);
        setActiveImage(data.image);
        
        // Select first available variant only if there is 1 option.
        // If there are multiple options/flavors, default to null so user must select.
        if (data.variants && data.variants.length > 1) {
          setSelectedVariant(null);
        } else {
          const firstAvailable = data.variants.find((v: Variant) => v.availableForSale) || data.variants[0] || null;
          setSelectedVariant(firstAvailable);
        }

        // Fetch similar products
        const allRes = await fetch("/api/products");
        if (allRes.ok) {
          const allData = await allRes.json();
          const filtered = allData
            .filter((p: any) => p.category === data.category && p.handle !== data.handle)
            .slice(0, 4);
          setSimilarProducts(filtered);
        }
      } catch (err: any) {
        console.error("Error loading product:", err);
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [handle]);

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    addToCart({
      id: `${product.id}-${selectedVariant.id}`,
      name: `${product.name} ${product.variants.length > 1 ? `- ${selectedVariant.title}` : ""}`.trim(),
      price: selectedVariant.price,
      image: activeImage || product.image,
      category: product.category,
      variantId: selectedVariant.id,
      handle: product.handle,
    }, quantity);
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;
    
    addToCart({
      id: `${product.id}-${selectedVariant.id}`,
      name: `${product.name} ${product.variants.length > 1 ? `- ${selectedVariant.title}` : ""}`.trim(),
      price: selectedVariant.price,
      image: activeImage || product.image,
      category: product.category,
      variantId: selectedVariant.id,
      handle: product.handle,
    }, quantity);

    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="relative flex flex-col min-h-screen bg-background text-foreground">
        <Navbar onSearchChange={setSearchQuery} onCategorySelect={setActiveCategory} activeCategory={activeCategory} />
        <main className="flex-grow max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="animate-pulse flex flex-col gap-4">
              <div className="bg-muted rounded-[2rem] aspect-square w-full" />
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-muted rounded-xl h-20 w-20 flex-shrink-0" />
                ))}
              </div>
            </div>
            <div className="animate-pulse flex flex-col gap-6">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-24 bg-muted rounded w-full" />
              <div className="h-12 bg-muted rounded w-full mt-auto" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative flex flex-col min-h-screen bg-background text-foreground">
        <Navbar onSearchChange={setSearchQuery} onCategorySelect={setActiveCategory} activeCategory={activeCategory} />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
          <h2 className="text-3xl font-serif font-bold text-foreground">Product Not Found</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            The product you are looking for might have been removed or the handle is incorrect.
          </p>
          <Link
            href="/"
            className="mt-8 flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-gold-shimmer transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isSale = selectedVariant && selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price;
  const discountPercent = isSale && selectedVariant.compareAtPrice
    ? Math.round(((selectedVariant.compareAtPrice - selectedVariant.price) / selectedVariant.compareAtPrice) * 100)
    : 0;

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q) router.push(`/?search=${encodeURIComponent(q)}`);
        }}
        onCategorySelect={(c) => {
          setActiveCategory(c);
          router.push(`/?category=${encodeURIComponent(c)}`);
        }}
        activeCategory={activeCategory}
      />

      <main className="flex-grow pb-24 pt-20 sm:pt-28">
        {/* Breadcrumb */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-primary transition-colors cursor-pointer capitalize">{product.category}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
          </nav>
        </div>

        {/* Product Details Section */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Left: Image Gallery */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="relative bg-muted/20 border border-border/40 rounded-[2.5rem] p-6 sm:p-10 flex items-center justify-center aspect-square overflow-hidden shadow-sm">
                <div className="absolute w-64 h-64 rounded-full bg-primary/5 filter blur-3xl pointer-events-none" />
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-[350px] sm:max-h-[450px] w-auto object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
                />
                {product.tag && (
                  <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow">
                    {product.tag}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`h-20 w-20 rounded-2xl border-2 overflow-hidden bg-card p-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${
                        activeImage === img ? "border-primary shadow" : "border-border/40 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumb ${idx + 1}`}
                        className="h-full w-auto object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/5 border border-primary/20 px-3.5 py-1 rounded-full">
                  {product.section || product.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating & Reviews */}
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews} authentic reviews)</span>
                </div>
              </div>

              {/* Specs Badge Bar */}
              {(product.puffs || product.nicotine || product.battery) && (
                <div className="flex flex-wrap gap-2.5 py-2 border-y border-border/40">
                  {product.puffs && (
                    <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-xl text-xs">
                      <span className="font-semibold text-muted-foreground">Puffs:</span>
                      <span className="font-bold text-foreground">{product.puffs}</span>
                    </div>
                  )}
                  {product.nicotine && (
                    <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-xl text-xs">
                      <span className="font-semibold text-muted-foreground">Nicotine:</span>
                      <span className="font-bold text-foreground">{product.nicotine}</span>
                    </div>
                  )}
                  {product.battery && (
                    <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-xl text-xs">
                      <span className="font-semibold text-muted-foreground">Battery:</span>
                      <span className="font-bold text-foreground">{product.battery}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Section */}
              <div className="flex items-center gap-4 bg-muted/10 border border-border/30 p-5 rounded-[1.5rem]">
                <div>
                  {isSale && selectedVariant && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-through">Dhs. {selectedVariant.compareAtPrice?.toLocaleString()}</p>
                  )}
                  <p className="text-2xl sm:text-3xl font-serif font-black text-foreground">
                    Dhs. {selectedVariant ? selectedVariant.price.toLocaleString() : product.price.toLocaleString()}
                  </p>
                </div>
                {isSale && discountPercent > 0 && (
                  <span className="bg-primary text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow animate-pulse">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Variant Selector (Dropdown) */}
              {product.variants && product.variants.length > 1 && (
                <div className="space-y-3 relative">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Flavor / Option:</p>
                  
                  <div className="relative">
                    {/* Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between bg-card hover:bg-muted/30 border border-border px-4 py-3.5 rounded-2xl text-xs font-bold text-foreground transition-all duration-300 shadow-sm cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20"
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedVariant ? (selectedVariant.availableForSale ? "bg-emerald-500 animate-pulse" : "bg-zinc-500") : "bg-primary animate-pulse"}`} />
                        {selectedVariant ? selectedVariant.title : "Select Flavor"}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-primary" : ""}`} />
                    </button>

                    {/* Backdrop for click-away */}
                    {isDropdownOpen && (
                      <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setIsDropdownOpen(false)}
                      />
                    )}

                    {/* Options Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-2 z-50 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-border/40 scrollbar-thin animate-in fade-in slide-in-from-top-2 duration-200">
                        {product.variants.map((v) => {
                          const isSelected = selectedVariant?.id === v.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => {
                                if (v.availableForSale) {
                                  setSelectedVariant(v);
                                  setIsDropdownOpen(false);
                                }
                              }}
                              disabled={!v.availableForSale}
                              className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-left transition-all cursor-pointer ${
                                !v.availableForSale
                                  ? "opacity-40 cursor-not-allowed bg-muted/20 line-through text-muted-foreground/60"
                                  : isSelected
                                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                                  : "hover:bg-muted/40 text-foreground"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${v.availableForSale ? "bg-emerald-500" : "bg-zinc-400"}`} />
                                {v.title}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground">
                                  {v.availableForSale ? `Dhs. ${v.price}` : "Out of Stock"}
                                </span>
                                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-xl bg-card overflow-hidden h-10">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 h-full hover:bg-muted/50 transition-colors flex items-center justify-center cursor-pointer text-foreground"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-foreground">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 h-full hover:bg-muted/50 transition-colors flex items-center justify-center cursor-pointer text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!!product.isSoldOut || !selectedVariant || !selectedVariant.availableForSale}
                  className="bg-card hover:bg-muted/40 border border-border text-foreground font-bold tracking-wider py-3.5 sm:py-4 px-2 rounded-2xl text-[10px] sm:text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> {!selectedVariant ? "Select Flavor" : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!!product.isSoldOut || !selectedVariant || !selectedVariant.availableForSale}
                  className="bg-gradient-to-r from-primary to-orange-500 text-white font-bold tracking-wider py-3.5 sm:py-4 px-2 rounded-2xl text-[10px] sm:text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 hover:brightness-105 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-3.5 w-3.5" /> {!selectedVariant ? "Select Flavor" : "Buy Now"}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-6 border-t border-border/40 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] leading-tight font-bold text-foreground px-1">2hr Dubai Delivery</p>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] leading-tight font-bold text-foreground px-1">100% Authentic</p>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20">
                    <RotateCcw className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] leading-tight font-bold text-foreground px-1">COD Available</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Dynamic description & Specs Tabs */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
          <div className="bg-card border border-border/40 rounded-[2rem] p-6 sm:p-10 shadow-sm">
            
            {/* Tab Headers */}
            <div className="flex border-b border-border/40 gap-6 sm:gap-10 pb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab("description")}
                className={`text-xs sm:text-sm font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer relative ${
                  activeTab === "description" ? "text-primary font-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Description
                {activeTab === "description" && <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" />}
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`text-xs sm:text-sm font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer relative ${
                  activeTab === "specs" ? "text-primary font-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Specifications
                {activeTab === "specs" && <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" />}
              </button>
              <button
                onClick={() => setActiveTab("faq")}
                className={`text-xs sm:text-sm font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer relative ${
                  activeTab === "faq" ? "text-primary font-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                FAQs
                {activeTab === "faq" && <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" />}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="mt-8">
              
              {activeTab === "description" && (
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  {product.shortDescription && (
                    <div
                      className="mb-6 font-medium text-foreground/90 text-sm border-l-2 border-primary pl-4"
                      dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                    />
                  )}
                  {product.descriptionHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                  ) : (
                    <p>No details description is available for this product. Feel free to contact our customer support for details specifications.</p>
                  )}
                </div>
              )}

              {activeTab === "specs" && (
                <div className="max-w-2xl">
                  {product.specsTable && Array.isArray(product.specsTable) ? (
                    <div className="border border-border/40 rounded-xl overflow-hidden divide-y divide-border/40">
                      {product.specsTable.map((spec: any, idx: number) => (
                        <div key={idx} className="grid grid-cols-2 p-4 text-xs sm:text-sm bg-card hover:bg-muted/10 transition-colors">
                          <span className="font-bold text-muted-foreground uppercase tracking-wider">{spec.name}</span>
                          <span className="text-foreground font-semibold">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-border/40 rounded-xl overflow-hidden divide-y divide-border/40">
                      {product.puffs && (
                        <div className="grid grid-cols-2 p-4 text-xs sm:text-sm bg-card hover:bg-muted/10 transition-colors">
                          <span className="font-bold text-muted-foreground uppercase tracking-wider">Puffs Count</span>
                          <span className="text-foreground font-semibold">{product.puffs}</span>
                        </div>
                      )}
                      {product.nicotine && (
                        <div className="grid grid-cols-2 p-4 text-xs sm:text-sm bg-card hover:bg-muted/10 transition-colors">
                          <span className="font-bold text-muted-foreground uppercase tracking-wider">Nicotine Level</span>
                          <span className="text-foreground font-semibold">{product.nicotine}</span>
                        </div>
                      )}
                      {product.battery && (
                        <div className="grid grid-cols-2 p-4 text-xs sm:text-sm bg-card hover:bg-muted/10 transition-colors">
                          <span className="font-bold text-muted-foreground uppercase tracking-wider">Battery Spec</span>
                          <span className="text-foreground font-semibold">{product.battery}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 p-4 text-xs sm:text-sm bg-card hover:bg-muted/10 transition-colors">
                        <span className="font-bold text-muted-foreground uppercase tracking-wider">Origin</span>
                        <span className="text-foreground font-semibold">100% Authentic / Original Brand</span>
                      </div>
                      <div className="grid grid-cols-2 p-4 text-xs sm:text-sm bg-card hover:bg-muted/10 transition-colors">
                        <span className="font-bold text-muted-foreground uppercase tracking-wider">Delivery Time</span>
                        <span className="text-foreground font-semibold">Within 2 Hours in Dubai</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "faq" && (
                <div className="max-w-3xl space-y-4">
                  {product.faqAccordion && Array.isArray(product.faqAccordion) ? (
                    product.faqAccordion.map((faq: any, idx: number) => (
                      <div key={idx} className="border border-border/40 rounded-2xl p-5 bg-card">
                        <h4 className="font-bold text-foreground text-sm sm:text-base mb-2">{faq.question}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="border border-border/40 rounded-2xl p-5 bg-card">
                        <h4 className="font-bold text-foreground text-sm sm:text-base mb-2">Is this product original?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Yes, 100%. We source our products directly from manufacturers or authorized regional dealers. Each pack contains a verification code that you can authenticate on the brand's official website.
                        </p>
                      </div>
                      <div className="border border-border/40 rounded-2xl p-5 bg-card">
                        <h4 className="font-bold text-foreground text-sm sm:text-base mb-2">How fast is delivery?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          We deliver within 2 hours across Dubai and offer same-day delivery across Abu Dhabi, Sharjah, and other emirates in the UAE.
                        </p>
                      </div>
                      <div className="border border-border/40 rounded-2xl p-5 bg-card">
                        <h4 className="font-bold text-foreground text-sm sm:text-base mb-2">Can I pay on delivery?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Absolutely. We support Cash on Delivery (COD) as well as Card on Delivery options to make your shopping experience convenient and secure.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Similar Products Recommendation Slider */}
        {similarProducts.length > 0 && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Recommendations
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground">You May Also Like</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {similarProducts.map((p) => {
                const isSaleItem = p.originalPrice && p.originalPrice > p.price;
                return (
                  <div key={p.id} className="group bg-card border border-border/40 rounded-[2rem] overflow-hidden flex flex-col p-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                    <Link href={`/product/${p.handle}`} className="relative bg-muted/10 rounded-[1.5rem] aspect-square flex items-center justify-center overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-32 sm:h-40 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
                      />
                    </Link>
                    <div className="p-3 flex flex-col gap-2 flex-grow mt-2">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider">{p.category}</span>
                      <Link href={`/product/${p.handle}`} className="hover:text-primary transition-colors block">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground leading-tight line-clamp-2 min-h-[32px]">{p.name}</h4>
                      </Link>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold text-foreground">{p.rating}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-serif font-bold text-foreground">Dhs. {p.price}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
