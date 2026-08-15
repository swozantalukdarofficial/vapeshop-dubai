import { ICON_NAMES } from "./icons";
import type { SectionId } from "./types";

/**
 * Declarative description of the admin form for every section.
 *
 * The customizer renders these definitions generically, so adding a new
 * editable field is a three-line change here rather than a new bespoke form.
 */

export interface FieldBase {
  /** Property name within the object this field belongs to. */
  key: string;
  label: string;
  help?: string;
}

export interface TextFieldDef extends FieldBase {
  type: "text";
  placeholder?: string;
  maxLength?: number;
}

export interface TextareaFieldDef extends FieldBase {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export interface ImageFieldDef extends FieldBase {
  type: "image";
  placeholder?: string;
}

export interface LinkFieldDef extends FieldBase {
  type: "link";
  placeholder?: string;
}

export interface ToggleFieldDef extends FieldBase {
  type: "toggle";
}

export interface SelectFieldDef extends FieldBase {
  type: "select";
  options: { label: string; value: string }[];
}

export interface IconFieldDef extends FieldBase {
  type: "icon";
}

export interface NumberFieldDef extends FieldBase {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export interface RepeaterFieldDef extends FieldBase {
  type: "repeater";
  /** Sub-field whose value is shown as the collapsed row title. */
  itemLabelKey: string;
  /** Singular noun used in the "Add …" button. */
  itemNoun: string;
  min?: number;
  max?: number;
  fields: FieldDef[];
  /** Shape used when the merchant adds a new row. */
  defaultItem: Record<string, unknown>;
}

export type FieldDef =
  | TextFieldDef
  | TextareaFieldDef
  | ImageFieldDef
  | LinkFieldDef
  | ToggleFieldDef
  | SelectFieldDef
  | IconFieldDef
  | NumberFieldDef
  | RepeaterFieldDef;

export interface SectionSchema {
  id: SectionId;
  label: string;
  description: string;
  /** Set for sections that render but expose no content fields. */
  fields: FieldDef[];
}

const ICON_OPTIONS = ICON_NAMES.map((name) => ({ label: name, value: name }));

/* ── Section schemas ──────────────────────────────────────────────── */

export const SECTION_SCHEMAS: SectionSchema[] = [
  {
    id: "hero",
    label: "Hero Slider",
    description: "The top carousel and the two promo cards beside it.",
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
        min: 1,
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
  },

  {
    id: "categories",
    label: "Shop by Categories",
    description: "The category tile grid below the hero.",
    fields: [
      { type: "text", key: "eyebrow", label: "Eyebrow" },
      { type: "text", key: "heading", label: "Heading" },
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
  },

  {
    id: "products",
    label: "Product Feed",
    description:
      "Live products pulled from Shopify. Product data is managed in Shopify admin — only visibility is controlled here.",
    fields: [],
  },

  {
    id: "brands",
    label: "Shop by Brands",
    description: "The brand tile grid and the rotating flavour wheel.",
    fields: [
      { type: "text", key: "eyebrow", label: "Eyebrow" },
      { type: "text", key: "heading", label: "Heading" },
      { type: "text", key: "seeAllLabel", label: "'See all' button label" },
      { type: "link", key: "seeAllHref", label: "'See all' link" },
      {
        type: "toggle",
        key: "showFlavorWheel",
        label: "Show flavour wheel",
        help: "The interactive 'Shop by Flavour' wheel below the brand grid.",
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
  },

  {
    id: "whyShop",
    label: "Why Shop With Us",
    description: "The six trust pillars and their heading block.",
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
        defaultItem: {
          icon: "BadgeCheck",
          title: "New Pillar",
          subtitle: "",
          badge: "",
        },
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "title", label: "Title" },
          { type: "textarea", key: "subtitle", label: "Description", rows: 3 },
          { type: "text", key: "badge", label: "Corner badge" },
        ],
      },
    ],
  },

  {
    id: "faq",
    label: "FAQ",
    description:
      "Questions and answers. These also feed the FAQ structured data Google reads.",
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
  },

  {
    id: "whatsapp",
    label: "WhatsApp CTA",
    description: "The contact banner with the WhatsApp button.",
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
  },

  {
    id: "blog",
    label: "Blog Section",
    description:
      "Heading and layout for the latest-articles grid. Articles themselves come from Shopify.",
    fields: [
      { type: "text", key: "badgeText", label: "Badge text" },
      { type: "text", key: "heading", label: "Heading" },
      { type: "textarea", key: "description", label: "Description", rows: 3 },
      { type: "text", key: "viewAllLabel", label: "'View all' label" },
      { type: "link", key: "viewAllHref", label: "'View all' link" },
      {
        type: "number",
        key: "postCount",
        label: "Posts to show",
        min: 1,
        max: 9,
        step: 1,
      },
    ],
  },
];

export const SECTION_SCHEMA_BY_ID = Object.fromEntries(
  SECTION_SCHEMAS.map((s) => [s.id, s])
) as Record<SectionId, SectionSchema>;

export { ICON_OPTIONS };
