"use client";

import { useEffect, useRef, useState } from "react";
import { View } from "@react-three/drei";
import { ScrollTrigger } from "@/lib/gsap";
import { S } from "@/lib/state";
import { clamp01, smoothstep } from "@/lib/utils";
import { lockPageScroll } from "@/components/SmoothScroll";
import WorkParticles from "@/components/experience/scenes/WorkParticles";

/* ------------------------------- data ------------------------------- */

const PROJECTS = [
  {
    id: "orbit",
    n: "01",
    name: "ORBIT",
    tag: "Enterprise logistics platform.",
    year: "2025",
    type: "WEB PLATFORM",
    stack: ["NEXT.JS", "GO", "POSTGRES"],
    desc: "A realtime control tower for enterprise logistics — live fleet telemetry, route optimization and exception handling across dozens of regional hubs.",
  },
  {
    id: "nebula",
    n: "02",
    name: "NEBULA",
    tag: "AI-powered analytics platform.",
    year: "2024",
    type: "AI / SAAS",
    stack: ["PYTHON", "REACT", "AWS"],
    desc: "An ML platform that turns raw product data into forecasts and anomaly alerts, with explainability built into every model card.",
  },
  {
    id: "terra",
    n: "03",
    name: "TERRA",
    tag: "Spatial intelligence platform.",
    year: "2026",
    type: "GEOSPATIAL",
    stack: ["THREE.JS", "NODE.JS", "POSTGRES"],
    desc: "A geospatial engine that renders massive terrain datasets in the browser — from satellite imagery to digital-twin simulations.",
  },
  {
    id: "echo",
    n: "04",
    name: "ECHO",
    tag: "Interactive multiplayer game.",
    year: "2025",
    type: "GAME",
    stack: ["UNITY", "C#", "WEBGL"],
    desc: "A browser-native multiplayer arena built on WebGL netcode — sub-frame input latency with rollback across regions.",
  },
];

/* ------------------------------ mockups ------------------------------ */

function WindowFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[560px] overflow-hidden rounded-xl border border-white/10 bg-panel/90 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-1.5 border-b border-white/8 px-3 py-2 sm:px-4 sm:py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <span className="ml-3 font-tech text-[10px] tracking-[0.25em] text-dim">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function OrbitMock() {
  const bars = [42, 68, 35, 80, 55, 92, 61, 47, 74, 58, 88, 66];
  return (
    <WindowFrame title="ORBIT // CONTROL">
      <div className="flex">
        <div className="hidden w-28 shrink-0 space-y-3 border-r border-white/8 p-4 sm:block">
          <div className="mb-4 h-2 w-8 rounded bg-accent" />
          {[70, 50, 60, 40, 55].map((w, i) => (
            <div key={i} className="h-1.5 rounded bg-white/12" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              ["1,284", "SHIPMENTS"],
              ["99.7%", "ON-TIME"],
              ["38", "ROUTES"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-lg border border-white/8 bg-black/30 p-2 sm:p-3">
                <div className="font-display text-base font-bold text-chrome sm:text-lg">{v}</div>
                <div className="mt-1 font-tech text-[9px] tracking-widest text-dim">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-16 items-end gap-1.5 rounded-lg border border-white/8 bg-black/30 p-3 sm:h-24">
            {bars.map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${i === 5 ? "bg-accent" : "bg-white/20"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {[82, 64, 45].map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-green-400" : "bg-white/25"}`} />
                <div className="h-1.5 rounded bg-white/12" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function NebulaMock() {
  return (
    <WindowFrame title="NEBULA // ANALYTICS">
      <div className="flex flex-col sm:grid sm:grid-cols-5">
        <div className="p-3 sm:col-span-3 sm:p-4">
          <svg viewBox="0 0 200 140" className="h-28 w-full sm:h-40">
            {[
              [30, 70], [70, 30], [75, 105], [120, 65], [160, 30], [165, 100], [100, 125],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === 3 ? 7 : 4} fill={i % 2 ? "#c4b5fd" : "#ffffff33"} />
            ))}
            {[[30, 70, 120, 65], [70, 30, 120, 65], [75, 105, 120, 65], [120, 65, 160, 30], [120, 65, 165, 100], [100, 125, 75, 105]]
              .map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c4b5fd66" strokeWidth="1" className="anim-dash" strokeDasharray="4 4" />
              ))}
          </svg>
        </div>
        <div className="space-y-3 border-t border-white/8 p-3 sm:col-span-2 sm:border-l sm:border-t-0 sm:p-4">
          <div>
            <div className="font-display text-2xl font-bold text-chrome">98.2%</div>
            <div className="font-tech text-[9px] tracking-widest text-dim">MODEL ACCURACY</div>
          </div>
          <svg viewBox="0 0 100 30" className="h-8 w-full">
            <polyline points="0,24 15,18 30,22 45,10 60,14 75,6 100,9" fill="none" stroke="#c4b5fd" strokeWidth="1.5" />
          </svg>
          <div className="space-y-2 pt-1">
            {[88, 62].map((w, i) => (
              <div key={i} className="h-1.5 rounded bg-white/12" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function TerraMock() {
  return (
    <WindowFrame title="TERRA // GEOSPATIAL">
      <div className="relative p-3 sm:p-4">
        <svg viewBox="0 0 220 130" className="h-32 w-full sm:h-44">
          {[
            "M110,65 m-52,0 a52,38 0 1,0 104,0 a52,38 0 1,0 -104,0",
            "M110,65 m-38,0 a38,27 0 1,0 76,0 a38,27 0 1,0 -76,0",
            "M110,65 m-24,0 a24,17 0 1,0 48,0 a24,17 0 1,0 -48,0",
            "M110,65 m-11,0 a11,8 0 1,0 22,0 a11,8 0 1,0 -22,0",
          ].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#86efac" strokeOpacity={0.5 - i * 0.08} strokeWidth="1" />
          ))}
          <line x1="0" y1="65" x2="220" y2="65" stroke="#ffffff22" strokeDasharray="3 5" />
          <line x1="110" y1="0" x2="110" y2="130" stroke="#ffffff22" strokeDasharray="3 5" />
          <circle cx="110" cy="65" r="3" fill="#ff4d00" className="anim-pulse-dot" />
        </svg>
        <div className="absolute right-4 top-4 hidden font-tech text-[9px] leading-relaxed tracking-widest text-dim sm:block">
          LAT -6.2088<br />LNG 106.8456<br />ALT 128m
        </div>
        <div className="mt-2 flex gap-4 font-tech text-[9px] tracking-widest text-dim">
          <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-sm bg-[#86efac]" />URBAN</span>
          <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-sm bg-white/25" />TERRAIN</span>
          <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-sm bg-accent" />ASSET</span>
        </div>
      </div>
    </WindowFrame>
  );
}

function EchoMock() {
  return (
    <WindowFrame title="ECHO // MATCH 042">
      <div className="relative h-44 select-none sm:h-56">
        {/* corner brackets */}
        <span className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-white/40" />
        <span className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-white/40" />
        <span className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-white/40" />
        <span className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-white/40" />
        {/* crosshair */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="mx-auto mb-2 h-6 w-px bg-accent" />
          <div className="mx-auto -mt-4 h-px w-6 bg-accent" />
        </div>
        {/* kill feed */}
        <div className="absolute right-4 top-4 space-y-1.5 font-tech text-[9px] tracking-wider text-white/60">
          <div>NOVA_07 ▸ RIVAL_X</div>
          <div>GHOST ▸ NOVA_02</div>
          <div className="text-accent">YOU ▸ PHANTOM</div>
        </div>
        {/* hp */}
        <div className="absolute bottom-4 left-4 space-y-1.5">
          <div className="font-tech text-[9px] tracking-widest text-dim">HP</div>
          <div className="flex gap-1">
            {[100, 100, 100, 72, 0].map((v, i) => (
              <span key={i} className="h-2 w-6 rounded-sm" style={{ background: v > 0 ? `rgba(255,77,0,${0.25 + v * 0.007})` : "rgba(255,255,255,0.08)" }} />
            ))}
          </div>
        </div>
        {/* ammo */}
        <div className="absolute bottom-4 right-4 flex gap-1">
          {[1, 1, 1, 1, 0, 0].map((v, i) => (
            <span key={i} className={`h-4 w-1.5 rounded-sm ${v ? "bg-white/70" : "bg-white/12"}`} />
          ))}
        </div>
        {/* minimap */}
        <div className="anim-drift absolute left-1/2 top-6 h-10 w-10 -translate-x-1/2 rounded-sm border border-white/20">
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400" />
        </div>
      </div>
    </WindowFrame>
  );
}

const MOCKS: Record<string, () => React.ReactElement> = {
  orbit: OrbitMock,
  nebula: NebulaMock,
  terra: TerraMock,
  echo: EchoMock,
};

/* ------------------------------ section ------------------------------ */

export default function Work() {
  const section = useRef<HTMLElement>(null);
  const panels = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const project = openId ? PROJECTS.find((p) => p.id === openId) : null;

  useEffect(() => {
    if (!project) return;
    lockPageScroll(true);
    const t = window.setTimeout(() => closeRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockPageScroll(false);
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [project]);

  useEffect(() => {
    const root = section.current;
    const wrap = panels.current;
    if (!root || !wrap) return;

    const infos = Array.from(wrap.querySelectorAll<HTMLElement>(".work-info"));
    const mocks = Array.from(wrap.querySelectorAll<HTMLElement>(".work-mock"));
    const last = PROJECTS.length - 1;

    // content opacity is a pure function of S.work.p — fully scrub-reversible.
    // Panels stack via sticky; the moment the next project starts rising, the
    // previous one fades out — no double-content overlap.
    let raf = 0;
    let running = false;
    const tick = () => {
      // ScrollTrigger progress spans wrapperHeight - viewport (300vh for 4
      // panels), so each panel's sticky window is 1/(count-1) of p, not 1/count.
      const g = clamp01(S.work.p) * (PROJECTS.length - 1);
      for (let i = 0; i < PROJECTS.length; i++) {
        const info = infos[i];
        const mock = mocks[i];
        if (!info || !mock) continue;

        const x = g - i; // 0 = stuck & current, 1 = fully covered, -1..0 = rising in
        let o = 0;
        let slide = 0;
        if (x >= 0 && x <= 1) {
          // outgoing: fade out early while the next panel rises over it
          o = i === last ? 1 : 1 - smoothstep(0.1, 0.7, x);
        } else if (x >= -1 && x < 0) {
          // incoming: content appears as the panel approaches center
          const r = x + 1;
          o = smoothstep(0.3, 0.9, r);
          slide = (1 - r) * 110;
        }
        info.style.opacity = String(o);

        mock.style.opacity = String(o);
        mock.style.transform = `translateX(${slide}px)`;
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
    io.observe(wrap);

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        S.work.p = self.progress;
      },
    });

    return () => {
      io.disconnect();
      stop();
      st.kill();
    };
  }, []);

  return (
    <section ref={section} id="work" className="relative">
      <header className="px-6 pb-10 pt-32 md:px-16">
        <p className="font-tech text-[11px] tracking-[0.35em] text-dim">02 — SELECTED WORK</p>
        <div className="mt-6 flex items-end justify-between gap-6">
          <h2 className="text-outline font-display text-[clamp(3rem,10vw,8rem)] font-black leading-none">
            THE WORK
          </h2>
          <span className="mb-2 font-tech text-xs text-dim">[ 2024—2026 ]</span>
        </div>
      </header>

      <div ref={panels} className="relative">
        {/* single sticky particle layer behind all panels */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="sticky top-0 h-screen">
            <View className="absolute inset-0">
              <WorkParticles />
            </View>
          </div>
        </div>

        {PROJECTS.map((p) => {
          const Mock = MOCKS[p.id];
          return (
            <div
              key={p.id}
              className="work-panel sticky top-0 flex h-screen items-center overflow-hidden px-6 md:px-16"
            >
              <div className="relative z-10 grid w-full items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-10">
                <div className="work-info pointer-events-none will-change-[opacity]">
                  <p className="font-tech text-xs tracking-[0.3em]" style={{ color: "#9a9da6" }}>
                    PROJECT {p.n} / 04
                  </p>
                  <h3 className="text-outline mt-2 font-display text-[clamp(2.4rem,9vw,6rem)] font-black leading-none md:mt-3">
                    {p.name}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm text-dim">{p.tag}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 font-tech text-[10px] tracking-[0.2em] text-dim md:mt-6">
                    <span>YEAR — {p.year}</span>
                    <span>{p.type}</span>
                    <span className="flex gap-2">
                      {p.stack.map((s) => (
                        <span key={s} className="rounded border border-white/15 px-2 py-0.5">
                          {s}
                        </span>
                      ))}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenId(p.id)}
                    className="group mt-5 inline-flex items-center gap-2 font-tech text-[11px] tracking-[0.3em] text-ink/80 transition-colors hover:text-accent md:mt-7"
                  >
                    VIEW CASE STUDY
                    <span aria-hidden className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(p.id)}
                  aria-label={`Open ${p.name} case study`}
                  className="work-mock group block w-full cursor-pointer will-change-[transform,opacity] [perspective:900px]"
                >
                  <div className="origin-center transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02]">
                    <Mock />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {project && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} case study`}
          className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8"
        >
          <button
            type="button"
            aria-label="Close case study"
            tabIndex={-1}
            onClick={() => setOpenId(null)}
            className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
          />
          <div className="relative max-h-full w-full max-w-xl overflow-y-auto rounded-2xl border border-white/12 bg-panel p-6 shadow-2xl md:p-9">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpenId(null)}
              aria-label="Close case study"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 font-tech text-sm text-dim transition-colors hover:border-accent hover:text-accent"
            >
              ✕
            </button>
            <p className="font-tech text-[11px] tracking-[0.35em] text-dim">
              PROJECT {project.n} / 04 — {project.type}
            </p>
            <h3 className="mt-3 font-display text-5xl font-black leading-none md:text-6xl">
              {project.name}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-dim">{project.desc}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded border border-white/15 px-2.5 py-1 font-tech text-[10px] tracking-widest text-ink/90"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 font-tech text-[10px] tracking-[0.25em] text-dim">
              <span>YEAR — {project.year}</span>
              <a
                href={`mailto:hello@novalab.studio?subject=Case study: ${project.name}`}
                className="text-accent transition-opacity hover:opacity-70"
              >
                ASK ABOUT IT ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
