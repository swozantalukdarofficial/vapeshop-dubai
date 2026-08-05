"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { useCart } from "@/context/CartContext";
import { Product, ProductCard } from "@/components/sections/ProductFeed";
import { AuthorizedDealers } from "@/components/sections/AuthorizedDealers";
import { WhatsAppContactSection } from "@/components/sections/WhatsAppContactSection";
import {
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Tag,
  X,
  Check,
  Zap
} from "lucide-react";
import { getItemListSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";

function cleanDescriptionHtml(html: string): string {
  if (!html) return "";
  let cleaned = html;

  // Process tables: promote first <tr> to <thead><th> if table lacks <thead>
  cleaned = cleaned.replace(/<table[\s\S]*?<\/table>/gi, (tableHtml) => {
    let updatedTable = tableHtml;
    if (!/<thead/i.test(updatedTable)) {
      updatedTable = updatedTable.replace(/<tr[\s\S]*?>([\s\S]*?)<\/tr>/i, (_match, innerTr) => {
        const ths = innerTr.replace(/<td([\s\S]*?)>([\s\S]*?)<\/td>/gi, '<th$1>$2</th>');
        return `<thead><tr>${ths}</tr></thead>`;
      });
    }
    return `<div class="overflow-x-auto my-8 rounded-2xl border border-primary/30 shadow-md bg-card">${updatedTable}</div>`;
  });

  cleaned = cleaned.replace(/href="https?:\/\/(www\.)?(vapeuae\.shop|vapshopdubai\.ae|vapshop\.ae)\/collections\/([^"]+)"/gi, 'href="/collections/$3"');
  cleaned = cleaned.replace(/href="https?:\/\/(www\.)?(vapeuae\.shop|vapshopdubai\.ae|vapshop\.ae)\/brand\/([^"]+)"/gi, 'href="/collections/$3"');
  cleaned = cleaned.replace(/href="https?:\/\/(www\.)?(vapeuae\.shop|vapshopdubai\.ae|vapshop\.ae)\/product\/([^"]+)"/gi, 'href="/product/$3"');
  return cleaned;
}

function CollectionPageContent() {
  const params = useParams();
  const handle = params?.handle as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const subFilter = searchParams?.get("sub");

  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States (Checkbox arrays for multi-select)
  const [selectedNicotines, setSelectedNicotines] = useState<string[]>([]);
  const [selectedPuffs, setSelectedPuffs] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);

  // Shopify collection metadata
  const [collectionMeta, setCollectionMeta] = useState<{
    title: string;
    description: string;
    descriptionHtml: string;
    image: { url: string; altText: string; width: number; height: number } | null;
    seo: { title: string; description: string } | null;
  } | null>(null);

  // Global search & navbar states
  const [searchQuery, setSearchQuery] = useState("");
  const activeCategory = handle || "all";

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Error loading products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
    setCurrentPage(1);
    setSelectedNicotines([]);
    setSelectedPuffs([]);
    setSelectedBrands([]);
    setIsGuideExpanded(false);
  }, [handle]);

  // Fetch Shopify collection metadata
  useEffect(() => {
    if (!handle) return;
    async function loadCollectionMeta() {
      try {
        const res = await fetch(`/api/collections/${encodeURIComponent(handle)}`);
        if (res.ok) {
          const data = await res.json();
          setCollectionMeta(data);
        } else {
          setCollectionMeta(null);
        }
      } catch {
        setCollectionMeta(null);
      }
    }
    loadCollectionMeta();
  }, [handle]);

  // Synchronize brand filter from query params
  useEffect(() => {
    const brandParam = searchParams?.get("brand");
    if (brandParam) {
      setSelectedBrands([brandParam]);
    } else {
      setSelectedBrands([]);
    }
  }, [searchParams]);

  // Synchronize search query from query params
  useEffect(() => {
    const searchParam = searchParams?.get("search") || searchParams?.get("q");
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  // Collection info — use Shopify data if available, otherwise fallback
  const collectionInfo = useMemo(() => {
    const defaultTitle = handle
      ? handle.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "Premium Vape Collections";

    // Determine categoryKey from handle
    let categoryKey = (handle || "all").toLowerCase();
    const hLower = (handle || "").toLowerCase();
    if (hLower.includes("juul")) categoryKey = "juul";
    else if (hLower.includes("myle")) categoryKey = "myle";
    else if (hLower.includes("disposable") || hLower.includes("fakher") || hLower.includes("elf-bar") || hLower.includes("tugboat") || hLower.includes("lost-mary") || hLower.includes("fummo") || hLower.includes("pod-salt") || hLower.includes("vapes-bars") || hLower.includes("vozol") || hLower.includes("hqd") || hLower.includes("geek-bar") || hLower.includes("yuoto") || hLower.includes("relx") || hLower.includes("nerd") || hLower.includes("vgod") || hLower.includes("silvaper") || hLower.includes("maskking")) categoryKey = "disposables";
    else if (hLower.includes("e-juice") || hLower.includes("e-liquid") || hLower.includes("salt-nicotine") || hLower.includes("freebase")) categoryKey = "e-liquids";
    else if (hLower.includes("pod-system") || hLower.includes("pod-kit") || hLower.includes("pod-cartridge") || hLower.includes("vape-coils")) categoryKey = "accessories";

    // If Shopify data loaded, use it
    if (collectionMeta && collectionMeta.title) {
      let shortDesc = `Shop authentic ${collectionMeta.title} devices, pods, and e-liquids at Vape Shop Dubai. 2-Hour fast delivery in Dubai.`;
      if (collectionMeta.description) {
        const firstSentence = collectionMeta.description.split(". ")[0];
        if (firstSentence && firstSentence.length > 15 && firstSentence.length < 180) {
          shortDesc = firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
        } else {
          shortDesc = collectionMeta.description.slice(0, 150).trim() + "...";
        }
      }

      return {
        title: collectionMeta.title,
        description: shortDesc,
        descriptionHtml: collectionMeta.descriptionHtml || "",
        image: collectionMeta.image,
        seo: collectionMeta.seo,
        categoryKey,
      };
    }

    // Fallback: hardcoded defaults
    return {
      title: defaultTitle,
      description: `Shop authentic ${defaultTitle} devices, pods, and e-liquids at Vape Shop Dubai. 2-Hour fast delivery in Dubai.`,
      descriptionHtml: "",
      image: null as { url: string; altText: string; width: number; height: number } | null,
      seo: null as { title: string; description: string } | null,
      categoryKey,
    };
  }, [handle, collectionMeta]);

  useEffect(() => {
    if (typeof window !== "undefined" && collectionInfo) {
      const seoTitle = collectionInfo.seo?.title || collectionInfo.title;
      const seoDesc = collectionInfo.seo?.description || collectionInfo.description;
      document.title = `${seoTitle} | Vape Shop Dubai`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", seoDesc);
      }
    }
  }, [collectionInfo]);

  // Filter lists based on matching products
  const filterOptions = useMemo(() => {
    const nics = new Set<string>();
    const puffsSet = new Set<string>();
    const brandsSet = new Set<string>();
    const categoriesSet = new Set<string>();
    let maxP = 0;

    products.forEach((p) => {
      if (p.nicotine) nics.add(p.nicotine);
      if (p.puffs) puffsSet.add(p.puffs);
      if (p.brand) brandsSet.add(p.brand);
      if (p.category) categoriesSet.add(p.category);
      if (p.price > maxP) maxP = p.price;
    });

    return {
      nicotines: Array.from(nics).filter(Boolean),
      puffs: Array.from(puffsSet).filter(Boolean),
      brands: Array.from(brandsSet).filter(Boolean),
      categories: Array.from(categoriesSet).filter(Boolean),
      maxFoundPrice: maxP || 2000
    };
  }, [products]);

  // Initialize maxPrice slider default
  useEffect(() => {
    if (filterOptions.maxFoundPrice > 0) {
      setMaxPrice(filterOptions.maxFoundPrice);
    }
  }, [filterOptions]);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    const hLower = (handle || "").toLowerCase();

    let result = products.filter((p) => {
      const prodNameLower = p.name.toLowerCase();
      const prodBrandLower = (p.brand || "").toLowerCase();
      const prodSectionLower = (p.section || "").toLowerCase();
      const prodCatLower = (p.category || "").toLowerCase();

      let matchCollection = true;

      if (hLower && hLower !== "all" && hLower !== "shop") {
        // Priority 1: Direct Shopify Collection Handle Match (exact match)
        const hasDirectCollectionMatch = p.collections && p.collections.length > 0 && p.collections.some((c) => {
          const cLower = c.toLowerCase();
          return cLower === hLower;
        });

        if (hasDirectCollectionMatch) {
          matchCollection = true;
        } else {
          // Priority 2: Strict Brand & Category Submenu Matcher
          const KNOWN_BRANDS: Record<string, string[]> = {
            "al-fakher": ["al fakher", "fakher", "crown bar"],
            "elf-bar": ["elf bar", "elfbar"],
            "myle": ["myle"],
            "juul": ["juul"],
            "tugboat": ["tugboat"],
            "fummo": ["fummo"],
            "pod-salt": ["pod salt", "podsalt"],
            "vapes-bars": ["vapes bars", "vapesbars"],
            "vozol": ["vozol"],
            "hqd": ["hqd"],
            "lost-mary": ["lost mary", "lostmary"],
            "maskking": ["maskking"],
            "geek-bar": ["geek bar", "geekbar"],
            "yuoto": ["yuoto"],
            "relx": ["relx"],
            "nerd": ["nerd"],
            "vgod": ["vgod"],
            "silvaper": ["silvaper"],
            "oxva": ["oxva"],
            "uwell": ["uwell"],
            "vaporesso": ["vaporesso"],
            "smok": ["smok"],
            "geek-vape": ["geek vape", "geekvape"],
            "geekvape": ["geek vape", "geekvape"],
            "voopoo": ["voopoo"],
          };

          let matchedBrandSlug = "";
          for (const key of Object.keys(KNOWN_BRANDS)) {
            if (hLower.includes(key)) {
              matchedBrandSlug = key;
              break;
            }
          }

          if (matchedBrandSlug) {
            // Strictly match target brand!
            const brandTokens = KNOWN_BRANDS[matchedBrandSlug];
            matchCollection = brandTokens.some(
              (token) => prodBrandLower.includes(token) || prodNameLower.includes(token)
            );
          } else if (hLower === "disposables" || hLower === "disposable" || hLower.includes("disposable")) {
            matchCollection = prodCatLower === "disposables" || prodSectionLower.includes("disposable") || prodNameLower.includes("disposable");
          } else if (hLower === "juul" || hLower.includes("juul")) {
            matchCollection = prodCatLower === "juul" || prodBrandLower.includes("juul") || prodNameLower.includes("juul");
          } else if (hLower === "myle" || hLower.includes("myle")) {
            matchCollection = prodCatLower === "myle" || prodBrandLower.includes("myle") || prodNameLower.includes("myle");
          } else if (hLower === "e-liquids" || hLower === "e-juice" || hLower.includes("e-liquid") || hLower.includes("e-juice") || hLower.includes("salt-nicotine")) {
            matchCollection = prodCatLower === "e-liquids" || prodSectionLower.includes("liquid") || prodNameLower.includes("salt");
          } else if (hLower === "accessories" || hLower.includes("pod-system") || hLower.includes("pod-kit")) {
            matchCollection = prodCatLower === "accessories" || prodSectionLower.includes("pod") || prodNameLower.includes("pod");
          } else {
            // Require ALL clean non-generic keywords to match product
            const GENERIC_WORDS = new Set(["vape", "dubai", "disposable", "pods", "pod", "device", "kit", "series", "shop", "online", "uae", "offers", "offer"]);
            const cleanKeywords = hLower
              .split("-")
              .filter((w) => w.length > 2 && !GENERIC_WORDS.has(w));

            if (cleanKeywords.length > 0) {
              matchCollection = cleanKeywords.every((kw) =>
                prodNameLower.includes(kw) ||
                prodBrandLower.includes(kw) ||
                prodSectionLower.includes(kw) ||
                prodCatLower.includes(kw)
              );
            } else {
              matchCollection = true;
            }
          }
        }
      } else {
        matchCollection = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      }

      // Nicotine filter
      const matchNic = selectedNicotines.length === 0 || (p.nicotine && selectedNicotines.includes(p.nicotine));
      
      // Puffs filter
      const matchPuff = selectedPuffs.length === 0 || (p.puffs && selectedPuffs.includes(p.puffs));

      // Brand filter
      const matchBrand = selectedBrands.length === 0 || (p.brand && selectedBrands.includes(p.brand));

      // In stock filter
      const matchStock = !inStockOnly || !p.isSoldOut;
      
      // Price filter
      const matchPrice = p.price <= maxPrice;

      // Sub-item filter from URL
      let matchSub = true;
      if (subFilter) {
        const subLower = subFilter.toLowerCase();
        const cleanSub = subLower.replace("vape", "").replace("bar", "").trim();
        matchSub = prodBrandLower.includes(cleanSub) || prodNameLower.includes(cleanSub) || prodSectionLower.includes(cleanSub);
      }

      // Search query filter
      const matchSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCollection && matchNic && matchPuff && matchBrand && matchStock && matchPrice && matchSub && matchSearch;
    });

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return b.reviews - a.reviews;
      });
    }

    return result;
  }, [products, handle, selectedNicotines, selectedPuffs, selectedBrands, selectedCategories, inStockOnly, maxPrice, sortBy, subFilter, searchQuery]);

  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedNicotines, selectedPuffs, selectedBrands, selectedCategories, inStockOnly, maxPrice, sortBy, subFilter, searchQuery, handle]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const toggleNicotine = (nic: string) => {
    setSelectedNicotines((prev) =>
      prev.includes(nic) ? prev.filter((item) => item !== nic) : [...prev, nic]
    );
  };

  const togglePuff = (puff: string) => {
    setSelectedPuffs((prev) =>
      prev.includes(puff) ? prev.filter((item) => item !== puff) : [...prev, puff]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  const handleClearFilters = () => {
    setSelectedNicotines([]);
    setSelectedPuffs([]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setInStockOnly(false);
    setMaxPrice(filterOptions.maxFoundPrice);
  };

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

  const itemListSchema = getItemListSchema(
    collectionInfo.title,
    filteredProducts.map((p) => ({
      name: p.name,
      handle: p.handle,
      price: p.price,
      image: p.image,
    }))
  );
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: collectionInfo.title, item: `/collections/${handle}` },
  ]);

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      {/* Collection JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Navbar */}
      <Navbar
        onCategorySelect={(c) => {
          router.push(c === "all" ? "/shop" : `/collections/${c}`);
        }}
        activeCategory={activeCategory}
      />

      <main className="flex-grow pb-24 pt-20 sm:pt-28">
        {/* Breadcrumb */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{collectionInfo.title}</span>
          </nav>
        </div>

        {/* Collection Intro Banner */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />
            <div className="relative z-10 max-w-3xl">
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                Dubai Vape Catalog
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground mt-2 leading-tight">
                {collectionInfo.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
                {collectionInfo.description}
              </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-5 sm:opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
              <Tag className="w-64 h-64 text-primary" />
            </div>
          </div>
        </div>

        {/* Catalog Section */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Filter Sidebar (Desktop) */}
            <div className="hidden lg:block space-y-6">
              <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-6 shadow-sm sticky top-28">
                
                <div className="flex items-center justify-between pb-4 border-b border-border/40">
                  <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-foreground">
                    <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
                  </h3>
                  {(selectedNicotines.length > 0 ||
                    selectedPuffs.length > 0 ||
                    selectedBrands.length > 0 ||
                    selectedCategories.length > 0 ||
                    inStockOnly ||
                    maxPrice !== filterOptions.maxFoundPrice) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-[10px] font-bold text-primary uppercase hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Filters Content */}
                <div className="space-y-6">
                  {/* Price range filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                      <span>Max Price:</span>
                      <span className="text-primary font-bold">Dhs. {maxPrice}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={filterOptions.maxFoundPrice}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                      <span>0 AED</span>
                      <span>{filterOptions.maxFoundPrice} AED</span>
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <div className="space-y-3 pt-4 border-t border-border/40">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Availability:</p>
                    <label className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-foreground group">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="accent-primary h-4 w-4 rounded border-border focus:ring-0 cursor-pointer"
                      />
                      <span className="group-hover:text-primary transition-colors">In Stock Only</span>
                    </label>
                  </div>

                  {/* Category List (Only displayed if handle is "all" or general shop page) */}
                  {collectionInfo.categoryKey === "all" && filterOptions.categories.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border/40">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category:</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {filterOptions.categories.map((cat) => {
                          const label = cat === "juul" ? "JUUL Pods & Kits" : cat === "disposables" ? "Disposables" : cat === "e-liquids" ? "Premium E-Liquids" : "Kits & Hardware";
                          return (
                            <label key={cat} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-foreground group">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                                className="accent-primary h-4 w-4 rounded border-border focus:ring-0 cursor-pointer"
                              />
                              <span className="group-hover:text-primary transition-colors capitalize">{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Brand Checklist */}
                  {filterOptions.brands.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border/40">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand:</p>
                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                        {filterOptions.brands.map((brand) => (
                          <label key={brand} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-foreground group">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                              className="accent-primary h-4 w-4 rounded border-border focus:ring-0 cursor-pointer"
                            />
                            <span className="group-hover:text-primary transition-colors">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nicotine strengths Checklist */}
                  {filterOptions.nicotines.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border/40">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nicotine Strength:</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {filterOptions.nicotines.map((nic) => (
                          <label key={nic} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-foreground group">
                            <input
                              type="checkbox"
                              checked={selectedNicotines.includes(nic)}
                              onChange={() => toggleNicotine(nic)}
                              className="accent-primary h-4 w-4 rounded border-border focus:ring-0 cursor-pointer"
                            />
                            <span className="group-hover:text-primary transition-colors">{nic}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Puffs list Checklist */}
                  {filterOptions.puffs.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border/40">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Puffs Capacity:</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {filterOptions.puffs.map((puff) => (
                          <label key={puff} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-foreground group">
                            <input
                              type="checkbox"
                              checked={selectedPuffs.includes(puff)}
                              onChange={() => togglePuff(puff)}
                              className="accent-primary h-4 w-4 rounded border-border focus:ring-0 cursor-pointer"
                            />
                            <span className="group-hover:text-primary transition-colors">{puff}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Products Feed & Toolbar */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/40 px-4 sm:px-6 py-4 rounded-3xl shadow-sm">
                <p className="text-xs font-bold text-foreground text-center sm:text-left">
                  Showing <span className="text-primary">{paginatedProducts.length}</span> of {filteredProducts.length} premium products
                </p>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  {/* Mobile Filters Trigger */}
                  <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center justify-center gap-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 flex-grow sm:flex-grow-0"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                    {(selectedNicotines.length > 0 ||
                      selectedPuffs.length > 0 ||
                      selectedBrands.length > 0 ||
                      selectedCategories.length > 0 ||
                      inStockOnly ||
                      maxPrice !== filterOptions.maxFoundPrice) && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </button>

                  {/* Sort selector */}
                  <div className="flex items-center gap-2 flex-grow sm:flex-grow-0 justify-end">
                    <span className="text-xs text-muted-foreground font-semibold hidden sm:inline">Sort By:</span>
                    <div className="relative w-full sm:w-auto">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl text-xs font-bold px-3.5 py-2 pr-8 appearance-none cursor-pointer hover:border-primary focus:outline-none text-foreground"
                      >
                        <option value="popular">Popularity</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Average Rating</option>
                      </select>
                      <ChevronDown className="h-3 w-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid content */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse bg-card border border-border/40 rounded-[2rem] p-5 flex flex-col gap-4 min-h-[350px]">
                      <div className="bg-muted rounded-[1.5rem] h-48 w-full animate-pulse" />
                      <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
                      <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                      <div className="h-10 bg-muted rounded-full w-full mt-auto animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-card border border-border/40 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center">
                  <p className="text-base font-bold text-foreground">No Products Found</p>
                  <p className="text-xs text-muted-foreground mt-2 max-w-xs">
                    Try adjusting your filters or search keywords to view matching premium vapes.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-6 text-xs uppercase tracking-widest bg-primary text-white font-bold px-5 py-3 rounded-full hover:bg-gold-shimmer transition-all cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-10 pb-4">
                      <button
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPage((prev) => prev - 1);
                            window.scrollTo({ top: 350, behavior: "smooth" });
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
                                window.scrollTo({ top: 350, behavior: "smooth" });
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
                            window.scrollTo({ top: 350, behavior: "smooth" });
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
                </>
              )}

            </div>

          </div>
        </div>

        {/* Collection Description (from Shopify) — Beautiful Expandable Guide after products */}
        {collectionInfo.descriptionHtml && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <div className="bg-card border border-border/50 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-sm transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />
              
              {/* Header Badges & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full">
                    Buying Guide &amp; FAQs
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Updated Guide</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground tracking-tight mb-6">
                About {collectionInfo.title}
              </h2>

              {/* Expandable Content Container */}
              <div className="relative">
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    !isGuideExpanded ? "max-h-[360px] overflow-hidden" : "max-h-none"
                  }`}
                >
                  <div
                    className="text-sm sm:text-base text-foreground leading-relaxed prose prose-sm sm:prose-base max-w-none 
                      [&_h1]:text-base [&_h1]:sm:text-lg [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-primary [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:border-l-4 [&_h1]:border-primary [&_h1]:pl-3.5
                      [&_h2]:text-base [&_h2]:sm:text-lg [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:border-l-4 [&_h2]:border-primary [&_h2]:pl-3.5
                      [&_h3]:text-sm [&_h3]:sm:text-base [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-primary [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:border-l-4 [&_h3]:border-primary [&_h3]:pl-3
                      [&_h4]:text-sm [&_h4]:font-bold [&_h4]:text-primary [&_h4]:mt-4 [&_h4]:mb-1.5
                      [&_p]:mb-4 [&_p]:text-foreground/95 [&_p]:leading-relaxed
                      [&_li]:text-foreground/95
                      [&_a]:text-primary [&_a]:font-bold [&_a]:underline [&_a]:decoration-primary/60 [&_a]:underline-offset-4 hover:[&_a]:decoration-primary hover:[&_a]:text-primary/80 transition-all
                      [&_strong]:font-normal [&_strong]:text-inherit
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-4
                      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:mb-4
                      [&_table]:w-full [&_table]:text-left [&_table]:border-collapse
                      [&_thead]:bg-primary [&_thead]:text-white
                      [&_th]:p-4 [&_th]:sm:p-5 [&_th]:text-xs [&_th]:sm:text-sm [&_th]:font-extrabold [&_th]:tracking-wider [&_th]:uppercase [&_th]:text-white [&_th]:border-b [&_th]:border-white/20
                      [&_td]:p-3.5 [&_td]:sm:p-4 [&_td]:text-xs [&_td]:sm:text-sm [&_td]:border-b [&_td]:border-border/30 [&_td]:text-foreground [&_tr:last-child_td]:border-b-0
                      [&_td:first-child]:font-bold [&_td:first-child]:text-foreground
                      [&_tr:nth-child(even)]:bg-primary/5 hover:[&_tr]:bg-primary/10 [&_tr]:transition-colors
                      [&_img]:rounded-2xl [&_img]:p-1.5 [&_img]:sm:p-2 [&_img]:bg-muted/20 [&_img]:border [&_img]:border-border/40 [&_img]:shadow-sm [&_img]:my-6 [&_img]:mx-auto [&_img]:w-full [&_img]:h-auto"
                    dangerouslySetInnerHTML={{ __html: cleanDescriptionHtml(collectionInfo.descriptionHtml) }}
                  />
                </div>

                {/* Fade Overlay & Expand Toggle Button */}
                {!isGuideExpanded ? (
                  <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-card via-card/95 to-transparent flex items-end justify-center pb-2 z-10 pointer-events-none">
                    <button
                      type="button"
                      onClick={() => setIsGuideExpanded(true)}
                      className="pointer-events-auto inline-flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 text-xs font-extrabold uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>Read Full Guide &amp; FAQs</span>
                      <span className="text-sm">↓</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center pt-8 pb-2 border-t border-border/30 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsGuideExpanded(false)}
                      className="inline-flex items-center gap-2 bg-muted/60 hover:bg-muted text-foreground border border-border text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>Show Less</span>
                      <span className="text-sm">↑</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Shop by Brands & Authorized Dealers Section */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <AuthorizedDealers />
        </div>

        {/* Direct WhatsApp Contact & Orders Section */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <WhatsAppContactSection />
        </div>

      </main>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Drawer Body */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-background flex flex-col shadow-2xl transition-transform duration-300 translate-x-0 border-l border-border">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-foreground">
                <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
              </h3>
              <div className="flex items-center gap-4">
                {(selectedNicotines.length > 0 ||
                  selectedPuffs.length > 0 ||
                  selectedBrands.length > 0 ||
                  selectedCategories.length > 0 ||
                  inStockOnly ||
                  maxPrice !== filterOptions.maxFoundPrice) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-[10px] font-bold text-primary uppercase hover:underline"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Filters List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Price range filter */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                  <span>Max Price:</span>
                  <span className="text-primary font-bold">Dhs. {maxPrice}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={filterOptions.maxFoundPrice}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                  <span>0 AED</span>
                  <span>{filterOptions.maxFoundPrice} AED</span>
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Availability:</p>
                <label className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-foreground group">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-primary h-4 w-4 rounded border-border focus:ring-0 cursor-pointer"
                  />
                  <span className="group-hover:text-primary transition-colors">In Stock Only</span>
                </label>
              </div>

              {/* Category List */}
              {collectionInfo.categoryKey === "all" && filterOptions.categories.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border/40">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category:</p>
                  <div className="space-y-2">
                    {filterOptions.categories.map((cat) => {
                      const label = cat === "juul" ? "JUUL Pods & Kits" : cat === "disposables" ? "Disposables" : cat === "e-liquids" ? "Premium E-Liquids" : "Kits & Hardware";
                      return (
                        <label key={cat} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-foreground group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="accent-primary h-4 w-4 rounded border-border focus:ring-0 cursor-pointer"
                          />
                          <span className="group-hover:text-primary transition-colors capitalize">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Brand Checklist */}
              {filterOptions.brands.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border/40">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand:</p>
                  <div className="space-y-2">
                    {filterOptions.brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-foreground group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="accent-primary h-4 w-4 rounded border-border focus:ring-0 cursor-pointer"
                        />
                        <span className="group-hover:text-primary transition-colors">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Nicotine strengths Checklist */}
              {filterOptions.nicotines.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border/40">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nicotine Strength:</p>
                  <div className="space-y-2">
                    {filterOptions.nicotines.map((nic) => (
                      <label key={nic} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-foreground group">
                        <input
                          type="checkbox"
                          checked={selectedNicotines.includes(nic)}
                          onChange={() => toggleNicotine(nic)}
                          className="accent-primary h-4 w-4 rounded border-border focus:ring-0 cursor-pointer"
                        />
                        <span className="group-hover:text-primary transition-colors">{nic}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Puffs list Checklist */}
              {filterOptions.puffs.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border/40">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Puffs Capacity:</p>
                  <div className="space-y-2">
                    {filterOptions.puffs.map((puff) => (
                      <label key={puff} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-foreground group">
                        <input
                          type="checkbox"
                          checked={selectedPuffs.includes(puff)}
                          onChange={() => togglePuff(puff)}
                          className="accent-primary h-4 w-4 rounded border-border focus:ring-0 cursor-pointer"
                        />
                        <span className="group-hover:text-primary transition-colors">{puff}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Apply */}
            <div className="p-6 border-t border-border bg-card">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full text-center py-3 bg-primary hover:bg-gold-shimmer text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 active:scale-95"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center animate-pulse">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Loading Dubai Vape Shop...</span>
        </div>
      </div>
    }>
      <CollectionPageContent />
    </Suspense>
  );
}
