import Footer from '@/components/Layout/Footer';
import NavBar from '@/components/Layout/NavBar';
import type { Metadata } from 'next';
import { Noto_Sans_TC } from 'next/font/google';
import '../globals.css';

const noto = Noto_Sans_TC({
  weight: '500',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'SDSC | Spatial Data Science Center',
  description: 'Welcome to the SDSC!'
};

export default function PostLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${noto.className} antialiased`}>
        <NavBar isForcedScrolled={false} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
