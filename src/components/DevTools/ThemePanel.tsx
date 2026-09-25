'use client';

import {
  PALETTE_OPTIONS,
  PALETTE_STORAGE_KEY,
  SITE_PALETTE,
  setThemePreference
} from '@/lib/theme';
import {
  type PaletteSeed,
  contrastRatio,
  generatePalette,
  paletteToCss
} from '@/lib/theme/palette';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Root, createRoot } from 'react-dom/client';

/*
 * Development-only theme panel. It is rendered into its own shadow root so
 * none of the site's CSS reaches it and none of its CSS reaches the site, and
 * it deliberately uses a fixed devtools-style palette of its own rather than
 * the theme tokens it is editing — otherwise a bad palette would make the
 * panel unreadable at exactly the moment it is needed.
 *
 * It drives the same hooks the real site uses: `data-palette` on <html>, the
 * `dark` class, and the storage keys the blocking theme script reads.
 */

const CUSTOM_ID = 'custom';
const CUSTOM_STYLE_ID = 'sdsc-dev-palette';
const OPEN_KEY = 'sdsc.dev.panelOpen';
const SEED_KEY = 'sdsc.dev.customSeed';

type PaletteId = (typeof PALETTE_OPTIONS)[number]['id'] | typeof CUSTOM_ID;

const DEFAULT_SEED: PaletteSeed = {
  primary: '#782f40',
  accent: '#ceb888',
  neutralHue: 60,
  neutralChroma: 0.006
};

const storage = {
  get(area: Storage, key: string) {
    try {
      return area.getItem(key);
    } catch {
      return null;
    }
  },
  set(area: Storage, key: string, value: string | null) {
    try {
      if (value === null) area.removeItem(key);
      else area.setItem(key, value);
    } catch {
      // Storage blocked: the panel still works for this page view.
    }
  }
};

const readSeed = (): PaletteSeed => {
  const raw = storage.get(localStorage, SEED_KEY);
  if (!raw) return DEFAULT_SEED;
  try {
    return { ...DEFAULT_SEED, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SEED;
  }
};

const root = () => document.documentElement;

const applyCustom = (seed: PaletteSeed) => {
  let style = document.getElementById(CUSTOM_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = CUSTOM_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = paletteToCss(CUSTOM_ID, generatePalette(seed));
  root().setAttribute('data-palette', CUSTOM_ID);
  storage.set(sessionStorage, PALETTE_STORAGE_KEY, CUSTOM_ID);
  storage.set(localStorage, SEED_KEY, JSON.stringify(seed));
};

const applyPreset = (id: string) => {
  document.getElementById(CUSTOM_STYLE_ID)?.remove();
  root().setAttribute('data-palette', id);
  storage.set(
    sessionStorage,
    PALETTE_STORAGE_KEY,
    id === SITE_PALETTE ? null : id
  );
};

const readVar = (name: string) =>
  getComputedStyle(root()).getPropertyValue(name).trim();

const isHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

const CONTRAST_ROWS = [
  { label: 'Headings', fg: '--color-ink-900', bg: '--color-surface' },
  { label: 'Body copy', fg: '--color-ink-700', bg: '--color-accent-50' },
  { label: 'Captions', fg: '--color-ink-500', bg: '--color-surface' },
  { label: 'Links / active', fg: '--color-primary-600', bg: '--color-surface' },
  { label: 'Eyebrows', fg: '--color-accent-700', bg: '--color-surface' }
];

const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

type Snapshot = {
  primary: string[];
  accent: string[];
  contrast: { label: string; ratio: number | null }[];
};

const takeSnapshot = (): Snapshot => ({
  primary: RAMP_STEPS.map((s) => readVar(`--color-primary-${s}`)),
  accent: RAMP_STEPS.map((s) => readVar(`--color-accent-${s}`)),
  contrast: CONTRAST_ROWS.map((row) => {
    const fg = readVar(row.fg);
    const bg = readVar(row.bg);
    return {
      label: row.label,
      ratio: isHex(fg) && isHex(bg) ? contrastRatio(fg, bg) : null
    };
  })
});

function Panel() {
  const [open, setOpen] = useState(
    () => storage.get(localStorage, OPEN_KEY) === '1'
  );
  const [palette, setPalette] = useState<PaletteId>(
    () =>
      (root().getAttribute('data-palette') as PaletteId | null) ?? SITE_PALETTE
  );
  const [dark, setDark] = useState(() => root().classList.contains('dark'));
  const [seed, setSeed] = useState<PaletteSeed>(readSeed);
  const [name, setName] = useState('my-palette');
  const [copied, setCopied] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  const refresh = useCallback(() => {
    requestAnimationFrame(() => setSnapshot(takeSnapshot()));
  }, []);

  // A custom palette lives only in this tab, so the blocking theme script
  // cannot restore it; re-apply it once the panel mounts.
  useEffect(() => {
    if (storage.get(sessionStorage, PALETTE_STORAGE_KEY) === CUSTOM_ID) {
      applyCustom(readSeed());
      setPalette(CUSTOM_ID);
    }
    refresh();

    // Keep the panel in step with the site's own theme toggle.
    const observer = new MutationObserver(() => {
      setDark(root().classList.contains('dark'));
      refresh();
    });
    observer.observe(root(), {
      attributes: true,
      attributeFilter: ['class', 'data-palette']
    });
    return () => observer.disconnect();
  }, [refresh]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.code === 'KeyT') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    storage.set(localStorage, OPEN_KEY, open ? '1' : null);
  }, [open]);

  const choosePreset = (id: PaletteId) => {
    applyPreset(id);
    setPalette(id);
  };

  const updateSeed = (patch: Partial<PaletteSeed>) => {
    const next = { ...seed, ...patch };
    setSeed(next);
    applyCustom(next);
    setPalette(CUSTOM_ID);
  };

  const startFromCurrent = () => {
    const option = PALETTE_OPTIONS.find((o) => o.id === palette);
    const next = option
      ? { ...seed, primary: option.swatch[0], accent: option.swatch[1] }
      : seed;
    updateSeed(next);
  };

  const toggleDark = (next: boolean) => {
    setThemePreference(next ? 'dark' : 'light');
    setDark(next);
  };

  const resetAll = () => {
    applyPreset(SITE_PALETTE);
    setPalette(SITE_PALETTE);
  };

  const slug = useMemo(
    () =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'my-palette',
    [name]
  );

  const copyCss = async () => {
    const label = slug
      .split('-')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ');
    const register = `Register in PALETTE_OPTIONS (src/lib/theme): { id: '${slug}', label: '${label}', swatch: ['${seed.primary}', '${seed.accent}'] }`;
    const css = paletteToCss(
      slug,
      generatePalette(seed),
      `${label}: seeded from ${seed.primary} and ${seed.accent}.\n   ${register}`
    );
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt('Copy the palette CSS:', css);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        className="fab"
        onClick={() => setOpen(true)}
        title="Theme dev panel (Alt+Shift+T)"
        aria-label="Open theme dev panel"
      >
        <span
          className="fab-dot"
          style={{ background: snapshot?.primary[6] || '#888' }}
        />
        <span
          className="fab-dot"
          style={{ background: snapshot?.accent[4] || '#bbb' }}
        />
      </button>
    );
  }

  return (
    <aside className="panel" aria-label="Theme dev panel">
      <header className="head">
        <div>
          <p className="kicker">Dev only</p>
          <h1>Theme</h1>
        </div>
        <button
          type="button"
          className="icon"
          onClick={() => setOpen(false)}
          aria-label="Collapse panel"
          title="Collapse (Alt+Shift+T)"
        >
          ×
        </button>
      </header>

      <section>
        <h2>Mode</h2>
        <div className="segmented">
          <button
            type="button"
            className={!dark ? 'on' : ''}
            onClick={() => toggleDark(false)}
          >
            Light
          </button>
          <button
            type="button"
            className={dark ? 'on' : ''}
            onClick={() => toggleDark(true)}
          >
            Dark
          </button>
        </div>
      </section>

      <section>
        <h2>
          Palette
          {palette !== SITE_PALETTE && (
            <button type="button" className="link" onClick={resetAll}>
              Reset to site default
            </button>
          )}
        </h2>
        <div className="grid">
          {PALETTE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`card ${palette === option.id ? 'on' : ''}`}
              onClick={() => choosePreset(option.id)}
            >
              <span className="chips">
                <span style={{ background: option.swatch[0] }} />
                <span style={{ background: option.swatch[1] }} />
              </span>
              <span className="card-label">
                {option.label}
                {option.id === SITE_PALETTE && <em>site</em>}
              </span>
            </button>
          ))}
          <button
            type="button"
            className={`card ${palette === CUSTOM_ID ? 'on' : ''}`}
            onClick={() => updateSeed({})}
          >
            <span className="chips">
              <span style={{ background: seed.primary }} />
              <span style={{ background: seed.accent }} />
            </span>
            <span className="card-label">Custom</span>
          </button>
        </div>
      </section>

      <section>
        <h2>
          Custom palette
          {palette !== CUSTOM_ID && (
            <button type="button" className="link" onClick={startFromCurrent}>
              Start from current
            </button>
          )}
        </h2>
        <div className="field-row">
          <label className="color">
            <input
              type="color"
              value={seed.primary}
              onChange={(e) => updateSeed({ primary: e.target.value })}
            />
            <span>
              Primary
              <code>{seed.primary}</code>
            </span>
          </label>
          <label className="color">
            <input
              type="color"
              value={seed.accent}
              onChange={(e) => updateSeed({ accent: e.target.value })}
            />
            <span>
              Accent
              <code>{seed.accent}</code>
            </span>
          </label>
        </div>
        <label className="range">
          <span>
            Neutral hue <code>{seed.neutralHue}°</code>
          </span>
          <input
            type="range"
            min={0}
            max={360}
            value={seed.neutralHue}
            className="hue"
            onChange={(e) => updateSeed({ neutralHue: +e.target.value })}
          />
        </label>
        <label className="range">
          <span>
            Neutral tint <code>{seed.neutralChroma.toFixed(3)}</code>
          </span>
          <input
            type="range"
            min={0}
            max={0.03}
            step={0.001}
            value={seed.neutralChroma}
            onChange={(e) => updateSeed({ neutralChroma: +e.target.value })}
          />
        </label>
        <div className="export">
          <input
            aria-label="Palette name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="button" className="primary" onClick={copyCss}>
            {copied ? 'Copied' : 'Copy CSS'}
          </button>
        </div>
        <p className="hint">
          Paste into src/app/theme.css, then add the entry in the CSS comment to
          PALETTE_OPTIONS in src/lib/theme.
        </p>
      </section>

      {snapshot && (
        <>
          <section>
            <h2>Live ramps</h2>
            {(['primary', 'accent'] as const).map((ramp) => (
              <div key={ramp} className="ramp" title={ramp}>
                {snapshot[ramp].map((color, i) => (
                  <span
                    key={RAMP_STEPS[i]}
                    style={{ background: color }}
                    title={`${ramp}-${RAMP_STEPS[i]} ${color}`}
                  />
                ))}
              </div>
            ))}
          </section>

          <section>
            <h2>Contrast (WCAG)</h2>
            <ul className="contrast">
              {snapshot.contrast.map((row) => {
                const r = row.ratio;
                const grade =
                  r === null ? 'na' : r >= 7 ? 'aaa' : r >= 4.5 ? 'aa' : 'fail';
                return (
                  <li key={row.label}>
                    <span>{row.label}</span>
                    <span className={`badge ${grade}`}>
                      {r === null ? '—' : `${r.toFixed(1)}:1`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      <footer>
        <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> toggles · not in production
        builds
      </footer>
    </aside>
  );
}

const STYLES = `
:host { all: initial; }
* { box-sizing: border-box; }
button, input { font: inherit; color: inherit; }
.fab, .panel {
  position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 12px; line-height: 1.4; color: #e6e7ea;
  -webkit-font-smoothing: antialiased;
}
.fab {
  display: flex; align-items: center; justify-content: center; gap: 3px;
  width: 40px; height: 40px; border-radius: 12px; cursor: pointer;
  background: #17181c; border: 1px solid #34363d;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  transition: transform .15s ease;
}
.fab:hover { transform: translateY(-2px); }
.fab-dot { width: 11px; height: 11px; border-radius: 50%; box-shadow: 0 0 0 1px rgba(255,255,255,.18); }
.panel {
  width: 300px; max-height: calc(100vh - 32px); overflow: auto;
  background: rgba(23,24,28,.97); border: 1px solid #34363d; border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0,0,0,.45); backdrop-filter: blur(10px);
  scrollbar-width: thin; scrollbar-color: #3a3c44 transparent;
}
.head { display: flex; align-items: flex-start; justify-content: space-between; padding: 14px 14px 6px; }
.kicker { margin: 0; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #f0b429; }
h1 { margin: 2px 0 0; font-size: 15px; font-weight: 600; }
h2 { display: flex; justify-content: space-between; align-items: baseline; margin: 0 0 8px; font-size: 10.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #9a9ca5; }
section { padding: 12px 14px; border-top: 1px solid #2a2c32; }
.icon { width: 26px; height: 26px; border-radius: 8px; border: 1px solid #34363d; background: transparent; cursor: pointer; font-size: 16px; line-height: 1; color: #9a9ca5; }
.icon:hover { color: #fff; background: #25272d; }
.link { border: 0; background: none; padding: 0; cursor: pointer; font-size: 11px; letter-spacing: 0; text-transform: none; font-weight: 500; color: #7aa2ff; }
.link:hover { text-decoration: underline; }
.segmented { display: grid; grid-template-columns: 1fr 1fr; padding: 3px; border-radius: 9px; background: #101114; border: 1px solid #2a2c32; }
.segmented button { border: 0; border-radius: 6px; padding: 6px 0; background: none; cursor: pointer; color: #9a9ca5; }
.segmented .on { background: #2b2d34; color: #fff; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
.card { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 9px; border: 1px solid #2a2c32; background: #1d1e23; cursor: pointer; text-align: left; }
.card:hover { border-color: #444751; }
.card.on { border-color: #7aa2ff; background: #1f2432; }
.chips { display: flex; }
.chips span { width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 0 1.5px #1d1e23; }
.chips span + span { margin-left: -5px; }
.card-label { display: flex; gap: 6px; align-items: baseline; font-weight: 500; }
.card-label em { font-style: normal; font-size: 9.5px; color: #f0b429; text-transform: uppercase; letter-spacing: .06em; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; }
.color { display: flex; align-items: center; gap: 8px; padding: 6px; border-radius: 9px; border: 1px solid #2a2c32; background: #1d1e23; cursor: pointer; }
.color input { width: 26px; height: 26px; padding: 0; border: 0; border-radius: 6px; background: none; cursor: pointer; }
.color input::-webkit-color-swatch-wrapper { padding: 0; }
.color input::-webkit-color-swatch { border: 0; border-radius: 6px; }
.color span { display: flex; flex-direction: column; font-weight: 500; }
code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10.5px; color: #9a9ca5; font-weight: 400; }
.range { display: block; margin-bottom: 8px; }
.range span { display: flex; justify-content: space-between; margin-bottom: 4px; color: #c5c7cd; }
.range input { width: 100%; accent-color: #7aa2ff; }
.range input.hue { -webkit-appearance: none; appearance: none; height: 8px; border-radius: 4px; background: linear-gradient(90deg, hsl(0 45% 55%), hsl(60 45% 55%), hsl(120 45% 55%), hsl(180 45% 55%), hsl(240 45% 55%), hsl(300 45% 55%), hsl(360 45% 55%)); }
.range input.hue::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 2px solid #17181c; cursor: pointer; }
.range input.hue::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: #fff; border: 2px solid #17181c; cursor: pointer; }
.export { display: flex; gap: 6px; margin-top: 4px; }
.export input { flex: 1; min-width: 0; padding: 6px 8px; border-radius: 8px; border: 1px solid #34363d; background: #101114; }
.export input:focus { outline: none; border-color: #7aa2ff; }
.primary { padding: 6px 12px; border-radius: 8px; border: 0; background: #7aa2ff; color: #0d1220; font-weight: 600; cursor: pointer; }
.primary:hover { background: #95b5ff; }
.hint { margin: 8px 0 0; font-size: 10.5px; color: #7d808a; }
.ramp { display: grid; grid-template-columns: repeat(10, 1fr); height: 18px; border-radius: 6px; overflow: hidden; margin-bottom: 5px; box-shadow: 0 0 0 1px #2a2c32; }
.contrast { list-style: none; margin: 0; padding: 0; }
.contrast li { display: flex; justify-content: space-between; align-items: center; padding: 3px 0; color: #c5c7cd; }
.badge { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10.5px; padding: 1px 6px; border-radius: 5px; }
.badge.aaa { background: #16331f; color: #6ee7a0; }
.badge.aa { background: #1c2c3d; color: #8cc4ff; }
.badge.fail { background: #3d1c1c; color: #ff8a8a; }
.badge.na { color: #7d808a; }
footer { padding: 10px 14px 12px; border-top: 1px solid #2a2c32; font-size: 10.5px; color: #7d808a; }
kbd { font-family: inherit; font-size: 10px; padding: 0 4px; border-radius: 4px; border: 1px solid #34363d; background: #1d1e23; }
button:focus-visible, input:focus-visible { outline: 2px solid #7aa2ff; outline-offset: 2px; }
`;

/** Mounts the panel in a shadow root on <body>. Returns an unmount function. */
export function mountThemePanel() {
  const host = document.createElement('div');
  host.id = 'sdsc-devtools';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = STYLES;
  const container = document.createElement('div');
  shadow.append(style, container);

  const reactRoot: Root = createRoot(container);
  reactRoot.render(<Panel />);

  return () => {
    reactRoot.unmount();
    host.remove();
  };
}
