import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gatherer.wizards.com',
        port: '',
        pathname: '/Handlers/Image.ashx/**',
      }
    ],
    unoptimized: true 
  }
};

export default nextConfig;
