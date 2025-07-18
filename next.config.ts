import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://pq44cnt1zt.ufs.sh/**")],
  }
};

export default nextConfig;
