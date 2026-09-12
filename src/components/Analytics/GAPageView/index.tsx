'use client';

import { trackPageView } from '@/lib/ga';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// App Router navigations never reload the document, so gtag's own page_view
// would only ever fire on the very first paint and every later route would go
// unrecorded. The config call leaves send_page_view off and this sends exactly
// one page_view per route instead, the initial one included.
const GAPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
};

export default GAPageView;
