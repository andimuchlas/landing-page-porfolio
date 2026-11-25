/**
 * Central content for the portfolio — projects, toolbox, certifications, links.
 * Sources: github README (featured engineering work) + legacy DOS portfolio.
 */

export const LINKS = {
  email: "andimuchlas156@gmail.com",
  linkedin: "https://www.linkedin.com/in/andimuchlas/",
  website: "https://andi.is-a.dev",
  gcpProfile:
    "https://www.skills.google/public_profiles/104038eb-cdaa-4a54-8bf4-4d575ae2c783",
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  id: string;
  index: string; // "01".."04" for featured, letters for archive
  collection: "featured" | "archive";
  name: string;
  tag: string;
  desc: string;
  role: string;
  status: string;
  type: string;
  stack: string[];
  highlights: string[];
  link?: ProjectLink;
};

/* ------------------------------- featured ------------------------------- */

export const FEATURED: Project[] = [
  {
    id: "goagri",
    index: "01",
    collection: "featured",
    name: "GOAGRI",
    tag: "Map-based precision agriculture platform.",
    desc: "Plantation management platform spanning web (Next.js BFF), backend (NestJS/Fastify, PostGIS), and Android mobile (Flutter).",
    role: "FULL-STACK & MOBILE ENGINEER",
    status: "PRIVATE / PRODUCTION",
    type: "SPATIAL PLATFORM",
    stack: [
      "NEXT.JS 16",
      "NESTJS",
      "FASTIFY",
      "POSTGIS",
      "KYSELY",
      "REDIS",
      "FLUTTER",
    ],
    highlights: [
      "Built the AI assistant for farmers (streaming chat + RAG knowledge base), discussion forum, broadcast notifications, field tracking, and block-level scheduling.",
      "Delivered Flutter mobile features including native photo watermarking, map views, and smoother daily field workflows.",
      "Overhauled web and mobile UI/UX for consistency, responsiveness, and clear save/error feedback.",
    ],
    link: { label: "LIVE", href: "https://luwesagri.com/" },
  },
  {
    id: "luwes-station",
    index: "02",
    collection: "featured",
    name: "LUWES STATION",
    tag: "Weather station & flood early warning.",
    desc: "Weather station and early-warning monitoring platform for hydrological/weather stations, threshold alarms, and watershed mapping across web, backend, and mobile.",
    role: "FULL-STACK & MOBILE ENGINEER",
    status: "PRIVATE / PRODUCTION",
    type: "WEATHER STATION / EWS",
    stack: [
      "NEXT.JS 16",
      "NESTJS",
      "TIMESCALEDB",
      "POSTGIS",
      "FLUTTER",
      "DART",
    ],
    highlights: [
      "Built the Flutter mobile application from scratch with smooth 120Hz performance, native camera/GPS workflows, and fast cached maps.",
      "Delivered web and API modules including weather catalog, CSV data export, station pinpointing, email broadcasts, password reset, and PWA support.",
      "Refined mobile/desktop views, map tile caching, and API error handling across services.",
    ],
    link: { label: "LIVE", href: "https://station.luwesinovasimandiri.com/" },
  },
  {
    id: "rajaderek",
    index: "03",
    collection: "featured",
    name: "RAJADEREK",
    tag: "Real-time spatial routing & logistics.",
    desc: "Real-time dispatching and routing platform managing on-demand vehicle towing operations — from spatial ingestion to dynamic routing at city scale.",
    role: "LEAD BACKEND & SPATIAL ENGINEER",
    status: "PRIVATE / PRODUCTION SYSTEM",
    type: "SPATIAL PLATFORM",
    stack: [
      "GO",
      "TYPESCRIPT",
      "PYTHON (SCRAPY)",
      "OSRM",
      "UBER H3",
      "POSTGIS",
      "GRPC",
      "REDIS",
      "NATS",
      "KUBERNETES",
    ],
    highlights: [
      "Decoupled into a TypeScript gateway (auth & aggregation) and a standalone Go core engine via gRPC to isolate heavy graph computations from business logic.",
      "Scrapy ETL pipelines aggregating ~1.5M POIs and ~70K boundaries (Overture Maps, Overpass/OSM, BIG, Pertamina); fuzzy autocomplete with bounded PostGIS strategies (ST_Expand + GiST).",
      "Replaced slow polygon intersection with Uber H3 hexagonal indexing — O(1) cell lookup for instant driver-to-job proximity matching.",
      "OSRM configured with Multi-Level Dijkstra for dynamic toll-road weighting; reused Go JSON decoders and slice buffers via sync.Pool to minimize GC latency spikes.",
    ],
    link: { label: "WEBSITE (OPS PRIVATE)", href: "https://www.rajaderek.com/" },
  },
  {
    id: "aiavatar",
    index: "04",
    collection: "featured",
    name: "AI AVATAR UNITY",
    tag: "End-to-End AI & Real-Time Interactive System.",
    desc: "Real-time AI avatar application combining a Unity client with a containerized voice-processing backend.",
    role: "UNITY & AI SYSTEMS ENGINEER",
    status: "INTERACTIVE SYSTEM",
    type: "INTERACTIVE SYSTEM",
    stack: [
      "UNITY",
      "C#",
      "WEBSOCKET",
      "DOCKER",
      "STT",
      "LLM",
      "TTS",
      "OCULUS LIPSYNC",
      "METAPERSON",
    ],
    highlights: [
      "Voice Pipeline: Implemented a voice pipeline connecting speech recognition, LLM inference, and speech synthesis for real-time conversational interaction.",
      "Avatar & Lip-Sync Animation: Integrated MetaPerson avatar and Oculus LipSync to translate generated audio into real-time facial and lip-sync animation.",
      "Real-Time Communication: Connected Unity to backend AI services through WebSocket-based real-time communication.",
    ],
  },
  {
    id: "genset",
    index: "05",
    collection: "featured",
    name: "GENSET MANAGEMENT",
    tag: "Enterprise equipment rental & field maintenance backend.",
    desc: "Equipment rental and field maintenance logistics platform coordinating field crews and administration across distributed workers.",
    role: "BACKEND ENGINEER",
    status: "PRIVATE / PRODUCTION SYSTEM",
    type: "DISTRIBUTED BACKEND",
    stack: [
      "NODE.JS",
      "TYPESCRIPT",
      "HONO.JS",
      "DRIZZLE ORM",
      "POSTGRESQL",
      "REDIS",
      "BULLMQ",
      "AWS S3",
      "NX",
    ],
    highlights: [
      "Hexagonal architecture in an NX monorepo — isolated domain rules with dependency injection (tsyringe) and shared type-safe Zod contracts across client and server.",
      "Asynchronous job pipeline decoupling PDF BAST generation (digital e-signatures), FCM push alerts and XLSX financial exports using BullMQ & Redis.",
    ],
  },
  {
    id: "casanela",
    index: "06",
    collection: "featured",
    name: "CASANELA VILLA API",
    tag: "High-throughput reservation engine.",
    desc: "Fast booking engine with dynamic pricing calculations and real-time OTA calendar synchronization.",
    role: "BACKEND ENGINEER",
    status: "PRIVATE / PRODUCTION SYSTEM",
    type: "BOOKING ENGINE",
    stack: [
      "BUN",
      "TYPESCRIPT",
      "HONO.JS",
      "DRIZZLE ORM",
      "POSTGRESQL",
      "REDIS",
      "BULLMQ",
      "AWS S3",
    ],
    highlights: [
      "Built on Bun + Hono.js for minimal routing overhead and high concurrent request capacity.",
      "Automated two-way OTA channel synchronization (HotelMu) and booking timeout management via BullMQ queues.",
      "S3 Presigned URL workflows for direct media uploads, bypassing backend proxy bottlenecks.",
    ],
    link: { label: "LIVE", href: "https://casanelavilla.com/" },
  },
  {
    id: "llmrouter",
    index: "07",
    collection: "featured",
    name: "LLM INTENT ROUTER",
    tag: "Intelligent model orchestration layer.",
    desc: "Orchestration layer intercepting user queries and dynamically routing them across model tiers to balance cost against latency.",
    role: "ML SYSTEMS & BACKEND ARCHITECTURE",
    status: "PRIVATE RESEARCH",
    type: "ML / ORCHESTRATION",
    stack: ["PYTHON", "PYTORCH", "DISTILBERT", "TRANSFORMERS", "FASTAPI"],
    highlights: [
      "Fine-tuned a multilingual DistilBERT model across 5 orthogonal dimensions (task, sub-task, tool, difficulty, execution mode).",
      "State-machine fallbacks and weighted soft-scoring route routine tasks to cheap models while complex tasks reach frontier LLMs.",
    ],
  },
];

/* -------------------------------- archive -------------------------------- */

export const ARCHIVE: Project[] = [
  {
    id: "pdfengine",
    index: "A",
    collection: "archive",
    name: "DYNAMIC PDF ENGINE",
    tag: "Quotation & contract generator.",
    desc: "Scalable object-oriented PDF generation engine for enterprise quotations, MAP proposals and LCC contracts.",
    role: "BACKEND ENGINEER",
    status: "PRIVATE / PRODUCTION SYSTEM",
    type: "DOCUMENT ENGINE",
    stack: ["TYPESCRIPT", "NODE.JS", "JSPDF", "AUTOTABLE", "QRCODE"],
    highlights: [
      "OOP template hierarchy encapsulating A4 pagination, custom font injection and digital signature alignment.",
      "Multi-tenant client sub-templates (Djarum, Gudang Garam, BJB, Mobiletron) with custom layouts and rules.",
      "Responsive auto-tables, terbilang currency formatting, dynamic QR verification and asset compression.",
    ],
  },
  {
    id: "gephyrion",
    index: "B",
    collection: "archive",
    name: "GEPHYRION",
    tag: "Immersive room installation.",
    desc: "A web-based interface wired to a Unity-powered projection system — user choices are transmitted in real time to project a character inside a physical room. Built the website interface, backend logic and the Unity-side visualization.",
    role: "WEB · BACKEND · UNITY",
    status: "INSTALLATION",
    type: "INTERACTIVE INSTALLATION",
    stack: ["UNITY", "C#", "LARAVEL", "PHP", "MYSQL", "WEBSOCKET"],
    highlights: [
      "Realtime bridge between web input and Unity projection via WebSockets.",
      "End-to-end ownership: site interface, backend logic and Unity-side rendering.",
    ],
  },
  {
    id: "disasterroom",
    index: "C",
    collection: "archive",
    name: "DISASTER ROOM",
    tag: "Gamified museum exhibit.",
    desc: "Interactive wall installation and floor projection for the Disaster Room exhibit at Museum Geologi Bandung — Unity, LiDAR and projector mapping creating a real-time educational experience about natural disasters in Indonesia.",
    role: "UNITY DEVELOPER",
    status: "INSTALLATION",
    type: "XR / LIDAR",
    stack: ["UNITY", "C#", "LIDAR", "OSC", "LAN"],
    highlights: [
      "LiDAR-driven interaction mapped onto projector surfaces in real time.",
      "Educational gamification about Indonesian natural disasters.",
    ],
    link: {
      label: "WATCH DEMO ↗",
      href: "https://drive.google.com/file/d/1cZP6pzpNJWETzoOTkOpkZI3qRfvd0RzO/view?usp=drive_link",
    },
  },
  {
    id: "eldoria",
    index: "D",
    collection: "archive",
    name: "THE SEARCH OF ELDORIA",
    tag: "2D top-down action-adventure game.",
    desc: "Final project for Game Programming — a lone warrior exploring a mystical forest with real-time combat and NPC interaction. Pixel-art visuals focused on exploration, progression and strategic action.",
    role: "GAME PROGRAMMER",
    status: "PLAYABLE — ITCH.IO",
    type: "GAME",
    stack: ["UNITY", "C#"],
    highlights: [
      "Real-time combat, NPC interaction and progression systems in Unity.",
    ],
    link: {
      label: "PLAY ON ITCH.IO ↗",
      href: "https://andimuchlas.itch.io/the-search-of-eldoria",
    },
  },
  {
    id: "radarharga",
    index: "E",
    collection: "archive",
    name: "RADAR HARGA",
    tag: "E-commerce price intelligence & merchant margin hub.",
    desc: "Dual-portal B2C price radar and B2B merchant fee/margin calculator for major Indonesian marketplaces.",
    role: "FULL-STACK ENGINEER",
    status: "LIVE",
    type: "FULL-STACK WEB",
    stack: ["NEXT.JS", "TYPESCRIPT", "POSTGRESQL", "DRIZZLE ORM", "VITEST"],
    highlights: [
      "Integer-based stepwise fee calculations with 28/28 Vitest unit tests.",
      "Bot-filtered click tracking and 94%+ SEO audit score with JSON-LD.",
    ],
    link: { label: "LIVE", href: "https://www.radarharga.shop" },
  },
];

export const ALL_PROJECTS: Project[] = [...FEATURED, ...ARCHIVE];

export const findProject = (id: string) =>
  ALL_PROJECTS.find((p) => p.id === id);

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  type: string;
  summary: string;
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "PT LUWES INOVASI MANDIRI",
    role: "Full-Stack Engineer (Web & Mobile)",
    period: "OCT 2026 – PRESENT",
    type: "FULL-TIME",
    summary:
      "Building two location-based products end-to-end across Next.js, NestJS, PostGIS, and Flutter: GoAgri (plantation platform) and Luwes Station (weather station & flood early-warning system).",
  },
  {
    company: "MOLCA TEKNOLOGI NUSANTARA",
    role: "Interactive Software Engineer",
    period: "JUN 2026 – SEP 2026",
    type: "REMOTE CONTRACT",
    summary:
      "Developed modular interactive simulation systems in C# (Unity) with decoupled component architecture and optimized runtime memory/frame loops.",
  },
  {
    company: "PT LINTAS CAKRA CIPTA",
    role: "Software Engineer (Backend & Web Systems)",
    period: "SEP 2025 – OCT 2026",
    type: "FULL-TIME",
    summary:
      "Engineered Go/TypeScript backend services, optimized PostGIS spatial queries sustaining sub-second SLAs, and integrated interactive Leaflet mapping apps.",
  },
  {
    company: "AUTOMATA VISUAL",
    role: "Software Engineer (IoT & Interactive Systems)",
    period: "SEP 2024 – FEB 2025",
    type: "PROJECT CONTRACT",
    summary:
      "Built an IoT interactive display at the Disaster Room of Geological Museum Bandung, turning raw LiDAR telemetry into real-time C# touch detection.",
  },
  {
    company: "UVISUAL STUDIO",
    role: "Software Engineer (Web & Interactive Systems)",
    period: "AUG 2023 – SEP 2024",
    type: "FREELANCE",
    summary:
      "Built Gephyrion, a full-stack real-time platform linking a PHP/MySQL web app with multi-projector Unity displays via WebSockets at 60 FPS.",
  },
];

/* -------------------------------- toolbox -------------------------------- */

export type Tech = {
  name: string;
  desc: string;
  projects: string[];
};

export const TECHS: Tech[] = [
  { name: "NEXT.JS", desc: "App Router web platforms, BFF proxies & PWA frontends.", projects: ["GOAGRI", "LUWES STATION", "RADAR HARGA"] },
  { name: "FLUTTER", desc: "Cross-platform mobile apps with 120Hz performance & native maps.", projects: ["GOAGRI", "LUWES STATION"] },
  { name: "NESTJS", desc: "Modular TypeScript APIs on Fastify with Kysely & PostGIS.", projects: ["GOAGRI", "LUWES STATION"] },
  { name: "GO", desc: "Core engine services, graph computation & low-latency workers.", projects: ["RAJADEREK"] },
  { name: "TYPESCRIPT", desc: "End-to-end type-safe gateways, services & web apps.", projects: ["GOAGRI", "LUWES STATION", "RAJADEREK", "GENSET", "CASANELA"] },
  { name: "POSTGIS", desc: "Spatial source of truth with bounded GiST strategies.", projects: ["GOAGRI", "LUWES STATION", "RAJADEREK"] },
  { name: "TIMESCALEDB", desc: "Time-series sensor telemetry & hypertables for weather stations.", projects: ["LUWES STATION"] },
  { name: "UBER H3", desc: "O(1) hexagonal proximity indexing.", projects: ["RAJADEREK"] },
  { name: "OSRM", desc: "Self-hosted routing with Multi-Level Dijkstra.", projects: ["RAJADEREK"] },
  { name: "GRPC", desc: "Typed transport between gateway and core engine.", projects: ["RAJADEREK"] },
  { name: "BUN", desc: "High-performance HTTP runtime for hot paths.", projects: ["CASANELA"] },
  { name: "HONO.JS", desc: "Ultrafast HTTP framework of choice.", projects: ["GENSET", "CASANELA"] },
  { name: "PYTHON", desc: "Spatial ETL, scraping & ML tooling.", projects: ["RAJADEREK", "LLM ROUTER"] },
  { name: "NATS", desc: "Lightweight messaging backbone.", projects: ["RAJADEREK"] },
  { name: "BULLMQ", desc: "Distributed job pipelines on Redis.", projects: ["GENSET", "CASANELA"] },
  { name: "REDIS", desc: "Cache, queues and proximity state.", projects: ["GOAGRI", "RAJADEREK", "GENSET", "CASANELA"] },
  { name: "KUBERNETES", desc: "Orchestrating production workloads.", projects: ["RAJADEREK"] },
  { name: "AWS", desc: "S3 presigned flows & cloud infrastructure.", projects: ["GENSET", "CASANELA"] },
  { name: "UNITY", desc: "Games, XR and realtime installations.", projects: ["AI AVATAR UNITY", "GEPHYRION", "ELDORIA"] },
  { name: "DOCKER", desc: "Containerized backend & AI services.", projects: ["GOAGRI", "LUWES STATION", "AI AVATAR UNITY"] },
  { name: "LLM ORCHESTRATION", desc: "RAG streaming, model routing & agentic workflows.", projects: ["GOAGRI", "LLM ROUTER"] },
];

export type Cert = { name: string; href: string };

export const CERTS: Cert[] = [
  {
    name: "AWS CLOUD PRACTITIONER",
    href: "https://www.credly.com/badges/55f7f23f-acc6-40f1-a0cd-a3cb70e5db8e/public_url",
  },
  {
    name: "AWS RE/START GRADUATE",
    href: "https://www.credly.com/badges/210e19f0-0fb8-4055-b241-20978744c489/public_url",
  },
  {
    name: "KUBERNETES ON GOOGLE CLOUD",
    href: "https://www.credly.com/badges/670ec7bf-3fdc-4e4c-bd24-0aa304ffadf2",
  },
  {
    name: "UNITY ASSOCIATE: GAME DEV",
    href: "https://www.credly.com/badges/f94769f0-1891-429e-93e4-8d156ccca072",
  },
];
