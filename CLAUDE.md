# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Root (runs across all apps via Turbo)
```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm preview      # Preview all built apps
```

### Per-app (cd into app directory first)
```bash
pnpm dev          # Vite dev server on port 8080
pnpm build        # Production build
pnpm lint         # ESLint
pnpm storybook    # Storybook on port 6006 (language-hub, poetry-notes only)
pnpm build-storybook
```

### Testing (poetry-notes only)
```bash
pnpm test         # Vitest browser tests via Playwright
```

There is no root-level test command — only `poetry-notes` has a test suite.

## Architecture

This is a **pnpm monorepo** managed by **Turborepo** with three Vite+React apps and one shared UI package.

```
apps/
  language-hub/   — Language learning flashcard app (React 18, SWC, TanStack Query, Recharts)
  recall-app/     — Spaced repetition study app (React 18, SWC)
  poetry-notes/   — Poetry note-taking app (React 19, Tiptap rich text editor)
packages/
  ui/             — @repo/ui shared component library (React 18/19 compatible)
database/         — Shared Supabase migrations and RPC definitions
```

### Shared UI Package (`@repo/ui`)

Exports reusable components (`AppHeroHeader`, `AuthCard`, `SettingsLayout`, `SettingsCard`, `ScholiumLogo`) and custom hooks (`useDarkMode`, `useTourCompleted`). Also exports specialized CSS files: `tokens.css`, `auth-card.css`, `settings-layout.css`, `settings-card.css`. Import as `@repo/ui`.

### Backend & Database

All three apps share a single **Supabase** instance. The `database/` directory contains all migrations (run in order) and PostgreSQL RPC functions. Each app creates its own schema but reads from shared tables (e.g., recall chapters/cards/progress). `language-hub` also runs a local Express 5 server (`server.js`) proxied at `/api` → `localhost:3000` during development.

### Routing & State

All apps use **react-router-dom v6** for SPA routing with `vercel.json` rewrite rules for deployment. Forms use **React Hook Form + Zod**. `language-hub` uses **TanStack Query v5** for server state; the other apps use local React state.

### UI Stack

All apps use **Tailwind CSS** with **shadcn/ui** (Radix UI primitives + CVA). Design tokens are CSS variables defined in `tailwind.config.ts` — look there first when adjusting colors or theming. `recall-app` adds custom purple tokens and keyframe animations. Path alias `@/` maps to `src/` in all apps.

### App-Specific Notes

- **language-hub**: uses `lovable-tagger` in dev for component tagging; has the most complete feature set including Recharts dashboards and Embla Carousel.
- **recall-app**: no ESLint config, no Storybook, no tests — leanest setup.
- **poetry-notes**: uses `@vitejs/plugin-react` (Babel, not SWC), Tiptap editor, Vitest with Storybook addon and Playwright browser provider, and React 19.

### Storybook

`language-hub` and `poetry-notes` have Storybook 10. `poetry-notes` integrates Vitest as a Storybook addon so tests run inside the browser via Playwright.
