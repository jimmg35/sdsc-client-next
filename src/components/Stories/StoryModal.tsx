'use client';

import Avatar from '@/components/Utility/Avatar';
import type { StoryEvent, StoryMember } from '@/lib/stories/types';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Sparkles,
  Users,
  X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';

const AUTO_ADVANCE_MS = 7000;

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});

type StoryModalProps = {
  stories: StoryEvent[];
  isOpen: boolean;
  initialIndex: number;
  requestedFocusMemberId?: string | null;
  onClose: () => void;
};

export default function StoryModal({
  stories,
  isOpen,
  initialIndex,
  requestedFocusMemberId = null,
  onClose
}: StoryModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentProgressMs, setCurrentProgressMs] = useState(0);
  const [isProgressPaused, setIsProgressPaused] = useState(false);
  const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setCurrentIndex(Math.min(initialIndex, Math.max(stories.length - 1, 0)));
  }, [initialIndex, isOpen, stories.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setCurrentProgressMs(0);
    setIsProgressPaused(false);
  }, [currentIndex, isOpen]);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory) {
      setFocusedMemberId(null);
      return;
    }

    const nextFocusedMemberId =
      requestedFocusMemberId &&
      currentStory.memberIds.includes(requestedFocusMemberId)
        ? requestedFocusMemberId
        : currentStory.memberIds[0] || null;

    setFocusedMemberId(nextFocusedMemberId);
  }, [currentIndex, currentStory, requestedFocusMemberId]);

  const focusedMember =
    currentStory?.members.find((member) => member.id === focusedMemberId) ||
    currentStory?.members[0] ||
    null;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const goPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, stories.length - 1));
  }, [stories.length]);

  useEffect(() => {
    if (!isOpen || isProgressPaused) {
      return;
    }

    const stepMs = 50;
    const timer = window.setInterval(() => {
      setCurrentProgressMs((prev) => {
        const next = Math.min(prev + stepMs, AUTO_ADVANCE_MS);

        if (next >= AUTO_ADVANCE_MS) {
          window.clearInterval(timer);

          if (currentIndex < stories.length - 1) {
            goNext();
            return 0;
          }
        }

        return next;
      });
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [currentIndex, goNext, isOpen, isProgressPaused, stories.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }

      if (event.key === 'ArrowLeft') {
        goPrevious();
      }

      if (event.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrevious, handleClose, isOpen]);

  if (!isMounted || !isOpen || !currentStory) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close story viewer"
        className="absolute inset-0 bg-[#100818]/82 backdrop-blur-md"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative flex h-full max-h-[52rem] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#100817] text-white shadow-[0_45px_120px_-42px_rgba(7,2,15,0.95)] md:flex-row"
      >
        <div className="absolute inset-x-4 top-4 z-20 flex gap-2">
          {stories.map((story, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;
            const progressWidth = `${Math.min(
              100,
              (currentProgressMs / AUTO_ADVANCE_MS) * 100
            )}%`;

            return (
              <span
                key={story.slug}
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
              >
                {isCompleted ? (
                  <span className="block h-full w-full bg-white" />
                ) : isActive ? (
                  <span
                    className="block h-full bg-white transition-[width] duration-75 ease-linear"
                    style={{
                      width: progressWidth
                    }}
                  />
                ) : null}
              </span>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Close story viewer"
          className="absolute right-4 top-5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white transition hover:bg-black/40"
          onClick={handleClose}
        >
          <X size={18} />
        </button>

        <div
          className="relative min-h-[19rem] flex-1 md:min-h-0"
          onPointerDown={() => setIsProgressPaused(true)}
          onPointerUp={() => setIsProgressPaused(false)}
          onPointerLeave={() => setIsProgressPaused(false)}
          onPointerCancel={() => setIsProgressPaused(false)}
        >
          <Image
            src={currentStory.thumbnail}
            alt={currentStory.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,4,14,0.18),rgba(9,4,14,0.6)_55%,rgba(9,4,14,0.9))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.24),transparent_35%)]" />

          <div className="absolute inset-x-6 bottom-6 z-10 space-y-4 md:inset-x-8 md:bottom-8">
            <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-white/80">
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 backdrop-blur">
                Story {currentIndex + 1} / {stories.length}
              </span>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 backdrop-blur">
                {currentStory.kind === 'single'
                  ? 'Member Story'
                  : 'Group Story'}
              </span>
            </div>

            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
                {currentStory.title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/78 md:text-base">
                {currentStory.summary}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 bg-[linear-gradient(180deg,rgba(19,11,29,0.96),rgba(14,8,22,0.98))] px-6 pb-6 pt-16 md:w-[30rem]">
          <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/72">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5">
              <CalendarDays size={14} />
              {formatter.format(new Date(currentStory.date))}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5">
              {currentStory.kind === 'single' ? (
                <Sparkles size={14} />
              ) : (
                <Users size={14} />
              )}
              {currentStory.members.length}{' '}
              {currentStory.members.length === 1 ? 'member' : 'members'}
            </span>
          </div>

          {focusedMember && (
            <section className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_28px_60px_-48px_rgba(0,0,0,0.7)]">
              <div className="flex items-center gap-4">
                <span className="story-ring shrink-0">
                  <Avatar
                    src={focusedMember.thumbnail}
                    size={68}
                    alt={`${focusedMember.name} portrait`}
                    variant="soft"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                    Spotlight
                  </p>
                  <p className="truncate text-lg font-semibold text-white">
                    {focusedMember.name}
                  </p>
                  {focusedMember.title && (
                    <p className="line-clamp-2 text-sm text-white/62">
                      {focusedMember.title}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/78">
                {focusedMember.highlight}
              </p>
            </section>
          )}

          {currentStory.members.length > 1 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/48">
                Featured Members
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {currentStory.members.map((member) => (
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
            className="inline-flex items-center justify-center rounded-full border border-rose-300/35 bg-rose-100/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-rose-900 transition hover:bg-rose-100"
          >
            Read Full Story
          </Link>

          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={goPrevious}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex === stories.length - 1}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
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
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-left text-xs font-semibold transition ${
        isActive
          ? 'border-rose-200/80 bg-rose-100 text-rose-950 shadow-[0_18px_30px_-26px_rgba(251,113,133,0.95)]'
          : 'border-white/10 bg-white/6 text-white/78 hover:bg-white/10'
      }`}
    >
      <Avatar
        src={member.thumbnail}
        size={28}
        alt={`${member.name} portrait`}
        variant="soft"
      />
      <span className="max-w-[11rem] truncate">{member.name}</span>
    </button>
  );
}
