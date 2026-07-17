export const THEME_STORAGE_KEY = 'sdsc.theme';

export type Theme = 'light' | 'dark';

/**
 * Runs blocking in <head>, before first paint. The site is a static export, so
 * the server cannot know the reader's theme — without this the page would
 * always paint light and then flip, flashing on every navigation. Deliberately
 * tiny and dependency-free for that reason.
 *
 * Light is the default: dark applies only once the reader has chosen it and it
 * is in storage. The OS `prefers-color-scheme` is deliberately not consulted,
 * so a visitor never lands on dark without having asked for it.
 */
export const themeInitScript = `(function(){try{if(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)})==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;
