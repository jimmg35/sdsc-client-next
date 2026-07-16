import Footer from '@/components/Layout/Footer';
import NavBar from '@/components/Layout/NavBar';
import { setRequestLocale } from 'next-intl/server';

export default async function RootGroupLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
