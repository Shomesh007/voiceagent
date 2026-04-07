import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead } from '../types'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial fetch
    const fetchLeads = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setLeads(data as Lead[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leads')
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()

    // Real-time subscription
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          setLeads((prev) => [payload.new as Lead, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        (payload) => {
          const updatedLead = payload.new as Lead
          setLeads((prev) =>
            prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { leads, loading, error }
}

export function useLeadStats(leads: Lead[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const callsToday = leads.filter((l) => {
    const created = new Date(l.created_at)
    return created >= today
  }).length

  const viewingsScheduled = leads.filter(
    (l) => l.status === 'viewing_scheduled'
  ).length

  const totalLeads = leads.length

  const conversionRate =
    totalLeads > 0
      ? Math.round((viewingsScheduled / totalLeads) * 100)
      : 0

  return { callsToday, viewingsScheduled, totalLeads, conversionRate }
}
