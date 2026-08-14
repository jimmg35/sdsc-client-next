import { getRequestConfig } from 'next-intl/server';

// i18n is temporarily switched off: the site ships English only, so there is no
// locale routing segment and nothing to negotiate. next-intl stays wired up
// purely as the message-catalogue lookup for `messages/en.json`, which keeps
// every translation key in the components intact — restoring the other locales
// means bringing back `routing.ts`/`navigation.ts` and the `[locale]` segment,
// not rewriting call sites.
export default getRequestConfig(async () => ({
  locale: 'en',
  messages: (await import('../../messages/en.json')).default
}));
