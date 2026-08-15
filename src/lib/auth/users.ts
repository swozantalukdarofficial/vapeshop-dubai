import { promises as fs } from "node:fs";
import path from "node:path";

import { hashPassword, randomId, verifyPassword } from "./crypto";

export type UserRole = "admin" | "editor";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
  lastLoginAt: string | null;
}

/** An `AdminUser` with the password hash stripped, safe to send to the client. */
export type PublicUser = Omit<AdminUser, "passwordHash">;

// Statically-scoped path — see the note in src/lib/theme/store.ts.
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(process.cwd(), "data", "admin-users.json");

/**
 * Built as an explicit allowlist rather than by omitting `passwordHash`, so
 * any secret field added to `AdminUser` later has to be opted in deliberately
 * instead of leaking to the client by default.
 */
export function toPublicUser(user: AdminUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function readUsersFile(): Promise<AdminUser[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AdminUser[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    console.error("[auth] could not read admin-users.json:", err);
    return [];
  }
}

async function writeUsersFile(users: AdminUser[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${USERS_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(users, null, 2), "utf8");
  await fs.rename(tmp, USERS_FILE);
}

/**
 * Create the very first admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if the
 * user list is empty, so a fresh clone isn't locked out of its own admin.
 * Once any user exists this is a no-op and the env vars are ignored.
 */
async function seedFirstUser(users: AdminUser[]): Promise<AdminUser[]> {
  if (users.length > 0) return users;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return users;

  const seeded = await createUserRecord({
    email,
    password,
    name: process.env.ADMIN_NAME ?? "Administrator",
    role: "admin",
  });
  await writeUsersFile([seeded]);
  console.info(`[auth] seeded first admin user: ${seeded.email}`);
  return [seeded];
}

async function createUserRecord(input: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}): Promise<AdminUser> {
  return {
    id: randomId(),
    email: normalizeEmail(input.email),
    name: input.name.trim() || normalizeEmail(input.email),
    role: input.role,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };
}

/* ── Public API ───────────────────────────────────────────────────── */

export async function listUsers(): Promise<PublicUser[]> {
  const users = await seedFirstUser(await readUsersFile());
  return users.map(toPublicUser);
}

export async function countUsers(): Promise<number> {
  return (await seedFirstUser(await readUsersFile())).length;
}

export async function findUserById(id: string): Promise<AdminUser | null> {
  const users = await readUsersFile();
  return users.find((u) => u.id === id) ?? null;
}

/** Verify credentials and stamp `lastLoginAt`. Returns null on any mismatch. */
export async function authenticate(
  email: string,
  password: string
): Promise<PublicUser | null> {
  const users = await seedFirstUser(await readUsersFile());
  const user = users.find((u) => u.email === normalizeEmail(email));
  if (!user) return null;

  if (!(await verifyPassword(password, user.passwordHash))) return null;

  user.lastLoginAt = new Date().toISOString();
  await writeUsersFile(users);
  return toPublicUser(user);
}

export async function createUser(input: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}): Promise<{ user: PublicUser } | { error: string }> {
  const users = await seedFirstUser(await readUsersFile());
  const email = normalizeEmail(input.email);

  if (!email.includes("@")) return { error: "Enter a valid email address." };
  if (input.password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (users.some((u) => u.email === email)) {
    return { error: "A user with that email already exists." };
  }

  const user = await createUserRecord({ ...input, email });
  await writeUsersFile([...users, user]);
  return { user: toPublicUser(user) };
}

export async function updateUser(
  id: string,
  patch: { name?: string; role?: UserRole; password?: string }
): Promise<{ user: PublicUser } | { error: string }> {
  const users = await readUsersFile();
  const user = users.find((u) => u.id === id);
  if (!user) return { error: "User not found." };

  // Never allow the last admin to be demoted — that would lock everyone out
  // of user management permanently.
  if (patch.role && patch.role !== "admin" && user.role === "admin") {
    const admins = users.filter((u) => u.role === "admin");
    if (admins.length <= 1) {
      return { error: "You cannot demote the only remaining admin." };
    }
  }

  if (patch.name !== undefined) user.name = patch.name.trim() || user.name;
  if (patch.role !== undefined) user.role = patch.role;
  if (patch.password !== undefined) {
    if (patch.password.length < 8) {
      return { error: "Password must be at least 8 characters." };
    }
    user.passwordHash = await hashPassword(patch.password);
  }

  await writeUsersFile(users);
  return { user: toPublicUser(user) };
}

export async function deleteUser(
  id: string
): Promise<{ ok: true } | { error: string }> {
  const users = await readUsersFile();
  const user = users.find((u) => u.id === id);
  if (!user) return { error: "User not found." };

  if (user.role === "admin") {
    const admins = users.filter((u) => u.role === "admin");
    if (admins.length <= 1) {
      return { error: "You cannot delete the only remaining admin." };
    }
  }

  await writeUsersFile(users.filter((u) => u.id !== id));
  return { ok: true };
}
