"use client";

import React from "react";
import dynamic from "next/dynamic";

import { shouldRenderInstance, type SectionContext } from "@/lib/theme/conditions";
import type { SectionInstance } from "@/lib/theme/types";

import { HeroSection, type HeroSettings } from "./HeroSection";
import {
  ContactDetailsSection,
  FeatureGridSection,
  PageHeaderSection,
  RichTextSection,
  type ContactDetailsSettings,
  type FeatureGridSettings,
  type PageHeaderSettings,
  type RichTextSettings,
} from "./PageBlocks";
import {
  ContactFormSection,
  type ContactFormSettings,
} from "./ContactFormSection";
import type { BrandsSettings } from "./AuthorizedDealers";
import type { CategoriesSettings } from "./Categories";
import type { FaqSettings } from "./FAQSection";
import type { WhatsAppSettings } from "./WhatsAppContactSection";
import type { WhyShopSettings } from "./WhyShopWithUs";
import type { BlogSettings } from "./BlogSection";

/**
 * Turns a stored section instance into rendered markup.
 *
 * Two kinds of section exist:
 *
 *  - **Registry sections** — self-contained, driven entirely by their saved
 *    settings. Rendered here.
 *  - **Slot sections** — need data the page owns (the product being viewed,
 *    the filtered collection, local UI state). The page passes them in via
 *    `slots`, pre-rendered; this module only decides *whether* and *where*
 *    they appear.
 *
 * That split is what lets the 1500-line collection and product pages take part
 * in the customizer without being rewritten.
 */

/* Below-fold sections are code-split, matching how the homepage loaded them
   before templates existed. */
const Categories = dynamic(() => import("./Categories").then((m) => ({ default: m.Categories })), { ssr: false });
const AuthorizedDealers = dynamic(() => import("./AuthorizedDealers").then((m) => ({ default: m.AuthorizedDealers })), { ssr: false });
const WhyShopWithUs = dynamic(() => import("./WhyShopWithUs").then((m) => ({ default: m.WhyShopWithUs })), { ssr: false });
const FAQSection = dynamic(() => import("./FAQSection").then((m) => ({ default: m.FAQSection })), { ssr: false });
const WhatsAppContactSection = dynamic(() => import("./WhatsAppContactSection").then((m) => ({ default: m.WhatsAppContactSection })), { ssr: false });
const BlogSection = dynamic(() => import("./BlogSection").then((m) => ({ default: m.BlogSection })), { ssr: false });
const FlavorsWheel = dynamic(() => import("./FlavorsWheel").then((m) => ({ default: m.FlavorsWheel })), { ssr: false });

/**
 * Sections the page renders itself, keyed by section type.
 *
 * A slot may be a plain node, or a function receiving that instance's saved
 * settings — the latter lets a page-owned section still be configured from the
 * customizer. `null` means "this template lists the section, but the page
 * renders it elsewhere" (the collection grid and product buy box).
 */
export type SectionSlot =
  | React.ReactNode
  | ((settings: Record<string, unknown>) => React.ReactNode);

export type SectionSlots = Record<string, SectionSlot>;

/** Standard page gutter shared by most sections. */
export const SECTION_CONTAINER =
  "max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 cv-auto";

/** Sections that lay out their own full-bleed container. */
const FULL_BLEED = new Set(["hero"]);

function renderRegistrySection(
  instance: SectionInstance
): React.ReactNode {
  const s = instance.settings;

  switch (instance.type) {
    case "hero":
      return <HeroSection settings={s as unknown as HeroSettings} />;
    case "categories":
      return <Categories settings={s as unknown as CategoriesSettings} />;
    case "brands":
      return <AuthorizedDealers settings={s as unknown as BrandsSettings} />;
    case "flavorsWheel":
      return <FlavorsWheel {...(s as any)} />;
    case "whyShop":
      return <WhyShopWithUs settings={s as unknown as WhyShopSettings} />;
    case "faq":
      return <FAQSection settings={s as unknown as FaqSettings} />;
    case "whatsapp":
      return <WhatsAppContactSection settings={s as unknown as WhatsAppSettings} />;
    case "blogPosts":
      return <BlogSection settings={s as unknown as BlogSettings} />;
    case "pageHeader":
      return <PageHeaderSection settings={s as unknown as PageHeaderSettings} />;
    case "richText":
      return <RichTextSection settings={s as unknown as RichTextSettings} />;
    case "featureGrid":
      return <FeatureGridSection settings={s as unknown as FeatureGridSettings} />;
    case "contactDetails":
      return <ContactDetailsSection settings={s as unknown as ContactDetailsSettings} />;
    case "contactForm":
      return <ContactFormSection settings={s as unknown as ContactFormSettings} />;
    default:
      return null;
  }
}

/**
 * Settings of the first instance of `type` in a resolved template.
 *
 * For sections a page renders inline rather than through a slot — the
 * collection grid and the product buy box — this is how the page reaches
 * their saved settings.
 */
export function instanceSettings(
  instances: SectionInstance[],
  type: string
): Record<string, unknown> {
  return instances.find((i) => i.type === type)?.settings ?? {};
}

export interface TemplateSectionsProps {
  instances: SectionInstance[];
  /** True for per-handle overrides, which bypass `showWhen` conditions. */
  isOverride: boolean;
  context: SectionContext;
  slots?: SectionSlots;
  /** Wrapper class for each section. Pass "" to opt out of the gutter. */
  containerClassName?: string;
}

/**
 * Renders a resolved template's sections in order.
 *
 * Each is tagged with `data-section-id` so the customizer can scroll the
 * preview to whatever the merchant is editing.
 */
export const TemplateSections: React.FC<TemplateSectionsProps> = ({
  instances,
  isOverride,
  context,
  slots = {},
  containerClassName = SECTION_CONTAINER,
}) => (
  <>
    {instances.map((instance) => {
      if (!instance.enabled) return null;
      if (!shouldRenderInstance(instance.showWhen, context, isOverride)) return null;

      // A slot wins over the registry: the page knows more about this section
      // than its stored settings do.
      const isSlot = instance.type in slots;
      const slot = slots[instance.type];
      const node = isSlot
        ? typeof slot === "function"
          ? slot(instance.settings)
          : slot
        : renderRegistrySection(instance);

      if (!node) return null;

      // Slots arrive with whatever layout their page wants; only
      // registry-rendered sections get the standard gutter.
      const useContainer =
        !isSlot && containerClassName && !FULL_BLEED.has(instance.type);

      return (
        <div key={instance.id} data-section-id={instance.id} className="scroll-mt-24">
          {useContainer ? <div className={containerClassName}>{node}</div> : node}
        </div>
      );
    })}
  </>
);
