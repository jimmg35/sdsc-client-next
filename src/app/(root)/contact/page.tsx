import { CONTACT_ADDRESS_LINES, CONTACT_EMAIL } from '@/lib/contact';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const RULE = 'border-accent-600/25';

export default async function Contact() {
  const t = await getTranslations('contact');

  const engagements = [t('engageItem1'), t('engageItem2'), t('engageItem3')];

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-36 md:pt-40">
        <header className="max-w-3xl">
          <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:text-xs md:tracking-[0.42em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
            />
            {t('chip')}
          </p>
          <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ink-900 md:text-[3rem] md:leading-[1.06]">
            {t('title')}
          </h1>
          <p className="mt-6 text-base leading-8 text-ink-700 md:text-lg md:leading-9">
            {t('intro')}
          </p>
        </header>

        {/* The address used to be one run-on comma string and the inbox was
            plain text. Here the email is the page's primary action. */}
        <dl
          className={`mt-16 grid gap-x-14 gap-y-10 border-y ${RULE} py-9 md:grid-cols-2`}
        >
          <div>
            <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-accent-700">
              {t('emailLabel')}
            </dt>
            <dd className="mt-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group inline-flex items-center gap-3 text-xl font-medium tracking-[-0.01em] text-ink-900 transition-colors duration-300 hover:text-primary-600 md:text-2xl"
              >
                {CONTACT_EMAIL}
                <ArrowUpRight
                  size={20}
                  aria-hidden
                  className="shrink-0 text-primary-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </dd>
          </div>

          <div>
            <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-accent-700">
              {t('visitLabel')}
            </dt>
            <dd className="mt-4">
              <address className="text-sm not-italic leading-7 text-ink-700">
                {CONTACT_ADDRESS_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </dd>
          </div>
        </dl>

        <section className="mt-20">
          <h2 className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:tracking-[0.4em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
            />
            {t('engageTitle')}
          </h2>

          <ol className="mt-8">
            {engagements.map((item, index) => (
              <li
                key={item}
                className={`grid gap-x-8 border-t ${RULE} py-6 sm:grid-cols-[3rem_1fr]`}
              >
                <span
                  aria-hidden
                  className="hidden text-[0.7rem] font-semibold tabular-nums tracking-[0.18em] text-primary-600 sm:block"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="max-w-2xl text-base leading-8 text-ink-900">
                  {item}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`mt-20 border-t ${RULE} pt-10`}>
          <h2 className="max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-ink-900 md:text-[2rem] md:leading-[1.15]">
            {t('gradTitle')}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-700">
            {t('gradDescription')}
          </p>
          {/* The copy tells students to email; give them the link to do it. */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-primary-400/70 bg-primary-500/90 px-6 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white transition duration-300 hover:bg-primary-600"
          >
            {t('emailLabel')}
            <ArrowUpRight
              size={16}
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </section>
      </div>
    </section>
  );
}
