"use client";

import React from "react";
import { Check } from "lucide-react";

export interface JuulPoint {
  /** Highlighted lead-in, shown in primary colour. */
  lead: string;
  /** Remainder of the line. */
  text: string;
}

export interface JuulIngredient {
  title: string;
  description: string;
}

export interface JuulCrispMentholSettings {
  /** `{product}` is replaced with the product name. */
  headingTemplate: string;
  bodyTemplate: string;
  points: JuulPoint[];
  image: string;
  showIngredients: boolean;
  ingredientsHeadingTemplate: string;
  ingredientsBodyTemplate: string;
  ingredients: JuulIngredient[];
  ingredientsImage: string;
}

/** Where each of the first six points is pinned around the product image. */
const DIAGRAM_POSITIONS = [
  { className: "top-0 left-0", align: "left" },
  { className: "top-1/2 -translate-y-1/2 -left-4", align: "left" },
  { className: "bottom-0 left-0", align: "left" },
  { className: "top-0 right-0", align: "right" },
  { className: "top-1/2 -translate-y-1/2 -right-4", align: "right" },
  { className: "bottom-0 right-0", align: "right" },
] as const;

export function JuulCrispMentholSections({
  productName = "JUUL 2 Pods",
  settings,
}: {
  productName?: string;
  settings?: JuulCrispMentholSettings;
}) {
  const fill = (template: string) =>
    (template ?? "").split("{product}").join(productName);

  const heading = fill(settings?.headingTemplate || "Why Choose {product}");
  const body = fill(settings?.bodyTemplate ?? "");
  const points = settings?.points ?? [];
  const image = settings?.image || "/juul_menthol_pack.png";

  const showIngredients = settings?.showIngredients !== false;
  const ingredientsHeading = fill(
    settings?.ingredientsHeadingTemplate || "{product} Ingredients"
  );
  const ingredientsBody = fill(settings?.ingredientsBodyTemplate ?? "");
  const ingredients = settings?.ingredients ?? [];
  const ingredientsImage = settings?.ingredientsImage || "/juul_menthol_pod.png";

  // Only the first six points fit around the image; the list below shows all
  // of them, so a seventh point is copy rather than a dropped setting.
  const diagramPoints = points.slice(0, DIAGRAM_POSITIONS.length);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-12 sm:space-y-16">
      {/* Section 1: Why Choose */}
      <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-12 shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left Text */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-foreground leading-none">
              {heading}
            </h2>
            {body && (
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {body}
              </p>
            )}
            {points.length > 0 && (
              <ul className="space-y-3 pt-2">
                {points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1 rounded-full mt-0.5 shrink-0 border border-primary/20">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {[point.lead, point.text].filter(Boolean).join(" ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right Diagram Card */}
          <div className="bg-white border-2 border-zinc-100 rounded-[2rem] p-6 sm:p-8 shadow-xl relative min-h-[500px] flex flex-col justify-center">
            <h3 className="text-center text-sm font-black tracking-widest uppercase mb-12 text-zinc-800">
              {heading}
            </h3>
            <div className="relative flex justify-center items-center h-[350px]">
              {/* Center Image */}
              <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 group">
                <img
                  src={image}
                  alt={productName}
                  className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Floating Diagram Labels */}
              {diagramPoints.map((point, idx) => {
                const position = DIAGRAM_POSITIONS[idx];
                return (
                  <div
                    key={idx}
                    className={`absolute ${position.className} bg-white/95 p-2.5 rounded-xl text-[10px] w-36 border border-zinc-200 shadow-sm leading-snug z-20 transition-all hover:border-primary/50 ${
                      position.align === "right" ? "text-right" : ""
                    }`}
                  >
                    <strong className="text-primary">{point.lead}</strong>{" "}
                    <span className="text-zinc-600">{point.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Ingredients */}
      {showIngredients && (
        <div className="bg-card border border-border/60 rounded-[2.5rem] p-6 sm:p-12 shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left Text */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-foreground leading-none">
                {ingredientsHeading}
              </h2>
              {ingredientsBody && (
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {ingredientsBody}
                </p>
              )}
              {ingredients.length > 0 && (
                <ul className="space-y-4 pt-2">
                  {ingredients.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-1.5 rounded-full mt-0.5 shrink-0 border border-primary/20">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <strong className="text-sm text-foreground block font-black">
                          {item.title}
                        </strong>
                        <span className="text-[13px] font-medium text-muted-foreground mt-0.5 block leading-relaxed">
                          {item.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right Diagram Card */}
            <div className="bg-white border-2 border-zinc-100 rounded-[2rem] p-6 sm:p-8 shadow-xl relative min-h-[500px] flex flex-col justify-center">
              <h3 className="text-center text-sm font-black tracking-widest uppercase mb-12 text-zinc-800">
                {ingredientsHeading}
              </h3>
              <div className="relative flex justify-center items-center h-[350px]">
                {/* Center Image */}
                <div className="relative z-10 w-32 h-48 sm:w-40 sm:h-56 group">
                  <img
                    src={ingredientsImage}
                    alt={productName}
                    className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* The four corners mirror the ingredient list beside them. */}
                {ingredients.slice(0, 4).map((item, idx) => {
                  const corner = [
                    "top-10 left-0",
                    "bottom-10 left-0",
                    "top-10 right-0",
                    "bottom-10 right-0",
                  ][idx];
                  const isRight = idx >= 2;
                  return (
                    <div
                      key={idx}
                      className={`absolute ${corner} bg-white/95 p-3 rounded-xl text-[10px] sm:text-xs w-40 border border-zinc-200 shadow-sm leading-snug z-20 transition-all hover:border-primary/50 ${
                        isRight ? "text-right" : ""
                      }`}
                    >
                      <strong className="text-primary block mb-1 uppercase">{item.title}</strong>
                      <span className="text-[9px] sm:text-[10px] text-zinc-600 font-medium">
                        {item.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
