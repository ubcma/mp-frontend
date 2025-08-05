import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["utfs.io"],
    remotePatterns: [new URL("https://pq44cnt1zt.ufs.sh/**")],
  }
};

export default nextConfig;
