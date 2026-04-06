# Coordination — Session Progress Tracker

## Current Goal
Build a complete demo dashboard for Dubai real estate AI voice agent. Must be ready for client presentation.

## Build Order (follow this sequence)

### Phase 1 — Project Setup ✅ Start here
- [ ] `npm create vite@latest . -- --template react-ts`
- [ ] `npm install @supabase/supabase-js @vapi-ai/web @tanstack/react-query lucide-react`
- [ ] `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
- [ ] Create `.env.local` with all 4 env vars
- [ ] Setup `src/lib/supabase.ts` and `src/lib/vapi.ts`

### Phase 2 — Layout & Shell
- [ ] Dark luxury theme in `tailwind.config.ts` (black/gold palette)
- [ ] `src/components/Layout.tsx` — sidebar + main content area
- [ ] `src/components/Sidebar.tsx` — nav with: Dashboard, Leads, Outbound, Settings
- [ ] `src/components/Topbar.tsx` — agency name + live status dot

### Phase 3 — Dashboard Page
- [ ] `src/features/dashboard/StatsRow.tsx` — 4 cards: Total Leads, Calls Today, Viewings Scheduled, Conversion Rate
- [ ] `src/features/leads/LeadsTable.tsx` — inbound leads with name/budget/location/status/time
- [ ] `src/features/leads/LeadRow.tsx` — expandable row showing transcript
- [ ] `src/features/outbound/OutboundPanel.tsx` — follow-up leads list
- [ ] `src/hooks/useLeads.ts` — fetch leads + Supabase realtime subscription

### Phase 4 — Call Widget (most important)
- [ ] `src/features/call/CallWidget.tsx` — floating bottom-right panel
- [ ] `src/features/call/MicButton.tsx` — pulsing animation when active
- [ ] `src/features/call/LiveTranscript.tsx` — scrolling transcript during call
- [ ] `src/hooks/useVapi.ts` — all Vapi SDK logic, events, state

### Phase 5 — Polish & Deploy
- [ ] Add new lead highlight animation (flash gold when appears)
- [ ] Test full flow: click mic → call → lead appears
- [ ] `vercel deploy` — get shareable URL for presentation

## Status
Starting fresh — Phase 1 not yet begun.

## Notes
- Agency name placeholder: "Skyline Properties" — replace when client confirms
- Demo data already seeded in Supabase (see docs/supabase.md)
- Priority is the call widget working — everything else is secondary
