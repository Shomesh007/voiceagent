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

export type CallStatus = 'idle' | 'connecting' | 'active' | 'ended'

export interface TranscriptMessage {
  role: 'user' | 'assistant'
  text: string
  timestamp: number
}
