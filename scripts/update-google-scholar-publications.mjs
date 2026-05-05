import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const ROOT_DIR = process.cwd();
const MEMBERS_DIR = path.join(ROOT_DIR, 'src', 'contents', 'members');
const PUBLICATIONS_DIR = path.join(ROOT_DIR, 'src', 'contents', 'publications');
const GENERATED_PUBLICATION_PREFIX = 'google-scholar-';

const LOOKBACK_YEARS = Number.parseInt(
  process.env.SCHOLAR_LOOKBACK_YEARS ?? '2',
  10
);
const PAGE_SIZE = 100;
const REQUEST_DELAY_MS = Number.parseInt(
  process.env.SCHOLAR_REQUEST_DELAY_MS ?? '350',
  10
);

const now = new Date();
const windowEndDate = new Date(
  Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
);
const windowStartDate = new Date(windowEndDate);
windowStartDate.setUTCFullYear(
  windowStartDate.getUTCFullYear() - LOOKBACK_YEARS
);
const minimumYear = windowStartDate.getUTCFullYear();

const requestHeaders = {
  'accept-language': 'en-US,en;q=0.9',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
};

await main();

async function main() {
  const members = await loadMembers();
  const generatedAt = new Date().toISOString();
  const warnings = [];
  const publicationsByMember = [];

  for (const member of members) {
    const scholarUrl = member.googleScholar?.trim();
    if (!scholarUrl) {
      continue;
    }

    const profileUrl = normalizeScholarProfileUrl(scholarUrl);

    if (!profileUrl) {
      warnings.push(
        `${member.id}: skipped because googleScholar is not a direct Google Scholar profile URL with a user parameter`
      );
      continue;
    }

    console.log(`Fetching ${member.name} (${member.id})`);

    try {
      const publications = await getMemberRecentPublications({
        memberId: member.id,
        profileUrl
      });

      publicationsByMember.push(...publications);
      console.log(`  ${publications.length} recent publications`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown Scholar fetch error';
      warnings.push(`${member.id}: ${message}`);
      console.warn(`  failed: ${message}`);
    }
  }

  const publications = mergePublications(publicationsByMember).map(
    (publication) => ({
      id: publication.id,
      author: publication.author,
      title: publication.title,
      journal: publication.journal,
      catalog: publication.catalog,
      doi: publication.doi,
      memberIds: publication.memberIds,
      source: 'google-scholar',
      generatedAt,
      lookbackYears: LOOKBACK_YEARS,
      windowStartDate: formatDate(windowStartDate),
      windowEndDate: formatDate(windowEndDate)
    })
  );

  await removeGeneratedPublicationDirectories();
  await writeGeneratedPublicationDirectories(publications);

  console.log(
    `Wrote ${publications.length} generated publication folders to ${path.relative(
      ROOT_DIR,
      PUBLICATIONS_DIR
    )}`
  );

  if (warnings.length) {
    console.warn('\nWarnings:');
    warnings.forEach((warning) => console.warn(`- ${warning}`));
  }
}

async function loadMembers() {
  const entries = await fs.readdir(MEMBERS_DIR, { withFileTypes: true });
  const members = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const metaPath = path.join(MEMBERS_DIR, entry.name, 'meta.json');
    try {
      const fileContents = await fs.readFile(metaPath, 'utf8');
      const meta = JSON.parse(fileContents);

      if (!isEligibleFacultyMember(meta)) {
        continue;
      }

      members.push({
        id: meta.id || entry.name,
        name: meta.name || entry.name,
        googleScholar:
          typeof meta.googleScholar === 'string' ? meta.googleScholar : ''
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to read member meta';
      console.warn(`Skipping ${entry.name}: ${message}`);
    }
  }

  return members;
}

function isEligibleFacultyMember(meta) {
  const combinedText =
    `${meta.title || ''} ${meta.centerRole || ''}`.toLowerCase();

  return (
    combinedText.includes('professor') ||
    combinedText.includes('faculty') ||
    combinedText.includes('director')
  );
}

function normalizeScholarProfileUrl(rawUrl) {
  let url;

  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (!url.hostname.includes('scholar.google.')) {
    return null;
  }

  const user = url.searchParams.get('user');
  if (!user) {
    return null;
  }

  const normalized = new URL('https://scholar.google.com/citations');
  normalized.searchParams.set('user', user);
  normalized.searchParams.set('hl', url.searchParams.get('hl') || 'en');
  normalized.searchParams.set('view_op', 'list_works');
  normalized.searchParams.set('sortby', 'pubdate');

  return normalized.toString();
}

async function getMemberRecentPublications({ memberId, profileUrl }) {
  const publications = [];
  const seenKeys = new Set();

  for (let startIndex = 0; ; startIndex += PAGE_SIZE) {
    const pageUrl = new URL(profileUrl);
    pageUrl.searchParams.set('pagesize', PAGE_SIZE.toString());
    pageUrl.searchParams.set('cstart', startIndex.toString());

    const html = await fetchScholarHtml(pageUrl.toString());
    const rows = parsePublicationRows(html);

    if (!rows.length) {
      break;
    }

    let reachedOlderRows = false;

    for (const row of rows) {
      if (row.year !== null && row.year < minimumYear) {
        reachedOlderRows = true;
        continue;
      }

      const shouldInclude = await isWithinLookbackWindow(row);
      if (!shouldInclude) {
        continue;
      }

      const dedupeKey = buildPublicationKey(row.title, row.year);
      if (seenKeys.has(dedupeKey)) {
        continue;
      }

      seenKeys.add(dedupeKey);
      publications.push({
        id: buildPublicationId(row.title, row.year),
        author: row.authors,
        title: row.title,
        journal: row.venue,
        catalog: row.year ? `${row.year}` : '',
        doi: '',
        memberIds: [memberId],
        year: row.year
      });
    }

    if (reachedOlderRows || rows.length < PAGE_SIZE) {
      break;
    }
  }

  return publications.sort(comparePublications);
}

async function isWithinLookbackWindow(row) {
  if (row.year === null) {
    return true;
  }

  if (row.year > minimumYear) {
    return true;
  }

  if (row.year < minimumYear) {
    return false;
  }

  if (!row.detailUrl) {
    return true;
  }

  const publicationDate = await getPublicationDate(row.detailUrl);
  if (!publicationDate) {
    return true;
  }

  return publicationDate.getTime() >= windowStartDate.getTime();
}

async function getPublicationDate(detailUrl) {
  try {
    const html = await fetchScholarHtml(detailUrl);
    const $ = load(html);

    let publicationDateValue = '';
    $('#gsc_oci_table .gs_scl').each((_, element) => {
      const field = cleanText($(element).find('.gsc_oci_field').first().text());
      if (field === 'Publication date') {
        publicationDateValue = cleanText(
          $(element).find('.gsc_oci_value').first().text()
        );
      }
    });

    return parseScholarDate(publicationDateValue);
  } catch {
    return null;
  }
}

function parsePublicationRows(html) {
  const $ = load(html);

  return $('#gsc_a_b .gsc_a_tr')
    .map((_, element) => {
      const titleLink = $(element).find('a.gsc_a_at').first();
      const authorNode = $(element).find('.gs_gray').eq(0);
      const venueNode = $(element).find('.gs_gray').eq(1).clone();
      venueNode.find('.gs_oph').remove();

      const title = cleanText(titleLink.text());
      const authors = cleanText(authorNode.text());
      const venue = cleanText(venueNode.text());
      const year = parseYear(
        cleanText($(element).find('.gsc_a_y').first().text())
      );
      const detailHref = titleLink.attr('href');

      return {
        title,
        authors,
        venue,
        year,
        detailUrl: detailHref
          ? new URL(detailHref, 'https://scholar.google.com').toString()
          : null
      };
    })
    .get()
    .filter((row) => row.title);
}

async function fetchScholarHtml(url) {
  const response = await fetch(url, {
    headers: requestHeaders
  });

  if (!response.ok) {
    throw new Error(`Scholar returned HTTP ${response.status} for ${url}`);
  }

  const html = await response.text();

  if (
    html.includes('accounts.google.com/v3/signin') ||
    html.includes('/sorry/') ||
    html.includes('detected unusual traffic')
  ) {
    throw new Error(
      'Scholar returned a sign-in or anti-bot page; retry later or reduce request frequency'
    );
  }

  await sleep(REQUEST_DELAY_MS);
  return html;
}

function mergePublications(publications) {
  const merged = new Map();

  for (const publication of publications) {
    const key = buildPublicationKey(publication.title, publication.year);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, {
        ...publication,
        memberIds: Array.from(new Set(publication.memberIds))
      });
      continue;
    }

    merged.set(key, {
      id: existing.id,
      author: preferLongerText(existing.author, publication.author),
      title: preferLongerText(existing.title, publication.title),
      journal: preferLongerText(existing.journal, publication.journal),
      catalog: preferLongerText(existing.catalog, publication.catalog),
      doi: preferLongerText(existing.doi, publication.doi),
      memberIds: Array.from(
        new Set([...existing.memberIds, ...publication.memberIds])
      ),
      year: existing.year ?? publication.year
    });
  }

  return Array.from(merged.values()).sort(comparePublications);
}

function buildPublicationId(title, year) {
  const key = buildPublicationKey(title, year);
  const slug = slugify(title).slice(0, 64) || 'publication';
  const hash = createHash('sha1').update(key).digest('hex').slice(0, 8);
  const yearSuffix = year ? `-${year}` : '';

  return `${GENERATED_PUBLICATION_PREFIX}${slug}${yearSuffix}-${hash}`;
}

function buildPublicationKey(title, year) {
  return `${normalizeKey(title)}::${year ?? 'unknown'}`;
}

function normalizeKey(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function slugify(value) {
  return normalizeKey(value);
}

function cleanText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function parseYear(value) {
  const match = value.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function parseScholarDate(value) {
  if (!value) {
    return null;
  }

  const parts = value.split('/').map((part) => Number.parseInt(part, 10));
  if (!parts[0] || Number.isNaN(parts[0])) {
    return null;
  }

  const year = parts[0];
  const month = Number.isNaN(parts[1]) ? 1 : parts[1];
  const day = Number.isNaN(parts[2]) ? 1 : parts[2];

  return new Date(Date.UTC(year, Math.max(month - 1, 0), Math.max(day, 1)));
}

function preferLongerText(currentValue, incomingValue) {
  if (!currentValue) {
    return incomingValue || '';
  }

  if (!incomingValue) {
    return currentValue;
  }

  return incomingValue.length > currentValue.length
    ? incomingValue
    : currentValue;
}

function comparePublications(a, b) {
  if ((b.year ?? 0) !== (a.year ?? 0)) {
    return (b.year ?? 0) - (a.year ?? 0);
  }

  return a.title.localeCompare(b.title);
}

function formatDate(value) {
  return value.toISOString().slice(0, 10);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeGeneratedPublicationDirectories() {
  const entries = await fs.readdir(PUBLICATIONS_DIR, { withFileTypes: true });
  const basePath = `${path.resolve(PUBLICATIONS_DIR)}${path.sep}`;

  for (const entry of entries) {
    if (
      !entry.isDirectory() ||
      !entry.name.startsWith(GENERATED_PUBLICATION_PREFIX)
    ) {
      continue;
    }

    const targetPath = path.resolve(PUBLICATIONS_DIR, entry.name);
    if (!targetPath.startsWith(basePath)) {
      throw new Error(`Refusing to remove unexpected path: ${targetPath}`);
    }

    await fs.rm(targetPath, { recursive: true, force: true });
  }
}

async function writeGeneratedPublicationDirectories(publications) {
  for (const publication of publications) {
    const publicationDirectory = path.join(PUBLICATIONS_DIR, publication.id);
    const metaPath = path.join(publicationDirectory, 'meta.json');

    await fs.mkdir(publicationDirectory, { recursive: true });
    await fs.writeFile(metaPath, `${JSON.stringify(publication, null, 2)}\n`);
  }
}
