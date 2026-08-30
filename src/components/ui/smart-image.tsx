"use client";

import Image, { type ImageProps } from "next/image";
import React from "react";

/**
 * `next/image` throws at render time when given a remote host that isn't in
 * `next.config.ts` → `images.remotePatterns`. Since the theme customizer lets
 * merchants paste arbitrary image URLs, that would take the whole page down.
 *
 * This renders the optimised `next/image` for hosts we've configured and falls
 * back to a plain `<img>` for anything else, so a pasted URL degrades to
 * "unoptimised but visible" instead of a crash.
 */

/** Keep in sync with `images.remotePatterns` in next.config.ts. */
const OPTIMIZED_HOSTS = ["cdn.shopify.com"];

function canOptimize(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true; // served from /public
  try {
    return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
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

  if (canOptimize(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={priority}
        fetchPriority={fetchPriority}
        draggable={draggable}
        onError={handleError}
        style={{ width: 'auto', height: 'auto', ...rest.style }}
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
      draggable={draggable}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={fetchPriority}
      onError={handleError}
    />
  );
};
