/**
 * Theme settings — the shape of everything a merchant can edit from /admin.
 *
 * This mirrors Shopify's theme settings model: a tree of sections, each with
 * an `enabled` flag plus its own fields, and a top-level `sectionOrder` that
 * controls how the homepage is assembled.
 *
 * When you add a field here, also add it to `defaults.ts` (so existing saved
 * settings keep working) and to `schema.ts` (so it shows up in the admin UI).
 */

export type SectionId =
  | "hero"
  | "categories"
  | "products"
  | "brands"
  | "whyShop"
  | "faq"
  | "whatsapp"
  | "blog";

/* ── Hero ─────────────────────────────────────────────────────────── */

export interface HeroSlide {
  title: string;
  accent: string;
  description: string;
  image: string;
  fallbackImage: string;
  tag: string;
  buttonText: string;
  ctaHref: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
}

export interface HeroPromoCard {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  href: string;
  image: string;
  /** `light` = white card with orange CTA, `primary` = solid orange card. */
  style: "light" | "primary";
}

export interface HeroSettings {
  enabled: boolean;
  autoplaySeconds: number;
  slides: HeroSlide[];
  promoCards: HeroPromoCard[];
}

/* ── Categories ───────────────────────────────────────────────────── */

export interface CategoryItem {
  label: string;
  image: string;
  href: string;
}

export interface CategoriesSettings {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  seeAllLabel: string;
  seeAllHref: string;
  items: CategoryItem[];
}

/* ── Product feed ─────────────────────────────────────────────────── */

export interface ProductsSettings {
  enabled: boolean;
}

/* ── Brands ───────────────────────────────────────────────────────── */

export interface BrandItem {
  name: string;
  image: string;
  href: string;
}

export interface BrandsSettings {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  seeAllLabel: string;
  seeAllHref: string;
  showFlavorWheel: boolean;
  items: BrandItem[];
}

/* ── Why shop with us ─────────────────────────────────────────────── */

export interface ValuePillarItem {
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
}

export interface WhyShopSettings {
  enabled: boolean;
  badgeText: string;
  headingLead: string;
  headingHighlight: string;
  description: string;
  pillTitle: string;
  pillSubtitle: string;
  footerNote: string;
  pillars: ValuePillarItem[];
}

/* ── FAQ ──────────────────────────────────────────────────────────── */

export type FaqCategory = "delivery" | "authenticity" | "payment" | "products";

export interface FaqItem {
  question: string;
  answer: string;
  category: FaqCategory;
}

export interface FaqSettings {
  enabled: boolean;
  badgeText: string;
  heading: string;
  description: string;
  deliveryBadge: string;
  searchPlaceholder: string;
  verifiedNote: string;
  items: FaqItem[];
}

/* ── WhatsApp CTA ─────────────────────────────────────────────────── */

export interface WhatsAppFeature {
  icon: string;
  label: string;
}

export interface WhatsAppSettings {
  enabled: boolean;
  badgeText: string;
  responseNote: string;
  heading: string;
  description: string;
  features: WhatsAppFeature[];
  contactLabel: string;
  /** Digits only, international format without `+` — e.g. `971582839787`. */
  phoneNumber: string;
  phoneDisplay: string;
  prefilledMessage: string;
  buttonText: string;
}

/* ── Blog ─────────────────────────────────────────────────────────── */

export interface BlogSettings {
  enabled: boolean;
  badgeText: string;
  heading: string;
  description: string;
  viewAllLabel: string;
  viewAllHref: string;
  postCount: number;
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface ThemeSections {
  hero: HeroSettings;
  categories: CategoriesSettings;
  products: ProductsSettings;
  brands: BrandsSettings;
  whyShop: WhyShopSettings;
  faq: FaqSettings;
  whatsapp: WhatsAppSettings;
  blog: BlogSettings;
}

export interface ThemeSettings {
  /** Bumped when the schema changes shape in a non-additive way. */
  version: number;
  sectionOrder: SectionId[];
  sections: ThemeSections;
}

/** Metadata written alongside the settings so the admin can show save state. */
export interface ThemeSettingsRecord {
  settings: ThemeSettings;
  updatedAt: string;
  updatedBy: string | null;
}
