import { promises as fs } from "node:fs";
import path from "node:path";

import { DEFAULT_THEME_SETTINGS } from "./defaults";
import { normalizeSettings } from "./normalize";
import type { ThemeSettings, ThemeSettingsRecord } from "./types";

/**
 * Persistence for theme settings.
 *
 * Two records are kept, mirroring Shopify's customizer: a `draft` the admin
 * edits freely, and a `published` copy the storefront reads. Publishing copies
 * draft over published.
 *
 * ── Swapping storage ──────────────────────────────────────────────────────
 * Everything below the `ThemeStorage` interface is a plain JSON-file adapter.
 * A file on disk does NOT survive on serverless hosts (Vercel, Netlify) where
 * the filesystem is read-only and ephemeral — to deploy there, implement the
 * same interface against Redis/Postgres and swap `storage` at the bottom of
 * this file. Nothing else in the app needs to change.
 */

export interface ThemeStorage {
  read(slot: "draft" | "published"): Promise<ThemeSettingsRecord | null>;
  write(slot: "draft" | "published", record: ThemeSettingsRecord): Promise<void>;
}

/**
 * Paths are built from `process.cwd()` plus string literals rather than a
 * configurable base directory. An env-driven path reads as "dynamic" to the
 * build's static analysis, which then traces the entire project — `public/`
 * included — into the server bundle. To store the data elsewhere, symlink
 * `./data` at the target, or swap the adapter below.
 */
import os from "node:os";

const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const WRITABLE_DIR = IS_SERVERLESS ? path.join(os.tmpdir(), "vape_shop_data") : path.join(process.cwd(), "data");
const BUNDLED_DIR = path.join(process.cwd(), "data");

const fileStorage: ThemeStorage = {
  async read(slot) {
    const fileName = slot === "draft" ? "theme-draft.json" : "theme-published.json";

    // 1. Try writable dir
    try {
      const raw = await fs.readFile(path.join(WRITABLE_DIR, fileName), "utf8");
      const parsed = JSON.parse(raw) as Partial<ThemeSettingsRecord>;
      return {
        settings: normalizeSettings(parsed.settings),
        updatedAt: parsed.updatedAt ?? new Date(0).toISOString(),
        updatedBy: parsed.updatedBy ?? null,
      };
    } catch {
      // Ignore read miss
    }

    // 2. Try bundled dir
    try {
      const raw = await fs.readFile(path.join(BUNDLED_DIR, fileName), "utf8");
      const parsed = JSON.parse(raw) as Partial<ThemeSettingsRecord>;
      return {
        settings: normalizeSettings(parsed.settings),
        updatedAt: parsed.updatedAt ?? new Date(0).toISOString(),
        updatedBy: parsed.updatedBy ?? null,
      };
    } catch {
      // Ignore read miss
    }

    return null;
  },

  async write(slot, record) {
    try {
      await fs.mkdir(WRITABLE_DIR, { recursive: true });
      const fileName = slot === "draft" ? "theme-draft.json" : "theme-published.json";
      const file = path.join(WRITABLE_DIR, fileName);
      // Write-then-rename so a crash mid-write can't leave a truncated file.
      const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(record, null, 2), "utf8");
      await fs.rename(tmp, file);
    } catch (err) {
      console.warn(`[theme] could not write ${slot} settings to disk:`, err);
    }
  },
};

const storage: ThemeStorage = fileStorage;

/* ── Public API ───────────────────────────────────────────────────── */

function defaultRecord(): ThemeSettingsRecord {
  return {
    settings: structuredClone(DEFAULT_THEME_SETTINGS),
    updatedAt: new Date(0).toISOString(),
    updatedBy: null,
  };
}

/** Settings the storefront renders. Never throws — falls back to defaults. */
export async function readPublishedRecord(): Promise<ThemeSettingsRecord> {
  return (await storage.read("published")) ?? defaultRecord();
}

/** Settings the admin is editing. Seeds from published on first use. */
export async function readDraftRecord(): Promise<ThemeSettingsRecord> {
  return (await storage.read("draft")) ?? (await readPublishedRecord());
}

export async function writeDraft(
  settings: ThemeSettings,
  updatedBy: string | null
): Promise<ThemeSettingsRecord> {
  const record: ThemeSettingsRecord = {
    settings: normalizeSettings(settings),
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  await storage.write("draft", record);
  return record;
}

/** Copy the current draft over the published record. */
export async function publishDraft(
  updatedBy: string | null
): Promise<ThemeSettingsRecord> {
  const draft = await readDraftRecord();
  const record: ThemeSettingsRecord = {
    settings: draft.settings,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  await storage.write("published", record);
  await storage.write("draft", record);
  return record;
}

/** Throw away unpublished edits by copying published back over the draft. */
export async function discardDraft(): Promise<ThemeSettingsRecord> {
  const published = await readPublishedRecord();
  await storage.write("draft", published);
  return published;
}

/** Restore the factory content into the draft (still needs publishing). */
export async function resetDraftToDefaults(
  updatedBy: string | null
): Promise<ThemeSettingsRecord> {
  return writeDraft(structuredClone(DEFAULT_THEME_SETTINGS), updatedBy);
}
