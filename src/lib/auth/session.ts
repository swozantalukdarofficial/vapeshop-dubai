import { cookies } from "next/headers";
import { adminAuth } from "../firebase/admin";
import type { PublicUser } from "./users";

export const SESSION_COOKIE = "vs_admin_session";

/** How long a login lasts before the user has to sign in again. */
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 5; // 5 days, max allowed by Firebase is 14 days

export interface SessionPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

/**
 * We no longer use custom JWTs. Firebase creates the session cookie.
 */
export async function setSessionCookie(idToken: string): Promise<void> {
  const store = await cookies();
  const expiresIn = SESSION_TTL_SECONDS * 1000;
  
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
  
  store.set(SESSION_COOKIE, sessionCookie, {
    maxAge: SESSION_TTL_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Read and verify the session on the server. Null when signed out. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const sessionCookie = store.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      sub: decodedClaims.uid,
      email: decodedClaims.email || "",
      role: (decodedClaims.role as string) || "editor", // Fallback to editor if no role
      exp: decodedClaims.exp,
    };
  } catch (error) {
    // Invalid or expired session cookie
    return null;
  }
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
