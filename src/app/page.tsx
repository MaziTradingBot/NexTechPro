import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { FlashDeals } from "@/components/home/FlashDeals";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { Newsletter } from "@/components/home/Newsletter";
import { BrandMarquee } from "@/components/home/BrandMarquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <FlashDeals />
      <FeaturedProducts />
      <CategoryGrid />
      <PromoBanner />
      <BrandMarquee />
      <Newsletter />
    </>
  );
}
