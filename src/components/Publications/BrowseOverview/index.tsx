import Avatar from '@/components/Utility/Avatar';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
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
  publishedAgoLabel: string;
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

export default function PublicationBrowseOverview({
  overview,
  latestPublications,
  linkedContributorCount,
  latestYear
}: PublicationBrowseOverviewProps) {
  return (
    <section className="surface-fade mb-16 mt-10 overflow-hidden px-6 py-8 md:mt-12 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_84%_-12%,_rgba(168,110,161,0.24),_transparent_55%),radial-gradient(110%_110%_at_12%_-16%,_rgba(194,156,106,0.22),_transparent_52%)]" />

      <div className="relative">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(19rem,1fr)] lg:items-end">
          <div>
            <p className="panel-title text-gold-300">Browse The Archive</p>
            <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
              Navigate SDSC scholarship before you drop into the full finder
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gold-200/78 md:text-base">
              Start with the live finder, then tighten the archive by year, SDSC
              contributor, or the results stream itself. The current index
              {latestYear ? ` reaches into ${latestYear}` : ' is live'} and
              already connects {linkedContributorCount} SDSC member profiles
              back to publication cards.
            </p>
          </div>

          <div className="grid gap-3">
            {overview.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-rose-100/75 bg-white/78 px-5 py-5 text-ink-900 shadow-[0_20px_44px_-34px_rgba(61,47,39,0.35)]"
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-rose-500">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-rose-700">
                  {item.value}
                </p>
                {item.detail && (
                  <p className="mt-2 text-sm leading-6 text-ink-600">
                    {item.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {latestPublications.length > 0 && (
          <div className="mt-8 rounded-[28px] border border-rose-100/75 bg-white/78 px-5 py-5 text-ink-900 shadow-[0_24px_56px_-38px_rgba(61,47,39,0.32)] md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-rose-500">
                  <CalendarDays size={14} />
                  Latest Publications
                </p>
                <p className="mt-2 text-sm text-ink-500">
                  Publications added within the past month.
                </p>
              </div>
              <span className="inline-flex self-start rounded-full border border-silk-200/80 bg-white/88 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink-500">
                {latestPublications.length}{' '}
                {latestPublications.length === 1 ? 'Update' : 'Updates'}
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {latestPublications.map((publication) => (
                <article
                  key={publication.id}
                  className="rounded-[22px] border border-black/6 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(253,247,241,0.82))] px-4 py-4 md:px-5"
                >
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div className="min-w-0">
                      {publication.doi ? (
                        <a
                          href={publication.doi}
                          target="_blank"
                          rel="noreferrer"
                          className="group/link inline-flex max-w-full items-start gap-2 text-base font-semibold leading-6 text-ink-900 transition hover:text-rose-700 md:text-lg"
                        >
                          <span className="min-w-0 break-words">
                            {publication.title}
                          </span>
                          <ArrowUpRight
                            size={16}
                            className="mt-1 shrink-0 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                          />
                        </a>
                      ) : (
                        <h3 className="break-words text-base font-semibold leading-6 text-ink-900 md:text-lg">
                          {publication.title}
                        </h3>
                      )}
                      <p className="mt-2 text-sm leading-6 text-ink-600">
                        {publication.author}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                      <span className="inline-flex self-start rounded-full border border-rose-200/70 bg-rose-50/82 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-rose-600 lg:self-end">
                        Published {publication.publishedAgoLabel}
                      </span>

                      {publication.members.length > 0 && (
                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          {publication.members.map((member) => (
                            <Link
                              key={member.id}
                              href={`/member/${member.id}`}
                              className="inline-flex items-center gap-2 rounded-full border border-silk-200/80 bg-white/90 px-2.5 py-1.5 text-sm font-medium text-ink-700 transition hover:border-rose-200/70 hover:bg-rose-50/70 hover:text-ink-900"
                            >
                              <Avatar
                                src={member.thumbnail}
                                size={32}
                                alt={`${member.name} portrait`}
                                variant="soft"
                              />
                              <span>{member.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
