import { withBasePath } from '@/lib/base-path';

const SlideShow = () => {
  const backgroundImage = withBasePath('/img/welcome-banner/mgwr-bg.png');

  return (
    <div
      className="absolute inset-0 -z-10 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    />
  );
};

export default SlideShow;
