"use client";

import { useEffect, useRef } from "react";
import { View } from "@react-three/drei";
import { ScrollTrigger } from "@/lib/gsap";
import { S } from "@/lib/state";
import { smoothstep } from "@/lib/utils";
import GameWorld from "@/components/experience/scenes/GameWorld";

export default function GameSection() {
  const section = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;

    let raf = 0;
    let running = false;
    const tick = () => {
      const p = S.game.p;
      if (intro.current) {
        intro.current.style.opacity = String(1 - smoothstep(0.12, 0.38, p));
      }
      if (outro.current) {
        outro.current.style.opacity = String(smoothstep(0.72, 0.94, p));
      }
      if (bar.current) {
        bar.current.style.transform = `scaleX(${p})`;
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "120px" }
    );
    io.observe(el);

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        S.game.p = self.progress;
      },
    });

    return () => {
      io.disconnect();
      stop();
      st.kill();
    };
  }, []);

  return (
    <section ref={section} id="game" className="relative h-[350vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <View className="absolute inset-0">
          <GameWorld />
        </View>

        {/* HUD frame */}
        <div className="pointer-events-none absolute inset-5 z-10 border border-white/10" aria-hidden>
          <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-accent" />
          <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-accent" />
          <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-accent" />
          <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-accent" />
        </div>

        <p className="pointer-events-none absolute left-8 top-24 z-10 font-tech text-[10px] leading-relaxed tracking-[0.25em] text-white/70">
          TERRA//SIM v2.4<br />LAT -6.2088 / LNG 106.8456
        </p>

        <div
          ref={intro}
          className="pointer-events-none relative z-10 flex h-full flex-col justify-center px-8 md:px-16"
        >
          <p className="font-tech text-[11px] tracking-[0.35em] text-dim">05 — GAME & XR</p>
          <h2 className="mt-5 font-display font-expanded text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.95]">
            INTERACTIVE
            <br />
            <span className="text-chrome">WORLDS</span>
          </h2>
          <ul className="mt-7 flex gap-3 font-tech text-[11px] tracking-[0.25em]">
            {["GAME", "XR", "SIMULATION"].map((t) => (
              <li key={t} className="rounded-full border border-white/15 bg-black/40 px-4 py-1.5 backdrop-blur">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={outro}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0"
        >
          <h2 className="text-center font-display font-expanded text-[clamp(2.4rem,7.5vw,7rem)] leading-[1.02]">
            FROM PIXELS
            <br />
            TO WORLDS<span className="text-accent">.</span>
          </h2>
        </div>

        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="mb-2 flex justify-between font-tech text-[9px] tracking-[0.35em] text-white/60">
            <span>ENTERING WORLD</span>
            <span>LOADING…</span>
          </div>
          <div className="h-px w-full bg-white/10">
            <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
