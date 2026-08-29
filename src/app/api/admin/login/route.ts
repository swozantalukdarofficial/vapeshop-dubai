import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  let body: { idToken?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const idToken = body.idToken;

  if (!idToken) {
    return NextResponse.json(
      { error: "Firebase ID token is required." },
      { status: 400 }
    );
  }

  try {
    // We let the session cookie function handle verification
    await setSessionCookie(idToken);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin] login failed:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Sign-in failed." },
      { status: 401 }
    );
  }
}
