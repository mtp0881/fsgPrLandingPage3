import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to avoid blocking deployments
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript strict checking during builds if needed
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
