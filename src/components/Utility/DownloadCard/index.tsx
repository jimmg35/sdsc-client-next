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

/* The one panel on the page that keeps a border: downloading a build is what
   the page is for, so these two stay framed while everything below them
   drops to ruled lists. */
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
    className="group calcite-focus block h-full rounded-[1.75rem]"
  >
    <article className="flex h-full flex-col rounded-[1.75rem] border border-accent-600/25 bg-surface/55 px-7 py-8 transition duration-300 group-hover:border-primary-300/60 group-hover:bg-primary-50/40">
      <div className="flex items-center gap-4">
        <span className="shrink-0 text-ink-900 transition-colors duration-300 group-hover:text-primary-600">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-medium tracking-[-0.01em] text-ink-900">
            {title}
          </h3>
          <p className="mt-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
            {meta}
          </p>
        </div>
      </div>

      <p className="mt-6 flex-1 text-sm leading-7 text-ink-700">
        {description}
      </p>

      <span className="mt-8 inline-flex items-center gap-2 self-start rounded-full border border-primary-400/70 bg-primary-500/90 px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white transition duration-300 group-hover:bg-primary-600">
        <ArrowDownToLine
          size={16}
          className="transition-transform duration-300 group-hover:translate-y-0.5"
        />
        {cta}
      </span>
    </article>
  </a>
);

export default DownloadCard;
