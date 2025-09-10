import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipMiddlewareUrlNormalize: true,
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
