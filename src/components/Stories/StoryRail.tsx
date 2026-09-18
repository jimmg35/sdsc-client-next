'use client';

import StoryModal from '@/components/Stories/StoryModal';
import Avatar from '@/components/Utility/Avatar';
import type { StoryEvent } from '@/lib/stories/types';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
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
  overlayClassName = null
}: StoryRailProps) {
  const t = useTranslations('stories');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  /* Eight stories always overrun the panel, and the scrollbar is hidden, so
     the arrows are the only affordance saying the row continues. They disable
     themselves at each end. */
  const [overflow, setOverflow] = useState({ left: false, right: false });

  const syncOverflow = useCallback(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const maxScroll = rail.scrollWidth - rail.clientWidth;

    setOverflow({
      left: rail.scrollLeft > 4,
      right: rail.scrollLeft < maxScroll - 4
    });
  }, []);

  useEffect(() => {
    syncOverflow();

    const rail = railRef.current;

    if (!rail || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(syncOverflow);
    observer.observe(rail);

    return () => observer.disconnect();
  }, [syncOverflow]);

  const scrollByStep = (direction: -1 | 1) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.8, 240),
      behavior: 'smooth'
    });
  };

  const visibleStories = stories.slice(0, 8);

  if (!stories.length) {
    return null;
  }

  return (
    <>
      <section className={panelClassName}>
        {overlayClassName ? <div className={overlayClassName} /> : null}

        <div className="relative mx-auto w-full max-w-5xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-silk-700 md:text-xs md:tracking-[0.42em]">
                <span
                  aria-hidden
                  className="h-px w-10 bg-gradient-to-r from-transparent to-silk-600/55"
                />
                {eyebrow}
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-ink-900 md:text-[2.6rem] md:leading-[1.08]">
                {title}
              </h2>
              <p className="mt-5 text-sm leading-7 text-ink-700 md:text-base md:leading-8">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-6 md:self-end">
              {ctaHref && ctaLabel && (
                <Link
                  href={ctaHref}
                  className="group inline-flex shrink-0 items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-rose-600 transition-colors hover:text-rose-700"
                >
                  {ctaLabel}
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              )}

              {(overflow.left || overflow.right) && (
                <div className="hidden shrink-0 items-center gap-2 md:flex">
                  <button
                    type="button"
                    aria-label={t('scrollPrev')}
                    disabled={!overflow.left}
                    onClick={() => scrollByStep(-1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-silk-600/30 text-ink-500 transition duration-300 hover:border-rose-400/60 hover:bg-rose-50 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={t('scrollNext')}
                    disabled={!overflow.right}
                    onClick={() => scrollByStep(1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-silk-600/30 text-ink-500 transition duration-300 hover:border-rose-400/60 hover:bg-rose-50 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            ref={railRef}
            onScroll={syncOverflow}
            className="mt-12 flex snap-x gap-8 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visibleStories.map((story, index) => {
              const [primary, second] = story.members;
              const isGroup = story.kind === 'group' && Boolean(second);

              return (
                <button
                  key={story.slug}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group/story w-40 shrink-0 snap-start text-left"
                >
                  {/* Every item is the same circle so the row keeps one
                      rhythm; a group is marked by a second face tucked into
                      the corner rather than a cluster that has to be
                      deciphered at this size. */}
                  <span className="relative inline-flex">
                    <span className="story-ring transition-transform duration-300 group-hover/story:scale-[1.04]">
                      <Avatar
                        src={primary.thumbnail}
                        size={76}
                        alt={`${primary.name} portrait`}
                        variant="soft"
                      />
                    </span>

                    {isGroup && (
                      <span className="absolute -bottom-1 -right-1 inline-flex rounded-full bg-surface p-[2px] shadow-[0_10px_20px_-14px_rgba(44,36,32,0.5)]">
                        <Avatar
                          src={second.thumbnail}
                          size={30}
                          alt={`${second.name} portrait`}
                          variant="soft"
                        />
                      </span>
                    )}
                  </span>

                  {/* Full names run past this column, so the label wraps to
                      two lines rather than truncating someone mid-surname,
                      and holds that height either way to keep the titles
                      below on one baseline across the row. */}
                  <p className="mt-5 line-clamp-2 min-h-8 text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.2em] text-rose-600">
                    {story.kind === 'single'
                      ? primary.name
                      : t('voices', { count: story.members.length })}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-900 transition-colors duration-300 group-hover/story:text-rose-600">
                    {story.title}
                  </p>
                </button>
              );
            })}
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
