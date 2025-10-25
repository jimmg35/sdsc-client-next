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
}

export function getAllPublications(): PublicationData[] {
  const publicationNames = fs.readdirSync(publicationDirectory);

  const publications = publicationNames.map((publicationName) => {
    const filePath = path.join(
      publicationDirectory,
      publicationName,
      'meta.json'
    );
    const fileContents = fs.readFileSync(filePath, 'utf8');

    const {
      id,
      author,
      title,
      journal,
      catalog,
      doi,
      memberIds
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
        ? memberIds.filter((value): value is string => typeof value === 'string')
        : [],
      year
    };
  });

  return publications;
}

export function getPublicationById(id: string): PublicationData | null {
  const publications = getAllPublications();
  const publication = publications.find((pub) => pub.id === id);
  return publication || null;
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
