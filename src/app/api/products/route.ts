import { NextResponse, type NextRequest } from "next/server";
import { getProductsByIds } from "@/lib/products-db";

export const dynamic = "force-dynamic";

// Public endpoint used by client components (cart, compare, checkout) to resolve
// product details by id from the database.
export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const products = await getProductsByIds(ids);
  return NextResponse.json({ products });
}
