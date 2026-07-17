---
name: verify
description: Drive language-hub in a real browser to verify a change. Covers the auth-seeding and Supabase-stubbing needed to reach any route without real credentials.
---

# Verifying language-hub

Surface is pixels — drive it with Playwright. `pnpm test` / `check-types` are not verification.

## Launch

```bash
pnpm dev --filter=language-hub   # Vite on :8080
```

`server.js` (Express, :3000) is only needed for `/api/speak`. Skip it unless verifying audio;
`useSpeak` falls back to `window.speechSynthesis` when `/api/speak` is unreachable.

## Two gotchas that will cost you a run each

**1. Every route is auth-gated.** `AuthProvider` redirects to `/signin` when there's no
session, so a bare `page.goto('/study/xyz')` lands on `/signin`. Seed a session into
localStorage before load — supabase-js reads key `sb-<project-ref>-auth-token`, and the ref
is the first hostname label of `VITE_SUPABASE_URL` in `.env` (note the value is quoted):

```js
await ctx.addInitScript(([ref, s]) =>
  localStorage.setItem(`sb-${ref}-auth-token`, JSON.stringify(s)), [REF, session]);
```

`session` needs `expires_at` in the future, or the client tries to refresh over the network.

**2. Playwright matches the LAST registered route first.** Register the `**/rest/v1/**`
catch-all *before* the specific tables, or it swallows them and every query returns `[]` —
which surfaces as a silent `navigate("/")` from the page's error branch, not as an error.

```js
await ctx.route('**/rest/v1/**', (r) => json(r, []));          // first
await ctx.route('**/auth/v1/**', (r) => json(r, session.user));
await ctx.route('**/rest/v1/vocabulary_sets*', (r) => json(r, set));   // after
await ctx.route('**/rest/v1/vocabulary_items*', (r) => json(r, items));
```

**3. Match the shape `.single()` expects, per request — not per table.** `.single()` wants a
bare object; a plain `.select()` wants an array. The same table is read both ways across pages
(`folders` is `.single()` in `Folder` but a list in `Index`), so a table-wide object stub makes
`Index` throw `foldersData.map is not a function` — surfacing only as a "Failed to load
vocabulary sets" toast while the page otherwise renders. Branch on the header the way PostgREST
does:

```js
const single = (r.request().headers()['accept'] || '').includes('vnd.pgrst.object');
return json(r, single ? FOLDER : [FOLDER]);
```

## Locators

The shared `ScholiumNavbar` renders its own `Search a subject…` input, so `page.locator('input')`
is **off by one** on every page. Target by placeholder/role, never by index.

## Scripts

Run drivers from the scratchpad, not the repo. ESM resolves from the script's own location,
so `import 'playwright'` fails there — use `createRequire` against the repo's
`node_modules/.pnpm/playwright@*/node_modules/playwright/index.js`.

## Baselines (from CLAUDE.md — these are pre-existing, not your regression)

`check-types` 23 errors · `eslint` 20 problems. If you see 21/24, you added one.
