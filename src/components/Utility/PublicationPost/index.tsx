'use client';

import Avatar from '@/components/Utility/Avatar';
import { PublicationData } from '@/lib/publications';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export type PublicationCardMember = {
  id: string;
  name: string;
  thumbnail: string;
};

type PublicationPostProps = PublicationData & {
  centerMembers: PublicationCardMember[];
};

/* A ruled reference rather than a card. The archive runs to hundreds of
   entries, so every gradient, inset shadow and nested panel it used to carry
   was repeated that many times down the page. */
const PublicationPost = ({
  title,
  journal,
  catalog,
  doi,
  year,
  centerMembers
}: PublicationPostProps) => {
  const t = useTranslations('publications.post');
  const doiUrl = doi?.trim();
  const doiLabel = doiUrl
    ? doiUrl.replace(/^https?:\/\/(www\.)?(dx\.)?doi\.org\//i, '')
    : '';
  const publicationYear = year ? String(year) : t('undated');

  return (
    <article className="border-t border-accent-600/25 py-7">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="text-[0.68rem] font-semibold uppercase tabular-nums tracking-[0.24em] text-primary-600">
          {publicationYear}
        </span>
        {journal && (
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-ink-500">
            {journal}
          </span>
        )}
      </div>

      <h3 className="mt-4 max-w-4xl text-xl font-medium leading-snug tracking-[-0.015em] text-ink-900 md:text-2xl md:leading-[1.3]">
        {title}
      </h3>

      {catalog && (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-700">
          {catalog}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
        {centerMembers.length > 0 ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-accent-700">
              {t('contributors')}
            </span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {centerMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/member/${member.id}`}
                  className="group/member inline-flex items-center gap-2.5 text-sm font-medium text-ink-900 transition-colors duration-300 hover:text-primary-600"
                >
                  <Avatar
                    src={member.thumbnail}
                    size={32}
                    alt={`${member.name} portrait`}
                    variant="soft"
                    className="group-hover/member:scale-[1.06]"
                  />
                  <span>{member.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <span className="text-sm text-ink-500">{t('noMetadata')}</span>
        )}

        {doiUrl && (
          <a
            href={doiUrl}
            target="_blank"
            rel="noreferrer"
            className="group/doi ml-auto inline-flex min-w-0 items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-primary-600 transition-colors hover:text-primary-700"
          >
            DOI
            <span className="max-w-[14rem] truncate normal-case tracking-normal text-ink-500">
              {doiLabel}
            </span>
            <ArrowUpRight
              size={14}
              className="shrink-0 transition-transform duration-300 group-hover/doi:-translate-y-0.5 group-hover/doi:translate-x-0.5"
            />
          </a>
        )}
      </div>
    </article>
  );
};

export default PublicationPost;
