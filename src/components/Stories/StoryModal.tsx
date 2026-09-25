'use client';

import Avatar from '@/components/Utility/Avatar';
import type { StoryEvent, StoryMember } from '@/lib/stories/types';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
  X
} from 'lucide-react';
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

/* Long enough to take in a title and its summary. The spotlight beside it
   can take longer, which is what the pause button — and resting the pointer
   on that column — is for. */
const AUTO_ADVANCE_MS = 9000;

/* A press on the picture shorter than this is a tap that turns the page;
   held longer, it only holds the story still. */
const TAP_MS = 220;

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ARTWORK_SIZES = '(max-width: 768px) 100vw, 40rem';

const CONTROL =
  'inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-night/45 text-white backdrop-blur transition hover:bg-white/10';

const STEP =
  'inline-flex cursor-pointer items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/80 transition hover:text-white disabled:pointer-events-none disabled:opacity-30';

type StoryModalProps = {
  stories: StoryEvent[];
  initialIndex: number;
  requestedFocusMemberId?: string | null;
  onClose: () => void;
};

/* Mounted only while open (see StoryRail), so every opening starts from a
   clean slate and closing is simply unmounting. */
export default function StoryModal({
  stories,
  initialIndex,
  requestedFocusMemberId = null,
  onClose
}: StoryModalProps) {
  const t = useTranslations('stories');
  const tCommon = useTranslations('common');
  const format = useFormatter();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef<{ time: number; x: number } | null>(null);

  const lastIndex = stories.length - 1;
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(lastIndex, 0))
  );
  const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);

  /* Four separate reasons to hold a story still; it plays only when none of
     them apply. Under reduced motion the viewer opens paused. */
  const [userPaused, setUserPaused] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isHeld, setIsHeld] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const paused = userPaused || isHeld || isReading || isHidden;

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory) {
      return;
    }

    setFocusedMemberId(
      requestedFocusMemberId &&
        currentStory.memberIds.includes(requestedFocusMemberId)
        ? requestedFocusMemberId
        : (currentStory.memberIds[0] ?? null)
    );
  }, [currentStory, requestedFocusMemberId]);

  const goPrevious = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, lastIndex));
  }, [lastIndex]);

  // Lock the page, take focus, and hand both back on close.
  useEffect(() => {
    const root = document.documentElement;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previous = {
      overflow: root.style.overflow,
      gutter: root.style.scrollbarGutter
    };

    /* Keep the scrollbar's width reserved while the page is locked, or
       everything behind the viewer jumps sideways as it opens and back as it
       closes. */
    if (window.innerWidth > root.clientWidth) {
      root.style.scrollbarGutter = 'stable';
    }
    root.style.overflow = 'hidden';
    dialogRef.current?.focus({ preventScroll: true });

    return () => {
      root.style.overflow = previous.overflow;
      root.style.scrollbarGutter = previous.gutter;
      opener?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft') {
        goPrevious();
        return;
      }

      if (event.key === 'ArrowRight') {
        goNext();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      // Keep Tab inside the viewer while it is open.
      const dialog = dialogRef.current;
      const focusables = dialog
        ? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
        : [];

      if (!focusables.length) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrevious, onClose]);

  // A background tab should not run the stories on without anyone watching.
  useEffect(() => {
    const sync = () => setIsHidden(document.hidden);

    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  // Fetch the neighbours' artwork ahead, so turning the page never waits on it.
  useEffect(() => {
    [stories[currentIndex + 1], stories[currentIndex - 1]].forEach((story) => {
      if (story?.thumbnail) {
        const image = new window.Image();
        image.src = story.thumbnail;
      }
    });
  }, [currentIndex, stories]);

  const handleProgressEnd = () => {
    if (currentIndex < lastIndex) {
      goNext();
    }
  };

  const handlePressStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    pressRef.current = { time: event.timeStamp, x: event.clientX };
    setIsHeld(true);
  };

  const handlePressEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const press = pressRef.current;
    pressRef.current = null;
    setIsHeld(false);

    if (!press || event.timeStamp - press.time > TAP_MS) {
      return;
    }

    // Like a book: the left third goes back, the rest goes on.
    const bounds = event.currentTarget.getBoundingClientRect();

    if (press.x - bounds.left < bounds.width / 3) {
      goPrevious();
    } else {
      goNext();
    }
  };

  const handlePressCancel = () => {
    pressRef.current = null;
    setIsHeld(false);
  };

  /* Resting a mouse on the text column holds the story while it is read. A
     touch has no hover, so taps there leave the timer alone. */
  const handleReading =
    (reading: boolean) => (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse') {
        setIsReading(reading);
      }
    };

  if (!currentStory || typeof document === 'undefined') {
    return null;
  }

  const members = currentStory.members;
  const [leadMember] = members;
  const focusedMember =
    members.find((member) => member.id === focusedMemberId) ??
    leadMember ??
    null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center md:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-label={t('close')}
        onClick={onClose}
        className="story-backdrop-enter absolute inset-0 cursor-default bg-night/80 backdrop-blur-md"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="story-dialog-enter relative flex h-[100dvh] w-full flex-col overflow-hidden bg-night text-white shadow-night outline-none md:h-[min(46rem,calc(100dvh_-_3rem))] md:max-w-5xl md:flex-row md:rounded-[28px] md:border md:border-white/10"
      >
        {/* The active segment is a CSS animation; the others are either full
            or empty, so nothing here re-renders while a story plays. */}
        <div className="pointer-events-none absolute inset-x-4 top-3 z-30 flex gap-1.5 md:top-4">
          {stories.map((story, index) => (
            <span
              key={story.slug}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20"
            >
              {index < currentIndex && (
                <span className="block h-full w-full bg-white" />
              )}
              {index === currentIndex && (
                <span
                  className="story-progress block h-full w-full bg-white"
                  style={
                    {
                      '--story-duration': `${AUTO_ADVANCE_MS}ms`,
                      animationPlayState: paused ? 'paused' : 'running'
                    } as CSSProperties
                  }
                  onAnimationEnd={handleProgressEnd}
                />
              )}
            </span>
          ))}
        </div>

        <div className="absolute right-3 top-6 z-30 flex items-center gap-2 md:right-4 md:top-7">
          <button
            type="button"
            onClick={() => setUserPaused((value) => !value)}
            aria-label={userPaused ? t('play') : t('pause')}
            className={CONTROL}
          >
            {userPaused ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className={CONTROL}
          >
            <X size={17} />
          </button>
        </div>

        {/* The picture. Tap to turn the page, hold to stop the clock; the
            buttons and arrow keys do the same for anyone not pointing. */}
        <div
          className="relative flex h-[46dvh] min-h-[19rem] shrink-0 cursor-pointer select-none flex-col overflow-hidden md:h-auto md:min-h-0 md:flex-1"
          onPointerDown={handlePressStart}
          onPointerUp={handlePressEnd}
          onPointerLeave={handlePressCancel}
          onPointerCancel={handlePressCancel}
        >
          {/* The ground: the artwork itself blurred out to fill the frame, or,
              when a story has none, the lead member's portrait treated the
              same way under the hero's contour rings. Either way the panel
              carries the story's own colour instead of going black. */}
          <div
            key={`${currentStory.slug}-ground`}
            className="story-enter absolute inset-0"
          >
            {currentStory.thumbnail ? (
              <Image
                src={currentStory.thumbnail}
                alt=""
                fill
                sizes={ARTWORK_SIZES}
                className="scale-125 object-cover opacity-55 blur-2xl saturate-150"
              />
            ) : (
              <>
                {leadMember && (
                  <Image
                    src={leadMember.thumbnail}
                    alt=""
                    fill
                    sizes={ARTWORK_SIZES}
                    className="scale-150 object-cover opacity-35 blur-3xl saturate-150"
                  />
                )}
                <div className="story-contours absolute inset-0" />
              </>
            )}
          </div>
          <div className="story-glow pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/30 via-transparent via-45% to-night/90" />

          {/* Artwork runs from wide photographs to transparent logos, so it
              is contained, never cropped, and sits above the caption rather
              than under it. */}
          <div
            key={`${currentStory.slug}-art`}
            className="story-enter relative flex min-h-0 flex-1 items-center justify-center px-6 pb-2 pt-14 md:px-10 md:pt-16"
          >
            {currentStory.thumbnail ? (
              <div className="relative h-full w-full">
                <Image
                  src={currentStory.thumbnail}
                  alt=""
                  fill
                  sizes={ARTWORK_SIZES}
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <StoryFaces members={members} />
            )}
          </div>

          <div
            key={`${currentStory.slug}-caption`}
            className="story-enter relative z-10 px-6 pb-6 md:px-9 md:pb-9"
          >
            <p className="flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-white/70">
              <span className="tabular-nums">
                {t('counter', {
                  current: currentIndex + 1,
                  total: stories.length
                })}
              </span>
              <span aria-hidden className="h-px w-6 bg-white/30" />
              <span>
                {currentStory.kind === 'single'
                  ? t('memberStory')
                  : t('groupStory')}
              </span>
            </p>
            <h2
              id={titleId}
              className="mt-3 line-clamp-4 text-[1.45rem] font-semibold leading-[1.2] tracking-[-0.015em] text-white md:line-clamp-none md:text-[2rem] md:leading-[1.15]"
            >
              {currentStory.title}
            </h2>
            <p className="mt-4 hidden max-w-xl text-[0.95rem] leading-7 text-white/80 md:block">
              {currentStory.summary}
            </p>
          </div>
        </div>

        <div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto border-white/10 md:w-[23rem] md:flex-none md:border-l"
          onPointerEnter={handleReading(true)}
          onPointerLeave={handleReading(false)}
        >
          <div
            key={`${currentStory.slug}-details`}
            className="story-enter flex-1 px-6 pt-6 md:px-7 md:pt-20"
          >
            {/* On a phone the picture has no room for the summary, so it
                leads the text column instead. */}
            <p className="mb-6 text-sm leading-6 text-white/80 md:hidden">
              {currentStory.summary}
            </p>

            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-white/60">
              <time dateTime={currentStory.date} className="tabular-nums">
                {format.dateTime(new Date(currentStory.date), {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
              <span aria-hidden className="h-px w-6 bg-white/25" />
              <span>{t('memberCount', { count: members.length })}</span>
            </p>

            {focusedMember && (
              <section className="mt-6 border-t border-white/10 pt-6">
                <div className="flex items-center gap-4">
                  <span className="story-ring shrink-0">
                    <Avatar
                      src={focusedMember.thumbnail}
                      size={56}
                      alt=""
                      variant="soft"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-brand-accent">
                      {t('spotlight')}
                    </p>
                    <Link
                      href={`/member/${focusedMember.id}`}
                      className="mt-1 block truncate text-base font-semibold text-white transition-colors hover:text-brand-accent"
                    >
                      {focusedMember.name}
                    </Link>
                    {focusedMember.title && (
                      <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-white/55">
                        {focusedMember.title}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/80">
                  {focusedMember.highlight}
                </p>
              </section>
            )}

            {members.length > 1 && (
              <section className="mt-6 border-t border-white/10 pt-6">
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                  {t('featuredMembers')}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {members.map((member) => (
                    <ParticipantChip
                      key={member.id}
                      member={member}
                      isActive={member.id === focusedMember?.id}
                      onClick={() => setFocusedMemberId(member.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            <Link
              href={currentStory.url}
              className="mt-8 flex items-center justify-center gap-2 rounded-full bg-brand-accent px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-night transition hover:brightness-110"
            >
              {t('readFullStory')}
              <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>

          {/* Pinned to the bottom of the column, so on a phone the way on is
              always in reach however long the spotlight runs. */}
          <nav
            aria-label={t('navigation')}
            className="sticky bottom-0 mt-6 flex items-center justify-between gap-3 border-t border-white/10 bg-night px-6 py-4 md:px-7"
          >
            <button
              type="button"
              onClick={goPrevious}
              disabled={currentIndex === 0}
              className={STEP}
            >
              <ArrowLeft size={15} aria-hidden />
              {tCommon('previous')}
            </button>
            <span className="text-[0.66rem] font-semibold tabular-nums tracking-[0.2em] text-white/45">
              {currentIndex + 1} / {stories.length}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex === lastIndex}
              className={STEP}
            >
              {tCommon('next')}
              <ArrowRight size={15} aria-hidden />
            </button>
          </nav>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* Stands in for the picture when a story has none: the people in it, the
   first in front, with a count for anyone past the third. */
function StoryFaces({ members }: { members: StoryMember[] }) {
  const faces = members.slice(0, 3);
  const extra = members.length - faces.length;
  const size =
    faces.length > 1
      ? 'h-20 w-20 md:h-28 md:w-28'
      : 'h-28 w-28 md:h-40 md:w-40';

  return (
    <div aria-hidden className="flex items-center">
      {faces.map((member, index) => (
        <span
          key={member.id}
          className={`story-ring ${index ? '-ml-5 md:-ml-7' : ''}`}
          style={{ zIndex: faces.length - index }}
        >
          <Avatar
            src={member.thumbnail}
            size={160}
            alt=""
            variant="soft"
            className={size}
          />
        </span>
      ))}
      {extra > 0 && (
        <span className="relative -ml-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-night/80 text-sm font-semibold tabular-nums text-white backdrop-blur md:h-14 md:w-14">
          +{extra}
        </span>
      )}
    </div>
  );
}

type ParticipantChipProps = {
  member: StoryMember;
  isActive: boolean;
  onClick: () => void;
};

function ParticipantChip({ member, isActive, onClick }: ParticipantChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs font-medium transition ${
        isActive
          ? 'border-brand-accent/70 bg-white/10 text-white'
          : 'border-white/10 text-white/70 hover:border-white/25 hover:text-white'
      }`}
    >
      <Avatar src={member.thumbnail} size={26} alt="" variant="soft" />
      <span className="max-w-[10rem] truncate">{member.name}</span>
    </button>
  );
}
