"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/state";

let lenisInstance: Lenis | null = null;

/**
 * Animated jump to a section anchor. Duration scales with travel distance
 * (capped) so near hops feel snappy while cross-page flights still land
 * softly; `lock` guarantees the animation completes instead of being cut
 * short by wheel input.
 */
export function scrollTo(target: string) {
  const el = document.querySelector<HTMLElement>(target);
  if (!el) return;

  if (prefersReducedMotion()) {
    el.scrollIntoView({ behavior: "auto" });
    return;
  }

  if (!lenisInstance) {
    el.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const current = lenisInstance.scroll;
  const top = el.getBoundingClientRect().top + current;
  const dist = Math.abs(top - current);
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const duration = Math.min(2, Math.max(0.7, (dist / vh) * 0.35));

  lenisInstance.scrollTo(top, {
    duration,
    lock: true,
    force: true,
    easing: (t) => 1 - Math.pow(1 - t, 4), // quart-out: fast launch, soft landing
  });
}

/** Freeze page scrolling (menus, modals) without fighting Lenis. */
export function lockPageScroll(lock: boolean) {
  const el = document.documentElement;
  if (lock) {
    el.style.overflow = "hidden";
    lenisInstance?.stop();
  } else {
    el.style.overflow = "";
    lenisInstance?.start();
  }
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.09,
      smoothWheel: !reduced,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
