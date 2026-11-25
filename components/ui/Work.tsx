"use client";

import { useEffect, useRef, useState } from "react";
import { View } from "@react-three/drei";
import { ScrollTrigger } from "@/lib/gsap";
import { S } from "@/lib/state";
import { clamp01, smoothstep } from "@/lib/utils";
import { lockPageScroll } from "@/components/SmoothScroll";
import { ARCHIVE, FEATURED, findProject, LINKS } from "@/lib/content";
import WorkParticles from "@/components/experience/scenes/WorkParticles";

import ArchDiagram from "@/components/ui/ArchDiagram";

/* ------------------------------ section ------------------------------ */

export default function Work() {
  const section = useRef<HTMLElement>(null);
  const panels = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const project = openId ? findProject(openId) : null;

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
    const count = FEATURED.length;
    const last = count - 1;

    // content opacity is a pure function of S.work.p — fully scrub-reversible.
    // Panels stack via sticky; the moment the next project starts rising, the
    // previous one fades out — no double-content overlap.
    let raf = 0;
    let running = false;
    const tick = () => {
      const g = clamp01(S.work.p) * (count - 1);
      for (let i = 0; i < count; i++) {
        const info = infos[i];
        const mock = mocks[i];
        if (!info || !mock) continue;

        const x = g - i; // 0 = stuck & current, 1 = fully covered, -1..0 = rising in
        let o = 0;
        let slide = 0;
        if (x >= 0 && x <= 1) {
          o = i === last ? 1 : 1 - smoothstep(0.1, 0.7, x);
        } else if (x >= -1 && x < 0) {
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
          <span className="mb-2 font-tech text-xs text-dim">[ FEATURED SYSTEMS ]</span>
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

        {FEATURED.map((p) => {
          return (
            <div
              key={p.id}
              className="work-panel sticky top-0 flex h-screen items-center overflow-hidden px-6 md:px-16"
            >
              <div className="relative z-10 grid w-full items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-10">
                <div className="work-info pointer-events-none will-change-[opacity]">
                  <p className="font-tech text-xs tracking-[0.3em]" style={{ color: "#9a9da6" }}>
                    PROJECT {p.index} / {String(FEATURED.length).padStart(2, "0")}
                  </p>
                  <h3 className="text-outline mt-2 font-display text-[clamp(2.4rem,9vw,6rem)] font-black leading-none md:mt-3">
                    {p.name}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm text-dim">{p.tag}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 font-tech text-[10px] tracking-[0.2em] text-dim md:mt-6">
                    <span>{p.role}</span>
                    <span>{p.status}</span>
                    <span className="flex gap-2">
                      {p.stack.slice(0, 4).map((s) => (
                        <span key={s} className="rounded border border-white/15 px-2 py-0.5">
                          {s}
                        </span>
                      ))}
                      {p.stack.length > 4 && (
                        <span className="rounded border border-white/15 px-2 py-0.5">
                          +{p.stack.length - 4}
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenId(p.id)}
                    className="group pointer-events-auto mt-5 inline-flex items-center gap-2 font-tech text-[11px] tracking-[0.3em] text-ink/80 transition-colors hover:text-accent md:mt-7"
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
                    <ArchDiagram id={p.id} />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* archive grid — below main featured builds */}
      <div className="relative z-10 border-y border-white/8 bg-bg/70 px-6 py-24 backdrop-blur-sm md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="font-tech text-[11px] tracking-[0.35em] text-dim">
            02A — ARCHIVE
          </p>
          <div className="mt-4 flex items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-expanded leading-none md:text-6xl">
              MORE <span className="text-chrome">BUILDS.</span>
            </h2>
            <span className="mb-1 hidden font-tech text-xs text-dim sm:block">
              [ GAMES · INSTALLATIONS · TOOLS ]
            </span>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ARCHIVE.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpenId(p.id)}
                className="group rounded-xl border border-white/8 bg-panel/60 p-6 text-left backdrop-blur transition-colors duration-300 hover:border-accent/60"
              >
                <div className="flex items-start justify-between">
                  <span className="text-outline font-display text-3xl font-black">
                    {p.index}
                  </span>
                  <span
                    aria-hidden
                    className="font-tech text-sm text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                  >
                    ↗
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-expanded">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dim">{p.tag}</p>
                <p className="mt-4 font-tech text-[9px] tracking-[0.25em] text-dim/90">
                  {p.type}
                </p>
              </button>
            ))}
          </div>

          <p className="mt-8 font-tech text-[10px] tracking-[0.25em] text-dim">
            MOST PRODUCTION CODE IS PRIVATE — FULL WALKTHROUGHS AVAILABLE ON
            REQUEST.
          </p>
        </div>
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
              {project.collection === "featured"
                ? `PROJECT ${project.index} / ${String(FEATURED.length).padStart(2, "0")}`
                : `ARCHIVE ${project.index}`}
              {" — "}
              {project.type}
            </p>
            <h3 className="mt-3 font-display text-4xl font-black leading-none md:text-6xl">
              {project.name}
            </h3>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-tech text-[10px] tracking-[0.2em] text-dim">
              <span>{project.role}</span>
              <span className="text-dim/80">{project.status}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-dim">{project.desc}</p>

            {project.highlights.length > 0 && (
              <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-ink/85">
                    <span aria-hidden className="mt-0.5 shrink-0 text-accent">▸</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

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
              <span className="sm:hidden">{project.status}</span>
              {project.link ? (
                <a
                  href={project.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent transition-opacity hover:opacity-70"
                >
                  {project.link.label}
                </a>
              ) : (
                <a
                  href={`mailto:${LINKS.email}?subject=${encodeURIComponent(
                    `Case study: ${project.name}`
                  )}`}
                  className="text-accent transition-opacity hover:opacity-70"
                >
                  ASK ABOUT IT ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
