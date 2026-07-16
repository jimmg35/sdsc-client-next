import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type LocaleParams = Promise<{ locale: string }>;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'guide' });

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function GuidePage(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations('guide');

  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-6 py-16">
      <section className="glass-card relative w-full max-w-5xl overflow-hidden p-10 md:p-14">
        <div className="absolute inset-0 -z-10 opacity-80">
          <div className="absolute -left-24 -top-16 h-52 w-52 rounded-full bg-rose-200/70 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-60 w-60 rounded-full bg-amber-200/70 blur-3xl" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <div className="chip-gold mb-6">{t('notice')}</div>
            <h1 className="text-glow text-3xl font-semibold text-ink-900 md:text-4xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-700 md:text-lg">
              {t('description')}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                className="calcite-focus inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-rose-600"
                href="https://sdsc.fsu.edu/"
              >
                {t('cta')}
              </a>
            </div>
          </div>

          <div className="surface-fade p-6 md:p-8">
            <div className="panel-title mb-4">{t('whatChanged')}</div>
            <div className="space-y-4 text-sm text-ink-700">
              <div className="rounded-2xl border border-rose-100/80 bg-white/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
                  {t('newDestinationTitle')}
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  {t('newDestinationBody')}
                </p>
              </div>
              <div className="rounded-2xl border border-rose-100/80 bg-white/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
                  {t('stayUpdatedTitle')}
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  {t('stayUpdatedBody')}
                </p>
              </div>
              <div className="rounded-2xl border border-rose-100/80 bg-white/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
                  {t('needHelpTitle')}
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  {t('needHelpBody')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
