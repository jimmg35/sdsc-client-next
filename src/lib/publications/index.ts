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

    const { id, author, title, journal, catalog, doi } =
      JSON.parse(fileContents);

    return {
      id,
      author,
      title,
      journal,
      catalog,
      doi
    };
  });

  return publications;
}

export function getPublicationById(id: string): PublicationData | null {
  const publications = getAllPublications();
  const publication = publications.find((pub) => pub.id === id);
  return publication || null;
}
