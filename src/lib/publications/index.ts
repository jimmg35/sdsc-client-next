import fs from 'fs';
import path from 'path';

const publicationDirectory = path.join(
  process.cwd(),
  'src',
  'contents',
  'publications'
);

export interface PublicationData {
  id: string;
  author: string;
  title: string;
  journal: string;
  catalog: string;
  doi: string;
  memberIds: string[];
  year: number | null;
  publishedAt: string | null;
}

export function getAllPublications(): PublicationData[] {
  return mergePublications(readPublicationRecords());
}

export function getPublicationById(id: string): PublicationData | null {
  const publications = getAllPublications();
  const publication = publications.find((pub) => pub.id === id);
  return publication || null;
}

/* Hand-picked publications, each as its own meta.json describes it rather
   than as the archive merges it. When a Google Scholar duplicate wins the
   merge it brings its generated id and a venue padded with volume and pages,
   so the record a curator named is the one to show. Credits still come from
   the merged entry, so everyone the archive links to a paper stays linked to
   it here. Ids that no longer exist are skipped. */
export function getPublicationsByIds(ids: string[]): PublicationData[] {
  const records = readPublicationRecords();
  const recordsById = new Map(records.map((record) => [record.id, record]));
  const creditsByKey = new Map(
    mergePublications(records).map((publication) => [
      buildPublicationKey(publication),
      publication.memberIds
    ])
  );

  return ids.flatMap((id) => {
    const record = recordsById.get(id);

    if (!record) {
      return [];
    }

    return [
      {
        ...record,
        memberIds:
          creditsByKey.get(buildPublicationKey(record)) ?? record.memberIds
      }
    ];
  });
}

function readPublicationRecords(): PublicationData[] {
  const publicationEntries = fs.readdirSync(publicationDirectory, {
    withFileTypes: true
  });

  return publicationEntries
    .filter((entry) => entry.isDirectory())
    .map((publicationEntry) => {
      const filePath = path.join(
        publicationDirectory,
        publicationEntry.name,
        'meta.json'
      );

      if (!fs.existsSync(filePath)) {
        return null;
      }

      const fileContents = fs.readFileSync(filePath, 'utf8');
      const {
        id,
        author,
        title,
        journal,
        catalog,
        doi,
        memberIds,
        publishedAt
      } = JSON.parse(fileContents);
      const year = extractPublicationYear(author, catalog);

      return {
        id,
        author,
        title,
        journal,
        catalog,
        doi,
        memberIds: Array.isArray(memberIds)
          ? memberIds.filter(
              (value): value is string => typeof value === 'string'
            )
          : [],
        year,
        publishedAt: typeof publishedAt === 'string' ? publishedAt : null
      };
    })
    .filter(
      (publication): publication is PublicationData =>
        publication !== null && Boolean(publication.id && publication.title)
    );
}

function mergePublications(publications: PublicationData[]): PublicationData[] {
  const mergedPublications = new Map<string, PublicationData>();

  publications.forEach((publication) => {
    const key = buildPublicationKey(publication);
    const existingPublication = mergedPublications.get(key);

    if (!existingPublication) {
      mergedPublications.set(key, {
        ...publication,
        memberIds: Array.from(new Set(publication.memberIds))
      });
      return;
    }

    mergedPublications.set(key, {
      id: existingPublication.id || publication.id,
      author: preferLongerText(existingPublication.author, publication.author),
      title: preferLongerText(existingPublication.title, publication.title),
      journal: preferLongerText(
        existingPublication.journal,
        publication.journal
      ),
      catalog: preferLongerText(
        existingPublication.catalog,
        publication.catalog
      ),
      doi: preferLongerText(existingPublication.doi, publication.doi),
      memberIds: Array.from(
        new Set([...existingPublication.memberIds, ...publication.memberIds])
      ),
      year: existingPublication.year ?? publication.year,
      publishedAt: preferLatestDate(
        existingPublication.publishedAt,
        publication.publishedAt
      )
    });
  });

  return Array.from(mergedPublications.values()).sort((left, right) => {
    if ((right.year ?? 0) !== (left.year ?? 0)) {
      return (right.year ?? 0) - (left.year ?? 0);
    }

    return left.title.localeCompare(right.title);
  });
}

function buildPublicationKey(publication: PublicationData): string {
  return `${normalizePublicationKey(publication.title)}::${publication.year ?? 'unknown'}`;
}

function normalizePublicationKey(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function preferLongerText(currentValue: string, incomingValue: string): string {
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

function preferLatestDate(
  currentValue: string | null,
  incomingValue: string | null
): string | null {
  if (!currentValue) {
    return incomingValue;
  }

  if (!incomingValue) {
    return currentValue;
  }

  return Date.parse(incomingValue) > Date.parse(currentValue)
    ? incomingValue
    : currentValue;
}

function extractPublicationYear(
  author: string,
  catalog: string
): number | null {
  const authorMatch = author?.match(/\((\d{4})\)/);
  if (authorMatch) {
    return Number(authorMatch[1]);
  }

  const catalogMatch = catalog?.match(/(19|20)\d{2}/);
  if (catalogMatch) {
    return Number(catalogMatch[0]);
  }

  return null;
}
