import React from 'react';
import { Bell, Search, User, Globe, Command } from 'lucide-react';

const Topbar: React.FC = () => {
  return (
    <header className="h-24 bg-transparent backdrop-blur-xl flex items-center justify-between px-12 sticky top-0 z-30">
      <div className="flex items-center gap-8 flex-1 max-w-2xl">
        <div className="relative w-full group">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--gold-primary)] transition-colors duration-500" />
          <input 
            type="text" 
            placeholder="Query leads, transcripts or property sectors..."
            className="w-full bg-[var(--bg-mid)]/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[15px] text-[var(--text-primary)] focus:outline-none focus:bg-[var(--bg-mid)]/60 focus:border-[var(--gold-primary)]/20 transition-all duration-500 cinematic-shadow"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-[var(--bg-high)] rounded-lg border border-white/5 opacity-50">
            <Command size={12} className="text-[var(--text-muted)]" />
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="hidden xl:flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-[var(--bg-low)] border border-white/5 cinematic-shadow">
          <Globe size={16} className="text-[var(--gold-primary)]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Market Location</span>
            <span className="text-xs font-semibold text-[var(--text-primary)]">Dubai, UAE · 09:42 AM</span>
          </div>
        </div>

        <button className="relative p-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all duration-500 hover:bg-[var(--bg-low)] rounded-2xl">
          <Bell size={24} />
          <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-[var(--gold-primary)] rounded-full border-2 border-[var(--bg-base)] saif-pulse" />
        </button>
        
        <div className="h-10 w-px bg-white/5" />

        <button className="flex items-center gap-5 pl-2 group">
          <div className="text-right flex flex-col">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.3em]">Management</span>
            <span className="text-base font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-primary)] transition-colors tracking-tight">Admin Vault</span>
          </div>
          <div className="w-14 h-14 rounded-2xl border border-[var(--gold-primary)]/20 p-1 group-hover:border-[var(--gold-primary)]/50 transition-all duration-700 cinematic-shadow group-hover:scale-110">
            <div className="w-full h-full rounded-2xl bg-[var(--bg-high)] flex items-center justify-center text-[var(--gold-primary)] overflow-hidden relative">
              <User size={28} />
              <div className="absolute inset-x-0 bottom-0 h-1 gold-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Topbar;

