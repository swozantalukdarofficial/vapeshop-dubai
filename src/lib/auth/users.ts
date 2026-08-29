import { adminAuth } from "../firebase/admin";

export type UserRole = "admin" | "editor";

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string | null;
}

export function toPublicUser(user: any): PublicUser {
  return {
    id: user.uid,
    email: user.email || "",
    name: user.displayName || user.email || "",
    role: (user.customClaims?.role as UserRole) || "editor",
    createdAt: user.metadata.creationTime || new Date().toISOString(),
    lastLoginAt: user.metadata.lastSignInTime || null,
  };
}

export async function listUsers(): Promise<PublicUser[]> {
  try {
    const listUsersResult = await adminAuth.listUsers(1000);
    return listUsersResult.users.map(toPublicUser);
  } catch (error) {
    console.error("[auth] listUsers error:", error);
    return [];
  }
}

export async function countUsers(): Promise<number> {
  try {
    const listUsersResult = await adminAuth.listUsers(1000);
    return listUsersResult.users.length;
  } catch (error) {
    return 0;
  }
}

export async function findUserById(id: string): Promise<PublicUser | null> {
  try {
    const user = await adminAuth.getUser(id);
    return toPublicUser(user);
  } catch (error) {
    return null;
  }
}

export async function createUser(input: {
  email: string;
  password?: string;
  name: string;
  role: UserRole;
}): Promise<{ user: PublicUser } | { error: string }> {
  try {
    const userRecord = await adminAuth.createUser({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      displayName: input.name.trim(),
    });

    await adminAuth.setCustomUserClaims(userRecord.uid, { role: input.role });
    const user = await adminAuth.getUser(userRecord.uid);

    return { user: toPublicUser(user) };
  } catch (error: any) {
    return { error: error.message || "Failed to create user." };
  }
}

export async function updateUser(
  id: string,
  patch: { name?: string; role?: UserRole; password?: string }
): Promise<{ user: PublicUser } | { error: string }> {
  try {
    const updateData: any = {};
    if (patch.name !== undefined) updateData.displayName = patch.name.trim();
    if (patch.password !== undefined) updateData.password = patch.password;

    if (Object.keys(updateData).length > 0) {
      await adminAuth.updateUser(id, updateData);
    }

    if (patch.role !== undefined) {
      // Prevent demoting the last admin
      if (patch.role !== "admin") {
        const users = await listUsers();
        const admins = users.filter((u) => u.role === "admin");
        if (admins.length <= 1 && admins[0]?.id === id) {
          return { error: "You cannot demote the only remaining admin." };
        }
      }
      await adminAuth.setCustomUserClaims(id, { role: patch.role });
    }

    const updatedUser = await adminAuth.getUser(id);
    return { user: toPublicUser(updatedUser) };
  } catch (error: any) {
    return { error: error.message || "Failed to update user." };
  }
}

export async function deleteUser(
  id: string
): Promise<{ ok: true } | { error: string }> {
  try {
    const users = await listUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return { error: "User not found." };

    if (user.role === "admin") {
      const admins = users.filter((u) => u.role === "admin");
      if (admins.length <= 1) {
        return { error: "You cannot delete the only remaining admin." };
      }
    }

    await adminAuth.deleteUser(id);
    return { ok: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete user." };
  }
}
