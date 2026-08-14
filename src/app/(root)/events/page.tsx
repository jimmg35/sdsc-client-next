import { getTranslations } from 'next-intl/server';

export default async function Events() {
  const t = await getTranslations('events');

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-36 text-center text-gold-100 md:pt-40">
        <span className="chip-gold">{t('chip')}</span>
        <h1 className="mt-6 text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
          {t('title')}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm text-gold-200/80 md:text-base">
          {t('intro')}
        </p>
      </div>
    </section>
  );
}
