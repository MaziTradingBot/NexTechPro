import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { products } from "../src/lib/data/products";

const prisma = new PrismaClient();

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=70`;
const categoryImage: Record<string, string> = {
  phones: U("1511707171634-5f897ff02aa9"),
  laptops: U("1496181133206-80ce9b88a853"),
  gaming: U("1587202372775-e229f172b9d7"),
  audio: U("1505740420928-5e560c06d30e"),
  tablets: U("1544244015-0df4b3ffc6b0"),
  wearables: U("1523275335684-37898b6baf30"),
  accessories: U("1526170375885-4d8ecf77b99f"),
  monitors: U("1593642702821-c8da6771f0c6"),
};

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
      imageUrl: categoryImage[p.category] ?? null,
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
