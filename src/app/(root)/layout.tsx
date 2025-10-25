import Footer from '@/components/Layout/Footer';
import NavBar from '@/components/Layout/NavBar';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { IBM_Plex_Sans } from 'next/font/google';
import '../globals.css';

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
  const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? '';
  const normalizedBasePath =
    rawBasePath && rawBasePath !== '/'
      ? rawBasePath.startsWith('/')
        ? rawBasePath.replace(/\/+$/, '')
        : `/${rawBasePath.replace(/\/+$/, '')}`
      : '';
  const withBasePath = (path: string) =>
    `${normalizedBasePath}${path}`.replace(/\/{2,}/g, '/');

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        style={
          {
            '--background-image': `url(${withBasePath('/img/welcome.jpg')})`,
            '--base-path': normalizedBasePath
          } as CSSProperties
        }
        data-base-path={normalizedBasePath}
      >
        <NavBar />
        <main className="">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
