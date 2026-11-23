type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFunction;
  }
}

// The measurement ID is public either way — it ships in the page source — so
// hardcoding the fallback costs nothing and stops analytics disappearing
// silently. With output: 'export' NEXT_PUBLIC_* is inlined at build time, so an
// unset variable strips the tag from every generated page with no error.
// `||` rather than `??` on purpose: a build arg that resolves to an empty
// string has to fall back too, not compile in an empty id.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-9ZMSB9D51X';

// Runs synchronously in <head>, so window.gtag is defined before React
// hydrates and before gtag.js arrives — commands queue into dataLayer and
// replay once it loads. send_page_view is off because GAPageView owns
// page_view for the first paint as well as every client-side route change.
export const gaInitScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true, send_page_view: false });
`;

function gtag(...args: unknown[]): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }
  window.gtag(...args);
}

export function trackPageView(path: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    send_to: GA_ID
  });
}

export function trackMGWRDownload(
  platform: 'windows' | 'macos',
  url: string,
  version?: string
): void {
  gtag('event', 'mgwr_download', {
    software: 'MGWR',
    platform,
    link_url: url,
    version
  });
}
