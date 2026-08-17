import { SECTION_REGISTRY } from "./sections";
import type { SectionInstance, Template, ThemeSettings } from "./types";

export const THEME_VERSION = 2;

/**
 * Factory defaults.
 *
 * Every template below reproduces what the corresponding page rendered before
 * the customizer existed — including the handle-based rules, now carried as
 * `showWhen` conditions. A fresh install therefore looks identical, and
 * "Reset to defaults" restores exactly this.
 */

/** Build a section instance, seeding content from the registry defaults. */
function inst(
  id: string,
  type: string,
  extra: { showWhen?: string; settings?: Record<string, unknown>; enabled?: boolean } = {}
): SectionInstance {
  const def = SECTION_REGISTRY[type];
  if (!def) throw new Error(`Unknown section type in defaults: ${type}`);
  return {
    id,
    type,
    enabled: extra.enabled ?? true,
    ...(extra.showWhen ? { showWhen: extra.showWhen } : {}),
    settings: { ...structuredClone(def.defaults), ...(extra.settings ?? {}) },
  };
}

function template(
  t: Omit<Template, "instances" | "order"> & { sections: SectionInstance[] }
): Template {
  const { sections, ...rest } = t;
  return {
    ...rest,
    order: sections.map((s) => s.id),
    instances: Object.fromEntries(sections.map((s) => [s.id, s])),
  };
}

/* ── Static page bodies ───────────────────────────────────────────── */

const ABOUT_BODY = `Vape Shop Dubai is the UAE's trusted destination for 100% authentic vaping products. We supply JUUL, MYLE, disposable vapes, pod systems and premium e-liquids sourced directly from authorized regional distributors.

Every device and pod we sell carries a manufacturer security seal and a scannable verification code, so you always know exactly what you are buying.

- 2-hour express delivery across Dubai
- Same-day delivery to Abu Dhabi, Sharjah, Ajman and the wider UAE
- Cash and card accepted at your door
- Free replacement on any factory-defective unit`;

const SHIPPING_BODY = `We deliver across all seven Emirates, with express service in Dubai.

- Dubai: 2-hour express delivery on orders placed before 10:00 PM
- Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, UAQ: same-day or next-day express
- Free delivery on orders above 300 AED
- Cash on delivery and card machine on delivery both available

An ID check confirming you are 18 or older is mandatory at the time of delivery.`;

const PRIVACY_BODY = `We collect only the information needed to process and deliver your order: your name, delivery address, phone number and order history.

We never sell your personal data. Information is shared with delivery partners only to the extent required to complete your order.

You can request a copy of your data, or ask us to delete it, by contacting us at any time.`;

const TERMS_BODY = `By purchasing from Vape Shop Dubai you confirm that you are 18 years of age or older and that vaping products are legal in your area.

All products are sold as-is with manufacturer warranty where applicable. Factory-defective units are replaced free of charge when reported within 24 hours of delivery.

Prices are listed in AED and may change without notice. Orders are subject to stock availability.`;

/* ── Templates ────────────────────────────────────────────────────── */

function buildTemplates(): Record<string, Template> {
  return {
    /* ═══ Homepage ═══ */
    index: template({
      type: "index",
      label: "Homepage",
      previewPath: "/",
      sections: [
        inst("index-hero", "hero"),
        inst("index-categories", "categories"),
        inst("index-products", "productFeed"),
        inst("index-brands", "brands"),
        inst("index-whyshop", "whyShop"),
        inst("index-faq", "faq"),
        inst("index-whatsapp", "whatsapp"),
        inst("index-blog", "blogPosts"),
      ],
    }),

    /* ═══ Collection (default for every handle) ═══ */
    collection: template({
      type: "collection",
      label: "Collection pages",
      previewPath: "/collections/disposable-vape",
      sections: [
        inst("col-main", "collectionMain"),
        inst("col-disp-showcase", "disposableShowcase", {
          showWhen: "handleIncludesDisposable",
        }),
        inst("col-disp-compare", "disposableComparison", {
          showWhen: "handleIncludesDisposable",
        }),
        inst("col-ejuice", "ejuiceShowcase", { showWhen: "handleIsEJuice" }),
        inst("col-juul-flavors", "juulSignatureFlavors", {
          showWhen: "handleIncludesJuul",
        }),
        inst("col-juul-packaging", "juulPackagingCompare", {
          showWhen: "handleIsJuul1",
        }),
        inst("col-juul-specs", "juulTechSpecs", { showWhen: "handleIncludesJuul" }),
        inst("col-bottom-grid", "bottomCollectionGrid", {
          showWhen: "notBrandDirectory",
        }),
        inst("col-juul-app", "juulAppIntegration", { showWhen: "handleIsJuul2" }),
        inst("col-myle-verify", "myleVerification", { showWhen: "handleIncludesMyle" }),
        inst("col-whyshop", "whyShop"),
        inst("col-faq", "faq"),
        inst("col-reviews", "customerReviews"),
        inst("col-brands", "brands", { showWhen: "notBrandDirectory" }),
        inst("col-whatsapp", "whatsapp"),
      ],
    }),

    /* ═══ Product (default for every handle) ═══ */
    product: template({
      type: "product",
      label: "Product pages",
      previewPath: "/product/",
      sections: [
        inst("prod-main", "productMain"),
        inst("prod-juul-menthol", "juulCrispMenthol", { showWhen: "productIsJuul" }),
        inst("prod-why-choose", "whyChooseProduct", { showWhen: "productIsNotJuul" }),
        inst("prod-key-specs", "productKeySpecs", { showWhen: "productIsGeneric" }),
        inst("prod-flavors", "productFlavors"),
        inst("prod-reviews", "customerReviews"),
        inst("prod-whatsapp", "whatsapp"),
        inst("prod-related", "relatedProducts", { showWhen: "hasRelatedProducts" }),
      ],
    }),

    /* ═══ Static pages ═══ */
    "page:about-us": template({
      type: "page",
      label: "About Us",
      handle: "about-us",
      previewPath: "/about-us",
      sections: [
        inst("about-header", "pageHeader", {
          settings: {
            eyebrow: "Our Story",
            heading: "About Vape Shop Dubai",
            subheading:
              "Dubai's trusted source for authentic vaping products, delivered in hours.",
            centered: true,
          },
        }),
        inst("about-body", "richText", {
          settings: { heading: "", body: ABOUT_BODY, width: "narrow" },
        }),
        inst("about-whyshop", "whyShop"),
        inst("about-whatsapp", "whatsapp"),
      ],
    }),

    "page:contact": template({
      type: "page",
      label: "Contact",
      handle: "contact",
      previewPath: "/contact",
      sections: [
        inst("contact-header", "pageHeader", {
          settings: {
            eyebrow: "Get in Touch",
            heading: "Contact Vape Shop Dubai",
            subheading: "We reply on WhatsApp in under two minutes, around the clock.",
            centered: true,
          },
        }),
        inst("contact-form", "contactForm"),
        inst("contact-details", "contactDetails"),
        inst("contact-whatsapp", "whatsapp"),
        inst("contact-faq", "faq"),
      ],
    }),

    "page:shipping-delivery": template({
      type: "page",
      label: "Shipping & Delivery",
      handle: "shipping-delivery",
      previewPath: "/shipping-delivery",
      sections: [
        inst("ship-header", "pageHeader", {
          settings: {
            eyebrow: "Delivery",
            heading: "Shipping & Delivery",
            subheading: "Express delivery across Dubai and the UAE.",
            centered: true,
          },
        }),
        inst("ship-body", "richText", {
          settings: { heading: "", body: SHIPPING_BODY, width: "narrow" },
        }),
        inst("ship-whatsapp", "whatsapp"),
      ],
    }),

    "page:privacy-policy": template({
      type: "page",
      label: "Privacy Policy",
      handle: "privacy-policy",
      previewPath: "/privacy-policy",
      sections: [
        inst("privacy-header", "pageHeader", {
          settings: {
            eyebrow: "Legal",
            heading: "Privacy Policy",
            subheading: "How we handle your personal information.",
            centered: true,
          },
        }),
        inst("privacy-body", "richText", {
          settings: { heading: "", body: PRIVACY_BODY, width: "narrow" },
        }),
      ],
    }),

    "page:terms-conditions": template({
      type: "page",
      label: "Terms & Conditions",
      handle: "terms-conditions",
      previewPath: "/terms-conditions",
      sections: [
        inst("terms-header", "pageHeader", {
          settings: {
            eyebrow: "Legal",
            heading: "Terms & Conditions",
            subheading: "The rules that apply when you buy from us.",
            centered: true,
          },
        }),
        inst("terms-body", "richText", {
          settings: { heading: "", body: TERMS_BODY, width: "narrow" },
        }),
      ],
    }),
  };
}

/* ── Header & footer ──────────────────────────────────────────────── */

const DEFAULT_HEADER: ThemeSettings["header"] = {
  announcementEnabled: true,
  announcementText:
    "🚀 FREE DELIVERY ON ORDERS 300AED+  |  ⚡ SAME DAY DELIVERY  |  💳 COD & CREDIT CARD MACHINE ON DELIVERY",
  logoText: "VAPE SHOP",
  logoSubText: "DUBAI",
  menu: [
    { label: "HOME", href: "/", children: [] },
    { label: "SHOP", href: "/shop", children: [] },
    {
      label: "JUUL",
      href: "/collections/juul-vape-dubai",
      children: [
        { label: "JUUL 1 Series", href: "/collections/juul-1-series" },
        { label: "JUUL 2 Series", href: "/collections/juul-2-series" },
        { label: "JUUL Pods", href: "/collections/juul-pods-offers" },
      ],
    },
    {
      label: "MYLE",
      href: "/collections/myle-vape-dubai",
      children: [
        { label: "Myle v5 Pods", href: "/collections/myle-v5-pods" },
        { label: "Myle v5 Device", href: "/collections/myle-v5-device" },
        { label: "Myle Disposable", href: "/collections/myle-disposable" },
      ],
    },
    {
      label: "DISPOSABLE",
      href: "/collections/disposable-vape",
      children: [
        { label: "Al Fakher Vape", href: "/collections/al-fakher-vape" },
        { label: "Elf Bar Vape", href: "/collections/elf-bar-vape" },
        { label: "Fummo Vape", href: "/collections/fummo-vape" },
        { label: "Pod Salt Vape", href: "/collections/pod-salt-vape" },
        { label: "Vapes Bars", href: "/collections/vapes-bars" },
        { label: "Vozol Vape", href: "/collections/vozol-vape" },
        { label: "Tugboat Vape", href: "/collections/tugboat-vape" },
        { label: "HQD Vape", href: "/collections/hqd-vape" },
        { label: "Lost Mary", href: "/collections/lost-mary-disposable" },
        { label: "Maskking Vape", href: "/collections/maskking-vape" },
        { label: "Geek Bar", href: "/collections/geek-bar-disposable" },
        { label: "Yuoto Vape", href: "/collections/yuoto-vape" },
        { label: "Relx Vape", href: "/collections/relx-vape" },
        { label: "Nerd Vape", href: "/collections/nerd-vape" },
        { label: "Vgod Stig", href: "/collections/vgod-stig" },
        { label: "Silvaper Vape", href: "/collections/silvaper-vape" },
      ],
    },
    {
      label: "E-JUICE",
      href: "/collections/vape-e-juice",
      children: [
        { label: "Salt Nicotine", href: "/collections/salt-nicotine" },
        { label: "Freebase e-liquid", href: "/collections/freebase-e-liquid" },
      ],
    },
    {
      label: "POD SYSTEM",
      href: "/collections/pod-system",
      children: [
        { label: "Pod Kit", href: "/collections/pod-kit" },
        { label: "Pod Cartridge", href: "/collections/pod-cartridge" },
        { label: "Vape Coils", href: "/collections/vape-coils" },
      ],
    },
    {
      label: "BRAND",
      href: "/collections/brand",
      children: [
        { label: "Oxva Vape", href: "/collections/oxva-vape" },
        { label: "Uwell Vape", href: "/collections/uwell-vape" },
        { label: "Vaporesso Vape", href: "/collections/vaporesso-vape" },
        { label: "Smok Vape", href: "/collections/smok-vape" },
        { label: "Geek Vape", href: "/collections/geek-vape" },
        { label: "Voopoo Vape", href: "/collections/voopoo-vape" },
      ],
    },
    { label: "BLOG", href: "/blog", children: [] },
  ],
};

const DEFAULT_FOOTER: ThemeSettings["footer"] = {
  trustItems: [
    { icon: "Truck", title: "1-2 Hr Express Delivery", subtitle: "Dubai, Sharjah & Ajman" },
    { icon: "ShieldCheck", title: "100% Authentic UAE", subtitle: "Scratch-code verified" },
    { icon: "CreditCard", title: "Cash & Card on Delivery", subtitle: "Pay at your doorstep" },
    { icon: "Clock", title: "24/7 Instant Dispatch", subtitle: "365 days non-stop service" },
  ],
  description:
    "Dubai's leading online vape store. Authorized retailer of 100% authentic JUUL pods, MYLE devices, high-puff disposable vapes, and premium nicotine salts with 1–2 hour delivery across UAE.",
  whatsappLabel: "WhatsApp Order",
  whatsappNumber: "971582839787",
  ratingText: "4.9 / 5.0",
  columns: [
    {
      heading: "Shop Categories",
      links: [
        { label: "Disposable Vapes", href: "/collections/disposables" },
        { label: "JUUL 2 & JUUL Pods", href: "/collections/juul" },
        { label: "MYLE V5 & Pod Kits", href: "/collections/myle" },
        { label: "E-Liquids & Nic Salts", href: "/collections/e-liquids" },
        { label: "Pod Systems & Coils", href: "/collections/accessories" },
      ],
    },
    {
      heading: "Top Brands",
      links: [
        { label: "Tugboat Vape Dubai", href: "/collections/disposables?brand=Tugboat" },
        { label: "Elf Bar & Lost Mary", href: "/collections/disposables?brand=Elf+Bar" },
        { label: "Al Fakher Crown Bar", href: "/collections/disposables?brand=Al+Fakher" },
        { label: "JUUL Dubai UAE", href: "/collections/juul" },
        { label: "MYLE Dubai Official", href: "/collections/myle" },
      ],
    },
  ],
  contactHeading: "Store & Support",
  addressLabel: "Dubai Dispatch Center",
  address: "International City, Dubai, UAE",
  phone: "+971 58 283 9787",
  email: "vapshopdubai@gmail.com",
  hoursNote: "24/7 Delivery & Support across Dubai",
  healthWarning:
    "UAE 21+ ONLY: Products contain nicotine, an addictive chemical. For adult smokers (21+) in the UAE. Keep out of reach of children and pets.",
  paymentBadges: [
    { icon: "CreditCard", label: "Cash / Card on Delivery" },
    { icon: "Link2", label: "Link Pay Accepted" },
    { icon: "Award", label: "Licensed UAE" },
  ],
  copyright: "© 2026 Vape Shop Dubai. All rights reserved.",
  poweredByLabel: "Webestone",
  poweredByHref: "https://webestone.com",
  bottomLinks: [
    { label: "Terms", href: "/terms-conditions" },
    { label: "Privacy", href: "/privacy-policy" },
    { label: "Shipping", href: "/shipping-delivery" },
  ],
};

export function createDefaultSettings(): ThemeSettings {
  return {
    version: THEME_VERSION,
    header: structuredClone(DEFAULT_HEADER),
    footer: structuredClone(DEFAULT_FOOTER),
    templates: buildTemplates(),
  };
}

/** Convenience singleton for read-only use (render fallbacks, tests). */
export const DEFAULT_THEME_SETTINGS: ThemeSettings = createDefaultSettings();
