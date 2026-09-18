import remarkHTML from 'remark-html';
import { remark } from 'remark';

const markdownToHTML = async (markdownString: string) => {
  const result = await remark().use(remarkHTML).process(markdownString);
  return result.toString();
};

/* Every article body opens by repeating its own frontmatter title as an H1.
   Pages that set the headline themselves drop the duplicate rather than
   render it twice. Only a level-one heading in the first position is taken. */
const stripLeadingHeading = (markdownString: string) =>
  markdownString.replace(/^\s*#[^#\S\r\n][^\r\n]*(?:\r?\n)+/, '');

export { markdownToHTML, stripLeadingHeading };
