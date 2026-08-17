/**
 * Named predicates that gate section instances on *default* templates.
 *
 * These preserve the storefront's original hard-coded rules — "the JUUL spec
 * table only appears on JUUL collections" — as data rather than JSX
 * conditionals, so the customizer can show a merchant why a section isn't
 * appearing instead of it being invisible magic.
 *
 * A per-handle override bypasses all of this: creating one is an explicit
 * statement of what that page should contain.
 */

export interface SectionContext {
  /** Collection or product handle for the current page. */
  handle?: string;
  /** Product title, used by the product-page rules that match on name. */
  productName?: string;
  /** Collection title, passed through to sections that display it. */
  collectionTitle?: string;
  /** False when a product has no recommendations to show. */
  hasRelatedProducts?: boolean;
}

type Predicate = (ctx: SectionContext) => boolean;

const handleOf = (ctx: SectionContext) => (ctx.handle ?? "").toLowerCase();
const productTextOf = (ctx: SectionContext) =>
  `${ctx.handle ?? ""} ${ctx.productName ?? ""}`.toLowerCase();

export const CONDITIONS: Record<string, Predicate> = {
  /* ── Collection rules ── */
  handleIncludesDisposable: (ctx) => handleOf(ctx).includes("disposable"),

  handleIsEJuice: (ctx) => {
    const h = handleOf(ctx);
    return (
      h === "e-liquids" ||
      h === "e-juice" ||
      h.includes("juice") ||
      h.includes("liquid") ||
      h.includes("salt")
    );
  },

  handleIncludesJuul: (ctx) => handleOf(ctx).includes("juul"),

  /** JUUL pages that are not the JUUL 2 line. */
  handleIsJuul1: (ctx) => {
    const h = handleOf(ctx);
    return h.includes("juul") && !h.includes("juul-2") && !h.includes("juul2");
  },

  handleIsJuul2: (ctx) => {
    const h = handleOf(ctx);
    return h.includes("juul-2") || h.includes("juul2");
  },

  handleIncludesMyle: (ctx) => handleOf(ctx).includes("myle"),

  /** Everything except the brand directory listing. */
  notBrandDirectory: (ctx) => {
    const h = handleOf(ctx);
    return h !== "brand" && h !== "brands";
  },

  /* ── Product rules (match on handle *or* title) ── */
  productIsJuul: (ctx) => productTextOf(ctx).includes("juul"),
  productIsMyle: (ctx) => productTextOf(ctx).includes("myle"),
  productIsNotJuul: (ctx) => !productTextOf(ctx).includes("juul"),
  /** Neither JUUL nor MYLE — those lines have their own bespoke sections. */
  productIsGeneric: (ctx) => {
    const text = productTextOf(ctx);
    return !text.includes("juul") && !text.includes("myle");
  },
  hasRelatedProducts: (ctx) => ctx.hasRelatedProducts !== false,
};

/** Human-readable labels so the customizer can explain a conditional section. */
export const CONDITION_LABELS: Record<string, string> = {
  handleIncludesDisposable: "Only on collections whose handle contains “disposable”",
  handleIsEJuice: "Only on e-liquid, e-juice and salt collections",
  handleIncludesJuul: "Only on collections whose handle contains “juul”",
  handleIsJuul1: "Only on JUUL collections that aren’t JUUL 2",
  handleIsJuul2: "Only on JUUL 2 collections",
  handleIncludesMyle: "Only on collections whose handle contains “myle”",
  notBrandDirectory: "Hidden on the brand directory page",
  productIsJuul: "Only on JUUL products",
  productIsMyle: "Only on MYLE products",
  productIsNotJuul: "Hidden on JUUL products",
  productIsGeneric: "Hidden on JUUL and MYLE products",
  hasRelatedProducts: "Only when related products exist",
};

/**
 * Should this instance render?
 *
 * `isOverride` short-circuits every condition — see the note at the top.
 */
export function shouldRenderInstance(
  showWhen: string | undefined,
  ctx: SectionContext,
  isOverride: boolean
): boolean {
  if (!showWhen || isOverride) return true;
  const predicate = CONDITIONS[showWhen];
  // An unknown predicate means stale data; showing the section is the safer
  // failure — a missing section is much harder to notice than an extra one.
  if (!predicate) return true;
  return predicate(ctx);
}
