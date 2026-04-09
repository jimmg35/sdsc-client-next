// src/lib/posts.ts
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

const newsDirectory = path.join(process.cwd(), 'src', 'contents', 'news');

export interface NewsData {
  slug: string;
  title: string;
  date: Date;
  author: string;
  description: string;
  thumbnail: string;
  content: string;
}

export interface RecentNewsWindow {
  months: number;
  windowStart: Date;
  windowEnd: Date;
  posts: NewsData[];
}

const parseContentDate = (value: string | Date) => {
  if (value instanceof Date) {
    return value;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
};

export function getAllNews(): NewsData[] {
  const fileNames = fs.readdirSync(newsDirectory);

  const posts = fileNames.map((fileName) => {
    const filePath = path.join(newsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug: fileName.replace(/\.mdx?$/, ''),
      title: data.title,
      date: parseContentDate(data.date),
      author: data.author,
      description: data.description,
      thumbnail: data.thumbnail || '/img/news-demo/news-22-370x240.jpg',
      content
    };
  });

  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  return posts;
}

export function getNewsBySlug(slug: string): NewsData {
  const fullPath = path.join(newsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: parseContentDate(data.date),
    author: data.author,
    description: data.description,
    thumbnail: data.thumbnail || '/img/news-demo/news-22-370x240.jpg',
    content
  };
}

export function getRecentNewsWindow(
  months = 3,
  referenceDate = new Date()
): RecentNewsWindow {
  const windowEnd = new Date(referenceDate);
  const windowStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  windowStart.setMonth(windowStart.getMonth() - months);

  const posts = getAllNews().filter((post) => {
    const publishedAt = parseContentDate(post.date);
    return (
      publishedAt.getTime() >= windowStart.getTime() &&
      publishedAt.getTime() <= windowEnd.getTime()
    );
  });

  return {
    months,
    windowStart,
    windowEnd,
    posts
  };
}
