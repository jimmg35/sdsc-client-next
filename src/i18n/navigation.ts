import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware navigation helpers. `Link` keeps internal routes within the
// active locale; external hrefs (http(s):, mailto:, tel:, #hash) pass through
// unchanged. `usePathname` returns the path WITHOUT the locale prefix.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
