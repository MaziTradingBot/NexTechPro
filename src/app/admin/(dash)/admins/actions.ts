"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { AdminRole } from "@prisma/client";

const ROLES = ["GENERAL", "PAYMENT", "DELIVERY"];

export type CreateAdminState = { error?: string; ok?: boolean } | undefined;

export async function createAdmin(
  _prev: CreateAdminState,
  formData: FormData,
): Promise<CreateAdminState> {
  await requireAdmin(["GENERAL"]);

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "");

  if (!name || !email) return { error: "Name and email are required." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (!ROLES.includes(role)) return { error: "Choose a valid role." };

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return { error: "An admin with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.create({
    data: { name, email, passwordHash, role: role as AdminRole },
  });

  revalidatePath("/admin/admins");
  return { ok: true };
}

export async function updateRole(formData: FormData): Promise<void> {
  const session = await requireAdmin(["GENERAL"]);
  const id = String(formData.get("id"));
  const role = String(formData.get("role"));
  if (!ROLES.includes(role) || id === session.id) return; // can't change your own role
  await prisma.admin.update({ where: { id }, data: { role: role as AdminRole } });
  revalidatePath("/admin/admins");
}

export async function deleteAdmin(formData: FormData): Promise<void> {
  const session = await requireAdmin(["GENERAL"]);
  const id = String(formData.get("id"));
  if (id === session.id) return; // can't delete yourself
  await prisma.admin.delete({ where: { id } });
  revalidatePath("/admin/admins");
}
