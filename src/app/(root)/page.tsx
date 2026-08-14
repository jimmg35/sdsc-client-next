// import Members from '@/components/Home/Members';
// import Announcement from '@/components/Home/Announcement';
import DirectorMessage from '@/components/Home/DirectorMessage';
import News from '@/components/Home/News';
// import Publication from '@/components/Home/Publication';
import Welcome from '@/components/Home/Welcome';
import StoryRail from '@/components/Stories/StoryRail';
import { getRecentStoryCollection } from '@/lib/stories';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('home.storyRail');
  const { stories } = getRecentStoryCollection();

  return (
    <div className="h-fit">
      <Welcome />
      <StoryRail
        stories={stories}
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        ctaHref="/member"
        ctaLabel={t('ctaLabel')}
        panelClassName="surface-fade relative overflow-hidden rounded-none px-6 py-16 md:px-16"
        overlayClassName={null}
      />
      {/* <Announcement /> */}
      <DirectorMessage />
      {/* <Members /> */}
      {/* <Publication /> */}
      <News />
    </div>
  );
}
