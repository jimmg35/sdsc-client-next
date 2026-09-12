import GAPageView from '@/components/Analytics/GAPageView';
import easternEgg from '@/lib/easterneggs';
import { GA_ID, gaInitScript } from '@/lib/ga';
import { themeInitScript } from '@/lib/theme';
import { Suspense } from 'react';
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
        {/* Plain inline script rather than next/script: this has to run before
            hydration so window.gtag already exists when GAPageView and the
            MGWR download handler call it. gtag.js itself can load late. */}
        <script dangerouslySetInnerHTML={{ __html: gaInitScript }} />
      </head>
      <body className={`${inter.className} ${inter.variable} antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        {/* useSearchParams needs a suspense boundary under output: 'export'. */}
        <Suspense fallback={null}>
          <GAPageView />
        </Suspense>
        <div hidden dangerouslySetInnerHTML={{ __html: easternEgg }} />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
