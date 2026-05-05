import { type MemberData, getAllMembers } from '@/lib/members';
import { getAllNews } from '@/lib/news';
import type {
  RecentStoryCollection,
  StoryEvent,
  StoryMember
} from '@/lib/stories/types';

export const DEFAULT_STORY_WINDOW_MONTHS = 6;

const SUMMARY_LIMIT = 190;
const HIGHLIGHT_LIMIT = 150;

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

  return `${normalized.slice(0, limit - 3).trimEnd()}...`;
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

const getContentSegments = (value: string) => {
  const lines = stripMarkdown(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.flatMap((line) =>
    line
      .split(/(?<=[.!?])\s+/)
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
      !normalizeText(descriptionText).includes(normalizedSegment)
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
  summary: string,
  participantCount: number
) => {
  const matchingSegment = getContentSegments(content).find((segment) =>
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

  const stories = getAllNews()
    .filter((article) => {
      const publishedAt =
        article.date instanceof Date ? article.date : new Date(article.date);
      return (
        article.memberIds.length > 0 &&
        publishedAt.getTime() >= windowStart.getTime() &&
        publishedAt.getTime() <= referenceDate.getTime()
      );
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
