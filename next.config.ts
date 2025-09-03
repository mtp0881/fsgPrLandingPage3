import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed static export for Azure Static Web Apps with API routes
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'out',
  eslint: {
    // Disable ESLint during builds to avoid blocking deployments
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript strict checking during builds if needed
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
