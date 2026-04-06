import React from 'react';
import type { Lead } from '../../types';
import LeadRow from './LeadRow';
import { Loader2, Inbox, RefreshCw, Layers } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, loading }) => {
  return (
    <div className="relative">
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[900px]">
          <div className="px-8 py-6 mb-4">
            <div className="grid grid-cols-12 gap-8 items-center border-b border-white/5 pb-4">
              <div className="col-span-4 text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--text-muted)]">Applicant Profile</div>
              <div className="col-span-2 text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--text-muted)]">Capital</div>
              <div className="col-span-2 text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--text-muted)]">Sector</div>
              <div className="col-span-2 text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--text-muted)]">Status</div>
              <div className="col-span-2 text-right">
                <button className="p-2 text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition-colors">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center text-[var(--text-muted)] gap-6">
                <Loader2 size={48} className="animate-spin text-[var(--gold-primary)]/40" />
                <p className="text-xs uppercase tracking-widest font-bold">Synchronizing Intelligence...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center text-[var(--text-muted)] gap-6 italic opacity-50">
                <Inbox size={48} className="text-[var(--bg-high)]" />
                <p className="text-sm font-serif">No elite leads recorded in current session.</p>
              </div>
            ) : (
              leads.map((lead, i) => (
                <LeadRow key={lead.id} lead={lead} isNew={i === 0 && (new Date().getTime() - new Date(lead.created_at).getTime()) < 10000} />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Table Footer */}
      {!loading && leads.length > 0 && (
        <div className="px-8 mt-12 flex items-center justify-between text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
          <div className="flex items-center gap-4">
            <Layers size={14} />
            <p>Vault contains <b>{leads.length}</b> elite records</p>
          </div>
          <div className="flex items-center gap-8">
            <button className="hover:text-[var(--text-primary)] transition-colors cursor-not-allowed opacity-30">Previous Ledger</button>
            <button className="hover:text-[var(--gold-primary)] transition-colors">Next Ledger</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;

