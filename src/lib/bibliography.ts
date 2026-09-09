export type BibliographyVersion = {
  /** Version label used in the archived file name, e.g. `09-2026`. */
  version: string;
  /** Month the edition was released, used for the visible label. */
  releasedAt: string;
  /** Public path of the PDF. `current` always points at the unsuffixed file. */
  href: string;
  /** Human readable file size, kept in sync when a new edition is added. */
  size: string;
};

/**
 * Every published edition of the (M)GWR bibliography, newest first.
 *
 * When a new edition arrives: rename the current
 * `public/contents/(M)GWR-Bibliography.pdf` to `(M)GWR-Bibliography-<MM>-<YYYY>.pdf`,
 * drop the new file in as `(M)GWR-Bibliography.pdf`, then add an entry here.
 */
export const bibliographyVersions: BibliographyVersion[] = [
  {
    version: '09-2026',
    releasedAt: 'September 2026',
    href: '/contents/(M)GWR-Bibliography.pdf',
    size: '5.5 MB'
  },
  {
    version: '06-2026',
    releasedAt: 'June 2026',
    href: '/contents/(M)GWR-Bibliography-06-2026.pdf',
    size: '5.2 MB'
  },
  {
    version: '05-2026',
    releasedAt: 'May 2026',
    href: '/contents/(M)GWR Bibliography-05-2026.pdf',
    size: '5.1 MB'
  },
  {
    version: '01-2026',
    releasedAt: 'January 2026',
    href: '/contents/MGWR_Bibli_0105_2026.pdf',
    size: '4.9 MB'
  },
  {
    version: '11-2025',
    releasedAt: 'November 2025',
    href: '/contents/MGWR_Bibli_1102_2025.pdf',
    size: '4.7 MB'
  }
];

export const currentBibliography = bibliographyVersions[0];
