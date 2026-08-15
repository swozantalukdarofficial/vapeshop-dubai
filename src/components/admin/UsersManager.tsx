"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Trash2, UserPlus } from "lucide-react";

import type { PublicUser, UserRole } from "@/lib/auth/users";

import { AdminUserMenu } from "./AdminUserMenu";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15";

const labelClass =
  "block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5";

export const UsersManager: React.FC<{
  currentUser: PublicUser;
  initialUsers: PublicUser[];
}> = ({ currentUser, initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" as UserRole,
  });
  const [creating, setCreating] = useState(false);

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create the user.");

      setUsers((prev) => [...prev, data.user]);
      setForm({ name: "", email: "", password: "", role: "editor" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const changeRole = async (user: PublicUser, role: UserRole) => {
    setBusyId(user.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update the user.");

      setUsers((prev) => prev.map((u) => (u.id === user.id ? data.user : u)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const resetPassword = async (user: PublicUser) => {
    const password = window.prompt(`New password for ${user.email} (min 8 characters):`);
    if (!password) return;

    setBusyId(user.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update the password.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const removeUser = async (user: PublicUser) => {
    if (!window.confirm(`Remove ${user.email}? They will lose access immediately.`)) {
      return;
    }

    setBusyId(user.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not remove the user.");

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex h-14 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin"
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Back to customizer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-[13px] font-black tracking-tight text-slate-800">
            Users &amp; access
          </h1>
        </div>
        <AdminUserMenu user={currentUser} />
      </header>

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-6">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12px] font-semibold text-red-700">
            <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Existing users */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-[13px] font-black text-slate-800">
              Team ({users.length})
            </h2>
            <p className="text-[11px] text-slate-400">
              Admins manage users and the theme. Editors can edit and publish the
              theme only.
            </p>
          </div>

          <ul className="divide-y divide-slate-100">
            {users.map((user) => {
              const isSelf = user.id === currentUser.id;
              const busy = busyId === user.id;

              return (
                <li
                  key={user.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-slate-800">
                      {user.name}
                      {isSelf && (
                        <span className="ml-2 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                          You
                        </span>
                      )}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {user.email}
                      {user.lastLoginAt &&
                        ` · last signed in ${new Date(user.lastLoginAt).toLocaleDateString()}`}
                    </p>
                  </div>

                  <select
                    value={user.role}
                    disabled={busy}
                    onChange={(e) => changeRole(user, e.target.value as UserRole)}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-700 outline-none focus:border-orange-500 disabled:opacity-50"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => resetPassword(user)}
                    disabled={busy}
                    title="Set a new password"
                    className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <KeyRound className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeUser(user)}
                    disabled={busy || isSelf}
                    title={isSelf ? "You cannot remove yourself" : "Remove user"}
                    className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Add a user */}
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-[13px] font-black text-slate-800">Add a user</h2>

          <form onSubmit={createUser} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="new-name" className={labelClass}>
                Name
              </label>
              <input
                id="new-name"
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="new-email" className={labelClass}>
                Email
              </label>
              <input
                id="new-email"
                type="email"
                required
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="new-password" className={labelClass}>
                Password
              </label>
              <input
                id="new-password"
                type="text"
                required
                minLength={8}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className={inputClass}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="new-role" className={labelClass}>
                Role
              </label>
              <select
                id="new-role"
                className={`${inputClass} cursor-pointer`}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-[12px] font-black uppercase tracking-wide text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
              >
                {creating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <UserPlus className="h-3.5 w-3.5" />
                )}
                Add user
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
