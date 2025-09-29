import PublicationPost from '@/components/Utility/PublicationPost';
import { PublicationData, getAllPublications } from '@/lib/publications';

export default function Publications() {
  const publications: PublicationData[] = getAllPublications();

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <header className="text-center text-ink-900">
          <span className="chip-gold">Publications</span>
          <h1 className="mt-6 text-4xl font-semibold text-garnet-800 text-glow md:text-5xl">
            Research and scholarship from SDSC
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm text-ink-600 md:text-base">
            Discover journal articles, conference papers, and collaborative
            reports authored by our faculty and students across the spatial data
            science spectrum.
          </p>
        </header>

        <div className="mt-16 grid gap-6">
          {publications.map((publication) => (
            <PublicationPost key={publication.id} {...publication} />
          ))}
        </div>
      </div>
    </section>
  );
}
