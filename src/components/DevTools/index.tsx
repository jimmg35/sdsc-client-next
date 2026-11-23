'use client';

import { useEffect } from 'react';

/**
 * Mounts development-only tooling. Renders nothing itself.
 *
 * The import sits inside a branch on `process.env.NODE_ENV`, which the bundler
 * replaces with a literal, so a production build sees `if (false)` and never
 * emits the panel's chunk at all — this component is the only trace it leaves.
 */
export default function DevTools() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let unmount: (() => void) | undefined;
    let cancelled = false;

    import('./ThemePanel').then(({ mountThemePanel }) => {
      if (!cancelled) unmount = mountThemePanel();
    });

    return () => {
      cancelled = true;
      unmount?.();
    };
  }, []);

  return null;
}
