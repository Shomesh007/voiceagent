# CLAUDE.md

This file guides Claude Code when working in this repository.
See @README.md for full project overview.
See @docs/architecture.md for system design.
See @docs/supabase.md for database schema and queries.
See @docs/vapi.md for Vapi + ElevenLabs integration details.

## Project Overview
AI Voice Agent Demo Dashboard for a Dubai real estate agency.
The product shows a CRM-style dashboard where leads captured by an AI voice agent (Maya) appear in real time after a call. The client can also initiate a live call with Maya directly from the dashboard via browser mic.

## Tech Stack
- React 18 + TypeScript
- Vite (dev server + build)
- Tailwind CSS (utility-first styling — no custom CSS files unless absolutely necessary)
- Supabase (Postgres database + real-time subscriptions)
- Vapi Web SDK (@vapi-ai/web) for browser-based voice calls
- React Query (TanStack Query v5) for data fetching
- React Hook Form for any forms
- Lucide React for icons
- Vercel for deployment

## Commands
- `npm run dev` — Start dev server (http://localhost:5173)
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npx supabase db push` — Push schema migrations

## Directory Structure
- `src/components/` — Reusable UI components
- `src/features/` — Feature modules (leads, calls, dashboard)
- `src/hooks/` — Custom React hooks (useLeads, useVapi, useRealtime)
- `src/lib/` — Supabase client, Vapi client, utility functions
- `src/types/` — TypeScript interfaces and types
- `docs/` — Architecture and integration docs

## Code Conventions
- Always use TypeScript with strict types — no `any`
- Functional components only — no class components
- Custom hooks for all data fetching and business logic
- Keep components under 150 lines — split if larger
- Use Tailwind classes only — no inline styles
- All Supabase calls go through `src/lib/supabase.ts`
- All Vapi logic goes through `src/hooks/useVapi.ts`
- Never hardcode API keys — use `.env.local` variables only

## Environment Variables (never commit)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_VAPI_PUBLIC_KEY=
VITE_VAPI_ASSISTANT_ID=
```

## Important Rules
- NEVER commit `.env.local` or any secrets
- ALWAYS handle loading and error states in UI
- ALWAYS use Supabase real-time for live lead updates
- The call widget must show live transcript during active call
- After a call ends, new lead must appear in the table without page refresh
- UI must look premium — this is a client demo, design matters
- Mobile responsive is nice but desktop-first is priority
