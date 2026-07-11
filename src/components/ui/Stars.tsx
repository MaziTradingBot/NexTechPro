"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} / 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = rating - i >= 0.5;
        return (
          <Star
            key={i}
            width={size}
            height={size}
            className={filled ? "text-amber-400" : "text-slate-300"}
            fill={filled ? "currentColor" : "none"}
            strokeWidth={filled ? 0 : 1.5}
          />
        );
      })}
    </div>
  );
}
