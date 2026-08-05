"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Calendar, Clock, User, ChevronRight, ArrowLeft, Share2, MessageCircle, Copy, Check, Sparkles, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "../page";

export default function SingleBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const slug = params?.slug as string;

  const fallbackPost = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];
  const [article, setArticle] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!slug) return;
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.title) {
            setArticle(data);
          }
        }
      } catch (err) {
        console.warn("Single article API fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  const post = article || fallbackPost;
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-28 sm:pt-32 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
          </nav>
        </div>

        {/* Article Header */}
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="space-y-4 text-center">
            <span className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full">
              {post.category || "News"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                <User className="h-3.5 w-3.5 text-primary" />
                {post.author || "Vape Shop Dubai Editorial"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : (post.date || "August 2, 2026")}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {post.readTime || "5 min read"}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mt-8 bg-card border border-border/40 rounded-[2.5rem] p-8 aspect-video flex items-center justify-center overflow-hidden shadow-md">
            <img
              src={post.image}
              alt={post.title}
              className="max-h-72 w-auto object-contain drop-shadow-2xl"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }}
            />
          </div>
        </div>

        {/* Article Content Body */}
        <div className="max-w-[850px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {post.contentHtml ? (
            <div
              className="product-description-content text-muted-foreground leading-relaxed text-sm sm:text-base space-y-4"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          ) : (
            <article className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm sm:text-base space-y-6">
              <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed border-l-4 border-primary pl-4 bg-primary/5 py-3 rounded-r-xl">
                {post.excerpt}
              </p>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mt-8 mb-4">
                Overview &amp; Key Features
              </h2>
              <p>
                Vaping in Dubai and across the United Arab Emirates has seen exponential growth in recent years. With strict ESMA (Emirates Authority for Standardization and Metrology) standards, users in the UAE can enjoy high-grade, lab-tested devices and authentic salt nicotine formulations.
              </p>

              <div className="bg-card border border-border/40 rounded-2xl p-6 my-8 space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Key Takeaways for UAE Vapers:
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">100% Genuine Certification:</strong> Always scan security QR codes on manufacturer packaging to verify authenticity.</li>
                  <li><strong className="text-foreground">2-Hour Express Delivery:</strong> Orders placed before 10 PM in Dubai arrive directly at your door within 120 minutes.</li>
                  <li><strong className="text-foreground">Payment Flexibility:</strong> Pay easily via Cash on Delivery, Mobile Card Reader at door, or Apple Pay.</li>
                </ul>
              </div>
            </article>
          )}

          {/* Social Share Bar */}
          <div className="pt-8 mt-12 border-t border-border/30 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              Share Article:
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all cursor-pointer"
                title="Share on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <button
                onClick={handleCopyLink}
                className="p-2.5 rounded-full bg-muted text-foreground hover:bg-primary hover:text-white transition-all cursor-pointer"
                title="Copy Article Link"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 pt-12 border-t border-border/20">
          <h3 className="text-2xl font-serif font-bold text-foreground mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <div key={rel.slug} className="bg-card border border-border/40 rounded-2xl p-4 flex flex-col gap-3 hover:-translate-y-1 transition-all">
                <Link href={`/blog/${rel.slug}`} className="bg-muted/10 rounded-xl p-4 aspect-video flex items-center justify-center">
                  <img src={rel.image} alt={rel.title} className="h-28 w-auto object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_vape.png"; }} />
                </Link>
                <span className="text-[10px] font-bold text-primary uppercase">{rel.category}</span>
                <Link href={`/blog/${rel.slug}`}>
                  <h4 className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2">{rel.title}</h4>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
