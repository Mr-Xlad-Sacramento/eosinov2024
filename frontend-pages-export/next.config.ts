import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  onDemandEntries: {
    // Keep more pages hot in dev to avoid expensive route cold-starts on navigation.
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 60,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
