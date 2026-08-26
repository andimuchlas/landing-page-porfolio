"use client";

import { useEffect, useRef } from "react";
import { View } from "@react-three/drei";
import { ScrollTrigger } from "@/lib/gsap";
import { S } from "@/lib/state";
import { segment, clamp01 } from "@/lib/utils";
import ServicesScene from "@/components/experience/scenes/ServicesObjects";

const SERVICES = [
  {
    n: "01",
    title: ["SPATIAL", "SYSTEMS"],
    tags: ["GIS", "UBER H3", "OSRM", "POSTGIS"],
    desc: "Routing engines, geospatial ETL and hexagonal indexing — making the physical world computable.",
  },
  {
    n: "02",
    title: ["HIGH-THROUGHPUT", "APIS"],
    tags: ["GRPC", "BUN", "HONO", "REDIS"],
    desc: "Low-latency gateways engineered for concurrent load.",
  },
  {
    n: "03",
    title: ["DISTRIBUTED", "SYSTEMS"],
    tags: ["NATS", "BULLMQ", "KUBERNETES", "DOCKER"],
    desc: "Async pipelines and microservices that fail gracefully.",
  },
  {
    n: "04",
    title: ["INTELLIGENT", "ROUTING"],
    tags: ["LLM", "PYTORCH", "DISTILBERT", "FASTAPI"],
    desc: "Model orchestration that balances cost against latency.",
  },
];

export default function Services() {
  const section = useRef<HTMLElement>(null);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;

    let raf = 0;
    let running = false;
    const tick = () => {
      const p = S.services.p;
      const { idx, frac } = segment(p, SERVICES.length);
      blocks.current.forEach((b, i) => {
        if (!b) return;
        let o = 0;
        let ty = 0;
        if (i === idx) {
          o = 1 - frac;
          ty = -44 * frac;
        } else if (i === idx + 1) {
          o = frac;
          ty = 44 * (1 - frac);
        }
        b.style.opacity = String(o);
        b.style.transform = `translateY(${ty}px)`;
      });
      if (rail.current) {
        rail.current.style.transform = `scaleY(${clamp01(p)})`;
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
        S.services.p = self.progress;
      },
    });

    return () => {
      io.disconnect();
      stop();
      st.kill();
    };
  }, []);

  return (
    <section ref={section} id="services" className="relative h-[480vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <View className="absolute inset-0">
          <ServicesScene />
        </View>

        {/* progress rail */}
        <div className="absolute right-6 top-1/2 z-10 hidden h-56 w-px -translate-y-1/2 bg-white/10 md:right-10 md:block">
          <div
            ref={rail}
            className="h-full w-full origin-top bg-accent"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        {/* stacked text blocks */}
        <div className="pointer-events-none relative z-10 flex h-full items-center px-6 md:px-16">
          <div className="relative h-[300px] w-full max-w-3xl">
            {SERVICES.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  blocks.current[i] = el;
                }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-outline font-display text-7xl font-black md:text-8xl">
                    {s.n}
                  </span>
                  <h3 className="font-display font-expanded text-[clamp(2.2rem,5.5vw,4.5rem)] leading-none">
                    {s.title[0]}
                    <br />
                    <span className="text-chrome">{s.title[1]}</span>
                  </h3>
                </div>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-dim">
                  {s.desc}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/15 bg-black/50 px-3 py-1 font-tech text-[11px] tracking-wider text-ink/90 backdrop-blur"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="absolute bottom-8 left-6 z-10 font-tech text-[11px] tracking-[0.35em] text-dim md:left-16">
          01 — EXPERTISE
        </p>
      </div>
    </section>
  );
}
