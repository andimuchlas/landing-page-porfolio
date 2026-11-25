"use client";

import { useEffect, useRef } from "react";
import { View } from "@react-three/drei";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { S, onReady, prefersReducedMotion } from "@/lib/state";
import { scrollTo } from "@/components/SmoothScroll";
import MagneticButton from "@/components/fx/MagneticButton";
import HeroLogo from "@/components/experience/scenes/HeroLogo";

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const flash = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;

    let offReady: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const rm = prefersReducedMotion();
      // entrance — waits for the preloader to finish
      const playEntrance = () => {
        gsap.fromTo(
          ".hero-line",
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: rm ? 0 : 1.0,
            stagger: rm ? 0 : 0.1,
            ease: "power4.out",
            delay: 0.15,
          }
        );
        gsap.fromTo(
          ".hero-fade",
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: rm ? 0 : 0.9,
            stagger: rm ? 0 : 0.12,
            delay: 0.65,
          }
        );
      };
      offReady = onReady(() => gsap.delayedCall(0.05, playEntrance));

      // clean scroll-driven exit (no jarring white flash)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        })
        .fromTo(
          h1.current,
          { scale: 1 },
          { scale: 1.12, ease: "none", duration: 0.7 },
          0
        )
        .to(
          ".hero-line",
          { opacity: 0, yPercent: -14, stagger: 0.04, duration: 0.35 },
          0.35
        )
        .to(".hero-fade", { opacity: 0, duration: 0.25 }, 0.25)
        .set({}, {}, 1);

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          S.hero.p = self.progress;
        },
      });
    }, el);

    return () => {
      offReady?.();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} id="hero" className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <View className="absolute inset-0">
          <HeroLogo />
        </View>

        <div className="pointer-events-none relative z-10 px-6 text-center">
          <p className="hero-fade mb-8 font-tech text-[11px] tracking-[0.35em] text-dim md:text-xs">
            [ ANDI MUCHLAS — FULL-STACK & SPATIAL SYSTEMS ENGINEER ]
          </p>
          <h1
            ref={h1}
            className="font-display font-expanded font-black text-[clamp(3.2rem,11.5vw,10rem)] leading-[0.88] tracking-[-0.03em] text-ink"
          >
            <span className="hero-line block">I BUILD</span>
            <span className="hero-line block text-ink">SYSTEMS</span>
            <span className="hero-line block">
              THAT SCALE<span className="text-accent">.</span>
            </span>
          </h1>
          <p className="hero-fade mx-auto mt-10 max-w-md font-tech text-xs leading-relaxed text-dim">
            SPATIAL SYSTEMS · WEB & MOBILE APPS · HIGH-THROUGHPUT BACKENDS
          </p>

          <div className="hero-fade pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <MagneticButton
              href="mailto:andimuchlas156@gmail.com?subject=Project%20Inquiry"
              className="rounded-full border border-accent px-7 py-3 font-tech text-[11px] tracking-[0.25em] text-accent transition-colors duration-300 hover:bg-accent hover:text-black"
            >
              START A PROJECT →
            </MagneticButton>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#work");
              }}
              className="group inline-flex items-center gap-2 font-tech text-[11px] tracking-[0.25em] text-dim transition-colors hover:text-ink"
            >
              SEE THE WORK
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </a>
          </div>
        </div>

        <div className="hero-fade absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
          <p className="mb-3 font-tech text-[10px] tracking-[0.4em] text-dim">
            SCROLL TO ENTER
          </p>
          <div className="mx-auto h-10 w-px overflow-hidden bg-white/10">
            <div className="anim-scan h-1/4 w-full bg-accent" />
          </div>
        </div>

        <div
          ref={flash}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 bg-white opacity-0"
        />
      </div>
    </section>
  );
}
