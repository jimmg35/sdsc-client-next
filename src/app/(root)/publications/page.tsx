import Banner from '@/components/Utility/Banner';
import PublicationPost from '@/components/Utility/PublicationPost';
import Search from '@/components/Utility/Search';
import { PublicationData, getAllPublications } from '@/lib/publications';
import { ScrollText } from 'lucide-react';

export default function Publications() {
  const publications: PublicationData[] = getAllPublications();

  return (
    <section className="relative min-h-dvh">
      {/* <Banner
        title="Publications"
        imageUrl="/img/banners/publications-banner.jpg"
        icon={<ScrollText size={52} className="inline-block mr-2" />}
      /> */}
      <div className="mx-auto max-w-7xl pb-10 pt-30 px-6">
        {/* <Search placeholder="Search for publications!" /> */}
      </div>
      <div className="mx-auto max-w-7xl py-10 px-6 flex flex-wrap items-center justify-center gap-8">
        {publications.map((publication) => (
          <PublicationPost key={publication.id} {...publication} />
        ))}
      </div>
    </section>
  );
}
