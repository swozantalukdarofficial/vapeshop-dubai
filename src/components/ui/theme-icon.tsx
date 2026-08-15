"use client";

import { createElement } from "react";

import { resolveIcon } from "@/lib/theme/icons";

/**
 * Renders a merchant-chosen icon by name.
 *
 * Uses `createElement` with the looked-up component rather than assigning it
 * to a capitalised local and rendering `<Icon />`. Both are equivalent at
 * runtime, but the latter reads as "defining a component during render" to
 * the React compiler's lint rules.
 */
export const ThemeIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className,
}) => createElement(resolveIcon(name), { className });
