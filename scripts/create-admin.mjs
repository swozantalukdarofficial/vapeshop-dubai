#!/usr/bin/env node
/**
 * Create or update an admin-panel user.
 *
 *   npm run admin:create -- --email you@example.com --password "secret123" --name "Kamran" --role admin
 *
 * Runs standalone (no Next.js runtime), so it can be used on a server before
 * the app has ever started. Passwords are hashed with the same scrypt scheme
 * the app uses at `src/lib/auth/crypto.ts`.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "admin-users.json");

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      out[key] = next;
      i += 1;
    } else {
      out[key] = "true";
    }
  }
  return out;
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const email = (args.email ?? "").trim().toLowerCase();
  const password = args.password ?? "";
  const name = args.name ?? email;
  const role = args.role === "editor" ? "editor" : "admin";

  if (!email.includes("@") || password.length < 8) {
    console.error(
      "Usage: npm run admin:create -- --email <email> --password <min 8 chars> [--name <name>] [--role admin|editor]"
    );
    process.exit(1);
  }

  const users = await readUsers();
  const passwordHash = await hashPassword(password);
  const existing = users.find((u) => u.email === email);

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = name;
    existing.role = role;
    console.log(`Updated existing user ${email} (role: ${role}).`);
  } else {
    users.push({
      id: randomBytes(12).toString("hex"),
      email,
      name,
      role,
      passwordHash,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    });
    console.log(`Created user ${email} (role: ${role}).`);
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  console.log(`Saved to ${USERS_FILE}`);
  console.log("Sign in at /admin/login");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
