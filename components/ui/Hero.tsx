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
          { yPercent: 120, opacity: 0, filter: "blur(14px)" },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: rm ? 0 : 1.4,
            stagger: rm ? 0 : 0.12,
            ease: "power4.out",
            delay: 0.25,
          }
        );
        gsap.fromTo(
          ".hero-fade",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: rm ? 0 : 1.2,
            stagger: rm ? 0 : 0.15,
            delay: 1.0,
          }
        );
      };
      offReady = onReady(() => gsap.delayedCall(0.05, playEntrance));

      // scroll-driven portal sequence
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
          { scale: 1.3, ease: "none", duration: 0.6 },
          0
        )
        .to(
          ".hero-line",
          { opacity: 0, yPercent: -18, stagger: 0.05, duration: 0.3 },
          0.22
        )
        .to(".hero-fade", { opacity: 0, duration: 0.2 }, 0.15)
        .to(flash.current, { opacity: 1, duration: 0.16, ease: "power2.in" }, 0.82)
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
    <section ref={section} id="hero" className="relative h-[340vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <View className="absolute inset-0">
          <HeroLogo />
        </View>

        <div className="pointer-events-none relative z-10 px-6 text-center">
          <p className="hero-fade mb-8 font-tech text-[11px] tracking-[0.35em] text-dim md:text-xs">
            [ SOFTWARE HOUSE × CREATIVE TECHNOLOGY STUDIO ]
          </p>
          <h1
            ref={h1}
            className="font-display font-expanded text-[clamp(3rem,11vw,9.5rem)] leading-[0.92] tracking-tight"
          >
            <span className="hero-line block">WE BUILD</span>
            <span className="hero-line text-chrome block">DIGITAL</span>
            <span className="hero-line block">
              WORLDS<span className="text-accent">.</span>
            </span>
          </h1>
          <p className="hero-fade mx-auto mt-10 max-w-md font-tech text-xs leading-relaxed text-dim">
            PRODUCTS · INTELLIGENT SYSTEMS · SPATIAL TECHNOLOGY · GAMES
          </p>

          <div className="hero-fade pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <MagneticButton
              href="mailto:hello@novalab.studio"
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
