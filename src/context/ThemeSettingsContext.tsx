"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import { DEFAULT_THEME_SETTINGS } from "@/lib/theme/defaults";
import {
  resolveTemplateKey,
  type SectionInstance,
  type TemplateType,
  type ThemeSettings,
} from "@/lib/theme/types";

/**
 * Makes published theme settings available to the storefront, and — inside the
 * customizer's preview iframe — swaps in the unsaved draft the merchant is
 * editing.
 *
 * The storefront never calls the admin API. The parent window pushes settings
 * down over `postMessage`, so preview costs no extra requests and updates on
 * every keystroke.
 */

/** Query flag the customizer appends to the iframe URL. */
export const PREVIEW_PARAM = "__vs_preview";

export const PREVIEW_MESSAGES = {
  /** iframe → parent: "I'm mounted, send me the current draft." */
  ready: "vs-preview:ready",
  /** parent → iframe: full settings object to render. */
  settings: "vs-preview:settings",
  /** parent → iframe: bring a section into view. */
  scrollTo: "vs-preview:scroll-to",
} as const;

interface ThemeSettingsContextValue {
  settings: ThemeSettings;
}

const ThemeSettingsContext = createContext<ThemeSettingsContextValue>({
  settings: DEFAULT_THEME_SETTINGS,
});

export const ThemeSettingsProvider: React.FC<{
  initial: ThemeSettings;
  children: React.ReactNode;
}> = ({ initial, children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(initial);
  const pathname = usePathname();

  // Adopt fresh server settings after a publish. Done during render rather
  // than in an effect — React's documented way to reset state when a prop
  // changes, and it avoids rendering one frame of stale content.
  const [lastInitial, setLastInitial] = useState(initial);
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setSettings(initial);
  }

  useEffect(() => {
    const inPreview =
      new URLSearchParams(window.location.search).has(PREVIEW_PARAM) &&
      window.parent !== window;

    if (!inPreview) return;

    const onMessage = (event: MessageEvent) => {
      // Only ever trust our own origin — an embedded page can be framed by
      // anyone, and this handler writes straight into rendered content.
      if (event.origin !== window.location.origin) return;

      const data = event.data as {
        type?: string;
        settings?: ThemeSettings;
        sectionId?: string;
      };
      if (data?.type === PREVIEW_MESSAGES.settings && data.settings) {
        setSettings(data.settings);
      }
      if (data?.type === PREVIEW_MESSAGES.scrollTo && data.sectionId) {
        document
          .querySelector(`[data-section-id="${data.sectionId}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("message", onMessage);
    window.parent.postMessage(
      { type: PREVIEW_MESSAGES.ready },
      window.location.origin
    );

    return () => window.removeEventListener("message", onMessage);
    // Re-announce on navigation. This provider lives in the root layout, so a
    // client-side nav inside the preview would not remount it — without the
    // pathname dependency the frame would silently fall back to the published
    // settings the server sent for the new route.
  }, [pathname]);

  const value = useMemo(() => ({ settings }), [settings]);

  return (
    <ThemeSettingsContext.Provider value={value}>
      {children}
    </ThemeSettingsContext.Provider>
  );
};

export function useThemeSettings(): ThemeSettings {
  return useContext(ThemeSettingsContext).settings;
}

export function useHeaderSettings() {
  return useThemeSettings().header;
}

export function useFooterSettings() {
  return useThemeSettings().footer;
}

export interface ResolvedTemplate {
  key: string;
  /** True when a per-handle override is in play — disables `showWhen` rules. */
  isOverride: boolean;
  instances: SectionInstance[];
}

/**
 * The template a page should render: a per-handle override when the merchant
 * created one, otherwise the type default.
 */
export function useResolvedTemplate(
  type: TemplateType,
  handle?: string
): ResolvedTemplate {
  const settings = useThemeSettings();

  return useMemo(() => {
    const key = resolveTemplateKey(settings.templates, type, handle);
    const template = settings.templates[key];
    if (!template) return { key, isOverride: false, instances: [] };

    return {
      key,
      isOverride: Boolean(template.handle),
      instances: template.order
        .map((id) => template.instances[id])
        .filter((instance): instance is SectionInstance => Boolean(instance)),
    };
  }, [settings.templates, type, handle]);
}
