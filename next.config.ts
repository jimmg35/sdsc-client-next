import type { NextConfig } from 'next';
import withMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  transpilePackages: ['next-mdx-remote'],
  images: { unoptimized: true },
  trailingSlash: true
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(
  withMDX({
    extension: /\.mdx?$/
  })(nextConfig)
);
