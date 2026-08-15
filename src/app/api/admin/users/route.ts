import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";
import { createUser, listUsers, type UserRole } from "@/lib/auth/users";

/** Only admins manage accounts; editors may still edit the theme. */
async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Only admins can manage users." },
      { status: 403 }
    );
  }
  return null;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  return NextResponse.json({ users: await listUsers() });
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: {
    email?: string;
    password?: string;
    name?: string;
    role?: UserRole;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const result = await createUser({
    email: body.email,
    password: body.password,
    name: body.name ?? "",
    role: body.role === "admin" ? "admin" : "editor",
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ user: result.user }, { status: 201 });
}
