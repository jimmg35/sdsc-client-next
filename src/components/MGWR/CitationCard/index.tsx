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
    /* A numbered reference in a ruled list rather than a bordered box. */
    <li className="grid gap-x-6 gap-y-3 border-t border-silk-600/25 py-6 sm:grid-cols-[2.5rem_1fr]">
      <span
        aria-hidden="true"
        className="hidden text-[0.7rem] font-semibold tabular-nums tracking-[0.18em] text-rose-600 sm:block"
      >
        {String(index).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <p className="text-sm leading-7 text-ink-900">{text}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="calcite-focus group/access inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-rose-600 transition-colors hover:text-rose-700"
          >
            {accessLabel}
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover/access:-translate-y-0.5 group-hover/access:translate-x-0.5"
            />
          </Link>

          <button
            type="button"
            onClick={handleCopy}
            className="calcite-focus inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-ink-500 transition-colors hover:text-rose-600"
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
