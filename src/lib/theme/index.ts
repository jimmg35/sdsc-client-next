export const THEME_STORAGE_KEY = 'sdsc.theme';

export type Theme = 'light' | 'dark';

/**
 * Colour palettes defined in src/app/theme.css. Adding one there means adding
 * it here too, or `?palette=` and the dev panel will not offer it. `swatch`
 * is primary then accent, for the dev panel only.
 */
export const PALETTE_OPTIONS = [
  { id: 'fsu', label: 'FSU', swatch: ['#782f40', '#ceb888'] },
  { id: 'heritage', label: 'Heritage', swatch: ['#a86ea1', '#d3b287'] },
  { id: 'harbor', label: 'Harbor', swatch: ['#1f3a5f', '#c8875a'] },
  { id: 'tide', label: 'Tide', swatch: ['#11606b', '#d9c49a'] },
  { id: 'moss', label: 'Moss', swatch: ['#2f5d46', '#c2a24f'] },
  { id: 'dusk', label: 'Dusk', swatch: ['#3d3b8e', '#e8a87c'] }
] as const;

export type Palette = (typeof PALETTE_OPTIONS)[number]['id'];

export const PALETTES = PALETTE_OPTIONS.map((option) => option.id);

export const PALETTE_STORAGE_KEY = 'sdsc.palette';

/** The palette the site ships with. Change this to re-colour the site. */
export const SITE_PALETTE: Palette = 'dusk';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Runs blocking in <head>, before first paint. The site is a static export, so
 * the server cannot know the reader's theme — without this the page would
 * always paint light and then flip, flashing on every navigation. Deliberately
 * tiny and dependency-free for that reason.
 *
 * The system setting (`prefers-color-scheme`) is the default, and the page
 * keeps following it — live, if the OS switches on a schedule — until the
 * reader picks a theme with the toggle. A stored pick wins from then on; see
 * `setThemePreference` for how a reader goes back to the system.
 *
 * `?palette=<name>` previews another palette. It is kept for the rest of the
 * tab's session so it survives navigation, and `?palette=` with no value (or
 * an unknown name) drops back to SITE_PALETTE.
 */
export const themeInitScript = `(function(){var d=document.documentElement;try{var t=${JSON.stringify(
  THEME_STORAGE_KEY
)},m=window.matchMedia(${JSON.stringify(
  DARK_QUERY
)}),a=function(){var s=null;try{s=localStorage.getItem(t)}catch(e){}d.classList.toggle("dark",s==="dark"||(s!=="light"&&m.matches))};a();m.addEventListener?m.addEventListener("change",a):m.addListener(a)}catch(e){}try{var k=${JSON.stringify(
  PALETTE_STORAGE_KEY
)},l=${JSON.stringify(PALETTES)},q=new URLSearchParams(location.search);if(q.has("palette")){var p=q.get("palette");if(l.indexOf(p)>-1){sessionStorage.setItem(k,p)}else{sessionStorage.removeItem(k)}}var s=sessionStorage.getItem(k);if(s&&l.indexOf(s)>-1){d.setAttribute("data-palette",s)}}catch(e){}})();`;

/**
 * Applies a pick from a theme toggle, on the client. A pick that matches the
 * system setting is not stored: the site simply goes back to following the
 * system, so toggling away and back is how a reader drops an override.
 */
export function setThemePreference(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');

  const systemTheme: Theme = window.matchMedia(DARK_QUERY).matches
    ? 'dark'
    : 'light';

  try {
    if (theme === systemTheme) {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch {
    // Private mode / storage disabled: the pick still holds for this page.
  }
}
