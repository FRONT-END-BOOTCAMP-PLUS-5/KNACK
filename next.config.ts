import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use '@/styles/colors.scss' as *;`,
  },
  images: {
    domains: ['d2ubv3uh3d6fx8.cloudfront.net', 'lh3.googleusercontent.com'],
  },
};

export default nextConfig;
