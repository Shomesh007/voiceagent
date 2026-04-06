# Architecture

## System Overview

```
Browser (React App)
    │
    ├── Vapi Web SDK ──────────────► Vapi Cloud
    │   (mic/speaker)                    │
    │                               ElevenLabs Voice
    │                               AI Assistant (Maya)
    │                                    │
    │                               Vapi Webhook ──► Supabase Edge Function
    │                                                      │
    └── Supabase Realtime ◄─────────────────────── leads table
        (live updates)
```

## Data Flow

1. User clicks "Talk to Maya" on dashboard
2. Vapi Web SDK starts a web call using `VITE_VAPI_ASSISTANT_ID`
3. Maya (ElevenLabs voice) greets user and asks qualifying questions
4. Vapi captures: name, budget, location, property_type from conversation
5. On call end, Vapi fires a webhook to Supabase Edge Function
6. Edge Function inserts a new row into `leads` table
7. Supabase Realtime pushes update to all connected dashboard clients
8. New lead appears in table without page refresh

## Component Architecture

```
App
├── Layout (sidebar + topbar)
│   ├── Sidebar (nav links)
│   └── Topbar (agency name, status)
│
├── DashboardPage
│   ├── StatsRow (4 metric cards)
│   ├── LeadsTable (inbound leads)
│   │   └── LeadRow (expandable with transcript)
│   ├── OutboundPanel (follow-up leads list)
│   └── CallWidget (floating or embedded)
│       ├── MicButton (triggers Vapi call)
│       ├── LiveTranscript (scrolling text during call)
│       └── CallStatus (idle / connecting / active / ended)
```

## Key Design Decisions

- **Supabase Realtime over polling** — instant lead appearance is the wow moment
- **Vapi Web SDK** — no phone number needed for demo, works in browser
- **Pre-seeded demo data** — table looks populated even before the live call
- **Floating call widget** — always visible, doesn't disrupt the dashboard view
- **Dark luxury theme** — matches Dubai real estate premium aesthetic
