import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  transpilePackages: ["next-mdx-remote"],
};

export default withMDX({
  extension: /\.mdx?$/,
})(nextConfig);
