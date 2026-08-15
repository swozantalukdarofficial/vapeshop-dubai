import { DEFAULT_THEME_SETTINGS } from "./defaults";
import type { SectionId, ThemeSettings } from "./types";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Recursively fill in keys the saved settings are missing, using `base`.
 *
 * Arrays are taken verbatim from the override — merging them element-wise
 * would resurrect repeater rows the merchant deliberately deleted.
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base)) {
    return (override === undefined ? base : (override as T));
  }
  if (!isPlainObject(override)) {
    return base;
  }

  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base)) {
    const overrideValue = override[key];
    if (overrideValue === undefined) continue;

    const baseValue = (base as Record<string, unknown>)[key];
    if (Array.isArray(baseValue)) {
      out[key] = Array.isArray(overrideValue) ? overrideValue : baseValue;
    } else if (isPlainObject(baseValue)) {
      out[key] = deepMerge(baseValue, overrideValue);
    } else {
      out[key] = overrideValue;
    }
  }
  return out as T;
}

/**
 * Normalise arbitrary stored JSON into a complete `ThemeSettings`.
 *
 * Anything missing falls back to defaults, and `sectionOrder` is repaired so
 * it always lists every known section exactly once — otherwise a section added
 * in a later release would silently never render.
 */
export function normalizeSettings(stored: unknown): ThemeSettings {
  const merged = deepMerge(DEFAULT_THEME_SETTINGS, stored);
  const knownIds = Object.keys(DEFAULT_THEME_SETTINGS.sections) as SectionId[];

  const seen = new Set<SectionId>();
  const order: SectionId[] = [];
  for (const id of merged.sectionOrder ?? []) {
    if (knownIds.includes(id) && !seen.has(id)) {
      seen.add(id);
      order.push(id);
    }
  }
  for (const id of knownIds) {
    if (!seen.has(id)) order.push(id);
  }

  return { ...merged, sectionOrder: order };
}

export function cloneSettings(settings: ThemeSettings): ThemeSettings {
  return structuredClone(settings);
}
