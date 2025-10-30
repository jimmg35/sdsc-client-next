/**
 * Returns the configured Next.js basePath for client and server modules.
 * Falls back to an empty string when no basePath is set.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const prefixPattern = /^(?:[a-z]+:)?\/\//i;

/**
 * Prefixes local asset paths with the configured basePath.
 * Remote URLs and already-prefixed paths are returned untouched.
 */
export function withBasePath(src: string): string {
  if (!basePath) {
    return src;
  }

  if (!src) {
    return src;
  }

  if (prefixPattern.test(src) || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  if (src.startsWith(basePath)) {
    return src;
  }

  if (src.startsWith('/')) {
    return `${basePath}${src}`;
  }

  return `${basePath}/${src}`;
}
