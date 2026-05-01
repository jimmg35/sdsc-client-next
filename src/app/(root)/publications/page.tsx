import PublicationBrowseOverview, {
  type PublicationOverviewMetric
} from '@/components/Publications/BrowseOverview';
import PublicationExplorer from '@/components/Publications/Explorer';
import { MemberData, getAllMembers } from '@/lib/members';
import { PublicationData, getAllPublications } from '@/lib/publications';
import { Suspense } from 'react';

export default function Publications() {
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
      label: 'Publications',
      detail: 'Output from all SDSC members over the past two years.'
    }
  ];

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 text-gold-100 md:pt-40">
        <header className="text-center">
          <span className="chip-gold">Publications</span>
          <h1 className="mt-6 text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
            Research and scholarship from SDSC
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm text-gold-200/80 md:text-base">
            Recent peer-reviewed publications by our faculty and students across
            the spatial data science spectrum.
          </p>
        </header>

        <PublicationBrowseOverview
          overview={overview}
          linkedContributorCount={linkedContributorCount}
          latestYear={latestYear}
        />

        <Suspense
          fallback={
            <div className="mt-16 rounded-3xl border border-black/5 bg-white/70 p-8 text-center text-sm text-ink-500">
              Loading publications...
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
  return new Intl.NumberFormat('en-US').format(value);
}
