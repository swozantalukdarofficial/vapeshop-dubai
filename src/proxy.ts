import { NextResponse, type NextRequest } from "next/server";

import { verifySessionToken } from "@/lib/auth/crypto";
import { SESSION_COOKIE, getSessionSecret } from "@/lib/auth/session";

/**
 * Route guard for the theme customizer.
 *
 * Runs on the Node.js runtime (the Next 16 default for proxy), so the same
 * `node:crypto` HMAC verification used elsewhere works here unchanged.
 */

/** Reachable while signed out — everything else under /admin requires a session. */
const PUBLIC_PATHS = new Set([
  "/admin/login",
  "/api/admin/login",
  "/api/admin/logout",
]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  let session = null;
  try {
    session = verifySessionToken(
      request.cookies.get(SESSION_COOKIE)?.value,
      getSessionSecret()
    );
  } catch (err) {
    // Misconfigured ADMIN_SESSION_SECRET in production. Treat as signed out so
    // the login route can surface the real error instead of a blank 500.
    console.error("[admin] session verification unavailable:", err);
  }

  if (PUBLIC_PATHS.has(pathname)) {
    // Don't show the login form to someone who is already signed in.
    if (pathname === "/admin/login" && session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Not signed in." },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
