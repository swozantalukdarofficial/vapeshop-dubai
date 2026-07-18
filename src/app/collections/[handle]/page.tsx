"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { useCart } from "@/context/CartContext";
import { Product } from "@/components/sections/ProductFeed";
import {
  Star,
  ShoppingCart,
  ChevronRight,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Tag,
  X,
  Check,
  Zap
} from "lucide-react";

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
  }, []);

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

  // Collection Title Mapping
  const collectionInfo = useMemo(() => {
    const defaultInfo = {
      title: "Premium Vape Collections",
      description: "Explore our dynamic range of authentic, premium vape devices, pod kits, and e-liquids.",
      categoryKey: "all"
    };

    if (!handle) return defaultInfo;

    switch (handle.toLowerCase()) {
      case "juul":
        return {
          title: "Authentic JUUL Series",
          description: "Shop official JUUL Devices, JUUL 2 Pods, and accessories. Premium quality, imported directly for authentic satisfaction.",
          categoryKey: "juul"
        };
      case "disposables":
        return {
          title: "Premium Disposable Vapes",
          description: "Discover long-lasting disposable vapes from top brands: Pod Salt, AL Fakher, BECO, and more. 6,000 to 15,000 puffs available.",
          categoryKey: "disposables"
        };
      case "e-liquids":
        return {
          title: "Premium E-Liquids & Juices",
          description: "Indulge in rich nicotine salts and freebase e-liquids. Curated premium brands featuring mango, blue raspberry, tobacco, and mint flavors.",
          categoryKey: "e-liquids"
        };
      case "accessories":
        return {
          title: "Pod Systems & Accessories",
          description: "Upgrade your hardware with Vaporesso XROS 4, Luxe XR, coils, and replacement pods. Authentic components for a refined draw.",
          categoryKey: "accessories"
        };
      default:
        return defaultInfo;
    }
  }, [handle]);

  // Filter lists based on matching products
  const filterOptions = useMemo(() => {
    const nics = new Set<string>();
    const puffsSet = new Set<string>();
    const brandsSet = new Set<string>();
    const categoriesSet = new Set<string>();
    let maxP = 0;

    products.forEach((p) => {
      // Check if product belongs to current collection
      if (collectionInfo.categoryKey !== "all" && p.category !== collectionInfo.categoryKey) return;
      
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
  }, [products, collectionInfo]);

  // Initialize maxPrice slider default
  useEffect(() => {
    if (filterOptions.maxFoundPrice > 0) {
      setMaxPrice(filterOptions.maxFoundPrice);
    }
  }, [filterOptions]);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Collection category filter
      const matchCollection = collectionInfo.categoryKey === "all"
        ? (selectedCategories.length === 0 || selectedCategories.includes(p.category))
        : p.category === collectionInfo.categoryKey;
      
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

      // Sub-item filter from URL (e.g. JUUL 1, JUUL 2, JUUL Pods)
      let matchSub = true;
      if (subFilter) {
        const subLower = subFilter.toLowerCase();
        const prodNameLower = p.name.toLowerCase();
        const prodBrandLower = (p.brand || "").toLowerCase();
        const prodSectionLower = (p.section || "").toLowerCase();
        
        if (collectionInfo.categoryKey === "juul") {
          if (subLower.includes("1")) {
            // JUUL 1 Series
            matchSub = prodSectionLower.includes("juul 1") || prodNameLower.includes("juul 1") || (!prodNameLower.includes("juul 2") && !prodNameLower.includes("juul2"));
          } else if (subLower.includes("2")) {
            // JUUL 2 Series
            matchSub = prodSectionLower.includes("juul 2") || prodNameLower.includes("juul 2") || prodNameLower.includes("juul2");
          } else if (subLower.includes("pod")) {
            // JUUL Pods
            matchSub = prodNameLower.includes("pod");
          }
        } else if (collectionInfo.categoryKey === "myle") {
          if (subLower.includes("v5") && subLower.includes("pod")) {
            matchSub = prodNameLower.includes("v5") && (prodNameLower.includes("pod") || prodNameLower.includes("cartridge"));
          } else if (subLower.includes("v5") && (subLower.includes("device") || subLower.includes("kit"))) {
            matchSub = prodNameLower.includes("v5") && (prodNameLower.includes("device") || prodNameLower.includes("kit"));
          } else if (subLower.includes("disposable")) {
            matchSub = prodNameLower.includes("disposable") || prodNameLower.includes("drip");
          } else {
            matchSub = prodNameLower.includes(subLower) || prodSectionLower.includes(subLower);
          }
        } else if (collectionInfo.categoryKey === "e-liquids") {
          if (subLower.includes("salt")) {
            matchSub = prodNameLower.includes("salt") || prodNameLower.includes("salts");
          } else if (subLower.includes("freebase")) {
            matchSub = prodNameLower.includes("freebase") || !prodNameLower.includes("salt");
          }
        } else if (collectionInfo.categoryKey === "accessories") {
          if (subLower.includes("kit")) {
            matchSub = prodNameLower.includes("kit") || prodNameLower.includes("device") || prodNameLower.includes("system");
          } else if (subLower.includes("cartridge") || subLower.includes("pod")) {
            matchSub = prodNameLower.includes("cartridge") || (prodNameLower.includes("pod") && !prodNameLower.includes("kit"));
          } else if (subLower.includes("coil")) {
            matchSub = prodNameLower.includes("coil") || prodNameLower.includes("coils");
          }
        } else {
          // Brand checking for disposables or generic categories
          const cleanBrand = subLower.replace("vape", "").replace("bar", "").trim();
          matchSub = prodBrandLower.includes(cleanBrand) || prodNameLower.includes(cleanBrand);
        }
      }

      // Search query filter
      const matchSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.section && p.section.toLowerCase().includes(searchQuery.toLowerCase()));

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
      // Default: Popularity (reviews or isPopular flag)
      result.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return b.reviews - a.reviews;
      });
    }

    return result;
  }, [products, collectionInfo, selectedNicotines, selectedPuffs, selectedBrands, selectedCategories, inStockOnly, maxPrice, sortBy, subFilter, searchQuery]);

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

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
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
            <div className="relative z-10 max-w-2xl">
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
                  Showing <span className="text-primary">{filteredProducts.length}</span> premium products
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => {
                    const isSale = product.tagColor === "sale";
                    return (
                      <div
                        key={product.id}
                        className="group relative bg-card border border-border rounded-[1.5rem] overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1.5 flex flex-col w-full"
                      >
                        {/* Image area */}
                        <div className="relative bg-muted/30 mx-3 mt-3 rounded-[1.1rem] h-44 sm:h-56 flex items-center justify-center overflow-hidden">
                          <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-primary/5 filter blur-2xl pointer-events-none" />
                          <Link href={`/product/${product.handle}`} className="block relative z-10 w-full h-full flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-32 sm:h-44 w-auto object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-108"
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

                          {/* Quick add floating button for desktop hover */}
                          {!product.isSoldOut && (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer hover:bg-gold-shimmer z-20 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 hidden sm:flex"
                              aria-label="Quick add"
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        {/* Details */}
                        <div className="p-4 sm:p-5 flex flex-col gap-3 flex-grow">
                          {/* Brand / Category */}
                          <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-primary uppercase">
                            {product.brand || product.section || product.category}
                          </span>
                          
                          {/* Title */}
                          <Link href={`/product/${product.handle}`} className="hover:text-primary transition-colors block">
                            <h3 className="text-[13px] sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[40px]">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Attributes */}
                          <div className="flex flex-wrap gap-1">
                            {product.puffs && product.puffs !== "Refillable" && (
                              <span className="text-[8px] sm:text-[9px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium">
                                {product.puffs}
                              </span>
                            )}
                            {product.nicotine && product.nicotine !== "Universal" && (
                              <span className="text-[8px] sm:text-[9px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium">
                                {product.nicotine}
                              </span>
                            )}
                          </div>

                          {/* Rating and Price */}
                          <div className="flex items-end justify-between mt-auto pt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                              <span className="text-[11px] sm:text-xs font-bold text-foreground">{product.rating}</span>
                              {product.reviews > 0 && (
                                <span className="text-[9px] sm:text-[10px] text-muted-foreground">({product.reviews})</span>
                              )}
                            </div>
                            <div className="text-right">
                              {product.originalPrice && (
                                <p className="text-[10px] sm:text-[11px] text-muted-foreground line-through">
                                  Dhs. {product.originalPrice.toLocaleString()}
                                </p>
                              )}
                              <p className="text-sm sm:text-base font-serif font-bold text-foreground">
                                Dhs. {product.price.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* CTA Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 mt-0.5">
                            <button
                              onClick={() => !product.isSoldOut && handleAddToCart(product)}
                              disabled={product.isSoldOut}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] sm:text-[11px] font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                                product.isSoldOut
                                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                                  : "bg-card hover:bg-muted/40 border border-border text-foreground hover:border-primary hover:text-primary"
                              }`}
                            >
                              {product.isSoldOut ? (
                                "Sold Out"
                              ) : (
                                <>
                                  <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                                </>
                              )}
                            </button>
                            {!product.isSoldOut && (
                              <button
                                onClick={() => handleBuyNow(product)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] sm:text-[11px] font-bold tracking-wide bg-gradient-to-r from-primary to-orange-500 text-white hover:brightness-110 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm"
                              >
                                <Zap className="h-3.5 w-3.5" /> Buy Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
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
