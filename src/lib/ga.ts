type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

export function trackMGWRDownload(
  platform: 'windows' | 'macos',
  url: string,
  version?: string
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    console.log('gtag function is not available.');
    console.log(typeof window);
    console.log(typeof window.gtag);
    return;
  }

  window.gtag('event', 'mgwr_download', {
    software: 'MGWR',
    platform,
    link_url: url,
    version: version ?? undefined
  });
  console.log(
    `MGWR download tracked: platform=${platform}, url=${url}, version=${version}`
  );
}
