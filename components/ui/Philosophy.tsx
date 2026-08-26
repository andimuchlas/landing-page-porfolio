"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/state";

const LINES: {
  text: string;
  anim: "left" | "right" | "scale" | "fade" | "final";
}[] = [
  { text: "I DON'T", anim: "left" },
  { text: "JUST WRITE", anim: "right" },
  { text: "CODE.", anim: "scale" },
  { text: "I BUILD", anim: "fade" },
  { text: "SYSTEMS.", anim: "final" },
];

const fromVars = {
  left: { xPercent: -28, opacity: 0, filter: "blur(12px)" },
  right: { xPercent: 28, opacity: 0, filter: "blur(12px)" },
  scale: { scale: 0.5, opacity: 0 },
  fade: { opacity: 0, y: 40 },
  final: { scale: 1.6, opacity: 0, filter: "blur(20px)" },
};

export default function Philosophy() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const rm = prefersReducedMotion();
      LINES.forEach((l) => {
        gsap.fromTo(`[data-anim="${l.anim}"]`, fromVars[l.anim], {
          xPercent: 0,
          yPercent: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: rm ? 0 : 1.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: `[data-anim="${l.anim}"]`,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="philosophy" className="relative px-6 py-[24vh]">
      <div className="mx-auto max-w-6xl">
        <p className="mb-14 font-tech text-[11px] tracking-[0.35em] text-dim">
          00 — PHILOSOPHY
        </p>
        <h2 className="font-display space-y-2 font-expanded text-[clamp(2.6rem,8.5vw,7.5rem)] leading-[1.02]">
          {LINES.map((l) => (
            <span
              key={l.text}
              data-anim={l.anim}
              className={`block will-change-transform ${
                l.anim === "final" ? "text-chrome" : ""
              }`}
            >
              {l.text.replace(".", "")}
              {l.text.endsWith(".") && (
                <span className="text-accent">.</span>
              )}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
