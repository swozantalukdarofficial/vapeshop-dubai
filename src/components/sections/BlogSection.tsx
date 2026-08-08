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
    <section className="py-6 sm:py-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-5 sm:space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-4">
          <div className="space-y-1.5">
            <Badge variant="default">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Vape Dubai Journal</span>
            </Badge>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Latest Vaping Guides & Insights
            </h2>
            
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Stay informed with authentic product reviews, JUUL 2 guides, disposable vape comparisons, and legal UAE regulations.
            </p>
          </div>

          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group self-start md:self-auto inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm h-8"
            )}
          >
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Blog Posts Grid using Shadcn UI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="group overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full rounded-xl"
            >
              {/* Card Image Header */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-muted">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="glass">
                    {post.category}
                  </Badge>
                </div>
              </div>

              {/* Card Content & Body */}
              <CardContent className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
                <div className="space-y-2">
                  {/* Meta info: Date & Read Time */}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>

                  {/* Excerpt */}
                  <CardDescription className="line-clamp-2 text-xs">
                    {post.excerpt}
                  </CardDescription>
                </div>
              </CardContent>

              {/* Card Footer: Author & Read Guide CTA */}
              <CardFooter className="p-4 sm:p-5 pt-3 border-t border-border/40 flex items-center justify-between mt-auto">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <User className="w-3 h-3 text-primary/70" />
                  <span className="truncate max-w-[130px]">{post.author}</span>
                </span>
                
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3 h-3" />
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
