import type { FieldDef } from "./field-types";
import type { TemplateType } from "./types";

/**
 * The section catalogue.
 *
 * Every entry is one section type a merchant can place on a template: what
 * it's called, which templates accept it, what fields it exposes, and the
 * content a fresh instance starts with.
 *
 * This file is data only — no React — so route handlers and the settings
 * normaliser can import it without pulling in the storefront bundle. The
 * type → component mapping lives in `components/sections/SectionRenderer.tsx`.
 *
 * ── Adding fields to a section ──────────────────────────────────────
 * Extend `fields` and add matching keys to `defaults`. Existing saved
 * instances inherit the new defaults automatically (see `normalize.ts`), and
 * the admin form picks the field up with no UI work.
 */
export interface SectionDef {
  type: string;
  label: string;
  description: string;
  /** Template types this section may be added to. */
  templates: TemplateType[];
  /** Part of the page's core purpose — cannot be removed or hidden. */
  required?: boolean;
  /**
   * Content lives inside the component rather than in settings. These can be
   * reordered, hidden and placed per template, but expose few or no fields
   * until someone extends the schema.
   */
  contentInCode?: boolean;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}

/* ── Shared field fragments ───────────────────────────────────────── */

const headingFields = (): FieldDef[] => [
  { type: "text", key: "eyebrow", label: "Eyebrow" },
  { type: "text", key: "heading", label: "Heading" },
];

/* ── Registry ─────────────────────────────────────────────────────── */

export const SECTION_REGISTRY: Record<string, SectionDef> = {
  /* ═══════════ Homepage-oriented ═══════════ */

  hero: {
    type: "hero",
    label: "Hero Slider",
    description: "Full-width carousel with promo cards beside it.",
    templates: ["index", "page"],
    fields: [
      {
        type: "number",
        key: "autoplaySeconds",
        label: "Autoplay interval",
        min: 2,
        max: 30,
        step: 1,
        suffix: "sec",
        help: "How long each slide stays before advancing.",
      },
      {
        type: "repeater",
        key: "slides",
        label: "Slides",
        itemNoun: "slide",
        itemLabelKey: "title",
        min: 1,
        max: 8,
        defaultItem: {
          title: "New Slide",
          accent: "Category",
          description: "",
          image: "",
          fallbackImage: "/hero_vape.png",
          tag: "New",
          buttonText: "Shop Now",
          ctaHref: "/shop",
          stat1Value: "",
          stat1Label: "",
          stat2Value: "",
          stat2Label: "",
        },
        fields: [
          { type: "text", key: "accent", label: "Eyebrow / accent line" },
          {
            type: "text",
            key: "title",
            label: "Headline",
            help: "An & in the headline is highlighted in the brand colour.",
          },
          { type: "textarea", key: "description", label: "Description", rows: 3 },
          { type: "text", key: "tag", label: "Badge pill" },
          { type: "image", key: "image", label: "Product image" },
          {
            type: "image",
            key: "fallbackImage",
            label: "Fallback image",
            help: "Used if the main image fails to load.",
          },
          { type: "text", key: "buttonText", label: "Button label" },
          { type: "link", key: "ctaHref", label: "Button link", placeholder: "/collections/..." },
          { type: "text", key: "stat1Value", label: "Stat 1 — value" },
          { type: "text", key: "stat1Label", label: "Stat 1 — label" },
          { type: "text", key: "stat2Value", label: "Stat 2 — value" },
          { type: "text", key: "stat2Label", label: "Stat 2 — label" },
        ],
      },
      {
        type: "repeater",
        key: "promoCards",
        label: "Promo cards",
        itemNoun: "card",
        itemLabelKey: "title",
        max: 3,
        defaultItem: {
          eyebrow: "Collection",
          title: "New Promo Card",
          subtitle: "",
          buttonText: "Shop Now",
          href: "/shop",
          image: "",
          style: "light",
        },
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow" },
          { type: "text", key: "title", label: "Title" },
          { type: "text", key: "subtitle", label: "Subtitle" },
          { type: "text", key: "buttonText", label: "Button label" },
          { type: "link", key: "href", label: "Link", placeholder: "/collections/..." },
          { type: "image", key: "image", label: "Image" },
          {
            type: "select",
            key: "style",
            label: "Card style",
            options: [
              { label: "Light card", value: "light" },
              { label: "Solid brand colour", value: "primary" },
            ],
          },
        ],
      },
    ],
    defaults: {
      autoplaySeconds: 6,
      slides: [
        {
          title: "MYLE Devices & Pods",
          accent: "Premium Pod Systems",
          description:
            "Experience the ultimate in convenience and satisfaction. Official MYLE V5, V4, and Meta systems. Bold flavor profiles, smooth nicotine delivery, and long-lasting battery life.",
          image:
            "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/myle_slider.webp?v=1786640992",
          fallbackImage: "/Slider/myle_slider.webp",
          tag: "🔥 Premium Pod Systems",
          buttonText: "Shop MYLE Collection",
          ctaHref: "/collections/myle-vape-dubai",
          stat1Value: "5%",
          stat1Label: "Nicotine Strength",
          stat2Value: "V5",
          stat2Label: "Latest Series",
        },
        {
          title: "Disposable Vapes",
          accent: "Premium Disposables",
          description:
            "Lost Mary, Al Fakher Crown Bar, Tugboat, BECO, and more. Up to 15,000 puffs. From 40 AED. Cash on delivery available with instant delivery across Dubai.",
          image:
            "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/disposable_slider.webp?v=1786640994",
          fallbackImage: "/Slider/disposable_slider.webp",
          tag: "💰 From 40 AED Only",
          buttonText: "Shop Disposables",
          ctaHref: "/collections/disposable-vape",
          stat1Value: "15K",
          stat1Label: "Max Puffs",
          stat2Value: "40",
          stat2Label: "AED Starting",
        },
        {
          title: "Pod Systems & Kits",
          accent: "Vape Devices & Pods",
          description:
            "Refillable and pre-filled pod kits from top brands like Uwell, Geekvape, Vaporesso, OXVA, Voopoo. Compact, powerful, and designed for daily use.",
          image:
            "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/pod_kits_slider.webp?v=1786640996",
          fallbackImage: "/Slider/pod_kits_slider.webp",
          tag: "⚡ High Performance Kits",
          buttonText: "Shop Pod Systems",
          ctaHref: "/collections/pod-system",
          stat1Value: "100%",
          stat1Label: "Authentic",
          stat2Value: "Top",
          stat2Label: "Global Brands",
        },
        {
          title: "Premium E-Liquids & Salts",
          accent: "Nicotine Salts & Freebase",
          description:
            "Nasty Juice, Pod Salt, Tokyo, RufPuf, and more. 0mg to 50mg nicotine options. Over 80 premium flavors in stock with same-day 2-hour delivery.",
          image:
            "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/e_liquid_slider.webp?v=1786640998",
          fallbackImage: "/Slider/e_liquid_slider.webp",
          tag: "⭐ 80+ Flavors Available",
          buttonText: "Shop E-Liquids",
          ctaHref: "/collections/vape-e-juice",
          stat1Value: "80+",
          stat1Label: "Flavors",
          stat2Value: "0-50mg",
          stat2Label: "Nicotine Range",
        },
      ],
      promoCards: [
        {
          eyebrow: "JUUL 1 Series",
          title: "JUUL 1 Devices & Pods",
          subtitle: "Original USA Stock · 3% & 5% Nic",
          buttonText: "Shop JUUL 1",
          href: "/collections/juul-1-series",
          image:
            "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/juul_1_slider.webp?v=1786641000",
          style: "light",
        },
        {
          eyebrow: "JUUL 2 Series",
          title: "JUUL 2 Devices & Pods",
          subtitle: "Authentic UK Stock · 18mg Nic",
          buttonText: "Shop JUUL 2",
          href: "/collections/juul-2-series",
          image:
            "https://cdn.shopify.com/s/files/1/0684/3488/6727/files/juul_2_slider.webp?v=1786641001",
          style: "primary",
        },
      ],
    },
  },

  categories: {
    type: "categories",
    label: "Category Tiles",
    description: "Grid of category shortcuts.",
    templates: ["index", "collection", "page"],
    fields: [
      ...headingFields(),
      { type: "text", key: "seeAllLabel", label: "'See all' button label" },
      { type: "link", key: "seeAllHref", label: "'See all' link" },
      {
        type: "repeater",
        key: "items",
        label: "Category tiles",
        itemNoun: "category",
        itemLabelKey: "label",
        max: 40,
        defaultItem: { label: "New Category", image: "/vape_kit.png", href: "/collections/" },
        fields: [
          { type: "text", key: "label", label: "Label" },
          { type: "image", key: "image", label: "Icon image" },
          { type: "link", key: "href", label: "Link", placeholder: "/collections/..." },
        ],
      },
    ],
    defaults: {
      eyebrow: "Browse Directory",
      heading: "Shop by Categories",
      seeAllLabel: "SEE ALL",
      seeAllHref: "/shop",
      items: [
        { label: "JUUL 1 Series", image: "/juul_device.png", href: "/collections/juul-1-series" },
        { label: "JUUL 2 Series", image: "/juul_device.png", href: "/collections/juul-2-series" },
        { label: "JUUL Pods", image: "/juul_device.png", href: "/collections/juul-pods-offers" },
        { label: "Myle v5 Pods", image: "/vape_kit.png", href: "/collections/myle-v5-pods" },
        { label: "Myle v5 Kits", image: "/vape_kit.png", href: "/collections/myle-v5-device" },
        { label: "Myle Disposables", image: "/vape_kit.png", href: "/collections/myle-disposable" },
        { label: "Disposables", image: "/lost_mary.png", href: "/collections/disposable-vape" },
        { label: "Salt Nicotine", image: "/premium_liquid.png", href: "/collections/salt-nicotine" },
        { label: "Freebase Nic", image: "/premium_liquid.png", href: "/collections/freebase-e-liquid" },
        { label: "Pod Kits", image: "/vape_kit.png", href: "/collections/pod-kit" },
        { label: "Cartridges", image: "/vape_kit.png", href: "/collections/pod-cartridge" },
        { label: "Vape Coils", image: "/vape_kit.png", href: "/collections/vape-coils" },
        { label: "Uwell", image: "/vape_kit.png", href: "/collections/uwell-vape" },
        { label: "Vaporesso", image: "/vape_kit.png", href: "/collections/vaporesso-vape" },
        { label: "Geekvape", image: "/vape_kit.png", href: "/collections/geek-vape" },
        { label: "OXVA", image: "/vape_kit.png", href: "/collections/oxva-vape" },
      ],
    },
  },

  productFeed: {
    type: "productFeed",
    label: "Product Feed",
    description: "Live products from Shopify, grouped into rows.",
    templates: ["index"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  brands: {
    type: "brands",
    label: "Shop by Brands",
    description: "Brand tile grid with an optional flavour wheel.",
    templates: ["index", "collection", "product", "page"],
    fields: [
      ...headingFields(),
      { type: "text", key: "seeAllLabel", label: "'See all' button label" },
      { type: "link", key: "seeAllHref", label: "'See all' link" },
      {
        type: "toggle",
        key: "showFlavorWheel",
        label: "Show flavour wheel",
        help: "The interactive 'Shop by Flavour' wheel below the grid.",
      },
      {
        type: "repeater",
        key: "items",
        label: "Brand tiles",
        itemNoun: "brand",
        itemLabelKey: "name",
        max: 40,
        defaultItem: { name: "New Brand", image: "/vape_kit.png", href: "/collections/" },
        fields: [
          { type: "text", key: "name", label: "Brand name" },
          { type: "image", key: "image", label: "Icon image" },
          { type: "link", key: "href", label: "Link", placeholder: "/collections/..." },
        ],
      },
    ],
    defaults: {
      eyebrow: "Trusted Brands",
      heading: "Shop by Brands",
      seeAllLabel: "SEE ALL",
      seeAllHref: "/shop",
      showFlavorWheel: true,
      items: [
        { name: "JUUL", image: "/juul_device.png", href: "/collections/juul-vape-dubai" },
        { name: "MYLE", image: "/vape_kit.png", href: "/collections/myle-vape-dubai" },
        { name: "GeekVape", image: "/vape_kit.png", href: "/collections/geek-vape" },
        { name: "Uwell", image: "/vape_kit.png", href: "/collections/uwell-vape" },
        { name: "Vaporesso", image: "/vape_kit.png", href: "/collections/vaporesso-vape" },
        { name: "VooPoo", image: "/vape_kit.png", href: "/collections/voopoo-vape" },
        { name: "Smok", image: "/vape_kit.png", href: "/collections/smok-vape" },
        { name: "Oxva", image: "/vape_kit.png", href: "/collections/oxva-vape" },
        { name: "Elf Bar", image: "/lost_mary.png", href: "/collections/elf-bar-vape" },
        { name: "Lost Mary", image: "/lost_mary.png", href: "/collections/lost-mary-disposable" },
        { name: "Tugboat", image: "/lost_mary.png", href: "/collections/tugboat-vape" },
        { name: "SKE Crystal", image: "/lost_mary.png", href: "/collections/disposable-vape" },
        { name: "Pod Salt", image: "/premium_liquid.png", href: "/collections/pod-salt-vape" },
        { name: "Nasty Juice", image: "/premium_liquid.png", href: "/collections/salt-nicotine" },
        { name: "IVG", image: "/premium_liquid.png", href: "/collections/salt-nicotine" },
        { name: "Al Fakher", image: "/premium_liquid.png", href: "/collections/al-fakher-vape" },
      ],
    },
  },

  whyShop: {
    type: "whyShop",
    label: "Why Shop With Us",
    description: "Trust pillars with icons.",
    templates: ["index", "collection", "product", "page"],
    fields: [
      { type: "text", key: "badgeText", label: "Badge text" },
      { type: "text", key: "headingLead", label: "Heading — first part" },
      {
        type: "text",
        key: "headingHighlight",
        label: "Heading — highlighted part",
        help: "Rendered in the brand colour.",
      },
      { type: "textarea", key: "description", label: "Description", rows: 3 },
      { type: "text", key: "pillTitle", label: "Side pill — title" },
      { type: "text", key: "pillSubtitle", label: "Side pill — subtitle" },
      { type: "text", key: "footerNote", label: "Card footer note" },
      {
        type: "repeater",
        key: "pillars",
        label: "Pillars",
        itemNoun: "pillar",
        itemLabelKey: "title",
        max: 12,
        defaultItem: { icon: "BadgeCheck", title: "New Pillar", subtitle: "", badge: "" },
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "title", label: "Title" },
          { type: "textarea", key: "subtitle", label: "Description", rows: 3 },
          { type: "text", key: "badge", label: "Corner badge" },
        ],
      },
    ],
    defaults: {
      badgeText: "The Dubai Vape Standard",
      headingLead: "Why Shop With",
      headingHighlight: "Vape Shop Dubai?",
      description:
        "We are Dubai's most trusted online vape store delivering 100% authentic devices, Disposable Vapes, Pod Systems, JUUL, MYLE, and E-Liquids directly to your doorstep.",
      pillTitle: "Licensed UAE Importer",
      pillSubtitle: "Serving Dubai, Abu Dhabi, Sharjah & All Emirates",
      footerNote: "Verified Service Commitment",
      pillars: [
        {
          icon: "Truck",
          title: "2-Hour Express Dubai Delivery",
          subtitle:
            "Order before 10:00 PM for guaranteed 2-hour express delivery anywhere in Dubai. Same-day delivery across Abu Dhabi & all UAE Emirates.",
          badge: "Express Speed",
        },
        {
          icon: "ShieldCheck",
          title: "100% Guaranteed Authentic",
          subtitle:
            "Directly imported from official certified factory distributors. Every device and pod box includes QR scratch codes for instant genuine verification.",
          badge: "Certified Original",
        },
        {
          icon: "CreditCard",
          title: "Cash & Card on Delivery",
          subtitle:
            "Pay conveniently at your door. Our delivery drivers carry mobile wireless POS terminals accepting Visa, Mastercard, Apple Pay, and cash.",
          badge: "Flexible Payment",
        },
        {
          icon: "Headphones",
          title: "24/7 Dedicated WhatsApp Support",
          subtitle:
            "Need product advice or instant order tracking? Our Dubai vape specialists are available 24/7 on WhatsApp to assist you immediately.",
          badge: "Always Available",
        },
        {
          icon: "Tag",
          title: "Direct Wholesale Pricing",
          subtitle:
            "Enjoy direct distributor wholesale prices, multi-pack bundle savings on JUUL & disposables, and exclusive seasonal promotions in Dubai.",
          badge: "Best Value",
        },
        {
          icon: "RefreshCw",
          title: "Zero-Hassle Free Replacements",
          subtitle:
            "If any factory unit is defective upon unboxing, our express driver will replace it immediately with a brand new sealed box at no cost.",
          badge: "Buyer Protection",
        },
      ],
    },
  },

  faq: {
    type: "faq",
    label: "FAQ",
    description:
      "Searchable questions and answers. On the homepage these also feed the FAQ structured data Google reads.",
    templates: ["index", "collection", "product", "page"],
    fields: [
      { type: "text", key: "badgeText", label: "Badge text" },
      { type: "text", key: "heading", label: "Heading" },
      { type: "textarea", key: "description", label: "Description", rows: 3 },
      { type: "text", key: "deliveryBadge", label: "Corner badge" },
      { type: "text", key: "searchPlaceholder", label: "Search placeholder" },
      { type: "text", key: "verifiedNote", label: "Answer footer note" },
      {
        type: "repeater",
        key: "items",
        label: "Questions",
        itemNoun: "question",
        itemLabelKey: "question",
        max: 40,
        defaultItem: { question: "New question", answer: "", category: "products" },
        fields: [
          { type: "text", key: "question", label: "Question" },
          { type: "textarea", key: "answer", label: "Answer", rows: 5 },
          {
            type: "select",
            key: "category",
            label: "Filter tab",
            options: [
              { label: "Delivery", value: "delivery" },
              { label: "Authenticity", value: "authenticity" },
              { label: "Payment", value: "payment" },
              { label: "Products", value: "products" },
            ],
          },
        ],
      },
    ],
    defaults: {
      badgeText: "Customer Help & FAQs",
      heading: "Frequently Asked Questions",
      description:
        "Find instant answers regarding 2-hour express delivery in Dubai, product authenticity, card payments on delivery, and vape device selection.",
      deliveryBadge: "2-Hour Delivery",
      searchPlaceholder: "Search FAQs (e.g. delivery, JUUL, card)...",
      verifiedNote: "Verified Answer for Dubai & UAE Customers",
      items: [
        {
          question: "How fast is vape delivery in Dubai and across the UAE?",
          answer:
            "We offer 2-Hour Express Delivery in Dubai for all orders placed before 10:00 PM. For Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, and UAQ, we provide guaranteed same-day or next-day express delivery.",
          category: "delivery",
        },
        {
          question: "Are all vapes, pods, and devices 100% authentic?",
          answer:
            "Yes, 100%! All devices, disposable vapes, pods, and e-liquids sold at Vape Shop Dubai are directly imported from certified manufacturers and authorized regional distributors. Every product features a security seal and scannable QR verification code.",
          category: "authenticity",
        },
        {
          question: "Can I pay by card when the delivery driver arrives?",
          answer:
            "Yes! We support Cash on Delivery (COD) as well as Card Machine on Delivery. Our delivery riders carry mobile wireless card terminals accepting Visa, Mastercard, Apple Pay, and contactless payments.",
          category: "payment",
        },
        {
          question: "What is the difference between JUUL 1 and JUUL 2?",
          answer:
            "JUUL 2 is the next-generation pod system featuring enhanced airflow, smart LED battery level indicators, anti-counterfeit pod detection, and 18mg nicotine salt pods. JUUL 1 is the classic minimal device available in 3% and 5% USA nicotine strengths.",
          category: "products",
        },
        {
          question: "What is the difference between Nicotine Salt and Freebase E-Liquids?",
          answer:
            "Nicotine Salt e-liquids provide a smoother throat hit at higher nicotine concentrations (20mg to 50mg), making them ideal for pod systems like Caliburn, XROS, and MYLE. Freebase e-liquids have higher VG ratios designed for sub-ohm mod kits to produce thick vapor clouds.",
          category: "products",
        },
        {
          question: "What is the legal age to buy vape products in Dubai?",
          answer:
            "In accordance with UAE federal regulations, you must be at least 18 years of age or older to purchase electronic cigarettes, nicotine pods, or vaping accessories.",
          category: "authenticity",
        },
        {
          question: "What should I do if a disposable vape or device is defective?",
          answer:
            "All products are backed by our 100% Satisfaction Guarantee. If you receive a defective unit or damaged item, contact our customer support team via WhatsApp within 24 hours for an immediate free replacement.",
          category: "delivery",
        },
      ],
    },
  },

  whatsapp: {
    type: "whatsapp",
    label: "WhatsApp CTA",
    description: "Contact banner with a WhatsApp button.",
    templates: ["index", "collection", "product", "page"],
    fields: [
      { type: "text", key: "badgeText", label: "Badge text" },
      { type: "text", key: "responseNote", label: "Response-time note" },
      { type: "text", key: "heading", label: "Heading" },
      { type: "textarea", key: "description", label: "Description", rows: 3 },
      { type: "text", key: "contactLabel", label: "Contact card label" },
      {
        type: "text",
        key: "phoneNumber",
        label: "WhatsApp number",
        placeholder: "971582839787",
        help: "Digits only, with country code and no +.",
      },
      { type: "text", key: "phoneDisplay", label: "Number as displayed" },
      { type: "textarea", key: "prefilledMessage", label: "Pre-filled message", rows: 2 },
      { type: "text", key: "buttonText", label: "Button label" },
      {
        type: "repeater",
        key: "features",
        label: "Feature badges",
        itemNoun: "badge",
        itemLabelKey: "label",
        max: 6,
        defaultItem: { icon: "BadgeCheck", label: "New badge" },
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "label", label: "Label" },
        ],
      },
    ],
    defaults: {
      badgeText: "Live WhatsApp Support",
      responseNote: "Avg Response < 2 Mins",
      heading: "Need Help Choosing or Prefer Direct WhatsApp Ordering?",
      description:
        "Connect directly with our Dubai vape specialists. Get instant flavor recommendations, custom bundle discounts, or place your order directly via WhatsApp for 2-hour express delivery.",
      features: [
        { icon: "Zap", label: "2-Hour Express Delivery" },
        { icon: "ShieldCheck", label: "100% Authentic Products" },
        { icon: "MessageCircle", label: "Cash / Card on Delivery" },
      ],
      contactLabel: "Official Contact",
      phoneNumber: "971582839787",
      phoneDisplay: "+971 58 283 9787",
      prefilledMessage:
        "Hello Vape Shop Dubai, I need assistance or would like to place an order!",
      buttonText: "Chat on WhatsApp",
    },
  },

  blogPosts: {
    type: "blogPosts",
    label: "Blog Posts",
    description: "Latest articles pulled from Shopify.",
    templates: ["index", "page"],
    fields: [
      { type: "text", key: "badgeText", label: "Badge text" },
      { type: "text", key: "heading", label: "Heading" },
      { type: "textarea", key: "description", label: "Description", rows: 3 },
      { type: "text", key: "viewAllLabel", label: "'View all' label" },
      { type: "link", key: "viewAllHref", label: "'View all' link" },
      { type: "number", key: "postCount", label: "Posts to show", min: 1, max: 9, step: 1 },
    ],
    defaults: {
      badgeText: "Vape Dubai Journal & Guides",
      heading: "Latest Vaping Guides & Insights",
      description:
        "Stay informed with authentic product reviews, JUUL 2 guides, disposable vape comparisons, and legal UAE regulations.",
      viewAllLabel: "View All Articles",
      viewAllHref: "/blog",
      postCount: 3,
    },
  },

  /* ═══════════ Static page building blocks ═══════════ */

  pageHeader: {
    type: "pageHeader",
    label: "Page Header",
    description: "Title block at the top of a static page.",
    templates: ["page"],
    fields: [
      { type: "text", key: "eyebrow", label: "Eyebrow" },
      { type: "text", key: "heading", label: "Heading" },
      { type: "textarea", key: "subheading", label: "Subheading", rows: 3 },
      { type: "toggle", key: "centered", label: "Centre the text" },
    ],
    defaults: {
      eyebrow: "",
      heading: "Page Title",
      subheading: "",
      centered: true,
    },
  },

  richText: {
    type: "richText",
    label: "Text Block",
    description: "Heading plus body copy. Blank lines become paragraphs.",
    templates: ["page", "index", "collection", "product"],
    fields: [
      { type: "text", key: "heading", label: "Heading" },
      {
        type: "richtext",
        key: "body",
        label: "Body",
        rows: 10,
        help: "Leave a blank line between paragraphs. Start a line with '- ' for a bullet.",
      },
      {
        type: "select",
        key: "width",
        label: "Content width",
        options: [
          { label: "Readable column", value: "narrow" },
          { label: "Full width", value: "wide" },
        ],
      },
    ],
    defaults: { heading: "", body: "", width: "narrow" },
  },

  featureGrid: {
    type: "featureGrid",
    label: "Feature Grid",
    description: "Icon cards in a responsive grid.",
    templates: ["page", "index", "collection", "product"],
    fields: [
      { type: "text", key: "heading", label: "Heading" },
      { type: "textarea", key: "description", label: "Description", rows: 2 },
      {
        type: "repeater",
        key: "items",
        label: "Cards",
        itemNoun: "card",
        itemLabelKey: "title",
        max: 12,
        defaultItem: { icon: "BadgeCheck", title: "New card", body: "" },
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "title", label: "Title" },
          { type: "textarea", key: "body", label: "Body", rows: 3 },
        ],
      },
    ],
    defaults: { heading: "", description: "", items: [] },
  },

  contactForm: {
    type: "contactForm",
    label: "Contact Form",
    description: "Enquiry form that emails the store.",
    templates: ["page"],
    fields: [
      { type: "text", key: "heading", label: "Heading" },
      { type: "textarea", key: "description", label: "Description", rows: 2 },
      { type: "text", key: "nameLabel", label: "Name field label" },
      { type: "text", key: "phoneLabel", label: "Phone field label" },
      { type: "text", key: "orderIdLabel", label: "Order ID field label" },
      { type: "text", key: "subjectLabel", label: "Subject field label" },
      { type: "text", key: "messageLabel", label: "Message field label" },
      { type: "text", key: "submitLabel", label: "Submit button label" },
      { type: "text", key: "successMessage", label: "Success message" },
    ],
    defaults: {
      heading: "Send us a message",
      description:
        "Fill in the form and our Dubai team will get back to you, usually within a few minutes.",
      nameLabel: "Your name",
      phoneLabel: "Phone number",
      orderIdLabel: "Order ID (optional)",
      subjectLabel: "Subject",
      messageLabel: "Message",
      submitLabel: "Send message",
      successMessage: "Thanks — we've received your message and will reply shortly.",
    },
  },

  contactDetails: {
    type: "contactDetails",
    label: "Contact Details",
    description: "Address, phone, email and opening hours.",
    templates: ["page"],
    fields: [
      { type: "text", key: "heading", label: "Heading" },
      { type: "text", key: "addressLabel", label: "Address label" },
      { type: "textarea", key: "address", label: "Address", rows: 2 },
      { type: "text", key: "phone", label: "Phone" },
      { type: "text", key: "email", label: "Email" },
      { type: "text", key: "hours", label: "Opening hours" },
      { type: "text", key: "mapEmbedUrl", label: "Map embed URL", help: "Optional Google Maps embed link." },
    ],
    defaults: {
      heading: "Visit or Contact Us",
      addressLabel: "Dubai Dispatch Center",
      address: "International City, Dubai, UAE",
      phone: "+971 58 283 9787",
      email: "vapshopdubai@gmail.com",
      hours: "24/7 Delivery & Support across Dubai",
      mapEmbedUrl: "",
    },
  },

  /* ═══════════ Collection template ═══════════ */

  collectionMain: {
    type: "collectionMain",
    label: "Product Grid & Filters",
    description:
      "The collection's products, filters, sorting and banner. Always shown — it is the page.",
    templates: ["collection"],
    required: true,
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  brandSphere: {
    type: "brandSphere",
    label: "3D Brand Sphere",
    description: "Rotating 3D brand globe.",
    templates: ["collection"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  disposableShowcase: {
    type: "disposableShowcase",
    label: "Disposable Brands Showcase",
    description: "Disposable brand highlight strip.",
    templates: ["collection"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  disposableComparison: {
    type: "disposableComparison",
    label: "Disposable Comparison",
    description: "Side-by-side disposable comparison tables.",
    templates: ["collection"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  ejuiceShowcase: {
    type: "ejuiceShowcase",
    label: "E-Juice Brands Showcase",
    description: "E-liquid brand highlight strip.",
    templates: ["collection"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  juulSignatureFlavors: {
    type: "juulSignatureFlavors",
    label: "JUUL Signature Flavors",
    description: "JUUL flavour line-up.",
    templates: ["collection"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  juulPackagingCompare: {
    type: "juulPackagingCompare",
    label: "JUUL Packaging Comparison",
    description: "Old vs new JUUL 1 packaging guide.",
    templates: ["collection"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  juulTechSpecs: {
    type: "juulTechSpecs",
    label: "JUUL Tech Specs",
    description: "Technical specification table.",
    templates: ["collection"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  bottomCollectionGrid: {
    type: "bottomCollectionGrid",
    label: "Related Collections Grid",
    description: "Five-category recommendation grid.",
    templates: ["collection"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  juulAppIntegration: {
    type: "juulAppIntegration",
    label: "JUUL 2 App Integration",
    description: "JUUL 2 companion-app feature block.",
    templates: ["collection", "product"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  myleVerification: {
    type: "myleVerification",
    label: "MYLE Verification Guide",
    description: "Anti-counterfeit verification steps.",
    templates: ["collection", "product"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  customerReviews: {
    type: "customerReviews",
    label: "Customer Reviews",
    description: "Verified review carousel.",
    templates: ["index", "collection", "product"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  /* ═══════════ Product template ═══════════ */

  productMain: {
    type: "productMain",
    label: "Product Details & Buy Box",
    description:
      "Gallery, price, variants and add-to-cart. Always shown — it is the page.",
    templates: ["product"],
    required: true,
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  productKeySpecs: {
    type: "productKeySpecs",
    label: "Key Specifications",
    description: "Spec highlights for the current product.",
    templates: ["product"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  productFlavors: {
    type: "productFlavors",
    label: "Available Flavors",
    description: "Flavour options for the current product.",
    templates: ["product"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  whyChooseProduct: {
    type: "whyChooseProduct",
    label: "Why Choose This Product",
    description: "Product-level selling points.",
    templates: ["product"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  juulCrispMenthol: {
    type: "juulCrispMenthol",
    label: "JUUL Crisp Menthol",
    description: "JUUL menthol feature block.",
    templates: ["product"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },

  relatedProducts: {
    type: "relatedProducts",
    label: "Related Products",
    description: "Recommendation carousels.",
    templates: ["product"],
    contentInCode: true,
    fields: [],
    defaults: {},
  },
};

/* ── Shared section groups (header / footer) ──────────────────────── */

/** Fields for the header, which renders on every page. */
export const HEADER_FIELDS: FieldDef[] = [
  { type: "toggle", key: "announcementEnabled", label: "Show announcement bar" },
  { type: "textarea", key: "announcementText", label: "Announcement text", rows: 2 },
  {
    type: "repeater",
    key: "menu",
    label: "Main menu",
    itemNoun: "menu item",
    itemLabelKey: "label",
    max: 20,
    defaultItem: { label: "New Item", href: "/collections/", children: [] },
    fields: [
      { type: "text", key: "label", label: "Label" },
      { type: "link", key: "href", label: "Link", placeholder: "/collections/..." },
      {
        type: "repeater",
        key: "children",
        label: "Dropdown items",
        itemNoun: "link",
        itemLabelKey: "label",
        max: 30,
        defaultItem: { label: "New Link", href: "/collections/" },
        fields: [
          { type: "text", key: "label", label: "Label" },
          { type: "link", key: "href", label: "Link" },
        ],
      },
    ],
  },
];

/** Fields for the footer, which renders on every page. */
export const FOOTER_FIELDS: FieldDef[] = [
  {
    type: "repeater",
    key: "trustItems",
    label: "Trust bar",
    itemNoun: "item",
    itemLabelKey: "title",
    max: 6,
    defaultItem: { icon: "BadgeCheck", title: "New item", subtitle: "" },
    fields: [
      { type: "icon", key: "icon", label: "Icon" },
      { type: "text", key: "title", label: "Title" },
      { type: "text", key: "subtitle", label: "Subtitle" },
    ],
  },
  { type: "textarea", key: "description", label: "Store description", rows: 4 },
  { type: "text", key: "whatsappLabel", label: "WhatsApp button label" },
  {
    type: "text",
    key: "whatsappNumber",
    label: "WhatsApp number",
    help: "Digits only, with country code and no +.",
  },
  { type: "text", key: "ratingText", label: "Rating text" },
  {
    type: "repeater",
    key: "columns",
    label: "Link columns",
    itemNoun: "column",
    itemLabelKey: "heading",
    max: 4,
    defaultItem: { heading: "New Column", links: [] },
    fields: [
      { type: "text", key: "heading", label: "Column heading" },
      {
        type: "repeater",
        key: "links",
        label: "Links",
        itemNoun: "link",
        itemLabelKey: "label",
        max: 20,
        defaultItem: { label: "New Link", href: "/" },
        fields: [
          { type: "text", key: "label", label: "Label" },
          { type: "link", key: "href", label: "Link" },
        ],
      },
    ],
  },
  { type: "text", key: "contactHeading", label: "Contact column heading" },
  { type: "text", key: "addressLabel", label: "Address label" },
  { type: "textarea", key: "address", label: "Address", rows: 2 },
  { type: "text", key: "phone", label: "Phone" },
  { type: "text", key: "email", label: "Email" },
  { type: "text", key: "hoursNote", label: "Opening hours note" },
  { type: "textarea", key: "healthWarning", label: "Health warning", rows: 3 },
  {
    type: "repeater",
    key: "paymentBadges",
    label: "Payment badges",
    itemNoun: "badge",
    itemLabelKey: "label",
    max: 6,
    defaultItem: { icon: "CreditCard", label: "New badge" },
    fields: [
      { type: "icon", key: "icon", label: "Icon" },
      { type: "text", key: "label", label: "Label" },
    ],
  },
  { type: "text", key: "copyright", label: "Copyright line" },
  { type: "text", key: "poweredByLabel", label: "'Powered by' label" },
  { type: "link", key: "poweredByHref", label: "'Powered by' link" },
  {
    type: "repeater",
    key: "bottomLinks",
    label: "Bottom links",
    itemNoun: "link",
    itemLabelKey: "label",
    max: 8,
    defaultItem: { label: "New Link", href: "/" },
    fields: [
      { type: "text", key: "label", label: "Label" },
      { type: "link", key: "href", label: "Link" },
    ],
  },
];

export const SECTION_TYPES = Object.keys(SECTION_REGISTRY);

export function getSectionDef(type: string): SectionDef | undefined {
  return SECTION_REGISTRY[type];
}

/** Sections a merchant may add to a given template type. */
export function sectionsForTemplate(templateType: TemplateType): SectionDef[] {
  return Object.values(SECTION_REGISTRY)
    .filter((def) => def.templates.includes(templateType) && !def.required)
    .sort((a, b) => a.label.localeCompare(b.label));
}
