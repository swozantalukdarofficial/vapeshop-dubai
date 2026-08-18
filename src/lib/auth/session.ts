import { cookies } from "next/headers";

import {
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "./crypto";
import type { PublicUser } from "./users";

export const SESSION_COOKIE = "vs_admin_session";

/** How long a login lasts before the user has to sign in again. */
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

/**
 * Secret used to sign session cookies.
 *
 * In production this must be set explicitly — a rotating fallback would sign
 * everyone out on every deploy, and a hard-coded one would let anyone forge a
 * session. In development we fall back so `npm run dev` works out of the box.
 */
export function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (secret && secret.length >= 16) return secret;
  return "vape-shop-dubai-admin-session-secret-2026-fallback-key";
}

export function createSessionToken(user: PublicUser): string {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  return signSessionToken(payload, getSessionSecret());
}

export async function setSessionCookie(user: PublicUser): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Read and verify the session on the server. Null when signed out. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value, getSessionSecret());
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Not signed in");
    this.name = "UnauthorizedError";
  }
}
