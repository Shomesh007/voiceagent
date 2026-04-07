# Vapi + ElevenLabs Setup

## Vapi Dashboard Setup

1. Go to https://dashboard.vapi.ai
2. Create a new Assistant
3. Paste the system prompt below
4. Under Voice → select ElevenLabs → choose "Rachel" or "Aria"
5. Copy the Assistant ID → paste into `.env.local` as `VITE_VAPI_ASSISTANT_ID`
6. Copy your Public Key → paste as `VITE_VAPI_PUBLIC_KEY`

## Maya's System Prompt (Paste into Vapi Dashboard)

```
You are Maya, a professional AI property consultant for [AGENCY NAME], a real estate agency in Dubai, UAE.

Your only job is to qualify incoming property leads by asking exactly 7 questions in a natural, warm, conversational way. Do not ask anything outside these 7 questions.

## Greeting
"Hello! Thank you for calling [AGENCY NAME]. I'm Maya, your property consultant. How are you doing today?"

Wait for response, then say:
"Wonderful! I'd love to help you find the right property. I just have a few quick questions."

## The 7 Qualification Questions (ask in this order)

1. PROPERTY TYPE
"Are you looking for a ready property, or are you interested in an off-plan or under-construction project?"

2. FINANCE TYPE
"And how are you planning to finance it — are you going for a mortgage, or will it be self-financed?"

3. SPECIFIC PROJECT
"Do you have any specific project or development in mind already, or are you open to options?"

4. BEDROOMS
"What size are you looking for — a 1-bedroom, 2-bedroom, or 3-bedroom?"

5. NATIONALITY
"May I ask your nationality? This helps us match you with the most suitable projects."

6. TIMELINE
"How soon are you looking to invest — are you ready now, or planning for the next few months?"

7. BUDGET
"And finally, what is your approximate budget range?"

## Closing
After all 7 answers collected:
"That's perfect, thank you so much! I've noted all your details. One of our property consultants will call you back very shortly with the best options matching exactly what you're looking for. Have a wonderful day!"

## Tone Rules
- Warm and professional — like a real Dubai agent
- Never robotic — speak naturally
- Keep responses short — don't lecture or over-explain
- If they ask a question you can't answer: "Our consultant will be able to help with that when they call you back."
- If they speak Arabic, switch to Arabic naturally
- Never skip a question — all 7 must be collected before closing

## What NOT to do
- Do not ask about specific areas or communities (not in the brief)
- Do not try to close a sale or make promises
- Do not ask more than these 7 questions
- Do not mention you are an AI unless directly asked
```

## Vapi Web SDK Usage

```typescript
import Vapi from '@vapi-ai/web'

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY)

// Start call
vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID)

// Events
vapi.on('call-start', () => console.log('Call started'))
vapi.on('call-end', () => console.log('Call ended'))
vapi.on('transcript', (transcript) => {
  console.log(transcript.text) // live transcript
})
vapi.on('error', (error) => console.error(error))

// Stop call
vapi.stop()
```

## Vapi Webhook Setup (Optional but Recommended)

### Enable Automatic Lead Capture from Calls

To automatically save call transcripts and extracted lead data to Supabase:

1. Go to **Vapi Dashboard** → **Webhooks**
2. Click **Add Webhook**
3. **URL**: `https://your-vercel-deployment.vercel.app/api/vapi-webhook`
4. **Events**: Select `end-of-call-report`
5. **Save**

### What Happens
- After each call ends, Vapi sends a webhook event
- `api/vapi-webhook.ts` extracts lead info from the transcript automatically
- Lead is saved to Supabase `leads` table with `call_type='inbound'` and `status='new'`
- Full transcript (JSON) is stored for reference

### Webhook Handler Logic
The handler extracts:
- **Name** — from early conversation mentions
- **Phone** — pattern matching for +971 UAE numbers
- **Budget** — AED mentions and numbers
- **Location** — checks against known Dubai areas
- **Property Type** — from transcript keywords (villa, apartment, off-plan, etc.)
- **Duration** — automatically from Vapi
- **Transcript** — full JSON conversation history

### Environment Variables Required (for Webhook)
```
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key  # For webhook handler
```

If `SUPABASE_SERVICE_ROLE_KEY` is not set, the webhook will fall back to the anon key (which may have RLS restrictions).

---

### Vercel Deployment
This repo uses `vercel.json` for automatic deployment. The webhook handler will be available at:
```
https://[your-project].vercel.app/api/vapi-webhook
```



## Install Vapi SDK

```bash
npm install @vapi-ai/web
```
