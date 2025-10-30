import type { NextConfig } from 'next';
import withMDX from '@next/mdx';

const resolvedBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  transpilePackages: ['next-mdx-remote'],
  ...(resolvedBasePath
    ? {
        basePath: resolvedBasePath
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: resolvedBasePath
  }
};

export default withMDX({
  extension: /\.mdx?$/
})(nextConfig);
