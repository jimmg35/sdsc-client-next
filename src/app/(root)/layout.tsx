import Footer from '@/components/Layout/Footer';
import NavBar from '@/components/Layout/NavBar';

export default async function RootGroupLayout({
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
