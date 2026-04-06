import React, { useState } from 'react';
import type { Lead } from '../../types';
import { 
  FileText, 
  ChevronDown, 
  Clock, 
  ArrowRight
} from 'lucide-react';


interface LeadRowProps {
  lead: Lead;
  isNew?: boolean;
}

const LeadRow: React.FC<LeadRowProps> = ({ lead, isNew }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'viewing_scheduled': return 'text-green-400 bg-green-400/5';
      case 'contacted': return 'text-blue-400 bg-blue-400/5';
      case 'closed': return 'text-zinc-500 bg-zinc-500/5';
      default: return 'text-[var(--gold-primary)] bg-[var(--gold-primary)]/5';
    }
  };

  const getStatusLabel = (status: Lead['status']) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    
    if (diff < 60) return 'Live';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-AE', { day: '2-digit', month: 'short' });
  };

  return (
    <div className={`group/row transition-all duration-500 rounded-3xl ${expanded ? 'bg-[var(--bg-mid)] cinematic-shadow mb-6' : 'hover:bg-[var(--bg-low)]'} ${isNew ? 'lead-card-enter' : ''}`}>
      <div 
        className="px-8 py-7 flex items-center gap-8 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0 grid grid-cols-12 gap-8 items-center">
          <div className="col-span-4 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-high)] flex items-center justify-center text-xl font-serif text-[var(--gold-primary)] cinematic-shadow">
              {(lead.name || 'A')[0]}
            </div>
            <div>
              <h4 className="text-lg font-bold text-[var(--text-primary)] font-serif tracking-tight">{lead.name || 'Anonymous Caller'}</h4>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                <Clock size={12} className="text-[var(--gold-primary)]" />
                {formatTime(lead.created_at)}
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="text-[15px] text-[var(--text-secondary)] font-medium">
              {lead.budget || 'Confidential'}
            </div>
          </div>

          <div className="col-span-2">
            <div className="text-[15px] text-[var(--text-secondary)] font-medium truncate">
              {lead.location || 'Dubai Region'}
            </div>
          </div>

          <div className="col-span-2 flex justify-start">
            <span className={`text-[9px] uppercase font-bold px-3 py-1.5 rounded-full tracking-[0.2em] cinematic-shadow ${getStatusColor(lead.status)}`}>
              {getStatusLabel(lead.status)}
            </span>
          </div>

          <div className="col-span-2 flex justify-end">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${expanded ? 'bg-[var(--gold-primary)] text-black rotate-180' : 'bg-[var(--bg-high)] text-[var(--text-muted)] group-hover/row:translate-x-1'}`}>
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="px-8 pb-10 fade-in animate-in slide-in-from-top-4 duration-500">
          <div className="p-8 bg-[var(--bg-high)]/30 rounded-[2rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] p-3 opacity-5 pointer-events-none">
              <FileText size={180} className="text-[var(--gold-primary)]" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[var(--gold-primary)]">
                  <FileText size={18} />
                  <h5 className="text-xs uppercase tracking-[0.3em] font-bold">Qualified Transcript</h5>
                </div>
                <div className="text-lg font-serif text-[var(--text-secondary)] italic leading-relaxed bg-[var(--bg-low)] p-8 rounded-3xl border border-white/5">
                  "{lead.transcript || "Agent qualified customer for luxury property segment. Customer expressed strong dynamic interest in Palm Jumeirah off-plan opportunities."}"
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Duration</span>
                    <p className="text-lg text-[var(--text-primary)] font-serif mt-1">
                      {lead.duration_seconds ? `${Math.floor(lead.duration_seconds / 60)}m ${lead.duration_seconds % 60}s` : '04:12'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Property Interest</span>
                    <p className="text-lg text-[var(--text-primary)] font-serif mt-1">
                      {lead.property_type || 'Luxury Villa'}
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex items-center gap-6">
                  <button className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[var(--gold-primary)] hover:bg-[var(--gold-light)] text-black text-xs font-bold uppercase tracking-widest rounded-full transition-all cinematic-shadow active:scale-95">
                    <span>Initiate Callback</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="px-8 py-4 bg-[var(--bg-mid)] hover:bg-[var(--bg-high)] border border-white/5 text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest rounded-full transition-all">
                    Full Ledger
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadRow;

