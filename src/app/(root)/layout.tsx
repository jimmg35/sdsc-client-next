import Footer from '@/components/Layout/Footer';
import NavBar from '@/components/Layout/NavBar';
import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import '../globals.css';

const inter = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'] // You can also add '100', '200', etc. if needed
});

export const metadata: Metadata = {
  title: 'SDSC | Spatial Data Science Center',
  description: 'Welcome to the SDSC!'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
