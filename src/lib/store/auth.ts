"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
}

interface StoredUser extends User {
  password?: string;
}

interface AuthResult {
  ok: boolean;
  error?: "exists" | "not-found" | "wrong-password";
}

interface AuthState {
  user: User | null;
  users: StoredUser[];
  hasHydrated: boolean;
  register: (name: string, email: string, password: string) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  loginWithGoogle: () => void;
  logout: () => void;
  changePassword: (
    current: string,
    next: string,
  ) => { ok: boolean; error?: "not-logged-in" | "google-account" | "wrong-password" | "too-short" };
}

/**
 * DEMO auth only — accounts (and passwords) are stored in localStorage so the
 * whole flow works with zero setup. This is NOT secure and must be replaced by
 * NextAuth (Google OAuth + hashed credentials) before going live. See README.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      hasHydrated: false,
      register: (name, email, password) => {
        const users = get().users;
        const normalized = email.trim().toLowerCase();
        if (users.some((u) => u.email === normalized)) {
          return { ok: false, error: "exists" };
        }
        const user: StoredUser = {
          id: `u_${Date.now().toString(36)}`,
          name: name.trim(),
          email: normalized,
          password,
          provider: "email",
        };
        set({ users: [...users, user], user: stripPassword(user) });
        return { ok: true };
      },
      login: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const found = get().users.find((u) => u.email === normalized);
        if (!found) return { ok: false, error: "not-found" };
        if (found.password !== password) return { ok: false, error: "wrong-password" };
        set({ user: stripPassword(found) });
        return { ok: true };
      },
      loginWithGoogle: () => {
        // Demo Google sign-in — creates/uses a fixed demo account.
        const email = "demo.google@nextechpro.ua";
        const existing = get().users.find((u) => u.email === email);
        if (existing) {
          set({ user: stripPassword(existing) });
          return;
        }
        const user: StoredUser = {
          id: "u_google_demo",
          name: "Google User",
          email,
          provider: "google",
        };
        set({ users: [...get().users, user], user: stripPassword(user) });
      },
      logout: () => set({ user: null }),
      changePassword: (current, next) => {
        const u = get().user;
        if (!u) return { ok: false, error: "not-logged-in" };
        if (u.provider === "google") return { ok: false, error: "google-account" };
        if (next.length < 6) return { ok: false, error: "too-short" };
        const stored = get().users.find((x) => x.id === u.id);
        if (!stored || stored.password !== current) return { ok: false, error: "wrong-password" };
        set({
          users: get().users.map((x) => (x.id === u.id ? { ...x, password: next } : x)),
        });
        return { ok: true };
      },
    }),
    {
      name: "nextech-auth",
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);

function stripPassword(u: StoredUser): User {
  const { password: _password, ...rest } = u;
  void _password;
  return rest;
}
