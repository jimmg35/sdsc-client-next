import type { Metadata } from "next";
import { Noto_Sans_TC, Oranienbaum } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
const oranienbaum = Oranienbaum({
  weight: ["400"],
  subsets: ["latin"],
});

const noto = Noto_Sans_TC({
  weight: '500',
  subsets: ['latin']
})


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
      <body
        className={`${noto.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
