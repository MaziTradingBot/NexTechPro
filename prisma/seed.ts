import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { products } from "../src/lib/data/products";

const prisma = new PrismaClient();

async function main() {
  // --- Products (from the existing catalog) ---
  for (const p of products) {
    const data = {
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice ?? null,
      stock: 8 + (p.popularity % 50),
      isNewArrival: p.tags.includes("new"),
      isHotDeal: p.tags.includes("sale"),
      isBestseller: p.tags.includes("hit"),
      rating: p.rating,
      reviews: p.reviews,
      colors: p.colors ?? [],
      highlights: p.highlights,
      specs: JSON.parse(JSON.stringify(p.specs)),
      accent: p.accent,
      popularity: p.popularity,
    };
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });
  }

  // --- First general admin ---
  const email = (process.env.ADMIN_EMAIL || "admin@nextechpro.ua").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, name: "General Admin", passwordHash, role: AdminRole.GENERAL },
  });

  console.log(`✓ Seeded ${products.length} products`);
  console.log(`✓ Admin ready → ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
