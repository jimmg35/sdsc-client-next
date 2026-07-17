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
  /** True when a translation was missing or stale and the English original is
   *  being shown instead. */
  isTranslationFallback: boolean;
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
 * the news window moves. A translation is therefore only shown when its
 * `sourceUpdatedAt` matches the English `updatedAt` it was written against —
 * otherwise the reader would get months-old grants and dates presented under a
 * fresh timestamp. Stale or missing translations degrade to the English
 * original instead.
 */
export function getCurrentBriefing(locale?: string): BriefingData {
  const source = readBriefingFile(SOURCE_FILE);

  if (!source) {
    throw new Error(`Missing briefing source: ${SOURCE_FILE}`);
  }

  const updatedAt = parseBriefingDate(source.data.updatedAt);
  const translated =
    locale && locale !== 'en'
      ? readBriefingFile(`recent-briefing.${locale}.mdx`)
      : null;

  const isCurrentTranslation =
    translated?.data.sourceUpdatedAt != null &&
    parseBriefingDate(translated.data.sourceUpdatedAt).getTime() ===
      updatedAt.getTime();

  const chosen = isCurrentTranslation && translated ? translated : source;

  return {
    title: chosen.data.title,
    eyebrow: chosen.data.eyebrow || 'SDSC Briefing',
    updatedAt,
    description: chosen.data.description,
    readTime: chosen.data.readTime || '3 min read',
    content: chosen.content,
    isTranslationFallback:
      chosen === source && locale != null && locale !== 'en'
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
