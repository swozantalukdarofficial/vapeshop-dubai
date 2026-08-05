"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  ChevronDown,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
  activeCategory?: string;
}

const NAV_LINKS = [
  { label: "HOME", id: "home" },
  { label: "SHOP", id: "all" },
  {
    label: "JUUL",
    id: "juul",
    sub: ["JUUL 1 Series", "JUUL 2 Series", "JUUL Pods"],
  },
  {
    label: "MYLE",
    id: "myle",
    sub: ["Myle v5 Pods", "Myle v5 Device", "Myle Disposable"],
  },
  {
    label: "DISPOSABLE",
    id: "disposables",
    sub: [
      "Al Fakher Vape",
      "Elf Bar Vape",
      "Fummo Vape",
      "Pod Salt Vape",
      "Vapes Bars",
      "Vozol Vape",
      "Tugboat Vape",
      "HQD Vape",
      "Lost Mary",
      "Maskking Vape",
      "Geek Bar",
      "Yuoto Vape",
      "Relx Vape",
      "Nerd Vape",
      "Vgod Stig",
      "Silvaper Vape",
    ],
  },
  {
    label: "E-JUICE",
    id: "e-liquids",
    sub: ["Salt Nicotine", "Freebase e-liquid"],
  },
  {
    label: "POD SYSTEM",
    id: "accessories",
    sub: ["Pod Kit", "Pod Cartridge", "Vape Coils"],
  },
  {
    label: "BRAND",
    id: "brand",
    sub: [
      "Oxva Vape",
      "Uwell Vape",
      "Vaporesso Vape",
      "Smok Vape",
      "Geek Vape",
      "Voopoo Vape",
    ],
  },
  { label: "BLOG", id: "blog" },
];

const SUB_HANDLE_MAP: Record<string, string> = {
  // JUUL
  "JUUL 1 Series": "juul-1-series",
  "JUUL 2 Series": "juul-2-series",
  "JUUL Pods": "juul-pods-offers",
  "JUUL Pods Offers": "juul-pods-offers",

  // MYLE
  "Myle v5 Pods": "myle-v5-pods",
  "Myle v5 Device": "myle-v5-device",
  "Myle Disposable": "myle-disposable",

  // DISPOSABLE
  "Al Fakher Vape": "al-fakher-vape",
  "Elf Bar Vape": "elf-bar-vape",
  "Fummo Vape": "fummo-vape",
  "Pod Salt Vape": "pod-salt-vape",
  "Vapes Bars": "vapes-bars",
  "Vozol Vape": "vozol-vape",
  "Tugboat Vape": "tugboat-vape",
  "HQD Vape": "hqd-vape",
  "Lost Mary": "lost-mary-disposable",
  "Maskking Vape": "maskking-vape",
  "Geek Bar": "geek-bar-disposable",
  "Yuoto Vape": "yuoto-vape",
  "Relx Vape": "relx-vape",
  "Nerd Vape": "nerd-vape",
  "Vgod Stig": "vgod-stig",
  "Silvaper Vape": "silvaper-vape",

  // E-JUICE
  "Salt Nicotine": "salt-nicotine",
  "Freebase e-liquid": "freebase-e-liquid",

  // POD SYSTEM
  "Pod Kit": "pod-kit",
  "Pod Cartridge": "pod-cartridge",
  "Vape Coils": "vape-coils",

  // BRAND
  "Oxva Vape": "oxva-vape",
  "Uwell Vape": "uwell-vape",
  "Vaporesso Vape": "vaporesso-vape",
  "Smok Vape": "smok-vape",
  "Geek Vape": "geek-vape",
  "Voopoo Vape": "voopoo-vape",
};

const MAIN_HANDLE_MAP: Record<string, string> = {
  home: "/",
  all: "all",
  juul: "juul-vape-dubai",
  myle: "myle-vape-dubai",
  disposables: "disposable-vape",
  "e-liquids": "vape-e-juice",
  accessories: "pod-system",
  brand: "all",
  blog: "blog",
};

const NavbarContent: React.FC<NavbarProps> = ({
  onSearchChange,
  onCategorySelect,
  activeCategory = "all",
}) => {
  const { cartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Suggestions states & refs
  const [products, setProducts] = useState<any[]>([]);
  const [hasFetchedProducts, setHasFetchedProducts] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const q = searchParams?.get("search") || searchParams?.get("q") || "";
    setSearchQuery(q);
    if (q) {
      setIsSearchOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktopNav = dropdownRef.current?.contains(target);
      const insideMobileNav = mobileNavRef.current?.contains(target);
      if (!insideDesktopNav && !insideMobileNav) {
        setOpenDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProductsForSuggestions = async () => {
    if (hasFetchedProducts) return;
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
        setHasFetchedProducts(true);
      }
    } catch (err) {
      console.error("Error fetching products for suggestions:", err);
    }
  };

  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) return [];
    return products
      .filter((p: any) => p.name.toLowerCase().includes(query) || (p.brand && p.brand.toLowerCase().includes(query)))
      .slice(0, 5);
  }, [products, searchQuery]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (onSearchChange) {
      onSearchChange(query);
    } else {
      if (!query) {
        router.push("/collections/all");
      } else {
        router.push(`/collections/all?search=${encodeURIComponent(query)}`);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const getActiveState = (linkId: string) => {
    const currentPath = pathname || (typeof window !== "undefined" ? window.location.pathname : "/");
    const normalizedPath = currentPath === "/" ? "/" : currentPath.replace(/\/$/, "");

    if (normalizedPath === "/") {
      return linkId === "home";
    }
    if (normalizedPath === "/shop" || normalizedPath === "/collections/all") {
      return linkId === "all";
    }
    if (normalizedPath.startsWith("/collections/")) {
      const collectionHandle = normalizedPath.replace("/collections/", "");
      if (linkId === "juul" && (collectionHandle.includes("juul") || collectionHandle.includes("juul-vape-dubai"))) return true;
      if (linkId === "myle" && (collectionHandle.includes("myle") || collectionHandle.includes("myle-vape-dubai"))) return true;
      if (linkId === "disposables" && (collectionHandle.includes("disposable") || collectionHandle.includes("disposable-vape"))) return true;
      if (linkId === "e-liquids" && (collectionHandle.includes("e-juice") || collectionHandle.includes("e-liquid") || collectionHandle.includes("vape-e-juice"))) return true;
      if (linkId === "accessories" && (collectionHandle.includes("pod-system") || collectionHandle.includes("accessories") || collectionHandle.includes("pod-kit"))) return true;
      return linkId === collectionHandle;
    }
    return activeCategory === linkId;
  };

  const getNavLinkHref = (id: string, subItem?: string): string => {
    if (id === "home") return "/";
    if (id === "all") return "/shop";
    if (id === "blog") return "#";

    if (subItem) {
      if (SUB_HANDLE_MAP[subItem]) {
        return `/collections/${SUB_HANDLE_MAP[subItem]}`;
      }
      return `/collections/${id}`;
    }

    if (MAIN_HANDLE_MAP[id]) {
      return `/collections/${MAIN_HANDLE_MAP[id]}`;
    }

    return `/collections/${id}`;
  };

  const handleSubNavigate = (targetHref: string) => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    if (targetHref === "/" && pathname === "/") {
      onCategorySelect?.("all");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(targetHref);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleNavClick = (id: string, subItem?: string) => {
    if (id === "home") {
      if (pathname === "/") {
        onCategorySelect?.("all");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
    } else if (id === "blog") {
      setIsDevModalOpen(true);
    } else if (id === "all") {
      if (pathname === "/") {
        onCategorySelect?.("all");
        document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/shop");
      }
    } else {
      const href = getNavLinkHref(id, subItem);
      router.push(href);
    }
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>

      {/* ── Announcement Bar ──────────────────────────── */}
      <div className={`hidden sm:block bg-primary text-white transition-all duration-300 overflow-hidden ${isScrolled ? "h-0 opacity-0" : "h-8 opacity-100"}`}>
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-center">
          <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-center">
            🚀 FREE DELIVERY ON ORDERS 300AED+&nbsp;&nbsp;|&nbsp;&nbsp;⚡ SAME DAY DELIVERY&nbsp;&nbsp;|&nbsp;&nbsp;💳 COD & CREDIT CARD MACHINE ON DELIVERY
          </p>
        </div>
      </div>

      {/* ── Main Navbar ───────────────────────────────── */}
      <div className={`glass-strong border-b border-border transition-all duration-300 ${isScrolled ? "py-2.5" : "py-3"}`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer select-none"
              onClick={() => {
                if (pathname === "/") {
                  onCategorySelect?.("all");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  router.push("/");
                }
              }}
            >
              <svg viewBox="0 0 220 48" className="h-9 sm:h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="2" y="36" fontFamily="var(--font-serif), Georgia, serif" fontWeight="900" fontSize="36" fill="var(--primary)">V</text>
                <text x="21" y="39" fontFamily="var(--font-serif), Georgia, serif" fontStyle="italic" fontWeight="400" fontSize="40" fill="var(--primary)">S</text>
                <text x="65" y="22" fontFamily="var(--font-sans), sans-serif" fontWeight="800" fontSize="13" letterSpacing="0.18em" fill="currentColor" className="text-foreground">VAPE SHOP</text>
                <text x="65" y="38" fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.38em" fill="var(--primary)">DUBAI</text>
              </svg>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" ref={dropdownRef}>
              {NAV_LINKS.map((link) => {
                const mainHref = getNavLinkHref(link.id);

                return (
                  <div 
                    key={link.id} 
                    className="relative group"
                    onMouseEnter={() => link.sub && setOpenDropdown(link.id)}
                    onMouseLeave={() => link.sub && setOpenDropdown(null)}
                  >
                    <div
                      className={`flex items-center rounded-xl text-xs xl:text-[13px] font-extrabold tracking-wider whitespace-nowrap transition-all duration-200 ${
                        getActiveState(link.id) || openDropdown === link.id
                          ? "text-primary bg-primary/10 font-black shadow-xs"
                          : "text-foreground/85 hover:text-primary hover:bg-muted/70"
                      }`}
                    >
                      <Link
                        href={mainHref}
                        onClick={(e) => {
                          if (link.id === "blog") {
                            e.preventDefault();
                            setIsDevModalOpen(true);
                          } else if (link.id === "home" && pathname === "/") {
                            onCategorySelect?.("all");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } else if (link.id === "all" && pathname === "/") {
                            onCategorySelect?.("all");
                            document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                          }
                          setOpenDropdown(null);
                        }}
                        className="px-2.5 xl:px-3 py-2 text-left hover:text-primary transition-colors cursor-pointer"
                      >
                        {link.label}
                      </Link>

                      {link.sub && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === link.id ? null : link.id);
                          }}
                          className="pr-2.5 xl:pr-3 py-2 pl-0.5 hover:text-primary transition-all cursor-pointer flex items-center justify-center"
                          aria-label={`Toggle ${link.label} menu`}
                        >
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === link.id ? "rotate-180 text-primary" : ""}`} />
                        </button>
                      )}
                    </div>

                    {/* Dropdown (Shows on Hover & Click) */}
                    {link.sub && openDropdown === link.id && (
                      <div className="absolute top-full left-0 mt-1 bg-card/98 backdrop-blur-md border border-border/70 rounded-2xl shadow-xl p-2 min-w-[220px] max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {link.sub.map((s) => {
                          const subHref = getNavLinkHref(link.id, s);
                          return (
                            <Link
                              key={s}
                              href={subHref}
                              onClick={() => {
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-extrabold text-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer flex items-center justify-between group/sub"
                            >
                              <span>{s}</span>
                              <span className="opacity-0 group-hover/sub:opacity-100 text-primary transition-opacity font-bold">→</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search (desktop expandable) */}
              <div className="hidden md:flex items-center gap-2 relative">
                {isSearchOpen ? (
                  <form 
                    ref={searchRef}
                    onSubmit={handleSearchSubmit} 
                    className="flex items-center gap-2 relative"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        handleSearchChange(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => {
                        fetchProductsForSuggestions();
                        setShowSuggestions(true);
                      }}
                      placeholder="Search products..."
                      className="w-48 bg-muted border border-border rounded-full px-4 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-all"
                    />
                    <button type="submit" className="p-1.5 text-foreground/75 hover:text-primary cursor-pointer">
                      <Search className="h-4 w-4" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { 
                        setIsSearchOpen(false); 
                        setSearchQuery(""); 
                        setShowSuggestions(false);
                      }} 
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && searchQuery.trim().length >= 2 && (
                      <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                        <div className="px-4 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/30">
                          Search Suggestions
                        </div>
                        <div className="max-h-64 overflow-y-auto divide-y divide-border/20">
                          {suggestions.length > 0 ? (
                            suggestions.map((product) => (
                              <button
                                key={product.id}
                                type="button"
                                onClick={() => {
                                  router.push(`/product/${product.handle}`);
                                  setShowSuggestions(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted/60 transition-colors cursor-pointer text-left"
                              >
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-9 h-9 rounded-lg object-contain bg-white dark:bg-muted p-1 flex-shrink-0"
                                  onError={(e) => { e.currentTarget.src = "/hero_vape.png"; }}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-foreground truncate">{product.name}</p>
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                    <span className="capitalize">{product.category}</span>
                                    <span>•</span>
                                    <span className="font-semibold text-foreground">Dhs. {product.price}</span>
                                    {product.originalPrice && (
                                      <span className="line-through text-muted-foreground/60 text-[9px]">Dhs. {product.originalPrice}</span>
                                    )}
                                  </p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-xs text-muted-foreground text-center">
                              No products found for "{searchQuery}"
                            </div>
                          )}
                        </div>
                        <button
                          type="submit"
                          className="w-full text-center py-2.5 border-t border-border/40 text-xs font-bold text-primary hover:bg-primary/5 transition-all block cursor-pointer"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-foreground/70 hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-muted/60"
                    aria-label="Search"
                  >
                    <Search className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/971582839787?text=Hello, I'd like to order from Vape Shop Dubai!"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-[#25D366] border border-[#25D366]/25 px-3 py-1.5 rounded-full hover:bg-[#25D366]/8 transition-all cursor-pointer"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">WhatsApp</span>
              </a>



              {/* Login */}
              <button className="hidden sm:inline-flex text-[10px] font-bold text-foreground/70 hover:text-primary px-3 py-1.5 rounded-full border border-border hover:border-primary/30 transition-all cursor-pointer">
                LOGIN
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-foreground/70 hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-muted/60"
                aria-label="Cart"
                id="cart-btn"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-background leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────── */}
      {isMobileMenuOpen && (
        <div ref={mobileNavRef} className="lg:hidden glass-strong border-b border-border shadow-2xl max-h-[calc(100vh-75px)] overflow-y-auto pb-8">
          {/* Mobile search */}
          <div className="px-4 pt-4 pb-2 relative">
            <form 
              ref={mobileSearchRef}
              onSubmit={handleSearchSubmit} 
              className="relative"
            >
              <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary cursor-pointer">
                <Search className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  handleSearchChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  fetchProductsForSuggestions();
                  setShowSuggestions(true);
                }}
                placeholder="Search products..."
                className="w-full bg-muted border border-border rounded-full pl-10 pr-10 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => {
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Suggestions Dropdown (Mobile) */}
              {showSuggestions && searchQuery.trim().length >= 2 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-xl py-2 z-50 max-h-80 overflow-hidden">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/30">
                    Search Suggestions
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-border/20">
                    {suggestions.length > 0 ? (
                      suggestions.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            router.push(`/product/${product.handle}`);
                            setShowSuggestions(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors cursor-pointer text-left"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-9 h-9 rounded-lg object-contain bg-white dark:bg-muted p-1 flex-shrink-0"
                            onError={(e) => { e.currentTarget.src = "/hero_vape.png"; }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-foreground truncate">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <span className="capitalize">{product.category}</span>
                              <span>•</span>
                              <span className="font-semibold text-foreground">Dhs. {product.price}</span>
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-muted-foreground text-center">
                        No products found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full text-center py-2.5 border-t border-border/40 text-xs font-bold text-primary hover:bg-primary/5 transition-all block cursor-pointer"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Nav items */}
          <nav className="px-4 py-2 space-y-1">
            {NAV_LINKS.map((link) => {
              const hasSub = !!link.sub;
              const isSubOpen = openDropdown === link.id;
              const mainHref = getNavLinkHref(link.id);

              return (
                <div key={link.id} className="space-y-1">
                  <div className="flex items-center justify-between w-full">
                    {hasSub ? (
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(isSubOpen ? null : link.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold tracking-wider transition-all cursor-pointer flex items-center justify-between ${
                          getActiveState(link.id) || isSubOpen
                            ? "bg-primary/10 text-primary font-black"
                            : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-200 ${isSubOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                      </button>
                    ) : link.id === "blog" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsDevModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold tracking-wider transition-all cursor-pointer text-foreground/80 hover:text-foreground hover:bg-muted/50"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={mainHref}
                        onClick={() => {
                          if (link.id === "home" && pathname === "/") {
                            onCategorySelect?.("all");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } else if (link.id === "all" && pathname === "/") {
                            onCategorySelect?.("all");
                            document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                          }
                          setIsMobileMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold tracking-wider transition-all ${
                          getActiveState(link.id)
                            ? "bg-primary/10 text-primary font-black"
                            : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                  
                  {hasSub && isSubOpen && (
                    <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-primary ml-3 bg-muted/20 rounded-r-2xl my-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Link
                        href={mainHref}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-xs font-black tracking-wider text-primary uppercase hover:bg-primary/10 rounded-xl transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>View All {link.label}</span>
                        <span>→</span>
                      </Link>
                      {link.sub.map((s) => {
                        const subHref = getNavLinkHref(link.id, s);
                        return (
                          <Link
                            key={s}
                            href={subHref}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:text-primary rounded-xl hover:bg-primary/10 transition-all flex items-center justify-between cursor-pointer"
                          >
                            <span>{s}</span>
                            <span className="text-primary/60 text-xs font-bold">→</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile action buttons */}
          <div className="px-4 pb-4 pt-2 flex gap-3">
            <a
              href="https://wa.me/971582839787"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-bold py-2.5 rounded-xl cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Order
            </a>
            <button className="flex-1 border border-border text-sm font-bold py-2.5 rounded-xl text-foreground/70 hover:border-primary hover:text-primary transition-all cursor-pointer">
              Login / Register
            </button>
          </div>
        </div>
      )}

      {/* Custom Under Development Modal */}
      {isDevModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDevModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-card border border-border rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            
            <h3 className="text-lg font-serif font-bold text-foreground mb-2">Under Development</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              This page is currently under development. For any inquiries, please contact <strong className="text-foreground font-semibold">Shipon Talukdar</strong>.
            </p>
            
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/971582839787?text=Hi Shipon, I'm contacting you regarding the website."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-bold py-3 rounded-full hover:opacity-90 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Shipon Talukdar
              </a>
              <button
                onClick={() => setIsDevModalOpen(false)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground py-2 hover:underline cursor-pointer bg-transparent border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <Suspense fallback={
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border py-3">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="h-9 sm:h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-5 w-40 bg-muted animate-pulse rounded hidden md:block" />
          <div className="h-9 w-9 bg-muted animate-pulse rounded-full" />
        </div>
      </header>
    }>
      <NavbarContent {...props} />
    </Suspense>
  );
};
