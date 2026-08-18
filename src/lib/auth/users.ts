import { promises as fs } from "node:fs";
import os from "node:os";
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

const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const WRITABLE_DIR = IS_SERVERLESS ? path.join(os.tmpdir(), "vape_shop_data") : path.join(process.cwd(), "data");
const BUNDLED_DIR = path.join(process.cwd(), "data");

const WRITABLE_USERS_FILE = path.join(WRITABLE_DIR, "admin-users.json");
const BUNDLED_USERS_FILE = path.join(BUNDLED_DIR, "admin-users.json");

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
    const raw = await fs.readFile(WRITABLE_USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as AdminUser[];
  } catch {
    // Ignore writable read miss
  }

  try {
    const raw = await fs.readFile(BUNDLED_USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as AdminUser[];
  } catch {
    // Ignore bundled read miss
  }

  return [];
}

async function writeUsersFile(users: AdminUser[]): Promise<void> {
  try {
    await fs.mkdir(WRITABLE_DIR, { recursive: true });
    const tmp = `${WRITABLE_USERS_FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(users, null, 2), "utf8");
    await fs.rename(tmp, WRITABLE_USERS_FILE);
  } catch (err) {
    console.warn("[auth] could not write admin-users.json to disk:", err);
  }
}

/**
 * Create the very first admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if the
 * user list is empty, so a fresh clone isn't locked out of its own admin.
 * Once any user exists this is a no-op and the env vars are ignored.
 */
async function seedFirstUser(users: AdminUser[]): Promise<AdminUser[]> {
  if (users.length > 0) return users;

  const email = process.env.ADMIN_EMAIL || "kamran@codixel.tech";
  const password = process.env.ADMIN_PASSWORD || "admin123456";

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
  const normalized = normalizeEmail(email);
  const users = await seedFirstUser(await readUsersFile());
  const user = users.find((u) => u.email === normalized);
  if (user) {
    const valid = await verifyPassword(password, user.passwordHash);
    if (valid) {
      user.lastLoginAt = new Date().toISOString();
      await writeUsersFile(users);
      return toPublicUser(user);
    }
  }

  // Direct environment variable fallback for emergency serverless access
  const envEmail = normalizeEmail(process.env.ADMIN_EMAIL || "");
  const envPassword = process.env.ADMIN_PASSWORD || "";
  if (envEmail && envPassword && normalized === envEmail && password === envPassword) {
    return {
      id: "env-admin",
      email: envEmail,
      name: process.env.ADMIN_NAME || "Administrator",
      role: "admin",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  }

  return null;
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
