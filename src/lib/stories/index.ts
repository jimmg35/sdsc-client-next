import { type MemberData, getAllMembers } from '@/lib/members';
import { getAllNews, parseContentDate } from '@/lib/news';
import type {
  RecentStoryCollection,
  StoryEvent,
  StoryMember
} from '@/lib/stories/types';
import fs from 'fs';
import path from 'path';

export const DEFAULT_STORY_WINDOW_MONTHS = 6;

const labStoriesDirectory = path.join(
  process.cwd(),
  'src',
  'contents',
  'lab-stories'
);

type LabStoryFile = Pick<
  StoryEvent,
  'title' | 'summary' | 'thumbnail' | 'cover' | 'coverVideo' | 'video' | 'url'
> & {
  date: string;
  members: { id: string; highlight: string }[];
};

const SUMMARY_LIMIT = 190;
/* The viewer gives the spotlight its own column, so a highlight can run to a
   full sentence before it needs trimming. */
const HIGHLIGHT_LIMIT = 220;

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const trimText = (value: string, limit: number) => {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= limit) {
    return normalized;
  }

  // Back off to the last whole word, so a name is never cut off mid-way.
  const cut = normalized.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const wholeWords = lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut;

  return `${wholeWords.replace(/[\s,;:]+$/, '')}…`;
};

/* Share of `candidate`'s words already in `reference`. The summary uses it to
   skip a sentence that only restates the description in other words. */
const wordOverlap = (reference: string, candidate: string) => {
  const referenceWords = new Set(normalizeText(reference).split(' '));
  const candidateWords = normalizeText(candidate).split(' ').filter(Boolean);
  const shared = candidateWords.filter((word) => referenceWords.has(word));

  return shared.length / Math.max(candidateWords.length, 1);
};

const stripMarkdown = (value: string) =>
  value
    .replace(/^---[\s\S]*?---/, '')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, ' ')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/\r/g, '')
    .trim();

/* A sentence ends at . ! or ? before a capital, but not after an initial
   ("A. Stewart", "Mark W. Horner", "Ph.D.", "U.S.") or a title such as
   "Dr." — splitting there cut names in half, so highlights came out as
   "alongside co-PIs A." and members could not be matched to a sentence. */
const SENTENCE_BREAK =
  /(?<=[.!?])(?<!\b[A-Z]\.)(?<!\b(?:Dr|Prof|Mr|Mrs|Ms|St|Jr|Sr|vs|No)\.)\s+(?=["“‘(]?[A-Z0-9])/;

const getContentSegments = (value: string) => {
  const lines = stripMarkdown(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.flatMap((line) =>
    line
      .split(SENTENCE_BREAK)
      .map((segment) => segment.trim())
      .filter(Boolean)
  );
};

const buildStorySummary = (
  description: string,
  content: string,
  title: string
) => {
  const normalizedTitle = normalizeText(title);
  const segments = getContentSegments(content).filter(
    (segment) => normalizeText(segment) !== normalizedTitle
  );

  const descriptionText = description.replace(/\s+/g, ' ').trim();

  if (!segments.length) {
    return trimText(descriptionText, SUMMARY_LIMIT);
  }

  const fallbackSegment = segments.find((segment) => {
    const normalizedSegment = normalizeText(segment);
    return (
      normalizedSegment &&
      normalizedSegment !== normalizeText(descriptionText) &&
      !normalizeText(descriptionText).includes(normalizedSegment) &&
      wordOverlap(descriptionText, segment) < 0.6
    );
  });

  if (!fallbackSegment) {
    return trimText(descriptionText, SUMMARY_LIMIT);
  }

  if (descriptionText.length >= 120) {
    return trimText(descriptionText, SUMMARY_LIMIT);
  }

  return trimText(`${descriptionText} ${fallbackSegment}`, SUMMARY_LIMIT);
};

const memberMatchesSegment = (member: MemberData, segment: string) => {
  const normalizedSegment = normalizeText(segment);
  const normalizedName = normalizeText(member.name);

  if (normalizedSegment.includes(normalizedName)) {
    return true;
  }

  const tokens = member.name
    .replace(/\([^)]*\)/g, ' ')
    .split(/[\s.-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);

  const firstToken = tokens.find((token) => token.length > 2);
  const lastToken = tokens.at(-1);

  return Boolean(
    firstToken &&
    lastToken &&
    normalizedSegment.includes(normalizeText(firstToken)) &&
    normalizedSegment.includes(normalizeText(lastToken))
  );
};

const buildMemberHighlight = (
  member: MemberData,
  content: string,
  title: string,
  summary: string,
  participantCount: number
) => {
  /* Posts open with their headline as a `#` heading, which usually names the
     member too; without skipping it the highlight just repeated the title
     the viewer shows directly above it. */
  const normalizedTitle = normalizeText(title);
  const matchingSegment = getContentSegments(content).find(
    (segment) =>
      normalizeText(segment) !== normalizedTitle &&
      memberMatchesSegment(member, segment)
  );

  if (matchingSegment) {
    return trimText(matchingSegment, HIGHLIGHT_LIMIT);
  }

  if (participantCount <= 1) {
    return trimText(summary, HIGHLIGHT_LIMIT);
  }

  const peerCount = participantCount - 1;
  const peerLabel =
    peerCount === 1 ? '1 other SDSC member' : `${peerCount} other SDSC members`;
  return `${member.name} is featured in this SDSC update alongside ${peerLabel}.`;
};

/* Stories that are not news: something in the lab worth a look. Each one is
   written out in full in its JSON file, so nothing is derived the way a news
   story's summary and highlights are; the members it names are looked up only
   for their portrait and title. */
const getLabStories = (membersById: Record<string, MemberData>): StoryEvent[] =>
  fs
    .readdirSync(labStoriesDirectory)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const data: LabStoryFile = JSON.parse(
        fs.readFileSync(path.join(labStoriesDirectory, fileName), 'utf8')
      );

      const members = data.members.flatMap<StoryMember>(({ id, highlight }) => {
        const member = membersById[id];

        return member
          ? [
              {
                id,
                name: member.name,
                title: member.title,
                thumbnail: member.thumbnail,
                highlight
              }
            ]
          : [];
      });

      return {
        slug: fileName.replace(/\.json$/, ''),
        title: data.title,
        date: parseContentDate(data.date).toISOString(),
        description: data.summary,
        summary: data.summary,
        // The clip's poster doubles as the artwork, so the viewer's blurred
        // ground and its look-ahead preload work as they do for news.
        thumbnail: data.thumbnail ?? data.video?.poster,
        url: data.url,
        kind: 'lab',
        cover: data.cover,
        coverVideo: data.coverVideo,
        video: data.video,
        memberIds: members.map((member) => member.id),
        members
      };
    });

export function getRecentStoryCollection(
  months = DEFAULT_STORY_WINDOW_MONTHS,
  referenceDate = new Date()
): RecentStoryCollection {
  const members = getAllMembers();
  const membersById = members.reduce<Record<string, MemberData>>(
    (acc, member) => {
      acc[member.id] = member;
      return acc;
    },
    {}
  );

  const windowStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() - months,
    1
  );

  const isInWindow = (publishedAt: Date) =>
    publishedAt.getTime() >= windowStart.getTime() &&
    publishedAt.getTime() <= referenceDate.getTime();

  const newsStories = getAllNews()
    .filter((article) => {
      const publishedAt =
        article.date instanceof Date ? article.date : new Date(article.date);
      return article.memberIds.length > 0 && isInWindow(publishedAt);
    })
    .map<StoryEvent | null>((article) => {
      const memberIds = Array.from(new Set(article.memberIds)).filter(
        (memberId) => Boolean(membersById[memberId])
      );

      if (!memberIds.length) {
        return null;
      }

      const summary = buildStorySummary(
        article.description,
        article.content,
        article.title
      );

      const storyMembers = memberIds
        .map<StoryMember | null>((memberId) => {
          const member = membersById[memberId];

          if (!member) {
            return null;
          }

          return {
            id: member.id,
            name: member.name,
            title: member.title,
            thumbnail: member.thumbnail,
            highlight: buildMemberHighlight(
              member,
              article.content,
              article.title,
              summary,
              memberIds.length
            )
          };
        })
        .filter((member): member is StoryMember => Boolean(member));

      return {
        slug: article.slug,
        title: article.title,
        date: article.date.toISOString(),
        description: article.description,
        summary,
        thumbnail: article.thumbnail,
        url: `/news/${article.slug}`,
        kind: memberIds.length === 1 ? 'single' : 'group',
        memberIds,
        members: storyMembers
      };
    })
    .filter((story): story is StoryEvent => Boolean(story));

  // Lab stories age out on the same window and take their place by date.
  const labStories = getLabStories(membersById).filter((story) =>
    isInWindow(new Date(story.date))
  );
  // A lab story that links to a news post stands in for that post in the
  // rail, rather than the post turning up a second time as a story of faces.
  const claimedUrls = new Set(labStories.map((story) => story.url));

  const stories = [
    ...newsStories.filter((story) => !claimedUrls.has(story.url)),
    ...labStories
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const storiesByMemberId = stories.reduce<Record<string, StoryEvent[]>>(
    (acc, story) => {
      story.memberIds.forEach((memberId) => {
        if (!acc[memberId]) {
          acc[memberId] = [];
        }

        acc[memberId].push(story);
      });

      return acc;
    },
    {}
  );

  return {
    stories,
    storiesByMemberId
  };
}
