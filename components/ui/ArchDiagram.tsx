"use client";

import React from "react";

type ArchNode = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  w?: number;
  accent?: boolean;
};

type ArchEdge = {
  from: string;
  to: string;
  label?: string;
};

type ArchSpec = {
  title: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
};

const SPECS: Record<string, ArchSpec> = {
  goagri: {
    title: "GOAGRI // SYSTEM ARCHITECTURE",
    nodes: [
      { id: "web", label: "NEXT.JS 16", sub: "BFF · MAPS", x: 16, y: 26 },
      { id: "mob", label: "FLUTTER", sub: "ANDROID FIELD", x: 16, y: 112 },
      { id: "api", label: "NESTJS API", sub: "FASTIFY · KYSELY", x: 174, y: 69, accent: true },
      { id: "db", label: "POSTGIS", sub: "BLOCKS · GIS", x: 332, y: 20 },
      { id: "rag", label: "AI RAG", sub: "SSE STREAM", x: 332, y: 74 },
      { id: "cache", label: "REDIS · S3", sub: "CACHE · MEDIA", x: 332, y: 128 },
    ],
    edges: [
      { from: "web", to: "api" },
      { from: "mob", to: "api" },
      { from: "api", to: "db" },
      { from: "api", to: "rag" },
      { from: "api", to: "cache" },
    ],
  },
  "luwes-station": {
    title: "LUWES STATION // WEATHER & EWS",
    nodes: [
      { id: "st", label: "STATIONS", sub: "AWLR · ARR · AWS", x: 16, y: 69 },
      { id: "tel", label: "TELEMETRY", sub: "INGEST · ALARMS", x: 174, y: 30, accent: true },
      { id: "api", label: "SERVICE API", sub: "NESTJS · CSV", x: 174, y: 112 },
      { id: "db", label: "TIMESCALEDB", sub: "POSTGIS · DAS", x: 332, y: 30 },
      { id: "ui", label: "WEB + FLUTTER", sub: "PWA · 120HZ", x: 332, y: 112 },
    ],
    edges: [
      { from: "st", to: "tel" },
      { from: "tel", to: "db" },
      { from: "db", to: "api" },
      { from: "api", to: "ui" },
    ],
  },
  rajaderek: {
    title: "RAJADEREK // SPATIAL ROUTING CORE",
    nodes: [
      { id: "ui", label: "LEAFLET UI", sub: "DISPATCH MAP", x: 16, y: 69 },
      { id: "gw", label: "TS GATEWAY", sub: "AUTH · GRPC", x: 146, y: 69 },
      { id: "go", label: "GO CORE", sub: "SYNC.POOL", x: 276, y: 69, accent: true },
      { id: "ts", label: "TYPESENSE", sub: "<200MS · 2.8M", x: 406, y: 18 },
      { id: "h3", label: "UBER H3", sub: "O(1) PROXIMITY", x: 406, y: 74 },
      { id: "osrm", label: "OSRM · GIS", sub: "MLD · POSTGIS", x: 406, y: 130 },
    ],
    edges: [
      { from: "ui", to: "gw" },
      { from: "gw", to: "go" },
      { from: "go", to: "ts" },
      { from: "go", to: "h3" },
      { from: "go", to: "osrm" },
    ],
  },
  aiavatar: {
    title: "AI AVATAR // REALTIME VOICE PIPELINE",
    nodes: [
      { id: "un", label: "UNITY C#", sub: "METAPERSON", x: 16, y: 69, accent: true },
      { id: "ws", label: "WEBSOCKET", sub: "AUDIO STREAM", x: 174, y: 69 },
      { id: "stt", label: "STT → LLM", sub: "DOCKER AGENT", x: 332, y: 30 },
      { id: "tts", label: "TTS · LIPSYNC", sub: "OCULUS AUDIO", x: 332, y: 112 },
    ],
    edges: [
      { from: "un", to: "ws" },
      { from: "ws", to: "stt" },
      { from: "stt", to: "tts" },
      { from: "tts", to: "ws" },
    ],
  },
  genset: {
    title: "GENSET // HEXAGONAL WORKER PIPELINE",
    nodes: [
      { id: "cl", label: "FIELD & WEB", sub: "ZOD CONTRACTS", x: 16, y: 69 },
      { id: "api", label: "HONO.JS", sub: "NX HEXAGONAL", x: 174, y: 69, accent: true },
      { id: "db", label: "POSTGRES", sub: "DRIZZLE ORM", x: 332, y: 26 },
      { id: "q", label: "BULLMQ", sub: "PDF · FCM · S3", x: 332, y: 112 },
    ],
    edges: [
      { from: "cl", to: "api" },
      { from: "api", to: "db" },
      { from: "api", to: "q" },
    ],
  },
  casanela: {
    title: "CASANELA // RESERVATION ENGINE",
    nodes: [
      { id: "web", label: "BOOKING WEB", sub: "CASANELAVILLA", x: 16, y: 69 },
      { id: "bun", label: "BUN + HONO", sub: "PRICING CORE", x: 174, y: 69, accent: true },
      { id: "db", label: "POSTGRES", sub: "DRIZZLE ORM", x: 332, y: 22 },
      { id: "ota", label: "BULLMQ OTA", sub: "2-WAY SYNC", x: 332, y: 74 },
      { id: "s3", label: "AWS S3", sub: "PRESIGNED URL", x: 332, y: 126 },
    ],
    edges: [
      { from: "web", to: "bun" },
      { from: "bun", to: "db" },
      { from: "bun", to: "ota" },
      { from: "bun", to: "s3" },
    ],
  },
  llmrouter: {
    title: "LLM ROUTER // 5-DIM INTENT ENGINE",
    nodes: [
      { id: "q", label: "USER QUERY", sub: "FASTAPI", x: 16, y: 69 },
      { id: "cls", label: "DISTILBERT", sub: "5-DIM SCORE", x: 174, y: 69, accent: true },
      { id: "fast", label: "FAST MODEL", sub: "LOW LATENCY", x: 332, y: 30 },
      { id: "pro", label: "FRONTIER LLM", sub: "COMPLEX TASK", x: 332, y: 112 },
    ],
    edges: [
      { from: "q", to: "cls" },
      { from: "cls", to: "fast" },
      { from: "cls", to: "pro" },
    ],
  },
};

export default function ArchDiagram({ id }: { id: string }) {
  const spec = SPECS[id] ?? SPECS.goagri;
  const isWide = spec.nodes.some((n) => n.x > 360);
  const viewW = isWide ? 520 : 464;
  const nodeW = isWide ? 98 : 114;
  const nodeH = 42;

  const byId = new Map(spec.nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full max-w-[560px] overflow-hidden rounded-xl border border-white/10 bg-panel/90 shadow-2xl backdrop-blur-md transition-colors duration-300 group-hover:border-accent/40">
      <div className="flex items-center justify-between border-b border-white/8 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-accent/80" />
          <span className="ml-2.5 font-tech text-[10px] tracking-[0.22em] text-dim">
            {spec.title}
          </span>
        </div>
        <span className="font-tech text-[9px] tracking-[0.2em] text-accent/80">ARCH</span>
      </div>

      <div className="p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${viewW} 188`}
          className="h-44 w-full sm:h-52"
          role="img"
          aria-label={spec.title}
        >
          {/* subtle background grid */}
          <defs>
            <pattern id={`grid-${id}`} width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={viewW} height="188" fill={`url(#grid-${id})`} />

          {/* edges + animated accent data pulse */}
          {spec.edges.map((e, idx) => {
            const a = byId.get(e.from);
            const b = byId.get(e.to);
            if (!a || !b) return null;
            const x1 = a.x + nodeW;
            const y1 = a.y + nodeH / 2;
            const x2 = b.x;
            const y2 = b.y + nodeH / 2;
            const mx = (x1 + x2) / 2;
            const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
            const pathId = `edge-${id}-${idx}`;
            return (
              <g key={pathId}>
                <path id={pathId} d={d} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
                <circle r="2.4" fill="#ff4d00" opacity="0.9">
                  <animateMotion dur={`${2.2 + (idx % 3) * 0.45}s`} repeatCount="indefinite" begin={`${idx * 0.25}s`}>
                    <mpath href={`#${pathId}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}

          {/* nodes */}
          {spec.nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <rect
                width={nodeW}
                height={nodeH}
                rx="6"
                fill={n.accent ? "rgba(255,77,0,0.08)" : "rgba(255,255,255,0.03)"}
                stroke={n.accent ? "rgba(255,77,0,0.55)" : "rgba(255,255,255,0.14)"}
                strokeWidth="1"
              />
              <text
                x={nodeW / 2}
                y="18"
                textAnchor="middle"
                fill={n.accent ? "#ff4d00" : "#f2f1ec"}
                fontSize="9.5"
                fontFamily="var(--font-jetbrains), monospace"
                fontWeight="700"
                letterSpacing="0.08em"
              >
                {n.label}
              </text>
              <text
                x={nodeW / 2}
                y="32"
                textAnchor="middle"
                fill="#9a9ca6"
                fontSize="7.2"
                fontFamily="var(--font-jetbrains), monospace"
                letterSpacing="0.06em"
              >
                {n.sub}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
