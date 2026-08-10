"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, BookOpen, User } from "lucide-react";
import { BLOG_POSTS, BlogPost } from "@/app/blog/page";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS.slice(0, 3));

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const res = await fetch("/api/articles");
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            const mapped: BlogPost[] = data.articles.slice(0, 3).map((item: any, idx: number) => ({
              slug: item.handle || `article-${idx}`,
              title: item.title,
              excerpt: item.excerpt || (item.contentHtml ? item.contentHtml.replace(/<[^>]+>/g, "").slice(0, 120) + "..." : ""),
              category: item.blog?.title || "Vape Guides",
              author: item.authorV2?.name || item.author?.name || "Vape Shop Dubai Editorial",
              date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "August 2026",
              readTime: "5 min read",
              image: item.image?.url || BLOG_POSTS[idx % BLOG_POSTS.length]?.image || "/hero_vape.png",
            }));
            setPosts(mapped);
          }
        }
      } catch (err) {
        // Fallback to static BLOG_POSTS
      }
    }

    fetchLatestPosts();
  }, []);

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden bg-gradient-to-b from-background to-muted/20 border-t border-border/40">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-5 sm:space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-4">
          <div className="space-y-1.5">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Vape Dubai Journal</span>
            </Badge>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">
              Latest Vaping Guides & Insights
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl font-medium leading-relaxed">
              Stay informed with authentic product reviews, JUUL 2 guides, disposable vape comparisons, and legal UAE regulations.
            </p>
          </div>

          <Link
            href="/blog"
            className="group self-start md:self-auto inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-primary transition-colors text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-md"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Blog Posts Grid using Shadcn UI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="group overflow-hidden bg-card/60 backdrop-blur-sm border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 flex flex-col h-full rounded-[2rem]"
            >
              {/* Card Image Header */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-muted">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-80" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-primary text-primary-foreground font-bold tracking-wider uppercase text-[9px] px-3 py-1 border-none shadow-md">
                    {post.category}
                  </Badge>
                </div>
              </div>

              {/* Card Content & Body */}
              <CardContent className="p-6 sm:p-8 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-3">
                  {/* Meta info: Date & Read Time */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <CardTitle className="text-xl sm:text-2xl font-serif font-black text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:underline decoration-primary/30 underline-offset-4">
                      {post.title}
                    </Link>
                  </CardTitle>

                  {/* Excerpt */}
                  <CardDescription className="line-clamp-3 text-sm font-medium leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                </div>
              </CardContent>

              {/* Card Footer: Author & Read Guide CTA */}
              <CardFooter className="p-6 sm:p-8 pt-0 flex items-center justify-between mt-auto">
                <span className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <span className="truncate max-w-[120px]">{post.author}</span>
                </span>
                
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-foreground text-background group-hover:bg-primary transition-all duration-300 hover:scale-110 shadow-sm"
                  aria-label="Read Guide"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bottom Mobile View All Link using Shadcn Button */}
        <div className="text-center pt-1 md:hidden">
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full sm:w-auto inline-flex items-center gap-2"
            )}
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>Explore All Blog Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
