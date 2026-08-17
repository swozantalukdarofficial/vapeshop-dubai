/**
 * Theme settings — Shopify's model, adapted to this headless storefront.
 *
 *   header / footer   shared "section groups" rendered on every page
 *   templates         one entry per page type, each an ordered list of
 *                     section *instances* with their own content
 *
 * A section instance is a placement: the FAQ on the homepage and the FAQ on a
 * collection page are two instances of the `faq` type with independent copy.
 * That's what lets the same section say different things in different places.
 *
 * Template keys
 * -------------
 *   index                      the homepage
 *   collection                 default for every /collections/[handle]
 *   collection:juul-1-series   override for one handle, falls back to above
 *   product                    default for every /product/[handle]
 *   product:<handle>           override for one product
 *   page:about-us              a static page
 *
 * Resolution is "most specific wins" — see `resolveTemplateKey()`.
 */

export type TemplateType = "index" | "collection" | "product" | "page";

/** A single placement of a section within a template. */
export interface SectionInstance {
  id: string;
  /** Key into the section registry — see `sections.ts`. */
  type: string;
  enabled: boolean;
  /**
   * Named predicate from `conditions.ts` gating this instance — how the
   * storefront's original "JUUL sections only on JUUL pages" rules are
   * expressed as data.
   *
   * Only honoured on *default* templates. A per-handle override is an explicit
   * statement of intent, so every enabled instance in one renders
   * unconditionally.
   */
  showWhen?: string;
  /** Content for this placement only. Shape is defined by the section's schema. */
  settings: Record<string, unknown>;
}

export interface Template {
  type: TemplateType;
  /** Shown in the customizer's template picker. */
  label: string;
  /** Set on per-handle overrides; absent on defaults. */
  handle?: string;
  /** URL the customizer previews this template at. */
  previewPath: string;
  /** Instance ids, in render order. */
  order: string[];
  instances: Record<string, SectionInstance>;
}

/* ── Shared section groups ────────────────────────────────────────── */

export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children: NavSubItem[];
}

export interface HeaderSettings {
  announcementEnabled: boolean;
  announcementText: string;
  logoText: string;
  logoSubText: string;
  menu: NavItem[];
}

export interface FooterTrustItem {
  icon: string;
  title: string;
  subtitle: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface FooterSettings {
  trustItems: FooterTrustItem[];
  description: string;
  whatsappLabel: string;
  whatsappNumber: string;
  ratingText: string;
  columns: FooterColumn[];
  contactHeading: string;
  addressLabel: string;
  address: string;
  phone: string;
  email: string;
  hoursNote: string;
  healthWarning: string;
  paymentBadges: { icon: string; label: string }[];
  copyright: string;
  poweredByLabel: string;
  poweredByHref: string;
  bottomLinks: FooterLink[];
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface ThemeSettings {
  version: number;
  header: HeaderSettings;
  footer: FooterSettings;
  templates: Record<string, Template>;
}

export interface ThemeSettingsRecord {
  settings: ThemeSettings;
  updatedAt: string;
  updatedBy: string | null;
}

/* ── Template key helpers ─────────────────────────────────────────── */

export const TEMPLATE_KEYS = {
  index: "index",
  collection: "collection",
  product: "product",
} as const;

export function collectionKey(handle: string): string {
  return `collection:${handle}`;
}

export function productKey(handle: string): string {
  return `product:${handle}`;
}

export function pageKey(slug: string): string {
  return `page:${slug}`;
}

/**
 * Pick the template a page should render with: a handle-specific override if
 * the merchant created one, otherwise the type default.
 */
export function resolveTemplateKey(
  templates: Record<string, Template>,
  type: TemplateType,
  handle?: string
): string {
  if (handle) {
    const specific = `${type}:${handle}`;
    if (templates[specific]) return specific;
  }
  return type;
}

/** Split `"collection:juul-1-series"` into its parts. */
export function parseTemplateKey(key: string): {
  type: TemplateType;
  handle?: string;
} {
  const [type, ...rest] = key.split(":");
  return {
    type: type as TemplateType,
    handle: rest.length ? rest.join(":") : undefined,
  };
}
