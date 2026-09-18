import PublicationBrowseOverview, {
  type LatestPublicationNoticeItem,
  type PublicationOverviewMetric
} from '@/components/Publications/BrowseOverview';
import PublicationExplorer from '@/components/Publications/Explorer';
import { MemberData, getAllMembers } from '@/lib/members';
import { PublicationData, getAllPublications } from '@/lib/publications';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

export default async function Publications() {
  const t = await getTranslations('publications');

  const publications: PublicationData[] = getAllPublications();
  const members: Pick<MemberData, 'id' | 'name' | 'title' | 'thumbnail'>[] =
    getAllMembers()
      .filter((member) => member.id && member.name && member.thumbnail)
      .map(({ id, name, title, thumbnail }) => ({
        id,
        name,
        title,
        thumbnail
      }));
  const publicationYears = publications
    .map((publication) => publication.year)
    .filter((year): year is number => typeof year === 'number');
  const latestYear = publicationYears.length
    ? Math.max(...publicationYears)
    : null;
  const recentPublicationCount = latestYear
    ? publications.filter(
        (publication) =>
          typeof publication.year === 'number' &&
          publication.year >= latestYear - 1
      ).length
    : publications.length;
  const linkedMemberIds = new Set(
    publications.flatMap((publication) => publication.memberIds)
  );
  const linkedContributorCount = members.filter((member) =>
    linkedMemberIds.has(member.id)
  ).length;
  const overview: PublicationOverviewMetric[] = [
    {
      value: formatCount(recentPublicationCount),
      label: t('overview.label'),
      detail: t('overview.detail')
    }
  ];
  const latestPublications = buildLatestPublicationNotices(
    publications,
    members
  );

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <header className="max-w-3xl">
          <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-silk-700 md:text-xs md:tracking-[0.42em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-silk-600/55"
            />
            {t('page.chip')}
          </p>
          <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ink-900 md:text-[3rem] md:leading-[1.06]">
            {t('page.title')}
          </h1>
          <p className="mt-6 text-base leading-8 text-ink-700 md:text-lg md:leading-9">
            {t('page.intro')}
          </p>
        </header>

        <PublicationBrowseOverview
          overview={overview}
          latestPublications={latestPublications}
          linkedContributorCount={linkedContributorCount}
          latestYear={latestYear}
        />

        <Suspense
          fallback={
            <div className="mt-16 border-t border-silk-600/25 py-10 text-sm text-ink-500">
              {t('page.loading')}
            </div>
          }
        >
          <PublicationExplorer publications={publications} members={members} />
        </Suspense>
      </div>
    </section>
  );
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en').format(value);
}

function buildLatestPublicationNotices(
  publications: PublicationData[],
  members: Pick<MemberData, 'id' | 'name' | 'title' | 'thumbnail'>[],
  referenceDate = new Date()
): LatestPublicationNoticeItem[] {
  const membersById = new Map(members.map((member) => [member.id, member]));
  const windowStart = new Date(referenceDate);
  windowStart.setMonth(windowStart.getMonth() - 1);

  return publications
    .flatMap((publication) => {
      const publishedDate = parsePublicationDate(publication.publishedAt);

      if (
        !publishedDate ||
        publishedDate < windowStart ||
        publishedDate > referenceDate
      ) {
        return [];
      }

      return [
        {
          item: {
            id: publication.id,
            title: publication.title,
            author: publication.author,
            doi: publication.doi,
            publishedDaysAgo: countDaysAgo(publishedDate, referenceDate),
            members: publication.memberIds
              .map((memberId) => membersById.get(memberId))
              .filter((member): member is NonNullable<typeof member> =>
                Boolean(member)
              )
              .map(({ id, name, thumbnail }) => ({ id, name, thumbnail }))
          },
          publishedTime: publishedDate.getTime()
        }
      ];
    })
    .sort((left, right) => right.publishedTime - left.publishedTime)
    .map(({ item }) => item);
}

function parsePublicationDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T12:00:00`
    : value;
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function countDaysAgo(publishedDate: Date, referenceDate: Date) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const publishedDay = new Date(
    publishedDate.getFullYear(),
    publishedDate.getMonth(),
    publishedDate.getDate()
  );
  const referenceDay = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  return Math.max(
    0,
    Math.floor(
      (referenceDay.getTime() - publishedDay.getTime()) / millisecondsPerDay
    )
  );
}
