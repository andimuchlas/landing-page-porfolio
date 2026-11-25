"use client";

import { EXPERIENCE } from "@/lib/content";

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative z-10 border-t border-white/8 bg-bg/85 px-6 py-28 backdrop-blur-sm md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-tech text-[11px] tracking-[0.35em] text-dim">
          04 — EXPERIENCE
        </p>
        <div className="mt-4 flex items-end justify-between gap-6">
          <h2 className="font-display font-expanded text-4xl leading-none md:text-6xl">
            TRACK <span className="text-chrome">RECORD.</span>
          </h2>
          <span className="mb-1 hidden font-tech text-xs text-dim sm:block">
            [ 2023 — PRESENT ]
          </span>
        </div>

        <div className="mt-12 divide-y divide-white/8 border-y border-white/8">
          {EXPERIENCE.map((item) => (
            <div
              key={item.company}
              className="group grid gap-4 py-7 transition-colors md:grid-cols-12 md:items-baseline"
            >
              <div className="md:col-span-3">
                <p className="font-tech text-[11px] tracking-[0.2em] text-accent">
                  {item.period}
                </p>
                <p className="mt-1 font-tech text-[9px] tracking-[0.25em] text-dim">
                  {item.type}
                </p>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-display text-lg font-extrabold tracking-tight text-ink transition-colors group-hover:text-accent md:text-xl">
                  {item.company}
                </h3>
                <p className="mt-1 font-tech text-[11px] text-dim">
                  {item.role}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-dim md:col-span-5">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
