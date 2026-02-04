import type { NextConfig } from 'next';
import withMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  transpilePackages: ['next-mdx-remote'],
  images: { unoptimized: true },
  trailingSlash: true
};

export default withMDX({
  extension: /\.mdx?$/
})(nextConfig);
