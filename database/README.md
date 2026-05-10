# Database

Shared Supabase migrations and SQL scripts that aren't tied to a single app. Everything in here runs against the shared project at `ritfwedtjiotfxdmuief.supabase.co`.

- **RecallApp** tables live here (instead of inside LanguageHub) because LanguageHub doesn't query them.
- **AdminDashboard**-only RPCs (`admin_*`, `get_user_stats`) live here because no user-facing app calls them.
- Each app's own schema stays in its repo:
  - LanguageHub-specific tables → `LanguageHub/supabase/migrations/`
  - RecallApp has no app-only schema (everything it needs is below).

## Layout

```
migrations/   -- apply in filename order
queries/      -- ad-hoc SQL for the Supabase SQL editor
```

## Migrations (in order)

| File | Purpose | Used by |
| --- | --- | --- |
| `20260421000000_recall_tables.sql` | Creates `recall_chapters`, `recall_cards`, `recall_progress` with RLS and seed content | RecallApp (reads), AdminDashboard (writes via RPC) |
| `20260421010000_admin_stats_rpc.sql` | `get_user_stats()` — per-user activity aggregates, admin-gated | AdminDashboard |
| `20260422000000_admin_recall_rpcs.sql` | `_assert_admin`, `admin_save_chapter`, `admin_delete_chapter`, `admin_rename_section`, `admin_rename_subject` | AdminDashboard |
| `20260422010000_recall_disabled.sql` | `recall_disabled` table + `admin_set_disabled()` RPC | AdminDashboard (writes), RecallApp (reads to filter hidden sections) |
| `20260422020000_fix_rpc_param_order.sql` | Re-declares the admin RPCs with parameter names in alphabetical order so PostgREST's named-argument lookup resolves them | AdminDashboard |

All admin RPCs are `SECURITY DEFINER` and check `auth.uid()` against the admin email — clients call them with the shared publishable key.

## Queries

| File | Purpose |
| --- | --- |
| `queries/user_stats.sql` | Ad-hoc SQL equivalent of `get_user_stats()` — run in the Supabase SQL editor when you want the report without opening AdminDashboard |

## Applying

Run each migration in the Supabase SQL editor (or via the CLI). Order matters — `fix_rpc_param_order.sql` replaces functions defined in the earlier admin migrations and assumes `_assert_admin` exists (it recreates it defensively, so re-applying is safe).
