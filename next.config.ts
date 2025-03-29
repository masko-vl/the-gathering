import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
