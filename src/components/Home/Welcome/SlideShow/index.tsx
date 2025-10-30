import { withBasePath } from '@/lib/base-path';
import Image from 'next/image';

const SlideShow = () => {
  return (
    <div className="absolute left-0 top-0 h-full w-full overflow-hidden -z-10">
      <Image
        src={withBasePath('/img/welcome-banner/mgwr-bg.png')}
        alt="Spatial Data Science Center welcome banner"
        fill
        priority
        className="object-cover"
      />
    </div>
  );
};

export default SlideShow;
