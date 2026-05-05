'use client';

import StoryModal from '@/components/Stories/StoryModal';
import Avatar from '@/components/Utility/Avatar';
import type { StoryEvent } from '@/lib/stories/types';
import { ArrowUpRight, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

type StoryRailProps = {
  stories: StoryEvent[];
  eyebrow: string;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  panelClassName?: string;
  overlayClassName?: string | null;
};

export default function StoryRail({
  stories,
  eyebrow,
  title,
  description,
  ctaHref,
  ctaLabel,
  panelClassName = 'surface-fade relative overflow-hidden px-6 py-12 md:px-10',
  overlayClassName = 'pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_82%_-8%,_rgba(249,115,22,0.16),_transparent_52%),radial-gradient(105%_105%_at_12%_0%,_rgba(190,24,93,0.16),_transparent_48%)]'
}: StoryRailProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visibleStories = stories.slice(0, 8);

  if (!stories.length) {
    return null;
  }

  return (
    <>
      <section className={panelClassName}>
        {overlayClassName ? <div className={overlayClassName} /> : null}

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="chip-gold">{eyebrow}</span>
              <h2 className="mt-5 text-3xl font-semibold text-gold-50 text-glow md:text-4xl">
                {title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-gold-200/78 md:text-base">
                {description}
              </p>
            </div>

            {ctaHref && ctaLabel && (
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 self-start rounded-full border border-rose-200/80 bg-white/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-rose-600 transition hover:border-rose-300 hover:text-rose-700"
              >
                {ctaLabel}
                <ArrowUpRight size={18} />
              </Link>
            )}
          </div>

          <div className="mt-10 flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none]">
            {visibleStories.map((story, index) => (
              <button
                key={story.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group/story w-36 shrink-0 snap-start text-center"
              >
                <div className="flex justify-center">
                  {story.kind === 'single' ? (
                    <span className="story-ring transition-transform duration-300 group-hover/story:scale-[1.03]">
                      <Avatar
                        src={story.members[0].thumbnail}
                        size={92}
                        alt={`${story.members[0].name} portrait`}
                        variant="soft"
                        className="group-hover/story:scale-[1.03]"
                      />
                    </span>
                  ) : (
                    <span className="story-ring relative inline-flex h-[104px] w-[104px] items-center justify-center transition-transform duration-300 group-hover/story:scale-[1.03]">
                      <span className="relative h-[72px] w-[72px]">
                        {story.members
                          .slice(0, 2)
                          .map((member, memberIndex) => (
                            <span
                              key={member.id}
                              className={`absolute ${
                                memberIndex === 0
                                  ? 'left-0 top-2'
                                  : 'bottom-0 right-0'
                              }`}
                            >
                              <Avatar
                                src={member.thumbnail}
                                size={46}
                                alt={`${member.name} portrait`}
                                variant="soft"
                              />
                            </span>
                          ))}
                        {story.members.length > 2 && (
                          <span className="absolute -right-3 -top-2 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-white/55 bg-black/65 px-2 text-[0.65rem] font-semibold text-white shadow-[0_20px_30px_-22px_rgba(0,0,0,0.85)]">
                            +{story.members.length - 2}
                          </span>
                        )}
                      </span>
                    </span>
                  )}
                </div>

                <p className="mt-4 flex items-center justify-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-rose-500">
                  {story.kind === 'single' ? (
                    <Sparkles size={14} />
                  ) : (
                    <Users size={14} />
                  )}
                  {story.kind === 'single'
                    ? story.members[0].name
                    : `${story.members.length} Voices`}
                </p>
                <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-ink-900">
                  {story.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <StoryModal
        stories={stories}
        isOpen={activeIndex !== null}
        initialIndex={activeIndex ?? 0}
        onClose={() => setActiveIndex(null)}
      />
    </>
  );
}
