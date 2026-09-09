"use client";

import Image, { type ImageProps } from "next/image";
import React from "react";

/**
 * The single image component for the app. Everything should render through this rather
 * than a raw `<img>`, because a raw tag bypasses the proxy and leaks the Shopify CDN.
 *
 * Remote URLs are sealed into `/i/<token>` paths on the server (see
 * `src/lib/images/proxy.ts`), and the custom loader in `src/lib/images/loader.ts`
 * appends the width. So by the time a `src` arrives here it is either an already-sealed
 * `/i/...` path, a local `/public` asset, or a URL we don't proxy.
 *
 * The last case is why the `<img>` fallback still exists: the theme customizer accepts
 * arbitrary pasted URLs, and an unproxyable one should degrade to "visible but
 * unoptimised" instead of crashing the page.
 */

function canOptimize(src: string): boolean {
  if (!src) return false;
  // Sealed proxy path or a local /public asset — both go through next/image.
  return src.startsWith("/");
}

type SmartImageProps = Omit<ImageProps, "src"> & {
  src: string;
  /** Swapped in if the image fails to load. */
  fallbackSrc?: string;
};

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
  fetchPriority,
  draggable,
  ...rest
}) => {
  const handleError = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      if (!fallbackSrc) return;
      const el = event.currentTarget;
      if (el.src.endsWith(fallbackSrc)) return; // fallback failed too — stop
      el.src = fallbackSrc;
    },
    [fallbackSrc]
  );

  if (!src) return null;

  const effectiveSizes =
    sizes ||
    (typeof width === "number" && width <= 80
      ? "(max-width: 640px) 64px, 80px"
      : typeof width === "number" && width <= 180
      ? "(max-width: 640px) 140px, 180px"
      : typeof width === "number" && width <= 360
      ? "(max-width: 640px) 240px, 360px"
      : "(max-width: 640px) 360px, 640px");

  // Right-click save is also blocked document-wide by `ImageProtection`; doing it here
  // too means images are covered from first paint, before that effect has run.
  const blockContextMenu = (event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
  };
  const isDraggable = draggable ?? false;

  if (canOptimize(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes={effectiveSizes}
        quality={75}
        priority={priority}
        fetchPriority={fetchPriority}
        draggable={isDraggable}
        onContextMenu={blockContextMenu}
        onError={handleError}
        style={{ width: "auto", height: "auto", ...rest.style }}
        {...rest}
      />
    );
  }

  return (
    // Host isn't in remotePatterns; see the note at the top of this file.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || fallbackSrc || ""}
      alt={typeof alt === "string" ? alt : ""}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
      className={className}
      draggable={isDraggable}
      onContextMenu={blockContextMenu}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={fetchPriority}
      onError={handleError}
    />
  );
};
