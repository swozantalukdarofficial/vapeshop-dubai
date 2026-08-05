"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Calendar, Clock, User, ChevronRight, Search, ArrowRight, Tag, BookOpen, Sparkles } from "lucide-react";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "juul-2-dubai-complete-guide-2026",
    title: "Complete Guide to JUUL 2 in Dubai: Features, Flavors & 2-Hour Delivery (2026)",
    excerpt: "Everything you need to know about JUUL 2 devices and pods in UAE. Learn about smart pod technology, flavor profiles, battery optimization, and fast delivery across Dubai.",
    category: "JUUL & Pods",
    author: "Vape Shop Dubai Editorial",
    date: "August 2, 2026",
    readTime: "5 min read",
    image: "/juul_device.png",
    featured: true,
  },
  {
    slug: "top-10-longest-lasting-disposable-vapes-uae",
    title: "Top 10 Longest Lasting Disposable Vapes in UAE (8000+ Puffs Rated)",
    excerpt: "Looking for high puff capacity disposables? We test and rank Al Fakher Crown Bar 8000, Lost Mary 10000, Tugboat T12000, and Elf Bar BC10000 for flavor and longevity.",
    category: "Disposables",
    author: "Vape Specialist Team",
    date: "July 28, 2026",
    readTime: "7 min read",
    image: "/lost_mary.png",
  },
  {
    slug: "myle-v5-vs-juul-2-which-should-you-buy",
    title: "MYLE V5 Meta vs JUUL 2: Which Pod System Should You Buy in Dubai?",
    excerpt: "Side-by-side comparison of UAE's two most popular pod systems. We analyze battery life, pod pricing, flavor intensity, and draw tightness to help you choose.",
    category: "Comparisons",
    author: "Vape Shop Dubai Editorial",
    date: "July 20, 2026",
    readTime: "6 min read",
    image: "/vape_kit.png",
  },
  {
    slug: "how-to-verify-authentic-vape-products-dubai",
    title: "How to Verify Authentic Vape Products in UAE & Avoid Counterfeits",
    excerpt: "Step-by-step guide to scanning QR codes, checking security seals, and verifying official distributor serial numbers on JUUL, MYLE, and Al Fakher products.",
    category: "Safety & Authenticity",
    author: "Quality Assurance Team",
    date: "July 15, 2026",
    readTime: "4 min read",
    image: "/hero_vape.png",
  },
  {
    slug: "best-salt-nicotine-e-liquids-dubai-summer-2026",
    title: "Best Salt Nicotine E-Liquid Flavors for Summer 2026 in Dubai",
    excerpt: "Beat the UAE heat with our curated list of top cooling menthol, icy mango, fruit blends, and premium tobacco salt nics available for express delivery.",
    category: "E-Liquids",
    author: "Flavor Sommelier",
    date: "July 10, 2026",
    readTime: "5 min read",
    image: "/premium_liquid.png",
  },
  {
    slug: "vaping-regulations-delivery-guidelines-uae-2026",
    title: "Vaping Regulations & Delivery Guidelines in Dubai & UAE (2026 Update)",
    excerpt: "Important legal updates regarding legal age requirements, ESMA certification standards, customs regulations, and cash-on-delivery rules in Dubai.",
    category: "UAE Guides",
    author: "Compliance Team",
    date: "July 01, 2026",
    readTime: "4 min read",
    image: "/hero_vape.png",
  },
];

const CATEGORIES = ["All", "JUUL & Pods", "Disposables", "E-Liquids", "Comparisons", "Safety & Authenticity", "UAE Guides"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShopifyArticles() {
      try {
        const res = await fetch("/api/articles");
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            const mapped: BlogPost[] = data.articles.map((item: any, idx: number) => ({
              slug: item.handle,
              title: item.title,
              excerpt: item.excerpt || "Read full article on Vape Shop Dubai.",
              category: item.blogTitle || "News",
              author: item.author || "Vape Shop Dubai Editorial",
              date: new Date(item.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              readTime: "5 min read",
              image: item.image || "/hero_vape.png",
              featured: idx === 0,
            }));
            setPosts(mapped);
          }
        }
      } catch (err) {
        console.warn("Failed to load Shopify articles, fallback used:", err);
      } finally {
        setLoading(false);
      }
    }
    loadShopifyArticles();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchCat = selectedCategory === "All" || post.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredPost = posts.find((p) => p.featured) || posts[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-28 sm:pt-32 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Blog &amp; Vaping Guides</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="text-center flex flex-col items-center justify-center max-w-3xl mx-auto">
            <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Knowledge Hub
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-foreground tracking-tight leading-tight">
              Vape Shop Dubai Blog &amp; Guides
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/65" />
              <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/65" />
            </div>
            <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
              Expert vaping insights, product reviews, pod system comparisons, authenticity checks, and UAE delivery news.
            </p>
          </div>
        </div>

        {/* Featured Hero Article */}
        {featuredPost && selectedCategory === "All" && !searchQuery && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
            <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 sm:p-10 shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-primary uppercase tracking-widest">
                  <span className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                  <span>Featured Guide</span>
                </div>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-foreground hover:text-primary transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                </Link>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/20">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <User className="h-3.5 w-3.5 text-primary" />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-primary/90 transition-all shadow-md active:scale-95"
                  >
                    Read Full Article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="lg:col-span-6">
                <Link href={`/blog/${featuredPost.slug}`} className="block relative bg-muted/10 border border-border/30 rounded-[2rem] p-8 aspect-video flex items-center justify-center overflow-hidden group">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="max-h-56 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-xl"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card border border-border/40 rounded-2xl p-4 shadow-xs">
            {/* Categories scroll */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-primary text-white shadow-xs"
                      : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {filteredPosts.length === 0 ? (
            <div className="bg-card border border-border/40 rounded-3xl p-12 text-center">
              <p className="text-base font-bold text-foreground">No articles found matching your query.</p>
              <button
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                className="mt-4 text-xs font-bold text-primary underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-card border border-border/40 rounded-[2rem] overflow-hidden flex flex-col p-4 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  <Link href={`/blog/${post.slug}`} className="relative bg-muted/10 rounded-[1.5rem] p-6 aspect-video flex items-center justify-center overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="max-h-40 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                    />
                    <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-md border border-border/30 text-primary text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
                      {post.category}
                    </span>
                  </Link>

                  <div className="p-4 flex flex-col flex-grow gap-3">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-primary" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-primary" />
                        {post.readTime}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="pt-3 border-t border-border/20 mt-auto flex items-center justify-between">
                      <span className="text-[11px] font-bold text-muted-foreground">{post.author}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        Read
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
