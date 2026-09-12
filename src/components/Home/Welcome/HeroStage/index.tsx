'use client';

import { useEffect, useRef } from 'react';

const HERO_IMAGE = '/img/welcome-banner/mgwr-bg.png';

// How far the pointer is allowed to push the stage, in the unitless values the
// hero's transforms multiply by. Small on purpose: the band should feel like it
// is floating in front of the page, not swivelling.
const TILT_RANGE = 0.5;

type HeroStageProps = {
  title: string;
  scrollLabel: string;
};

const HeroStage = ({ title, scrollLabel }: HeroStageProps) => {
  const stageRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);

  // Pointer parallax is written straight to CSS custom properties rather than
  // React state: the values change on every mouse move and nothing else on the
  // page depends on them, so a re-render per frame would be pure waste.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
      return;

    const apply = (x: number, y: number) => {
      stage.style.setProperty('--tilt-x', x.toFixed(4));
      stage.style.setProperty('--tilt-y', y.toFixed(4));
    };

    const handleMove = (event: PointerEvent) => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const bounds = stage.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        apply(
          Math.max(-TILT_RANGE, Math.min(TILT_RANGE, x)),
          Math.max(-TILT_RANGE, Math.min(TILT_RANGE, y))
        );
      });
    };

    const handleLeave = () => apply(0, 0);

    stage.addEventListener('pointermove', handleMove);
    stage.addEventListener('pointerleave', handleLeave);

    return () => {
      stage.removeEventListener('pointermove', handleMove);
      stage.removeEventListener('pointerleave', handleLeave);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const words = title.split(/\s+/).filter(Boolean);

  return (
    <section
      ref={stageRef}
      className="hero-stage relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden"
      style={{ '--hero-image': `url(${HERO_IMAGE})` } as React.CSSProperties}
    >
      {/* Ambient wash: the same artwork, blurred past legibility, so the hero is
          lit by the colours of the piece it is framing. */}
      <div aria-hidden className="hero-ambient" />
      <div aria-hidden className="hero-veil absolute inset-0" />
      <div aria-hidden className="hero-weave absolute inset-0" />
      <div aria-hidden className="graticule-fade absolute inset-0 opacity-90" />
      <div aria-hidden className="hero-vignette absolute inset-0" />

      {/* Top padding clears the fixed header; the matching bottom padding keeps
          the band optically centred rather than shunted down by it. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-28 sm:px-8">
        <div className="hero-float relative">
          {/* Halo that makes the band read as lifted off the page. */}
          <div aria-hidden className="hero-halo" />

          <div className="hero-band group relative overflow-hidden rounded-[28px] ring-1 ring-white/15">
            <div aria-hidden className="hero-plate absolute inset-0" />
            <div aria-hidden className="hero-scrim absolute inset-0" />
            <div aria-hidden className="hero-sheen absolute inset-0" />

            <div className="relative flex h-full flex-col justify-end p-7 sm:p-10 lg:justify-center lg:p-14">
              <span
                aria-hidden
                className="hero-rule mb-6 flex items-center gap-3"
              >
                <i className="hero-pip" />
                <i className="hero-line" />
              </span>

              <h1 className="max-w-[15ch] text-[2rem] leading-[1.08] font-semibold tracking-tight text-white sm:text-[2.75rem] lg:text-[3.35rem]">
                {words.map((word, index) => (
                  <span key={`${word}-${index}`} className="hero-word">
                    <span
                      className="hero-word-inner"
                      style={{ animationDelay: `${120 + index * 85}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-3">
        <span className="text-[0.6rem] font-semibold tracking-[0.42em] text-ink-900/80 uppercase">
          {scrollLabel}
        </span>
        <span aria-hidden className="hero-scroll-track">
          <i className="hero-scroll-dot" />
        </span>
      </div>
    </section>
  );
};

export default HeroStage;
