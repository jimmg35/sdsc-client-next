import HtmlLangSetter from '@/components/Layout/HtmlLangSetter';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type LocaleParams = Promise<{ locale: string }>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: LocaleParams;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <HtmlLangSetter locale={locale} />
      {/* Statically carries the locale at first paint, which drives both the
          per-script font stack (:lang in globals.css) and the browser's Han
          glyph selection. The root <html lang> is only corrected after
          hydration, which would otherwise flash the wrong CJK glyph forms.
          `display: contents` keeps this out of the layout box tree. */}
      <div lang={locale} style={{ display: 'contents' }}>
        {props.children}
      </div>
    </NextIntlClientProvider>
  );
}
