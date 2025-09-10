import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipMiddlewareUrlNormalize: true,
  // output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
