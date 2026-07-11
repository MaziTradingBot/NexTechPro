"use client";

import {
  Gamepad2,
  Headphones,
  Laptop,
  Monitor,
  Plug,
  Smartphone,
  Tablet,
  Watch,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/lib/data/products";

const map: Record<CategoryId, LucideIcon> = {
  phones: Smartphone,
  laptops: Laptop,
  gaming: Gamepad2,
  audio: Headphones,
  tablets: Tablet,
  wearables: Watch,
  accessories: Plug,
  monitors: Monitor,
};

export function getCategoryIcon(category: CategoryId): LucideIcon {
  return map[category] ?? Smartphone;
}

export function CategoryIcon({
  category,
  className,
}: {
  category: CategoryId;
  className?: string;
}) {
  const Icon = getCategoryIcon(category);
  return <Icon className={className} />;
}
