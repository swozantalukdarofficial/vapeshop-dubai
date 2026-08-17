"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import { sectionsForTemplate } from "@/lib/theme/sections";
import type { TemplateType } from "@/lib/theme/types";

/** "Add section" picker, listing only sections valid for this template type. */
export const AddSectionMenu: React.FC<{
  templateType: TemplateType;
  onAdd: (sectionType: string) => void;
}> = ({ templateType, onAdd }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const available = sectionsForTemplate(templateType);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-[12px] font-bold text-slate-500 transition-colors hover:border-orange-400 hover:text-orange-600"
      >
        <Plus className="h-3.5 w-3.5" />
        Add section
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 right-0 z-50 mb-1.5 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {available.length === 0 ? (
            <p className="px-3 py-3 text-center text-[12px] text-slate-400">
              No sections available for this template.
            </p>
          ) : (
            available.map((def) => (
              <button
                key={def.type}
                type="button"
                onClick={() => {
                  onAdd(def.type);
                  setOpen(false);
                }}
                className="w-full cursor-pointer px-3 py-2 text-left transition-colors hover:bg-slate-50"
              >
                <span className="block text-[13px] font-semibold text-slate-700">
                  {def.label}
                </span>
                <span className="block text-[11px] leading-snug text-slate-400">
                  {def.description}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
