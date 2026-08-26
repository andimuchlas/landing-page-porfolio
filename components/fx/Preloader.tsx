"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { markReady, prefersReducedMotion } from "@/lib/state";

const SEGMENTS = 48;

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    document.documentElement.style.overflow = "hidden";
    const reduced = prefersReducedMotion();

    const num = el.querySelector<HTMLElement>("[data-num]");
    const status = el.querySelector<HTMLElement>("[data-status]");
    const logo = el.querySelector<HTMLElement>("[data-logo]");
    const ring = el.querySelector<SVGSVGElement>("[data-ring]");
    const segs = ring
      ? Array.from(ring.querySelectorAll<SVGLineElement>("[data-seg]"))
      : [];

    const counter = { v: 0 };
    let finished = false;
    let cancelled = false;

    const setP = (v: number) => {
      if (num) num.textContent = String(Math.round(v)).padStart(3, "0");
      if (status && v > 45 && status.textContent === "[ INITIALIZING ]") {
        status.textContent = "[ LOADING ASSETS ]";
      }
      const active = Math.round((v / 100) * SEGMENTS);
      for (let i = 0; i < segs.length; i++) {
        segs[i].setAttribute(
          "stroke",
          i < active ? "#ff4d00" : "rgba(255,255,255,0.12)"
        );
      }
    };

    const ctx = gsap.context(() => {
      // slow ring rotation + idle logo pulse
      if (!reduced) {
        if (ring) {
          gsap.to(ring, {
            rotation: 360,
            duration: 26,
            ease: "none",
            transformOrigin: "50% 50%",
          });
        }
        if (logo) {
          gsap.to(logo, {
            scale: 1.05,
            opacity: 0.85,
            duration: 1.1,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }
      }

      // progress creep toward 92% while assets settle
      gsap.to(counter, {
        v: 92,
        duration: reduced ? 0.35 : 2.1,
        ease: "power2.inOut",
        onUpdate: () => setP(counter.v),
      });

      const finish = () => {
        if (finished || cancelled) return;
        finished = true;
        if (status) status.textContent = "[ SYSTEM ONLINE ]";

        const tl = gsap.timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            setGone(true);
          },
        });
        tl.to(counter, {
          v: 100,
          duration: 0.45,
          ease: "power1.out",
          onUpdate: () => setP(counter.v),
        })
          .add(() => markReady(), "+=0.1")
          .to(
            logo,
            {
              scale: reduced ? 1 : 1.4,
              opacity: 0,
              duration: 0.7,
              ease: "power3.in",
            },
            "<"
          )
          .to(
            el,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: reduced ? 0.3 : 0.9,
              ease: "power4.inOut",
            },
            "-=0.35"
          );
      };

      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      const minTime = new Promise((r) => setTimeout(r, reduced ? 400 : 2300));
      Promise.all([fontsReady, minTime]).then(finish);
    }, el);

    return () => {
      cancelled = true;
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      {/* circular segmented progress with logo at its center */}
      <div className="relative mb-10 flex items-center justify-center">
        <svg
          data-ring="ring"
          viewBox="0 0 160 160"
          className="h-48 w-48 will-change-transform md:h-56 md:w-56"
          aria-hidden
        >
          {Array.from({ length: SEGMENTS }).map((_, i) => {
            const a = (i / SEGMENTS) * Math.PI * 2 - Math.PI / 2;
            const r1 = 64;
            const r2 = 74;
            // rounded to avoid server/client float precision mismatches
            const x1 = Math.round((80 + Math.cos(a) * r1) * 100) / 100;
            const y1 = Math.round((80 + Math.sin(a) * r1) * 100) / 100;
            const x2 = Math.round((80 + Math.cos(a) * r2) * 100) / 100;
            const y2 = Math.round((80 + Math.sin(a) * r2) * 100) / 100;
            return (
              <line
                key={i}
                data-seg={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div data-logo className="absolute will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/image/Logo.png"
            alt="ANDI MUCHLAS"
            className="h-16 w-auto mix-blend-screen md:h-20"
          />
        </div>
      </div>

      <div
        data-num
        className="font-display text-6xl font-black tabular-nums tracking-tight md:text-7xl"
      >
        000
      </div>

      <p
        data-status
        className="mt-5 font-tech text-[10px] tracking-[0.4em] text-dim"
      >
        [ INITIALIZING ]
      </p>
    </div>
  );
}
