'use client';

import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface CitationCardProps {
  /** 1-based position, rendered as the marker in the left gutter. */
  index: number;
  text: string;
  href: string;
  accessLabel: string;
  copyLabel: string;
  copiedLabel: string;
}

const CitationCard = ({
  index,
  text,
  href,
  accessLabel,
  copyLabel,
  copiedLabel
}: CitationCardProps) => {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* Clipboard is unavailable on insecure origins and when the reader has
         denied permission. The citation stays selectable either way, so fail
         quietly rather than interrupting them. */
      return;
    }

    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <li className="flex gap-4 rounded-2xl border border-silk-300/55 bg-surface/45 px-5 py-5 transition duration-300 hover:border-rose-200/70 hover:bg-rose-50/40">
      <span
        aria-hidden="true"
        className="mt-0.5 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-silk-300/60 bg-silk-100/80 text-[0.7rem] font-semibold text-rose-600 sm:flex"
      >
        {String(index).padStart(2, '0')}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-6 text-ink-700">{text}</p>

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/60 bg-rose-50/70 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rose-600 transition duration-300 hover:border-rose-300/80 hover:bg-rose-100/70 calcite-focus"
          >
            {accessLabel}
            <ArrowUpRight size={14} />
          </Link>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-full border border-silk-300/60 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink-500 transition duration-300 hover:border-rose-200/70 hover:text-rose-600 calcite-focus"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
          </button>
        </div>
      </div>
    </li>
  );
};

export default CitationCard;
