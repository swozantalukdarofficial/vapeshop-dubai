"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
      .filter((p) => p.name.toLowerCase().includes(query) || (p.brand && p.brand.toLowerCase().includes(query)))
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
      if (activeCategory === "all" || activeCategory === "home") {
        return linkId === "home";
      }
      return activeCategory === linkId;
    }
    if (normalizedPath === "/shop") {
      return linkId === "all";
    }
    if (normalizedPath.startsWith("/collections/")) {
      const collectionHandle = normalizedPath.replace("/collections/", "");
      return linkId === collectionHandle;
    }
    return activeCategory === linkId;
  };

  const handleNavClick = (id: string, subItem?: string) => {
    if (id === "home") {
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
    } else if (id === "blog") {
      setIsDevModalOpen(true);
    } else if (id === "all") {
      router.push("/shop");
    } else {
      if (subItem) {
        if (id === "brand") {
          let brandName = subItem.replace(" Vape", "").trim();
          if (brandName.toLowerCase() === "geek") brandName = "GeekVape";
          if (brandName.toLowerCase() === "voopoo") brandName = "VooPoo";
          router.push(`/collections/all?brand=${encodeURIComponent(brandName)}`);
        } else {
          router.push(`/collections/${id}?sub=${encodeURIComponent(subItem)}`);
        }
      } else {
        if (id === "brand") {
          router.push("/collections/all");
        } else {
          router.push(`/collections/${id}`);
        }
      }
    }
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>

      {/* ── Announcement Bar ──────────────────────────── */}
      <div className={`hidden sm:block bg-primary text-white transition-all duration-300 overflow-hidden ${isScrolled ? "h-0 opacity-0" : "h-8 opacity-100"}`}>
        <div className="max-w-[1440px] mx-auto px-4 h-full flex items-center justify-center">
          <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-center">
            🚀 FREE DELIVERY ON ORDERS 300AED+&nbsp;&nbsp;|&nbsp;&nbsp;⚡ SAME DAY DELIVERY&nbsp;&nbsp;|&nbsp;&nbsp;💳 COD & CREDIT CARD MACHINE ON DELIVERY
          </p>
        </div>
      </div>

      {/* ── Main Navbar ───────────────────────────────── */}
      <div className={`glass-strong border-b border-border transition-all duration-300 ${isScrolled ? "py-2.5" : "py-3"}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
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
            <nav className="hidden lg:flex items-center gap-0.5" ref={dropdownRef}>
              {NAV_LINKS.map((link) => (
                <div key={link.id} className="relative">
                  <button
                    onClick={() => {
                      if (link.sub) {
                        setOpenDropdown(openDropdown === link.id ? null : link.id);
                      } else {
                        handleNavClick(link.id);
                      }
                    }}
                    className={`flex items-center gap-0.5 xl:gap-1 px-1.5 xl:px-3 py-2 rounded-lg text-[10px] xl:text-[11px] font-bold tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      getActiveState(link.id)
                        ? "text-primary bg-primary/6"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {link.label}
                    {link.sub && <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === link.id ? "rotate-180" : ""}`} />}
                  </button>

                  {/* Dropdown */}
                  {link.sub && openDropdown === link.id && (
                    <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg py-2 min-w-[180px] max-h-80 overflow-y-auto z-50">
                      {link.sub.map((s) => (
                        <button
                          key={s}
                          onClick={() => { handleNavClick(link.id, s); setOpenDropdown(null); }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
        <div className="lg:hidden glass-strong border-b border-border shadow-xl">
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
          <nav className="px-4 py-2 space-y-0.5">
            {NAV_LINKS.map((link) => {
              const hasSub = !!link.sub;
              const isSubOpen = openDropdown === link.id;
              
              return (
                <div key={link.id} className="space-y-1">
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={() => {
                        if (hasSub) {
                          setOpenDropdown(isSubOpen ? null : link.id);
                        } else {
                          handleNavClick(link.id);
                        }
                      }}
                      className={`flex-grow text-left px-4 py-2.5 rounded-xl text-sm font-bold tracking-wider transition-colors cursor-pointer ${
                        getActiveState(link.id)
                          ? "bg-primary/8 text-primary"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {link.label}
                    </button>
                    {hasSub && (
                      <button
                        onClick={() => setOpenDropdown(isSubOpen ? null : link.id)}
                        className="p-2.5 text-foreground/50 hover:text-primary transition-colors cursor-pointer"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isSubOpen ? "rotate-180 text-primary" : ""}`} />
                      </button>
                    )}
                  </div>
                  
                  {hasSub && isSubOpen && (
                    <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-primary/20 ml-4 max-h-60 overflow-y-auto">
                      {link.sub.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleNavClick(link.id, s)}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-foreground/75 hover:text-primary rounded-lg hover:bg-muted/40 transition-all cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
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
