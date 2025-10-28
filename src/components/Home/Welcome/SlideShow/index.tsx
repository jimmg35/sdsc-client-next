'use client';

import Image from 'next/image';

const SlideShow = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <Image
        src="/zl23l/img/welcome-banner/mgwr-bg.png"
        alt="Spatial Data Science Center welcome banner"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};

export default SlideShow;
