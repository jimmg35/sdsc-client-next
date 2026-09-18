import Avatar from '@/components/Utility/Avatar';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export type PublicationOverviewMetric = {
  value: string;
  label: string;
  detail?: string;
};

export type LatestPublicationNoticeItem = {
  id: string;
  title: string;
  author: string;
  doi: string;
  publishedDaysAgo: number;
  members: {
    id: string;
    name: string;
    thumbnail: string;
  }[];
};

type PublicationBrowseOverviewProps = {
  overview: PublicationOverviewMetric[];
  latestPublications: LatestPublicationNoticeItem[];
  linkedContributorCount: number;
  latestYear: number | null;
};

const RULE = 'border-silk-600/25';

export default async function PublicationBrowseOverview({
  overview,
  latestPublications,
  linkedContributorCount,
  latestYear
}: PublicationBrowseOverviewProps) {
  const t = await getTranslations('publications.browse');

  return (
    <>
      <div
        className={`mt-16 grid gap-x-14 gap-y-10 border-y ${RULE} py-9 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start`}
      >
        <div className="min-w-0">
          <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-silk-700 md:tracking-[0.4em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-silk-600/55"
            />
            {t('eyebrow')}
          </p>
          <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-ink-900 md:text-[2rem] md:leading-[1.15]">
            {t('title')}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-700 md:text-base md:leading-8">
            {t('description', {
              reach: latestYear
                ? t('reachInto', { year: latestYear })
                : t('reachLive'),
              count: linkedContributorCount
            })}
          </p>
        </div>

        {/* The headline figure reads as a figure, not as a boxed stat card. */}
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          {overview.map((item) => (
            <div key={item.label} className="flex flex-col-reverse">
              <dt className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-silk-700">
                {item.label}
              </dt>
              <dd className="text-[2.4rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink-900">
                {item.value}
              </dd>
              {item.detail && (
                <p className="order-last mt-3 text-sm leading-6 text-ink-700">
                  {item.detail}
                </p>
              )}
            </div>
          ))}
        </dl>
      </div>

      {latestPublications.length > 0 && (
        <section className="mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-silk-700 md:tracking-[0.4em]">
              <span
                aria-hidden
                className="h-px w-10 bg-gradient-to-r from-transparent to-silk-600/55"
              />
              {t('latestPublications')}
            </h2>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink-500">
              {t('addedWithinMonth')}
            </p>
          </div>

          <ul className="mt-8">
            {latestPublications.map((publication) => (
              <li key={publication.id} className={`border-t ${RULE} py-7`}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-rose-600">
                  {t('published', {
                    label: t('ago', { count: publication.publishedDaysAgo })
                  })}
                </p>

                {publication.doi ? (
                  <a
                    href={publication.doi}
                    target="_blank"
                    rel="noreferrer"
                    className="group/link mt-4 inline-flex max-w-4xl items-start gap-2 text-xl font-medium leading-snug tracking-[-0.015em] text-ink-900 transition-colors duration-300 hover:text-rose-600 md:text-2xl md:leading-[1.3]"
                  >
                    <span className="min-w-0 break-words">
                      {publication.title}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="mt-1.5 shrink-0 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    />
                  </a>
                ) : (
                  <h3 className="mt-4 max-w-4xl break-words text-xl font-medium leading-snug tracking-[-0.015em] text-ink-900 md:text-2xl md:leading-[1.3]">
                    {publication.title}
                  </h3>
                )}

                <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-700">
                  {publication.author}
                </p>

                {publication.members.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {publication.members.map((member) => (
                      <Link
                        key={member.id}
                        href={`/member/${member.id}`}
                        className="group/member inline-flex items-center gap-2.5 text-sm font-medium text-ink-900 transition-colors duration-300 hover:text-rose-600"
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
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
