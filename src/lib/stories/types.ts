export interface StoryMember {
  id: string;
  name: string;
  title: string;
  thumbnail: string;
  highlight: string;
}

export interface StoryVideo {
  src: string;
  poster: string;
  alt: string;
}

export interface StoryEvent {
  slug: string;
  title: string;
  date: string;
  description: string;
  summary: string;
  thumbnail?: string;
  url: string;
  /** `lab` stories come from `src/contents/lab-stories`, not a news post. */
  kind: 'single' | 'group' | 'lab';
  /** Square artwork for the rail's ring, shown in place of a face. */
  cover?: string;
  /** A short muted loop the ring plays over `cover`, its first frame. */
  coverVideo?: string;
  /** A muted clip the viewer plays in place of the artwork. */
  video?: StoryVideo;
  memberIds: string[];
  members: StoryMember[];
}

export interface RecentStoryCollection {
  stories: StoryEvent[];
  storiesByMemberId: Record<string, StoryEvent[]>;
}
