import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't let lint warnings block the production build on Vercel.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
