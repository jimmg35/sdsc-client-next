import remarkHTML from 'remark-html';
import { remark } from 'remark';

const markdownToHTML = async (markdownString: string) => {
  const result = await remark().use(remarkHTML).process(markdownString);
  return result.toString();
};

export { markdownToHTML };
