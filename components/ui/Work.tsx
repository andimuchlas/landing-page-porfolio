"use client";

import { useEffect, useRef, useState } from "react";
import { View } from "@react-three/drei";
import { ScrollTrigger } from "@/lib/gsap";
import { S } from "@/lib/state";
import { clamp01, smoothstep } from "@/lib/utils";
import { lockPageScroll } from "@/components/SmoothScroll";
import { ARCHIVE, FEATURED, findProject, LINKS } from "@/lib/content";
import WorkParticles from "@/components/experience/scenes/WorkParticles";

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

function RajaderekMock() {
  return (
    <WindowFrame title="RAJADEREK // DISPATCH">
      <div className="flex">
        <div className="relative min-w-0 flex-1 p-3 sm:p-4">
          {/* city map */}
          <svg viewBox="0 0 220 150" className="h-36 w-full sm:h-48">
            {[
              [20, 0, 20, 150], [60, 0, 55, 150], [110, 0, 118, 150], [160, 0, 168, 150],
              [0, 30, 220, 22], [0, 75, 220, 80], [0, 120, 220, 128],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff14" strokeWidth="1" />
            ))}
            {/* route */}
            <polyline
              points="28,132 62,78 118,84 168,38"
              fill="none"
              stroke="#ff4d00"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              className="anim-dash"
            />
            {/* h3 hexes near destination */}
            <polygon points="168,26 178,32 178,44 168,50 158,44 158,32" fill="none" stroke="#86efac66" strokeWidth="1" />
            {/* drivers */}
            <circle cx="28" cy="132" r="3" fill="#ff4d00" className="anim-pulse-dot" />
            <circle cx="62" cy="78" r="2.5" fill="#86efac" />
            <circle cx="168" cy="38" r="2.5" fill="#ffffff88" />
            <circle cx="160" cy="112" r="2.5" fill="#86efac" />
          </svg>
          <div className="absolute left-4 top-4 hidden font-tech text-[9px] leading-relaxed tracking-widest text-dim sm:block">
            GRID -6.21 / 106.84<br />H3 RES 9 · O(1)
          </div>
          <div className="mt-2 flex gap-4 font-tech text-[9px] tracking-widest text-dim">
            <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" />UNIT</span>
            <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#86efac]" />DRIVER</span>
            <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-white/40" />JOB</span>
          </div>
        </div>
        <div className="hidden w-32 shrink-0 space-y-3 border-l border-white/8 p-4 sm:block">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-white/8 bg-black/30 p-2 text-center">
              <div className="font-display text-sm font-bold text-chrome">24</div>
              <div className="mt-0.5 font-tech text-[8px] tracking-widest text-dim">UNITS</div>
            </div>
            <div className="rounded-lg border border-white/8 bg-black/30 p-2 text-center">
              <div className="font-display text-sm font-bold text-chrome">~7m</div>
              <div className="mt-0.5 font-tech text-[8px] tracking-widest text-dim">ETA</div>
            </div>
          </div>
          {[["JOB #042", "MATCHED"], ["JOB #041", "EN ROUTE"], ["JOB #040", "DONE"], ["JOB #039", "DONE"]].map(([id, st], i) => (
            <div key={id} className="rounded-lg border border-white/8 bg-black/30 p-2">
              <div className="font-tech text-[9px] tracking-wider text-white/80">{id}</div>
              <div className={`mt-1 font-tech text-[8px] tracking-widest ${st === "MATCHED" ? "text-accent" : st === "EN ROUTE" ? "text-green-400" : "text-dim"}`}>
                {st === "MATCHED" ? "▸ MATCHED" : st === "EN ROUTE" ? "▸ EN ROUTE" : "✓ DONE"}
              </div>
              {i === 0 && <div className="mt-1.5 h-0.5 overflow-hidden rounded bg-white/10"><div className="anim-loopbar h-full bg-accent" /></div>}
            </div>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
}

function AiAvatarMock() {
  return (
    <WindowFrame title="AI AVATAR // REAL-TIME SYSTEM">
      <div className="space-y-2.5 p-3 sm:p-4">
        {/* Voice pipeline flow */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {[
            { label: "VOICE STT", sub: "STREAM INGEST" },
            { label: "LLM INFERENCE", sub: "STREAM TOKENS" },
            { label: "TTS + LIP-SYNC", sub: "AUDIO & VISEMES" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="relative rounded-lg border border-white/8 bg-black/30 p-2 text-center"
            >
              <div className="flex items-center justify-center gap-1.5">
                <span className="anim-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="font-tech text-[8px] font-bold tracking-wider text-white/90 sm:text-[9px]">
                  {s.label}
                </span>
              </div>
              <div className="mt-1 font-tech text-[7px] tracking-widest text-dim sm:text-[8px]">
                {s.sub}
              </div>
              {i < 2 && (
                <span
                  aria-hidden
                  className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 font-tech text-[9px] text-accent/60 sm:block"
                >
                  ▸
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Real-time Viseme & Audio Waveform */}
        <div className="rounded-lg border border-white/8 bg-black/30 p-2.5 sm:p-3">
          <div className="flex items-center justify-between font-tech text-[9px] tracking-widest text-dim">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
              OCULUS LIPSYNC · METAPERSON
            </span>
            <span className="text-white/70">60 FPS · REALTIME</span>
          </div>

          {/* Audio Waveform visualization */}
          <div className="mt-2.5 flex h-9 items-end justify-between gap-1 px-1">
            {[
              28, 48, 70, 88, 45, 95, 100, 75, 40, 58, 82, 98, 65, 42, 78, 90,
              52, 68, 35, 72, 88, 50, 94, 62, 38, 80, 54, 30,
            ].map((height, i) => (
              <span
                key={i}
                className="w-full rounded-full bg-gradient-to-t from-accent/30 via-accent to-white/90"
                style={{
                  height: `${height}%`,
                  opacity: 0.35 + (height / 100) * 0.65,
                }}
              />
            ))}
          </div>

          {/* Viseme indicators */}
          <div className="mt-2.5 flex items-center justify-between border-t border-white/6 pt-2 font-tech text-[8px] tracking-wider text-dim">
            <span>VISEME TARGETS:</span>
            <div className="flex gap-1 sm:gap-1.5">
              {[
                { name: "sil", on: false },
                { name: "aa", on: true },
                { name: "ee", on: false },
                { name: "ih", on: true },
                { name: "oh", on: false },
                { name: "ou", on: false },
              ].map((v) => (
                <span
                  key={v.name}
                  className={`rounded px-1.5 py-0.5 uppercase ${
                    v.on
                      ? "border border-accent/60 bg-accent/20 font-bold text-accent"
                      : "border border-white/8 bg-white/4 text-dim/60"
                  }`}
                >
                  {v.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry metrics */}
        <div className="grid grid-cols-3 gap-2">
          {[
            ["<15ms", "WS LATENCY"],
            ["DOCKER", "BACKEND POD"],
            ["UNITY 3D", "CLIENT ENGINE"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-lg border border-white/8 bg-black/30 p-2 text-center">
              <div className="font-tech text-[10px] font-bold tracking-wider text-chrome sm:text-xs">
                {v}
              </div>
              <div className="mt-0.5 font-tech text-[8px] tracking-widest text-dim">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
}

function GensetMock() {
  return (
    <WindowFrame title="GENSET // PIPELINE">
      <div className="space-y-2 p-3 sm:p-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            ["142", "QUEUE DEPTH"],
            ["06", "WORKERS"],
            ["99.98%", "UPTIME"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-lg border border-white/8 bg-black/30 p-2 sm:p-3">
              <div className="font-display text-base font-bold text-chrome sm:text-lg">{v}</div>
              <div className="mt-1 font-tech text-[9px] tracking-widest text-dim">{l}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-1">
          {[
            ["PDF BAST · E-SIGN", "done", "w-full"],
            ["FCM PUSH ALERTS", "run", "w-2/3"],
            ["XLSX FINANCIAL EXPORT", "queued", "w-0"],
          ].map(([label, state, w]) => (
            <div key={label as string} className="flex items-center gap-3 rounded-lg border border-white/8 bg-black/30 px-3 py-2">
              <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                state === "done" ? "bg-green-400" : state === "run" ? "anim-pulse-dot bg-accent" : "bg-white/25"
              }`} />
              <span className="min-w-0 flex-1 truncate font-tech text-[9px] tracking-wider text-white/80">
                {label}
              </span>
              <span className="hidden h-1 w-16 overflow-hidden rounded bg-white/10 sm:block">
                {state === "run" ? (
                  <span className={`anim-loopbar block h-full bg-accent ${w}`} style={{ width: "66%" }} />
                ) : (
                  <span className={`block h-full rounded bg-white/20 ${state === "done" ? "w-full" : "w-0"}`} />
                )}
              </span>
              <span className={`shrink-0 font-tech text-[8px] tracking-widest ${
                state === "done" ? "text-green-400" : state === "run" ? "text-accent" : "text-dim"
              }`}>
                {state === "done" ? "✓ DONE" : state === "run" ? "RUNNING" : "QUEUED"}
              </span>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 200 28" className="h-7 w-full pt-1">
          <polyline
            points="0,22 18,18 36,20 54,12 72,15 90,9 108,13 126,7 144,11 162,6 180,9 200,4"
            fill="none"
            stroke="#c4b5fd"
            strokeWidth="1.2"
            strokeDasharray="5 4"
            className="anim-dash"
          />
        </svg>
      </div>
    </WindowFrame>
  );
}

function CasanelaMock() {
  return (
    <WindowFrame title="CASANELA // RESERVATION">
      <div className="flex flex-col sm:flex-row">
        <div className="p-3 sm:flex-1 sm:p-4">
          {/* availability calendar */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }).map((_, d) => {
              const booked = [3, 4, 5, 11, 12, 17, 18, 19, 20, 24].includes(d);
              const today = d === 8;
              return (
                <span
                  key={d}
                  className={`aspect-square rounded-sm border text-center font-tech text-[7px] leading-[1.6] ${
                    today
                      ? "border-accent text-accent"
                      : booked
                        ? "border-transparent bg-accent/25 text-white/70"
                        : "border-white/8 text-white/35"
                  }`}
                >
                  {d + 1}
                </span>
              );
            })}
          </div>
          <div className="mt-3 flex gap-4 font-tech text-[9px] tracking-widest text-dim">
            <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-sm bg-accent/60" />BOOKED</span>
            <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-sm border border-accent" />TODAY</span>
          </div>
        </div>
        <div className="space-y-2 border-t border-white/8 p-3 sm:w-44 sm:border-l sm:border-t-0 sm:p-4">
          <div>
            <div className="font-display text-xl font-bold text-chrome">0.8<span className="text-sm">ms</span></div>
            <div className="font-tech text-[9px] tracking-widest text-dim">P95 LATENCY — BUN</div>
          </div>
          {[
            ["HOTELMU SYNC", "SYNCED", true],
            ["OTA CHANNELS", "PULLING", false],
            ["BOOKING TIMEOUT", "ARMED", false],
          ].map(([l, s, ok]) => (
            <div key={l as string} className="flex items-center justify-between gap-2">
              <span className="font-tech text-[9px] tracking-wider text-white/70">{l}</span>
              <span className={`font-tech text-[8px] tracking-widest ${ok ? "text-green-400" : "text-accent"}`}>{ok ? "✓ SYNCED" : s === "PULLING" ? "◂ PULLING" : "▸ ARMED"}</span>
            </div>
          ))}
          <div className="h-1 overflow-hidden rounded bg-white/10">
            <div className="anim-loopbar h-full bg-accent" />
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function LlmRouterMock() {
  const tiers = [
    ["CHEAP MODELS", 68, "w-[68%]", "bg-white/30"],
    ["MID TIER", 22, "w-[22%]", "bg-[#c4b5fd]"],
    ["FRONTIER LLMS", 10, "w-[10%]", "bg-accent"],
  ] as const;
  return (
    <WindowFrame title="ROUTER // ORCHESTRATION">
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-black/30 p-2.5">
          <span className="anim-blink font-tech text-[10px] tracking-wider text-white/80">
            query ▸ classify(5 dims)
          </span>
          <span className="ml-auto font-tech text-[8px] tracking-widest text-green-400">DISTILBERT ✓</span>
        </div>
        <div className="mx-auto my-2 h-3 w-px bg-gradient-to-b from-white/30 to-accent/60" />
        <div className="space-y-2">
          {tiers.map(([name, pct, w, color]) => (
            <div key={name}>
              <div className="mb-1 flex justify-between font-tech text-[9px] tracking-widest text-dim">
                <span>{name}</span>
                <span className="text-white/70">{pct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded bg-white/8">
                <div className={`h-full rounded ${color} ${w}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["−72%", "COST"],
            ["FALLBACK", "STATE-MACHINE"],
            ["MULTILINGUAL", "COVERAGE"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-lg border border-white/8 bg-black/30 p-2 text-center">
              <div className="font-tech text-[10px] font-bold tracking-wider text-chrome">{v}</div>
              <div className="mt-0.5 font-tech text-[8px] tracking-widest text-dim">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
}

function GoAgriMock() {
  return (
    <WindowFrame title="GOAGRI · PLANTATION GIS">
      <div className="flex h-full flex-col justify-between p-4 font-tech text-[10px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-dim">
          <span>BLOCK MAP · POSTGIS</span>
          <span className="text-accent">AI RAG · ACTIVE</span>
        </div>
        <div className="my-3 grid grid-cols-3 gap-2">
          {[
            ["BLOCKS", "MAPPED"],
            ["MOBILE", "FLUTTER"],
            ["API", "NESTJS BFF"],
          ].map(([k, v]) => (
            <div key={k} className="border border-white/10 bg-white/[0.02] p-2">
              <div className="text-[8px] text-dim">{k}</div>
              <div className="mt-1 font-bold text-ink">{v}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-[9px] text-dim">
          <span>luwesagri.com</span>
          <span className="text-ink">FIELD TRACKING · SCHEDULE</span>
        </div>
      </div>
    </WindowFrame>
  );
}

function LuwesStationMock() {
  return (
    <WindowFrame title="LUWES STATION · EWS">
      <div className="flex h-full flex-col justify-between p-4 font-tech text-[10px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-dim">
          <span>WATERSHED · AWLR / ARR / AWS</span>
          <span className="text-accent">TELEMETRY OK</span>
        </div>
        <div className="my-3 grid grid-cols-3 gap-2">
          {[
            ["STATIONS", "REALTIME"],
            ["MAPS", "CACHED"],
            ["EXPORT", "CSV + PWA"],
          ].map(([k, v]) => (
            <div key={k} className="border border-white/10 bg-white/[0.02] p-2">
              <div className="text-[8px] text-dim">{k}</div>
              <div className="mt-1 font-bold text-ink">{v}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-[9px] text-dim">
          <span>station.luwesinovasimandiri.com</span>
          <span className="text-ink">ALARMS · DAS</span>
        </div>
      </div>
    </WindowFrame>
  );
}

const MOCKS: Record<string, () => React.ReactElement> = {
  goagri: GoAgriMock,
  "luwes-station": LuwesStationMock,
  rajaderek: RajaderekMock,
  aiavatar: AiAvatarMock,
  genset: GensetMock,
  casanela: CasanelaMock,
  llmrouter: LlmRouterMock,
};

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
          const Mock = MOCKS[p.id];
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
                    <Mock />
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
