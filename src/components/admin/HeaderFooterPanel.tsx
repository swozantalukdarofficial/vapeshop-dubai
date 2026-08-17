"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

import { FOOTER_FIELDS, HEADER_FIELDS } from "@/lib/theme/sections";
import type { ThemeSettings } from "@/lib/theme/types";

import { FieldRenderer } from "./FieldRenderer";

/**
 * Editor for the header and footer — Shopify's "section groups". They sit
 * outside the template list because they render on every page.
 */
export const HeaderFooterPanel: React.FC<{
  which: "header" | "footer";
  settings: ThemeSettings;
  onBack: () => void;
  onChange: (next: ThemeSettings) => void;
}> = ({ which, settings, onBack, onChange }) => {
  const fields = which === "header" ? HEADER_FIELDS : FOOTER_FIELDS;
  const values = settings[which] as unknown as Record<string, unknown>;

  const update = (key: string, value: unknown) => {
    onChange({
      ...settings,
      [which]: { ...(settings[which] as object), [key]: value },
    });
  };

  return (
    <>
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Back to sections"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="min-w-0 flex-1 truncate text-[13px] font-black capitalize text-slate-800">
          {which}
        </h2>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3.5 py-4">
        <p className="text-[11px] leading-relaxed text-slate-400">
          Shown on every page of the storefront.
        </p>

        {fields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            values={values}
            onChange={update}
          />
        ))}
      </div>
    </>
  );
};
