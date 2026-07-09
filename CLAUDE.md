# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Root (runs across all apps via Turbo)
```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm check-types  # Typecheck all packages (see "Type checking" below)
pnpm boundaries   # Verify no undeclared cross-package imports
pnpm preview      # Preview all built apps
pnpm test         # Vitest browser tests (language-hub, recall-app, poetry-notes, @repo/ui)
pnpm test:e2e     # Playwright (language-hub, recall-app, poetry-notes)
```

Pass `--filter` to scope any of these to one package, e.g. `pnpm dev --filter=past-papers`.
Running bare `pnpm dev` starts every app at once.

### Dev server ports

| App | Vite | Express |
|---|---|---|
| language-hub | 8080 | 3000 |
| recall-app | 8081 | — |
| poetry-notes | 5173 | — |
| scholium-home | 3030 | — |
| past-papers | 3040 | 3002 (`SERVER_PORT`) |

Storybook runs on 6006 for the apps and 6007 for `@repo/ui`.

### Type checking

`check-types` is **not** wired into `build` — `vite build` never typechecks. Two apps have
known pre-existing errors: **language-hub (23)** and **recall-app (7)**. Everything else is
at zero. If you see different numbers, you changed something.

Most of the recall-app/language-hub errors trace to `.from("scholium_apps")`: that table is
absent from both apps' generated `src/integrations/supabase/types.ts` and from `database/`,
so the typed client resolves the query against the tables it does know and `App.tsx` casts
past the resulting `SelectQueryError` with `as AppLink[]`. Fixing it needs a types regen.

### Known pre-existing failures

Baselines, so you can tell a regression from the status quo:

- `pnpm lint` — **49 problems** (language-hub 20, poetry-notes 18, recall-app 6, past-papers 3, scholium-home 2). `@repo/ui` is clean.
- `pnpm check-types` — **30 errors** (language-hub 23, recall-app 7). Everything else clean.
- `pnpm test` — **2 failures** in recall-app. Run it with `--concurrency=1`: four packages each start a Chromium browser server, and in parallel they contend and flake.

## Architecture

This is a **pnpm monorepo** managed by **Turborepo** with five Vite+React apps and one shared UI package.

```
apps/
  language-hub/   — Language learning flashcard app (React 18, SWC, TanStack Query, Recharts)
  recall-app/     — Spaced repetition study app (React 18, SWC)
  poetry-notes/   — Poetry note-taking app (React 19, Tiptap rich text editor)
  past-papers/    — Past-paper browser/generator (R2-backed PDFs, Express server)
  scholium-home/  — Suite landing page
packages/
  ui/             — @repo/ui shared component library (React 18/19 compatible)
database/         — Shared Supabase migrations and RPC definitions
```

Only `apps/*` and `packages/*` are workspace packages. `database/`, `scripts/`, and
`email-templates/` are not — nothing imports from them.

### Shared UI Package (`@repo/ui`)

Consumed as raw TypeScript source (`exports["."] → ./src/index.ts`); there is no build step.
Exports `AuthCard`, `SettingsLayout`, `SettingsCard`, `ScholiumLogo`, `ScholiumNavbar`,
`ScholiumFooter`, `LegalPage`, `TermsOfService`, `PrivacyPolicy`, `SingleSessionGuard`, the
`SCHOLIUM_HOME_URL` constant, and the hooks `useDarkMode` / `useTourCompleted` (plus
`useTourStyles`). Also exports CSS subpaths: `tokens.css`, `auth-card.css`,
`settings-layout.css`, `settings-card.css`, `scholium-navbar.css`, `legal.css`.

Import only via the declared entrypoints — `pnpm boundaries` fails on deep imports.

### Backend & Database

All five apps share a single **Supabase** instance. The `database/` directory contains all migrations (run in order) and PostgreSQL RPC functions. Each app creates its own schema but reads from shared tables (e.g., recall chapters/cards/progress). `language-hub` runs a local Express 5 server (`server.js`) proxied at `/api` → `localhost:3000`; `past-papers` runs its own on `localhost:3002` (`SERVER_PORT`).

### Routing & State

All apps use **react-router-dom v6** for SPA routing with `vercel.json` rewrite rules for deployment. Forms use **React Hook Form + Zod**. `language-hub` uses **TanStack Query v5** for server state; the other apps use local React state.

### UI Stack

All apps use **Tailwind CSS** with **shadcn/ui** (Radix UI primitives + CVA). Design tokens are CSS variables defined in `tailwind.config.ts` — look there first when adjusting colors or theming. `recall-app` adds custom purple tokens and keyframe animations. Path alias `@/` maps to `src/` in all apps.

### App-Specific Notes

- **language-hub**: uses `lovable-tagger` in dev for component tagging; has the most complete feature set including Recharts dashboards and Embla Carousel.
- **recall-app**: ESLint, Storybook, Vitest, and Playwright — same setup as language-hub.
- **poetry-notes**: uses `@vitejs/plugin-react` (Babel, not SWC), Tiptap editor, Vitest with Storybook addon and Playwright browser provider, and React 19. Its `build` is the only one that typechecks (`tsc -b && vite build`).
- **past-papers** / **scholium-home**: no Storybook, no tests.

### Storybook

`language-hub`, `recall-app`, `poetry-notes`, and `@repo/ui` have Storybook 10, each integrating Vitest as a Storybook addon so tests run inside the browser via Playwright.

On Storybook 10, `@storybook/react` and `@storybook/test` are **not** valid import sources here — neither is a declared dependency. Import `Meta`/`StoryObj` from `@storybook/react-vite` and test helpers from `storybook/test`. `pnpm boundaries` enforces this.
