import { promises as fs } from "node:fs";
import path from "node:path";

import { DEFAULT_THEME_SETTINGS } from "./defaults";
import { normalizeSettings } from "./merge";
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
const DATA_DIR = path.join(process.cwd(), "data");
const DRAFT_FILE = path.join(process.cwd(), "data", "theme-draft.json");
const PUBLISHED_FILE = path.join(process.cwd(), "data", "theme-published.json");

const fileStorage: ThemeStorage = {
  async read(slot) {
    try {
      const raw = await fs.readFile(
        slot === "draft" ? DRAFT_FILE : PUBLISHED_FILE,
        "utf8"
      );
      const parsed = JSON.parse(raw) as Partial<ThemeSettingsRecord>;
      return {
        settings: normalizeSettings(parsed.settings),
        updatedAt: parsed.updatedAt ?? new Date(0).toISOString(),
        updatedBy: parsed.updatedBy ?? null,
      };
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOENT") return null;
      // A corrupt file should not take the storefront down — fall back to
      // defaults and surface the problem in the server log.
      console.error(`[theme] could not read ${slot} settings:`, err);
      return null;
    }
  },

  async write(slot, record) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const file = slot === "draft" ? DRAFT_FILE : PUBLISHED_FILE;
    // Write-then-rename so a crash mid-write can't leave a truncated file.
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(record, null, 2), "utf8");
    await fs.rename(tmp, file);
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
