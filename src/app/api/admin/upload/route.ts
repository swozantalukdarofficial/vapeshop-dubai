import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import crypto from "node:crypto";

import { getSession } from "@/lib/auth/session";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * SVG is deliberately absent: it can carry <script>, and served from our own origin
 * that's stored XSS. Re-add only behind a sanitiser (and a CSP).
 *
 * The extension comes from sniffing the file's own bytes below, not from `file.type`
 * or the filename — both are client-controlled.
 */
const ALLOWED_EXTENSIONS = ["png", "jpg", "webp", "avif", "gif"] as const;

type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

/** Identifies the real format from magic bytes. Null when it isn't an image we accept. */
function sniffImageExtension(buffer: Buffer): AllowedExtension | null {
  if (buffer.length < 12) return null;

  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "png";
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") {
    return "webp";
  }
  if (buffer.subarray(4, 8).toString("ascii") === "ftyp" && buffer.subarray(8, 12).toString("ascii").startsWith("avi")) {
    return "avif";
  }
  const gifHeader = buffer.subarray(0, 6).toString("ascii");
  if (gifHeader === "GIF87a" || gifHeader === "GIF89a") {
    return "gif";
  }

  return null;
}

function slugify(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "image"
  );
}

export async function POST(request: Request) {
  // `proxy.ts` already guards /api/admin/*, but this route writes files — don't let it
  // depend solely on a matcher pattern that lives in another file.
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // Checked before reading the body into memory.
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is larger than 5 MB." },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = sniffImageExtension(buffer);
  if (!extension) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PNG, JPEG, WebP, AVIF or GIF." },
      { status: 415 }
    );
  }

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    // Random suffix keeps re-uploads of the same filename from clobbering each
    // other and busts any CDN cache on the old URL.
    const filename = `${slugify(file.name)}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[admin] upload failed:", err);
    return NextResponse.json(
      { error: "Could not save the file. Check that public/uploads is writable." },
      { status: 500 }
    );
  }
}
