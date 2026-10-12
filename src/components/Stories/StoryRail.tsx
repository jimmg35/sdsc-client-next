'use client';

import StoryModal from '@/components/Stories/StoryModal';
import Avatar from '@/components/Utility/Avatar';
import type { StoryEvent } from '@/lib/stories/types';
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from 'lucide-react';
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
  const closeStory = useCallback(() => setActiveIndex(null), []);
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
              <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:text-xs md:tracking-[0.42em]">
                <span
                  aria-hidden
                  className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
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
                  className="group inline-flex shrink-0 items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary-600 transition-colors hover:text-primary-700"
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent-600/30 text-ink-500 transition duration-300 hover:border-primary-400/60 hover:bg-primary-50 hover:text-primary-600 disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={t('scrollNext')}
                    disabled={!overflow.right}
                    onClick={() => scrollByStep(1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent-600/30 text-ink-500 transition duration-300 hover:border-primary-400/60 hover:bg-primary-50 hover:text-primary-600 disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* The padding, cancelled by the negative margin, is room for the
              live ring's ripples, which the scroller would otherwise clip;
              the scroll padding keeps snapped items on the heading's line. */}
          <div
            ref={railRef}
            onScroll={syncOverflow}
            className="-mx-6 mt-6 flex snap-x scroll-px-6 gap-8 overflow-x-auto px-6 pb-2 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visibleStories.map((story, index) => {
              const [primary, second] = story.members;
              const isGroup = story.kind === 'group' && Boolean(second);
              const label =
                story.kind === 'lab'
                  ? t('labStory')
                  : story.kind === 'single'
                    ? primary.name
                    : t('voices', { count: story.members.length });

              return (
                <button
                  key={story.slug}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  /* Top-aligned: stretched to the row's height, a button
                     centres its content, which dropped every story with a
                     shorter title below its neighbours. */
                  className="group/story w-40 shrink-0 snap-start self-start text-left"
                >
                  {/* Every item is the same circle so the row keeps one
                      rhythm; a group is marked by a second face tucked into
                      the corner rather than a cluster that has to be
                      deciphered at this size, and a story with its own ring
                      art shows the thing itself instead of a face. */}
                  {story.cover ? (
                    <LiveRing cover={story.cover} clip={story.coverVideo} />
                  ) : (
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
                        <span className="absolute -bottom-1 -right-1 inline-flex rounded-full bg-surface p-[2px] shadow-lift-sm">
                          <Avatar
                            src={second.thumbnail}
                            size={30}
                            alt={`${second.name} portrait`}
                            variant="soft"
                          />
                        </span>
                      )}
                    </span>
                  )}

                  {/* Full names run past this column, so the label wraps to
                      two lines rather than truncating someone mid-surname,
                      and holds that height either way to keep the titles
                      below on one baseline across the row. */}
                  <p className="mt-5 line-clamp-2 min-h-8 text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.2em] text-primary-600">
                    {label}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-900 transition-colors duration-300 group-hover/story:text-primary-600">
                    {story.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mounted only while open, so each opening starts fresh. */}
      {activeIndex !== null && (
        <StoryModal
          stories={stories}
          initialIndex={activeIndex}
          onClose={closeStory}
        />
      )}
    </>
  );
}

/* The one ring in the row meant to be noticed: its clip runs inside it, a
   heatmap ramp turns around it, contour lines ripple out from it, and a play
   badge says there is footage behind it. The clip only runs while the ring is
   on screen, and under reduced motion none of it moves; the cover, which is
   the clip's first frame, stands still instead. */
function LiveRing({ cover, clip }: { cover: string; clip?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (
      !video ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <span className="relative inline-flex">
      <span aria-hidden className="story-ripple" />
      <span aria-hidden className="story-ripple [animation-delay:1.3s]" />

      <span className="story-ring-live transition-transform duration-300 group-hover/story:scale-[1.04]">
        {clip ? (
          <video
            ref={videoRef}
            aria-hidden
            className="h-[76px] w-[76px] rounded-full border border-white/85 object-cover"
            poster={cover}
            muted
            loop
            playsInline
            preload="none"
          >
            <source src={clip} type="video/mp4" />
          </video>
        ) : (
          <Avatar src={cover} size={76} alt="" variant="soft" />
        )}
      </span>

      <span
        aria-hidden
        className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface text-primary-600 shadow-lift-sm"
      >
        <Play size={12} className="translate-x-px fill-current" />
      </span>
    </span>
  );
}
