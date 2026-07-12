"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseSpecs(text: string): { key: string; value: string }[] {
  return parseLines(text)
    .map((line) => {
      const idx = line.indexOf("|");
      if (idx === -1) return { key: line, value: "" };
      return { key: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    })
    .filter((s) => s.key && s.value);
}

function num(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function revalidateStore(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/catalog");
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function saveProduct(formData: FormData): Promise<void> {
  await requireAdmin(["GENERAL"]);

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = (String(formData.get("slug") || "").trim() || slugify(name)) || `product-${Date.now()}`;
  const oldPrice = num(formData.get("oldPrice"));

  const data = {
    name,
    slug,
    brand: String(formData.get("brand") || "").trim(),
    category: String(formData.get("category") || "phones"),
    price: num(formData.get("price")),
    oldPrice: oldPrice > 0 ? oldPrice : null,
    stock: num(formData.get("stock")),
    isNewArrival: formData.get("isNewArrival") === "on",
    isHotDeal: formData.get("isHotDeal") === "on",
    isBestseller: formData.get("isBestseller") === "on",
    rating: Math.min(5, Math.max(0, num(formData.get("rating")) || 4.5)),
    reviews: num(formData.get("reviews")),
    accent: String(formData.get("accent") || "#22d3ee"),
    colors: String(formData.get("colors") || "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    highlights: parseLines(String(formData.get("highlights") || "")),
    specs: parseSpecs(String(formData.get("specs") || "")),
    popularity: num(formData.get("popularity")) || 50,
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidateStore(slug);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin(["GENERAL"]);
  const id = String(formData.get("id"));
  const p = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  await prisma.product.delete({ where: { id } });
  revalidateStore(p?.slug);
}

const FLAGS = ["isNewArrival", "isHotDeal", "isBestseller"] as const;
type Flag = (typeof FLAGS)[number];

export async function setFlag(formData: FormData): Promise<void> {
  await requireAdmin(["GENERAL"]);
  const id = String(formData.get("id"));
  const field = String(formData.get("field")) as Flag;
  const value = formData.get("value") === "true";
  if (!FLAGS.includes(field)) return;
  const p = await prisma.product.update({
    where: { id },
    data: { [field]: value },
    select: { slug: true },
  });
  revalidateStore(p.slug);
}
