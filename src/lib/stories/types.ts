export interface StoryMember {
  id: string;
  name: string;
  title: string;
  thumbnail: string;
  highlight: string;
}

export interface StoryEvent {
  slug: string;
  title: string;
  date: string;
  description: string;
  summary: string;
  thumbnail: string;
  url: string;
  kind: 'single' | 'group';
  memberIds: string[];
  members: StoryMember[];
}

export interface RecentStoryCollection {
  stories: StoryEvent[];
  storiesByMemberId: Record<string, StoryEvent[]>;
}
