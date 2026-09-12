'use client';

import { useEffect, useRef } from 'react';

// A drifting field of nodes over the hero artwork. Hold the pointer still and
// they are drawn in; move it again and they scatter back to their wandering.
const PARTICLE_COUNT = 54;

// How long the pointer has to hold still before the field starts pulling. Long
// enough that ordinary movement across the hero does not trigger it, short
// enough that stopping feels like it caused the effect.
const IDLE_MS = 340;

// Nodes settle into a ring around this radius rather than piling onto the
// cursor — a heap on a single point reads as a bug, an orbit reads as
// magnetism. Each node varies off it so the swarm is a cloud, not a circle.
const ORBIT_RADIUS = 76;

// Fraction of the remaining distance covered per frame while attracting. At
// 0.06 the far corner of a 1440px hero arrives in a little under a second.
const PULL_EASE = 0.06;

// Radians added to each node's angle per frame, which turns the approach into
// a slow rotation once the swarm has gathered.
const SWIRL_PER_FRAME = 0.006;

const LINK_DISTANCE = 128;
const MAX_SPEED = 2.4;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  wander: number;
  orbit: number;
};

const HeroField = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // The effect is pointer-driven decoration; neither reduced-motion users nor
    // touch devices (which have no hover to hold still) get anything from it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
      return;

    const host = canvas.parentElement;
    if (!host) return;

    let width = 0;
    let height = 0;
    let frame: number | null = null;
    let visible = true;

    const particles: Particle[] = [];
    const pointer = { x: 0, y: 0, inside: false, lastMove: 0 };

    const seed = () => {
      particles.length = 0;
      for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: 1.1 + Math.random() * 2.4,
          alpha: 0.25 + Math.random() * 0.45,
          wander: Math.random() * Math.PI * 2,
          orbit: ORBIT_RADIUS * (0.55 + Math.random() * 0.85)
        });
      }
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      // Cap the backing store at 2x: past that the cost is real and nothing in
      // a field of soft dots is sharp enough to show the difference.
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      if (particles.length === 0) {
        seed();
        return;
      }

      for (const particle of particles) {
        particle.x = Math.min(particle.x, width);
        particle.y = Math.min(particle.y, height);
      }
    };

    const wrap = (particle: Particle) => {
      const margin = 24;
      if (particle.x < -margin) particle.x = width + margin;
      if (particle.x > width + margin) particle.x = -margin;
      if (particle.y < -margin) particle.y = height + margin;
      if (particle.y > height + margin) particle.y = -margin;
    };

    const step = (time: number) => {
      frame = window.requestAnimationFrame(step);

      const attracting =
        pointer.inside && time - pointer.lastMove > IDLE_MS && visible;

      for (const particle of particles) {
        if (attracting) {
          // Eased toward a slot on a ring around the cursor rather than
          // accelerated at it: an acceleration model takes seconds to bring the
          // far side of the screen in, which does not read as magnetism. Each
          // particle keeps its own angle and ring radius, so the swarm holds
          // the arrangement it arrived in instead of collapsing to a disc.
          const angle =
            Math.atan2(particle.y - pointer.y, particle.x - pointer.x) +
            SWIRL_PER_FRAME;
          const targetX = pointer.x + Math.cos(angle) * particle.orbit;
          const targetY = pointer.y + Math.sin(angle) * particle.orbit;

          const nextX = particle.x + (targetX - particle.x) * PULL_EASE;
          const nextY = particle.y + (targetY - particle.y) * PULL_EASE;

          // Carried so that letting go hands the particle back to the drift
          // with the momentum it had, instead of stopping dead.
          particle.vx = nextX - particle.x;
          particle.vy = nextY - particle.y;
          particle.x = nextX;
          particle.y = nextY;
        } else {
          particle.wander += 0.009;
          particle.vx += Math.cos(particle.wander) * 0.014;
          particle.vy += Math.sin(particle.wander * 0.9) * 0.014;
          particle.vx *= 0.986;
          particle.vy *= 0.986;

          const speed = Math.hypot(particle.vx, particle.vy);
          if (speed > MAX_SPEED) {
            particle.vx = (particle.vx / speed) * MAX_SPEED;
            particle.vy = (particle.vy / speed) * MAX_SPEED;
          }

          particle.x += particle.vx;
          particle.y += particle.vy;
          wrap(particle);
        }
      }

      context.clearRect(0, 0, width, height);

      // Links first, so the dots sit on top of their own web.
      context.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > LINK_DISTANCE) continue;

          const strength = (1 - distance / LINK_DISTANCE) * 0.22;
          context.strokeStyle = `rgba(196, 231, 255, ${strength})`;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      for (const particle of particles) {
        const glow = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 4
        );
        glow.addColorStop(0, `rgba(226, 244, 255, ${particle.alpha})`);
        glow.addColorStop(1, 'rgba(226, 244, 255, 0)');
        context.fillStyle = glow;
        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.radius * 4,
          0,
          Math.PI * 2
        );
        context.fill();

        context.fillStyle = `rgba(255, 255, 255, ${Math.min(
          particle.alpha + 0.3,
          0.9
        )})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const handleMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside =
        pointer.x >= 0 &&
        pointer.y >= 0 &&
        pointer.x <= rect.width &&
        pointer.y <= rect.height;
      pointer.lastMove = performance.now();
    };

    const handleLeave = () => {
      pointer.inside = false;
    };

    // The loop is pure decoration, so it stops the moment the hero is scrolled
    // past rather than running for the whole page.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && frame === null) {
          frame = window.requestAnimationFrame(step);
        } else if (!visible && frame !== null) {
          window.cancelAnimationFrame(frame);
          frame = null;
        }
      },
      { threshold: 0 }
    );

    const resizeObserver = new ResizeObserver(resize);

    resize();
    observer.observe(host);
    resizeObserver.observe(host);
    host.addEventListener('pointermove', handleMove);
    host.addEventListener('pointerleave', handleLeave);
    frame = window.requestAnimationFrame(step);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener('pointermove', handleMove);
      host.removeEventListener('pointerleave', handleLeave);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
    />
  );
};

export default HeroField;
