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

export function getAllNews(): NewsData[] {
  const fileNames = fs.readdirSync(newsDirectory);

  const posts = fileNames.map((fileName) => {
    const filePath = path.join(newsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug: fileName.replace(/\.mdx?$/, ''),
      title: data.title,
      date: new Date(data.date),
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
    date: data.date,
    author: data.author,
    description: data.description,
    thumbnail: data.thumbnail || '/img/news-demo/news-22-370x240.jpg',
    content
  };
}
