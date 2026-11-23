import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

const briefingsDirectory = path.join(
  process.cwd(),
  'src',
  'contents',
  'briefings'
);

const SOURCE_FILE = 'recent-briefing.mdx';

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

const readBriefingFile = (fileName: string) => {
  const fullPath = path.join(briefingsDirectory, fileName);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  return matter(fs.readFileSync(fullPath, 'utf8'));
};

/**
 * The English file is the source of truth: the broadcaster rewrites it whenever
 * the news window moves.
 */
export function getCurrentBriefing(): BriefingData {
  const source = readBriefingFile(SOURCE_FILE);

  if (!source) {
    throw new Error(`Missing briefing source: ${SOURCE_FILE}`);
  }

  return {
    title: source.data.title,
    eyebrow: source.data.eyebrow || 'SDSC Briefing',
    updatedAt: parseBriefingDate(source.data.updatedAt),
    description: source.data.description,
    readTime: source.data.readTime || '3 min read',
    content: source.content
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
