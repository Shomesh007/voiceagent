# Supabase Setup

## Run this SQL in your Supabase SQL Editor first

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Leads table
create table leads (
  id uuid default gen_random_uuid() primary key,
  name text,
  phone text,
  budget text,
  location text,
  property_type text,
  call_type text default 'inbound', -- 'inbound' or 'outbound'
  status text default 'new', -- 'new', 'contacted', 'viewing_scheduled', 'closed'
  transcript text,
  duration_seconds integer,
  created_at timestamptz default now()
);

-- Enable real-time on leads table
alter publication supabase_realtime add table leads;

-- Insert demo seed data (realistic Saif call transcripts - 2 leads)
insert into leads (name, phone, budget, location, property_type, call_type, status, transcript, duration_seconds, created_at) values
  (
    'Fatima Al Mansouri',
    '+971501234567',
    'AED 2.5M - 4M',
    'Downtown Dubai / Dubai Marina',
    '2BR Apartment',
    'inbound',
    'contacted',
    '[{"role":"assistant","text":"Hello. Welcome to Skyline Properties Dubai. I''m Saif, your senior property consultant. I am so glad to be assisting you today. How is your day going so far?"},{"role":"user","text":"Hi Saif, great thanks for calling. My day is going well."},{"role":"assistant","text":"That is wonderful to hear. We have some truly remarkable opportunities opening up this week. To find your perfect property match, I just need to ask you seven quick qualification questions. Shall we begin?"},{"role":"user","text":"Yes absolutely, let''s go."},{"role":"assistant","text":"Excellent. First, are you looking for a ready-to-move-in property, or would you be interested in our high-yield off-plan and under-construction projects?"},{"role":"user","text":"I''d prefer a ready property, something we can move into soon."},{"role":"assistant","text":"Perfect. Regarding the financing—will you be utilizing a mortgage, or are we looking at a self-financed acquisition?"},{"role":"user","text":"We''ll likely use a mortgage."},{"role":"assistant","text":"Understood. Do you already have a specific luxury development in mind, or are you open to our curated portfolio of premium options?"},{"role":"user","text":"I''ve heard good things about Dubai Marina and Downtown Dubai areas."},{"role":"assistant","text":"Excellent choices. And for the layout—are we looking for a spacious one-bedroom, a two-bedroom, or perhaps a grand three-bedroom residence?"},{"role":"user","text":"Two bedroom would be ideal for us."},{"role":"assistant","text":"Perfect. For our records—may I ask your nationality?"},{"role":"user","text":"I''m Emirati."},{"role":"assistant","text":"Great. And how soon are we looking to secure this investment—are you ready to proceed now, or are we planning for the next sixty to ninety days?"},{"role":"user","text":"Within 30-45 days ideally."},{"role":"assistant","text":"Perfect. And finally, to ensure we target the right tier—what is your approximate budget range for this acquisition?"},{"role":"user","text":"Between 2.5 and 4 million AED."},{"role":"assistant","text":"That is perfect, thank you for those details. I''ve noted everything down. I''m briefing one of our top investment specialists right now—they will call you back very shortly with the absolute best matches currently on the market. Have an incredible day."}]',
    387,
    now() - interval '45 minutes'
  ),
  (
    'James Richardson',
    '+971551234567',
    'AED 1.2M - 2.5M',
    'Dubai Creek Harbour',
    'Off-plan Investment',
    'inbound',
    'new',
    '[{"role":"assistant","text":"Hello. Welcome to Skyline Properties Dubai. I''m Saif, your senior property consultant. I am so glad to be assisting you today. How is your day going so far?"},{"role":"user","text":"Hello Saif, good afternoon. Doing well."},{"role":"assistant","text":"That is wonderful to hear. We have some truly remarkable opportunities opening up this week. To find your perfect property match, I just need to ask you seven quick qualification questions. Shall we begin?"},{"role":"user","text":"Sure, I''m ready."},{"role":"assistant","text":"Excellent. First, are you looking for a ready-to-move-in property, or would you be interested in our high-yield off-plan and under-construction projects?"},{"role":"user","text":"Actually, I''m very interested in off-plan investments. Looking for good capital appreciation."},{"role":"assistant","text":"Excellent choice. High-growth potential indeed. Regarding the financing—will you be utilizing a mortgage, or are we looking at a self-financed acquisition?"},{"role":"user","text":"Self-financed. Cash purchase."},{"role":"assistant","text":"Understood. Do you already have a specific luxury development in mind, or are you open to our curated portfolio of premium options?"},{"role":"user","text":"I''ve been reading about Dubai Creek Harbour. Seems promising."},{"role":"assistant","text":"Outstanding area with tremendous upside. And for the layout—are we looking for a spacious one-bedroom, a two-bedroom, or perhaps a grand three-bedroom residence?"},{"role":"user","text":"One bedroom studio, looking at it as an investment rather than living space."},{"role":"assistant","text":"Smart approach. For our records—may I ask your nationality?"},{"role":"user","text":"British. Been living in Dubai for five years."},{"role":"assistant","text":"Perfect. And how soon are we looking to secure this investment—are you ready to proceed now, or are we planning for the next sixty to ninety days?"},{"role":"user","text":"Ideally in the next 2 weeks. I want to lock in the price before the next phase launches."},{"role":"assistant","text":"Perfect. And finally, to ensure we target the right tier—what is your approximate budget range for this acquisition?"},{"role":"user","text":"Around 1.5 to 2 million AED for this project."},{"role":"assistant","text":"That is perfect, thank you for those details. I''ve noted everything down. I''m briefing one of our top investment specialists right now—they will call you back very shortly with the absolute best matches currently on the market. Have an incredible day."}]',
    421,
    now() - interval '22 minutes'
  );
```

## Update Seed Data (Reset to Fresh Demo)

To replace the current leads with fresh demo data:

```sql
-- Delete all existing leads
delete from leads;

-- Then run the INSERT statement below (see "Insert demo seed data" section)
```

## About the Mock Data

The seeded leads include:
- **Fatima Al Mansouri**: Emirati buyer, looking for 2BR ready apartment in Dubai Marina/Downtown, mortgage, 30-45 day timeline, 2.5-4M AED budget
- **James Richardson**: British expatriate investor, interested in off-plan studio in Dubai Creek Harbour, cash purchase, 2-week timeline, 1.5-2M AED budget

Both transcripts include the full 7-question conversation flow from Saif:
1. Property Type (ready vs off-plan)
2. Finance Type (mortgage vs cash)
3. Specific Project
4. Bedrooms
5. Nationality
6. Timeline
7. Budget

This data structure matches real Vapi call outputs, so you can compare it with live call transcripts.



File: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Real-time Subscription Pattern

```typescript
// In useLeads hook
const channel = supabase
  .channel('leads-changes')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'leads' },
    (payload) => {
      // New lead arrived — add to top of list
      setLeads(prev => [payload.new as Lead, ...prev])
    }
  )
  .subscribe()

// Cleanup
return () => supabase.removeChannel(channel)
```

## Types

```typescript
export interface Lead {
  id: string
  name: string | null
  phone: string | null
  budget: string | null
  location: string | null
  property_type: string | null
  call_type: 'inbound' | 'outbound'
  status: 'new' | 'contacted' | 'viewing_scheduled' | 'closed'
  transcript: string | null
  duration_seconds: number | null
  created_at: string
}
```

## Vapi Webhook → Supabase

After call ends, Vapi sends a webhook. Handle in a Supabase Edge Function or a simple Vercel API route:

```typescript
// api/vapi-webhook.ts (Vercel serverless)
export default async function handler(req, res) {
  const { message } = req.body
  if (message.type === 'end-of-call-report') {
    const { summary, transcript, durationSeconds } = message
    // Parse summary for lead fields (name, budget, location, property_type)
    // Insert into Supabase leads table
    await supabase.from('leads').insert({ ...parsedData, transcript, duration_seconds: durationSeconds })
  }
  res.status(200).json({ ok: true })
}
```
