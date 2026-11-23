// Fills in missing publication DOIs. Google Scholar does not expose DOIs, so
// every publication the Scholar sync writes starts without one, and the
// publications page has no DOI link to show.
//
//   npm run sync:publication-dois   # fill every publication missing a DOI
//
// update-google-scholar-publications.mjs uses findDoi for new entries too.
// arXiv preprints get their arXiv DOI straight from the identifier. Anything
// else is looked up on Crossref and taken only when a record has the same
// title and lists the first author or one of the SDSC members it belongs to
// (or, with no authors on record, a year within one), so a wrong link is
// unlikely; anything less certain stays empty.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const CONTENTS_DIR = path.join(process.cwd(), 'src', 'contents');
const PUBLICATIONS_DIR = path.join(CONTENTS_DIR, 'publications');
const MEMBERS_DIR = path.join(CONTENTS_DIR, 'members');
const CROSSREF_URL = 'https://api.crossref.org/works';
const USER_AGENT =
  'sdsc-client-next publication DOI lookup (https://sdsc.fsu.edu)';
// Crossref's anonymous pool allows only a few requests a second.
const REQUEST_DELAY_MS = 400;
const MAX_ATTEMPTS = 4;
const CANDIDATES = 10;
// Supplementary files and peer reviews carry the article's own title.
const SKIPPED_TYPES = new Set(['component', 'peer-review']);
// Preprints often carry the same title as the published paper; the published
// record wins when both match.
const PREPRINT_TYPES = new Set(['posted-content']);
// Scholar sometimes tacks a byline onto a title ("...: Gonsoroski et al.").
// The tail may add this share of the length at most, and no digits, which
// would mean a citation such as "(vol 93, 103794, 2023)" on a correction.
const TITLE_TAIL_SHARE = 0.25;

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await fillMissingDois();
}

// Returns "https://doi.org/..." or '' when there is no confident match.
export async function findDoi({
  title,
  author,
  year,
  journal = '',
  memberSurnames = []
}) {
  const arxivId = journal.match(/arXiv:(\d{4}\.\d{4,5})/i)?.[1];
  if (arxivId) return `https://doi.org/10.48550/arXiv.${arxivId}`;

  const firstAuthor = firstAuthorSurname(author);
  const url = new URL(CROSSREF_URL);
  url.searchParams.set('query.bibliographic', title);
  if (firstAuthor) url.searchParams.set('query.author', firstAuthor);
  url.searchParams.set('rows', String(CANDIDATES));
  url.searchParams.set('select', 'DOI,title,author,issued,type');

  const { message } = await fetchCrossref(url);
  const wantedSurnames = [firstAuthor, ...memberSurnames]
    .map(normalizeName)
    .filter(Boolean);
  const matches = message.items.filter((item) => {
    if (SKIPPED_TYPES.has(item.type)) return false;
    if (!titlesMatch(title, item.title?.[0] ?? '')) return false;

    // Some records put the whole name in `family` ("Stewart Fotheringham").
    const families = (item.author ?? [])
      .map(({ family }) =>
        normalizeName((family ?? '').trim().split(/\s+/).at(-1))
      )
      .filter(Boolean);
    if (wantedSurnames.length > 0 && families.length > 0) {
      return families.some((family) => wantedSurnames.includes(family));
    }
    const issuedYear = item.issued?.['date-parts']?.[0]?.[0];
    return Boolean(year && issuedYear && Math.abs(issuedYear - year) <= 1);
  });

  const best =
    matches.find((item) => !PREPRINT_TYPES.has(item.type)) ?? matches[0];
  return best ? `https://doi.org/${best.DOI}` : '';
}

// The last word of each member's name, by member id.
export async function loadMemberSurnames() {
  const surnames = new Map();
  for (const entry of await fs.readdir(MEMBERS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    try {
      const meta = JSON.parse(
        await fs.readFile(
          path.join(MEMBERS_DIR, entry.name, 'meta.json'),
          'utf8'
        )
      );
      const surname = meta.name
        ?.replace(/\([^)]*\)/g, ' ')
        .trim()
        .split(/\s+/)
        .at(-1);
      if (surname) surnames.set(meta.id ?? entry.name, surname);
    } catch {
      // A member without a readable meta.json cannot vouch for an author.
    }
  }
  return surnames;
}

async function fillMissingDois() {
  const surnamesById = await loadMemberSurnames();
  const entries = await fs.readdir(PUBLICATIONS_DIR, { withFileTypes: true });
  const missing = [];
  let checked = 0;
  let filled = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const metaPath = path.join(PUBLICATIONS_DIR, entry.name, 'meta.json');
    let meta;
    try {
      meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
    } catch {
      continue;
    }
    if (meta.doi) continue;

    checked += 1;
    try {
      const doi = await findDoi({
        title: meta.title,
        author: meta.author,
        year: parseYear(meta.catalog) ?? parseYear(meta.journal),
        journal: meta.journal,
        memberSurnames: (meta.memberIds ?? [])
          .map((id) => surnamesById.get(id))
          .filter(Boolean)
      });
      if (doi) {
        meta.doi = doi;
        await fs.writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`);
        filled += 1;
        console.log(`found    ${doi}  ${meta.title}`);
      } else {
        missing.push(meta.title);
        console.log(`no match ${meta.title}`);
      }
    } catch (error) {
      missing.push(meta.title);
      console.warn(`failed   ${meta.title}: ${error.message}`);
    }
  }

  console.log(
    `\nFilled ${filled} of ${checked} publications that had no DOI; ` +
      `${missing.length} left without one.`
  );
}

// Waits out 429s and server errors, as long as Retry-After asks or with a
// growing backoff, before giving up.
async function fetchCrossref(url) {
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(30_000)
    });
    await sleep(REQUEST_DELAY_MS);
    if (response.ok) return response.json();

    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === MAX_ATTEMPTS) {
      throw new Error(`Crossref responded with HTTP ${response.status}`);
    }
    const retryAfter = Number(response.headers.get('retry-after'));
    await sleep(
      Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 2 ** attempt * 1000
    );
  }
}

function titlesMatch(scholarTitle, crossrefTitle) {
  const scholar = normalizeTitle(scholarTitle);
  const crossref = normalizeTitle(crossrefTitle);
  if (!scholar || !crossref) return false;
  if (scholar === crossref) return true;

  const tail = scholar.slice(crossref.length);
  return (
    scholar.startsWith(crossref) &&
    tail.length <= scholar.length * TITLE_TAIL_SHARE &&
    !/\d/.test(tail)
  );
}

// "A Sevim, EE Ozguven, ..." -> "Sevim"; "Li, Z., & Fotheringham, ..." -> "Li"
function firstAuthorSurname(author = '') {
  const first = author.split(',')[0].trim();
  return first.split(/\s+/).at(-1) ?? '';
}

// Letters and digits only, so "U.S." meets "US", "PM2. 5" meets "PM2.5" and
// Crossref's <i> tags drop away.
function normalizeTitle(value) {
  return foldAccents(value.replace(/<[^>]+>/g, ''))
    .replace(/&amp;|&/g, 'and')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function normalizeName(value) {
  return foldAccents(value)
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

function foldAccents(value) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function parseYear(value = '') {
  const match = value.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
