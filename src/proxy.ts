import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { adminAuth } from "@/lib/firebase/admin";

/** Reachable while signed out — everything else under /admin requires a session. */
const PUBLIC_PATHS = new Set([
  "/admin/login",
  "/api/admin/login",
  "/api/admin/logout",
]);

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  let session = null;
  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
    if (sessionCookie) {
      session = await adminAuth.verifySessionCookie(sessionCookie, true);
    }
  } catch (err) {
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
