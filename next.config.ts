import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this block for API proxying
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // This is your Flask backend URL
      },
    ];
  },
};

export default nextConfig;
