import Footer from '@/components/Layout/Footer';
import NavBar from '@/components/Layout/NavBar';
import SkipLink, { MAIN_CONTENT_ID } from '@/components/Layout/SkipLink';

export default async function PostLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SkipLink />
      <NavBar />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
