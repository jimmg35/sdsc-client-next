import type { NextConfig } from 'next';
import withMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

type ChunkPathData = { chunk?: { name?: string | null } };

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  transpilePackages: ['next-mdx-remote'],
  images: { unoptimized: true },
  trailingSlash: true,
  // Client chunks for dynamic routes are named after their folder, e.g.
  // _next/static/chunks/app/(root)/member/[slug]/page-*.js. sdsc.fsu.edu 404s
  // on those bracketed paths after the WebDAV upload, which crashes every
  // member/news/announcement detail page, so write them as _slug_ instead.
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      const filename = config.output.filename;
      config.output.filename = (
        pathData: ChunkPathData,
        assetInfo?: unknown
      ) => {
        const template: string =
          typeof filename === 'function'
            ? filename(pathData, assetInfo)
            : filename;
        const name = pathData.chunk?.name;
        return name && /[[\]]/.test(name)
          ? template.replace('[name]', name.replace(/[[\]]/g, '_'))
          : template;
      };
    }
    return config;
  }
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(
  withMDX({
    extension: /\.mdx?$/
  })(nextConfig)
);
