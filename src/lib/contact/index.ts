/**
 * The centre's public contact details.
 *
 * The footer, the contact page and the Director's message all print these;
 * keeping one copy means a change of address or inbox does not have to be
 * caught in three places. Each contact's label is `contactEmails.<key>` in the
 * messages files.
 */
export const ACADEMIC_EMAIL = 'stewart.fotheringham@fsu.edu';
export const ADMINISTRATIVE_EMAIL = 'clgoodwin@fsu.edu';

export const CONTACTS = [
  { key: 'academic', email: ACADEMIC_EMAIL },
  { key: 'administrative', email: ADMINISTRATIVE_EMAIL }
] as const;

export const CONTACT_ADDRESS_LINES = [
  'Spatial Data Science Center',
  'College of Social Sciences and Public Policy',
  'Florida State University',
  'Tallahassee, FL 32306'
];
