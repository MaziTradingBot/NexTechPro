import "server-only";
import { prisma } from "@/lib/db";
import type { Product as DBProduct } from "@prisma/client";
import type { Product, ProductTag, CategoryId, Spec } from "@/lib/data/products";
import {
  products as staticProducts,
  getProduct as staticGetProduct,
  getProductById as staticGetProductById,
} from "@/lib/data/products";

/** Map a database product row to the shape the storefront components expect. */
export function mapProduct(p: DBProduct): Product {
  const tags: ProductTag[] = [];
  if (p.isNewArrival) tags.push("new");
  if (p.isBestseller) tags.push("hit");
  if (p.isHotDeal) tags.push("sale");
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category as CategoryId,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    rating: p.rating,
    reviews: p.reviews,
    tags,
    colors: p.colors,
    popularity: p.popularity,
    createdAt: p.createdAt.getTime(),
    highlights: p.highlights,
    specs: (p.specs as unknown as Spec[]) ?? [],
    accent: p.accent,
    stock: p.stock,
    imageUrl: p.imageUrl ?? undefined,
  };
}

// The storefront falls back to the built-in catalog whenever the database is
// not reachable or not seeded yet, so the site always works. Once a DATABASE_URL
// is connected and seeded, live data (admin edits, stock, flags) takes over.

export async function getAllProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({ orderBy: { popularity: "desc" } });
    return rows.length ? rows.map(mapProduct) : staticProducts;
  } catch {
    return staticProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const p = await prisma.product.findUnique({ where: { slug } });
    if (p) return mapProduct(p);
  } catch {
    /* fall through to static */
  }
  return staticGetProduct(slug) ?? null;
}

export async function getRelatedProducts(
  category: string,
  excludeId: string,
  limit = 4,
): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { category, NOT: { id: excludeId } },
      take: limit,
      orderBy: { popularity: "desc" },
    });
    if (rows.length) return rows.map(mapProduct);
  } catch {
    /* fall through to static */
  }
  return staticProducts
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, limit);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  try {
    const rows = await prisma.product.findMany({ where: { id: { in: ids } } });
    if (rows.length) {
      const byId = new Map(rows.map((p) => [p.id, mapProduct(p)]));
      return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
    }
  } catch {
    /* fall through to static */
  }
  return ids
    .map((id) => staticGetProductById(id))
    .filter((p): p is Product => Boolean(p));
}
