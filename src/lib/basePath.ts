const assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBasePath(path: string | null | undefined): string {
  if (!path) {
    return '';
  }

  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:')
  ) {
    return path;
  }

  if (!assetPrefix) {
    return path;
  }

  if (path.startsWith(assetPrefix + '/')) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${assetPrefix}${path}`;
  }

  return `${assetPrefix}/${path}`;
}

export function getAssetPrefix(): string {
  return assetPrefix;
}
