import type { ThemeSettings } from "./types";

/**
 * The factory defaults — extracted verbatim from the original hard-coded
 * section components so a fresh install renders exactly as it did before the
 * customizer existed. "Reset to default" in the admin restores this object.
 */
export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  version: 1,
  sectionOrder: [
    "hero",
    "categories",
    "products",
    "brands",
    "whyShop",
    "faq",
    "whatsapp",
    "blog",
  ],
  sections: {
    /* ── Hero ───────────────────────────────────────────────────── */
    hero: {
      enabled: true,
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

    /* ── Categories ─────────────────────────────────────────────── */
    categories: {
      enabled: true,
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

    /* ── Product feed ───────────────────────────────────────────── */
    products: {
      enabled: true,
    },

    /* ── Brands ─────────────────────────────────────────────────── */
    brands: {
      enabled: true,
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

    /* ── Why shop with us ───────────────────────────────────────── */
    whyShop: {
      enabled: true,
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

    /* ── FAQ ────────────────────────────────────────────────────── */
    faq: {
      enabled: true,
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

    /* ── WhatsApp CTA ───────────────────────────────────────────── */
    whatsapp: {
      enabled: true,
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

    /* ── Blog ───────────────────────────────────────────────────── */
    blog: {
      enabled: true,
      badgeText: "Vape Dubai Journal & Guides",
      heading: "Latest Vaping Guides & Insights",
      description:
        "Stay informed with authentic product reviews, JUUL 2 guides, disposable vape comparisons, and legal UAE regulations.",
      viewAllLabel: "View All Articles",
      viewAllHref: "/blog",
      postCount: 3,
    },
  },
};

/** Human-friendly names for each section, shared by the admin sidebar. */
export const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Slider",
  categories: "Shop by Categories",
  products: "Product Feed",
  brands: "Shop by Brands",
  whyShop: "Why Shop With Us",
  faq: "FAQ",
  whatsapp: "WhatsApp CTA",
  blog: "Blog Section",
};
