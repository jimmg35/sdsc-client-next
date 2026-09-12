import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const DirectorMessage = async () => {
  const t = await getTranslations('home.director');

  return (
    <section className="surface-fade relative overflow-hidden rounded-none px-6 py-20 md:px-16 md:py-28">
      <div
        aria-hidden
        className="graticule-fade pointer-events-none absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_-10%,_rgba(124,74,158,0.18),_transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_20%_-20%,_rgba(189,156,99,0.22),_transparent_58%)]" />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Masthead: the label carries the section rather than a display
            heading, so the pulled-out sentence below is the largest thing here. */}
        <h2 className="flex items-center justify-center gap-5">
          <span
            aria-hidden
            className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-silk-600/45 md:block"
          />
          <span className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-silk-700 md:text-xs md:tracking-[0.45em]">
            {t('eyebrow')}
          </span>
          <span
            aria-hidden
            className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-silk-600/45 md:block"
          />
        </h2>

        <div className="mt-14 flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
          <figure className="flex w-full max-w-[16.5rem] shrink-0 flex-col items-center">
            <div className="relative w-full rounded-[2.25rem] border border-silk-600/40 bg-gradient-to-b from-silk-500/25 via-transparent to-rose-400/15 p-[0.6rem] shadow-[0_55px_95px_-58px_rgba(56,43,28,0.9)]">
              <div className="relative aspect-square w-full overflow-hidden rounded-[1.7rem] border border-silk-600/30 bg-silk-200">
                <Image
                  src="/img/avatar/stewart-fotheringham.jpg"
                  alt="Professor Stewart Fotheringham, Center Director"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 16.5rem, 16.5rem"
                  priority
                />
              </div>
            </div>
            <span aria-hidden className="mt-6 h-px w-14 bg-silk-600/50" />
            <figcaption className="mt-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-silk-700">
              {t('role')}
            </figcaption>
          </figure>

          <div className="relative flex-1">
            <span
              aria-hidden
              className="pointer-events-none absolute -left-9 -top-16 hidden select-none font-serif text-[11rem] leading-none text-silk-600/20 md:block"
            >
              &ldquo;
            </span>

            <p className="relative text-left text-base leading-8 text-ink-700 md:text-justify md:text-lg md:leading-9">
              {t.rich('p1', {
                /* Block-level so the center's founding principle reads as the
                   section's headline while staying inside the paragraph. */
                strong: (chunks) => (
                  <strong className="relative mt-9 block pl-6 text-left text-xl font-medium leading-snug tracking-[-0.01em] text-ink-900 before:absolute before:inset-y-1 before:left-0 before:w-[2px] before:rounded-full before:bg-gradient-to-b before:from-silk-600 before:via-rose-500/75 before:to-transparent before:content-[''] md:text-[1.7rem] md:leading-[1.4]">
                    {chunks}
                  </strong>
                )
              })}
            </p>

            <p className="mt-9 text-left text-base leading-8 text-ink-700 md:text-justify md:text-lg md:leading-9">
              {t('p2')}
            </p>

            <div className="mt-10 flex items-center justify-end border-t border-silk-600/25 pt-7">
              <Image
                src="/img/stewart-signature.png"
                alt="Signature of Stewart Fotheringham"
                width={220}
                height={72}
                /* Near-black ink on transparency, same as the wordmark. */
                className="h-auto w-auto max-w-[13rem] dark:invert"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorMessage;
