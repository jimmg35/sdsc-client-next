import PublicationExplorer from '@/components/Publications/Explorer';
import { PublicationData, getAllPublications } from '@/lib/publications';
import { MemberData, getAllMembers } from '@/lib/members';

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

        <PublicationExplorer publications={publications} members={members} />
      </div>
    </section>
  );
}
