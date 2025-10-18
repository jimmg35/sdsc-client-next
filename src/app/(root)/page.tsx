// import Members from '@/components/Home/Members';
import Announcement from '@/components/Home/Announcement';
import DirectorMessage from '@/components/Home/DirectorMessage';
import News from '@/components/Home/News';
// import Publication from '@/components/Home/Publication';
import Welcome from '@/components/Home/Welcome';

export default function Home() {
  return (
    <div className="h-fit">
      <Welcome />
      <Announcement />
      <DirectorMessage />
      {/* <Members /> */}
      {/* <Publication /> */}
      <News />
    </div>
  );
}
