"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Blocks the right-click menu and drag-to-save on images.
 *
 * Scope note: this is a deterrent against casual saving, not protection. The bytes are
 * already in the browser cache by the time this runs, and the Network tab, "View page
 * source", disabling JavaScript, or any scripted client still retrieves them. Treat it
 * as a speed bump, and don't let it substitute for anything that actually matters.
 *
 * Implemented at the document level rather than on `SmartImage` because the blog and
 * product pages inject merchant HTML via `dangerouslySetInnerHTML`, and those `<img>`
 * tags never pass through a React component.
 *
 * Only image targets are blocked — a blanket `contextmenu` block would also take away
 * copy, paste, and "open link in new tab" on the rest of the page.
 */
export function ImageProtection() {
  const pathname = usePathname();

  useEffect(() => {
    // The customizer needs a working context menu to manage its own imagery.
    if (pathname?.startsWith("/admin")) return;

    const isImage = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;
      if (target.tagName === "IMG" || target.tagName === "PICTURE") return true;
      // Images painted as a CSS background, e.g. hero and slider panels.
      const background = window.getComputedStyle(target).backgroundImage;
      return Boolean(background && background !== "none" && background.includes("url("));
    };

    const blockIfImage = (event: Event) => {
      if (isImage(event.target)) event.preventDefault();
    };

    document.addEventListener("contextmenu", blockIfImage);
    document.addEventListener("dragstart", blockIfImage);

    return () => {
      document.removeEventListener("contextmenu", blockIfImage);
      document.removeEventListener("dragstart", blockIfImage);
    };
  }, [pathname]);

  return null;
}
