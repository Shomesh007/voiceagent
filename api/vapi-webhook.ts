import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

/**
 * Vapi Webhook Handler
 * 
 * Receives end-of-call reports from Vapi and saves to Supabase.
 * This is called automatically by Vapi after each call completes.
 * 
 * Configure in Vapi Dashboard:
 * - Settings → Webhooks
 * - Add webhook URL: https://your-domain.vercel.app/api/vapi-webhook
 * - Event: end-of-call-report
 */

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
)

interface VapiCallSummary {
  name?: string
  phone?: string
  budget?: string
  location?: string
  property_type?: string
}

// Simple parsing of Saif's 7 qualification questions from transcript
function extractLeadInfo(messages: Array<{ role: string; text: string }>): VapiCallSummary {
  const lead: VapiCallSummary = {}
  
  const transcript = messages.map((m) => `${m.role}: ${m.text}`).join('\n')
  
  // Extract name (could be mentioned early or in greeting response)
  const nameMatch = transcript.match(/my name is (\w+(?:\s+\w+)?)/i)
  if (nameMatch) lead.name = nameMatch[1]
  
  // Extract phone (format: +971...)
  const phoneMatch = transcript.match(/\+971\d{9,10}/)
  if (phoneMatch) lead.phone = phoneMatch[0]
  
  // Extract budget (AED mentions)
  const budgetMatch = transcript.match(/([0-9,.]+\s*(?:to|-)?\s*[0-9,.]*\s*(?:million|M|K|AED)?)/i)
  if (budgetMatch) lead.budget = budgetMatch[1]
  
  // Extract property type from common mentions
  if (transcript.match(/villa|3-?bedroom|3br|three bedroom/i)) lead.property_type = 'Villa'
  else if (transcript.match(/apartment|1-?bedroom|1br|one bedroom|studio/i)) lead.property_type = '1-3BR Apartment'
  else if (transcript.match(/off-?plan|under.?construction|investment/i)) lead.property_type = 'Off-plan Investment'
  
  // Extract location from common Dubai areas
  const locations = [
    'Dubai Marina',
    'Downtown Dubai',
    'Palm Jumeirah',
    'JBR',
    'JVC',
    'Arabian Ranches',
    'Emirates Hills',
    'Dubai Hills Estate',
    'Dubai Creek Harbour',
    'Jumeirah Beach Residence'
  ]
  
  for (const loc of locations) {
    if (transcript.match(new RegExp(loc, 'i'))) {
      lead.location = loc
      break
    }
  }
  
  return lead
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    const { message } = req.body
    
    if (!message || message.type !== 'end-of-call-report') {
      return res.status(400).json({ error: 'Invalid webhook format' })
    }
    
    const {
      summary,
      transcript: messages,
      durationSeconds,
      assistantId,
    } = message
    
    // Extract lead information from transcript
    const extractedLead = extractLeadInfo(messages)
    
    // Combine with summary data if available
    const leadData = {
      name: extractedLead.name || summary?.name || 'Unknown Lead',
      phone: extractedLead.phone || summary?.phone,
      budget: extractedLead.budget || summary?.budget,
      location: extractedLead.location,
      property_type: extractedLead.property_type,
      call_type: 'inbound',
      status: 'new',
      transcript: JSON.stringify(messages),
      duration_seconds: durationSeconds,
    }
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
    
    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({
        error: 'Failed to save lead',
        details: error.message,
      })
    }
    
    console.log('Lead saved from Vapi webhook:', data)
    
    return res.status(200).json({
      success: true,
      leadId: data?.[0]?.id,
      message: 'Lead captured and saved',
    })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
