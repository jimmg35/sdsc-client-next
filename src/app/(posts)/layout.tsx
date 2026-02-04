import Footer from '@/components/Layout/Footer';
import NavBar from '@/components/Layout/NavBar';
import type { Metadata } from 'next';

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
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
