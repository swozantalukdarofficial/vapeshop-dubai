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

export interface BlogSettings {
  badgeText: string;
  heading: string;
  description: string;
  viewAllLabel: string;
  viewAllHref: string;
  postCount: number;
}

export const BlogSection: React.FC<{ settings: BlogSettings }> = ({
  settings,
}) => {
  const postCount = Math.max(1, settings.postCount);

  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS.slice(0, postCount));

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const res = await fetch("/api/articles");
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            const mapped: BlogPost[] = data.articles.slice(0, postCount).map((item: any, idx: number) => ({
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
  }, [postCount]);

  return (
    <section className="w-full bg-card border border-primary/20 rounded-[2rem] p-5 sm:p-7 lg:p-8 relative overflow-hidden shadow-md transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 z-20" />
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-5">
          <div className="space-y-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{settings.badgeText}</span>
            </Badge>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-foreground tracking-tight leading-tight">
              {settings.heading}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl font-medium leading-relaxed">
              {settings.description}
            </p>
          </div>

          <Link
            href={settings.viewAllHref || "/blog"}
            className="group self-start md:self-auto inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-primary transition-colors text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-sm"
          >
            <span>{settings.viewAllLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Blog Posts Grid using Shadcn UI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="group overflow-hidden bg-background/80 hover:bg-background border border-border/80 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col h-full rounded-[1.75rem]"
            >
              {/* Card Image Header */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gradient-to-br from-background via-muted/40 to-background flex items-center justify-center p-6 border-b border-border/40">
                {/* Subtle ambient glow */}
                <div className="absolute w-28 h-28 rounded-full bg-primary/8 filter blur-xl pointer-events-none" />
                
                <Image
                  src={post.image}
                  alt={post.title}
                  width={240}
                  height={240}
                  className="relative z-10 max-h-36 sm:max-h-40 w-auto object-contain group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Category Badge */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <Badge className="bg-primary text-primary-foreground font-bold tracking-wider uppercase text-[9px] px-2.5 py-0.5 border-none shadow-xs">
                    {post.category}
                  </Badge>
                </div>
              </div>

              {/* Card Content & Body */}
              <CardContent className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-3">
                <div className="space-y-2.5">
                  {/* Meta info: Date & Read Time */}
                  <div className="flex items-center gap-3.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
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
                  <CardTitle className="text-lg sm:text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:underline decoration-primary/30 underline-offset-4">
                      {post.title}
                    </Link>
                  </CardTitle>

                  {/* Excerpt */}
                  <CardDescription className="line-clamp-2 text-xs sm:text-[13px] font-normal leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </CardDescription>
                </div>
              </CardContent>

              {/* Card Footer: Author & Read Guide CTA */}
              <CardFooter className="p-5 sm:p-6 pt-0 flex items-center justify-between mt-auto border-t border-border/30 pt-3.5">
                <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <span className="truncate max-w-[120px]">{post.author}</span>
                </span>
                
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background group-hover:bg-primary transition-all duration-300 hover:scale-105 shadow-xs"
                  aria-label="Read Guide"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bottom Mobile View All Link */}
        <div className="text-center pt-1 md:hidden">
          <Link
            href={settings.viewAllHref || "/blog"}
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
