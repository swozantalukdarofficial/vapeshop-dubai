"use client";

import React from "react";
import { Sparkles, MessageSquareText } from "lucide-react";

export interface ProductFinalThoughtsMeta {
  heading?: string;
  body?: string;
}

interface ProductFinalThoughtsSectionProps {
  productName: string;
  className?: string;
  settings?: {
    headingTemplate?: string;
    bodyText?: string;
  };
  productFinalThoughts?: ProductFinalThoughtsMeta;
  hideIfEmpty?: boolean;
}

function parseAstToHtml(nodes: any[]): string {
  if (!Array.isArray(nodes)) return "";
  return nodes
    .map((node) => {
      if (node.type === "text") {
        let val = node.value || "";
        if (node.bold) val = `<strong>${val}</strong>`;
        if (node.italic) val = `<em>${val}</em>`;
        return val;
      }
      if (node.type === "link") {
        const inner = parseAstToHtml(node.children || []);
        return `<a href="${node.url || "#"}" class="text-primary underline font-bold hover:opacity-80">${inner}</a>`;
      }
      if (node.type === "paragraph") {
        return `<p class="mb-4 last:mb-0 leading-relaxed text-justify [text-align-last:left]">${parseAstToHtml(node.children || [])}</p>`;
      }
      if (node.type === "list") {
        const tag = node.listType === "ordered" ? "ol" : "ul";
        return `<${tag} class="list-disc pl-5 my-2">${parseAstToHtml(node.children || [])}</${tag}>`;
      }
      if (node.type === "list-item") {
        return `<li class="my-1 text-justify [text-align-last:left]">${parseAstToHtml(node.children || [])}</li>`;
      }
      return parseAstToHtml(node.children || []);
    })
    .join("");
}

function formatContent(text: string): string {
  if (!text) return "";

  // 1. If text is a Shopify Rich Text AST JSON string, parse AST to HTML
  if (text.trim().startsWith("{")) {
    try {
      const ast = JSON.parse(text);
      if (ast.type === "root" && Array.isArray(ast.children)) {
        return parseAstToHtml(ast.children);
      }
    } catch (e) {
      // Fallback
    }
  }

  // 2. Convert simple markdown links [Word](URL) -> <a href="URL">Word</a>
  let html = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary underline font-bold hover:opacity-80">$1</a>'
  );

  // Split double line breaks into paragraphs if not already wrapped in <p>
  if (!html.includes("<p>")) {
    html = html
      .split(/\n\n+/)
      .map((para) => `<p class="mb-4 last:mb-0 leading-relaxed">${para.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }

  return html;
}

export function ProductFinalThoughtsSection({
  settings,
  productName,
  className = "",
  productFinalThoughts,
  hideIfEmpty = false,
}: ProductFinalThoughtsSectionProps) {
  const fill = (template: string) => template.split("{product}").join(productName);

  const hasMetafield = Boolean(
    productFinalThoughts?.body?.trim() || productFinalThoughts?.heading?.trim()
  );

  if (hideIfEmpty && !hasMetafield) {
    return null;
  }

  const rawHeading =
    productFinalThoughts?.heading ||
    settings?.headingTemplate ||
    "FINAL THOUGHTS ON THE {product}";

  const rawBody =
    productFinalThoughts?.body ||
    settings?.bodyText ||
    (hideIfEmpty ? "" : `The ${productName} easily outperforms older hardware in everyday reliability, flavor output, and overall build quality. Whether you are an everyday vaper in Dubai or looking for a premium device with fast delivery across the UAE, this model sets the benchmark for satisfaction.\n\nIndependent user feedback and review tests show this model ranks among the top choices for taste variety, smooth draw, and sleek ergonomics. Engineered under strict quality standards to ensure total authenticity and complete peace of mind.\n\nReady to elevate your vaping experience? Order online today for express delivery across Dubai, Abu Dhabi, Sharjah, and the UAE!`);

  if (!rawBody && !productFinalThoughts?.heading) return null;

  const heading = fill(rawHeading);
  const formattedBody = formatContent(fill(rawBody));

  if (!formattedBody && !heading) return null;

  return (
    <section className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 ${className}`}>
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden transition-all duration-300">
        {/* Top subtle brand accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        {/* Header with left vertical accent bar */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 mb-6 sm:mb-8 pb-4 border-b border-border/40">
          <span className="w-1.5 h-7 sm:h-8 bg-primary rounded-full inline-block shrink-0 shadow-xs mt-0.5 sm:mt-0" />
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans font-body font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <span>{heading}</span>
            <MessageSquareText className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/80 shrink-0" />
          </h3>
        </div>

        {/* Content Body */}
        <div
          className="text-sm sm:text-base md:text-lg text-foreground/90 font-normal leading-relaxed space-y-4 [&_p]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:font-bold hover:[&_a]:opacity-80"
          dangerouslySetInnerHTML={{ __html: formattedBody }}
        />
      </div>
    </section>
  );
}
