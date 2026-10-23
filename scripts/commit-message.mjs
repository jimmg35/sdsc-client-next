// Writes the commit message for deploy.mjs from the changed paths alone:
// which areas changed (news, members, pages, ...), which items in them, and
// whether they were added, updated or removed.
//
//   content(news,briefing): update sdsc-augmented-reality-sandbox, recent-briefing
//
// The subject names the items (an area with many becomes a count). When that
// is too long it names only the content items, since code and tooling areas
// still show in the scope, then falls back to counts. The body always lists
// everything.
import { execFileSync } from 'node:child_process';

// The repo's history already has subjects past 100 characters, so 100 rather
// than the usual 72.
const SUBJECT_LIMIT = 100;
const NAMED_PER_AREA = 3;
const BODY_ITEMS = 8;
const MAX_SCOPES = 4;

// First match wins, so the catch-all config entry stays last.
const AREAS = [
  {
    scope: 'news',
    noun: ['news post', 'news posts'],
    content: true,
    match: /^src\/contents\/news\/([^/]+?)(?:\.mdx?)?(?:\/|$)/
  },
  {
    scope: 'announcements',
    noun: ['announcement', 'announcements'],
    content: true,
    match: /^src\/contents\/announcements\/([^/]+?)(?:\.mdx?)?(?:\/|$)/
  },
  {
    scope: 'briefing',
    noun: ['briefing', 'briefings'],
    content: true,
    match: /^src\/contents\/briefings\/([^/]+?)(?:\.mdx?)?$/
  },
  {
    scope: 'stories',
    noun: ['lab story', 'lab stories'],
    content: true,
    match: /^src\/contents\/lab-stories\/([^/]+?)(?:\.json)?$/
  },
  {
    scope: 'members',
    noun: ['member', 'members'],
    content: true,
    match: /^src\/contents\/members\/([^/]+)\//
  },
  {
    scope: 'publications',
    noun: ['publication', 'publications'],
    content: true,
    match: /^src\/contents\/publications\/([^/]+)\//
  },
  {
    scope: 'copy',
    noun: ['message file', 'message files'],
    content: true,
    match: /^messages\/(.+)$/
  },
  {
    scope: 'assets',
    noun: ['asset', 'assets'],
    content: true,
    match: /^public\/(.+)$/
  },
  {
    scope: 'pages',
    noun: ['page', 'pages'],
    match: /^src\/app\/(?:\([^/]+\)\/)?([^/.]+)/
  },
  {
    scope: 'components',
    noun: ['component', 'components'],
    match: /^src\/components\/([^/]+(?:\/[^/.]+)?)/
  },
  {
    scope: 'lib',
    noun: ['module', 'modules'],
    match: /^src\/lib\/([^/.]+)/
  },
  {
    scope: 'deploy',
    noun: ['deploy script', 'deploy scripts'],
    tooling: true,
    match: /^(deploy\.mjs|scripts\/.+)$/
  },
  {
    scope: 'config',
    noun: ['config file', 'config files'],
    tooling: true,
    match: /^(.+)$/
  }
];

const VERBS = { A: 'add', M: 'update', D: 'remove' };

// Every changed file as { status: 'A' | 'M' | 'D', path }, untracked files
// included and renames split into a removal and an addition.
export function pendingChanges() {
  const output = execFileSync(
    'git',
    ['status', '--porcelain=v1', '-z', '-uall', '--no-renames'],
    { encoding: 'utf8' }
  );
  return output
    .split('\0')
    .filter(Boolean)
    .map((entry) => {
      const code = entry.slice(0, 2);
      const status =
        code === '??' || code[0] === 'A' ? 'A' : code.includes('D') ? 'D' : 'M';
      return { status, path: entry.slice(3) };
    });
}

// Returns { subject, body } for the given pendingChanges() entries.
export function commitMessage(changes) {
  const groups = groupByArea(changes);
  const type = groups.every(({ area }) => area.content)
    ? 'content'
    : groups.every(({ area }) => area.tooling)
      ? 'chore'
      : 'update';
  const scope =
    groups.length > MAX_SCOPES
      ? 'site'
      : groups.map(({ area }) => area.scope).join(',');
  const prefix = `${type}(${scope}): `;

  const hasContent = groups.some(({ area }) => area.content);
  const candidates = [
    summarize(groups, { named: true }),
    hasContent && type !== 'content'
      ? summarize(
          groups.filter(({ area }) => area.content),
          { named: true }
        )
      : null,
    summarize(groups, { named: false }),
    `update ${changes.length} files`
  ].filter(Boolean);
  const subject =
    candidates
      .map((summary) => prefix + summary)
      .find((line) => line.length <= SUBJECT_LIMIT) ??
    prefix + candidates.at(-1);

  const body = groups
    .map(({ area, items }) => {
      const parts = Object.values(VERBS)
        .map((verb) => {
          const names = items
            .filter((item) => item.verb === verb)
            .map((item) => item.name);
          if (names.length === 0) return null;
          const shown = names.slice(0, BODY_ITEMS).join(', ');
          const more =
            names.length > BODY_ITEMS
              ? ` and ${names.length - BODY_ITEMS} more`
              : '';
          return `${verb} ${shown}${more}`;
        })
        .filter(Boolean);
      return `${area.scope}: ${parts.join('; ')}`;
    })
    .join('\n');

  return { subject, body };
}

// [{ area, items: [{ name, verb }] }] in AREAS order. An item whose files were
// all added counts as added, all removed as removed, anything else as updated.
function groupByArea(changes) {
  const items = new Map();
  for (const { status, path } of changes) {
    const area = AREAS.find(({ match }) => match.test(path));
    const name = path.match(area.match)[1];
    const key = `${area.scope}\0${name}`;
    const item = items.get(key) ?? { area, name, statuses: new Set() };
    item.statuses.add(status);
    items.set(key, item);
  }

  return AREAS.map((area) => ({
    area,
    items: [...items.values()]
      .filter((item) => item.area === area)
      .map(({ name, statuses }) => ({
        name,
        verb: VERBS[statuses.size === 1 ? [...statuses][0] : 'M']
      }))
  })).filter(({ items }) => items.length > 0);
}

// "add huanping-huang; update sdsc-augmented-reality-sandbox, 12 publications":
// one clause per verb, one chunk per area, names or a count.
function summarize(groups, { named }) {
  return Object.values(VERBS)
    .map((verb) => {
      const chunks = groups
        .map(({ area, items }) => {
          const names = items
            .filter((item) => item.verb === verb)
            .map((item) => item.name);
          if (names.length === 0) return null;
          return named && names.length <= NAMED_PER_AREA
            ? names.join(', ')
            : `${names.length} ${area.noun[names.length === 1 ? 0 : 1]}`;
        })
        .filter(Boolean);
      return chunks.length > 0 ? `${verb} ${chunks.join(', ')}` : null;
    })
    .filter(Boolean)
    .join('; ');
}
