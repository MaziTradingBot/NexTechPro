import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products-db";
import { ProductDetail } from "@/components/product/ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product.category, product.id);
  return <ProductDetail product={product} related={related} />;
}
