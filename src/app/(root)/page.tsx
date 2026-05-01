// import Members from '@/components/Home/Members';
// import Announcement from '@/components/Home/Announcement';
import DirectorMessage from '@/components/Home/DirectorMessage';
import News from '@/components/Home/News';
// import Publication from '@/components/Home/Publication';
import Welcome from '@/components/Home/Welcome';
import StoryRail from '@/components/Stories/StoryRail';
import { getRecentStoryCollection } from '@/lib/stories';

export default function Home() {
  const { stories } = getRecentStoryCollection();

  return (
    <div className="h-fit">
      <Welcome />
      <StoryRail
        stories={stories}
        eyebrow="Now Trending"
        title="Fresh SDSC stories"
        description="Each ring maps to one recent SDSC story."
        ctaHref="/member"
        ctaLabel="Meet the storytellers"
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
