import easternEgg from '@/lib/easterneggs';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { IBM_Plex_Sans, Noto_Sans_SC, Noto_Sans_TC } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700']
});

// CJK faces are split by unicode-range, so browsers only fetch the chunks that
// the rendered characters actually need. Weights are kept minimal on purpose.
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-zh-cn'
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-zh-tw'
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: 'Spatial Data Science Center',
  description: 'Welcome to the SDSC!',
  icons: {
    // src/app/favicon.ico is auto-linked by Next as the legacy fallback, so it
    // is deliberately not repeated here. The SVG carries its own
    // prefers-color-scheme rule and flips the mark to white on dark browser
    // chrome; engines without SVG favicon support (Safari < 16.4) fall back to
    // the .ico above it.
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${notoSansSC.variable} ${notoSansTC.variable} antialiased`}
      >
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', { anonymize_ip: true });
                `
              }}
            />
          </>
        ) : null}
        <div hidden dangerouslySetInnerHTML={{ __html: easternEgg }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
