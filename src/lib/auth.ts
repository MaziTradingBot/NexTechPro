import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import type { AdminRole } from "@prisma/client";

const COOKIE = "admin_session";
const secret = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me",
);

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export async function createAdminSession(session: AdminSession): Promise<void> {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as AdminRole,
    };
  } catch {
    return null;
  }
}

/** Redirects to login if not authenticated, or to /admin if role not allowed. */
export async function requireAdmin(roles?: AdminRole[]): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (roles && !roles.includes(session.role)) redirect("/admin");
  return session;
}

// --- permission helpers (single source of truth for what each role can do) ---
export const can = {
  manageProducts: (r: AdminRole) => r === "GENERAL",
  manageAdmins: (r: AdminRole) => r === "GENERAL",
  managePayments: (r: AdminRole) => r === "GENERAL" || r === "PAYMENT",
  manageDelivery: (r: AdminRole) => r === "GENERAL" || r === "DELIVERY",
  viewOrders: (_r: AdminRole) => true,
};
