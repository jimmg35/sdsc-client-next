import easternEgg from '@/lib/easterneggs';
import { themeInitScript } from '@/lib/theme';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { NextIntlClientProvider } from 'next-intl';
import { IBM_Plex_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  // Exposed so the per-script stacks in globals.css can keep Latin text on
  // this face. Deliberately not --font-sans, which Tailwind v4 already defines
  // in its theme.
  variable: '--font-latin'
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
    // The theme script mutates <html> before React hydrates, which is the point
    // of it — suppressHydrationWarning stops React objecting to its own markup
    // not matching.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.className} ${inter.variable} antialiased`}>
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
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
