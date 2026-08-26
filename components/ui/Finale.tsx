"use client";

import { useEffect, useRef } from "react";
import { View } from "@react-three/drei";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { S, prefersReducedMotion } from "@/lib/state";
import { smoothstep, lerp } from "@/lib/utils";
import { scrollTo } from "@/components/SmoothScroll";
import { LINKS } from "@/lib/content";
import MagneticButton from "@/components/fx/MagneticButton";
import MachineAssembly from "@/components/experience/scenes/MachineAssembly";

function MachineSection() {
  const section = useRef<HTMLElement>(null);
  const lockup = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        S.machine.p = self.progress;
      },
    });

    let raf = 0;
    let running = false;
    const tick = () => {
      const p = S.machine.p;
      if (lockup.current) {
        const t = smoothstep(0.84, 1, p);
        lockup.current.style.opacity = String(t);
        lockup.current.style.letterSpacing = `${lerp(0.6, 0.14, t)}em`;
        lockup.current.style.transform = `translateX(-50%) scale(${lerp(0.92, 1, t)})`;
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

    return () => {
      io.disconnect();
      stop();
      st.kill();
    };
  }, []);

  return (
    <section ref={section} id="machine" className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <View className="absolute inset-0">
          <MachineAssembly />
        </View>

        <p className="pointer-events-none absolute left-8 top-24 z-10 font-tech text-[10px] tracking-[0.35em] text-dim">
          06 — THE MACHINE
        </p>
        <p className="pointer-events-none absolute left-8 top-28 z-10 font-tech text-[10px] tracking-[0.2em] text-dim/80">
          DIFFERENT DISCIPLINES → ONE SYSTEM
        </p>

        <div
          ref={lockup}
          className="pointer-events-none absolute bottom-16 left-1/2 z-10 -translate-x-1/2 text-center opacity-0"
        >
          <div className="font-display font-expanded text-[clamp(1.6rem,4vw,3.2rem)]">
            ANDI<span className="text-accent">{'//'}</span>MUCHLAS
          </div>
          <div className="mt-3 font-tech text-[10px] tracking-[0.5em] text-dim">
            BUILD SOMETHING WORTH REMEMBERING.
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const rm = prefersReducedMotion();
      gsap.fromTo(
        ".cta-line",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: rm ? 0 : 1.2,
          stagger: rm ? 0 : 0.12,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none reverse" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
      <p className="mb-8 font-tech text-[11px] tracking-[0.35em] text-dim">
        [ READY WHEN YOU ARE ]
      </p>
      <h2 className="font-display font-expanded text-[clamp(2.8rem,9vw,7.5rem)] leading-[0.95]">
        <span className="cta-line block">HAVE A PROJECT?</span>
        <span className="cta-line block text-chrome">
          LET&apos;S BUILD IT<span className="text-accent">.</span>
        </span>
      </h2>
      <MagneticButton
        href="mailto:andimuchlas156@gmail.com?subject=Project%20Inquiry"
        className="group mt-14 rounded-full border border-accent px-10 py-4 font-tech text-xs tracking-[0.3em] text-accent transition-colors duration-300 hover:bg-accent hover:text-black"
      >
        START A PROJECT →
      </MagneticButton>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/8 px-6 py-7 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 font-tech text-[10px] tracking-[0.2em] text-dim md:flex-row md:items-center md:justify-between">
        <span>© 2026 ANDI MUCHLAS</span>

        <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={`mailto:${LINKS.email}`}
            className="text-ink/80 transition-colors hover:text-accent"
          >
            EMAIL ↗
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-ink/80 transition-colors hover:text-accent"
          >
            LINKEDIN ↗
          </a>
          <a
            href={LINKS.website}
            target="_blank"
            rel="noreferrer"
            className="text-ink/80 transition-colors hover:text-accent"
          >
            ANDI.IS-A.DEV ↗
          </a>
          <button
            type="button"
            onClick={() => scrollTo("#hero")}
            className="text-dim transition-colors hover:text-accent"
          >
            BACK TO TOP ↑
          </button>
        </span>
      </div>
    </footer>
  );
}

export default function Finale() {
  return (
    <>
      <MachineSection />
      <CTA />
      <Footer />
    </>
  );
}
