"use client";

import { useEffect, useState } from "react";
import { lockPageScroll, scrollTo } from "@/components/SmoothScroll";

const LINKS = [
  { label: "SERVICES", href: "#services" },
  { label: "WORK", href: "#work" },
  { label: "PROCESS", href: "#process" },
  { label: "GAME", href: "#game" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    // unlock synchronously — lenis ignores scrollTo() while stopped
    lockPageScroll(false);
    scrollTo(href);
  };

  useEffect(() => {
    lockPageScroll(open);
    return () => lockPageScroll(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <nav className="flex items-center justify-between px-6 py-5 md:px-10">
          <a
            href="#hero"
            onClick={(e) => go(e, "#hero")}
            className="flex items-center gap-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/image/Logo.png" alt="" className="h-9 w-auto" />
            <span className="font-tech text-sm font-bold tracking-[0.25em] text-white">
              NOVA<span className="text-accent">{"//"}</span>LAB
            </span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  className="group relative font-tech text-[11px] tracking-[0.2em] text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-6 bg-white transition-transform duration-300 ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-white transition-transform duration-300 ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* mobile menu overlay */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-bg/95 px-8 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <p className="mb-10 font-tech text-[11px] tracking-[0.35em] text-dim">
          NAVIGATION
        </p>
        <ul className="space-y-7">
          {LINKS.map((l, i) => (
            <li
              key={l.href}
              className={`transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
            >
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="group flex items-baseline gap-4 font-display font-expanded text-4xl text-ink transition-colors hover:text-accent"
              >
                <span className="font-tech text-xs tracking-[0.3em] text-dim">
                  0{i + 1}
                </span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div
          className={`mt-12 transition-opacity delay-300 duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          <a
            href="#hero"
            onClick={(e) => go(e, "#hero")}
            className="rounded-full border border-accent px-6 py-2.5 font-tech text-[11px] tracking-[0.25em] text-accent"
          >
            START A PROJECT →
          </a>
        </div>
      </div>
    </>
  );
}
