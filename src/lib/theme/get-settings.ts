import { unstable_cache } from "next/cache";

import { sealImageUrlsDeep } from "../images/proxy";
import { readPublishedRecord } from "./store";
import type { ThemeSettings } from "./types";

/** Cache tag invalidated whenever the merchant publishes. */
export const THEME_CACHE_TAG = "theme-settings";

/**
 * Published settings for the storefront.
 *
 * Wrapped in the data cache so reading settings doesn't force every page to
 * render dynamically — pages stay statically optimised and are refreshed by
 * `revalidateTag(THEME_CACHE_TAG)` when the admin hits Publish.
 */
const getCachedPublishedSettings = unstable_cache(
  async () => {
    const record = await readPublishedRecord();
    // Merchant-pasted image URLs are sealed to same-origin `/i/<token>` paths here so
    // the storefront never renders a third-party CDN host. Tokens are deterministic,
    // so caching the sealed copy is safe.
    return sealImageUrlsDeep(record.settings);
  },
  ["published-theme-settings"],
  { tags: [THEME_CACHE_TAG] }
);

export async function getThemeSettings(): Promise<ThemeSettings> {
  return getCachedPublishedSettings();
}
