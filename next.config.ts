import type { NextConfig } from 'next';
import withMDX from '@next/mdx';

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? '';
const normalizedBasePath =
  rawBasePath && rawBasePath !== '/'
    ? rawBasePath.startsWith('/')
      ? rawBasePath.replace(/\/+$/, '')
      : `/${rawBasePath.replace(/\/+$/, '')}`
    : '';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  transpilePackages: ['next-mdx-remote'],
  basePath: normalizedBasePath || undefined
};

export default withMDX({
  extension: /\.mdx?$/
})(nextConfig);
