import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { withBasePath } from '../basePath';

const announcementsDirectory = path.join(
  process.cwd(),
  'src',
  'contents',
  'announcements'
);

export interface AnnouncementData {
  slug: string;
  title: string;
  date: Date;
  author: string;
  description: string;
  thumbnail: string;
  content: string;
}

export function getAllAnnouncements(): AnnouncementData[] {
  if (!fs.existsSync(announcementsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(announcementsDirectory);

  const announcements = fileNames.map((fileName) => {
    const filePath = path.join(announcementsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: fileName.replace(/\.mdx?$/, ''),
      title: data.title,
      date: new Date(data.date),
      author: data.author,
      description: data.description,
      thumbnail: withBasePath(
        data.thumbnail || '/img/news-demo/default-news-thumbnail.jpg'
      ),
      content
    };
  });

  announcements.sort((a, b) => b.date.getTime() - a.date.getTime());
  return announcements;
}

export function getAnnouncementBySlug(slug: string): AnnouncementData {
  const fullPath = path.join(announcementsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Announcement not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: new Date(data.date),
    author: data.author,
    description: data.description,
      thumbnail: withBasePath(
        data.thumbnail || '/img/news-demo/default-news-thumbnail.jpg'
      ),
    content
  };
}
