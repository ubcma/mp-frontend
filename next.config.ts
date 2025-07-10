import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* your existing config options here */

  async rewrites() {
    return [
      {
        source: "/api/uploadthing/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploadthing/:path*`,
      },
    ];
  },
};

export default nextConfig;
