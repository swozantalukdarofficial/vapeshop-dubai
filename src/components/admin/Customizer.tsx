"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Monitor,
  RotateCcw,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";

import {
  PREVIEW_MESSAGES,
  PREVIEW_PARAM,
} from "@/context/ThemeSettingsContext";
import type { PublicUser } from "@/lib/auth/users";
import { SECTION_SCHEMA_BY_ID } from "@/lib/theme/schema";
import type { SectionId, ThemeSettings } from "@/lib/theme/types";

import { AdminUserMenu } from "./AdminUserMenu";
import { FieldRenderer } from "./FieldRenderer";
import { useDragList } from "./use-drag-list";

const DEVICES = {
  desktop: { label: "Desktop", icon: Monitor, width: "100%" },
  tablet: { label: "Tablet", icon: Tablet, width: "834px" },
  mobile: { label: "Mobile", icon: Smartphone, width: "390px" },
} as const;

type DeviceKey = keyof typeof DEVICES;
type SaveState = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DELAY_MS = 1200;

function sameSettings(a: ThemeSettings, b: ThemeSettings): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const Customizer: React.FC<{
  user: PublicUser;
  initialDraft: ThemeSettings;
  initialPublished: ThemeSettings;
}> = ({ user, initialDraft, initialPublished }) => {
  const [settings, setSettings] = useState<ThemeSettings>(initialDraft);
  const [published, setPublished] = useState<ThemeSettings>(initialPublished);
  const [selected, setSelected] = useState<SectionId | null>(null);
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Lets the long-lived `message` listener below read the newest settings
  // without having to resubscribe on every keystroke.
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const hasUnpublished = useMemo(
    () => !sameSettings(settings, published),
    [settings, published]
  );

  // The storefront's age gate is a fixed overlay that would otherwise cover
  // the whole preview. The admin shares an origin with the storefront, so
  // setting the flag here also satisfies the gate inside the iframe.
  useEffect(() => {
    try {
      localStorage.setItem("vapedubai_age_verified", "true");
    } catch {
      // Private browsing with storage disabled — the gate stays, which is
      // inconvenient but not broken.
    }
  }, []);

  /* ── Preview bridge ─────────────────────────────────────────────── */

  const pushToPreview = useCallback((next: ThemeSettings) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: PREVIEW_MESSAGES.settings, settings: next },
      window.location.origin
    );
  }, []);

  useEffect(() => {
    // The frame re-announces itself on every load, including navigations
    // inside the preview, so this is where we (re)seed it with the draft.
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if ((event.data as { type?: string })?.type === PREVIEW_MESSAGES.ready) {
        pushToPreview(settingsRef.current);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [pushToPreview]);

  useEffect(() => {
    pushToPreview(settings);
  }, [settings, pushToPreview]);

  const scrollPreviewTo = useCallback((sectionId: SectionId) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: PREVIEW_MESSAGES.scrollTo, sectionId },
      window.location.origin
    );
  }, []);

  /* ── Persistence ────────────────────────────────────────────────── */

  const saveDraft = useCallback(async (next: ThemeSettings) => {
    setSaveState("saving");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save.");
      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
      setErrorMessage((err as Error).message);
    }
  }, []);

  // Debounced autosave: the preview is already live, so persisting on every
  // keystroke would only add write churn.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => void saveDraft(settings), AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [settings, saveDraft]);

  const runAction = async (
    action: "publish" | "discard" | "reset",
    confirmMessage?: string
  ) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setPublishing(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          settings: action === "publish" ? settings : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Action failed.");

      if (data.draft?.settings) setSettings(data.draft.settings);
      if (data.published?.settings) setPublished(data.published.settings);
      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
      setErrorMessage((err as Error).message);
    } finally {
      setPublishing(false);
    }
  };

  /* ── Editing helpers ────────────────────────────────────────────── */

  const updateSectionField = (sectionId: SectionId, key: string, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { ...prev.sections[sectionId], [key]: value },
      },
    }));
  };

  const toggleSection = (sectionId: SectionId) => {
    setSettings((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: {
          ...prev.sections[sectionId],
          enabled: !prev.sections[sectionId].enabled,
        },
      },
    }));
  };

  const setOrder = (order: SectionId[]) => {
    setSettings((prev) => ({ ...prev, sectionOrder: order }));
  };

  const { overIndex, dragIndex, itemProps, handleProps } = useDragList(
    settings.sectionOrder,
    setOrder
  );

  const previewSrc = `/?${PREVIEW_PARAM}=1`;
  const selectedSchema = selected ? SECTION_SCHEMA_BY_ID[selected] : null;

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      {/* ── Top bar ───────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-[13px] font-black text-white">
            V
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-[13px] font-black tracking-tight text-slate-800">
              Theme customizer
            </h1>
            <p className="truncate text-[11px] text-slate-400">Homepage</p>
          </div>
        </div>

        {/* Device switcher */}
        <div className="hidden items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 md:flex">
          {(Object.keys(DEVICES) as DeviceKey[]).map((key) => {
            const { label, icon: Icon } = DEVICES[key];
            const active = device === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setDevice(key)}
                aria-pressed={active}
                title={label}
                className={`cursor-pointer rounded-md px-2.5 py-1.5 transition-colors ${
                  active
                    ? "bg-white text-orange-600 shadow-xs"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <SaveIndicator state={saveState} hasUnpublished={hasUnpublished} />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Open live site in a new tab"
            className="hidden cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 sm:block"
          >
            <ExternalLink className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() =>
              runAction(
                "discard",
                "Discard all unpublished changes and revert to the live version?"
              )
            }
            disabled={publishing || !hasUnpublished}
            className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Discard
          </button>

          <button
            type="button"
            onClick={() => runAction("publish")}
            disabled={publishing || !hasUnpublished}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-1.5 text-[12px] font-black uppercase tracking-wide text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {publishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Publish
          </button>

          <AdminUserMenu user={user} />
        </div>
      </header>

      {errorMessage && (
        <div className="flex shrink-0 items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2 text-[12px] font-semibold text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="flex w-[340px] shrink-0 flex-col border-r border-slate-200 bg-white">
          {selectedSchema ? (
            <>
              <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Back to sections"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-[13px] font-black text-slate-800">
                    {selectedSchema.label}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection(selectedSchema.id)}
                  title={
                    settings.sections[selectedSchema.id].enabled
                      ? "Hide section"
                      : "Show section"
                  }
                  className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  {settings.sections[selectedSchema.id].enabled ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-slate-300" />
                  )}
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3.5 py-4">
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {selectedSchema.description}
                </p>

                {selectedSchema.fields.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-[12px] text-slate-400">
                    This section has no editable content.
                  </p>
                ) : (
                  selectedSchema.fields.map((field) => (
                    <FieldRenderer
                      key={field.key}
                      field={field}
                      values={
                        settings.sections[selectedSchema.id] as unknown as Record<
                          string,
                          unknown
                        >
                      }
                      onChange={(key, value) =>
                        updateSectionField(selectedSchema.id, key, value)
                      }
                    />
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="shrink-0 border-b border-slate-200 px-3.5 py-2.5">
                <h2 className="text-[13px] font-black text-slate-800">Sections</h2>
                <p className="text-[11px] text-slate-400">
                  Drag to reorder · click to edit
                </p>
              </div>

              <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
                {settings.sectionOrder.map((id, index) => {
                  const schema = SECTION_SCHEMA_BY_ID[id];
                  const enabled = settings.sections[id].enabled;

                  return (
                    <div
                      key={id}
                      {...itemProps(index)}
                      className={`flex items-center gap-1 rounded-lg border transition-colors ${
                        overIndex === index && dragIndex !== null && dragIndex !== index
                          ? "border-orange-400 bg-orange-50/40"
                          : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                      } ${dragIndex === index ? "opacity-50" : ""}`}
                    >
                      <span
                        {...handleProps(index)}
                        className="cursor-grab rounded p-1.5 text-slate-300 transition-colors hover:text-slate-500 active:cursor-grabbing"
                        aria-label={`Reorder ${schema.label}`}
                      >
                        <GripVertical className="h-3.5 w-3.5" />
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setSelected(id);
                          scrollPreviewTo(id);
                        }}
                        className="min-w-0 flex-1 cursor-pointer py-2 text-left"
                      >
                        <span
                          className={`block truncate text-[13px] font-bold ${
                            enabled ? "text-slate-700" : "text-slate-300"
                          }`}
                        >
                          {schema.label}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleSection(id)}
                        title={enabled ? "Hide section" : "Show section"}
                        className="cursor-pointer rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      >
                        {enabled ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5 text-slate-300" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="shrink-0 border-t border-slate-200 p-2.5">
                <button
                  type="button"
                  onClick={() =>
                    runAction(
                      "reset",
                      "Replace every section with the original factory content? This affects the draft only — you still need to publish."
                    )
                  }
                  disabled={publishing}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset to defaults
                </button>
              </div>
            </>
          )}
        </aside>

        {/* Preview */}
        <main className="min-w-0 flex-1 overflow-auto bg-slate-200/70 p-4">
          <div
            className="mx-auto h-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition-[width] duration-300"
            style={{ width: DEVICES[device].width, maxWidth: "100%" }}
          >
            <iframe
              ref={iframeRef}
              src={previewSrc}
              title="Storefront preview"
              className="h-full w-full border-0"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

/* ── Save status pill ─────────────────────────────────────────────── */

const SaveIndicator: React.FC<{ state: SaveState; hasUnpublished: boolean }> = ({
  state,
  hasUnpublished,
}) => {
  if (state === "saving") {
    return (
      <span className="hidden items-center gap-1.5 text-[11px] font-bold text-slate-400 sm:inline-flex">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving…
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="hidden items-center gap-1.5 text-[11px] font-bold text-red-600 sm:inline-flex">
        <AlertCircle className="h-3 w-3" />
        Not saved
      </span>
    );
  }
  if (hasUnpublished) {
    return (
      <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 sm:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Unpublished changes
      </span>
    );
  }
  return (
    <span className="hidden items-center gap-1.5 text-[11px] font-bold text-emerald-600 sm:inline-flex">
      <Check className="h-3 w-3" />
      Live
    </span>
  );
};
