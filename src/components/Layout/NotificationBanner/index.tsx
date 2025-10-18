'use client';

import Link from 'next/link';
import { useState } from 'react';

const BannerMessage = ({ isDuplicate = false }: { isDuplicate?: boolean }) => (
  <div aria-hidden={isDuplicate} className="marquee__item">
    <span className="whitespace-nowrap">
      The center now offers two tenure-track faculty positions.
    </span>
    <Link
      className="whitespace-nowrap underline underline-offset-4 hover:text-yellow-900"
      href="/announcements/now-hiring-tenure-track-faculty"
      tabIndex={isDuplicate ? -1 : undefined}
    >
      Read the hiring post
    </Link>
  </div>
);

export default function NotificationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-yellow-300 text-black">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 text-sm font-semibold sm:text-base">
        <div className="relative flex flex-1 overflow-hidden">
          <div className="marquee" role="presentation">
            <BannerMessage />
            <BannerMessage isDuplicate />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="shrink-0 rounded border border-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60"
        >
          Close
        </button>
      </div>
      <style jsx>{`
        .marquee {
          --gap: 1.5rem;
          display: flex;
          align-items: center;
          gap: var(--gap);
          width: max-content;
          min-width: 100%;
          animation: marquee 18s linear infinite;
        }

        .marquee__item {
          display: inline-flex;
          align-items: center;
          gap: var(--gap);
          flex-shrink: 0;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
