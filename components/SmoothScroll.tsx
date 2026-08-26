"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/state";

let lenisInstance: Lenis | null = null;

export function scrollTo(target: string) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { duration: 1.6 });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
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
