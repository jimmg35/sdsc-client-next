import type { NextConfig } from 'next';
import withMDX from '@next/mdx';

const basePathEnv = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
const normalizedBasePath =
  basePathEnv && basePathEnv !== '/' ? basePathEnv.replace(/\/$/, '') : undefined;

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  transpilePackages: ['next-mdx-remote'],
  ...(normalizedBasePath && {
    // Ensure the app and static assets resolve from the desired subdirectory.
    assetPrefix: normalizedBasePath,
    basePath: normalizedBasePath
  })
};

export default withMDX({
  extension: /\.mdx?$/
})(nextConfig);
