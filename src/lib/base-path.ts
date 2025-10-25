const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? '';

const normalizedBasePath =
  rawBasePath && rawBasePath !== '/'
    ? rawBasePath.startsWith('/')
      ? rawBasePath.replace(/\/+$/, '')
      : `/${rawBasePath.replace(/\/+$/, '')}`
    : '';

export const basePath = normalizedBasePath;

export const withBasePath = (path: string): string => {
  if (!path || /^(?:[a-z]+:)?\/\//i.test(path)) {
    return path;
  }

  if (!basePath) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`.replace(/\/{2,}/g, '/');
};

