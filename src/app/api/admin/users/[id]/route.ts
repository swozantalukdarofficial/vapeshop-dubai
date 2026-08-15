import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";
import { deleteUser, updateUser, type UserRole } from "@/lib/auth/users";

async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return { denied: NextResponse.json({ error: "Not signed in." }, { status: 401 }) };
  }
  if (session.role !== "admin") {
    return {
      denied: NextResponse.json(
        { error: "Only admins can manage users." },
        { status: 403 }
      ),
    };
  }
  return { session };
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("denied" in auth) return auth.denied;

  const { id } = await props.params;

  let body: { name?: string; role?: UserRole; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = await updateUser(id, {
    name: body.name,
    role: body.role === "admin" || body.role === "editor" ? body.role : undefined,
    password: body.password || undefined,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ user: result.user });
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("denied" in auth) return auth.denied;

  const { id } = await props.params;

  if (auth.session.sub === id) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 400 }
    );
  }

  const result = await deleteUser(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
