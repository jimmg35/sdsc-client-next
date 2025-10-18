'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NotificationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-yellow-300 text-black">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 text-sm font-semibold sm:text-base">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span>The center now offers two tenure-track faculty positions.</span>
          <Link
            className="underline underline-offset-4 hover:text-yellow-900"
            href="/announcements/now-hiring-tenure-track-faculty"
          >
            Read the hiring post
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="rounded border border-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60"
        >
          Close
        </button>
      </div>
    </div>
  );
}
