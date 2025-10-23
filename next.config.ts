import type { NextConfig } from 'next';
import withMDX from '@next/mdx';

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
const withoutTrailingSlash =
  rawBasePath && rawBasePath !== '/'
    ? rawBasePath.replace(/\/+$/, '')
    : rawBasePath;
const normalizedBasePath =
  withoutTrailingSlash && withoutTrailingSlash !== '/'
    ? withoutTrailingSlash.startsWith('/')
      ? withoutTrailingSlash
      : `/${withoutTrailingSlash}`
    : '';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    // Required so `next export` keeps <Image /> working without the image optimizer.
    unoptimized: true
  },
  ...(normalizedBasePath
    ? {
        basePath: normalizedBasePath,
        assetPrefix: normalizedBasePath
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: normalizedBasePath
  },
  basePath: normalizedBasePath,
  trailingSlash: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  transpilePackages: ['next-mdx-remote']
};

export default withMDX({
  extension: /\.mdx?$/
})(nextConfig);
