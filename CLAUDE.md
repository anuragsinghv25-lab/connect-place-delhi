@AGENTS.md

# Connect Place Delhi

A walkable, stylised **3D Connaught Place** (Delhi) in the browser where every avatar is a real, logged-in person. Inspired by peopleofbengaluru.com, but live, open to everyone, and location-aware. Not AR: it's a 3D world on the screen.

Full build plan: https://claude.ai/artifact/VyYHSAqAQ6b7RMWvwYj1rV

## Hard rules (never break these)

1. **Location is yes/no only.** GPS answers one question: "inside CP or not?". Coordinates are never stored, logged, broadcast or shown. Only `in_cp` + `expires_at` are saved.
2. **Two signals:** green ring = In CP (verified, expires after 30 min), blue ring = Visiting. An avatar's spot in the 3D world is never its real-world spot.
3. **No PII.** Only Instagram / LinkedIn handles, revealed only after both people accept.
4. **Everything behind RLS.** Every Supabase table has Row Level Security on, with tests for the policies.
5. **3D must run on a mid-range Android phone at 30+ fps.** Instanced meshes for repeats, no photo textures, keep draw calls low.

## Voice: GenZ + Dilli

- All UI copy lives in `src/lib/copy.ts`. Never hard-code strings in components.
- Slangy, Hinglish, meme-aware for vibes ("Scene kya hai, CP?", "No cap", "Aagaye bhai").
- **Plain, clear English for anything about safety, privacy, consent, reporting or money.** Slang never hides what a button does.
- Keep it friendly, never mean, never punching down.

## Stack

- Next.js 16 (App Router, `src/`, Cache Components on). Read `node_modules/next/dist/docs/` before using an API; `middleware` is now `src/proxy.ts`.
- Request-time data (`cookies()`, `getUser()`) must sit inside `<Suspense>`.
- React Three Fiber + drei + three for the world; Zustand for client state.
- Supabase: Auth (Google + magic link), Postgres + RLS, Realtime (Presence + Broadcast), Storage, Edge Functions. Clients in `src/lib/supabase/`.
- Resend is Supabase's custom SMTP (configured in the Supabase dashboard, no code).
- Vercel Hobby hosting; GitHub Actions runs lint + typecheck + build.
- Fonts are self-hosted via npm (`geist`, `@fontsource-variable/bricolage-grotesque`). Don't switch to `next/font/google`.

## Layout

- `src/app/` routes: `/` landing, `/login`, `/auth/callback`, `/auth/signout`, `/adda` (members-only hangout).
- `src/components/world/` 3D scene. `cpLayout.ts` holds CP geometry (blocks A–F inner, G–N outer, radial roads). R1 replaces its numbers with OpenStreetMap data.
- `supabase/` SQL migrations and Edge Functions (from R2 on).

## Workflow

- One GitHub issue per change, on a branch, PR to `main`. Vercel posts a preview link; test it on a phone before merging.
- Before pushing: `npm run lint && npm run typecheck && npm run build`.
