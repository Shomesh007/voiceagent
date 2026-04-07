import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead } from '../types'

const SCHEDULER_WEBHOOK_URL = import.meta.env.VITE_AI_SCHEDULER_WEBHOOK_URL as string | undefined

export interface CrmLeadInput {
  name: string
  phone: string
  budget: string
  location: string
  propertyType: string
  timeline: string
  preferredCallWindow: string
  notes: string
}

export interface DispatchResult {
  lead: Lead
  schedulerTriggered: boolean
  schedulerMessage: string
}

type DispatchStatus = 'idle' | 'submitting' | 'success' | 'error'

interface SchedulerResponse {
  message?: string
  scheduled?: boolean
}

function buildTranscript(input: CrmLeadInput): string {
  return [
    `CRM intake timeline: ${input.timeline}`,
    `Preferred call window: ${input.preferredCallWindow}`,
    `Agent notes: ${input.notes || 'None provided'}`,
    'Source: CRM outbound intake portal',
  ].join(' | ')
}

async function triggerSchedulerWebhook(
  lead: Lead,
  input: CrmLeadInput
): Promise<{ triggered: boolean; message: string }> {
  if (!SCHEDULER_WEBHOOK_URL) {
    return {
      triggered: false,
      message:
        'Lead saved. AI scheduler webhook not configured yet, so this request is queued for manual follow-up.',
    }
  }

  try {
    const response = await fetch(SCHEDULER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'crm-outbound-intake',
        leadId: lead.id,
        lead: {
          name: input.name,
          phone: input.phone,
          budget: input.budget,
          location: input.location,
          propertyType: input.propertyType,
          timeline: input.timeline,
          preferredCallWindow: input.preferredCallWindow,
          notes: input.notes,
        },
      }),
    })

    if (!response.ok) {
      return {
        triggered: false,
        message: `Lead saved. Scheduler returned ${response.status}; review webhook endpoint.`,
      }
    }

    const payload = (await response.json()) as SchedulerResponse
    return {
      triggered: payload.scheduled ?? true,
      message:
        payload.message ||
        'Lead saved and dispatched to AI scheduler. Saif will handle the outbound call flow.',
    }
  } catch {
    return {
      triggered: false,
      message: 'Lead saved, but scheduler webhook could not be reached. Please retry dispatch.',
    }
  }
}

export function useCrmDispatch() {
  const [status, setStatus] = useState<DispatchStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const dispatchLead = async (input: CrmLeadInput): Promise<DispatchResult | null> => {
    setStatus('submitting')
    setError(null)

    try {
      const leadInsert = {
        name: input.name,
        phone: input.phone,
        budget: input.budget,
        location: input.location,
        property_type: input.propertyType,
        call_type: 'outbound' as const,
        status: 'new' as const,
        transcript: buildTranscript(input),
        duration_seconds: null,
      }

      const { data, error: insertError } = await supabase
        .from('leads')
        .insert(leadInsert)
        .select('*')
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      const lead = data as Lead
      const scheduler = await triggerSchedulerWebhook(lead, input)

      if (scheduler.triggered) {
        await supabase
          .from('leads')
          .update({ status: 'contacted' })
          .eq('id', lead.id)

        lead.status = 'contacted'
      }

      setStatus('success')
      return {
        lead,
        schedulerTriggered: scheduler.triggered,
        schedulerMessage: scheduler.message,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to dispatch lead'
      setStatus('error')
      setError(message)
      return null
    }
  }

  return {
    status,
    error,
    dispatchLead,
  }
}
