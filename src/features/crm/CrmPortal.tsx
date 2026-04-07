import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  CalendarClock,
  CircleCheckBig,
  Loader2,
  Phone,
  PhoneOutgoing,
  Send,
  Sparkles,
  UserRound,
  Waves,
} from 'lucide-react'
import type { Lead } from '../../types'
import { useCrmDispatch } from '../../hooks/useCrmDispatch'
import type { CrmLeadInput, DispatchResult } from '../../hooks/useCrmDispatch'

interface CrmPortalProps {
  leads: Lead[]
}

const initialForm: CrmLeadInput = {
  name: '',
  phone: '',
  budget: '',
  location: '',
  propertyType: '',
  timeline: '',
  preferredCallWindow: '',
  notes: '',
}

const budgetBands = [
  'AED 750K - 1.2M',
  'AED 1.2M - 2.5M',
  'AED 2.5M - 4M',
  'AED 4M+',
]

const propertyTypes = [
  'Studio',
  '1BR Apartment',
  '2BR Apartment',
  '3BR Apartment',
  'Townhouse',
  'Villa',
  'Off-plan Investment',
]

const timelineOptions = ['Immediate', 'Next 30 days', 'Next 90 days', 'Exploring only']

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-AE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const CrmPortal: React.FC<CrmPortalProps> = ({ leads }) => {
  const [form, setForm] = useState<CrmLeadInput>(initialForm)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [lastDispatch, setLastDispatch] = useState<DispatchResult | null>(null)
  const { dispatchLead, status, error } = useCrmDispatch()

  const outboundLeads = useMemo(
    () => leads.filter((lead) => lead.call_type === 'outbound').slice(0, 6),
    [leads]
  )

  const queuedCount = leads.filter(
    (lead) => lead.call_type === 'outbound' && lead.status === 'new'
  ).length

  const dispatchedCount = leads.filter(
    (lead) => lead.call_type === 'outbound' && lead.status !== 'new'
  ).length

  const updateField = (key: keyof CrmLeadInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name || !form.phone || !form.budget || !form.propertyType) {
      setValidationError('Name, phone, budget, and property requirement are mandatory.')
      return
    }

    setValidationError(null)
    const result = await dispatchLead(form)
    if (result) {
      setLastDispatch(result)
      setForm(initialForm)
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden rounded-[2rem] border border-[var(--gold-primary)]/10 bg-[var(--bg-low)] px-8 py-10 cinematic-shadow">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[var(--gold-primary)]/10 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[var(--accent-blue)]/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--gold-primary)]">
              <Sparkles size={14} />
              Send Leads to Saif
            </div>
            <h2 className="text-4xl font-serif font-bold leading-tight text-[var(--text-primary)]">
              Send your customer info to Saif
            </h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Fill in the customer info below. Saif will see it and call them. You can watch everything happen in real time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-2xl border border-white/5 bg-[var(--bg-mid)] p-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Queued</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">{queuedCount}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[var(--bg-mid)] p-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Dispatched</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--gold-primary)]">{dispatchedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <form onSubmit={submitLead} className="space-y-6 rounded-[2rem] border border-white/5 bg-[var(--bg-low)] p-8 cinematic-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif text-[var(--text-primary)]">Add a Lead</h3>
            <span className="rounded-full border border-[var(--gold-primary)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--gold-primary)]">
              Your Form
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Client Name</span>
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[var(--bg-mid)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--gold-primary)]/40 focus:outline-none"
                placeholder="Fatima Al Rahman"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Phone Number</span>
              <input
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[var(--bg-mid)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--gold-primary)]/40 focus:outline-none"
                placeholder="+9715XXXXXXXX"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Budget Band</span>
              <select
                value={form.budget}
                onChange={(event) => updateField('budget', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[var(--bg-mid)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--gold-primary)]/40 focus:outline-none"
              >
                <option value="">Select budget</option>
                {budgetBands.map((band) => (
                  <option key={band} value={band}>
                    {band}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">What Kind of Property?</span>
              <select
                value={form.propertyType}
                onChange={(event) => updateField('propertyType', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[var(--bg-mid)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--gold-primary)]/40 focus:outline-none"
              >
                <option value="">Select type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Preferred Area / Project</span>
              <input
                value={form.location}
                onChange={(event) => updateField('location', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[var(--bg-mid)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--gold-primary)]/40 focus:outline-none"
                placeholder="Dubai Marina / Palm Jumeirah"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">When Do They Want to Buy?</span>
              <select
                value={form.timeline}
                onChange={(event) => updateField('timeline', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[var(--bg-mid)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--gold-primary)]/40 focus:outline-none"
              >
                <option value="">Select timeline</option>
                {timelineOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">When Should Saif Call Them?</span>
              <input
                value={form.preferredCallWindow}
                onChange={(event) => updateField('preferredCallWindow', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[var(--bg-mid)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--gold-primary)]/40 focus:outline-none"
                placeholder="Today 6:00 PM - 8:00 PM"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Agent Notes</span>
              <input
                value={form.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[var(--bg-mid)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--gold-primary)]/40 focus:outline-none"
                placeholder="Client asked for highest ROI inventory"
              />
            </label>
          </div>

          {(validationError || error) && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {validationError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gold-primary)] px-6 py-4 text-xs font-black uppercase tracking-[0.3em] text-black transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {isSubmitting ? 'Sending...' : 'Send to Saif'}
          </button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/5 bg-[var(--bg-low)] p-7 cinematic-shadow">
            <h4 className="mb-5 text-lg font-serif text-[var(--text-primary)]">What Happened</h4>
            {!lastDispatch ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--bg-mid)]/40 p-5 text-sm text-[var(--text-muted)]">
                Fill in the form above and click Send to Saif.
              </div>
            ) : (
              <div className="space-y-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <div className="flex items-start gap-3">
                  <CircleCheckBig size={20} className="mt-0.5 text-emerald-300" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-100">
                      {lastDispatch.lead.name} is ready for Saif to call!
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-emerald-200/90">
                      {lastDispatch.schedulerMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-3 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-[var(--bg-mid)] px-4 py-3">
                <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <CalendarClock size={14} />
                  Call Status
                </span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {lastDispatch?.schedulerTriggered ? 'Ready' : 'Waiting'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[var(--bg-mid)] px-4 py-3">
                <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Waves size={14} />
                  Voice Agent
                </span>
                <span className="font-semibold text-[var(--text-primary)]">Saif</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-[var(--bg-low)] p-7 cinematic-shadow">
            <div className="mb-5 flex items-center justify-between">
              <h4 className="text-lg font-serif text-[var(--text-primary)]">Outbound Queue</h4>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Realtime</span>
            </div>

            <div className="space-y-3">
              {outboundLeads.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-[var(--bg-mid)]/40 px-4 py-5 text-sm text-[var(--text-muted)]">
                  No leads sent yet. When you send a lead, it will show up here.
                </div>
              ) : (
                outboundLeads.map((lead) => (
                  <div key={lead.id} className="rounded-xl border border-white/5 bg-[var(--bg-mid)]/60 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{lead.name || 'Unnamed lead'}</p>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-primary)]">{lead.status}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                      <span className="inline-flex items-center gap-1.5">
                        <PhoneOutgoing size={12} />
                        {lead.budget || 'Budget pending'}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <UserRound size={12} />
                        {lead.location || 'Dubai'}
                      </span>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                      <Phone size={12} />
                      {lead.phone || 'No phone'}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {formatDate(lead.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default CrmPortal
