"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/state";

/* ------------------------------ micro-viz ------------------------------ */

function DiscoverViz() {
  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10">
        <div className="anim-rot absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(255,77,0,0.5), transparent 60deg)",
          }}
        />
        <span className="anim-pulse-dot absolute left-[30%] top-[38%] h-1 w-1 rounded-full bg-green-400" />
        <span className="anim-pulse-dot absolute left-[62%] top-[64%] h-1 w-1 rounded-full bg-accent" />
      </div>
    </div>
  );
}

function DefineViz() {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 px-6 font-tech text-[10px] tracking-widest text-dim">
      {["SCOPE LOCKED", "RISK MAPPED", "KPI DEFINED"].map((t, i) => (
        <div key={t} className="flex items-center gap-2">
          <span className={i === 1 ? "text-accent" : "text-green-400"}>✓</span>
          <span className={i === 2 ? "opacity-50" : ""}>{t}</span>
        </div>
      ))}
    </div>
  );
}

function DesignViz() {
  return (
    <div className="relative h-full">
      <div className="anim-xf-a absolute inset-4 rounded border border-dashed border-white/25" />
      <div className="anim-xf-b absolute inset-4 rounded border border-accent/60 bg-accent/10 p-2">
        <div className="h-1.5 w-8 bg-accent" />
        <div className="mt-2 h-1 w-full bg-white/20" />
        <div className="mt-1 h-1 w-3/4 bg-white/20" />
      </div>
    </div>
  );
}

function BuildViz() {
  return (
    <div className="h-full px-6 py-4 font-tech text-[9px] leading-relaxed">
      <div><span className="text-accent">const</span> <span className="text-white/80">app =</span> <span className="text-white/40">forge(</span><span className="text-green-400">{"'nova'"}</span><span className="text-white/40">)</span></div>
      <div className="mt-1 h-1 w-2/3 rounded bg-white/15" />
      <div className="mt-1.5 h-1 w-1/2 rounded bg-white/15" />
      <div className="mt-1.5 h-1 w-3/4 rounded bg-white/15" />
      <span className="anim-blink text-accent">▌</span>
    </div>
  );
}

function ShipViz() {
  return (
    <div className="flex h-full flex-col justify-center px-6">
      <div className="flex justify-between font-tech text-[9px] tracking-widest text-dim">
        <span>BUILD #4821</span>
        <span className="text-green-400">DEPLOYED ✓</span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded bg-white/10">
        <div className="anim-loopbar h-full rounded bg-accent" />
      </div>
    </div>
  );
}

function EvolveViz() {
  return (
    <div className="flex h-full items-center px-4">
      <svg viewBox="0 0 160 48" className="w-full">
        <polyline
          points="0,40 20,34 40,36 60,22 80,26 100,14 120,18 140,8 160,12"
          fill="none"
          stroke="#86efac"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="anim-dash"
        />
      </svg>
    </div>
  );
}

/* ------------------------------- stages ------------------------------- */

const STAGES = [
  { n: "01", title: "DISCOVER", blurb: "Audits, constraints and hard questions before any architecture.", viz: <DiscoverViz /> },
  { n: "02", title: "DEFINE", blurb: "Scope, risks, SLIs. A plan that survives contact with reality.", viz: <DefineViz /> },
  { n: "03", title: "DESIGN", blurb: "Domain models and contracts before a single endpoint ships.", viz: <DesignViz /> },
  { n: "04", title: "BUILD", blurb: "Code becomes product. Sprints ship working software.", viz: <BuildViz /> },
  { n: "05", title: "SHIP", blurb: "Pipelines, observability, zero-drama deployments.", viz: <ShipViz /> },
  { n: "06", title: "EVOLVE", blurb: "Metrics in, improvements out. The system learns.", viz: <EvolveViz /> },
];

export default function Process() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const tr = track.current;
    if (!el || !tr) return;

    const ctx = gsap.context(() => {
      const getDist = () => Math.max(0, tr.scrollWidth - window.innerWidth);
      const scrollTween = gsap.to(tr, {
        x: () => -getDist(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${getDist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".stage-card").forEach((card) => {
        const rm = prefersReducedMotion();
        gsap.fromTo(
          card.querySelectorAll(".stage-reveal"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: rm ? 0 : 0.8,
            stagger: rm ? 0 : 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="process" className="relative overflow-hidden bg-bg py-0">
      <div className="flex h-screen flex-col justify-center">
        <div className="px-6 pb-10 md:px-16">
          <p className="font-tech text-[11px] tracking-[0.35em] text-dim">03 — HOW WE BUILD</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] font-expanded leading-none">
            SIX STAGES. <span className="text-chrome">ONE SYSTEM.</span>
          </h2>
        </div>

        <div
          ref={track}
          className="flex w-max gap-6 pl-6 pr-[12vw] will-change-transform md:pl-16"
        >
          {STAGES.map((s) => (
            <article
              key={s.n}
              className="stage-card flex h-[54vh] w-[78vw] shrink-0 flex-col justify-between rounded-2xl border border-white/8 bg-panel/70 p-7 backdrop-blur-sm sm:w-[420px]"
            >
              <div className="stage-reveal flex items-center justify-between">
                <span className="text-outline font-display text-5xl font-black">{s.n}</span>
                <span className="font-tech text-[10px] tracking-[0.3em] text-dim">
                  PHASE {s.n}
                </span>
              </div>
              <div>
                <h3 className="stage-reveal font-display text-3xl font-expanded">{s.title}</h3>
                <p className="stage-reveal mt-3 max-w-xs text-sm leading-relaxed text-dim">
                  {s.blurb}
                </p>
              </div>
              <div className="stage-reveal h-28 rounded-lg border border-white/5 bg-black/40">
                {s.viz}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
