import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: true,
  basePath: '/reel-win/admin',
  assetPrefix: '/reel-win/admin',
};

export default nextConfig;