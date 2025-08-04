import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use '@/styles/colors.scss' as *;`,
  },
};

export default nextConfig;
