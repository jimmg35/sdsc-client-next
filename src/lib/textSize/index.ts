export const TEXT_SIZE_STORAGE_KEY = 'sdsc.textSize';

/**
 * Reader-chosen text sizes. Each one sets `data-text-size` on <html>, and
 * globals.css maps it to the root font size, so everything sized in rem
 * (which is the whole site) scales together. `medium`, the middle option, is
 * the default and carries no attribute.
 */
export const TEXT_SIZE_OPTIONS = ['small', 'medium', 'large'] as const;

export const DEFAULT_TEXT_SIZE: TextSize = 'medium';

export type TextSize = (typeof TEXT_SIZE_OPTIONS)[number];

/**
 * Runs blocking in <head> alongside the theme script, so a stored pick is on
 * <html> before first paint and the page does not reflow after hydration.
 */
export const textSizeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  TEXT_SIZE_STORAGE_KEY
)});if(${JSON.stringify(
  TEXT_SIZE_OPTIONS.filter((size) => size !== DEFAULT_TEXT_SIZE)
)}.indexOf(s)>-1){document.documentElement.setAttribute("data-text-size",s)}}catch(e){}})();`;

export function readTextSize(): TextSize {
  const value = document.documentElement.getAttribute('data-text-size');
  return TEXT_SIZE_OPTIONS.includes(value as TextSize)
    ? (value as TextSize)
    : DEFAULT_TEXT_SIZE;
}

export function setTextSizePreference(size: TextSize) {
  const root = document.documentElement;

  if (size === DEFAULT_TEXT_SIZE) {
    root.removeAttribute('data-text-size');
  } else {
    root.setAttribute('data-text-size', size);
  }

  try {
    if (size === DEFAULT_TEXT_SIZE) {
      window.localStorage.removeItem(TEXT_SIZE_STORAGE_KEY);
    } else {
      window.localStorage.setItem(TEXT_SIZE_STORAGE_KEY, size);
    }
  } catch {
    // Private mode / storage disabled: the pick still holds for this page.
  }
}
