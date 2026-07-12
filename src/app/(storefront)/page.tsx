import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { FlashDeals } from "@/components/home/FlashDeals";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { Newsletter } from "@/components/home/Newsletter";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { getAllProducts } from "@/lib/products-db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getAllProducts();
  const deals = products.filter((p) => p.tags.includes("sale")).slice(0, 4);
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <>
      <Hero />
      <Benefits />
      <FlashDeals deals={deals} />
      <FeaturedProducts products={products} />
      <CategoryGrid />
      <PromoBanner />
      <BrandMarquee brands={brands} />
      <Newsletter />
    </>
  );
}
