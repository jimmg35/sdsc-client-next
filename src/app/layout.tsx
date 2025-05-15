import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";

import NavBar from "@/components/Layout/NavBar";
import Footer from "@/components/Layout/Footer";

const noto = Noto_Sans_TC({
  weight: "500",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SDSC | Spatial Data Science Center",
  description: "Welcome to the SDSC!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${noto.className} antialiased`}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
