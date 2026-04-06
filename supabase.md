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

-- Insert demo seed data (pre-populate for presentation)
insert into leads (name, phone, budget, location, property_type, call_type, status, created_at) values
  ('Ahmed Al Mansouri', '+971501234567', 'AED 2.5M - 3M', 'Downtown Dubai', '2BR Apartment', 'inbound', 'viewing_scheduled', now() - interval '2 hours'),
  ('Sarah Johnson', '+971509876543', 'AED 1.8M', 'Dubai Marina', '1BR Apartment', 'inbound', 'contacted', now() - interval '4 hours'),
  ('Raj Patel', '+971551234567', 'AED 4M+', 'Palm Jumeirah', 'Villa', 'inbound', 'new', now() - interval '1 hour'),
  ('Elena Volkova', '+971521234567', 'AED 1.2M', 'JVC', 'Studio', 'outbound', 'contacted', now() - interval '6 hours'),
  ('Mohammed Hassan', '+971561234567', 'AED 5M', 'Emirates Hills', '4BR Villa', 'inbound', 'viewing_scheduled', now() - interval '30 minutes');
```

## Supabase Client Setup

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
