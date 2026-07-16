'use client';

import { useEffect } from 'react';

// The root <html lang> is statically rendered as the default locale. This keeps
// document.documentElement.lang in sync with the active locale on the client.
export default function HtmlLangSetter({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
