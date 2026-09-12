'use client';

import { ArrowDownToLine } from 'lucide-react';
import type { MouseEventHandler, ReactNode } from 'react';

interface DownloadCardProps {
  /** Platform mark, e.g. <WindowsIcon /> or <AppleIcon />. */
  icon: ReactNode;
  title: string;
  /** Short build line, e.g. "Windows 10 / 11 · 64-bit". */
  meta: string;
  description: string;
  href: string;
  cta: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const DownloadCard = ({
  icon,
  title,
  meta,
  description,
  href,
  cta,
  onClick
}: DownloadCardProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onClick}
    className="group block h-full rounded-[var(--radius-card)] calcite-focus"
  >
    <article className="glass-card flex h-full flex-col px-7 py-7 text-ink-900 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
      <div className="relative flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-silk-300/60 bg-gradient-to-br from-silk-100 to-silk-200/70 text-ink-900 shadow-[0_18px_40px_-28px_rgba(74,53,40,0.55)] transition duration-300 group-hover:border-rose-300/70 group-hover:text-rose-600">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-ink-900 text-glow">
            {title}
          </h3>
          <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-rose-600">
            {meta}
          </p>
        </div>
      </div>

      <p className="relative mt-5 flex-1 text-sm leading-6 text-ink-700">
        {description}
      </p>

      <div className="relative mt-7 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-rose-50/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-600 transition duration-300 group-hover:border-rose-300/80 group-hover:bg-rose-100/70">
          <ArrowDownToLine
            size={16}
            className="transition-transform duration-300 group-hover:translate-y-0.5"
          />
          {cta}
        </span>
      </div>
    </article>
  </a>
);

export default DownloadCard;
