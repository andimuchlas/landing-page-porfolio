"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/state";

type Tech = {
  name: string;
  desc: string;
  projects: string[];
};

const TECHS: Tech[] = [
  { name: "NEXT.JS", desc: "Web applications, SSR/SSG, full-stack architecture.", projects: ["ORBIT", "NEBULA"] },
  { name: "REACT", desc: "Interface engineering across every product.", projects: ["ORBIT", "NEBULA", "TERRA"] },
  { name: "TYPESCRIPT", desc: "Type safety as a default, not an afterthought.", projects: ["ORBIT", "TERRA"] },
  { name: "NODE.JS", desc: "Realtime services and API layers.", projects: ["TERRA", "ECHO"] },
  { name: "THREE.JS", desc: "3D on the web — including this very site.", projects: ["TERRA", "ECHO", "THIS SITE"] },
  { name: "GSAP", desc: "Scroll-driven storytelling and motion systems.", projects: ["THIS SITE"] },
  { name: "PYTHON", desc: "ML pipelines, data crunching, automation.", projects: ["NEBULA"] },
  { name: "GO", desc: "High-throughput backend services.", projects: ["ORBIT"] },
  { name: "POSTGRES", desc: "The database we trust with the source of truth.", projects: ["ORBIT", "NEBULA", "TERRA"] },
  { name: "DOCKER", desc: "Reproducible environments everywhere.", projects: ["ORBIT", "ECHO"] },
  { name: "AWS", desc: "Infrastructure that scales past the launch spike.", projects: ["NEBULA", "TERRA"] },
  { name: "UNITY", desc: "Games, XR and realtime simulation.", projects: ["ECHO"] },
];

export default function Toolbox() {
  const field = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const halfW = useRef<number[]>([]);
  const line = useRef<SVGLineElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const el = field.current;
    if (!el) return;

    const measure = () => {
      nodes.current.forEach((n, i) => {
        if (n) halfW.current[i] = n.offsetWidth / 2;
      });
    };
    measure();
    window.addEventListener("resize", measure);

    let angle = 0;
    let speed = prefersReducedMotion() ? 0 : 0.12; // deg per frame-ish
    let last = performance.now();
    let raf = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = Math.min(50, now - last) / 1000;
      last = now;

      const target = hoveredRef.current !== null ? 0 : 1;
      speed += (target - speed) * Math.min(1, dt * 4);

      angle += speed * 14 * dt;
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const portrait = rect.height > rect.width;
      const R = Math.min(cx, cy) - (portrait ? 24 : 34);
      const sy = portrait ? 0.72 : 0.86;

      const N = TECHS.length;
      for (let i = 0; i < N; i++) {
        const node = nodes.current[i];
        if (!node) continue;
        const a = ((i / N) * Math.PI * 2 + (angle * Math.PI) / 180) % (Math.PI * 2);
        const wobble = Math.sin(now * 0.001 + i * 2.4) * 5;
        const x = cx + Math.cos(a) * (R + wobble);
        const y = cy + Math.sin(a) * (R + wobble) * sy;
        // keep nodes inside the field horizontally
        const hw = halfW.current[i] ?? 40;
        const clampedX = Math.min(Math.max(x, hw + 4), rect.width - hw - 4);
        node.style.transform = `translate(${clampedX}px, ${y}px) translate(-50%, -50%)`;

        if (hoveredRef.current === i && line.current) {
          line.current.setAttribute("x1", String(cx));
          line.current.setAttribute("y1", String(cy));
          line.current.setAttribute("x2", String(clampedX));
          line.current.setAttribute("y2", String(y));
          line.current.setAttribute("opacity", "1");
        }
        if (hoveredRef.current === i && tip.current) {
          const tw = tip.current.offsetWidth || 224;
          const th = tip.current.offsetHeight || 120;
          let tx = clampedX + 18;
          if (tx + tw > rect.width - 8) tx = clampedX - tw - 18;
          tx = Math.max(8, Math.min(rect.width - tw - 8, tx));
          const ty =
            y >= cy
              ? Math.max(8, y - th - 18)
              : Math.min(rect.height - th - 8, y + 28);
          tip.current.style.transform = `translate(${tx}px, ${ty}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
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

    return () => {
      window.removeEventListener("resize", measure);
      io.disconnect();
      stop();
    };
  }, []);

  const active = hovered !== null ? TECHS[hovered] : null;

  return (
    <section id="toolbox" className="relative flex h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 grid-lines opacity-60" aria-hidden />

      <div className="relative flex h-full max-h-[820px] w-full max-w-[1100px] flex-col items-center justify-center py-24">
        <p className="mb-2 font-tech text-[11px] tracking-[0.35em] text-dim">04 — OUR TOOLBOX</p>

        <div
          ref={field}
          className="relative h-full w-full"
          onPointerDown={(e) => {
            // tap outside a node clears the tooltip on touch devices
            if (!(e.target as HTMLElement).closest("button")) setHovered(null);
          }}
        >
          {/* connection line */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            <line
              ref={line}
              x1="0"
              y1="0"
              x2="0"
              y2="0"
              stroke="#ff4d00"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0"
            />
          </svg>

          {/* center */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="font-display font-expanded text-2xl tracking-wide md:text-4xl">
              NOVA<span className="text-accent">{'//'}</span>LAB
            </div>
            <div className="mt-1 font-tech text-[9px] tracking-[0.4em] text-dim">
              ONE SYSTEM
            </div>
          </div>

          {/* nodes */}
          {TECHS.map((t, i) => (
            <button
              key={t.name}
              ref={(el) => {
                nodes.current[i] = el;
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className={`absolute left-0 top-0 z-20 rounded-full border px-3 py-1.5 font-tech text-[11px] tracking-widest backdrop-blur transition-colors duration-200 ${
                hovered === i
                  ? "border-accent bg-accent text-black"
                  : "border-white/15 bg-black/60 text-white/80 hover:border-white/40"
              }`}
            >
              {t.name}
            </button>
          ))}

          {/* tooltip */}
          <div
            ref={tip}
            aria-hidden={!active}
            className={`pointer-events-none absolute left-0 top-0 z-30 w-56 rounded-lg border border-white/12 bg-panel/95 p-4 shadow-2xl backdrop-blur transition-opacity duration-200 ${
              active ? "opacity-100" : "opacity-0"
            }`}
          >
            {active && (
              <>
                <div className="font-tech text-xs font-bold tracking-widest text-accent">
                  {active.name}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-dim">{active.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
                  {active.projects.map((p) => (
                    <span key={p} className="rounded bg-white/8 px-1.5 py-0.5 font-tech text-[9px] tracking-wider">
                      {p}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
