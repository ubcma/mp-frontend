import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['utfs.io', 'gs42emtt45.ufs.sh'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pq44cnt1zt.ufs.sh',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
