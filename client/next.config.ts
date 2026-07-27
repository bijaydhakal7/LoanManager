import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        // In Vercel, this will securely proxy the request to the Railway backend
        // We append /api here because your Express server mounts routes under /api
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, 
      },
    ];
  },
};

export default nextConfig;
