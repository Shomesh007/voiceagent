import React from 'react';
import type { Lead } from '../../types';
import { PhoneOutgoing, Clock, ArrowRight } from 'lucide-react';

interface OutboundPanelProps {
  leads: Lead[];
}

const OutboundPanel: React.FC<OutboundPanelProps> = ({ leads }) => {
  const topLeads = leads.filter((lead) => lead.call_type === 'outbound').slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
      <div className="space-y-6">
        {topLeads.length === 0 ? (
          <div className="p-8 text-center bg-[var(--bg-low)] rounded-3xl border border-dashed border-white/5">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">Queue Empty</p>
          </div>
        ) : (
          topLeads.map((lead) => (
            <div key={lead.id} className="group flex items-start gap-5 p-6 bg-[var(--bg-mid)] hover:bg-[var(--bg-high)] rounded-3xl transition-all duration-500 border border-white/5 relative overflow-hidden shadow-lg hover:translate-x-2">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--gold-primary)]/5 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-[var(--gold-primary)]/10 transition-colors" />
              
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-high)] flex items-center justify-center text-[var(--gold-primary)] shrink-0">
                <PhoneOutgoing size={20} />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] truncate font-serif">{lead.name || 'Anonymous'}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                    <Clock size={12} />
                    <span>Priority</span>
                  </div>
                  <span className="text-[10px] text-[var(--gold-primary)] font-bold">{lead.budget || '$1M+'}</span>
                </div>
              </div>

              <button className="w-8 h-8 rounded-full bg-[var(--bg-low)] text-[var(--text-muted)] hover:bg-[var(--gold-primary)] hover:text-black flex items-center justify-center transition-all">
                <ArrowRight size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <button className="w-full py-5 rounded-full border border-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-low)] text-[10px] font-bold uppercase tracking-[0.4em] transition-all">
        Expand Full Campaign
      </button>
    </div>
  );
};

export default OutboundPanel;

