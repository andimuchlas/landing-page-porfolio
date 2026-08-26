/**
 * Central content for the portfolio — projects, toolbox, certifications, links.
 * Sources: github README (featured engineering work) + legacy DOS portfolio.
 */

export const LINKS = {
  email: "andimuchlas156@gmail.com",
  linkedin: "https://www.linkedin.com/in/andi-m-489b61248/",
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
    id: "rajaderek",
    index: "01",
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
  },
  {
    id: "genset",
    index: "02",
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
    index: "03",
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
      "Built on Bun + Hono.js for sub-millisecond route handling and high concurrent request capacity.",
      "Automated two-way OTA channel synchronization (HotelMu) and booking timeout management via BullMQ queues.",
      "S3 Presigned URL workflows for direct media uploads, bypassing backend proxy bottlenecks.",
    ],
  },
  {
    id: "llmrouter",
    index: "04",
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
    id: "chatvibes",
    index: "E",
    collection: "archive",
    name: "CHATVIBES",
    tag: "Realtime group chat app.",
    desc: "Group chat mobile app — register, sign in, join or create chat groups and interact in real time, with intuitive flows and smooth state management.",
    role: "MOBILE DEVELOPER",
    status: "PROTOTYPE",
    type: "MOBILE APP",
    stack: ["FLUTTER", "FIREBASE"],
    highlights: ["Realtime messaging backed by Firebase auth and Firestore."],
  },
  {
    id: "hauntedmansion",
    index: "F",
    collection: "archive",
    name: "HAUNTED MANSION",
    tag: "Horror game prototype.",
    desc: "Prototype horror game made with the Unity engine — atmosphere-first exploration and tension pacing.",
    role: "GAME PROGRAMMER",
    status: "PROTOTYPE",
    type: "GAME",
    stack: ["UNITY", "C#"],
    highlights: ["Prototype built to explore horror pacing and level design."],
  },
];

export const ALL_PROJECTS: Project[] = [...FEATURED, ...ARCHIVE];

export const findProject = (id: string) =>
  ALL_PROJECTS.find((p) => p.id === id);

/* -------------------------------- toolbox -------------------------------- */

export type Tech = {
  name: string;
  desc: string;
  projects: string[];
};

export const TECHS: Tech[] = [
  { name: "GO", desc: "Core engine services, graph computation & low-latency workers.", projects: ["RAJADEREK"] },
  { name: "TYPESCRIPT", desc: "End-to-end type-safe gateways, services & tooling.", projects: ["RAJADEREK", "GENSET", "CASANELA"] },
  { name: "NODE.JS", desc: "API layers and background pipelines.", projects: ["GENSET", "PDF ENGINE"] },
  { name: "BUN", desc: "Sub-millisecond HTTP runtime for hot paths.", projects: ["CASANELA"] },
  { name: "HONO.JS", desc: "Ultrafast HTTP framework of choice.", projects: ["GENSET", "CASANELA"] },
  { name: "PYTHON", desc: "Spatial ETL, scraping & ML tooling.", projects: ["RAJADEREK", "LLM ROUTER"] },
  { name: "POSTGIS", desc: "Spatial source of truth with bounded GiST strategies.", projects: ["RAJADEREK", "CASANELA"] },
  { name: "UBER H3", desc: "O(1) hexagonal proximity indexing.", projects: ["RAJADEREK"] },
  { name: "OSRM", desc: "Self-hosted routing with Multi-Level Dijkstra.", projects: ["RAJADEREK"] },
  { name: "GRPC", desc: "Typed transport between gateway and core engine.", projects: ["RAJADEREK"] },
  { name: "NATS", desc: "Lightweight messaging backbone.", projects: ["RAJADEREK"] },
  { name: "BULLMQ", desc: "Distributed job pipelines on Redis.", projects: ["GENSET", "CASANELA"] },
  { name: "REDIS", desc: "Cache, queues and proximity state.", projects: ["RAJADEREK", "GENSET", "CASANELA"] },
  { name: "KUBERNETES", desc: "Orchestrating production workloads.", projects: ["RAJADEREK"] },
  { name: "AWS", desc: "S3 presigned flows & cloud infrastructure.", projects: ["GENSET", "CASANELA"] },
  { name: "UNITY", desc: "Games, XR and realtime installations.", projects: ["GEPHYRION", "ELDORIA"] },
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
