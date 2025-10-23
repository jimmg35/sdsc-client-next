import Footer from '@/components/Layout/Footer';
import NavBar from '@/components/Layout/NavBar';
import { getAssetPrefix } from '@/lib/basePath';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { IBM_Plex_Sans } from 'next/font/google';
import type { CSSProperties } from 'react';
import '../globals.css';

type BodyStyle = CSSProperties & {
  '--background-image-url'?: string;
};

const inter = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'SDSC | Spatial Data Science Center',
  description: 'Welcome to the SDSC!'
};
// pt-[60px]
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const assetPrefix = getAssetPrefix();
  const bodyStyle: BodyStyle | undefined = assetPrefix
    ? {
        '--background-image-url': `url(${assetPrefix}/img/welcome.jpg)`
      }
    : undefined;

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} style={bodyStyle}>
        <NavBar />
        <main className="">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
