import { NextResponse } from "next/server";

import { setSessionCookie } from "@/lib/auth/session";
import { authenticate, countUsers } from "@/lib/auth/users";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    const user = await authenticate(email, password);

    if (!user) {
      // Distinguish "nobody has been set up yet" from a wrong password — the
      // former is a setup problem the operator needs told about.
      if ((await countUsers()) === 0) {
        return NextResponse.json(
          {
            error:
              "No admin users exist yet. Run `npm run admin:create` or set ADMIN_EMAIL and ADMIN_PASSWORD in .env.",
          },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    await setSessionCookie(user);
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[admin] login failed:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Sign-in failed." },
      { status: 500 }
    );
  }
}
