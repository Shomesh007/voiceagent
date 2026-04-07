# Dubai Real Estate AI Voice Agent — Demo Dashboard

A CRM-style demo dashboard that showcases an AI voice agent (Maya) for a Dubai real estate agency. Built to demonstrate to a client how AI can qualify inbound leads, capture their details in real time, and surface them in a live dashboard.

## What This Does

- Client visits the demo URL
- Clicks "Talk to Maya" button
- Browser mic activates — they speak directly with Maya (AI voice agent)
- Maya asks 7 specific qualifying questions:
  1. **Property Type**: Ready vs. Off-plan vs. Under-construction
  2. **Finance Type**: Mortgage vs. Self-financed
  3. **Specific Project**: Any development already in mind
  4. **Bedroom Size**: 1BR, 2BR, or 3BR
  5. **Nationality**: For matching suitable projects
  6. **Timeline**: Ready now vs. next few months
  7. **Budget**: Approximate range
- After the call, the lead appears instantly in the dashboard (Supabase real-time)
- Dashboard also shows pre-seeded leads for demo richness

### New: CRM Outbound Portal

- Agents can open the CRM Portal tab and submit lead details manually
- The app stores the lead in Supabase as `call_type = outbound`
- The app optionally forwards the lead payload to your AI scheduler webhook
- Outbound queue updates live so the team can track dispatch status

## Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS 4.0 |
| Voice AI | Vapi (@vapi-ai/web) |
| Voice | ElevenLabs (Rachel/Aria via Vapi) |
| Database | Supabase (Postgres + Realtime) |
| Hosting | Vercel |

## Setup

1. Copy `.env.local` and fill in keys
2. Run `npm install`
3. Run `npm run dev`

## Environment Variables

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
VITE_VAPI_ASSISTANT_ID=your_vapi_assistant_id
VITE_AI_SCHEDULER_WEBHOOK_URL=optional_webhook_for_outbound_scheduling
```

If `VITE_AI_SCHEDULER_WEBHOOK_URL` is not configured, leads are still saved to CRM and queued for manual outbound follow-up.

## Demo Flow

1. Open dashboard — show pre-seeded leads in the table.
2. Walk through the stats cards (calls today, leads captured, bookings).
3. Click "Talk to Maya" — allow microphone access and speak with the AI.
4. Maya will ask the 7 qualification questions.
5. Watch the lead appear live in the table after the call finishes.
6. Click the lead to expand and show the full transcript.
