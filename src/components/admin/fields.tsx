"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";

import { ThemeIcon } from "@/components/ui/theme-icon";
import { ICON_NAMES } from "@/lib/theme/icons";

/* ── Shared chrome ────────────────────────────────────────────────── */

export const FieldShell: React.FC<{
  label: string;
  help?: string;
  htmlFor?: string;
  children: React.ReactNode;
}> = ({ label, help, htmlFor, children }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-bold uppercase tracking-wider text-slate-500"
    >
      {label}
    </label>
    {children}
    {help && <p className="text-[11px] leading-snug text-slate-400">{help}</p>}
  </div>
);

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs outline-none transition-colors placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15";

/* ── Primitives ───────────────────────────────────────────────────── */

export const TextInput: React.FC<{
  label: string;
  help?: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  onChange: (value: string) => void;
}> = ({ label, help, value, placeholder, maxLength, onChange }) => {
  const id = useId();
  return (
    <FieldShell label={label} help={help} htmlFor={id}>
      <input
        id={id}
        type="text"
        className={inputClass}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  );
};

export const TextAreaInput: React.FC<{
  label: string;
  help?: string;
  value: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  onChange: (value: string) => void;
}> = ({ label, help, value, placeholder, rows = 3, maxLength, onChange }) => {
  const id = useId();
  return (
    <FieldShell label={label} help={help} htmlFor={id}>
      <textarea
        id={id}
        className={`${inputClass} resize-y leading-relaxed`}
        value={value}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  );
};

export const NumberInput: React.FC<{
  label: string;
  help?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}> = ({ label, help, value, min, max, step = 1, suffix, onChange }) => {
  const id = useId();
  return (
    <FieldShell label={label} help={help} htmlFor={id}>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          className={inputClass}
          value={Number.isFinite(value) ? value : ""}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isNaN(next)) return;
            // Clamp here rather than on blur so the preview never renders a
            // nonsensical value mid-typing.
            const clamped = Math.min(
              max ?? Number.POSITIVE_INFINITY,
              Math.max(min ?? Number.NEGATIVE_INFINITY, next)
            );
            onChange(clamped);
          }}
        />
        {suffix && (
          <span className="shrink-0 text-xs font-semibold text-slate-400">{suffix}</span>
        )}
      </div>
    </FieldShell>
  );
};

export const ToggleInput: React.FC<{
  label: string;
  help?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}> = ({ label, help, value, onChange }) => (
  <div className="flex items-start justify-between gap-4 py-0.5">
    <div className="space-y-0.5">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {help && <p className="text-[11px] leading-snug text-slate-400">{help}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`relative mt-0.5 h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
        value ? "bg-orange-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-xs transition-transform ${
          value ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  </div>
);

export const SelectInput: React.FC<{
  label: string;
  help?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}> = ({ label, help, value, options, onChange }) => {
  const id = useId();
  return (
    <FieldShell label={label} help={help} htmlFor={id}>
      <select
        id={id}
        className={`${inputClass} cursor-pointer`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
};

export const IconInput: React.FC<{
  label: string;
  help?: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, help, value, onChange }) => {
  const id = useId();
  return (
    <FieldShell label={label} help={help} htmlFor={id}>
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600">
          <ThemeIcon name={value} className="h-4 w-4" />
        </span>
        <select
          id={id}
          className={`${inputClass} cursor-pointer`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {ICON_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </FieldShell>
  );
};

export const DateTimeInput: React.FC<{
  label: string;
  help?: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, help, value, onChange }) => {
  const id = useId();
  return (
    <FieldShell label={label} help={help} htmlFor={id}>
      <input
        id={id}
        type="datetime-local"
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  );
};

/* ── Collection picker ────────────────────────────────────────────── */

interface CollectionOption {
  handle: string;
  title: string;
}

/**
 * The store's collections, fetched once and shared by every picker on screen —
 * a repeater with ten rows shouldn't mean ten identical requests.
 */
let collectionsPromise: Promise<CollectionOption[]> | null = null;

function loadCollections(): Promise<CollectionOption[]> {
  if (!collectionsPromise) {
    collectionsPromise = fetch("/api/admin/collections")
      .then((res) => (res.ok ? res.json() : { collections: [] }))
      .then((data) => (Array.isArray(data.collections) ? data.collections : []))
      .catch(() => []);
  }
  return collectionsPromise;
}

export const CollectionInput: React.FC<{
  label: string;
  help?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}> = ({ label, help, value, placeholder, onChange }) => {
  const id = useId();
  const [options, setOptions] = useState<CollectionOption[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadCollections().then((list) => {
      if (!cancelled) setOptions(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // A handle saved earlier may not be in the list (renamed, or the store is
  // unreachable) — keep it selectable so editing never silently drops it.
  const known = options ?? [];
  const missing = value && !known.some((c) => c.handle === value);

  return (
    <FieldShell label={label} help={help} htmlFor={id}>
      {options === null ? (
        <div className={`${inputClass} text-slate-400`}>Loading collections…</div>
      ) : options.length === 0 ? (
        <input
          id={id}
          type="text"
          className={inputClass}
          value={value}
          placeholder={placeholder ?? "collection-handle"}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <select
          id={id}
          className={`${inputClass} cursor-pointer`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Choose a collection…</option>
          {missing && <option value={value}>{value} (not found)</option>}
          {options.map((option) => (
            <option key={option.handle} value={option.handle}>
              {option.title}
            </option>
          ))}
        </select>
      )}
      {options !== null && options.length === 0 && (
        <p className="text-[11px] text-amber-600">
          Couldn&apos;t reach Shopify — type the handle manually.
        </p>
      )}
    </FieldShell>
  );
};

/* ── Image field ──────────────────────────────────────────────────── */

export const ImageInput: React.FC<{
  label: string;
  help?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}> = ({ label, help, value, placeholder, onChange }) => {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      onChange(data.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <FieldShell label={label} help={help} htmlFor={id}>
      <div className="flex items-start gap-2.5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value ? (
            // Arbitrary merchant-supplied URL, shown only inside the admin.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-full w-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-slate-300" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <input
            id={id}
            type="text"
            className={inputClass}
            value={value}
            placeholder={placeholder ?? "/uploads/... or https://..."}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 transition-colors hover:border-orange-300 hover:text-orange-600 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Upload className="h-3 w-3" />
              )}
              {uploading ? "Uploading…" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-bold text-slate-400 transition-colors hover:text-red-600"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
          {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />
    </FieldShell>
  );
};
