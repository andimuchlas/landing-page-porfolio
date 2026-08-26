"use client";

export type SectionKey =
  | "hero"
  | "services"
  | "work"
  | "game"
  | "machine";

/**
 * Mutable scroll-state bridge between DOM (GSAP ScrollTrigger)
 * and WebGL (R3F useFrame readers). Zero re-renders by design.
 */
export const S: Record<SectionKey, { p: number }> = {
  hero: { p: 0 },
  services: { p: 0 },
  work: { p: 0 },
  game: { p: 0 },
  machine: { p: 0 },
};

/** Shared pointer position, normalized -1..1 */
export const POINTER = { x: 0, y: 0 };

/* ---------- preloader readiness (preloader → sections handshake) ---------- */

let readyDone = false;
const readyCbs = new Set<() => void>();

export function markReady() {
  if (readyDone) return;
  readyDone = true;
  readyCbs.forEach((cb) => cb());
  readyCbs.clear();
}

export function onReady(cb: () => void) {
  if (readyDone) cb();
  else readyCbs.add(cb);
  return () => readyCbs.delete(cb);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < 768;
