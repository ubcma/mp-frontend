import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['utfs.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      new URL('https://pq44cnt1zt.ufs.sh/**'),
    ],
  },
};

export default nextConfig;
