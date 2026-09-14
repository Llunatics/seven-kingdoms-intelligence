# 👑 Seven Kingdoms Intelligence

> A high-performance, dark-first intelligence and data exploration platform for the universe of George R.R. Martin's *A Song of Ice and Fire* / *Game of Thrones*. Built with Next.js 15, React Flow, Recharts, TypeScript, and Tailwind CSS.

---

## 🏛️ Project Overview

**Seven Kingdoms Intelligence** is a production-grade data intelligence platform designed to explore characters, noble dynasties, chronicle books, relationships, and macro-demographics across Westeros and the Free Cities.

Instead of a simple CRUD API demo, this platform provides an immersive, data-oriented experience with:
- **Command Palette Global Search (`Cmd + K`)** across 2,134 characters, 444 noble houses, and 12 chronicle volumes.
- **Interactive Knowledge & Relationship Graph (`/graph`)** powered by React Flow with custom liquid glass nodes, progressive expansion, and slide-over entity inspector.
- **Side-by-Side Character Comparison Matrix (`/compare`)** evaluating real demographic, heraldic, and screen adaptation metrics without subjective rankings.
- **Macro Data Analytics Dashboard (`/analytics`)** built with Recharts detailing cultural affinities, regional feudal density, and publication chronology.
- **Maester Trivia Trials (`/game`)** with progressive authentic clues based exclusively on canonical lore.
- **Personal Citadel Council (`/favorites`)** with client-side bookmarking, JSON export, and import.
- **Multi-Tiered Caching & Canonical Data Fallback** ensuring 100% data integrity and zero downtime even under network drops or external API timeouts.

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TD
    User(["User Browser"]) -->|HTTP / React 19 UI| App["Next.js App Router"]
    
    subgraph ClientUI ["Client UI Components"]
        Nav["Liquid Glass Navbar & Cmd+K Search"]
        Hero["Hero & World Intel Dashboard"]
        Explorers["Characters / Houses / Books Explorers"]
        GraphView["Interactive Knowledge Graph (React Flow)"]
        CompareView["Side-by-Side Character Comparison"]
        AnalyticsView["Recharts Analytics Dashboard"]
        GameView["Trivia Lore Mini-Game"]
        FavView["Favorites & Citadel Council (LocalStorage)"]
    end

    subgraph ServerLayer ["Server Layer & API Routes"]
        RouteHandlers["Next.js Route Handlers (/api/*)"]
        APIService["Intelligence API Service Layer"]
        CacheLayer[("Tier 1: In-Memory LRU / Tier 2: Redis")]
        DB[("Prisma ORM / PostgreSQL")]
        FallbackEngine["Canonical Dataset Engine (Joakim Skoog Data)"]
    end

    App --> Nav
    App --> Hero
    Explorers -->|HTTP Fetch / API| RouteHandlers
    Nav -->|Search API| RouteHandlers
    GraphView -->|Graph API| RouteHandlers
    AnalyticsView -->|Stats API| RouteHandlers

    RouteHandlers --> APIService
    APIService --> CacheLayer
    APIService -->|External Request (3.5s Timeout)| ExtAPI["An API of Ice and Fire (/api)"]
    APIService -.->|Failover on Timeout / Offline| FallbackEngine
    APIService --> DB
```

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components & Route Handlers) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS with custom Liquid Glass design system & tokens |
| **Network Graph** | `@xyflow/react` (React Flow v12) |
| **Data Analytics** | `recharts` |
| **Icons & Motion** | `lucide-react`, `framer-motion` |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Caching** | Server-side In-Memory LRU Cache + Redis support |
| **Testing** | Vitest, React Testing Library |
| **Containerization** | Docker, Docker Compose |

---

## 🛡️ Data Integrity & Resilience Strategy

The application interfaces directly with **An API of Ice and Fire** (`https://anapioficeandfire.com/api`).
To handle network outages, regional Cloudflare IP drops, or rate limits without fabricating fake data:
1. `IceAndFireClient` queries the remote API with configurable timeout (3.5s) and automated retries.
2. If the external endpoint is unreachable or times out, the service layer seamlessly falls back to the **exact canonical dataset** curated by the API's original author (Joakim Skoog) from `joakimskoog/AnApiOfIceAndFire`.
3. All 2,134 characters, 444 houses, and 12 books maintain identical identifiers, schemas, and relational integrity. No data is made up.

---

## ⚙️ Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seven_kingdoms?schema=public"

# Optional Redis Cache (In-memory LRU cache fallback is active by default)
REDIS_URL="redis://localhost:6379"

# An API of Ice and Fire endpoint
ICE_AND_FIRE_API_URL="https://anapioficeandfire.com/api"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 🚀 Getting Started

### 1. Local Development

```bash
# Clone repository
git clone https://github.com/example/seven-kingdoms-intelligence.git
cd seven-kingdoms-intelligence

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Running Unit Tests

```bash
npm run test
```

### 3. Production Build

```bash
npm run build
npm run start
```

### 4. Running with Docker Compose

```bash
docker-compose up --build
```
This provisions:
- `seven-kingdoms-app`: Next.js web application on port 3000
- `seven-kingdoms-postgres`: PostgreSQL database on port 5432
- `seven-kingdoms-redis`: Redis cache on port 6379

---

## 📂 Project Structure

```
seven-kingdoms-intelligence/
├── prisma/
│   └── schema.prisma         # Prisma database models
├── scripts/
│   ├── fetch-canonical-data.mjs   # Official CSV data ingestion
│   └── build-canonical-dataset.mjs# Dataset normalization & indexing
├── src/
│   ├── app/
│   │   ├── api/              # Route Handlers (/characters, /houses, /books, /graph, etc.)
│   │   ├── characters/       # Character Explorer & [id] Profile
│   │   ├── houses/           # House Explorer & [id] Heraldry
│   │   ├── books/            # Book Explorer & [id] Archive
│   │   ├── graph/            # React Flow Knowledge Graph
│   │   ├── compare/          # Side-by-Side Character Comparison
│   │   ├── analytics/        # Recharts Analytics Dashboard
│   │   ├── game/             # Guess the Character Trivia Game
│   │   ├── favorites/        # Bookmarks Vault
│   │   ├── globals.css       # Liquid Glass Tokens & Custom Utility Classes
│   │   ├── layout.tsx        # Global Layout with Sticky Navbar & Footer
│   │   └── page.tsx          # Homepage Intelligence Dashboard
│   ├── components/
│   │   └── ui/               # Reusable Liquid Glass Cards, Badges, Search, Navbar
│   ├── data/                 # Indexed canonical datasets (books, characters, houses)
│   ├── lib/
│   │   └── cache.ts          # In-Memory LRU Cache with TTL
│   ├── services/
│   │   ├── canonicalData.ts  # In-memory query engine & graph synthesizer
│   │   ├── iceAndFireClient.ts # External API client with failover
│   │   └── intelligenceService.ts # Unified application service layer
│   └── types/
│       └── api.ts            # Strongly typed domain definitions
├── tests/
│   └── unit/                 # Vitest test suites (cache, canonicalData, search)
├── Dockerfile                # Multi-stage production container
├── docker-compose.yml        # App, Postgres, Redis deployment
└── tailwind.config.ts        # Dark-first color system & typography tokens
```

---

## ⚖️ License & Accreditation

- Canonical data sourced from [An API of Ice and Fire](https://anapioficeandfire.com) by Joakim Skoog.
- Game of Thrones / A Song of Ice and Fire lore is copyright George R.R. Martin and HBO.
- Project code is licensed under the [MIT License](LICENSE).
