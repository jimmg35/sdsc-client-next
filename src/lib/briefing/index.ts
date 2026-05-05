import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

const briefingsDirectory = path.join(
  process.cwd(),
  'src',
  'contents',
  'briefings'
);

export interface BriefingData {
  title: string;
  eyebrow: string;
  updatedAt: Date;
  description: string;
  readTime: string;
  content: string;
}

export interface BriefingSegment {
  anchorSlug?: string;
  markdown: string;
}

const parseBriefingDate = (value: string | Date) => {
  if (value instanceof Date) {
    return value;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
};

export function getCurrentBriefing(): BriefingData {
  const fullPath = path.join(briefingsDirectory, 'recent-briefing.mdx');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    title: data.title,
    eyebrow: data.eyebrow || 'SDSC Briefing',
    updatedAt: parseBriefingDate(data.updatedAt),
    description: data.description,
    readTime: data.readTime || '3 min read',
    content
  };
}

export function parseBriefingSegments(content: string): BriefingSegment[] {
  const lines = content.split(/\r?\n/);
  const segments: BriefingSegment[] = [];
  const anchorPattern = /^\[anchor:([a-z0-9-]+)\]\s*$/i;

  let currentAnchor: string | undefined;
  let currentLines: string[] = [];

  const flush = () => {
    const markdown = currentLines.join('\n').trim();

    if (!markdown) {
      currentLines = [];
      return;
    }

    segments.push({
      anchorSlug: currentAnchor,
      markdown
    });

    currentLines = [];
  };

  lines.forEach((line) => {
    const match = line.match(anchorPattern);

    if (match) {
      flush();
      currentAnchor = match[1];
      return;
    }

    currentLines.push(line);
  });

  flush();

  return segments;
}
