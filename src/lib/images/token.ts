import { createCipheriv, createDecipheriv, createHash, createHmac } from "node:crypto";

/**
 * Turns a remote image URL into an opaque path segment, and back again.
 *
 * Why encrypt rather than just base64: base64 is trivially reversible, so a
 * base64 token would still show the Shopify URL to anyone who decoded it —
 * which defeats the point of hiding the CDN.
 *
 * Why a *deterministic* IV: the same source URL must always produce the same
 * token. Tokens appear in rendered HTML, are cached by the CDN for a year, and
 * are indexed by Google Images — a random IV per call would produce a new URL
 * on every render, so nothing would ever cache and image search would churn.
 *
 * Reusing an IV across *different* plaintexts breaks GCM badly, but here the IV
 * is derived from the plaintext itself, so a given IV is only ever paired with
 * the one plaintext that produced it. (The plaintext is a public product photo
 * URL, so this is about opacity, not secrecy.)
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getSecret(): Buffer {
  const secret = process.env.IMAGE_PROXY_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "IMAGE_PROXY_SECRET is missing or too short (need >= 16 chars). " +
        "Image proxying is disabled until it is set."
    );
  }
  // Normalises any passphrase to the 32 bytes AES-256 needs.
  return createHash("sha256").update(secret).digest();
}

export function isImageProxyConfigured(): boolean {
  const secret = process.env.IMAGE_PROXY_SECRET;
  return Boolean(secret && secret.length >= 16);
}

function deriveIv(key: Buffer, plaintext: string): Buffer {
  return createHmac("sha256", key).update(plaintext).digest().subarray(0, IV_LENGTH);
}

function toBase64Url(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Buffer {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64");
}

/** Encrypts a source URL into a URL-safe token. */
export function sealImageUrl(sourceUrl: string): string {
  const key = getSecret();
  const iv = deriveIv(key, sourceUrl);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(sourceUrl, "utf8"), cipher.final()]);
  // iv || tag || ciphertext
  return toBase64Url(Buffer.concat([iv, cipher.getAuthTag(), ciphertext]));
}

/**
 * Reverses `sealImageUrl`. Returns null for anything we didn't mint — a tampered
 * token fails the GCM auth tag, which is what stops this being an open proxy.
 */
export function unsealImageUrl(token: string): string | null {
  try {
    const key = getSecret();
    const raw = fromBase64Url(token);
    if (raw.length <= IV_LENGTH + TAG_LENGTH) return null;

    const iv = raw.subarray(0, IV_LENGTH);
    const tag = raw.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const ciphertext = raw.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");

    // Re-derive the IV: proves the token was minted from this exact plaintext and
    // wasn't assembled by replaying pieces of other tokens.
    if (!deriveIv(key, plaintext).equals(iv)) return null;

    return plaintext;
  } catch {
    return null;
  }
}
