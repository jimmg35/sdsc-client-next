import Members from '@/components/Home/Members';
import News from '@/components/Home/News';
import Publication from '@/components/Home/Publication';
import Welcome from '@/components/Home/Welcome';
import WhoWeAre from '@/components/Home/WhoWeAre';

export default function Member() {
  return (
    <div className="h-fit">
      <Welcome />
      <WhoWeAre />
      <Members />
      <Publication />
      <News />
    </div>
  );
}
