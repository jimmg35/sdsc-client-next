import { getTranslations } from 'next-intl/server';

export const MAIN_CONTENT_ID = 'main-content';

/* First focusable element on every page, so keyboard and screen-reader users
   can jump past the navigation. Hidden until it receives focus. */
export default async function SkipLink() {
  const t = await getTranslations('accessibility');

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary-600 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
    >
      {t('skipToContent')}
    </a>
  );
}
