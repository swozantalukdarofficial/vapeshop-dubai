"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

interface BulletPoint {
  text: string;
}

export interface JuulCustomFeatureSettings {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  bulletPoints?: BulletPoint[];
  reverseLayout?: boolean; // We can use this to alternate layouts if needed
}

export function JuulCustomFeatureSection({
  settings,
  className = "",
  reverseLayout = false,
}: {
  settings: JuulCustomFeatureSettings;
  className?: string;
  reverseLayout?: boolean;
}) {
  const {
    title = "JUUL Experience",
    description = "",
    buttonText = "",
    buttonLink = "",
    image = "",
    bulletPoints = [],
  } = settings || {};

  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-md">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverseLayout ? "lg:flex-row-reverse" : ""}`}>
          
          {/* Content Column */}
          <div className={`space-y-6 lg:space-y-8 ${reverseLayout ? "lg:order-2" : "lg:order-1"}`}>
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-foreground tracking-tight leading-tight">
                {title}
              </h2>
              {description && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {bulletPoints.length > 0 && (
              <ul className="space-y-4 pt-2">
                {bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1.5 rounded-full mt-0.5 shrink-0 border border-primary/20">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground leading-relaxed">
                      {point.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {buttonText && buttonLink && (
              <div className="pt-4">
                <Link
                  href={buttonLink}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-md shadow-primary/20"
                >
                  {buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Image Column */}
          <div className={`relative flex justify-center items-center ${reverseLayout ? "lg:order-1" : "lg:order-2"}`}>
            {image ? (
              <div className="relative z-10 w-full max-w-[400px] sm:max-w-[500px] aspect-square group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 -z-10" />
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full max-w-[400px] aspect-square bg-muted/50 rounded-3xl border border-dashed border-border/60 flex items-center justify-center text-muted-foreground text-sm font-medium">
                No image selected
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
