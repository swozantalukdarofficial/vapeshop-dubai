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
  Sparkles,
  Heart,
  Share2,
  Copy,
  MessageCircle,
  CreditCard,
  PackageCheck,
  Zap
} from "lucide-react";
import { WhatsAppContactSection } from "@/components/sections/WhatsAppContactSection";
import { ProductCard } from "@/components/sections/ProductFeed";
import { ProductSectionCarousel } from "@/components/sections/ProductSectionCarousel";
import {
  getProductSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from "@/lib/seo-schemas";

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
  brand?: string;
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
  const [activeTab, setActiveTab] = useState<"description" | "shipping" | "returns">("description");
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [isWishlist, setIsWishlist] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

        if (typeof window !== "undefined") {
          const pageTitle = data.seoTitle ? `${data.seoTitle} | Vape Shop Dubai` : `${data.name} | Vape Shop Dubai`;
          document.title = pageTitle;

          if (data.seoDescription) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute("content", data.seoDescription);
            }
          }
        }
        
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
      {/* Product JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getProductSchema({
              id: product.id,
              name: product.name,
              handle: product.handle,
              descriptionHtml: product.descriptionHtml,
              price: selectedVariant?.price || product.price,
              originalPrice: product.originalPrice,
              rating: product.rating,
              reviews: product.reviews,
              image: product.image,
              images: product.images,
              brand: product.brand,
              category: product.category,
              isSoldOut: product.isSoldOut,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbSchema([
              { name: "Home", item: "/" },
              { name: product.category, item: `/collections/${product.category}` },
              { name: product.name, item: `/product/${product.handle}` },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getFAQSchema([
              {
                question: `Is ${product.name} original and authentic?`,
                answer: `Yes, 100% authentic imported ${product.brand || product.category} product delivered across Dubai & UAE.`,
              },
              {
                question: `How fast is delivery for ${product.name} in Dubai?`,
                answer: "We offer express 2-hour delivery across all Dubai areas and same-day delivery across UAE.",
              },
            ])
          ),
        }}
      />
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

      <main className="flex-grow pb-16 pt-28 sm:pt-32">
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-primary transition-colors cursor-pointer capitalize">{product.category}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
          </nav>
        </div>

        {/* Product Details Section */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left: Image Gallery (Sticky & Balanced) */}
            <div className="lg:col-span-5 flex flex-col gap-4 w-full lg:sticky lg:top-28">
              <div className="relative bg-card border border-border/50 rounded-3xl p-6 sm:p-8 flex items-center justify-center aspect-square overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute w-72 h-72 rounded-full bg-primary/5 filter blur-3xl pointer-events-none" />
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
                />
                {product.tag && (
                  <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-xl shadow-md">
                    {product.tag}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`h-16 w-16 rounded-2xl border-2 overflow-hidden bg-card p-1.5 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${
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
             <div className="lg:col-span-7 flex flex-col gap-3.5">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/5 border border-primary/20 px-3 py-0.5 rounded-full">
                  {product.section || product.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground mt-2 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating & In-Stock & Social Share Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pb-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
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
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ml-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock
                    </span>
                  </div>

                  {/* Social Share buttons (Facebook, Twitter/X, WhatsApp, Copy Link) */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mr-1">SHARE:</span>
                    
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-card border border-border/50 text-foreground hover:text-blue-600 hover:border-blue-600/40 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                      title="Share on Facebook"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>Facebook</span>
                    </a>

                    {/* Twitter / X */}
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-card border border-border/50 text-foreground hover:text-sky-500 hover:border-sky-500/40 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                      title="Share on Twitter"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span>Twitter</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-card border border-border/50 text-foreground hover:text-emerald-500 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Copy Link */}
                    <button
                      onClick={handleCopyLink}
                      className="px-2.5 py-1.5 rounded-xl bg-card border border-border/50 text-foreground hover:text-primary hover:border-primary/40 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                      title="Copy Product Link"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? "Copied!" : "Copy Link"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Section — NOW ABOVE SHORT DESCRIPTION / SPECS CARD */}
              <div className="flex items-center justify-between bg-muted/10 border border-border/30 p-5 rounded-[1.5rem]">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price:</span>
                  <p className="text-3xl font-serif font-black text-primary">
                    Dhs. {selectedVariant ? selectedVariant.price.toLocaleString() : product.price.toLocaleString()}
                  </p>
                  {isSale && selectedVariant && selectedVariant.compareAtPrice && (
                    <p className="text-sm text-muted-foreground line-through">Dhs. {selectedVariant.compareAtPrice.toLocaleString()}</p>
                  )}
                </div>
                {isSale && discountPercent > 0 && (
                  <span className="bg-primary text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow animate-pulse">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Two-Column Key Specifications Card (Matches Screenshot 1) */}
              <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />
                <h3 className="text-xs font-black uppercase tracking-wider text-primary mb-3">Key Product Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <span className="text-muted-foreground font-semibold">Brand:</span>
                    <span className="font-extrabold text-foreground">{product.brand || product.category || "Vape Shop Dubai"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <span className="text-muted-foreground font-semibold">Battery Spec:</span>
                    <span className="font-extrabold text-foreground">{product.battery || "Rechargeable Built-in"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <span className="text-muted-foreground font-semibold">Puff Capacity:</span>
                    <span className="font-extrabold text-foreground">{product.puffs || "High Capacity"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <span className="text-muted-foreground font-semibold">Nicotine Level:</span>
                    <span className="font-extrabold text-foreground">{product.nicotine || "5% (50mg)"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <span className="text-muted-foreground font-semibold">Activation:</span>
                    <span className="font-extrabold text-foreground">Draw-Activated</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <span className="text-muted-foreground font-semibold">Charging:</span>
                    <span className="font-extrabold text-foreground">Type-C Fast Charge</span>
                  </div>
                </div>
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

              {/* Total Price & Quantity Calculation Card (Matches Screenshot 1) */}
              <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Price:</span>
                  <p className="text-2xl font-serif font-black text-primary">
                    Dhs. {((selectedVariant ? selectedVariant.price : product.price) * quantity).toLocaleString()}
                  </p>
                </div>
                
                {/* Quantity selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Qty:</span>
                  <div className="flex items-center border border-border rounded-xl bg-muted/20 overflow-hidden h-10">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3.5 h-full hover:bg-muted transition-colors flex items-center justify-center cursor-pointer text-foreground font-bold"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-black text-foreground">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3.5 h-full hover:bg-muted transition-colors flex items-center justify-center cursor-pointer text-foreground font-bold"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons Grid (Matches Screenshot 1: Wishlist, Add to Cart, Buy It Now) */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!!product.isSoldOut || !selectedVariant || !selectedVariant.availableForSale}
                    className="bg-card hover:bg-muted/40 border border-primary/40 text-foreground font-extrabold tracking-wider py-4 px-4 rounded-2xl text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                  >
                    <ShoppingCart className="h-4 w-4 text-primary" /> {!selectedVariant ? "Select Flavor" : "Add to Cart"}
                  </button>
                  
                  <button
                    onClick={handleBuyNow}
                    disabled={!!product.isSoldOut || !selectedVariant || !selectedVariant.availableForSale}
                    className="bg-primary hover:bg-gold-shimmer text-white font-extrabold tracking-wider py-4 px-4 rounded-2xl text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="h-4 w-4" /> {!selectedVariant ? "Select Flavor" : "Buy It Now"}
                  </button>
                </div>

                {/* Wishlist Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlist(!isWishlist)}
                  className={`w-full py-3 px-4 rounded-2xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isWishlist
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                      : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{isWishlist ? "Saved in Wishlist" : "Add to Wishlist"}</span>
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

        {/* 4 Service Feature Cards Grid (Matches Screenshot 2) */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Free Shipping</h4>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 uppercase">ON ORDERS ABOVE 300 AED</p>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Payment Methods</h4>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 uppercase">CASH, CARD &amp; APPLE PAY ON DELIVERY</p>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Fast Delivery</h4>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 uppercase">DUBAI EXPRESS WITHIN 2 HOURS</p>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <PackageCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Same Day Delivery</h4>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 uppercase">ORDER BEFORE 6PM ALL EMIRATES</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Product Tabs Section (Matches Screenshot 2: Product Description | Shipping and Delivery | Refund and Returns Policy) */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
          <div className="bg-card border border-border/50 rounded-[2.5rem] p-6 sm:p-12 shadow-sm">
            
            {/* Tab Headers */}
            <div className="flex border-b border-border/40 gap-8 sm:gap-12 pb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab("description")}
                className={`text-xs sm:text-sm font-bold uppercase tracking-wider pb-2 transition-all cursor-pointer relative whitespace-nowrap ${
                  activeTab === "description" ? "text-primary font-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Product Description
                {activeTab === "description" && <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" />}
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`text-xs sm:text-sm font-bold uppercase tracking-wider pb-2 transition-all cursor-pointer relative whitespace-nowrap ${
                  activeTab === "shipping" ? "text-primary font-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Shipping and Delivery
                {activeTab === "shipping" && <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" />}
              </button>
              <button
                onClick={() => setActiveTab("returns")}
                className={`text-xs sm:text-sm font-bold uppercase tracking-wider pb-2 transition-all cursor-pointer relative whitespace-nowrap ${
                  activeTab === "returns" ? "text-primary font-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Refund and Returns Policy
                {activeTab === "returns" && <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" />}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="mt-8">
              
              {activeTab === "description" && (
                <div className="product-description-content">
                  {product.shortDescription && (
                    <div
                      className="mb-8 font-medium text-foreground/90 text-sm border-l-2 border-primary pl-4 py-1"
                      dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                    />
                  )}
                  {product.descriptionHtml && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.descriptionHtml
                          .replace(/<h1/gi, "<h2")
                          .replace(/<\/h1>/gi, "</h2>"),
                      }}
                    />
                  )}
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="max-w-3xl space-y-6 text-sm text-foreground/90 leading-relaxed">
                  <div className="border border-border/40 rounded-2xl p-6 bg-card space-y-3">
                    <h4 className="font-bold text-primary text-base uppercase tracking-wider">⚡ Express 2-Hour Delivery in Dubai</h4>
                    <p className="text-muted-foreground">
                      Place your order before 10:00 PM for rapid express delivery directly to your door anywhere in Dubai (Downtown, Marina, JBR, Deira, Al Barsha, JLT &amp; surrounding areas).
                    </p>
                  </div>

                  <div className="border border-border/40 rounded-2xl p-6 bg-card space-y-3">
                    <h4 className="font-bold text-foreground text-base uppercase tracking-wider">🚚 Same-Day UAE Shipping</h4>
                    <p className="text-muted-foreground">
                      Orders placed for Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah &amp; Umm Al Quwain are delivered same-day or next-day morning.
                    </p>
                  </div>

                  <div className="border border-border/40 rounded-2xl p-6 bg-card space-y-3">
                    <h4 className="font-bold text-foreground text-base uppercase tracking-wider">💵 Payment Options</h4>
                    <p className="text-muted-foreground">
                      We support Cash on Delivery (COD) and Card on Delivery for 100% risk-free shopping.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "returns" && (
                <div className="max-w-3xl space-y-6 text-sm text-foreground/90 leading-relaxed">
                  <div className="border border-border/40 rounded-2xl p-6 bg-card space-y-3">
                    <h4 className="font-bold text-primary text-base uppercase tracking-wider">🛡️ 7-Day Exchange &amp; Replacement Policy</h4>
                    <p className="text-muted-foreground">
                      If your device arrives damaged or non-functional (Dead-On-Arrival), contact our customer support team within 24 hours for instant exchange or replacement.
                    </p>
                  </div>

                  <div className="border border-border/40 rounded-2xl p-6 bg-card space-y-3">
                    <h4 className="font-bold text-foreground text-base uppercase tracking-wider">📦 Product Return Eligibility</h4>
                    <p className="text-muted-foreground">
                      Due to health and hygiene safety regulations, consumable items (opened e-liquid bottles, unsealed pod packs, and used disposable vapes) cannot be returned once opened unless verified defective.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Product & Delivery FAQ Section (Matches Screenshot 4) */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 sm:p-14 shadow-sm text-center">
            
            {/* Header */}
            <div className="max-w-xl mx-auto flex flex-col items-center mb-10">
              <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-1.5">F.A.Q.</span>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">Product &amp; Delivery FAQ</h3>
              <div className="w-8 h-0.5 bg-primary/40 my-3" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Everything you need to know about authenticity, UAE shipping, and warranty.
              </p>
            </div>

            {/* FAQ Items */}
            <div className="max-w-4xl mx-auto text-left space-y-4">
              <details className="group border border-border/40 rounded-2xl p-5 bg-card/60 transition-all [&_summary::-webkit-details-marker]:hidden open:bg-card">
                <summary className="flex items-center justify-between font-bold text-foreground text-sm sm:text-base cursor-pointer">
                  <span>What is {product.name}?</span>
                  <ChevronDown className="h-4 w-4 text-primary transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/30">
                  {product.name} is a premium vape product available in Dubai &amp; across the UAE. We guarantee 100% authentic devices and pods sourced directly from authorized brand distributors.
                </p>
              </details>

              <details className="group border border-border/40 rounded-2xl p-5 bg-card/60 transition-all [&_summary::-webkit-details-marker]:hidden open:bg-card">
                <summary className="flex items-center justify-between font-bold text-foreground text-sm sm:text-base cursor-pointer">
                  <span>Where Can I Buy {product.name} in UAE?</span>
                  <ChevronDown className="h-4 w-4 text-primary transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/30">
                  You can order online directly from Vape Shop Dubai with fast 2-hour delivery in Dubai and same-day delivery across Abu Dhabi, Sharjah, Ajman, and all UAE emirates.
                </p>
              </details>

              <details className="group border border-border/40 rounded-2xl p-5 bg-card/60 transition-all [&_summary::-webkit-details-marker]:hidden open:bg-card">
                <summary className="flex items-center justify-between font-bold text-foreground text-sm sm:text-base cursor-pointer">
                  <span>Is this product original &amp; authentic?</span>
                  <ChevronDown className="h-4 w-4 text-primary transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/30">
                  Yes, 100% original. Each product contains an authentic QR code / serial code that can be verified directly on the manufacturer website.
                </p>
              </details>
            </div>
          </div>
        </div>

        {/* Direct WhatsApp Contact Section */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <WhatsAppContactSection />
        </div>

        {/* Similar Products Recommendation Carousel (Same as Home Page) */}
        {similarProducts.length > 0 && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
            <ProductSectionCarousel
              sectionName="You May Also Like"
              products={similarProducts}
              onAddToCart={(item) => {
                addToCart({
                  id: `${item.id}-${item.variantId || 'default'}`,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  category: item.category,
                  variantId: item.variantId || 'default',
                  handle: item.handle,
                }, 1);
              }}
              onBuyNow={(item) => {
                addToCart({
                  id: `${item.id}-${item.variantId || 'default'}`,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  category: item.category,
                  variantId: item.variantId || 'default',
                  handle: item.handle,
                }, 1);
                router.push("/checkout");
              }}
              onViewAll={() => {
                router.push(`/collections/${product.category}`);
              }}
            />
          </div>
        )}

      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
