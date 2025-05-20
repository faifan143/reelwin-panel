import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: true,
  basePath: '/radar/admin',
  assetPrefix: '/radar/admin',
};

export default nextConfig;