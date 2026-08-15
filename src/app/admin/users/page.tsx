import { redirect } from "next/navigation";

import { UsersManager } from "@/components/admin/UsersManager";
import { getSession } from "@/lib/auth/session";
import { findUserById, listUsers, toPublicUser } from "@/lib/auth/users";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  // Editors can customize the theme but not manage who has access.
  if (session.role !== "admin") redirect("/admin");

  const user = await findUserById(session.sub);
  if (!user) redirect("/admin/login");

  return (
    <UsersManager
      currentUser={toPublicUser(user)}
      initialUsers={await listUsers()}
    />
  );
}
