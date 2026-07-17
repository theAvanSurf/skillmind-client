# SkillMind — Client

The web front end for **SkillMind**, an online learning platform where instructors ("professors") publish video courses — including live streaming and exams — and students browse, enroll, pay, and track their progress. Built with **Next.js 16 (App Router)** and **React 19**.

This app is the UI layer only; it talks to the [SkillMind server](https://github.com/theAvanSurf/skillmind-server) (API Gateway + microservices) for all data, auth, and payments.

## Features

- **Auth & multi-profile accounts** — login/register flow with per-user profiles (similar to streaming-service profile switching): create, select, and edit profiles, plus session/device management.
- **Courses** — browse, search, and filter courses by category; enroll and track progress; view certificates on completion.
- **Video playback** — adaptive streaming via Shaka Player, with a dedicated video-player test route.
- **Professor dashboard** — a separate area for instructors to manage courses, seasons/lessons, exams, students, live streams, and earnings.
- **Payments** — Stripe integration for checkout, subscriptions, billing portal, and Stripe Connect onboarding for professor payouts.
- **Community & resources** — supporting features for discussion and shared learning materials.
- **Recommendations & tracking** — activity tracking feeding a recommendation feed.

## Tech stack

- **Next.js 16** (App Router, Route Groups) + **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Zustand** for client state
- **TanStack React Query** for server-state/data fetching
- **React Hook Form** + **Zod** for forms and validation
- **Axios** for HTTP, with a shared `httpClient` that injects the auth token (from cookies) and active-profile header on every request
- **Stripe.js / React Stripe.js** for payments UI
- **Shaka Player** for video streaming
- **Framer Motion**, **Recharts**, **lucide-react** for UI/animation/charts
- **Vitest** + **Testing Library** for tests
- Package manager: **pnpm** (a `pnpm-workspace.yaml` and `bun.lock` are both present — see [Installing](#installing))

## Project structure

The app follows a feature-based structure under `src/`:

```
src/
├── app/                    # Next.js App Router routes, grouped by area
│   ├── (guest)/             # Login, register (multi-step), public pages
│   ├── (authenticated)/     # Dashboard, courses, my-courses, settings
│   ├── (professor)/         # Professor dashboard, courses, exams, streaming, earnings
│   ├── (profiles)/          # Profile creation/selection/editing
│   └── api/                 # Next.js route handlers (auth, courses, payments, professor, etc.)
├── features/                # Feature modules: auth, courses, professor, profiles,
│                             #   dashboard, community, resources, sessions, tracking, home, layout
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── configurations/           # App config and HTTP client setup
├── lib/                       # Axios instance, Stripe client, utils
├── providers/                # React context/providers
├── schemas/                   # Zod schemas
├── shared/                    # Shared/reusable UI components
├── store/                     # Zustand stores
├── types/                     # Shared TypeScript types
└── utils/                     # Utility functions
```

Each `app/` route group maps to one of the platform's audiences (guest, logged-in student, professor, profile management), while the corresponding business logic and API calls live in `features/`.

## Getting started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (recommended — the project ships a `pnpm-workspace.yaml`)
- A running instance of the [SkillMind server](https://github.com/theAvanSurf/skillmind-server) (or access to a deployed API)

### Installing

```bash
git clone https://github.com/theAvanSurf/skillmind-client.git
cd skillmind-client
pnpm install
```

### Environment variables

Create a `.env.local` file in the project root. Based on `src/configurations/app.config.ts`, the app expects:

```bash
API_BASE_URL=http://localhost:3000/api   # Base URL of the SkillMind API Gateway
APP_NAME=SkillMind
APP_DESCRIPTION=
```

You'll also need a Stripe publishable key for the payment components (check `src/lib/stripe.ts` for the expected variable name) and any other keys referenced by the payment/media routes under `src/app/api/`.

### Running the app

```bash
pnpm dev
```

The dev server runs on **http://localhost:3005** (configured via `next dev -p 3005` in `package.json`).

Other scripts:

```bash
pnpm build       # Production build
pnpm start       # Run the production build
pnpm lint        # ESLint
pnpm test        # Run tests with Vitest (watch mode)
pnpm test:run    # Run tests once
```

## Notes

- Route groups (folders in parentheses like `(guest)`, `(authenticated)`, `(professor)`, `(profiles)`) are Next.js conventions for organizing routes without affecting the URL path.
- The `src/app/api/` folder contains Next.js route handlers that proxy/aggregate calls to the backend — check there first if you're wiring up a new feature to the API.
- No license file is currently included in the repository.
