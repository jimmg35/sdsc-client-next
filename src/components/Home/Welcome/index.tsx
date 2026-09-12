import { getTranslations } from 'next-intl/server';
import HeroStage from './HeroStage';

const Welcome = async () => {
  const t = await getTranslations('home.welcome');

  return <HeroStage title={t('title')} scrollLabel={t('scrollDown')} />;
};

export default Welcome;
